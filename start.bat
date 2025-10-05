@echo off
REM DeepMinds Research Lab Portal - Windows Startup Script

echo 🚀 Starting DeepMinds Research Lab Portal...

REM Check if PHP is installed
php --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ PHP is not installed. Please install PHP 8.0+ first.
    pause
    exit /b 1
)

REM Check if Composer is installed
composer --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Composer is not installed. Please install Composer first.
    pause
    exit /b 1
)

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
if not exist "vendor" (
    composer install --no-dev --optimize-autoloader
)
cd ..

REM Create .env file if it doesn't exist
if not exist "backend\.env" (
    echo 📝 Creating environment file...
    (
        echo MONGO_URI=mongodb://localhost:27017
        echo DB_NAME=deepminds_research_lab
        echo YOUTUBE_API_KEY=
        echo YOUTUBE_CHANNEL_ID=
        echo ADMIN_USER=admin
        echo ADMIN_PASS=admin123
    ) > backend\.env
    echo ✅ Created backend\.env file with default values
)

echo.
echo 🌐 Starting servers...
echo.

REM Start backend server
echo 🔧 Starting backend API server on port 8001...
cd backend
start "Backend API" cmd /k "php -S localhost:8001 router.php"
cd ..

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend server
echo 🎨 Starting frontend server on port 8000...
cd themes\deepminds_theme
start "Frontend" cmd /k "php -S localhost:8000"
cd ..\..

echo.
echo ✅ Servers started successfully!
echo.
echo 🌐 Frontend: http://localhost:8000
echo 🔧 Backend API: http://localhost:8001
echo ❤️  Health Check: http://localhost:8001/health
echo.
echo Press any key to open the website in your browser...
pause >nul

REM Open website in default browser
start http://localhost:8000

echo.
echo Press any key to exit...
pause >nul
