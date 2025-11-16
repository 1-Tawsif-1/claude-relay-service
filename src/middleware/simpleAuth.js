/**
 * Simple API Key Authentication Middleware
 * No database - uses hardcoded keys only
 */

const hardcoded = require('../config/hardcoded')
const logger = require('../utils/logger')

/**
 * Authenticate API key from hardcoded list
 */
function authenticateSimpleApiKey(req, res, next) {
  try {
    // Get API key from header
    const apiKey =
      req.headers['x-api-key'] ||
      req.headers['authorization']?.replace(/^Bearer\s+/i, '') ||
      req.headers['anthropic-api-key']

    if (!apiKey) {
      logger.warn('❌ No API key provided in request')
      return res.status(401).json({
        error: {
          type: 'authentication_error',
          message: 'API key is required. Please provide x-api-key header.'
        }
      })
    }

    // Check if key exists in hardcoded list
    const keyData = hardcoded.CUSTOM_API_KEYS.find((k) => k.key === apiKey)

    if (!keyData) {
      logger.warn(`❌ Invalid API key attempted: ${apiKey.substring(0, 10)}...`)
      return res.status(401).json({
        error: {
          type: 'authentication_error',
          message: 'Invalid API key provided.'
        }
      })
    }

    if (!keyData.enabled) {
      logger.warn(`❌ Disabled API key attempted: ${keyData.name}`)
      return res.status(403).json({
        error: {
          type: 'permission_error',
          message: 'This API key has been disabled.'
        }
      })
    }

    // Authentication successful
    logger.info(`✅ Authenticated with key: ${keyData.name}`)
    req.apiKey = keyData
    req.factoryApiKey = hardcoded.FACTORY_API_KEY

    next()
  } catch (error) {
    logger.error('Authentication error:', error)
    return res.status(500).json({
      error: {
        type: 'server_error',
        message: 'Internal authentication error'
      }
    })
  }
}

module.exports = { authenticateSimpleApiKey }
