#!/bin/sh
set -e

echo "🚀 Hardcoded Factory.ai Relay Starting..."
echo "✅ No environment variables required!"
echo "✅ Everything is hardcoded"
echo ""
echo "📡 Server will start on port ${PORT:-3000}"
echo "🔑 API Key: droid-4834935040543"
echo "🌐 Base URL: Check your Render dashboard"
echo ""
echo "🌐 Starting service..."

# Start the simple server directly
exec node /app/server-simple.js
