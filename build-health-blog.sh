#!/bin/bash

# Health Blog Build Script
# This script builds the health blog and copies it to the main site

echo "🏥 Building Health Blog..."

# Navigate to health blog directory
cd projects/health-blog

# Build the blog
npm run build

# Copy to main site
cd ../..
cp -r projects/health-blog/public health

echo "✅ Health blog built and deployed to /health"
echo "🌐 Available at: https://autio.github.io/health"
