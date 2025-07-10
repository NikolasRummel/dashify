#!/bin/bash

# Dashify Development Startup Script
# Based on CI pipeline commands

set -e  # Exit on any error

# Variables (matching CI pipeline)
export DOCKER_IMAGE_BACKEND="dashify-backend"
export DOCKER_IMAGE_FRONTEND="dashify-frontend"
export DOCKER_TAG="latest"
export CI_COMMIT_SHA="dev"
export BACKEND_URL_DEV="http://localhost:8080"
export DOCKER_COMPOSE_DEV_FILE="docker-compose-dev.yml"

echo "🚀 Starting Dashify Development Environment..."
echo "=============================================="
echo "📋 Environment Variables:"
echo "   DOCKER_IMAGE_BACKEND: ${DOCKER_IMAGE_BACKEND}"
echo "   DOCKER_IMAGE_FRONTEND: ${DOCKER_IMAGE_FRONTEND}"
echo "   DOCKER_TAG: ${DOCKER_TAG}"
echo "   CI_COMMIT_SHA: ${CI_COMMIT_SHA}"
echo "   BACKEND_URL_DEV: ${BACKEND_URL_DEV}"
echo "   DOCKER_COMPOSE_DEV_FILE: ${DOCKER_COMPOSE_DEV_FILE}"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ ERROR: Docker is not running!"
    echo "   Please start Docker Desktop or Docker daemon and try again."
    exit 1
fi

# Create external network if it doesn't exist
echo "🌐 Creating Docker network..."
docker network create dev-network 2>/dev/null || echo "   Network 'dev-network' already exists"

# Step 1: Start MySQL in backend
echo ""
echo "📦 Step 1: Starting MySQL database..."
cd backend
docker-compose up -d
echo "✅ MySQL database started"

# Step 2: Build and deploy backend
echo ""
echo "🔧 Step 2: Building and Deploying Backend to Dev"
echo "Building and Deploying Backend to Dev"
docker build -t ${DOCKER_IMAGE_BACKEND}_dev:${CI_COMMIT_SHA} .
docker tag ${DOCKER_IMAGE_BACKEND}_dev:${CI_COMMIT_SHA} ${DOCKER_IMAGE_BACKEND}_dev:${DOCKER_TAG}
docker-compose -f ${DOCKER_COMPOSE_DEV_FILE} up -d --build --no-deps
echo "✅ Backend deployed successfully"

# Step 3: Build and deploy frontend
cd ../frontend
echo "🎨 Step 3: Starting Frontend Development Server"
echo "Building Frontend Docker Image for Dev"
# Install dependencies
echo "📦 Installing frontend dependencies..."
# Skip the prepare script that runs husky
npm install --ignore-scripts
# Kill any existing npm process on port 3001
pkill -f "next dev" || true
# Set environment variable for backend URL
export NEXT_PUBLIC_BACKEND_URL="http://localhost:8081"
# Start frontend in development mode
npm run dev &
echo "✅ Frontend development server started"

# Go back to root
cd ..

echo ""
echo "🎉 Dashify Development Environment is starting up!"
echo "=================================================="
echo ""
echo "📱 Frontend: http://localhost:3001"
echo "🔧 Backend API: http://localhost:8081"
echo "🗄️  PgAdmin: http://localhost:5540"
echo ""
echo "📋 Useful Commands:"
echo "   Check status:    docker-compose ps"
echo "   View logs:       docker-compose logs -f"
echo "   Stop services:   ./stop.sh"
echo ""
echo "⚠️  Note: Services may take a few minutes to fully start up." 