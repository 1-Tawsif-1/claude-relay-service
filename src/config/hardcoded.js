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

  // Default Models (EXACT Factory.ai Droid CLI models only)
  MODELS: {
    anthropic: [
      // Claude Opus 4.1 (Most expensive, 6x cost)
      {
        id: 'claude-opus-4-1-20250805',
        object: 'model',
        created: Date.now(),
        owned_by: 'anthropic',
        display_name: 'Opus 4.1',
        cost_multiplier: '6x'
      },
      // Claude Sonnet 4.5 (Recommended for coding, 1.2x cost)
      {
        id: 'claude-sonnet-4-5-20250929',
        object: 'model',
        created: Date.now(),
        owned_by: 'anthropic',
        display_name: 'Sonnet 4.5',
        cost_multiplier: '1.2x'
      },
      // Claude Haiku 4.5 (Fastest, 0.4x cost)
      {
        id: 'claude-haiku-4-5-20250514',
        object: 'model',
        created: Date.now(),
        owned_by: 'anthropic',
        display_name: 'Haiku 4.5',
        cost_multiplier: '0.4x'
      }
    ],
    openai: [
      // GPT-5.1-Codex (Low) - Current model, 0.5x cost
      {
        id: 'gpt-5-1-codex-low',
        object: 'model',
        created: Date.now(),
        owned_by: 'openai',
        display_name: 'GPT-5.1-Codex (Low)',
        cost_multiplier: '0.5x'
      },
      // GPT-5.1 (0.5x cost)
      {
        id: 'gpt-5-1',
        object: 'model',
        created: Date.now(),
        owned_by: 'openai',
        display_name: 'GPT-5.1',
        cost_multiplier: '0.5x'
      },
      // GPT-5-Codex (0.5x cost)
      {
        id: 'gpt-5-codex',
        object: 'model',
        created: Date.now(),
        owned_by: 'openai',
        display_name: 'GPT-5-Codex',
        cost_multiplier: '0.5x'
      },
      // GPT-5 (0.5x cost)
      {
        id: 'gpt-5',
        object: 'model',
        created: Date.now(),
        owned_by: 'openai',
        display_name: 'GPT-5',
        cost_multiplier: '0.5x'
      }
    ],
    other: [
      // Droid Core (GLM-4.6) - Cheapest option, 0.25x cost
      {
        id: 'glm-4-6',
        object: 'model',
        created: Date.now(),
        owned_by: 'zhipuai',
        display_name: 'Droid Core (GLM-4.6)',
        cost_multiplier: '0.25x'
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
