#!/bin/bash

echo "🚀 Starting OptimizeCode.ai Backend..."

# Check if .env exists
if [ ! -f backend/.env ]; then
    echo "⚠️  Warning: backend/.env file not found"
    echo "📝 Please copy backend/.env.example to backend/.env and configure your settings"
fi

# Navigate to backend directory
cd backend

# Install dependencies if needed
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server
echo "🌟 Starting server on port 3001..."
npm run dev
