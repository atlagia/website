import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Function to get all .env files in the current directory
function getEnvFiles() {
  const files = fs.readdirSync(process.cwd());
  return files.filter(file => file.startsWith('.env.'));
}

// Function to get store name from env file
function getStoreNameFromEnvFile(envFile) {
  return envFile.replace('.env.', '');
}

// Function to get next available port starting from 4321
function getNextAvailablePort(usedPorts) {
  let port = 4321;
  while (usedPorts.includes(port)) {
    port++;
  }
  return port;
}

// Function to check if a port is in use
async function isPortInUse(port) {
  try {
    const net = await import('net');
    return new Promise((resolve) => {
      const server = net.createServer();
      server.once('error', () => resolve(true));
      server.once('listening', () => {
        server.close();
        resolve(false);
      });
      server.listen(port);
    });
  } catch (error) {
    console.error('Error checking port:', error);
    return true;
  }
}

// Function to create default environment variables
function createDefaultEnv(storeName) {
  const defaultEnv = {
    PORT: '4321',
    THEME: 'default',
    PUBLIC_SITE_NAME: storeName,
    NODE_ENV: 'development',
    HOST: '0.0.0.0',
    PROJECT_TYPE: 'digital',
    DATA_TYPE: 'shopify'
  };
  return defaultEnv;
}

// Function to ensure environment file exists with required variables
function ensureEnvFile(storeName) {
  const envFile = `.env.${storeName}`;
  const envPath = path.resolve(process.cwd(), envFile);
  const defaultEnv = createDefaultEnv(storeName);

  let envContent = '';
  let existingEnv = {};

  // Try to read existing env file if it exists
  if (fs.existsSync(envPath)) {
    try {
      existingEnv = dotenv.parse(fs.readFileSync(envPath));
    } catch (error) {
      console.warn(`Warning: Could not parse existing ${envFile}, will create new one`);
    }
  }

  // Merge existing env with defaults
  const finalEnv = { ...defaultEnv, ...existingEnv };

  // Create env content
  Object.entries(finalEnv).forEach(([key, value]) => {
    envContent += `${key}=${value}\n`;
  });

  // Write to file
  fs.writeFileSync(envPath, envContent);
  console.log(`Environment file ${envFile} has been created/updated`);

  return envPath;
}

// Get command line arguments
const args = process.argv.slice(2);
const storeName = args[0];
let customPort = null;
let customHost = null;

// Parse arguments
for (let i = 1; i < args.length; i++) {
  if (args[i] === '--port' && args[i + 1]) {
    customPort = parseInt(args[i + 1]);
    i++; // Skip next argument
  } else if (args[i] === '--host' && args[i + 1]) {
    customHost = args[i + 1];
    i++; // Skip next argument
  } else if (args[i] === '--host') {
    customHost = '0.0.0.0'; // Default to 0.0.0.0 if no host specified
  }
}

if (!storeName) {
  console.error('Please provide a store name');
  console.error('Usage: node dev-store.js <store-name> [--port <port>] [--host [host]]');
  process.exit(1);
}

// Ensure environment file exists with required variables
const envPath = ensureEnvFile(storeName);

// Load the store-specific environment variables
const result = dotenv.config({ 
  path: envPath,
  override: true 
});

if (result.error) {
  console.error('Error loading environment variables:', result.error);
  process.exit(1);
}

// Get all running stores and their ports
const envFiles = getEnvFiles();
const usedPorts = [];

// Check which ports are already in use
for (const file of envFiles) {
  const store = getStoreNameFromEnvFile(file);
  if (store !== storeName) {
    const storeEnv = dotenv.parse(fs.readFileSync(path.resolve(process.cwd(), file)));
    const port = parseInt(storeEnv.PORT || '4321');
    if (await isPortInUse(port)) {
      usedPorts.push(port);
    }
  }
}

// Use custom port if provided, otherwise use the port from the env file or get next available port
const port = customPort || parseInt(process.env.PORT) || getNextAvailablePort(usedPorts);

// Set additional environment variables
process.env.ENV_FILE = `.env.${storeName}`;
process.env.PORT = port.toString();
process.env.STORE_ID = storeName;
process.env.NODE_ENV = 'development';
process.env.HOST = customHost || process.env.HOST || '0.0.0.0';

// Log the environment variables being used
console.log('\nEnvironment Configuration:');
console.log('------------------------');
console.log(`Store Name: ${process.env.PUBLIC_SITE_NAME || storeName}`);
console.log(`Theme: ${process.env.THEME || 'default'}`);
console.log(`Port: ${port}`);
console.log(`Host: ${process.env.HOST}`);
console.log(`Environment File: .env.${storeName}`);
console.log('------------------------\n');

// Spawn the Astro dev process with the environment variables
const astroArgs = ['dev', '--port', port.toString()];
if (process.env.HOST) {
  astroArgs.push('--host', process.env.HOST);
}

const astroDev = spawn('astro', astroArgs, {
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: port.toString(),
    NODE_ENV: 'development',
    HOST: process.env.HOST
  }
});

astroDev.on('error', (err) => {
  console.error('Failed to start Astro dev:', err);
  process.exit(1);
});

// Handle process termination
process.on('SIGINT', () => {
  astroDev.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  astroDev.kill();
  process.exit(0);
}); 
