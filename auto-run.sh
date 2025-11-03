#!/bin/bash

# Simplified auto-run script for CI/automation
# Runs the app in automated mode (non-interactive)

set -e

# Find Node.js
NODE_CMD=""
if command -v node &> /dev/null; then
    NODE_CMD="node"
elif [ -f "$HOME/.nvm/nvm.sh" ]; then
    source "$HOME/.nvm/nvm.sh" 2>/dev/null || true
    NODE_CMD="node"
elif [ -f "/usr/local/bin/node" ]; then
    NODE_CMD="/usr/local/bin/node"
    export PATH="/usr/local/bin:$PATH"
elif [ -f "/opt/homebrew/bin/node" ]; then
    NODE_CMD="/opt/homebrew/bin/node"
    export PATH="/opt/homebrew/bin:$PATH"
fi

if [ -z "$NODE_CMD" ]; then
    echo "❌ Node.js not found. Install Node.js 18+ first."
    exit 1
fi

# Load environment
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Verify API keys
if [ -z "$BROWSERBASE_API_KEY" ] || [ "$BROWSERBASE_API_KEY" = "your_key_here" ]; then
    echo "❌ BROWSERBASE_API_KEY not configured in .env"
    exit 1
fi

if [ -z "$OPENAI_API_KEY" ] || [ "$OPENAI_API_KEY" = "your_key_here" ]; then
    echo "❌ OPENAI_API_KEY not configured in .env"
    exit 1
fi

# Install and build
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --silent
fi

if [ ! -d "dist" ]; then
    echo "🏗️  Building project..."
    npm run build
fi

# Run based on argument
if [ "$1" = "dashboard" ]; then
    echo "📊 Starting dashboard..."
    npm run cli dashboard
elif [ "$1" = "test" ] && [ -n "$2" ]; then
    echo "🧪 Testing game: $2"
    npm run cli test "$2"
else
    echo "Usage:"
    echo "  ./auto-run.sh dashboard"
    echo "  ./auto-run.sh test <game-url>"
    exit 1
fi

