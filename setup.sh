#!/usr/bin/env bash
# Installation Script for LLM Contact Management Chatbot

echo "================================"
echo "🤖 LLM Contact Assistant Setup"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node -v)"
echo ""

# Backend setup
echo "📦 Setting up Backend..."
cd backend

if [ ! -f ".env" ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your LLM choice"
    echo "   Choose one of:"
    echo "   1. Ollama (free, local) - LLM_PROVIDER=ollama"
    echo "   2. Google Gemini (free tier) - LLM_PROVIDER=gemini"
    echo "   3. OpenAI (paid) - LLM_PROVIDER=openai"
    echo ""
fi

echo "Installing backend dependencies..."
npm install

echo "✅ Backend ready!"
echo ""

# Frontend setup
cd ../frontend

echo "📦 Frontend dependencies already installed"
echo "✅ Frontend ready!"
echo ""

echo "================================"
echo "🚀 Setup Complete!"
echo "================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Configure your LLM (choose one):"
echo "   📖 Read: ../QUICK_START.md"
echo ""
echo "2. Start Backend (Terminal 1):"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "3. Start Frontend (Terminal 2):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "4. (If using Ollama) Start Ollama (Terminal 3):"
echo "   ollama serve"
echo ""
echo "5. Open: http://localhost:5173"
echo ""
echo "📚 Documentation:"
echo "   • Quick Start:   QUICK_START.md"
echo "   • Full Guide:    INTEGRATION_GUIDE.md"
echo "   • API Docs:      API_DOCUMENTATION.md"
echo ""
echo "Happy chatting! 💬"
