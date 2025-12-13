import { MongoClient } from 'mongodb';
import { createClient } from 'redis';

const MONGODB_URI = 'mongodb+srv://contact:KuaaSfXtBuhGRBly@atlagia.7ioti.mongodb.net/?retryWrites=true&w=majority&appName=atlagia';
const REDIS_URL = 'redis://localhost:6379';

// Cache duration in seconds (1 hour)
const CACHE_DURATION = 3600;

let redisClient;
let mongoClient;

async function connectToRedis() {
  if (!redisClient) {
    redisClient = createClient({
      url: REDIS_URL
    });

    redisClient.on('error', (err) => console.error('Redis Client Error:', err));
    await redisClient.connect();
    console.log('📊 Redis: Connected successfully');
  }
  return redisClient;
}

async function connectToDatabase() {
  if (!mongoClient) {
    mongoClient = new MongoClient(MONGODB_URI);
    await mongoClient.connect();
    console.log('📊 MongoDB: Connected successfully');
  }
  return mongoClient;
}

export async function getServiceData(serviceType, language) {
  try {
    // 1. Try Redis first
    const redis = await connectToRedis();
    const cacheKey = `service:${serviceType}:${language}`;
    
    console.log('🔍 Redis: Checking cache for', cacheKey);
    const cachedData = await redis.get(cacheKey);
    
    if (cachedData) {
      console.log('✅ Redis: Cache hit');
      return JSON.parse(cachedData);
    }
    
    console.log('❌ Redis: Cache miss');

    // 2. Try MongoDB if Redis fails
    console.log('🔍 MongoDB: Attempting to fetch data');
    const client = await connectToDatabase();
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
      
      // Cache the MongoDB data in Redis
      await redis.setEx(cacheKey, CACHE_DURATION, JSON.stringify(data.content));
      console.log('💾 Redis: Cached MongoDB data');
      
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
        
        // Clear Redis cache for this service/language
        await clearCache(serviceType, normalizedLanguage);
        
        console.log(`✨ Normalized language: ${doc.language} -> ${normalizedLanguage}`);
      }
    }
    
    console.log('✅ Data normalization complete');
    
  } catch (error) {
    console.error('❌ Normalization Error:', error);
  }
} 