# 📋 Available Models - Droid CLI Compatible

## Anthropic Models

All models below are compatible with Droid CLI and your relay service.

### Claude Opus 4 Series

**1. Claude Opus 4.1** (Latest Opus)
```
Model ID: claude-opus-4-1-20250805
Display Name: Claude Opus 4.1
Use Case: Most advanced reasoning, complex tasks
```

**2. Claude Opus 4**
```
Model ID: claude-opus-4-20250514
Display Name: Claude Opus 4
Use Case: Advanced reasoning, detailed analysis
```

---

### Claude Sonnet 4 Series (Recommended)

**3. Claude Sonnet 4.5** ⭐ **RECOMMENDED**
```
Model ID: claude-sonnet-4-5-20250929
Display Name: Claude Sonnet 4.5
Use Case: Best balance of speed and intelligence for coding
Max Tokens: 8192
```

**4. Claude Sonnet 4**
```
Model ID: claude-sonnet-4-20250514
Display Name: Claude Sonnet 4
Use Case: Fast, intelligent coding assistant
```

---

### Claude Sonnet 3 Series

**5. Claude 3.7 Sonnet**
```
Model ID: claude-3-7-sonnet-20250219
Display Name: Claude 3.7 Sonnet
Use Case: Balanced performance and cost
```

---

### Claude Haiku Series (Fast & Affordable)

**6. Claude 3.5 Haiku**
```
Model ID: claude-3-5-haiku-20241022
Display Name: Claude 3.5 Haiku
Use Case: Quick responses, simple tasks
```

---

## OpenAI Models (GPT-5)

**7. GPT-5** (Latest)
```
Model ID: gpt-5-2025-08-07
Display Name: GPT-5 (Latest)
Use Case: Latest GPT-5 via Factory.ai
Max Tokens: 16384
```

**8. GPT-5** (Alias)
```
Model ID: gpt-5
Display Name: GPT-5
Use Case: Same as gpt-5-2025-08-07
```

**9. GPT-5 Codex**
```
Model ID: gpt-5-codex
Display Name: GPT-5 Codex
Use Case: Code generation and editing
Max Tokens: 16384
```

---

## Usage in Tools

### Roo Cline / Cline Configuration

```json
{
  "provider": "Anthropic",
  "baseUrl": "https://claude-relay-service-0rdd.onrender.com",
  "apiKey": "droid-4834935040543",
  "model": "claude-sonnet-4-5-20250929"
}
```

**Available Model Choices:**
- `claude-opus-4-1-20250805` - Most powerful
- `claude-sonnet-4-5-20250929` - ⭐ Best for coding
- `claude-sonnet-4-20250514` - Fast coding
- `claude-3-7-sonnet-20250219` - Balanced
- `claude-3-5-haiku-20241022` - Fastest

---

### Kilo Configuration

```json
{
  "kilo.provider": "anthropic",
  "kilo.apiEndpoint": "https://claude-relay-service-0rdd.onrender.com/v1",
  "kilo.apiKey": "droid-4834935040543",
  "kilo.model": "claude-sonnet-4-5-20250929"
}
```

---

### Droid CLI Configuration

Add to `~/.factory/config.json`:

```json
{
  "custom_models": [
    {
      "model_display_name": "Sonnet 4.5 [relay]",
      "model": "claude-sonnet-4-5-20250929",
      "base_url": "https://claude-relay-service-0rdd.onrender.com",
      "api_key": "droid-4834935040543",
      "provider": "anthropic",
      "max_tokens": 8192
    },
    {
      "model_display_name": "Opus 4.1 [relay]",
      "model": "claude-opus-4-1-20250805",
      "base_url": "https://claude-relay-service-0rdd.onrender.com",
      "api_key": "droid-4834935040543",
      "provider": "anthropic",
      "max_tokens": 8192
    },
    {
      "model_display_name": "GPT-5 Codex [relay]",
      "model": "gpt-5-codex",
      "base_url": "https://claude-relay-service-0rdd.onrender.com/openai",
      "api_key": "droid-4834935040543",
      "provider": "openai",
      "max_tokens": 16384
    }
  ]
}
```

---

## Testing Models

### List All Available Models

```bash
curl -H "x-api-key: droid-4834935040543" \
  https://claude-relay-service-0rdd.onrender.com/v1/models
```

**Response:**
```json
{
  "object": "list",
  "data": [
    {"id": "claude-opus-4-20250514", ...},
    {"id": "claude-opus-4-1-20250805", ...},
    {"id": "claude-sonnet-4-5-20250929", ...},
    {"id": "claude-sonnet-4-20250514", ...},
    {"id": "claude-3-7-sonnet-20250219", ...},
    {"id": "claude-3-5-haiku-20241022", ...}
  ]
}
```

---

### Test Specific Model

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

## Model Recommendations by Use Case

| Use Case | Recommended Model | Reason |
|----------|-------------------|--------|
| **Coding (Roo/Cline)** | `claude-sonnet-4-5-20250929` | Best balance |
| **Complex Analysis** | `claude-opus-4-1-20250805` | Most powerful |
| **Quick Tasks** | `claude-3-5-haiku-20241022` | Fastest |
| **OpenAI Format** | `gpt-5-codex` | Code generation |
| **General Use** | `claude-sonnet-4-20250514` | Fast & reliable |

---

## Model Aliases

Some tools may recognize shortened names:
- `sonnet` → `claude-sonnet-4-5-20250929`
- `opus` → `claude-opus-4-1-20250805`
- `haiku` → `claude-3-5-haiku-20241022`

Note: Aliases depend on tool implementation.

---

## Rate Limits & Pricing

All models use your Factory.ai account limits. Check your Factory.ai dashboard for:
- Request limits
- Token usage
- Pricing per model

**General Guidelines:**
- Opus models: Higher cost, best quality
- Sonnet models: Balanced cost/performance
- Haiku models: Lower cost, faster responses

---

## Updating Models

To add new models as Factory.ai releases them:

1. Edit `src/config/hardcoded.js`
2. Add new model to `MODELS.anthropic` array:
   ```javascript
   {
     id: 'new-model-id',
     object: 'model',
     created: Date.now(),
     owned_by: 'anthropic',
     display_name: 'New Model Name'
   }
   ```
3. Commit and redeploy

---

## Model Support Matrix

| Model | Roo/Cline | Kilo | Droid CLI | API Direct |
|-------|-----------|------|-----------|------------|
| Opus 4.1 | ✅ | ✅ | ✅ | ✅ |
| Opus 4 | ✅ | ✅ | ✅ | ✅ |
| Sonnet 4.5 | ✅ | ✅ | ✅ | ✅ |
| Sonnet 4 | ✅ | ✅ | ✅ | ✅ |
| Sonnet 3.7 | ✅ | ✅ | ✅ | ✅ |
| Haiku 3.5 | ✅ | ✅ | ✅ | ✅ |
| GPT-5 | ❌ | ✅ | ✅ | ✅ |
| GPT-5 Codex | ❌ | ✅ | ✅ | ✅ |

---

**Last Updated:** 2025-11-16
**Total Models:** 9 (6 Anthropic + 3 OpenAI)
