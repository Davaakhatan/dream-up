#!/bin/bash

# Pre-push security check
# Run this before: git push

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔒 Pre-Push Security Check"
echo "═══════════════════════════════════════════════════════════"
echo ""

FAILED=0

# Check 1: .env in gitignore
if grep -q "^\.env$" .gitignore || grep -q "^\.env\$" .gitignore; then
    echo -e "${GREEN}✅${NC} .env is in .gitignore"
else
    echo -e "${RED}❌${NC} .env NOT in .gitignore!"
    FAILED=1
fi

# Check 2: .env not staged
if git status --porcelain 2>/dev/null | grep -q "\.env"; then
    echo -e "${RED}❌${NC} .env is staged! Removing..."
    git reset HEAD .env 2>/dev/null
    FAILED=1
else
    echo -e "${GREEN}✅${NC} .env not staged"
fi

# Check 3: .env not tracked
if git ls-files 2>/dev/null | grep -q "\.env$"; then
    echo -e "${RED}❌${NC} .env is tracked in git! Remove it:"
    echo "   git rm --cached .env"
    FAILED=1
else
    echo -e "${GREEN}✅${NC} .env not tracked"
fi

# Check 4: No secrets in files to be committed
echo ""
echo "🔍 Scanning for secrets in staged files..."

if git diff --cached --name-only 2>/dev/null | grep -v ".env" | while read file; do
    if [ -f "$file" ]; then
        # Check for API key patterns
        if grep -qE "(sk-[a-zA-Z0-9]{48,}|bb_[a-zA-Z0-9]{32,})" "$file" 2>/dev/null | grep -v "your_key\|example\|placeholder"; then
            echo -e "${RED}❌${NC} Potential API key in: $file"
            FAILED=1
        fi
    fi
done; then
    : # Already handled
fi

if git diff --cached 2>/dev/null | grep -qE "(sk-[a-zA-Z0-9]{48,}|bb_[a-zA-Z0-9]{32,})" | grep -v "your_key\|example\|placeholder"; then
    echo -e "${RED}❌${NC} Potential API keys in staged changes!"
    FAILED=1
else
    echo -e "${GREEN}✅${NC} No secrets found in staged files"
fi

echo ""
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ Security check passed! Safe to push.${NC}"
    exit 0
else
    echo -e "${RED}❌ Security check failed! DO NOT PUSH until fixed.${NC}"
    exit 1
fi

