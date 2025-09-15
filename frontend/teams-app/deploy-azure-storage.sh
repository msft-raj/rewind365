#!/bin/bash

# Azure Storage Static Website Deployment Script for Rewind365
# Faster and cheaper alternative to Static Web Apps

set -e  # Exit on any error

# Configuration
RESOURCE_GROUP="rg-rewind365-storage"
STORAGE_ACCOUNT="rewind365$(date +%s)"  # Unique name with timestamp
LOCATION="eastus2"
BUILD_PATH="../"
DIST_PATH="../build"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Rewind365 Azure Storage Static Website Deployment${NC}"
echo "====================================================="

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}❌ Azure CLI is not installed.${NC}"
    exit 1
fi

# Check login
if ! az account show &> /dev/null; then
    echo -e "${YELLOW}🔐 Logging in to Azure...${NC}"
    az login
fi

# Build the React app
echo -e "${YELLOW}📦 Building React application...${NC}"
cd "$BUILD_PATH"
npm run build
cd teams-app

# Create resource group if it doesn't exist
if ! az group show --name "$RESOURCE_GROUP" &> /dev/null; then
    az group create --name "$RESOURCE_GROUP" --location "$LOCATION"
fi

# Delete old storage account if exists (find by resource group)
OLD_STORAGE=$(az storage account list --resource-group "$RESOURCE_GROUP" --query "[?contains(name, 'rewind365')].name" -o tsv)
if [ ! -z "$OLD_STORAGE" ]; then
    echo -e "${YELLOW}🔄 Deleting old storage account: $OLD_STORAGE${NC}"
    az storage account delete --name "$OLD_STORAGE" --resource-group "$RESOURCE_GROUP" --yes
fi

# Create new storage account
echo -e "${BLUE}🆕 Creating storage account: $STORAGE_ACCOUNT${NC}"
az storage account create \
    --name "$STORAGE_ACCOUNT" \
    --resource-group "$RESOURCE_GROUP" \
    --location "$LOCATION" \
    --sku Standard_LRS \
    --kind StorageV2

# Enable static website hosting
echo -e "${YELLOW}🌐 Enabling static website hosting...${NC}"
az storage blob service-properties update \
    --account-name "$STORAGE_ACCOUNT" \
    --static-website \
    --404-document "index.html" \
    --index-document "index.html"

# Upload build files
echo -e "${YELLOW}📤 Uploading build files...${NC}"
az storage blob upload-batch \
    --account-name "$STORAGE_ACCOUNT" \
    --destination '$web' \
    --source "$DIST_PATH"

# Get the static website URL
APP_URL=$(az storage account show --name "$STORAGE_ACCOUNT" --resource-group "$RESOURCE_GROUP" --query "primaryEndpoints.web" -o tsv)
# Remove trailing slash
APP_URL=${APP_URL%/}

echo -e "${GREEN}✅ Deployment successful!${NC}"
echo -e "${BLUE}🌐 App URL: $APP_URL${NC}"

# Update Teams manifest
echo -e "${YELLOW}📝 Updating Teams manifest...${NC}"
DOMAIN=$(echo "$APP_URL" | sed 's|https://||' | sed 's|/||')

sed -i "s|https://[^/\"]*|$APP_URL|g" manifest.json
sed -i "s|\"[^\"]*\.ngrok-free\.app\"|\"$DOMAIN\"|g" manifest.json
sed -i "s|\"localhost:3000\"|\"$DOMAIN\"|g" manifest.json

# Create Teams app package
echo -e "${YELLOW}📦 Creating updated Teams app package...${NC}"

# Verify required files exist
if [ ! -f "manifest.json" ]; then
    echo -e "${RED}❌ manifest.json not found!${NC}"
    exit 1
fi

if [ ! -f "color.png" ] || [ ! -f "outline.png" ]; then
    echo -e "${RED}❌ Icon files missing!${NC}"
    exit 1
fi

# Remove old zip if exists
rm -f rewind365-teams-app-azure-storage.zip

# Create the zip package
zip -r "rewind365-teams-app-azure-storage.zip" manifest.json color.png outline.png

# Verify zip creation
if [ -f "rewind365-teams-app-azure-storage.zip" ]; then
    echo -e "${GREEN}✅ Teams app package created successfully!${NC}"
    echo -e "${BLUE}📋 Package contents:${NC}"
    unzip -l rewind365-teams-app-azure-storage.zip
else
    echo -e "${RED}❌ Failed to create Teams app package!${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Deployment completed!${NC}"
echo -e "${BLUE}📋 Details:${NC}"
echo -e "   Storage Account: ${YELLOW}$STORAGE_ACCOUNT${NC}"
echo -e "   App URL: ${YELLOW}$APP_URL${NC}"
echo -e "   Teams Package: ${YELLOW}rewind365-teams-app-azure-storage.zip${NC}"
echo ""
echo -e "${BLUE}📱 Upload the Teams package to test your app!${NC}"