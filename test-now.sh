#!/bin/bash

# Quick test script with proper .env loading

source ~/.nvm/nvm.sh 2>/dev/null || true

# Load .env properly
if [ -f .env ]; then
    set -a
    source .env
    set +a
fi

# Ensure we're in the right directory
cd "$(dirname "$0")"

echo "🧪 Testing with proper .env loading..."
echo ""

# Rebuild if needed
if [ ! -d "dist" ]; then
    echo "Building..."
    npm run build
fi

# Run test
npm run cli test "${1:-https://play2048.co/}"

