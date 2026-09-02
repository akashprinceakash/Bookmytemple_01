@echo off
REM BookMyTemple - Quick Setup Script for Windows
REM This script automates the setup process for running the app locally

echo ================================================
echo   BookMyTemple PWA - Quick Setup
echo ================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Display versions
echo [OK] Node.js version:
node -v
echo [OK] npm version:
npm -v
echo.

REM Check if package.json exists
if not exist "package.json" (
    echo [ERROR] package.json not found!
    echo Please make sure you're in the project root directory
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    echo This may take a few minutes...
    call npm install
    
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed successfully!
) else (
    echo [OK] Dependencies already installed
)

echo.
echo ================================================
echo   Setup Complete! 
echo ================================================
echo.
echo To start the development server, run:
echo   npm run dev
echo.
echo The app will be available at:
echo   http://localhost:5173/
echo.
echo To build for production, run:
echo   npm run build
echo.
echo ================================================
pause
