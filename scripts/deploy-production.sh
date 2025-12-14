#!/bin/bash

# Netlify Production Deployment Script
# Usage: ./scripts/deploy-production.sh

set -e  # Exit on error

echo "🚀 Starting production deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Set Netlify token
export NETLIFY_AUTH_TOKEN="nfp_4WVe7jj6shYCiRcTi8AzSfYDxCnEmv6Eb605"

# Configuration
SITE_ID="dfeefdc2-92aa-4415-baf6-42e60dfa6328"
BUILD_DIR="dist"
SITE_URL="https://dobeu.net"

# Function to print section headers
print_section() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

# Function to check command exists
command_exists() {
    command -v "$1" &> /dev/null
}

# Step 1: Check prerequisites
print_section "📋 Checking Prerequisites"

if ! command_exists node; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js 20+${NC}"
    exit 1
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}✅ Node.js: $NODE_VERSION${NC}"

if ! command_exists npm; then
    echo -e "${RED}❌ npm not found. Please install npm${NC}"
    exit 1
fi

NPM_VERSION=$(npm --version)
echo -e "${GREEN}✅ npm: $NPM_VERSION${NC}"

if ! command_exists netlify; then
    echo -e "${YELLOW}⚠️  Netlify CLI not found. Installing...${NC}"
    npm install -g netlify-cli
fi

NETLIFY_VERSION=$(netlify --version)
echo -e "${GREEN}✅ Netlify CLI: $NETLIFY_VERSION${NC}"

# Step 2: Install dependencies
print_section "📦 Installing Dependencies"

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm ci
else
    echo "Dependencies already installed. Verifying..."
    npm ci
fi

echo -e "${GREEN}✅ Dependencies installed${NC}"

# Step 3: Run pre-deployment checks
print_section "🔍 Running Pre-Deployment Checks"

echo "Running type check..."
if npx tsc --noEmit; then
    echo -e "${GREEN}✅ Type check passed${NC}"
else
    echo -e "${RED}❌ Type check failed${NC}"
    exit 1
fi

echo ""
echo "Running linter..."
if npm run lint; then
    echo -e "${GREEN}✅ Lint passed${NC}"
else
    echo -e "${RED}❌ Lint failed${NC}"
    exit 1
fi

echo ""
echo "Running tests..."
if npm run test:ci; then
    echo -e "${GREEN}✅ Tests passed${NC}"
else
    echo -e "${RED}❌ Tests failed${NC}"
    exit 1
fi

# Step 4: Build
print_section "🏗️  Building for Production"

# Clean previous build
if [ -d "$BUILD_DIR" ]; then
    echo "Cleaning previous build..."
    rm -rf "$BUILD_DIR"
fi

echo "Building project..."
if npm run build; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

# Verify build output
if [ ! -d "$BUILD_DIR" ]; then
    echo -e "${RED}❌ Build directory not found: $BUILD_DIR${NC}"
    exit 1
fi

# Show build size
BUILD_SIZE=$(du -sh "$BUILD_DIR" | cut -f1)
echo -e "${GREEN}📦 Build size: $BUILD_SIZE${NC}"

# List build contents
echo ""
echo "Build contents:"
ls -lh "$BUILD_DIR" | head -10

# Step 5: Deploy
print_section "🚀 Deploying to Netlify Production"

DEPLOY_MESSAGE="Production deployment $(date '+%Y-%m-%d %H:%M:%S')"
echo "Deploy message: $DEPLOY_MESSAGE"
echo ""

if netlify deploy \
  --prod \
  --site="$SITE_ID" \
  --dir="$BUILD_DIR" \
  --message="$DEPLOY_MESSAGE"; then
    echo ""
    echo -e "${GREEN}✅ Deployment successful!${NC}"
else
    echo ""
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi

# Step 6: Verify deployment
print_section "🔍 Verifying Deployment"

echo "Waiting for deployment to propagate..."
sleep 10

echo "Checking site accessibility..."
if curl -f -s -o /dev/null -w "%{http_code}" "$SITE_URL" | grep -q "200"; then
    echo -e "${GREEN}✅ Site is accessible (HTTP 200)${NC}"
else
    echo -e "${YELLOW}⚠️  Site returned non-200 status. Check manually.${NC}"
fi

echo ""
echo "Checking critical pages..."

# Check homepage
if curl -f -s -o /dev/null "$SITE_URL"; then
    echo -e "${GREEN}✅ Homepage: OK${NC}"
else
    echo -e "${RED}❌ Homepage: Failed${NC}"
fi

# Check services page
if curl -f -s -o /dev/null "$SITE_URL/services"; then
    echo -e "${GREEN}✅ Services page: OK${NC}"
else
    echo -e "${RED}❌ Services page: Failed${NC}"
fi

# Check contact page
if curl -f -s -o /dev/null "$SITE_URL/contact"; then
    echo -e "${GREEN}✅ Contact page: OK${NC}"
else
    echo -e "${RED}❌ Contact page: Failed${NC}"
fi

# Final summary
print_section "🎉 Deployment Complete"

echo -e "${GREEN}Deployment Details:${NC}"
echo "  📍 Site ID: $SITE_ID"
echo "  🌐 Website: $SITE_URL"
echo "  📊 Dashboard: https://app.netlify.com/sites/dobeu-net/overview"
echo "  📝 Logs: https://app.netlify.com/sites/dobeu-net/logs"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "  1. Visit $SITE_URL to verify deployment"
echo "  2. Check Netlify dashboard for deployment logs"
echo "  3. Monitor error logs for any issues"
echo "  4. Run smoke tests on critical functionality"
echo ""
echo -e "${GREEN}✨ All done!${NC}"
