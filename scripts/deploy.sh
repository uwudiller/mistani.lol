#!/bin/bash

# mistani.lol Deployment Script
echo "Starting mistani.lol deployment..."

# Check if environment variables are set
if [ ! -f ".env.local" ]; then
    echo "Error: .env.local file not found"
    echo "Please copy env-example.txt to .env.local and fill in your variables"
    exit 1
fi

# Generate Prisma client
echo "Generating Prisma client..."
npm run db:generate

# Build the application
echo "Building application..."
npm run build

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

echo "Deployment complete!"
