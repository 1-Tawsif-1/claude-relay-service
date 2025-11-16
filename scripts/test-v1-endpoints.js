#!/usr/bin/env node

/**
 * Test script for V1 unified endpoints
 *
 * Tests the new /v1 endpoints to ensure compatibility with AI coding assistants
 */

const axios = require('axios')

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:10000'
const API_KEY = process.env.API_KEY || 'droid-4834935040543'

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green')
}

function logError(message) {
  log(`❌ ${message}`, 'red')
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'cyan')
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow')
}

// Test functions
async function testModelsEndpoint() {
  logInfo('Testing GET /v1/models...')

  try {
    const response = await axios.get(`${BASE_URL}/v1/models`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`
      }
    })

    if (response.status === 200 && response.data.object === 'list') {
      logSuccess(`Models endpoint working - ${response.data.data.length} models available`)
      logInfo(`Sample models: ${response.data.data.slice(0, 3).map((m) => m.id).join(', ')}`)
      return true
    }

    logError('Models endpoint returned unexpected format')
    return false
  } catch (error) {
    logError(`Models endpoint failed: ${error.message}`)
    if (error.response) {
      console.log('Response:', error.response.data)
    }
    return false
  }
}

async function testChatCompletionsEndpoint() {
  logInfo('Testing POST /v1/chat/completions...')

  try {
    const response = await axios.post(
      `${BASE_URL}/v1/chat/completions`,
      {
        model: 'claude-sonnet-4-5-20250929',
        messages: [
          {
            role: 'user',
            content: 'Say "Test successful" in exactly two words.'
          }
        ],
        max_tokens: 10,
        temperature: 0
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (response.status === 200 && response.data.choices?.[0]?.message?.content) {
      logSuccess('Chat completions endpoint working')
      logInfo(`Response: ${response.data.choices[0].message.content}`)
      logInfo(
        `Usage: ${response.data.usage?.total_tokens || 'N/A'} tokens (${response.data.usage?.prompt_tokens || 'N/A'} input, ${response.data.usage?.completion_tokens || 'N/A'} output)`
      )
      return true
    }

    logError('Chat completions endpoint returned unexpected format')
    return false
  } catch (error) {
    logError(`Chat completions endpoint failed: ${error.message}`)
    if (error.response) {
      console.log('Response:', error.response.data)
    }
    return false
  }
}

async function testMessagesEndpoint() {
  logInfo('Testing POST /v1/messages (Anthropic format)...')

  try {
    const response = await axios.post(
      `${BASE_URL}/v1/messages`,
      {
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 10,
        messages: [
          {
            role: 'user',
            content: 'Respond with just "OK"'
          }
        ]
      },
      {
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        }
      }
    )

    if (response.status === 200 && response.data.content?.[0]?.text) {
      logSuccess('Messages endpoint working')
      logInfo(`Response: ${response.data.content[0].text}`)
      logInfo(
        `Usage: input=${response.data.usage?.input_tokens || 'N/A'}, output=${response.data.usage?.output_tokens || 'N/A'}`
      )
      return true
    }

    logError('Messages endpoint returned unexpected format')
    return false
  } catch (error) {
    logError(`Messages endpoint failed: ${error.message}`)
    if (error.response) {
      console.log('Response:', error.response.data)
    }
    return false
  }
}

async function testKeyInfoEndpoint() {
  logInfo('Testing GET /v1/key-info...')

  try {
    const response = await axios.get(`${BASE_URL}/v1/key-info`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`
      }
    })

    if (response.status === 200 && response.data.keyInfo) {
      logSuccess('Key info endpoint working')
      logInfo(`Key name: ${response.data.keyInfo.name}`)
      logInfo(`Token limit: ${response.data.keyInfo.tokenLimit || 'unlimited'}`)
      return true
    }

    logError('Key info endpoint returned unexpected format')
    return false
  } catch (error) {
    logError(`Key info endpoint failed: ${error.message}`)
    if (error.response) {
      console.log('Response:', error.response.data)
    }
    return false
  }
}

async function testMeEndpoint() {
  logInfo('Testing GET /v1/me...')

  try {
    const response = await axios.get(`${BASE_URL}/v1/me`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`
      }
    })

    if (response.status === 200 && response.data.id) {
      logSuccess('Me endpoint working')
      logInfo(`ID: ${response.data.id}`)
      logInfo(`Name: ${response.data.name}`)
      return true
    }

    logError('Me endpoint returned unexpected format')
    return false
  } catch (error) {
    logError(`Me endpoint failed: ${error.message}`)
    if (error.response) {
      console.log('Response:', error.response.data)
    }
    return false
  }
}

async function testBackendRouting() {
  logInfo('Testing intelligent backend routing...')

  const tests = [
    { model: 'claude-sonnet-4-5-20250929', expectedBackend: 'claude' },
    { model: 'gpt-4', expectedBackend: 'openai' },
    { model: 'gemini-1.5-pro', expectedBackend: 'gemini' }
  ]

  let passed = 0

  for (const test of tests) {
    try {
      logInfo(`  Testing ${test.model} → ${test.expectedBackend}`)

      const response = await axios.post(
        `${BASE_URL}/v1/chat/completions`,
        {
          model: test.model,
          messages: [{ role: 'user', content: 'Hi' }],
          max_tokens: 5
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      )

      if (response.status === 200) {
        logSuccess(`  ${test.model} routed successfully`)
        passed++
      } else {
        logWarning(`  ${test.model} returned status ${response.status}`)
      }
    } catch (error) {
      if (error.response?.status === 403 || error.response?.status === 404) {
        logWarning(`  ${test.model} not available (permission/config issue)`)
      } else {
        logError(`  ${test.model} failed: ${error.message}`)
      }
    }
  }

  if (passed > 0) {
    logSuccess(`Backend routing test passed (${passed}/${tests.length} models worked)`)
    return true
  }

  logError('Backend routing test failed - no models worked')
  return false
}

// Main test runner
async function runTests() {
  log('\n╔══════════════════════════════════════════╗', 'blue')
  log('║  Claude Relay Service - V1 Endpoint Tests  ║', 'blue')
  log('╚══════════════════════════════════════════╝\n', 'blue')

  logInfo(`Base URL: ${BASE_URL}`)
  logInfo(`API Key: ${API_KEY.substring(0, 10)}...`)
  log('')

  const results = {
    models: false,
    chatCompletions: false,
    messages: false,
    keyInfo: false,
    me: false,
    backendRouting: false
  }

  // Run tests
  results.models = await testModelsEndpoint()
  log('')

  results.chatCompletions = await testChatCompletionsEndpoint()
  log('')

  results.messages = await testMessagesEndpoint()
  log('')

  results.keyInfo = await testKeyInfoEndpoint()
  log('')

  results.me = await testMeEndpoint()
  log('')

  results.backendRouting = await testBackendRouting()
  log('')

  // Summary
  log('═══════════════════════════════════════════', 'blue')
  log('Test Summary:', 'blue')
  log('═══════════════════════════════════════════', 'blue')

  const passed = Object.values(results).filter((r) => r).length
  const total = Object.keys(results).length

  Object.entries(results).forEach(([test, result]) => {
    const status = result ? '✅ PASS' : '❌ FAIL'
    const color = result ? 'green' : 'red'
    log(`  ${status} - ${test}`, color)
  })

  log('')
  log(`Result: ${passed}/${total} tests passed`, passed === total ? 'green' : 'yellow')
  log('')

  if (passed === total) {
    log('🎉 All tests passed! Service is ready for AI coding assistants.', 'green')
    process.exit(0)
  } else if (passed > 0) {
    log('⚠️  Some tests failed. Check configuration and try again.', 'yellow')
    process.exit(1)
  } else {
    log('❌ All tests failed. Service may not be running or misconfigured.', 'red')
    process.exit(1)
  }
}

// Run tests
runTests().catch((error) => {
  logError(`Fatal error: ${error.message}`)
  console.error(error)
  process.exit(1)
})
