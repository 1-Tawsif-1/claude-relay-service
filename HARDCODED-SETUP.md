# Hardcoded Factory.ai Relay - Quick Deployment Guide

## ✅ ZERO Configuration Required!

Your Factory.ai API key is already hardcoded. Just deploy and use!

### Factory.ai API Key (Already Hardcoded)
```
fk-cIYxJ50mTC4YGoq2rg26-nYQ3TNEZZ_0ROgIjM1_0xttohJTXJ-c0ww7trUYlnpU
```

### Your Custom API Key (Already Created)
```
droid-4834935040543
```

---

## 🚀 Deploy to Render.com

### Step 1: Update Start Command

1. Go to Render Dashboard → Your Service (`claude-relay-service-0rdd`)
2. Click **"Settings"** in left sidebar
3. Find **"Start Command"** section
4. Replace with:
   ```bash
   npm run start:simple
   ```
5. Click **"Save Changes"**

### Step 2: Remove All Environment Variables (Optional)

Since everything is hardcoded, you can remove these if you want:
- JWT_SECRET ❌ (not needed)
- ENCRYPTION_KEY ❌ (not needed)
- REDIS_HOST ❌ (not needed)
- All other variables ❌ (not needed)

**Keep only these (optional):**
```
PORT=3000
NODE_ENV=production
```

### Step 3: Deploy

Click **"Manual Deploy"** → Wait ~2 minutes → Done!

---

## 📱 Your Service URLs

### Base URL
```
https://claude-relay-service-0rdd.onrender.com
```

### Endpoints
```
✅ POST   https://claude-relay-service-0rdd.onrender.com/v1/messages
✅ GET    https://claude-relay-service-0rdd.onrender.com/v1/models
✅ POST   https://claude-relay-service-0rdd.onrender.com/openai/v1/chat/completions
✅ GET    https://claude-relay-service-0rdd.onrender.com/health
```

---

## 🛠️ Tool Configuration

### 1. Roo Cline (VS Code Extension)

**Open Roo Settings:**
1. Click Roo Cline icon in VS Code sidebar
2. Click gear icon (⚙️)
3. Enter these settings:

```
Provider: Anthropic
API Provider: Custom
Base URL: https://claude-relay-service-0rdd.onrender.com
API Key: droid-4834935040543
Model: claude-sonnet-4-5-20250929
```

**Important for Roo:**
- ✅ Use base URL **WITHOUT** `/v1` at the end
- ✅ Roo will automatically append `/v1/messages`

---

### 2. Cline (VS Code Extension)

**Open Cline Settings:**
1. Cmd/Ctrl+Shift+P → "Cline: Open Settings"
2. Configure:

```
Provider: Anthropic
API Provider: Custom / Other
Base URL: https://claude-relay-service-0rdd.onrender.com
API Key: droid-4834935040543
Model: claude-sonnet-4-5-20250929
```

**Settings File Location:**
- VS Code Settings → Extensions → Cline
- Or edit `.vscode/settings.json`:

```json
{
  "cline.provider": "anthropic",
  "cline.apiBaseUrl": "https://claude-relay-service-0rdd.onrender.com",
  "cline.apiKey": "droid-4834935040543",
  "cline.model": "claude-sonnet-4-5-20250929"
}
```

---

### 3. Kilo (AI Coding Assistant)

**Option A: Via Settings UI**
1. Open Kilo settings
2. Configure:

```
Provider: Anthropic
Base URL: https://claude-relay-service-0rdd.onrender.com/v1
API Key: droid-4834935040543
Model: claude-sonnet-4-5-20250929
```

**Option B: Edit Config File**

Edit `~/.kilo/config.json` or workspace settings:

```json
{
  "kilo.provider": "anthropic",
  "kilo.apiEndpoint": "https://claude-relay-service-0rdd.onrender.com/v1",
  "kilo.apiKey": "droid-4834935040543",
  "kilo.model": "claude-sonnet-4-5-20250929"
}
```

---

## 🎯 Provider & Base URL Quick Reference

| Tool | Provider | Base URL | Include /v1? |
|------|----------|----------|--------------|
| **Roo Cline** | Anthropic | `https://claude-relay-service-0rdd.onrender.com` | ❌ NO |
| **Cline** | Anthropic | `https://claude-relay-service-0rdd.onrender.com` | ❌ NO |
| **Kilo** | Anthropic | `https://claude-relay-service-0rdd.onrender.com/v1` | ✅ YES |

**API Key for ALL tools:**
```
droid-4834935040543
```

---

## 🔍 Test Your Setup

### Test 1: Health Check
```bash
curl https://claude-relay-service-0rdd.onrender.com/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "mode": "hardcoded",
  "timestamp": "2025-11-16T...",
  "factory_connected": true
}
```

---

### Test 2: List Models
```bash
curl -H "x-api-key: droid-4834935040543" \
  https://claude-relay-service-0rdd.onrender.com/v1/models
```

**Expected Response:**
```json
{
  "object": "list",
  "data": [
    {"id": "claude-opus-4-20250514", ...},
    {"id": "claude-sonnet-4-20250514", ...},
    {"id": "claude-sonnet-4-5-20250929", ...},
    {"id": "claude-3-7-sonnet-20250219", ...}
  ]
}
```

---

### Test 3: Send Message
```bash
curl -X POST https://claude-relay-service-0rdd.onrender.com/v1/messages \
  -H "x-api-key: droid-4834935040543" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 100,
    "messages": [{"role": "user", "content": "Say hello!"}]
  }'
```

**Expected:** Response from Claude

---

## 🔑 Generate More API Keys

### Using Web Interface

Visit: `https://claude-relay-service-0rdd.onrender.com/api-keys/generate`

**POST Request:**
```bash
curl -X POST https://claude-relay-service-0rdd.onrender.com/api-keys/generate \
  -H "content-type: application/json" \
  -d '{"name": "My New Key"}'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "key": "droid-1731747123456",
    "name": "My New Key",
    "enabled": true,
    "message": "⚠️ This key is stored in memory only. Add it to src/config/hardcoded.js to persist."
  }
}
```

**⚠️ Important:** Keys generated via API are **temporary** (lost on restart). To make them permanent, add to `src/config/hardcoded.js`:

```javascript
CUSTOM_API_KEYS: [
  {
    key: 'droid-4834935040543',
    name: 'My Droid Key',
    enabled: true,
    createdAt: new Date().toISOString()
  },
  // Add new keys here:
  {
    key: 'droid-1731747123456',
    name: 'My New Key',
    enabled: true,
    createdAt: new Date().toISOString()
  }
]
```

---

## 🛡️ Avoiding 405 Errors

**405 Error** = "Method Not Allowed"

### Common Causes & Fixes:

1. **Wrong HTTP Method**
   - ❌ `GET /v1/messages` → Use POST
   - ✅ `POST /v1/messages`

2. **Wrong Endpoint**
   - ❌ `/v1/message` (singular)
   - ✅ `/v1/messages` (plural)

3. **Missing Headers**
   ```bash
   # Always include:
   -H "x-api-key: your-key"
   -H "anthropic-version: 2023-06-01"
   -H "content-type: application/json"
   ```

4. **Tool Configuration**
   - Ensure tool sends `POST` requests to `/v1/messages`
   - Check tool logs for actual URL being called

---

## 🚨 Avoiding Account Deactivation

### Factory.ai Account Safety Tips:

1. **Don't Spam Requests**
   - Space out requests by 1-2 seconds
   - Don't run massive parallel requests

2. **Use Reasonable Rate Limits**
   - Max 10 requests per minute is safe
   - Burst limit: 3 concurrent requests

3. **Don't Share Your Relay Publicly**
   - Only share with trusted users
   - Don't post your base URL on public forums

4. **Monitor Usage**
   ```bash
   # Check if service is healthy
   curl https://claude-relay-service-0rdd.onrender.com/health
   ```

5. **Rotate API Keys Periodically**
   - Generate new relay keys every month
   - Disable old keys in `hardcoded.js`

6. **Watch for Errors**
   - 429 = Rate limited (slow down!)
   - 401 = Invalid Factory key (check hardcoded.js)
   - 403 = Account blocked (stop using immediately)

---

## 📊 Available Models

### Anthropic Models (Use with Roo, Cline, Kilo)
```
✅ claude-opus-4-20250514
✅ claude-sonnet-4-20250514
✅ claude-sonnet-4-5-20250929  ← Recommended
✅ claude-3-7-sonnet-20250219
```

### OpenAI Models (If using OpenAI format)
```
✅ gpt-5-2025-08-07
✅ gpt-5
```

**Recommended Model:**
```
claude-sonnet-4-5-20250929
```

---

## 🎯 Quick Start Checklist

- [ ] Deploy with `npm run start:simple` command
- [ ] Test health: `curl .../health`
- [ ] Test models: `curl -H "x-api-key: droid-4834935040543" .../v1/models`
- [ ] Configure Roo Cline:
  - Provider: Anthropic
  - Base URL: `https://claude-relay-service-0rdd.onrender.com`
  - API Key: `droid-4834935040543`
- [ ] Configure Cline: (same as Roo)
- [ ] Configure Kilo:
  - Provider: Anthropic
  - Base URL: `https://claude-relay-service-0rdd.onrender.com/v1`
  - API Key: `droid-4834935040543`
- [ ] Test sending a message from your tool
- [ ] Monitor for errors in first hour

---

## 🆘 Troubleshooting

### Service Won't Start
```bash
# Check Render logs for errors
# Common fix: Update start command to "npm run start:simple"
```

### 401 Unauthorized
```bash
# Wrong API key
# Solution: Use "droid-4834935040543"
```

### 405 Method Not Allowed
```bash
# Tool is using wrong HTTP method or endpoint
# Check tool sends POST to /v1/messages
```

### Slow Responses (Render Free Tier)
```bash
# First request after 15min idle = ~30-60s cold start
# Subsequent requests are fast
# Upgrade to paid tier ($7/mo) to avoid cold starts
```

### Factory.ai 429 Rate Limit
```bash
# Too many requests
# Solution: Add delays between requests (1-2 sec minimum)
```

---

## 📞 Support

**Service URL:**
```
https://claude-relay-service-0rdd.onrender.com
```

**API Key:**
```
droid-4834935040543
```

**Your Factory Key (hardcoded):**
```
fk-cIYxJ50mTC4YGoq2rg26-nYQ3TNEZZ_0ROgIjM1_0xttohJTXJ-c0ww7trUYlnpU
```

---

**You're all set! 🎉 Just deploy and start coding with your tools!**
