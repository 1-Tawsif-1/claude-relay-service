# AI Coding Assistants Configuration Guide

This guide explains how to configure AI coding assistants (Roo Code, Cline, Kilo, Continue.dev, Cursor, etc.) to use your Claude Relay Service with unified `/v1` endpoints.

## Table of Contents

- [Overview](#overview)
- [Unified Endpoint Structure](#unified-endpoint-structure)
- [Supported AI Coding Assistants](#supported-ai-coding-assistants)
  - [Roo Code](#roo-code)
  - [Cline (VS Code Extension)](#cline-vs-code-extension)
  - [Kilo](#kilo)
  - [Continue.dev](#continuedev)
  - [Cursor](#cursor)
- [Available Models](#available-models)
- [Authentication](#authentication)
- [Endpoint Reference](#endpoint-reference)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## Overview

Your Claude Relay Service now provides **OpenAI-compatible** `/v1` endpoints at the root level, making it compatible with all major AI coding assistants. The service supports intelligent backend routing that automatically detects and routes to the correct provider (Claude, OpenAI, Gemini, Droid) based on the model name.

### Key Features

✅ **Universal Compatibility**: OpenAI-compatible API format
✅ **Intelligent Routing**: Automatic provider detection from model names
✅ **Multi-Provider Support**: Claude, OpenAI, Gemini, Droid/Factory.ai
✅ **Unified Model Listing**: Single endpoint to list all available models
✅ **Native Format Support**: Both OpenAI (`/v1/chat/completions`) and Anthropic (`/v1/messages`) formats

---

## Unified Endpoint Structure

All endpoints are now available at the root `/v1` path:

```
Base URL: https://claude-relay-service-0rdd.onrender.com

OpenAI-Compatible Endpoints:
  POST   /v1/chat/completions       - Chat completions (smart routing)
  POST   /v1/completions            - Legacy completions
  GET    /v1/models                 - List all models
  GET    /v1/models/{model}         - Get model details

Anthropic-Native Endpoints:
  POST   /v1/messages               - Claude messages (native format)
  POST   /v1/messages/count_tokens  - Token counting (beta)

Utility Endpoints:
  GET    /v1/me                     - Current user info
  GET    /v1/key-info               - API key details
  GET    /v1/usage                  - Usage statistics
```

---

## Supported AI Coding Assistants

### Roo Code

**Website**: https://roo.dev

**Configuration**:

```json
{
  "providers": [
    {
      "name": "Claude Relay",
      "type": "anthropic",
      "baseURL": "https://claude-relay-service-0rdd.onrender.com",
      "apiKey": "droid-4834935040543"
    }
  ]
}
```

**Recommended Models**:
- `claude-sonnet-4-5-20250929` (Latest Sonnet)
- `claude-opus-4-1-20250805` (Most capable)
- `claude-haiku-4-5-20250514` (Fast responses)

---

### Cline (VS Code Extension)

**Marketplace**: [Cline - VS Code Extension](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev)

**Configuration** (Settings → Extensions → Cline):

1. **Provider**: Custom OpenAI-Compatible
2. **Base URL**: `https://claude-relay-service-0rdd.onrender.com/v1`
3. **API Key**: `droid-4834935040543`
4. **Model**: Choose from dropdown or enter manually

**Settings JSON** (`settings.json`):

```json
{
  "cline.apiProvider": "openai-compatible",
  "cline.apiBaseUrl": "https://claude-relay-service-0rdd.onrender.com/v1",
  "cline.apiKey": "droid-4834935040543",
  "cline.model": "claude-sonnet-4-5-20250929"
}
```

---

### Kilo

**Configuration**:

```yaml
# ~/.kilo/config.yaml
provider: openai-compatible
base_url: https://claude-relay-service-0rdd.onrender.com/v1
api_key: droid-4834935040543
model: claude-sonnet-4-5-20250929
```

Or via environment variables:

```bash
export KILO_API_BASE=https://claude-relay-service-0rdd.onrender.com/v1
export KILO_API_KEY=droid-4834935040543
export KILO_MODEL=claude-sonnet-4-5-20250929
```

---

### Continue.dev

**Website**: https://continue.dev

**Configuration** (`~/.continue/config.json`):

```json
{
  "models": [
    {
      "title": "Claude Sonnet 4.5",
      "provider": "openai",
      "model": "claude-sonnet-4-5-20250929",
      "apiBase": "https://claude-relay-service-0rdd.onrender.com/v1",
      "apiKey": "droid-4834935040543"
    },
    {
      "title": "Claude Opus 4.1",
      "provider": "openai",
      "model": "claude-opus-4-1-20250805",
      "apiBase": "https://claude-relay-service-0rdd.onrender.com/v1",
      "apiKey": "droid-4834935040543"
    }
  ]
}
```

**Note**: Use `provider: "openai"` for OpenAI-compatible endpoints.

---

### Cursor

**Website**: https://cursor.sh

**Configuration** (Settings → Models → Add Custom Model):

1. **Provider Type**: OpenAI Compatible
2. **Base URL**: `https://claude-relay-service-0rdd.onrender.com/v1`
3. **API Key**: `droid-4834935040543`
4. **Model ID**: `claude-sonnet-4-5-20250929`

**Via Settings JSON** (`~/.cursor/User/settings.json`):

```json
{
  "cursor.aiModels": [
    {
      "name": "Claude Sonnet 4.5",
      "provider": "openai-compatible",
      "endpoint": "https://claude-relay-service-0rdd.onrender.com/v1",
      "apiKey": "droid-4834935040543",
      "model": "claude-sonnet-4-5-20250929"
    }
  ]
}
```

---

## Available Models

Use the `/v1/models` endpoint to get the full list:

```bash
curl -H "Authorization: Bearer droid-4834935040543" \
  https://claude-relay-service-0rdd.onrender.com/v1/models
```

### Recommended Models by Use Case

**For Code Generation** (Best quality):
- `claude-opus-4-1-20250805` - Most capable, best for complex tasks
- `claude-sonnet-4-5-20250929` - Excellent balance of speed and quality

**For Quick Responses** (Fastest):
- `claude-haiku-4-5-20250514` - Ultra-fast responses for simple tasks

**For Cost Efficiency**:
- `claude-sonnet-4-5-20250929` - Best balance
- `claude-haiku-4-5-20250514` - Most economical

### Model Name Patterns

The service automatically detects the provider based on model name:

- `claude-*` → Anthropic/Claude backend
- `gpt-*`, `o1-*`, `o3-*` → OpenAI backend
- `gemini-*` → Google Gemini backend

---

## Authentication

All requests require an API key. There are three ways to provide it:

### 1. Bearer Token (Recommended)

```bash
curl -H "Authorization: Bearer droid-4834935040543" \
  https://claude-relay-service-0rdd.onrender.com/v1/chat/completions \
  -d '{"model": "claude-sonnet-4-5-20250929", "messages": [...]}'
```

### 2. X-API-Key Header

```bash
curl -H "x-api-key: droid-4834935040543" \
  https://claude-relay-service-0rdd.onrender.com/v1/chat/completions \
  -d '{"model": "claude-sonnet-4-5-20250929", "messages": [...]}'
```

### 3. Custom API Keys

You can create custom API keys with specific permissions and quotas:

```bash
# Create a new API key via web interface
https://claude-relay-service-0rdd.onrender.com/admin-next/api-keys

# Or via API
curl -X POST https://claude-relay-service-0rdd.onrender.com/admin/api-keys \
  -H "Authorization: Bearer admin-token" \
  -d '{
    "name": "My Roo Code Key",
    "tokenLimit": 1000000,
    "permissions": "all"
  }'
```

---

## Endpoint Reference

### POST /v1/chat/completions

OpenAI-compatible chat completion endpoint with intelligent routing.

**Request**:

```json
{
  "model": "claude-sonnet-4-5-20250929",
  "messages": [
    {"role": "system", "content": "You are a helpful coding assistant."},
    {"role": "user", "content": "Write a Python function to reverse a string"}
  ],
  "temperature": 0.7,
  "max_tokens": 2048,
  "stream": false
}
```

**Response**:

```json
{
  "id": "msg_01AbCdEf...",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "claude-sonnet-4-5-20250929",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "def reverse_string(s):\n    return s[::-1]"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 25,
    "completion_tokens": 15,
    "total_tokens": 40
  }
}
```

### POST /v1/messages

Anthropic-native Claude messages endpoint (supports Claude-specific features).

**Request**:

```json
{
  "model": "claude-sonnet-4-5-20250929",
  "max_tokens": 2048,
  "messages": [
    {"role": "user", "content": "Explain async/await in JavaScript"}
  ],
  "system": "You are an expert JavaScript tutor."
}
```

**Response**: Anthropic-native format with usage tracking.

### GET /v1/models

List all available models.

**Request**:

```bash
curl -H "Authorization: Bearer droid-4834935040543" \
  https://claude-relay-service-0rdd.onrender.com/v1/models
```

**Response**:

```json
{
  "object": "list",
  "data": [
    {
      "id": "claude-sonnet-4-5-20250929",
      "object": "model",
      "created": 1234567890,
      "owned_by": "anthropic",
      "permission": [],
      "root": "claude-sonnet-4-5-20250929",
      "parent": null
    },
    ...
  ]
}
```

---

## Testing

### Test with cURL

#### 1. Test OpenAI-Compatible Endpoint

```bash
curl -X POST https://claude-relay-service-0rdd.onrender.com/v1/chat/completions \
  -H "Authorization: Bearer droid-4834935040543" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "messages": [
      {"role": "user", "content": "Say hello!"}
    ],
    "max_tokens": 50
  }'
```

#### 2. Test Model Listing

```bash
curl https://claude-relay-service-0rdd.onrender.com/v1/models \
  -H "Authorization: Bearer droid-4834935040543"
```

#### 3. Test Streaming

```bash
curl -X POST https://claude-relay-service-0rdd.onrender.com/v1/chat/completions \
  -H "Authorization: Bearer droid-4834935040543" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "messages": [{"role": "user", "content": "Count to 5"}],
    "stream": true,
    "max_tokens": 100
  }'
```

### Test with Python

```python
import openai

client = openai.OpenAI(
    api_key="droid-4834935040543",
    base_url="https://claude-relay-service-0rdd.onrender.com/v1"
)

response = client.chat.completions.create(
    model="claude-sonnet-4-5-20250929",
    messages=[
        {"role": "user", "content": "Write a haiku about coding"}
    ]
)

print(response.choices[0].message.content)
```

---

## Troubleshooting

### Common Issues

#### 403 Forbidden Error

**Problem**: Authentication failed

**Solutions**:
1. Verify your API key is correct: `droid-4834935040543`
2. Check the Authorization header format: `Bearer <key>`
3. Ensure the API key has not expired or been revoked

#### 404 Not Found

**Problem**: Incorrect endpoint URL

**Solutions**:
1. Verify base URL: `https://claude-relay-service-0rdd.onrender.com`
2. Ensure `/v1` prefix is included
3. Check endpoint spelling: `/v1/chat/completions` (not `/v1/completions/chat`)

#### Model Not Found

**Problem**: Model name not recognized

**Solutions**:
1. List available models: `GET /v1/models`
2. Check model name spelling
3. Verify the model is supported by your API key permissions

#### Slow Response Times

**Problem**: High latency

**Solutions**:
1. Switch to faster models: `claude-haiku-4-5-20250514`
2. Reduce `max_tokens` parameter
3. Check your network connection
4. Consider using streaming for long responses

#### SSL/Certificate Errors

**Problem**: Certificate verification failed

**Solutions**:
1. Ensure you're using `https://` (not `http://`)
2. Update your client libraries to latest versions
3. If using self-signed certificates, configure trust appropriately

### Debug Mode

Enable detailed logging in your AI coding assistant:

**Roo Code**:
```json
{
  "debug": true,
  "logLevel": "debug"
}
```

**Continue.dev**:
```json
{
  "allowAnonymousTelemetry": false,
  "telemetry": {
    "enabled": false
  }
}
```

### Getting Help

1. **Check Logs**: View service logs at `/admin-next/logs`
2. **Monitor Usage**: Check usage stats at `/v1/usage`
3. **API Key Info**: Get key details at `/v1/key-info`
4. **Health Check**: Verify service status at `/health`

---

## Advanced Configuration

### Custom System Prompts

The service supports custom system prompts:

**OpenAI Format**:
```json
{
  "model": "claude-sonnet-4-5-20250929",
  "messages": [
    {"role": "system", "content": "You are a senior Rust developer."},
    {"role": "user", "content": "Explain ownership in Rust"}
  ]
}
```

**Anthropic Format**:
```json
{
  "model": "claude-sonnet-4-5-20250929",
  "system": "You are a senior Rust developer.",
  "messages": [
    {"role": "user", "content": "Explain ownership in Rust"}
  ]
}
```

### Streaming Responses

Enable streaming for real-time output:

```json
{
  "model": "claude-sonnet-4-5-20250929",
  "messages": [...],
  "stream": true
}
```

Response will be sent as Server-Sent Events (SSE).

### Temperature and Sampling

Control response creativity:

```json
{
  "model": "claude-sonnet-4-5-20250929",
  "messages": [...],
  "temperature": 0.7,    // 0.0 (deterministic) to 1.0 (creative)
  "top_p": 0.9,          // Nucleus sampling
  "max_tokens": 2048     // Maximum response length
}
```

### Stop Sequences

Define custom stop sequences:

```json
{
  "model": "claude-sonnet-4-5-20250929",
  "messages": [...],
  "stop": ["END", "STOP", "\n\n\n"]
}
```

---

## Migration from Other Services

### From OpenAI

Simply change the base URL:

```diff
- base_url: "https://api.openai.com/v1"
+ base_url: "https://claude-relay-service-0rdd.onrender.com/v1"
- api_key: "sk-..."
+ api_key: "droid-4834935040543"
```

### From Anthropic

Two options:

1. **Use OpenAI format** (recommended for compatibility):
   - Change to `/v1/chat/completions`
   - Convert messages to OpenAI format

2. **Keep Anthropic format**:
   - Use `/v1/messages` endpoint
   - Keep existing message format

---

## Support

For issues, feature requests, or questions:

1. **Web Interface**: https://claude-relay-service-0rdd.onrender.com/admin-next
2. **Health Check**: https://claude-relay-service-0rdd.onrender.com/health
3. **API Documentation**: This file

---

**Last Updated**: 2025-11-16
**Service Version**: 1.0.0
**Deployment**: Render (https://claude-relay-service-0rdd.onrender.com)
