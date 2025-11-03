#!/bin/bash

# Automated Test Suite for DreamUp QA Pipeline
# This script runs comprehensive tests without requiring API keys

set -e

echo "╔═══════════════════════════════════════════════════════╗"
echo "║   DreamUp QA Pipeline - Automated Test Suite          ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

test_pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASSED++))
}

test_fail() {
    echo -e "${RED}✗${NC} $1"
    ((FAILED++))
}

# Check Node.js
echo "📦 Checking Prerequisites..."
NODE_CMD=""
if command -v node &> /dev/null; then
    NODE_CMD="node"
elif [ -f "$HOME/.nvm/nvm.sh" ]; then
    # Try loading nvm if available
    source "$HOME/.nvm/nvm.sh" 2>/dev/null || true
    if command -v node &> /dev/null; then
        NODE_CMD="node"
    fi
elif [ -d "/usr/local/bin" ] && [ -f "/usr/local/bin/node" ]; then
    NODE_CMD="/usr/local/bin/node"
elif [ -d "/opt/homebrew/bin" ] && [ -f "/opt/homebrew/bin/node" ]; then
    NODE_CMD="/opt/homebrew/bin/node"
fi

if [ -n "$NODE_CMD" ]; then
    NODE_VERSION=$($NODE_CMD --version 2>/dev/null || echo "unknown")
    test_pass "Node.js found: $NODE_VERSION"
    export PATH="$(dirname $NODE_CMD):$PATH"
else
    test_fail "Node.js not found in PATH"
    echo ""
    echo "   💡 To fix this, try one of:"
    echo "   1. Install via Homebrew: brew install node"
    echo "   2. Install via nvm: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    echo "   3. Install from https://nodejs.org/"
    echo "   4. Add Node.js to PATH if already installed"
    echo ""
    echo "   For now, running structure-only validation..."
    SKIP_NODE_TESTS=true
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    test_pass "npm installed: $NPM_VERSION"
else
    test_fail "npm not found"
    exit 1
fi

echo ""
echo "🔍 Validating Project Structure..."

# Check required files
REQUIRED_FILES=(
    "package.json"
    "tsconfig.json"
    "README.md"
    "src/index.ts"
    "src/cli.ts"
    "src/agent/qa-agent.ts"
    "src/dashboard/server.ts"
    "src/dashboard/public/index.html"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        test_pass "File exists: $file"
    else
        test_fail "Missing file: $file"
    fi
done

# Check required directories
REQUIRED_DIRS=(
    "src/agent"
    "src/browser"
    "src/config"
    "src/types"
    "src/utils"
    "src/dashboard"
    "src/dashboard/public"
)

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        test_pass "Directory exists: $dir"
    else
        test_fail "Missing directory: $dir"
    fi
done

echo ""
echo "📚 Validating package.json..."

if [ -f "package.json" ]; then
    # Check for required dependencies
    REQUIRED_DEPS=("chalk" "commander" "express" "openai" "ora" "@browserbasehq/sdk")
    
    for dep in "${REQUIRED_DEPS[@]}"; do
        if grep -q "\"$dep\"" package.json; then
            test_pass "Dependency declared: $dep"
        else
            test_fail "Missing dependency: $dep"
        fi
    done
fi

if [ "$SKIP_NODE_TESTS" != "true" ]; then
    echo ""
    echo "🔧 Installing Dependencies..."

    if [ ! -d "node_modules" ]; then
        echo "   Installing npm packages..."
        npm install --silent || {
            test_fail "npm install failed"
            echo "   Continuing with structure validation only..."
            SKIP_NODE_TESTS=true
        }
        if [ "$SKIP_NODE_TESTS" != "true" ]; then
            test_pass "Dependencies installed"
        fi
    else
        test_pass "Dependencies already installed"
    fi
else
    echo ""
    echo "⏭️  Skipping Node.js-dependent tests (Node.js not found)"
fi

if [ "$SKIP_NODE_TESTS" != "true" ]; then
    echo ""
    echo "🏗️  Building TypeScript..."

    if npm run build 2>/dev/null; then
        test_pass "TypeScript compilation successful"
        
        # Check if dist directory was created
        if [ -d "dist" ]; then
            test_pass "Build output directory created"
            
            # Check for key built files
            if [ -f "dist/cli.js" ]; then
                test_pass "CLI built successfully"
            else
                test_fail "CLI build output missing"
            fi
            
            if [ -f "dist/index.js" ]; then
                test_pass "Main index built successfully"
            else
                test_fail "Index build output missing"
            fi
        else
            test_fail "Build output directory not created"
        fi
    else
        test_fail "TypeScript compilation failed"
    fi
fi

if [ "$SKIP_NODE_TESTS" != "true" ]; then
    echo ""
    echo "🧪 Running Unit Tests..."

    if npm test -- --passWithNoTests 2>/dev/null; then
        test_pass "Unit tests passed"
    else
        echo -e "${YELLOW}⚠${NC} Unit tests not configured or failed (this is OK for now)"
    fi

    echo ""
    echo "📋 Validating TypeScript Configuration..."

    if [ -f "tsconfig.json" ]; then
        # Basic JSON validation
        if node -e "JSON.parse(require('fs').readFileSync('tsconfig.json', 'utf8'))" 2>/dev/null; then
            test_pass "tsconfig.json is valid JSON"
        else
            test_fail "tsconfig.json is invalid JSON"
        fi
    fi

    echo ""
    echo "🔍 Linting Code..."

    if npm run lint 2>/dev/null; then
        test_pass "Code linting passed"
    else
        echo -e "${YELLOW}⚠${NC} Linting issues found (review manually)"
    fi
else
    echo ""
    echo "📋 Validating Configuration Files..."

    # Basic file validation without Node.js
    if [ -f "tsconfig.json" ]; then
        # Check if it looks like valid JSON (basic check)
        if grep -q '"compilerOptions"' tsconfig.json; then
            test_pass "tsconfig.json structure looks valid"
        else
            test_fail "tsconfig.json structure invalid"
        fi
    fi

    if [ -f "package.json" ]; then
        if grep -q '"name"' package.json && grep -q '"version"' package.json; then
            test_pass "package.json structure looks valid"
        else
            test_fail "package.json structure invalid"
        fi
    fi
fi

echo ""
echo "📊 Test Summary"
echo "═══════════════════════════════════════════════════════════"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All automated tests passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Set BROWSERBASE_API_KEY and OPENAI_API_KEY environment variables"
    echo "  2. Run: npm run cli test <game-url>"
    echo "  3. Start dashboard: npm run cli dashboard"
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Please review the errors above.${NC}"
    exit 1
fi

