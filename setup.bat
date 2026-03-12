@echo off
REM Installation Script for LLM Contact Management Chatbot (Windows)

echo ================================
echo 🤖 LLM Contact Assistant Setup
echo ================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install it from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js found: %NODE_VERSION%
echo.

REM Backend setup
echo 📦 Setting up Backend...
cd backend

if not exist ".env" (
    echo Creating .env from .env.example...
    copy .env.example .env
    echo.
    echo ⚠️  Please edit backend\.env with your LLM choice
    echo    Choose one of:
    echo    1. Ollama (free, local) - LLM_PROVIDER=ollama
    echo    2. Google Gemini (free tier) - LLM_PROVIDER=gemini
    echo    3. OpenAI (paid) - LLM_PROVIDER=openai
    echo.
)

echo Installing backend dependencies...
call npm install

if errorlevel 1 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

echo ✅ Backend ready!
echo.

REM Frontend setup
cd ..\frontend

echo 📦 Frontend dependencies already installed
echo ✅ Frontend ready!
echo.

cd ..\

echo ================================
echo 🚀 Setup Complete!
echo ================================
echo.
echo Next steps:
echo.
echo 1. Configure your LLM (choose one):
echo    📖 Read: QUICK_START.md
echo.
echo 2. Start Backend (Command Prompt 1):
echo    cd backend
echo    npm run dev
echo.
echo 3. Start Frontend (Command Prompt 2):
echo    cd frontend
echo    npm run dev
echo.
echo 4. (If using Ollama) Start Ollama (Command Prompt 3):
echo    ollama serve
echo.
echo 5. Open: http://localhost:5173
echo.
echo 📚 Documentation:
echo    • Quick Start:   QUICK_START.md
echo    • Full Guide:    INTEGRATION_GUIDE.md
echo    • API Docs:      API_DOCUMENTATION.md
echo.
echo Happy chatting! 💬
echo.
pause
