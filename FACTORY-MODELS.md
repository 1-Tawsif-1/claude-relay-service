# 🎯 Factory.ai Supported Models (EXACT LIST)

These are the **ONLY** models available through your Factory.ai Droid account.

---

## 📊 Complete Model List (8 Models)

### Claude Models (3 models)

| Model | ID | Cost | Best For |
|-------|-----|------|----------|
| **Opus 4.1** | `claude-opus-4-1-20250805` | 6x | Most powerful, complex reasoning |
| **Sonnet 4.5** ⭐ | `claude-sonnet-4-5-20250929` | 1.2x | **Recommended for coding** |
| **Haiku 4.5** | `claude-haiku-4-5-20250514` | 0.4x | Fastest, simple tasks |

---

### GPT Models (4 models)

| Model | ID | Cost | Best For |
|-------|-----|------|----------|
| **GPT-5.1-Codex (Low)** | `gpt-5-1-codex-low` | 0.5x | Current model, code generation |
| **GPT-5.1** | `gpt-5-1` | 0.5x | Latest GPT-5 variant |
| **GPT-5-Codex** | `gpt-5-codex` | 0.5x | Code-focused GPT-5 |
| **GPT-5** | `gpt-5` | 0.5x | Standard GPT-5 |

---

### Other Models (1 model)

| Model | ID | Cost | Best For |
|-------|-----|------|----------|
| **Droid Core (GLM-4.6)** | `glm-4-6` | 0.25x | Cheapest option |

---

## 🎯 Recommended Configurations

### For Roo Cline / Cline (Anthropic Provider)

**Best for coding:**
```
Provider: Anthropic
Base URL: https://claude-relay-service-0rdd.onrender.com
API Key: droid-4834935040543
Model: claude-sonnet-4-5-20250929
```

**Most powerful:**
```
Model: claude-opus-4-1-20250805
```

**Fastest:**
```
Model: claude-haiku-4-5-20250514
```

---

### For Kilo (Anthropic Provider)

```json
{
  "kilo.provider": "anthropic",
  "kilo.apiEndpoint": "https://claude-relay-service-0rdd.onrender.com/v1",
  "kilo.apiKey": "droid-4834935040543",
  "kilo.model": "claude-sonnet-4-5-20250929"
}
```

**Available Claude models:**
- `claude-opus-4-1-20250805`
- `claude-sonnet-4-5-20250929` ⭐ Recommended
- `claude-haiku-4-5-20250514`

---

### For Droid CLI

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
      "model_display_name": "GPT-5.1-Codex [relay]",
      "model": "gpt-5-1-codex-low",
      "base_url": "https://claude-relay-service-0rdd.onrender.com/openai",
      "api_key": "droid-4834935040543",
      "provider": "openai",
      "max_tokens": 16384
    },
    {
      "model_display_name": "Droid Core [relay]",
      "model": "glm-4-6",
      "base_url": "https://claude-relay-service-0rdd.onrender.com/openai",
      "api_key": "droid-4834935040543",
      "provider": "openai",
      "max_tokens": 8192
    }
  ]
}
```

---

## 🧪 Test Models

### List All Models

```bash
curl -H "x-api-key: droid-4834935040543" \
  https://claude-relay-service-0rdd.onrender.com/v1/models
```

**Expected Response (8 models):**
```json
{
  "object": "list",
  "data": [
    {
      "id": "claude-opus-4-1-20250805",
      "display_name": "Opus 4.1",
      "cost_multiplier": "6x"
    },
    {
      "id": "claude-sonnet-4-5-20250929",
      "display_name": "Sonnet 4.5",
      "cost_multiplier": "1.2x"
    },
    {
      "id": "claude-haiku-4-5-20250514",
      "display_name": "Haiku 4.5",
      "cost_multiplier": "0.4x"
    },
    {
      "id": "gpt-5-1-codex-low",
      "display_name": "GPT-5.1-Codex (Low)",
      "cost_multiplier": "0.5x"
    },
    {
      "id": "gpt-5-1",
      "display_name": "GPT-5.1",
      "cost_multiplier": "0.5x"
    },
    {
      "id": "gpt-5-codex",
      "display_name": "GPT-5-Codex",
      "cost_multiplier": "0.5x"
    },
    {
      "id": "gpt-5",
      "display_name": "GPT-5",
      "cost_multiplier": "0.5x"
    },
    {
      "id": "glm-4-6",
      "display_name": "Droid Core (GLM-4.6)",
      "cost_multiplier": "0.25x"
    }
  ]
}
```

---

### Test Claude Sonnet 4.5

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

### Test GPT-5.1-Codex

```bash
curl -X POST https://claude-relay-service-0rdd.onrender.com/openai/v1/chat/completions \
  -H "Authorization: Bearer droid-4834935040543" \
  -H "content-type: application/json" \
  -d '{
    "model": "gpt-5-1-codex-low",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

---

## 💰 Cost Comparison

| Model | Cost Multiplier | Relative Cost |
|-------|----------------|---------------|
| **Droid Core** | 0.25x | 💲 Cheapest |
| **Haiku 4.5** | 0.4x | 💲💲 Very cheap |
| **GPT-5.1-Codex** | 0.5x | 💲💲 Cheap |
| **GPT-5.1** | 0.5x | 💲💲 Cheap |
| **GPT-5-Codex** | 0.5x | 💲💲 Cheap |
| **GPT-5** | 0.5x | 💲💲 Cheap |
| **Sonnet 4.5** | 1.2x | 💲💲💲 Moderate |
| **Opus 4.1** | 6x | 💲💲💲💲💲💲 Most expensive |

---

## 🎯 Which Model to Use?

### For Coding (Roo, Cline, Kilo):
✅ **Sonnet 4.5** (`claude-sonnet-4-5-20250929`)
- Best balance of intelligence and cost
- Excellent code generation
- 1.2x cost multiplier

### For Complex Tasks:
✅ **Opus 4.1** (`claude-opus-4-1-20250805`)
- Most powerful reasoning
- Deep analysis
- 6x cost (expensive!)

### For Quick Tasks:
✅ **Haiku 4.5** (`claude-haiku-4-5-20250514`)
- Fastest responses
- Simple queries
- 0.4x cost

### For Budget Coding:
✅ **GPT-5.1-Codex (Low)** (`gpt-5-1-codex-low`)
- Code generation
- Half the cost of Sonnet
- 0.5x cost

### For Ultra Budget:
✅ **Droid Core** (`glm-4-6`)
- Cheapest option
- Basic tasks only
- 0.25x cost

---

## ⚠️ Important Notes

1. **ONLY 8 models are supported** by your Factory.ai account
2. **No other Claude models** (Sonnet 4, Sonnet 3.7, Haiku 3.5, etc.) are available
3. **Haiku 4.5** is available (not 3.5)
4. **GPT-5.1** variants are the latest OpenAI models
5. **Droid Core (GLM-4.6)** is a ZhipuAI model, not Claude/GPT

---

## 🚀 Default Recommendations

**Default for all tools:**
```
Model: claude-sonnet-4-5-20250929
```

**Alternative (cheaper):**
```
Model: claude-haiku-4-5-20250514
```

**Alternative (most powerful):**
```
Model: claude-opus-4-1-20250805
```

---

**Total Models: 8**
- 3 Claude models
- 4 GPT models
- 1 Droid Core model
