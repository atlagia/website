import { MongoClient } from 'mongodb';
import { createClient } from 'redis';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://contact:KuaaSfXtBuhGRBly@atlagia.7ioti.mongodb.net/?retryWrites=true&w=majority&appName=atlagia';
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Cache duration in seconds (1 hour)
const CACHE_DURATION = 3600;

let redisClient;
let mongoClient;
let isConnecting = false;
let connectionPromise = null;

// Connection options with retry and pooling
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4
};

async function connectToRedis() {
  try {
    if (!redisClient) {
      redisClient = createClient({
        url: REDIS_URL,
        retry_strategy: function(options) {
          if (options.error && options.error.code === 'ECONNREFUSED') {
            // End reconnecting on a specific error
            console.error('Redis connection refused. Continuing without Redis...');
            return new Error('Redis connection refused');
          }
          if (options.total_retry_time > 1000 * 60 * 60) {
            // End reconnecting after 1 hour
            return new Error('Redis retry time exhausted');
          }
          // Reconnect after
          return Math.min(options.attempt * 100, 3000);
        }
      });

      redisClient.on('error', (err) => {
        console.error('Redis Client Error:', err);
        redisClient = null; // Reset client on error
      });

      await redisClient.connect();
      console.log('📊 Redis: Connected successfully');
    }
    return redisClient;
  } catch (error) {
    console.error('Redis connection error:', error);
    redisClient = null;
    return null;
  }
}

async function connectToDatabase() {
  try {
    if (mongoClient?.topology?.isConnected()) {
      return mongoClient;
    }

    if (isConnecting) {
      return await connectionPromise;
    }

    isConnecting = true;
    connectionPromise = new Promise(async (resolve, reject) => {
      try {
        mongoClient = new MongoClient(MONGODB_URI, mongoOptions);
        await mongoClient.connect();
        
        // Add connection event listeners
        mongoClient.on('error', (error) => {
          console.error('MongoDB connection error:', error);
          mongoClient = null;
        });

        mongoClient.on('close', () => {
          console.log('MongoDB connection closed');
          mongoClient = null;
        });

        console.log('📊 MongoDB: Connected successfully');
        isConnecting = false;
        resolve(mongoClient);
      } catch (error) {
        console.error('MongoDB connection error:', error);
        mongoClient = null;
        isConnecting = false;
        reject(error);
      }
    });

    return await connectionPromise;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    mongoClient = null;
    isConnecting = false;
    return null;
  }
}

export async function getServiceData(serviceType, language) {
  try {
    // 1. Try Redis first
    const redis = await connectToRedis();
    const cacheKey = `service:${serviceType}:${language}`;
    
    if (redis) {
      console.log('🔍 Redis: Checking cache for', cacheKey);
      try {
        const cachedData = await redis.get(cacheKey);
        if (cachedData) {
          console.log('✅ Redis: Cache hit');
          return JSON.parse(cachedData);
        }
      } catch (redisError) {
        console.error('Redis error:', redisError);
      }
    }
    
    console.log('❌ Redis: Cache miss or unavailable');

    // 2. Try MongoDB
    console.log('🔍 MongoDB: Attempting to fetch data');
    const client = await connectToDatabase();
    if (!client) {
      console.error('MongoDB connection failed');
      return null;
    }

    const db = client.db('atlagia');
    const collection = db.collection(serviceType);

    const data = await collection.findOne({ 
      $or: [
        { language },
        { language: `content_${language}` }
      ]
    });

    if (data?.content) {
      console.log('✅ MongoDB: Data found');
      
      // Try to cache in Redis if available
      if (redis) {
        try {
          await redis.setEx(cacheKey, CACHE_DURATION, JSON.stringify(data.content));
          console.log('💾 Redis: Cached MongoDB data');
        } catch (redisCacheError) {
          console.error('Redis cache error:', redisCacheError);
        }
      }
      
      return data.content;
    }

    console.log('❌ MongoDB: No data found');
    return null;

  } catch (error) {
    console.error('❌ Service Data Error:', error);
    return null;
  }
}

export async function clearCache(serviceType, language) {
  try {
    const redis = await connectToRedis();
    if (!redis) {
      console.log('Redis not available, no cache to clear');
      return;
    }

    const cacheKey = `service:${serviceType}:${language}`;
    await redis.del(cacheKey);
    console.log('🧹 Redis: Cleared cache for', cacheKey);
  } catch (error) {
    console.error('❌ Cache Clear Error:', error);
  }
}

export async function normalizeServiceData(serviceType) {
  try {
    const client = await connectToDatabase();
    if (!client) {
      console.error('MongoDB connection failed');
      return;
    }

    const db = client.db('atlagia');
    const collection = db.collection(serviceType);

    const docs = await collection.find({}).toArray();
    
    for (const doc of docs) {
      if (doc.language.startsWith('content_')) {
        const normalizedLanguage = doc.language.replace('content_', '');
        
        await collection.updateOne(
          { _id: doc._id },
          { $set: { language: normalizedLanguage } }
        );
        
        // Try to clear Redis cache
        await clearCache(serviceType, normalizedLanguage);
        
        console.log(`✨ Normalized language: ${doc.language} -> ${normalizedLanguage}`);
      }
    }
    
    console.log('✅ Data normalization complete');
    
  } catch (error) {
    console.error('❌ Normalization Error:', error);
  }
}

// Export the connection function for external use
export { connectToDatabase };

// Cleanup function for graceful shutdown
export async function closeConnections() {
  try {
    if (mongoClient) {
      await mongoClient.close();
      console.log('MongoDB connection closed');
    }
    if (redisClient) {
      await redisClient.quit();
      console.log('Redis connection closed');
    }
  } catch (error) {
    console.error('Error closing connections:', error);
  }
} 