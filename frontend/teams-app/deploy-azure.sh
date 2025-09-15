#!/bin/bash

# Azure Static Web App Deployment Script for Rewind365
# This script creates/updates an Azure Static Web App to host the Teams app

set -e  # Exit on any error

# Configuration
RESOURCE_GROUP="rg-rewind365-webapp"
APP_NAME="rewind365-teams-app"
LOCATION="eastus2"
USE_GITHUB=false  # Set to true if you want to use GitHub integration
REPO_URL="https://github.com/placeholder/rewind365"  # Only used if USE_GITHUB=true
BUILD_PATH="../"  # Path to React app from this script
DIST_PATH="../build"  # Build output directory

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Rewind365 Azure Static Web App Deployment${NC}"
echo "================================================="

# Configuration check
if [ "$USE_GITHUB" = true ]; then
    echo -e "${BLUE}📋 Mode: GitHub Integration${NC}"
    echo -e "   Repository: $REPO_URL"
else
    echo -e "${BLUE}📋 Mode: Manual Deployment${NC}"
    echo -e "   Will deploy build files directly"
fi
echo ""

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}❌ Azure CLI is not installed. Please install it first.${NC}"
    echo "Install from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Check if user is logged in to Azure
if ! az account show &> /dev/null; then
    echo -e "${YELLOW}🔐 Not logged in to Azure. Please log in...${NC}"
    az login
else
    echo -e "${GREEN}✅ Already logged in to Azure${NC}"
    ACCOUNT_NAME=$(az account show --query name -o tsv)
    echo -e "Using account: ${BLUE}$ACCOUNT_NAME${NC}"
fi

# Build the React app
echo -e "${YELLOW}📦 Building React application...${NC}"
cd "$BUILD_PATH"
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json not found. Make sure you're in the right directory.${NC}"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📥 Installing dependencies...${NC}"
    npm install
fi

# Create production build
echo -e "${YELLOW}🏗️  Creating production build...${NC}"
npm run build

# Go back to teams-app directory
cd teams-app

# Update Teams manifest version
echo -e "${YELLOW}📝 Incrementing Teams manifest version...${NC}"
MANIFEST_FILE="manifest.json"
if [ -f "$MANIFEST_FILE" ]; then
    # Get current version
    CURRENT_VERSION=$(grep '"version"' "$MANIFEST_FILE" | head -1 | sed 's/.*"version": *"\([^"]*\)".*/\1/')
    
    # Increment patch version (x.y.z -> x.y.z+1)
    IFS='.' read -ra VERSION_PARTS <<< "$CURRENT_VERSION"
    NEW_PATCH=$((VERSION_PARTS[2] + 1))
    NEW_VERSION="${VERSION_PARTS[0]}.${VERSION_PARTS[1]}.$NEW_PATCH"
    
    # Update the version in manifest
    sed -i "s|\"version\": *\"$CURRENT_VERSION\"|\"version\": \"$NEW_VERSION\"|" "$MANIFEST_FILE"
    
    echo -e "${GREEN}✅ Updated manifest version: $CURRENT_VERSION → $NEW_VERSION${NC}"
else
    echo -e "${YELLOW}⚠️  Teams manifest not found, skipping version update${NC}"
fi

# Check if resource group exists, create if not
echo -e "${YELLOW}🏗️  Checking/creating resource group...${NC}"
if ! az group show --name "$RESOURCE_GROUP" &> /dev/null; then
    echo -e "${BLUE}Creating resource group: $RESOURCE_GROUP${NC}"
    az group create --name "$RESOURCE_GROUP" --location "$LOCATION"
else
    echo -e "${GREEN}✅ Resource group exists: $RESOURCE_GROUP${NC}"
fi

# Check if Static Web App exists
echo -e "${YELLOW}🌐 Checking if Static Web App exists...${NC}"
if az staticwebapp show --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
    echo -e "${YELLOW}🔄 Static Web App exists. Deleting to recreate...${NC}"
    az staticwebapp delete --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --yes
    echo -e "${GREEN}✅ Previous app deleted${NC}"
    
    # Wait a moment for deletion to complete
    sleep 10
fi

# Create new Static Web App
echo -e "${BLUE}🆕 Creating new Static Web App...${NC}"

if [ "$USE_GITHUB" = true ]; then
    echo -e "${YELLOW}📁 Creating with GitHub integration...${NC}"
    az staticwebapp create \
        --name "$APP_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --location "$LOCATION" \
        --source "$REPO_URL" \
        --branch "main" \
        --app-location "/" \
        --output-location "build"
else
    echo -e "${YELLOW}📁 Creating for manual deployment...${NC}"
    az staticwebapp create \
        --name "$APP_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --location "$LOCATION" \
        --sku Free
fi

# Get the URL of the deployed app
echo -e "${YELLOW}🔍 Getting app URL...${NC}"
APP_URL=$(az staticwebapp show --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --query "defaultHostname" -o tsv)
FULL_URL="https://$APP_URL"

echo -e "${GREEN}✅ Static Web App created successfully!${NC}"
echo -e "${BLUE}🌐 App URL: $FULL_URL${NC}"

# Update Teams manifest with new URL
echo -e "${YELLOW}📝 Updating Teams manifest with new URL...${NC}"

# Extract domain from URL (remove https://)
DOMAIN=$(echo "$FULL_URL" | sed 's|https://||')

# Update manifest.json with new URLs
sed -i "s|https://[^/\"]*|$FULL_URL|g" manifest.json
sed -i "s|\"[^\"]*\.ngrok-free\.app\"|\"$DOMAIN\"|g" manifest.json

# Update validDomains array with the new Azure domain
sed -i "s|\"[^\"]*\.azurestaticapps\.net\"|\"$DOMAIN\"|g" manifest.json

# Verify the updates
echo -e "${BLUE}Updated URLs in manifest.json:${NC}"
grep -n "https://" manifest.json || echo "No HTTPS URLs found"
echo -e "${BLUE}Updated validDomains in manifest.json:${NC}"
grep -A 3 "validDomains" manifest.json || echo "validDomains not found in manifest"

# Create updated Teams app package
echo -e "${YELLOW}📦 Creating updated Teams app package...${NC}"

# Verify manifest file exists and has been updated
if [ ! -f "manifest.json" ]; then
    echo -e "${RED}❌ manifest.json not found!${NC}"
    exit 1
fi

# Verify icon files exist
if [ ! -f "color.png" ] || [ ! -f "outline.png" ]; then
    echo -e "${RED}❌ Icon files (color.png, outline.png) not found!${NC}"
    exit 1
fi

# Remove old zip if exists
rm -f rewind365-teams-app-azure.zip

# Create the zip package
zip -r "rewind365-teams-app-azure.zip" manifest.json color.png outline.png

# Verify zip was created successfully
if [ -f "rewind365-teams-app-azure.zip" ]; then
    echo -e "${GREEN}✅ Teams app package created: rewind365-teams-app-azure.zip${NC}"
    
    # Show zip contents for verification
    echo -e "${BLUE}📋 Package contents:${NC}"
    unzip -l rewind365-teams-app-azure.zip
else
    echo -e "${RED}❌ Failed to create Teams app package!${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${BLUE}📋 Summary:${NC}"
echo -e "   Resource Group: ${YELLOW}$RESOURCE_GROUP${NC}"
echo -e "   App Name: ${YELLOW}$APP_NAME${NC}"
echo -e "   App URL: ${YELLOW}$FULL_URL${NC}"
echo -e "   Teams Package: ${YELLOW}rewind365-teams-app-azure.zip${NC}"
echo ""
echo -e "${BLUE}📱 Next steps:${NC}"
echo -e "   1. Upload ${YELLOW}rewind365-teams-app-azure.zip${NC} to Teams"
echo -e "   2. Your app is now hosted permanently on Azure!"
echo -e "   3. You can update the app by running this script again"
echo ""

# Optional: Deploy the build files directly (if we have them)
if [ -d "$DIST_PATH" ] && [ "$USE_GITHUB" = false ]; then
    echo -e "${YELLOW}📤 Deploying build files directly to Azure...${NC}"
    
    # Get deployment token for manual upload
    DEPLOYMENT_TOKEN=$(az staticwebapp secrets list --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --query "properties.apiKey" -o tsv)
    
    if [ ! -z "$DEPLOYMENT_TOKEN" ]; then
        echo -e "${BLUE}🔑 Got deployment token${NC}"
        
        # Install Azure Static Web Apps CLI if not present
        if ! command -v swa &> /dev/null; then
            echo -e "${YELLOW}📥 Installing Azure Static Web Apps CLI...${NC}"
            npm install -g @azure/static-web-apps-cli
        fi
        
        # Deploy the built files - use absolute path and deploy from parent directory
        echo -e "${YELLOW}🚀 Deploying to Azure Static Web Apps...${NC}"
        
        # Get absolute paths
        CURRENT_DIR=$(pwd)
        ABS_DIST_PATH=$(cd "$DIST_PATH" && pwd)
        
        # Change to a safe directory (parent of build folder)
        SAFE_DIR=$(dirname "$ABS_DIST_PATH")
        cd "$SAFE_DIR"
        
        # Deploy using relative path from safe directory
        RELATIVE_BUILD_PATH=$(basename "$ABS_DIST_PATH")
        swa deploy "$RELATIVE_BUILD_PATH" --deployment-token "$DEPLOYMENT_TOKEN" --env production
        
        # Return to original directory
        cd "$CURRENT_DIR"
        
        echo -e "${GREEN}✅ Build files deployed successfully!${NC}"
    else
        echo -e "${YELLOW}⚠️  Could not get deployment token. You can deploy manually:${NC}"
        echo -e "${BLUE}   1. Install SWA CLI: npm install -g @azure/static-web-apps-cli${NC}"
        echo -e "${BLUE}   2. Get deployment token from Azure Portal${NC}"
        echo -e "${BLUE}   3. Run from parent directory: swa deploy build --deployment-token <token>${NC}"
    fi
elif [ -d "$DIST_PATH" ] && [ "$USE_GITHUB" = true ]; then
    echo -e "${BLUE}ℹ️  GitHub integration enabled - files will be deployed via GitHub Actions${NC}"
    echo -e "${BLUE}ℹ️  Build files are ready in: $DIST_PATH${NC}"
    echo -e "${BLUE}ℹ️  Push to your GitHub repo to trigger automatic deployment${NC}"
else
    echo -e "${YELLOW}⚠️  Build directory not found: $DIST_PATH${NC}"
    echo -e "${BLUE}ℹ️  Make sure to run 'npm run build' first${NC}"
fi

echo -e "${GREEN}✨ Script completed!${NC}"