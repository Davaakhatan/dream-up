#!/bin/bash

# Quick Start Script - Run the dashboard automatically

source ~/.nvm/nvm.sh 2>/dev/null || true

# Load environment
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Check if built
if [ ! -d "dist" ]; then
    echo "🏗️  Building project..."
    npm run build
fi

# Start dashboard
echo "📊 Starting DreamUp QA Dashboard..."
echo "   Access at: http://localhost:3000"
echo ""
npm run cli dashboard

