#!/bin/bash

# Database seed script
# This script will create admin users in your database

echo "🌱 Running Prisma seed..."
echo ""
echo "Installing dependencies if needed..."
npm install tsx --save-dev

echo ""
echo "Generating Prisma client..."
npx prisma generate

echo ""
echo "Running seed script..."
npx prisma db seed

echo ""
echo "✅ Seed complete!"
