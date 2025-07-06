@echo off
title Agri-Lift Soil Insight - Startup
color 0A

echo.
echo ========================================
echo    Agri-Lift Soil Insight Startup
echo ========================================
echo.

echo [INFO] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [INFO] Checking npm installation...
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed or not in PATH
    pause
    exit /b 1
)

echo [INFO] Navigating to project directory...
cd /d "%~dp0"

echo [INFO] Installing dependencies if needed...
if not exist "node_modules" (
    echo [INFO] Installing root dependencies...
    npm install
)

if not exist "backend\node_modules" (
    echo [INFO] Installing backend dependencies...
    cd backend
    npm install
    cd ..
)

echo.
echo [INFO] Starting the application...
echo [INFO] Backend will run on: http://localhost:8081
echo [INFO] Frontend will run on: http://localhost:8080
echo.
echo Press Ctrl+C to stop the servers
echo.

npm run dev:smart

echo.
echo [INFO] Application stopped.
pause
