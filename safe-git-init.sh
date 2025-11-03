#!/bin/bash
# Safe Git Initialization Script
# This ensures .env is never committed

set -e

echo "🔒 Safe Git Initialization"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Ensure .env is in .gitignore
if ! grep -q "^\.env$" .gitignore 2>/dev/null; then
    echo ".env" >> .gitignore
    echo "✅ Added .env to .gitignore"
fi

if ! grep -q "^\.env\.local$" .gitignore 2>/dev/null; then
    echo ".env.local" >> .gitignore
fi

# Initialize git if not already
if [ ! -d .git ]; then
    git init
    echo "✅ Git initialized"
fi

# Verify .env is ignored
if git check-ignore .env >/dev/null 2>&1; then
    echo "✅ .env is properly ignored"
else
    echo "❌ ERROR: .env is not ignored!"
    exit 1
fi

# Remove .env from staging if it's there
git reset HEAD .env .env.local 2>/dev/null || true

# Add all files except .env
git add .
git reset HEAD .env .env.local 2>/dev/null || true

echo ""
echo "📋 Files to be committed:"
git status --short | head -10

echo ""
echo "✅ Safe to commit! .env will NOT be included."
echo ""
echo "Next steps:"
echo "  1. Review: git status"
echo "  2. Commit: git commit -m 'Initial commit: DreamUp QA Pipeline'"
echo "  3. Check: ./pre-push-check.sh"
echo "  4. Push: git push"
