#!/bin/bash

# Dashify Development Stop Script

echo "🛑 Stopping Dashify Development Environment..."
echo "=============================================="

# Stop frontend npm process
echo "📱 Stopping Frontend Development Server..."
pkill -f "next dev" || echo "   No frontend process found"

# Stop backend containers
echo "🔧 Stopping Backend Services..."
cd backend
docker-compose down 2>/dev/null || echo "   Backend containers already stopped"

# Stop frontend container if it exists
echo "🎨 Stopping Frontend Container..."
docker stop dashify_frontend_dev 2>/dev/null || echo "   Frontend container not running"
docker rm dashify_frontend_dev 2>/dev/null || echo "   Frontend container not found"

# Go back to root
cd ..

echo ""
echo "✅ All services stopped!"
echo "=============================================="
echo ""
echo "📋 To start again, run: ./start.sh" 