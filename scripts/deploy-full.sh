#!/bin/bash

# Deploy Full Script - Automated deployment with SSL, Nginx, and PM2
# Usage: ./scripts/deploy-full.sh <store_name> <domain> <port> <theme> <project_type>

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if all required parameters are provided
if [ $# -lt 5 ]; then
    print_error "Usage: $0 <store_name> <domain> <port> <theme> <project_type>"
    print_error "Example: $0 drivon drivon.store 7002 bikes bikes"
    exit 1
fi

STORE_NAME=$1
DOMAIN=$2
PORT=$3
THEME=$4
PROJECT_TYPE=$5

print_status "Starting full deployment for $STORE_NAME..."
print_status "Domain: $DOMAIN"
print_status "Port: $PORT"
print_status "Theme: $THEME"
print_status "Project Type: $PROJECT_TYPE"

# Step 1: Set up SSL certificate using Certbot
print_status "Step 1: Setting up SSL certificate for $DOMAIN..."
if sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN; then
    print_success "SSL certificate created successfully"
else
    print_warning "SSL certificate creation failed or already exists"
fi

# Step 2: Read existing Nginx configuration
print_status "Step 2: Reading existing Nginx configuration..."
if [ -f "/etc/nginx/sites-available/fastiptvstronger.com" ]; then
    print_success "Found existing Nginx configuration"
else
    print_error "No existing Nginx configuration found"
    exit 1
fi

# Step 3: Create Nginx configuration for new domain
print_status "Step 3: Creating Nginx configuration for $DOMAIN..."
sudo cp /etc/nginx/sites-available/fastiptvstronger.com /etc/nginx/sites-available/$DOMAIN

# Replace domain names
sudo sed -i "s/fastiptvstronger.com/$DOMAIN/g" /etc/nginx/sites-available/$DOMAIN

# Replace port
sudo sed -i "s/7001/$PORT/g" /etc/nginx/sites-available/$DOMAIN

# Replace SSL certificate paths
sudo sed -i "s|/etc/letsencrypt/live/fastiptvstronger.com|/etc/letsencrypt/live/$DOMAIN|g" /etc/nginx/sites-available/$DOMAIN

print_success "Nginx configuration created for $DOMAIN"

# Step 4: Test Nginx configuration
print_status "Step 4: Testing Nginx configuration..."
if sudo nginx -t; then
    print_success "Nginx configuration test passed"
else
    print_error "Nginx configuration test failed"
    exit 1
fi

# Step 5: Activate Nginx configuration
print_status "Step 5: Activating Nginx configuration..."
sudo ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/$DOMAIN
sudo systemctl reload nginx
print_success "Nginx configuration activated and reloaded"

# Step 6: Deploy the store
print_status "Step 6: Deploying $STORE_NAME store..."
cd /home/mac/aiassistant/website
if npm run deploy $STORE_NAME; then
    print_success "Store deployment completed"
else
    print_error "Store deployment failed"
    exit 1
fi

# Step 7: Update ecosystem.config.cjs
print_status "Step 7: Updating PM2 ecosystem configuration..."
ECOSYSTEM_FILE="/home/mac/aiassistant/website/ecosystem.config.cjs"

# Create a temporary file with the new configuration
cat > /tmp/new_app_config.js << EOF
      {
        name: "$STORE_NAME",
        script: "node",
        args: "-r dotenv/config ./dist/server/entry.mjs",
        env: {
          NODE_ENV: "production",
          PORT: $PORT,
          ENV_FILE: ".env",
          TEMP: "./tmp",
          TMPDIR: "./tmp",
          SESSION_SECRET: "$STORE_NAME-secret-789",
          STORE_ID: "$STORE_NAME",
          THEME: "$THEME",
          PROJECT_TYPE: "$PROJECT_TYPE",
          PUBLIC_SITE_NAME: "$(echo $STORE_NAME | sed 's/.*/\u&/')",
          PUBLIC_STORE_NAME: "$(echo $STORE_NAME | sed 's/.*/\u&/')",
          PUBLIC_STORE_DOMAIN: "$DOMAIN",
          DOMAINE: "https://$DOMAIN",
          PUBLIC_BUSINESS_PHONE: "+1234567890",
          PUBLIC_ENABLE_WHATSAPP: "true"
        },
        cwd: "./stores/$STORE_NAME",
        namespace: "$STORE_NAME",
        instances: 1,
        exec_mode: "fork"
      }
EOF

# Add the new app configuration to ecosystem.config.cjs
if grep -q "name: \"$STORE_NAME\"" $ECOSYSTEM_FILE; then
    print_warning "Configuration for $STORE_NAME already exists in ecosystem.config.cjs"
else
    # Insert the new configuration before the closing bracket
    sed -i '/];/i\      ,' $ECOSYSTEM_FILE
    sed -i '/];/i\      {' $ECOSYSTEM_FILE
    sed -i '/];/i\        name: "'$STORE_NAME'",' $ECOSYSTEM_FILE
    sed -i '/];/i\        script: "node",' $ECOSYSTEM_FILE
    sed -i '/];/i\        args: "-r dotenv/config ./dist/server/entry.mjs",' $ECOSYSTEM_FILE
    sed -i '/];/i\        env: {' $ECOSYSTEM_FILE
    sed -i '/];/i\          NODE_ENV: "production",' $ECOSYSTEM_FILE
    sed -i '/];/i\          PORT: '$PORT',' $ECOSYSTEM_FILE
    sed -i '/];/i\          ENV_FILE: ".env",' $ECOSYSTEM_FILE
    sed -i '/];/i\          TEMP: "./tmp",' $ECOSYSTEM_FILE
    sed -i '/];/i\          TMPDIR: "./tmp",' $ECOSYSTEM_FILE
    sed -i '/];/i\          SESSION_SECRET: "'$STORE_NAME'-secret-789",' $ECOSYSTEM_FILE
    sed -i '/];/i\          STORE_ID: "'$STORE_NAME'",' $ECOSYSTEM_FILE
    sed -i '/];/i\          THEME: "'$THEME'",' $ECOSYSTEM_FILE
    sed -i '/];/i\          PROJECT_TYPE: "'$PROJECT_TYPE'",' $ECOSYSTEM_FILE
    sed -i '/];/i\          PUBLIC_SITE_NAME: "'$(echo $STORE_NAME | sed 's/.*/\u&/')'",' $ECOSYSTEM_FILE
    sed -i '/];/i\          PUBLIC_STORE_NAME: "'$(echo $STORE_NAME | sed 's/.*/\u&/')'",' $ECOSYSTEM_FILE
    sed -i '/];/i\          PUBLIC_STORE_DOMAIN: "'$DOMAIN'",' $ECOSYSTEM_FILE
    sed -i '/];/i\          DOMAINE: "https://'$DOMAIN'",' $ECOSYSTEM_FILE
    sed -i '/];/i\          PUBLIC_BUSINESS_PHONE: "+1234567890",' $ECOSYSTEM_FILE
    sed -i '/];/i\          PUBLIC_ENABLE_WHATSAPP: "true"' $ECOSYSTEM_FILE
    sed -i '/];/i\        },' $ECOSYSTEM_FILE
    sed -i '/];/i\        cwd: "./stores/'$STORE_NAME'",' $ECOSYSTEM_FILE
    sed -i '/];/i\        namespace: "'$STORE_NAME'",' $ECOSYSTEM_FILE
    sed -i '/];/i\        instances: 1,' $ECOSYSTEM_FILE
    sed -i '/];/i\        exec_mode: "fork"' $ECOSYSTEM_FILE
    sed -i '/];/i\      }' $ECOSYSTEM_FILE
    
    print_success "PM2 ecosystem configuration updated"
fi

# Step 8: Start PM2 process
print_status "Step 8: Starting PM2 process for $STORE_NAME..."
if pm2 start ecosystem.config.cjs --only $STORE_NAME; then
    print_success "PM2 process started successfully"
else
    print_warning "PM2 process may already be running or failed to start"
fi

# Step 9: Show final status
print_status "Step 9: Final status check..."
pm2 list | grep $STORE_NAME || print_warning "PM2 process not found in list"

print_success "Full deployment completed for $STORE_NAME!"
print_status "Domain: https://$DOMAIN"
print_status "Port: $PORT"
print_status "Store: $STORE_NAME"
print_status "Theme: $THEME"
print_status "Project Type: $PROJECT_TYPE"

echo ""
print_status "To check logs: pm2 logs $STORE_NAME"
print_status "To restart: pm2 restart $STORE_NAME"
print_status "To stop: pm2 stop $STORE_NAME"
