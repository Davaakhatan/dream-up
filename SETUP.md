# Setup Guide

## Prerequisites

### Node.js Installation

The DreamUp QA Pipeline requires Node.js 18+. Here are installation options:

#### Option 1: Homebrew (macOS)
```bash
brew install node
```

#### Option 2: NVM (Node Version Manager) - Recommended
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal or source nvm
source ~/.zshrc  # or ~/.bashrc

# Install Node.js
nvm install 18
nvm use 18
nvm alias default 18
```

#### Option 3: Official Installer
Download from [nodejs.org](https://nodejs.org/) and follow installation wizard.

#### Option 4: Check if Already Installed
```bash
# Check if node is installed but not in PATH
which node
ls -la /usr/local/bin/node
ls -la /opt/homebrew/bin/node

# If found, add to PATH (add to ~/.zshrc or ~/.bashrc)
export PATH="/usr/local/bin:$PATH"
# or
export PATH="/opt/homebrew/bin:$PATH"
```

### Verify Installation

```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

## Project Setup

### 1. Clone/Navigate to Project
```bash
cd "/Users/davaakhatanzorigtbaatar/Downloads/Private/2024/2025/CLassboxes/Gauntlet AI/Projects/AlphaSchool/DreamUp"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Build Project
```bash
npm run build
```

### 4. Set Environment Variables

Create a `.env` file or export variables:

```bash
# Browserbase API Key (get from https://www.browserbase.com)
export BROWSERBASE_API_KEY=your_key_here

# Optional: Browserbase Project ID
export BROWSERBASE_PROJECT_ID=your_project_id

# OpenAI API Key (get from https://platform.openai.com)
export OPENAI_API_KEY=your_key_here
```

Or create `.env` file:
```bash
cat > .env << EOF
BROWSERBASE_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
EOF
```

### 5. Run Tests
```bash
# Run automated test suite
./test-automated.sh

# Or run individual tests
npm test
npm run lint
```

## Troubleshooting

### Node.js Not Found

**Problem:** `node: command not found`

**Solutions:**

1. **Check if installed:**
   ```bash
   /usr/local/bin/node --version
   /opt/homebrew/bin/node --version
   ```

2. **Add to PATH:**
   ```bash
   # Add to ~/.zshrc (or ~/.bashrc)
   export PATH="/usr/local/bin:$PATH"
   # or for Apple Silicon Macs
   export PATH="/opt/homebrew/bin:$PATH"
   
   # Reload shell
   source ~/.zshrc
   ```

3. **Use nvm:**
   ```bash
   source ~/.nvm/nvm.sh
   nvm use 18
   ```

### npm Not Found

**Problem:** `npm: command not found`

**Solutions:**

1. **Node.js includes npm** - if node works, npm should too
2. **Reinstall Node.js** - npm comes bundled
3. **Check PATH** - ensure Node.js bin directory is in PATH

### Build Failures

**Problem:** TypeScript compilation errors

**Solutions:**

```bash
# Clean and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Permission Errors

**Problem:** Permission denied errors

**Solutions:**

```bash
# Fix npm permissions (if needed)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH

# Or use sudo (not recommended)
sudo npm install
```

## Quick Start

Once Node.js is installed:

```bash
# 1. Install dependencies
npm install

# 2. Build project
npm run build

# 3. Run test
npm run cli test https://example.com/game.html

# 4. Start dashboard
npm run cli dashboard
```

## Environment Setup Script

Create a setup script for easy initialization:

```bash
#!/bin/bash
# setup.sh

echo "🚀 Setting up DreamUp QA Pipeline..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

echo "✅ Node.js: $(node --version)"
echo "✅ npm: $(npm --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build
echo "🏗️  Building project..."
npm run build

# Check for .env
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating template..."
    cat > .env << EOF
BROWSERBASE_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
EOF
    echo "📝 Please edit .env with your API keys"
fi

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit .env with your API keys"
echo "  2. Run: npm run cli test <game-url>"
```

## CI/CD Setup

For automated environments, ensure:

1. Node.js 18+ is installed
2. Environment variables are set as secrets
3. Run `npm ci` instead of `npm install` for reproducible builds

```yaml
# Example GitHub Actions
- uses: actions/setup-node@v3
  with:
    node-version: '18'
- run: npm ci
- run: npm run build
- run: npm test
```

## Next Steps

After setup:
1. ✅ Get API keys (Browserbase & OpenAI)
2. ✅ Configure `.env` file
3. ✅ Run test suite: `./test-automated.sh`
4. ✅ Test with a game: `npm run cli test <url>`
5. ✅ Start dashboard: `npm run cli dashboard`

