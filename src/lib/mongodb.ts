import { MongoClient } from 'mongodb';

// Environment and store configuration
const getEnvVar = (key: string) => {
  if (typeof window !== 'undefined' && (window as any).__ENV) {
    return (window as any).__ENV[key];
  }
  return import.meta.env[key] || process.env[key];
};

const MONGODB_URI = getEnvVar('MONGODB_URI') || 'mongodb://localhost:27017';
const MASTER_DB = 'atlagia';

// Get store information from environment
const getStoreInfo = () => {
  const storeName = getEnvVar('PUBLIC_BUSINESS_NAME')?.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'default_store';
  const dataType = getEnvVar('DATA_TYPE')?.toLowerCase() || 'shopify';
  return { storeName, dataType };
};

// Connection management
let masterClient: MongoClient | null = null;
const storeClients: Map<string, MongoClient> = new Map();

// Get or create master connection
async function getMasterConnection() {
  try {
    if (!masterClient) {
      masterClient = new MongoClient(MONGODB_URI, {
        maxPoolSize: 10,
        minPoolSize: 5,
        maxIdleTimeMS: 60000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      });
      await masterClient.connect();
      console.log('✅ Connected to Master MongoDB');
    }
    return masterClient;
  } catch (error) {
    console.error('❌ Master MongoDB connection error:', error);
    throw error;
  }
}

// Get store-specific database
async function getStoreDatabase(storeName: string) {
  try {
    // Check existing connection
    if (storeClients.has(storeName)) {
      return storeClients.get(storeName)!.db(storeName);
    }

    // Create new connection
    const client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 5,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
    });
    await client.connect();
    storeClients.set(storeName, client);
    
    // Initialize store in master DB if needed
    const masterClient = await getMasterConnection();
    const masterDB = masterClient.db(MASTER_DB);
    const storesCollection = masterDB.collection('stores');
    
    const storeExists = await storesCollection.findOne({ storeName });
    if (!storeExists) {
      await storesCollection.insertOne({
        storeName,
        createdAt: new Date(),
        dataType: getStoreInfo().dataType,
        status: 'active'
      });
    }

    return client.db(storeName);
  } catch (error) {
    console.error(`❌ Store database error for ${storeName}:`, error);
    throw error;
  }
}

// Main connection function (maintains compatibility with existing code)
export async function connectToDatabase() {
  try {
    const { storeName } = getStoreInfo();
    const db = await getStoreDatabase(storeName);
    return storeClients.get(storeName)!;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

// Get a specific collection with store isolation
export async function getCollection(collectionName: string) {
  try {
    const { storeName } = getStoreInfo();
    const db = await getStoreDatabase(storeName);
    return db.collection(collectionName);
  } catch (error) {
    console.error('Error getting collection:', error);
    throw error;
  }
}

// Clean up connections
export async function closeConnections() {
  try {
    if (masterClient) {
      await masterClient.close();
      masterClient = null;
    }
    
    for (const [storeName, client] of storeClients.entries()) {
      await client.close();
      storeClients.delete(storeName);
    }
  } catch (error) {
    console.error('Error closing connections:', error);
  }
}

// Store management functions
export async function initializeStore() {
  try {
    const { storeName, dataType } = getStoreInfo();
    const db = await getStoreDatabase(storeName);
    
    // Create essential collections
    const collections = [
      'products',
      'categories',
      'orders',
      'customers',
      'settings',
      'cache'
    ];

    for (const collName of collections) {
      if (!(await db.listCollections({ name: collName }).hasNext())) {
        await db.createCollection(collName);
        
        // Create indexes based on collection
        switch (collName) {
          case 'products':
            await db.collection(collName).createIndex({ handle: 1 });
            break;
          case 'cache':
            await db.collection(collName).createIndex({ key: 1 });
            await db.collection(collName).createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 });
            break;
        }
      }
    }

    // Initialize store settings if not exists
    const settings = await db.collection('settings').findOne({});
    if (!settings) {
      await db.collection('settings').insertOne({
        storeName,
        dataType,
        createdAt: new Date(),
        settings: {
          currency: 'USD',
          languages: ['en'],
          defaultLanguage: 'en'
        }
      });
    }

    console.log(`✅ Store ${storeName} initialized successfully`);
    return db;
  } catch (error) {
    console.error('❌ Store initialization error:', error);
    throw error;
  }
}

// Export additional utility functions that might be needed
export async function getStoreSettings() {
  try {
    const { storeName } = getStoreInfo();
    const db = await getStoreDatabase(storeName);
    return db.collection('settings').findOne({});
  } catch (error) {
    console.error('Error getting store settings:', error);
    return null;
  }
} 
