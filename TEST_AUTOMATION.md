# Automated Testing Suite

## Overview

The DreamUp QA Pipeline includes a comprehensive automated test suite that validates:
- Project structure
- Type definitions
- Configuration system
- Module exports
- Code compilation
- Dependencies

## Test Files

### Unit Tests

1. **`src/__tests__/config.test.ts`**
   - Validates default configuration structure
   - Tests timeout configurations
   - Validates action types and properties
   - Ensures timeout constraints are met

2. **`src/__tests__/types.test.ts`**
   - Tests all type definitions
   - Validates ActionConfig variants (wait, click, keypress, screenshot)
   - Validates TimeoutConfig structure
   - Tests QAReport, Issue, and ScreenshotInfo types
   - Ensures type constraints are enforced

3. **`src/__tests__/evidence-capture.test.ts`**
   - Tests EvidenceCapture initialization
   - Validates screenshot capture functionality
   - Tests console log capture
   - Verifies error and warning filtering

4. **`src/__tests__/integration.test.ts`**
   - Tests module exports
   - Validates that all main classes are exported
   - Tests configuration loader
   - Ensures type exports are available

### Automated Script

**`test-automated.sh`** - Comprehensive bash test script that:

1. **Prerequisites Check**
   - Verifies Node.js installation
   - Verifies npm installation
   - Checks versions

2. **Structure Validation**
   - Validates all required files exist
   - Validates all required directories exist
   - Checks package.json structure

3. **Dependency Validation**
   - Verifies all required dependencies are declared
   - Checks package.json integrity

4. **Build Validation**
   - Installs dependencies
   - Compiles TypeScript
   - Validates build output
   - Checks for key built files

5. **Code Quality**
   - Runs unit tests
   - Runs linting
   - Validates TypeScript configuration

## Running Tests

### Quick Start

```bash
# Run the automated test suite
./test-automated.sh
```

### Manual Testing

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run unit tests
npm test

# Run linting
npm run lint

# Format code
npm run format
```

### Individual Test Suites

```bash
# Run specific test file
npm test -- config.test.ts

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch
```

## Test Coverage

### Current Coverage

- ✅ Configuration system
- ✅ Type definitions
- ✅ Module exports
- ✅ Evidence capture (partial)
- ✅ Integration tests

### Test Results

When Node.js is available, the automated script will:

1. ✅ Check prerequisites
2. ✅ Validate structure (12+ checks)
3. ✅ Verify dependencies (6+ checks)
4. ✅ Install and build
5. ✅ Run unit tests
6. ✅ Run linting
7. ✅ Generate summary report

## Expected Output

```
╔═══════════════════════════════════════════════════════╗
║   DreamUp QA Pipeline - Automated Test Suite          ║
╚═══════════════════════════════════════════════════════╝

📦 Checking Prerequisites...
✓ Node.js installed: v18.x.x
✓ npm installed: 9.x.x

🔍 Validating Project Structure...
✓ File exists: package.json
✓ File exists: tsconfig.json
... (more checks)

📚 Validating package.json...
✓ Dependency declared: chalk
✓ Dependency declared: commander
... (more checks)

🔧 Installing Dependencies...
✓ Dependencies installed

🏗️  Building TypeScript...
✓ TypeScript compilation successful
✓ Build output directory created
✓ CLI built successfully

🧪 Running Unit Tests...
✓ Unit tests passed

📊 Test Summary
═══════════════════════════════════════════════════════════
Passed: 20+
Failed: 0

✅ All automated tests passed!
```

## CI/CD Integration

The test suite is designed for CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm test
      - run: npm run lint
```

## Test Requirements

### Required Environment
- Node.js 18+
- npm 9+

### Optional for Full Testing
- Browserbase API key (for integration tests)
- OpenAI API key (for AI evaluation tests)
- Test game URLs

## Troubleshooting

### Node.js Not Found
```bash
# Install Node.js via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

### Build Failures
```bash
# Clean and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Test Failures
```bash
# Run with verbose output
npm test -- --verbose

# Check TypeScript errors
npm run build

# Check linting issues
npm run lint
```

## Next Steps

After tests pass:
1. Set environment variables (BROWSERBASE_API_KEY, OPENAI_API_KEY)
2. Run integration tests with real games
3. Test CLI commands
4. Start dashboard server
5. Test end-to-end workflow

## Continuous Improvement

- [ ] Add mock tests for browser automation
- [ ] Add integration tests with test doubles
- [ ] Add E2E tests for dashboard
- [ ] Add performance benchmarks
- [ ] Add API contract tests

