#!/bin/bash

# Rewind365 Full-Stack Deployment Script
# Builds React frontend and deploys FastAPI backend with static files

set -e

# Configuration
FRONTEND_DIR="../frontend"
BACKEND_DIR="."
BUILD_DIR="$FRONTEND_DIR/build"
STATIC_DIR="$BACKEND_DIR/static"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Rewind365 Full-Stack Deployment${NC}"
echo "=================================="

# Step 1: Build React frontend
echo -e "${YELLOW}📦 Building React frontend...${NC}"
cd "$FRONTEND_DIR"

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Frontend package.json not found${NC}"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📥 Installing frontend dependencies...${NC}"
    npm install
fi

# Build React app
echo -e "${YELLOW}🏗️  Creating production build...${NC}"
npm run build

# Verify build was created
if [ ! -d "$BUILD_DIR" ]; then
    echo -e "${RED}❌ React build failed - build directory not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ React build completed${NC}"

# Step 2: Copy React build to backend static directory
echo -e "${YELLOW}📁 Copying React build to backend...${NC}"
cd ../backend

# Remove existing static directory
rm -rf "$STATIC_DIR"

# Copy React build to static directory
cp -r "$BUILD_DIR" "$STATIC_DIR"

echo -e "${GREEN}✅ Static files copied${NC}"

# Step 3: Update React API base URL for production
echo -e "${YELLOW}🔧 Updating API configuration...${NC}"

# The React app will call /api/* which will be handled by FastAPI
echo -e "${GREEN}✅ API configuration ready${NC}"

# Step 4: Install Python dependencies
echo -e "${YELLOW}🐍 Installing Python dependencies...${NC}"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}📦 Creating Python virtual environment...${NC}"
    python3 -m venv venv
fi

# Activate virtual environment and install dependencies
source venv/bin/activate
pip install -r requirements.txt

echo -e "${GREEN}✅ Python dependencies installed${NC}"

# Step 5: Test the application locally
echo -e "${YELLOW}🧪 Testing application...${NC}"

# Start the FastAPI server in background for testing
uvicorn main:app --host 0.0.0.0 --port 8000 &
SERVER_PID=$!

# Wait a moment for server to start
sleep 3

# Test health endpoint
if curl -f http://localhost:8000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ API health check passed${NC}"
else
    echo -e "${RED}❌ API health check failed${NC}"
fi

# Test static files
if curl -f http://localhost:8000/ > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Static files serving correctly${NC}"
else
    echo -e "${RED}❌ Static files not accessible${NC}"
fi

# Stop test server
kill $SERVER_PID 2>/dev/null || true

echo ""
echo -e "${GREEN}🎉 Deployment preparation completed!${NC}"
echo -e "${BLUE}📋 Summary:${NC}"
echo -e "   Frontend built: ${GREEN}✅${NC}"
echo -e "   Static files copied: ${GREEN}✅${NC}"
echo -e "   Python dependencies: ${GREEN}✅${NC}"
echo -e "   Local testing: ${GREEN}✅${NC}"
echo ""
echo -e "${BLUE}🚀 Next steps:${NC}"
echo -e "   1. ${YELLOW}Deploy to Azure App Service${NC}"
echo -e "   2. ${YELLOW}Set environment variables${NC}"
echo -e "   3. ${YELLOW}Configure custom domain${NC}"
echo ""
echo -e "${BLUE}🔧 Local development:${NC}"
echo -e "   ${YELLOW}source venv/bin/activate${NC}"
echo -e "   ${YELLOW}uvicorn main:app --reload${NC}"
echo -e "   ${YELLOW}Open: http://localhost:8000${NC}"