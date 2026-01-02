# Railway Deployment Plan

## Overview
This document outlines the steps to deploy the Raindrop MCP server to Railway and set up a new GitHub repository.

## Phase 1: GitHub Repository Setup

### 1.1 Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit: Raindrop MCP server"
```

### 1.2 Update package.json for New Repo
- Update `repository.url` to point to your new GitHub repo
- Consider updating package name if forking/cloning (optional)
- Update `homepage` and `bugs.url` if needed

### 1.3 Create GitHub Repository
1. Create a new repository on GitHub (public or private)
2. Add remote:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

### 1.4 Files to Review Before Committing
- ✅ `.gitignore` - Already configured (excludes `.env`, `build/`, `node_modules/`)
- ✅ `README.md` - Update with new repo info if needed
- ⚠️ `.env` - Should NOT be committed (already in .gitignore)
- ✅ `package.json` - Update repository URLs

## Phase 2: Railway Configuration

### 2.1 Railway Requirements
Railway needs:
- **Build Command**: `bun install && bun run build`
- **Start Command**: `bun run start:http` (for HTTP server) or `bun start` (for STDIO)
- **Port**: Railway provides `PORT` env var (we need to update server.ts)
- **Environment Variables**: `RAINDROP_ACCESS_TOKEN` (required)

### 2.2 Files to Create

#### Option A: Using Railway's Auto-Detection (Recommended)
Railway auto-detects Bun projects, but we can create:

**`railway.json`** (optional, for custom config):
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "bun install && bun run build"
  },
  "deploy": {
    "startCommand": "bun run start:http",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### Option B: Using Procfile (Alternative)
**`Procfile`**:
```
web: bun run start:http
```

### 2.3 Update Server Configuration

**Update `src/server.ts`** to use Railway's `PORT`:
```typescript
// Change from:
const PORT = process.env.HTTP_PORT ? parseInt(process.env.HTTP_PORT) : 3002;

// To:
const PORT = process.env.PORT || process.env.HTTP_PORT ? parseInt(process.env.HTTP_PORT || process.env.PORT || '3002') : 3002;
// Or simpler:
const PORT = parseInt(process.env.PORT || process.env.HTTP_PORT || '3002');
```

### 2.4 Environment Variables for Railway

Create **`.env.example`** (if not exists):
```env
# Required
RAINDROP_ACCESS_TOKEN=your_raindrop_token_here

# Optional - Server Configuration
HTTP_PORT=3002
PORT=3002

# Optional - OAuth (if using OAuth flow)
RAINDROP_CLIENT_ID=your_client_id
RAINDROP_CLIENT_SECRET=your_client_secret
RAINDROP_REDIRECT_URI=https://your-app.railway.app/auth/raindrop/callback

# Optional - Logging
LOG_LEVEL=info
NODE_ENV=production
```

### 2.5 Railway Deployment Steps

1. **Connect GitHub Repo to Railway**
   - Go to Railway dashboard
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect Bun

2. **Configure Environment Variables**
   - In Railway project settings, add:
     - `RAINDROP_ACCESS_TOKEN` (required)
     - `PORT` (Railway sets this automatically, but can override)
     - `NODE_ENV=production` (optional)

3. **Configure Build & Start**
   - Build Command: `bun install && bun run build`
   - Start Command: `bun run start:http`
   - Or let Railway auto-detect (it should work)

4. **Deploy**
   - Railway will automatically deploy on push to main branch
   - Or trigger manual deployment

## Phase 3: Testing & Verification

### 3.1 Local Testing
Before deploying, test production build locally:
```bash
# Build
bun run build

# Test with Railway-like environment
PORT=3002 RAINDROP_ACCESS_TOKEN=your_token bun run start:http
```

### 3.2 Post-Deployment Checks
1. Check Railway logs for startup errors
2. Test health endpoint: `https://your-app.railway.app/health`
3. Test MCP endpoint: `POST https://your-app.railway.app/mcp`
4. Verify environment variables are set correctly

## Phase 4: Documentation Updates

### 4.1 Update README.md
Add Railway deployment section:
```markdown
## Railway Deployment

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template)

1. Click the button above or create a new Railway project
2. Connect your GitHub repository
3. Add environment variable: `RAINDROP_ACCESS_TOKEN`
4. Deploy!

The server will be available at `https://your-app.railway.app`
```

### 4.2 Create Railway-Specific Docs (Optional)
Create `RAILWAY.md` with:
- Deployment instructions
- Environment variable setup
- Troubleshooting guide
- Cost estimates (if applicable)

## Checklist

- [ ] Initialize git repository
- [ ] Update package.json repository URLs
- [ ] Create/update .env.example
- [ ] Update src/server.ts to use PORT env var
- [ ] Create railway.json or Procfile
- [ ] Test build locally
- [ ] Test start:http locally with PORT env var
- [ ] Push to GitHub
- [ ] Connect Railway to GitHub repo
- [ ] Configure Railway environment variables
- [ ] Deploy to Railway
- [ ] Verify deployment works
- [ ] Update README with Railway deployment info

## Notes

- Railway supports Bun natively, so no Dockerfile needed
- The HTTP server (`start:http`) is better for Railway than STDIO
- Railway provides HTTPS automatically
- Consider setting up a custom domain if needed
- Monitor Railway logs for any issues

