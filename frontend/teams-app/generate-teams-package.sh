#!/bin/bash

# Generate Teams App Package Script
# Creates a zip package from manifest.json and icon files
# Usage: ./generate-teams-package.sh [optional-suffix]

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}📦 Generating Teams App Package${NC}"
echo "================================="

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Check required files
REQUIRED_FILES=("manifest.json" "color.png" "outline.png")
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ Missing required file: $file${NC}"
        exit 1
    fi
done

echo -e "${GREEN}✅ All required files found${NC}"

# Get version from manifest
VERSION=$(grep '"version"' manifest.json | head -1 | sed 's/.*"version": *"\([^"]*\)".*/\1/')
APP_NAME=$(grep '"short"' manifest.json | head -1 | sed 's/.*"short": *"\([^"]*\)".*/\1/')

echo -e "${BLUE}📋 App: $APP_NAME${NC}"
echo -e "${BLUE}📋 Version: $VERSION${NC}"

# Generate filename with optional suffix
SUFFIX=""
if [ "$1" != "" ]; then
    SUFFIX="-$1"
fi

TIMESTAMP=$(date +%Y%m%d-%H%M%S)
ZIP_NAME="${APP_NAME,,}-v${VERSION}${SUFFIX}-${TIMESTAMP}.zip"  # ${APP_NAME,,} converts to lowercase

# Create the package
echo -e "${YELLOW}🔧 Creating package: $ZIP_NAME${NC}"
zip -r "$ZIP_NAME" manifest.json color.png outline.png

# Verify the package
echo ""
echo -e "${GREEN}✅ Teams app package created successfully!${NC}"
echo -e "${BLUE}📄 Package: $ZIP_NAME${NC}"
echo -e "${BLUE}📁 Location: $SCRIPT_DIR/$ZIP_NAME${NC}"

# Show package contents
echo ""
echo -e "${YELLOW}📋 Package contents:${NC}"
unzip -l "$ZIP_NAME" | tail -n +4 | head -n -2 | while read line; do
    echo -e "${BLUE}   $line${NC}"
done

# Show manifest summary
echo ""
echo -e "${YELLOW}📝 Manifest summary:${NC}"
echo -e "${BLUE}   ID: $(grep '"id"' manifest.json | sed 's/.*"id": *"\([^"]*\)".*/\1/')${NC}"
echo -e "${BLUE}   Version: $VERSION${NC}"
echo -e "${BLUE}   Name: $APP_NAME${NC}"

# Show URLs
echo -e "${BLUE}   Content URL: $(grep 'contentUrl' manifest.json | head -1 | sed 's/.*"contentUrl": *"\([^"]*\)".*/\1/')${NC}"
echo -e "${BLUE}   Config URL: $(grep 'configurationUrl' manifest.json | head -1 | sed 's/.*"configurationUrl": *"\([^"]*\)".*/\1/')${NC}"

# Show valid domains
DOMAIN=$(grep -A 1 'validDomains' manifest.json | tail -1 | sed 's/.*"\([^"]*\)".*/\1/')
echo -e "${BLUE}   Valid Domain: $DOMAIN${NC}"

echo ""
echo -e "${GREEN}🚀 Ready to upload to Teams!${NC}"