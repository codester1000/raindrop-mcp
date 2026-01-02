# GitHub Repository Setup Instructions

## Option 1: Create Repository on GitHub (Recommended)

1. **Go to GitHub**: https://github.com/new
2. **Repository name**: `raindrop-mcp`
3. **Description**: `MCP Server for Raindrop.io bookmark management with Railway deployment support`
4. **Visibility**: Public (or Private if you prefer)
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click **"Create repository"**

## Option 2: Push to Existing Repository

After creating the repo on GitHub, run these commands:

```bash
cd /Users/codymccarney/Documents/Personal\ Code/raindrop-mcp

# Remove any existing remote
git remote remove origin 2>/dev/null || true

# Add your new remote (replace codester1000 with your actual GitHub username)
git remote add origin https://github.com/codester1000/raindrop-mcp.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## If Using SSH Instead of HTTPS

```bash
git remote add origin git@github.com:codester1000/raindrop-mcp.git
git branch -M main
git push -u origin main
```

## Verify

After pushing, verify at: https://github.com/codester1000/raindrop-mcp

