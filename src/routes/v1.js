/**
 * Unified V1 Router - Root /v1 endpoints for AI Coding Assistants
 *
 * This router provides OpenAI-compatible endpoints at the root /v1 path,
 * making it compatible with AI coding assistants like:
 * - Roo Code (roo.dev)
 * - Cline (VS Code extension)
 * - Kilo (AI coding assistant)
 * - Continue.dev
 * - Cursor
 *
 * All providers (Claude, OpenAI, Gemini, Droid) are accessible through
 * these unified endpoints with intelligent backend routing.
 */

const express = require('express')
const { authenticateApiKey } = require('../middleware/auth')
const logger = require('../utils/logger')
const modelService = require('../services/modelService')

// Import unified routing logic
const { detectBackendFromModel, routeToBackend } = require('./unified')

// Import direct handlers
const { handleMessagesRequest } = require('./api')
const apiKeyService = require('../services/apiKeyService')

const router = express.Router()

// ========================================
// OpenAI-Compatible Endpoints
// ========================================

/**
 * POST /v1/chat/completions
 *
 * OpenAI-compatible chat completions endpoint with intelligent backend routing.
 * Automatically detects and routes to the correct provider based on model name.
 *
 * Supported providers:
 * - Claude (claude-* models)
 * - OpenAI (gpt-*, o1-*, o3-* models)
 * - Gemini (gemini-* models)
 * - Droid/Factory.ai (via model mapping)
 */
router.post('/chat/completions', authenticateApiKey, async (req, res) => {
  try {
    // Validate required parameters
    if (!req.body.messages || !Array.isArray(req.body.messages) || req.body.messages.length === 0) {
      return res.status(400).json({
        error: {
          message: 'Messages array is required and cannot be empty',
          type: 'invalid_request_error',
          code: 'invalid_request'
        }
      })
    }

    const requestedModel = req.body.model || 'claude-3-5-sonnet-20241022'
    req.body.model = requestedModel

    logger.info(
      `🚀 [V1 Router] Chat completion request - Model: ${requestedModel}, User: ${req.apiKey.name}`
    )

    // Use unified routing logic
    await routeToBackend(req, res, requestedModel)
  } catch (error) {
    logger.error('❌ [V1 Router] Chat completion error:', error)
    if (!res.headersSent) {
      res.status(500).json({
        error: {
          message: 'Internal server error',
          type: 'server_error',
          code: 'internal_error'
        }
      })
    }
  }
})

/**
 * POST /v1/completions
 *
 * OpenAI legacy completions endpoint (converts to chat format internally)
 */
router.post('/completions', authenticateApiKey, async (req, res) => {
  try {
    if (!req.body.prompt) {
      return res.status(400).json({
        error: {
          message: 'Prompt is required',
          type: 'invalid_request_error',
          code: 'invalid_request'
        }
      })
    }

    const originalBody = req.body
    const requestedModel = originalBody.model || 'claude-3-5-sonnet-20241022'

    logger.info(
      `🚀 [V1 Router] Legacy completion request - Model: ${requestedModel}, User: ${req.apiKey.name}`
    )

    // Convert to chat format
    req.body = {
      model: requestedModel,
      messages: [
        {
          role: 'user',
          content: originalBody.prompt
        }
      ],
      max_tokens: originalBody.max_tokens,
      temperature: originalBody.temperature,
      top_p: originalBody.top_p,
      stream: originalBody.stream,
      stop: originalBody.stop,
      n: originalBody.n || 1,
      presence_penalty: originalBody.presence_penalty,
      frequency_penalty: originalBody.frequency_penalty,
      logit_bias: originalBody.logit_bias,
      user: originalBody.user
    }

    await routeToBackend(req, res, requestedModel)
  } catch (error) {
    logger.error('❌ [V1 Router] Completion error:', error)
    if (!res.headersSent) {
      res.status(500).json({
        error: {
          message: 'Failed to process completion request',
          type: 'server_error',
          code: 'internal_error'
        }
      })
    }
  }
})

// ========================================
// Anthropic-Compatible Endpoints
// ========================================

/**
 * POST /v1/messages
 *
 * Anthropic Claude-native messages endpoint.
 * Supports Claude-specific features like system prompts, thinking tokens, etc.
 */
router.post('/messages', authenticateApiKey, async (req, res) => {
  logger.info(`🚀 [V1 Router] Claude messages request - User: ${req.apiKey.name}`)
  await handleMessagesRequest(req, res)
})

/**
 * POST /v1/messages/count_tokens
 *
 * Beta API for counting tokens in Claude messages
 */
router.post('/messages/count_tokens', authenticateApiKey, async (req, res) => {
  try {
    const tokenCount = require('../services/claudeRelayService').countTokens

    if (!req.body.messages || !Array.isArray(req.body.messages)) {
      return res.status(400).json({
        error: {
          type: 'invalid_request_error',
          message: 'messages must be an array'
        }
      })
    }

    const count = await tokenCount(req.body)

    res.json({
      input_tokens: count
    })
  } catch (error) {
    logger.error('❌ [V1 Router] Token count error:', error)
    res.status(500).json({
      error: {
        type: 'server_error',
        message: 'Failed to count tokens'
      }
    })
  }
})

// ========================================
// Model Management Endpoints
// ========================================

/**
 * GET /v1/models
 *
 * List all available models across all providers.
 * Returns OpenAI-compatible model list format.
 *
 * Respects API key restrictions and permissions.
 */
router.get('/models', authenticateApiKey, async (req, res) => {
  try {
    logger.info(`📋 [V1 Router] Models list request - User: ${req.apiKey.name}`)

    // Get all models from modelService
    const models = modelService.getAllModels()

    // Filter by API key restrictions
    let filteredModels = models

    // Apply model blacklist if configured
    if (req.apiKey.enableModelRestriction && req.apiKey.restrictedModels?.length > 0) {
      filteredModels = models.filter((model) => req.apiKey.restrictedModels.includes(model.id))
    }

    // Apply provider permissions
    const permissions = req.apiKey.permissions || 'all'
    if (permissions !== 'all') {
      const allowedProviders = permissions.split(',').map((p) => p.trim().toLowerCase())

      // Map permission names to provider names
      const providerMap = {
        claude: 'anthropic',
        openai: 'openai',
        gemini: 'google',
        droid: 'anthropic' // Droid uses Anthropic models
      }

      const mappedProviders = allowedProviders
        .map((p) => providerMap[p] || p)
        .filter((p) => p !== 'all')

      if (mappedProviders.length > 0) {
        filteredModels = filteredModels.filter((model) => {
          const provider = modelService.getModelProvider(model.id)
          return mappedProviders.includes(provider)
        })
      }
    }

    res.json({
      object: 'list',
      data: filteredModels
    })
  } catch (error) {
    logger.error('❌ [V1 Router] Models list error:', error)
    res.status(500).json({
      error: {
        message: 'Failed to get models list',
        type: 'server_error',
        code: 'internal_error'
      }
    })
  }
})

/**
 * GET /v1/models/:model
 *
 * Get information about a specific model
 */
router.get('/models/:model', authenticateApiKey, async (req, res) => {
  try {
    const modelId = req.params.model
    const models = modelService.getAllModels()
    const model = models.find((m) => m.id === modelId)

    if (!model) {
      return res.status(404).json({
        error: {
          message: `Model ${modelId} not found`,
          type: 'invalid_request_error',
          code: 'model_not_found'
        }
      })
    }

    res.json(model)
  } catch (error) {
    logger.error('❌ [V1 Router] Model detail error:', error)
    res.status(500).json({
      error: {
        message: 'Failed to get model details',
        type: 'server_error',
        code: 'internal_error'
      }
    })
  }
})

// ========================================
// Utility Endpoints
// ========================================

/**
 * GET /v1/me
 *
 * Get current user/API key information
 * (Claude Code compatibility)
 */
router.get('/me', authenticateApiKey, async (req, res) => {
  try {
    res.json({
      id: req.apiKey.id,
      name: req.apiKey.name,
      type: 'api_key',
      permissions: req.apiKey.permissions || 'all',
      created_at: req.apiKey.createdAt || new Date().toISOString()
    })
  } catch (error) {
    logger.error('❌ [V1 Router] /me error:', error)
    res.status(500).json({
      error: {
        message: 'Failed to get user info',
        type: 'server_error'
      }
    })
  }
})

/**
 * GET /v1/key-info
 *
 * Get detailed API key information including usage stats
 */
router.get('/key-info', authenticateApiKey, async (req, res) => {
  try {
    const usage = await apiKeyService.getUsageStats(req.apiKey.id)

    res.json({
      keyInfo: {
        id: req.apiKey.id,
        name: req.apiKey.name,
        tokenLimit: req.apiKey.tokenLimit,
        permissions: req.apiKey.permissions || 'all',
        usage
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    logger.error('❌ [V1 Router] Key info error:', error)
    res.status(500).json({
      error: {
        message: 'Failed to get key info',
        type: 'server_error'
      }
    })
  }
})

/**
 * GET /v1/usage
 *
 * Get usage statistics for current API key
 */
router.get('/usage', authenticateApiKey, async (req, res) => {
  try {
    const usage = await apiKeyService.getUsageStats(req.apiKey.id)

    res.json({
      usage,
      limits: {
        tokens: req.apiKey.tokenLimit,
        requests: 0 // Request limits removed
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    logger.error('❌ [V1 Router] Usage stats error:', error)
    res.status(500).json({
      error: {
        message: 'Failed to get usage stats',
        type: 'server_error'
      }
    })
  }
})

/**
 * GET /v1/organizations/:org_id/usage
 *
 * Organization usage endpoint (for Claude Code compatibility)
 */
router.get('/organizations/:org_id/usage', authenticateApiKey, async (req, res) => {
  try {
    const usage = await apiKeyService.getUsageStats(req.apiKey.id)

    res.json({
      organization_id: req.params.org_id,
      usage,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    logger.error('❌ [V1 Router] Organization usage error:', error)
    res.status(500).json({
      error: {
        message: 'Failed to get organization usage',
        type: 'server_error'
      }
    })
  }
})

module.exports = router
