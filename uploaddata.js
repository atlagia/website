import { MongoClient } from 'mongodb';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB connection string from .env
const MONGODB_URI = 'mongodb+srv://contact:KuaaSfXtBuhGRBly@atlagia.7ioti.mongodb.net/?retryWrites=true&w=majority&appName=atlagia';

// Services directory path
const SERVICES_DIR = path.join(__dirname, 'src/themes/saas/data/services');

async function uploadServices() {
  let client;

  try {
    // Connect to MongoDB
    client = await MongoClient.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = client.db('atlagia');

    // Read all service directories
    const serviceDirs = await fs.readdir(SERVICES_DIR);
    
    for (const serviceDir of serviceDirs) {
      const servicePath = path.join(SERVICES_DIR, serviceDir);
      const serviceStats = await fs.stat(servicePath);
      
      if (serviceStats.isDirectory()) {
        // Get service type from directory name and create collection name
        const serviceType = serviceDir.replace(/-/g, '_');
        const collection = db.collection(serviceType);
        
        // Read all language files in the service directory
        const files = await fs.readdir(servicePath);
        const configFiles = files.filter(file => file.endsWith('.json'));
        
        // Read and parse each language file
        for (const file of configFiles) {
          // Extract language code from filename (e.g., "ai_content_en.json" -> "en")
          const langMatch = file.match(/[^_]+_([^\.]+)\.json$/);
          if (!langMatch) continue;
          
          const lang = langMatch[1]; // This will get "en" or "fr" correctly
          const filePath = path.join(servicePath, file);
          const fileContent = await fs.readFile(filePath, 'utf8');
          
          // Create or update language document
          await collection.updateOne(
            { language: lang },
            { 
              $set: {
                language: lang,
                content: JSON.parse(fileContent)
              }
            },
            { upsert: true }
          );
          
          console.log(`Uploaded ${lang} content for service: ${serviceType}`);
        }
      }
    }

    console.log('All services uploaded successfully');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Run the upload script
uploadServices();