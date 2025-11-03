#!/bin/bash

# Fully Automated Test Runner for DreamUp QA Pipeline
# This script tests a game and shows results in the dashboard

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Load Node.js
source ~/.nvm/nvm.sh 2>/dev/null || true

# Load environment - properly handle .env file
if [ -f .env ]; then
    # Export variables from .env, handling spaces and special chars
    set -a
    source .env
    set +a
    # Also explicitly export common variables
    export BROWSERBASE_API_KEY
    export OPENAI_API_KEY
    export BROWSERBASE_PROJECT_ID
fi

echo "╔═══════════════════════════════════════════════════════╗"
echo "║   DreamUp QA - Automated Game Testing                 ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

# Default test game (simple HTML5 game that loads quickly)
TEST_URL="${1:-https://play2048.co/}"

echo -e "${BLUE}📋 Test Configuration:${NC}"
echo "   Game URL: $TEST_URL"
echo "   Output: ./output/"
echo ""

# Verify API keys
if [ -z "$BROWSERBASE_API_KEY" ] || [ "$BROWSERBASE_API_KEY" = "your_key_here" ]; then
    echo -e "${YELLOW}⚠️  BROWSERBASE_API_KEY not set in .env${NC}"
    exit 1
fi

if [ -z "$OPENAI_API_KEY" ] || [ "$OPENAI_API_KEY" = "your_key_here" ]; then
    echo -e "${YELLOW}⚠️  OPENAI_API_KEY not set in .env${NC}"
    exit 1
fi

echo -e "${GREEN}✅ API keys configured${NC}"
echo ""

# Ensure build exists
if [ ! -d "dist" ]; then
    echo "🏗️  Building project..."
    npm run build
fi

# Run the test
echo -e "${BLUE}🧪 Running automated test...${NC}"
echo "   This will take 1-3 minutes..."
echo ""

npm run cli test "$TEST_URL"

# Check if report was created
if [ -f output/report-*.json ]; then
    LATEST_REPORT=$(ls -t output/report-*.json | head -1)
    echo ""
    echo -e "${GREEN}✅ Test completed successfully!${NC}"
    echo ""
    echo "📊 Results:"
    echo "   Report: $LATEST_REPORT"
    echo "   Screenshots: ./output/screenshots/"
    echo ""
    echo "🌐 View in dashboard:"
    echo "   http://localhost:3000"
    echo ""
    echo "   (Refresh the page to see results)"
else
    echo ""
    echo -e "${YELLOW}⚠️  Test completed but no report found${NC}"
    echo "   Check output directory: ./output/"
fi

