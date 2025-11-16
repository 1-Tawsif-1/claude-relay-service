/**
 * Simplified Server for Hardcoded Factory.ai Relay
 * NO DATABASE REQUIRED - Everything is hardcoded
 */

const express = require('express')
const path = require('path')
const cors = require('cors')
const simpleRoutes = require('./src/routes/simpleRoutes')
const logger = require('./src/utils/logger')

const app = express()
const PORT = process.env.PORT || 3000

// ============================================
// MIDDLEWARE
// ============================================

// Enable CORS for all origins
app.use(cors())

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')))

// Parse JSON bodies
app.use(express.json({ limit: '50mb' }))

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`)
  next()
})

// ============================================
// ROUTES
// ============================================

// Mount all routes at root
app.use('/', simpleRoutes)

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res) => {
  logger.warn(`404 - ${req.method} ${req.path}`)
  res.status(404).json({
    error: {
      type: 'not_found',
      message: `Endpoint ${req.method} ${req.path} not found`
    }
  })
})

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err)
  res.status(500).json({
    error: {
      type: 'server_error',
      message: 'Internal server error'
    }
  })
})

// ============================================
// START SERVER
// ============================================

app.listen(PORT, '0.0.0.0', () => {
  logger.info('╔═══════════════════════════════════════════╗')
  logger.info('║  🚀 Hardcoded Factory.ai Relay Started   ║')
  logger.info('╚═══════════════════════════════════════════╝')
  logger.info(`📡 Server running on port ${PORT}`)
  logger.info(`🌐 Base URL: http://0.0.0.0:${PORT}`)
  logger.info('')
  logger.info('📋 Available Endpoints:')
  logger.info('  POST   /v1/messages              (Anthropic API)')
  logger.info('  GET    /v1/models                (List models)')
  logger.info('  POST   /openai/v1/chat/completions (OpenAI API)')
  logger.info('  GET    /api-keys                 (List keys)')
  logger.info('  POST   /api-keys/generate        (Generate key)')
  logger.info('  GET    /health                   (Health check)')
  logger.info('')
  logger.info('🔑 Hardcoded API Key: droid-4834935040543')
  logger.info('✅ Ready to accept requests!')
})

module.exports = app
