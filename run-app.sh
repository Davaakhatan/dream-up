#!/bin/bash

# Automated App Runner for DreamUp QA Pipeline
# This script sets up and runs the application

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "╔═══════════════════════════════════════════════════════╗"
echo "║   DreamUp QA Pipeline - Automated App Runner          ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

# Find Node.js
NODE_CMD=""
NODE_FOUND=false

echo "🔍 Detecting Node.js..."

# Check standard locations
if command -v node &> /dev/null; then
    NODE_CMD="node"
    NODE_FOUND=true
elif [ -f "$HOME/.nvm/nvm.sh" ]; then
    echo "   Found nvm, loading..."
    source "$HOME/.nvm/nvm.sh" 2>/dev/null || true
    if command -v node &> /dev/null; then
        NODE_CMD="node"
        NODE_FOUND=true
    fi
elif [ -f "/usr/local/bin/node" ]; then
    NODE_CMD="/usr/local/bin/node"
    NODE_FOUND=true
elif [ -f "/opt/homebrew/bin/node" ]; then
    NODE_CMD="/opt/homebrew/bin/node"
    NODE_FOUND=true
fi

if [ "$NODE_FOUND" = true ]; then
    NODE_VERSION=$($NODE_CMD --version 2>/dev/null || echo "unknown")
    echo -e "${GREEN}✅${NC} Node.js found: $NODE_VERSION"
    export PATH="$(dirname $NODE_CMD):$PATH"
else
    echo -e "${RED}❌${NC} Node.js not found!"
    echo ""
    echo "   Please install Node.js first:"
    echo "   1. brew install node"
    echo "   2. Or download from https://nodejs.org/"
    echo ""
    exit 1
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌${NC} npm not found!"
    exit 1
fi

NPM_VERSION=$(npm --version)
echo -e "${GREEN}✅${NC} npm found: $NPM_VERSION"
echo ""

# Check .env file
echo "🔐 Checking environment configuration..."
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️${NC} .env file not found!"
    if [ -f .env.example ]; then
        echo "   Creating .env from .env.example..."
        cp .env.example .env
        chmod 600 .env
        echo -e "${YELLOW}⚠️${NC} Please edit .env and add your API keys!"
        echo "   Required: BROWSERBASE_API_KEY, OPENAI_API_KEY"
        exit 1
    else
        echo "   Creating .env template..."
        cat > .env << 'EOF'
BROWSERBASE_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
EOF
        chmod 600 .env
        echo -e "${YELLOW}⚠️${NC} Please edit .env and add your API keys!"
        exit 1
    fi
else
    echo -e "${GREEN}✅${NC} .env file exists"
    
    # Verify API keys are set (basic check - not actual keys)
    if grep -q "BROWSERBASE_API_KEY=your_key_here\|BROWSERBASE_API_KEY=$" .env || \
       grep -q "OPENAI_API_KEY=your_key_here\|OPENAI_API_KEY=$" .env; then
        echo -e "${RED}❌${NC} .env contains placeholder keys!"
        echo "   Please edit .env and add your actual API keys"
        exit 1
    fi
    
    # Check if keys look valid (basic format check)
    if grep -q "^BROWSERBASE_API_KEY=" .env && grep -q "^OPENAI_API_KEY=" .env; then
        echo -e "${GREEN}✅${NC} API keys configured in .env"
    else
        echo -e "${YELLOW}⚠️${NC} .env may be missing required keys"
    fi
fi

# Load .env file
export $(grep -v '^#' .env | xargs)

# Check if API keys are loaded
if [ -z "$BROWSERBASE_API_KEY" ] || [ "$BROWSERBASE_API_KEY" = "your_key_here" ]; then
    echo -e "${RED}❌${NC} BROWSERBASE_API_KEY not set!"
    exit 1
fi

if [ -z "$OPENAI_API_KEY" ] || [ "$OPENAI_API_KEY" = "your_key_here" ]; then
    echo -e "${RED}❌${NC} OPENAI_API_KEY not set!"
    exit 1
fi

echo -e "${GREEN}✅${NC} Environment variables loaded"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
if [ ! -d "node_modules" ]; then
    npm install
    echo -e "${GREEN}✅${NC} Dependencies installed"
else
    echo -e "${GREEN}✅${NC} Dependencies already installed"
    
    # Check if packages are up to date
    echo "   Checking for updates..."
    npm outdated --silent || true
fi
echo ""

# Build project
echo "🏗️  Building project..."
if npm run build; then
    echo -e "${GREEN}✅${NC} Build successful"
else
    echo -e "${RED}❌${NC} Build failed!"
    exit 1
fi
echo ""

# Run security check
echo "🔒 Running security check..."
if [ -f check-security.sh ]; then
    ./check-security.sh || echo -e "${YELLOW}⚠️${NC} Security check found issues (continuing anyway)"
fi
echo ""

# Show menu
echo "╔═══════════════════════════════════════════════════════╗"
echo "║                    Select Mode                         ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""
echo "1. Test a game URL"
echo "2. Start web dashboard"
echo "3. Run test suite"
echo "4. Show help"
echo ""
read -p "Select option (1-4): " choice

case $choice in
    1)
        echo ""
        read -p "Enter game URL to test: " game_url
        if [ -z "$game_url" ]; then
            echo -e "${RED}❌${NC} URL is required!"
            exit 1
        fi
        
        echo ""
        echo "🧪 Running QA test for: $game_url"
        echo ""
        npm run cli test "$game_url"
        ;;
    2)
        echo ""
        echo "📊 Starting web dashboard..."
        echo ""
        npm run cli dashboard
        ;;
    3)
        echo ""
        echo "🧪 Running test suite..."
        echo ""
        npm test
        ;;
    4)
        echo ""
        echo "Usage examples:"
        echo ""
        echo "Test a game:"
        echo "  npm run cli test https://example.com/game.html"
        echo ""
        echo "Start dashboard:"
        echo "  npm run cli dashboard"
        echo ""
        echo "Run tests:"
        echo "  npm test"
        echo ""
        ;;
    *)
        echo -e "${RED}❌${NC} Invalid option!"
        exit 1
        ;;
esac

