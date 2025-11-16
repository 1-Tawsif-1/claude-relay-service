/**
 * Simplified Factory.ai Relay Service
 * Direct forwarding without database lookups
 */

const axios = require('axios')
const logger = require('../utils/logger')
const hardcoded = require('../config/hardcoded')

/**
 * Forward request to Factory.ai Anthropic endpoint
 */
async function forwardToFactoryAnthropic(req, res) {
  const startTime = Date.now()

  try {
    const { factoryApiKey } = req
    const requestBody = req.body

    // Inject system prompt if not present
    if (!requestBody.system && hardcoded.SYSTEM_PROMPT) {
      requestBody.system = hardcoded.SYSTEM_PROMPT
    }

    logger.info(
      `🚀 Forwarding to Factory.ai Anthropic API - Model: ${requestBody.model || 'default'}`
    )

    // Prepare headers for Factory.ai
    const headers = {
      Authorization: `Bearer ${factoryApiKey}`,
      'Content-Type': 'application/json',
      'anthropic-version': req.headers['anthropic-version'] || '2023-06-01',
      'x-api-provider': 'anthropic'
    }

    // Add beta headers if present
    if (req.headers['anthropic-beta']) {
      headers['anthropic-beta'] = req.headers['anthropic-beta']
    }

    // Check if streaming
    const isStreaming = requestBody.stream === true

    if (isStreaming) {
      // Streaming mode
      const response = await axios.post(
        hardcoded.FACTORY_ENDPOINTS.anthropic,
        requestBody,
        {
          headers,
          responseType: 'stream',
          timeout: hardcoded.REQUEST_CONFIG.timeout
        }
      )

      // Set SSE headers
      res.setHeader('Content-Type', 'text/event-stream')
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Connection', 'keep-alive')
      res.setHeader('X-Accel-Buffering', 'no')

      // Pipe response
      response.data.pipe(res)

      response.data.on('end', () => {
        logger.info(`✅ Streaming completed in ${Date.now() - startTime}ms`)
      })

      response.data.on('error', (error) => {
        logger.error('Streaming error:', error)
        if (!res.headersSent) {
          res.status(500).json({ error: 'Stream error' })
        }
      })
    } else {
      // Non-streaming mode
      const response = await axios.post(
        hardcoded.FACTORY_ENDPOINTS.anthropic,
        requestBody,
        {
          headers,
          timeout: hardcoded.REQUEST_CONFIG.timeout
        }
      )

      logger.info(`✅ Request completed in ${Date.now() - startTime}ms`)
      res.json(response.data)
    }
  } catch (error) {
    handleFactoryError(error, res, startTime)
  }
}

/**
 * Forward request to Factory.ai OpenAI endpoint
 */
async function forwardToFactoryOpenAI(req, res) {
  const startTime = Date.now()

  try {
    const { factoryApiKey } = req
    const requestBody = req.body

    logger.info(
      `🚀 Forwarding to Factory.ai OpenAI API - Model: ${requestBody.model || 'default'}`
    )

    // Prepare headers for Factory.ai
    const headers = {
      Authorization: `Bearer ${factoryApiKey}`,
      'Content-Type': 'application/json',
      'x-api-provider': 'azure_openai'
    }

    // Check if streaming
    const isStreaming = requestBody.stream === true

    if (isStreaming) {
      // Streaming mode
      const response = await axios.post(
        hardcoded.FACTORY_ENDPOINTS.openai,
        requestBody,
        {
          headers,
          responseType: 'stream',
          timeout: hardcoded.REQUEST_CONFIG.timeout
        }
      )

      // Set SSE headers
      res.setHeader('Content-Type', 'text/event-stream')
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Connection', 'keep-alive')

      // Pipe response
      response.data.pipe(res)

      response.data.on('end', () => {
        logger.info(`✅ Streaming completed in ${Date.now() - startTime}ms`)
      })

      response.data.on('error', (error) => {
        logger.error('Streaming error:', error)
        if (!res.headersSent) {
          res.status(500).json({ error: 'Stream error' })
        }
      })
    } else {
      // Non-streaming mode
      const response = await axios.post(
        hardcoded.FACTORY_ENDPOINTS.openai,
        requestBody,
        {
          headers,
          timeout: hardcoded.REQUEST_CONFIG.timeout
        }
      )

      logger.info(`✅ Request completed in ${Date.now() - startTime}ms`)
      res.json(response.data)
    }
  } catch (error) {
    handleFactoryError(error, res, startTime)
  }
}

/**
 * Handle Factory.ai API errors
 */
function handleFactoryError(error, res, startTime) {
  const duration = Date.now() - startTime

  if (error.response) {
    // Factory.ai returned error response
    const status = error.response.status
    const errorData = error.response.data

    logger.error(`❌ Factory.ai error (${status}) after ${duration}ms:`, errorData)

    // Forward the exact error response
    res.status(status).json(errorData)
  } else if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    // Timeout error
    logger.error(`❌ Request timeout after ${duration}ms`)
    res.status(504).json({
      error: {
        type: 'timeout_error',
        message: 'Request to Factory.ai timed out. Please try again.'
      }
    })
  } else {
    // Other errors
    logger.error(`❌ Unexpected error after ${duration}ms:`, error.message)
    res.status(500).json({
      error: {
        type: 'server_error',
        message: 'Internal server error occurred while processing your request.'
      }
    })
  }
}

module.exports = {
  forwardToFactoryAnthropic,
  forwardToFactoryOpenAI
}
