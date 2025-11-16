# 🚀 Hardcoded Factory.ai Relay - ZERO Configuration

## ✅ What's Hardcoded

- ✅ Factory.ai API Key: `fk-cIYxJ50mTC4YGoq2rg26-nYQ3TNEZZ_0ROgIjM1_0xttohJTXJ-c0ww7trUYlnpU`
- ✅ Custom API Key: `droid-4834935040543`
- ✅ All 8 Factory.ai models configured
- ✅ NO environment variables required
- ✅ NO Redis required
- ✅ NO database required

---

## 🐳 Render.com Deployment (Using Dockerfile.simple)

### Step 1: Configure Dockerfile in Render

1. Go to: https://dashboard.render.com
2. Click your service: `claude-relay-service-0rdd`
3. Click **"Settings"** (left sidebar)
4. Scroll to **"Build & Deploy"** section
5. Find **"Dockerfile Path"**
6. Change to:
   ```
   Dockerfile.simple
   ```
7. Find **"Docker Command"** (or Start Command)
8. Change to:
   ```
   node server-simple.js
   ```
9. Click **"Save Changes"**

### Step 2: Remove All Environment Variables (Optional)

Since everything is hardcoded, you can remove ALL environment variables:
- ❌ JWT_SECRET (not needed)
- ❌ ENCRYPTION_KEY (not needed)
- ❌ REDIS_HOST (not needed)
- ❌ REDIS_PORT (not needed)
- ❌ REDIS_PASSWORD (not needed)

**Keep only these (optional):**
```
PORT=3000
NODE_ENV=production
```

### Step 3: Deploy

1. Click **"Manual Deploy"** at top right
2. Select **"Clear build cache & deploy"**
3. Wait 2-3 minutes for deployment
4. ✅ Done!

---

## 🧪 Test Deployment

### Health Check
```bash
curl https://claude-relay-service-0rdd.onrender.com/health
```

**Expected:**
```json
{
  "status": "healthy",
  "mode": "hardcoded",
  "timestamp": "2025-11-16T...",
  "factory_connected": true
}
```

### List Models (Should show 8 models)
```bash
curl -H "x-api-key: droid-4834935040543" \
  https://claude-relay-service-0rdd.onrender.com/v1/models
```

### Send Test Message
```bash
curl -X POST https://claude-relay-service-0rdd.onrender.com/v1/messages \
  -H "x-api-key: droid-4834935040543" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 100,
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

---

## 🛠️ Configure Your Tools

### Roo Cline
```
Provider: Anthropic
Base URL: https://claude-relay-service-0rdd.onrender.com
API Key: droid-4834935040543
Model: claude-sonnet-4-5-20250929
```

### Cline
```
Provider: Anthropic
Base URL: https://claude-relay-service-0rdd.onrender.com
API Key: droid-4834935040543
Model: claude-sonnet-4-5-20250929
```

### Kilo
```json
{
  "kilo.provider": "anthropic",
  "kilo.apiEndpoint": "https://claude-relay-service-0rdd.onrender.com/v1",
  "kilo.apiKey": "droid-4834935040543",
  "kilo.model": "claude-sonnet-4-5-20250929"
}
```

---

## 📊 Available Models (8 Total)

### Claude (3):
- `claude-opus-4-1-20250805` (6x cost)
- `claude-sonnet-4-5-20250929` ⭐ Recommended (1.2x cost)
- `claude-haiku-4-5-20250514` (0.4x cost)

### GPT (4):
- `gpt-5-1-codex-low` (0.5x cost)
- `gpt-5-1` (0.5x cost)
- `gpt-5-codex` (0.5x cost)
- `gpt-5` (0.5x cost)

### Droid Core (1):
- `glm-4-6` (0.25x cost)

---

## 🚨 Troubleshooting

### Still Getting "JWT_SECRET not set" Error?

This means Render is still using the old `Dockerfile` instead of `Dockerfile.simple`.

**Fix:**
1. Go to Render Settings
2. Change **"Dockerfile Path"** to `Dockerfile.simple`
3. Redeploy

### Alternative: Delete docker-entrypoint.sh checks

If you can't change Dockerfile path, we can modify `docker-entrypoint.sh` to skip checks.

---

## ✅ What This Dockerfile Does

1. **No Frontend Build** - Skips web admin (not needed for API only)
2. **No Environment Checks** - No JWT_SECRET, ENCRYPTION_KEY validation
3. **Direct Start** - Runs `server-simple.js` immediately
4. **Minimal Dependencies** - Only installs production npm packages
5. **Health Check Built-in** - `/health` endpoint for monitoring

---

## 📦 Files Used

- `Dockerfile.simple` - Zero-config Docker image
- `server-simple.js` - Simple server (no Redis)
- `src/config/hardcoded.js` - All configuration
- `src/middleware/simpleAuth.js` - API key auth
- `src/routes/simpleRoutes.js` - API routes
- `src/services/simpleFactoryRelay.js` - Factory.ai forwarding
- `public/index.html` - Web interface

---

## 🎯 Summary

**Zero Configuration Needed:**
- ✅ No environment variables
- ✅ No Redis setup
- ✅ No manual configuration
- ✅ Everything hardcoded
- ✅ Just deploy and use

**Your Credentials:**
- API Key: `droid-4834935040543`
- Base URL: `https://claude-relay-service-0rdd.onrender.com`
- Model: `claude-sonnet-4-5-20250929`

**Just change Dockerfile path to `Dockerfile.simple` and redeploy!** 🚀
