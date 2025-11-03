# Security Checklist & Best Practices

## 🔒 Pre-Commit Security Checklist

Before pushing to GitHub, verify the following:

### ✅ Secrets Management

- [x] **`.env` is in `.gitignore`** - Verified
- [x] **No API keys in code** - All keys use `process.env`
- [x] **No hardcoded secrets** - Confirmed via code review
- [ ] **`.env.example` exists** - Template without real keys
- [ ] **`.env` file exists locally** - You've created this ✓
- [ ] **No `.env` committed to git** - Check before push

### ✅ Git Security

Run these commands before committing:

```bash
# Check what files will be committed
git status

# Verify .env is NOT in staging
git status | grep -i .env

# Check if .env was ever committed (in git history)
git log --all --full-history -- .env

# List all files that will be pushed
git ls-files | grep -i env
```

### ✅ Code Security

- [x] **API keys read from environment** - `process.env.BROWSERBASE_API_KEY` ✓
- [x] **No keys in source code** - Verified ✓
- [x] **No keys in config files** - `config.example.json` has no keys ✓
- [x] **No keys in documentation** - Only placeholders ✓

### ✅ File Permissions

```bash
# Set .env permissions (restrictive)
chmod 600 .env

# Verify .env is not world-readable
ls -l .env  # Should show: -rw------- or -rw-r--r--
```

## 🚨 Critical: Before Pushing to GitHub

### Run This Security Check:

```bash
# Create and run security check
cat > check-security.sh << 'EOF'
#!/bin/bash
echo "🔒 Security Check Before Git Push"
echo "================================"

# Check 1: .env in gitignore
if grep -q "^\.env$" .gitignore; then
    echo "✅ .env is in .gitignore"
else
    echo "❌ .env NOT in .gitignore - ADD IT NOW!"
    exit 1
fi

# Check 2: .env not staged
if git status --porcelain | grep -q "\.env"; then
    echo "❌ .env is staged or modified - REMOVE FROM STAGING!"
    git reset HEAD .env 2>/dev/null
    echo "   Removed from staging"
    exit 1
else
    echo "✅ .env not in git staging"
fi

# Check 3: No .env in committed files
if git ls-files | grep -q "\.env$"; then
    echo "❌ .env is tracked in git - REMOVE IT!"
    git rm --cached .env 2>/dev/null
    echo "   Removed from git tracking"
    exit 1
else
    echo "✅ .env not tracked in git"
fi

# Check 4: Search for potential secrets in code
echo ""
echo "Searching for potential secrets in codebase..."
if grep -r "sk-" src/ --exclude-dir=node_modules 2>/dev/null | grep -v "example\|your_key"; then
    echo "⚠️  Potential API key found in code!"
    exit 1
fi

if grep -r "browserbase.*key" src/ --exclude-dir=node_modules 2>/dev/null | grep -v "process.env\|your_key\|example"; then
    echo "⚠️  Potential API key found in code!"
    exit 1
fi

echo "✅ No hardcoded secrets found"

# Check 5: .env.example exists
if [ -f .env.example ]; then
    echo "✅ .env.example exists"
else
    echo "⚠️  .env.example missing (recommended but not critical)"
fi

echo ""
echo "✅ Security check passed! Safe to commit."
EOF

chmod +x check-security.sh
./check-security.sh
```

## 📋 Environment Variables Validation

### Required Variables

Your `.env` file should contain:

```bash
# Required
BROWSERBASE_API_KEY=bb_your_actual_key_here
OPENAI_API_KEY=sk-your_actual_key_here

# Optional
BROWSERBASE_PROJECT_ID=your_project_id
```

### Validation Rules

1. **BROWSERBASE_API_KEY**: Should start with `bb_`
2. **OPENAI_API_KEY**: Should start with `sk-` or `sk-proj-`
3. **Never commit these values**
4. **Use different keys for dev/staging/prod**

## 🔐 Best Practices

### 1. Environment File Security

```bash
# Create .env with correct permissions
touch .env
chmod 600 .env  # Only owner can read/write

# Add to .gitignore (already done ✓)
echo ".env" >> .gitignore

# Verify it's ignored
git check-ignore .env  # Should output: .env
```

### 2. Using .env in Code

✅ **Correct:**
```typescript
const apiKey = process.env.BROWSERBASE_API_KEY;
```

❌ **Wrong:**
```typescript
const apiKey = "bb_1234567890";  // NEVER do this
```

### 3. CI/CD Security

For GitHub Actions or CI/CD:

```yaml
# Use GitHub Secrets (not .env files)
env:
  BROWSERBASE_API_KEY: ${{ secrets.BROWSERBASE_API_KEY }}
  OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```

### 4. Rotation Policy

- Rotate keys if accidentally committed
- Rotate keys every 90 days
- Use different keys per environment

## 🛡️ Additional Security Measures

### 1. Enable Git Hooks

Create `.git/hooks/pre-commit`:

```bash
#!/bin/bash
# Pre-commit hook to check for secrets

if git diff --cached --name-only | grep -q "\.env$"; then
    echo "❌ ERROR: Attempting to commit .env file!"
    echo "   Remove .env from staging: git reset HEAD .env"
    exit 1
fi

# Check for common secret patterns
if git diff --cached | grep -qE "(sk-[a-zA-Z0-9]{32,}|bb_[a-zA-Z0-9]{32,})"; then
    echo "⚠️  WARNING: Potential API key detected in staged changes!"
    echo "   Please review before committing."
    read -p "Continue? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi
```

### 2. Use .env.example Template

Ensure `.env.example` exists (without real keys):

```bash
# .env.example
BROWSERBASE_API_KEY=bb_your_key_here
OPENAI_API_KEY=sk-your_key_here
BROWSERBASE_PROJECT_ID=your_project_id_here
```

### 3. Scan for Secrets

Use tools to scan for secrets:

```bash
# Install git-secrets
brew install git-secrets

# Configure
git secrets --register-aws
git secrets --install

# Or use truffleHog
pip install trufflehog
trufflehog git file://. --json
```

## 🚨 If You Accidentally Committed Secrets

### Immediate Actions:

1. **Remove from Git:**
   ```bash
   git rm --cached .env
   git commit -m "Remove .env file"
   ```

2. **Rotate API Keys Immediately:**
   - Browserbase: Generate new key
   - OpenAI: Generate new key in dashboard

3. **Remove from Git History (if just pushed):**
   ```bash
   # WARNING: This rewrites history!
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env" \
     --prune-empty --tag-name-filter cat -- --all
   
   # Force push (coordinate with team!)
   git push origin --force --all
   ```

4. **Check for exposed keys:**
   - Search GitHub for your API keys
   - Check if repository is public
   - Rotate keys if found

## ✅ Final Security Checklist

Before every push:

- [ ] `.env` is in `.gitignore`
- [ ] `.env` is NOT staged (`git status` shows clean)
- [ ] `.env` is NOT tracked (`git ls-files` doesn't show it)
- [ ] No API keys in source code
- [ ] No API keys in config files
- [ ] `.env` file permissions: `600` (owner read/write only)
- [ ] `.env.example` exists as template
- [ ] Run security check script

## 📚 Resources

- [GitHub: Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [12 Factor App: Config](https://12factor.net/config)

---

**Remember:** Once committed to git history, secrets are difficult to fully remove. Always verify before pushing!

