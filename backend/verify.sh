#!/bin/bash

echo "🔍 Verifying Backend Setup..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "❌ node_modules not found. Run 'npm install' first."
    exit 1
fi

# Check if TypeScript compiles
echo "📦 Building TypeScript..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ TypeScript build failed"
    exit 1
fi
echo "✅ TypeScript build successful"

# Run tests
echo ""
echo "🧪 Running tests..."
npm test
if [ $? -ne 0 ]; then
    echo "❌ Tests failed"
    exit 1
fi
echo "✅ All tests passed"

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo "❌ dist folder not found"
    exit 1
fi
echo "✅ Build output exists"

# Check if uploads directory exists (will be created at runtime)
if [ ! -d "uploads" ]; then
    echo "⚠️  uploads directory will be created at runtime"
else
    echo "✅ uploads directory exists"
fi

echo ""
echo "✅ Backend verification complete!"
