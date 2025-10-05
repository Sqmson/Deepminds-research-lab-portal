#!/bin/bash

# DeepMinds Research Lab Portal - Startup Script

echo "🚀 Starting DeepMinds Research Lab Portal..."

# Check if PHP is installed
if ! command -v php &> /dev/null; then
    echo "❌ PHP is not installed. Please install PHP 8.0+ first."
    exit 1
fi

# Check if Composer is installed
if ! command -v composer &> /dev/null; then
    echo "❌ Composer is not installed. Please install Composer first."
    exit 1
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
if [ ! -d "vendor" ]; then
    composer install --no-dev --optimize-autoloader
fi
cd ..

# Create .env file if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating environment file..."
    cat > backend/.env << EOF
MONGO_URI=mongodb://localhost:27017
DB_NAME=deepminds_research_lab
YOUTUBE_API_KEY=
YOUTUBE_CHANNEL_ID=
ADMIN_USER=admin
ADMIN_PASS=admin123
EOF
    echo "✅ Created backend/.env file with default values"
fi

# Check if MongoDB is running
echo "🔍 Checking MongoDB connection..."
if ! php -r "try { new MongoDB\Client('mongodb://localhost:27017'); echo 'MongoDB is running'; } catch (Exception \$e) { echo 'MongoDB is not running or not accessible'; exit(1); }" 2>/dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first:"
    echo "   sudo systemctl start mongod"
    echo "   or"
    echo "   brew services start mongodb-community"
    echo ""
    echo "The site will work with mock data if MongoDB is not available."
fi

echo ""
echo "🌐 Starting servers..."
echo ""

# Start backend server
echo "🔧 Starting backend API server on port 8001..."
cd backend
php -S localhost:8001 router.php &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 2

# Start frontend server
echo "🎨 Starting frontend server on port 8000..."
cd themes/deepminds_theme
php -S localhost:8000 &
FRONTEND_PID=$!
cd ../..

# Wait a moment for frontend to start
sleep 2

echo ""
echo "✅ Servers started successfully!"
echo ""
echo "🌐 Frontend: http://localhost:8000"
echo "🔧 Backend API: http://localhost:8001"
echo "❤️  Health Check: http://localhost:8001/health"
echo ""
echo "Press Ctrl+C to stop all servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
