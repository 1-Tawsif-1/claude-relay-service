/**
 * Hardcoded Configuration for Factory.ai
 * WARNING: This file contains sensitive API keys. Do not commit to public repositories.
 */

module.exports = {
  // Your Factory.ai API Key (hardcoded)
  FACTORY_API_KEY: 'fk-cIYxJ50mTC4YGoq2rg26-nYQ3TNEZZ_0ROgIjM1_0xttohJTXJ-c0ww7trUYlnpU',

  // Custom API Keys (you can add more here)
  // Format: { key: 'custom-key', name: 'Key Name', enabled: true }
  CUSTOM_API_KEYS: [
    {
      key: 'droid-4834935040543',
      name: 'My Droid Key',
      enabled: true,
      createdAt: new Date().toISOString()
    }
    // Add more keys here:
    // {
    //   key: 'droid-another-key-123',
    //   name: 'Another Key',
    //   enabled: true,
    //   createdAt: new Date().toISOString()
    // }
  ],

  // Factory.ai Endpoints
  FACTORY_ENDPOINTS: {
    anthropic: 'https://app.factory.ai/api/llm/a/v1/messages',
    openai: 'https://app.factory.ai/api/llm/o/v1/responses'
  },

  // Default Models
  MODELS: {
    anthropic: [
      {
        id: 'claude-opus-4-20250514',
        object: 'model',
        created: Date.now(),
        owned_by: 'anthropic'
      },
      {
        id: 'claude-sonnet-4-20250514',
        object: 'model',
        created: Date.now(),
        owned_by: 'anthropic'
      },
      {
        id: 'claude-sonnet-4-5-20250929',
        object: 'model',
        created: Date.now(),
        owned_by: 'anthropic'
      },
      {
        id: 'claude-3-7-sonnet-20250219',
        object: 'model',
        created: Date.now(),
        owned_by: 'anthropic'
      }
    ],
    openai: [
      {
        id: 'gpt-5-2025-08-07',
        object: 'model',
        created: Date.now(),
        owned_by: 'openai'
      },
      {
        id: 'gpt-5',
        object: 'model',
        created: Date.now(),
        owned_by: 'openai'
      }
    ]
  },

  // System Prompt
  SYSTEM_PROMPT: 'You are Droid, an AI software engineering agent built by Factory.',

  // Request Configuration
  REQUEST_CONFIG: {
    timeout: 600000, // 10 minutes
    maxRetries: 3,
    retryDelay: 1000
  }
}
