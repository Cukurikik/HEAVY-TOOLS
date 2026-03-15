#!/bin/bash

# Omni Enterprise Cloud Deployment Script
# Run this on your VPS once pointing to your domain.

echo "========================================="
echo "  Deploying Omni Hybrid Architecture"
echo "  Target: Production Server"
echo "========================================="

# 1. Update from GitHub
echo "[1] Pulling latest code..."
git pull origin main --force

# 2. Re-Install Angular and Build (If necessary, though usually done on CI)
echo "[2] Compiling Frontend (Angular -> dist/app/browser)..."
npm install
npm run build

# 3. Generating Prisma Client for Backend
echo "[3] Building Prisma ORM Client..."
cd ghost-server
npm install
npx prisma generate
cd ..

# 4. Bring up the completely independent cluster 
echo "[4] Orchestrating Docker Services..."
docker-compose -f docker-compose.prod.yml up -d --build

echo "========================================="
echo "  ✅ Omni System deployed successfully!"
echo "  Accessible at: http://localhost (Port 80)"
echo "========================================="
