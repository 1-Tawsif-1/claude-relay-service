/**
 * Simplified Routes for Hardcoded Factory.ai Relay
 */

const express = require('express')
const router = express.Router()
const { authenticateSimpleApiKey } = require('../middleware/simpleAuth')
const {
  forwardToFactoryAnthropic,
  forwardToFactoryOpenAI
} = require('../services/simpleFactoryRelay')
const hardcoded = require('../config/hardcoded')
const logger = require('../utils/logger')

// ============================================
// ANTHROPIC ENDPOINTS (for Roo, Cline)
// ============================================

/**
 * POST /v1/messages - Anthropic Messages API
 * Use this for Roo, Cline, and other Anthropic-compatible tools
 */
router.post('/v1/messages', authenticateSimpleApiKey, async (req, res) => {
  req.factoryApiKey = hardcoded.FACTORY_API_KEY
  await forwardToFactoryAnthropic(req, res)
})

/**
 * POST /v1/chat/completions - OpenAI-compatible chat completions
 * For AI coding assistants using OpenAI format (Continue.dev, Cursor, Kilo, etc.)
 */
router.post('/v1/chat/completions', authenticateSimpleApiKey, async (req, res) => {
  req.factoryApiKey = hardcoded.FACTORY_API_KEY
  await forwardToFactoryOpenAI(req, res)
})

/**
 * POST /v1/completions - OpenAI legacy completions
 */
router.post('/v1/completions', authenticateSimpleApiKey, async (req, res) => {
  // Convert to chat format
  const originalBody = req.body
  req.body = {
    model: originalBody.model || hardcoded.DEFAULT_MODEL,
    messages: [
      {
        role: 'user',
        content: originalBody.prompt
      }
    ],
    max_tokens: originalBody.max_tokens,
    temperature: originalBody.temperature,
    stream: originalBody.stream
  }

  req.factoryApiKey = hardcoded.FACTORY_API_KEY
  await forwardToFactoryOpenAI(req, res)
})

/**
 * GET /v1/models - List all available models
 */
router.get('/v1/models', authenticateSimpleApiKey, (req, res) => {
  logger.info('📋 Returning all available models')

  // Combine all models into one list
  const allModels = [
    ...hardcoded.MODELS.anthropic,
    ...hardcoded.MODELS.openai,
    ...(hardcoded.MODELS.other || [])
  ]

  res.json({
    object: 'list',
    data: allModels
  })
})

/**
 * GET /v1/me - User info endpoint (required by some clients)
 */
router.get('/v1/me', authenticateSimpleApiKey, (req, res) => {
  res.json({
    id: 'user_hardcoded',
    email: 'hardcoded@relay.service',
    name: 'Hardcoded Relay User'
  })
})

// ============================================
// OPENAI ENDPOINTS (for Kilo if using OpenAI format)
// ============================================

/**
 * POST /openai/v1/chat/completions - OpenAI format
 * Use this if your tool supports OpenAI format
 */
router.post(
  '/openai/v1/chat/completions',
  authenticateSimpleApiKey,
  async (req, res) => {
    req.factoryApiKey = hardcoded.FACTORY_API_KEY
    await forwardToFactoryOpenAI(req, res)
  }
)

/**
 * GET /openai/v1/models - List OpenAI models
 */
router.get('/openai/v1/models', authenticateSimpleApiKey, (req, res) => {
  logger.info('📋 Returning OpenAI models list')
  res.json({
    object: 'list',
    data: hardcoded.MODELS.openai
  })
})

// ============================================
// API KEY MANAGEMENT ENDPOINTS
// ============================================

/**
 * GET /api-keys - List all hardcoded API keys
 */
router.get('/api-keys', (req, res) => {
  const keys = hardcoded.CUSTOM_API_KEYS.map((k) => ({
    key: k.key,
    name: k.name,
    enabled: k.enabled,
    createdAt: k.createdAt
  }))

  res.json({
    success: true,
    data: keys
  })
})

/**
 * POST /api-keys/generate - Generate new API key
 * Body: { name: 'Key Name' }
 */
router.post('/api-keys/generate', (req, res) => {
  const { name } = req.body

  if (!name) {
    return res.status(400).json({
      success: false,
      error: 'Name is required'
    })
  }

  // Generate new key
  const newKey = `droid-${Date.now()}`

  // Add to hardcoded list (in memory only - restart will reset)
  hardcoded.CUSTOM_API_KEYS.push({
    key: newKey,
    name,
    enabled: true,
    createdAt: new Date().toISOString()
  })

  logger.info(`✅ Generated new API key: ${name} (${newKey})`)

  res.json({
    success: true,
    data: {
      key: newKey,
      name,
      enabled: true,
      createdAt: new Date().toISOString(),
      message:
        '⚠️ This key is stored in memory only. Add it to src/config/hardcoded.js to persist.'
    }
  })
})

// ============================================
// HEALTH CHECK
// ============================================

router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    mode: 'hardcoded',
    timestamp: new Date().toISOString(),
    factory_connected: true
  })
})

module.exports = router
