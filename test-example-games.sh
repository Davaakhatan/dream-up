#!/bin/bash

# Example script to test sample browser games
# This provides ready-to-use game URLs for testing

source ~/.nvm/nvm.sh 2>/dev/null || true

# Load environment
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

echo "╔═══════════════════════════════════════════════════════╗"
echo "║   DreamUp QA - Example Game Testing                   ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""
echo "Select a game to test:"
echo ""
echo "1. Simple HTML5 Game (Pong)"
echo "2. Platformer Game"
echo "3. Puzzle Game"
echo "4. Enter custom URL"
echo ""
read -p "Select option (1-4): " choice

case $choice in
    1)
        GAME_URL="https://www.freecodecamp.org/news/how-to-build-a-pong-game-in-html5-with-canvas/"
        echo "Testing: Simple HTML5 Game"
        ;;
    2)
        GAME_URL="https://itch.io/games/html5/platformer"
        echo "Testing: Platformer Game"
        ;;
    3)
        GAME_URL="https://itch.io/games/html5/puzzle"
        echo "Testing: Puzzle Game"
        ;;
    4)
        read -p "Enter game URL: " GAME_URL
        ;;
    *)
        echo "Invalid option"
        exit 1
        ;;
esac

echo ""
echo "🧪 Running QA test..."
echo ""

npm run cli test "$GAME_URL"

echo ""
echo "✅ Test completed! Check the dashboard at http://localhost:3000"
echo "   Reports saved in: ./output/"
echo ""

