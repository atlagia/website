import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..');
const STORES_PATH = path.join(PROJECT_ROOT, 'stores');

// Function to deploy a single store
async function deployStore(storeName) {
  console.log(`\n🚀 Deploying ${storeName}...`);
  
  const storeDir = path.join(STORES_PATH, storeName);
  const envFile = path.join(storeDir, '.env');

  // Validate env file exists
  if (!fs.existsSync(envFile)) {
    console.error(`❌ No .env file found at ${envFile}`);
    return false;
  }

  // Ensure store directory exists
  if (!fs.existsSync(storeDir)) {
    fs.mkdirSync(storeDir, { recursive: true });
  }

  // Create temp directory for the store
  const tmpDir = path.join(storeDir, 'tmp');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }

  console.log(`📁 Using env file: ${envFile}`);

  return new Promise((resolve) => {
    // Build with store's env using spawn instead of exec to avoid memory issues
    const buildProcess = spawn('npm', ['run', 'build'], {
      cwd: PROJECT_ROOT,
      env: { ...process.env, ENV_FILE: envFile },
      stdio: 'inherit' // Stream output directly to console instead of buffering
    });
    
    buildProcess.on('error', (error) => {
      console.error('❌ Build failed:', error);
      resolve(false);
    });
    
    buildProcess.on('exit', (code) => {
      if (code !== 0) {
        console.error(`❌ Build process exited with code ${code}`);
        resolve(false);
        return;
      }
      
      try {
        // Copy dist to store directory
        const distDir = path.join(storeDir, 'dist');
        
        // Remove old dist if exists
        if (fs.existsSync(distDir)) {
          fs.rmSync(distDir, { recursive: true });
        }
        
        // Copy new dist
        fs.cpSync(
          path.join(PROJECT_ROOT, 'dist'), 
          distDir,
          { recursive: true }
        );
        
        console.log(`✅ Deployed ${storeName} successfully to ${storeDir}`);
        resolve(true);
      } catch (copyError) {
        console.error('❌ Error copying dist files:', copyError);
        resolve(false);
      }
    });
  });
}

// Function to deploy all stores
async function deployAllStores() {
  console.log('🚀 Starting deployment of all stores...');
  
  try {
    // Get all directories in stores folder
    const stores = fs.readdirSync(STORES_PATH, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    if (stores.length === 0) {
      console.log('⚠️ No stores found in stores directory');
      process.exit(0);
    }
    
    console.log(`📦 Found ${stores.length} stores: ${stores.join(', ')}`);
    
    const results = [];
    
    // Deploy stores sequentially to avoid resource conflicts
    for (const store of stores) {
      const success = await deployStore(store);
      results.push({ store, success });
    }
    
    // Print summary
    console.log('\n📊 Deployment Summary:');
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`✅ Successfully deployed: ${successful}`);
    if (failed > 0) {
      console.log(`❌ Failed deployments: ${failed}`);
      results.filter(r => !r.success)
        .forEach(r => console.log(`  - ${r.store}`));
    }
    
    // Exit with error if any deployments failed
    process.exit(failed > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('❌ Error deploying all stores:', error);
    process.exit(1);
  }
}

// Main execution
const storeName = process.argv[2]?.toLowerCase();

if (storeName === 'all') {
  deployAllStores();
} else if (storeName) {
  deployStore(storeName).then(success => {
    process.exit(success ? 0 : 1);
  });
} else {
  console.error('❌ Please provide a store name or "all"');
  process.exit(1);
} 