#!/bin/bash

# Security Check Script for Git Push
# Run this before committing/pushing to GitHub

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

echo "🔒 Security Check Before Git Push"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Check 1: .env in gitignore
if grep -q "^\.env$" .gitignore || grep -q "^\.env\$" .gitignore; then
    echo -e "${GREEN}✅${NC} .env is in .gitignore"
    ((PASSED++))
else
    echo -e "${RED}❌${NC} .env NOT in .gitignore - ADD IT NOW!"
    ((FAILED++))
fi

# Check 2: .env not staged (only if git repo exists)
if [ -d .git ] && git status --porcelain 2>/dev/null | grep -q "\.env"; then
    echo -e "${RED}❌${NC} .env is staged or modified - REMOVE FROM STAGING!"
    echo "   Run: git reset HEAD .env"
    ((FAILED++))
else
    echo -e "${GREEN}✅${NC} .env not in git staging"
    ((PASSED++))
fi

# Check 3: No .env in committed files (only if git repo exists)
if [ -d .git ] && git ls-files 2>/dev/null | grep -q "\.env$"; then
    echo -e "${RED}❌${NC} .env is tracked in git - REMOVE IT!"
    echo "   Run: git rm --cached .env"
    ((FAILED++))
else
    echo -e "${GREEN}✅${NC} .env not tracked in git"
    ((PASSED++))
fi

# Check 4: Search for potential secrets in source code
echo ""
echo "🔍 Searching for potential secrets in codebase..."
SECRETS_FOUND=0

# Check for OpenAI keys (sk- pattern)
if grep -r "sk-[a-zA-Z0-9]\{48,\}" src/ --exclude-dir=node_modules --exclude="*.test.ts" 2>/dev/null | grep -v "your_key\|example\|placeholder"; then
    echo -e "${RED}❌${NC} Potential OpenAI API key found in code!"
    SECRETS_FOUND=1
fi

# Check for Browserbase keys (bb_ pattern)
if grep -r "bb_[a-zA-Z0-9]\{32,\}" src/ --exclude-dir=node_modules --exclude="*.test.ts" 2>/dev/null | grep -v "your_key\|example\|placeholder"; then
    echo -e "${RED}❌${NC} Potential Browserbase API key found in code!"
    SECRETS_FOUND=1
fi

# Check for hardcoded process.env with actual values
if grep -r "process\.env\.[A-Z_]*\s*=\s*['\"][^'\"]\{20,\}" src/ --exclude-dir=node_modules 2>/dev/null | grep -v "your_key\|example\|placeholder"; then
    echo -e "${RED}❌${NC} Potential hardcoded environment variable found!"
    SECRETS_FOUND=1
fi

if [ $SECRETS_FOUND -eq 0 ]; then
    echo -e "${GREEN}✅${NC} No hardcoded secrets found in source code"
    ((PASSED++))
else
    ((FAILED++))
fi

# Check 5: .env.example exists
if [ -f .env.example ]; then
    echo -e "${GREEN}✅${NC} .env.example exists"
    ((PASSED++))
    
    # Verify .env.example doesn't contain real keys
    if grep -qE "(sk-[a-zA-Z0-9]{48,}|bb_[a-zA-Z0-9]{32,})" .env.example 2>/dev/null | grep -v "your_key\|example\|placeholder"; then
        echo -e "${RED}❌${NC} .env.example contains potential real API keys!"
        ((FAILED++))
    fi
else
    echo -e "${YELLOW}⚠️${NC} .env.example missing (recommended but not critical)"
fi

# Check .env file format
if [ -f .env ]; then
    if grep -q "^BROWSERBASE_API_KEY=" .env && grep -q "^OPENAI_API_KEY=" .env; then
        echo -e "${GREEN}✅${NC} .env file format looks correct"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠️${NC} .env may be missing required variables"
        echo "   Required: BROWSERBASE_API_KEY, OPENAI_API_KEY"
    fi
fi

# Check 6: .env file permissions (if exists)
if [ -f .env ]; then
    PERMS=$(stat -f "%A" .env 2>/dev/null || stat -c "%a" .env 2>/dev/null || echo "unknown")
    if [ "$PERMS" = "600" ] || [ "$PERMS" = "0600" ]; then
        echo -e "${GREEN}✅${NC} .env has secure permissions (600)"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠️${NC} .env permissions: $PERMS (recommend 600)"
        echo "   Run: chmod 600 .env"
    fi
fi

# Check 7: No API keys in config files
if [ -f "config.example.json" ] && grep -qE "(sk-|bb_|api.*key)" config.example.json -i 2>/dev/null; then
    if grep -qE "(sk-[a-zA-Z0-9]{48,}|bb_[a-zA-Z0-9]{32,})" config.example.json 2>/dev/null | grep -v "your_key\|example\|placeholder"; then
        echo -e "${RED}❌${NC} Potential API key in config.example.json!"
        ((FAILED++))
    fi
fi

# Summary
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "📊 Security Check Summary"
echo "═══════════════════════════════════════════════════════════"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ Security check passed! Safe to commit.${NC}"
    echo ""
    exit 0
else
    echo -e "${RED}❌ Security check failed! Fix issues before pushing.${NC}"
    echo ""
    echo "⚠️  DO NOT PUSH TO GITHUB until all issues are resolved!"
    echo ""
    exit 1
fi

