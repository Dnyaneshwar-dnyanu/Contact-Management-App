# 🚀 LLM Chatbot - Quick Reference Card

## ⚡ 30-Second Setup

```bash
# 1. Choose your LLM
# Option A: Ollama (FREE, Local)
ollama serve          # Keep running
ollama run mistral    # Download model

# Option B: Get API Key
# Gemini: https://makersuite.google.com/app/apikey
# OpenAI: https://platform.openai.com/account/api-keys

# 2. Configure Backend (5 min)
cd backend
cp .env.example .env
# Edit .env with your LLM choice
npm install
npm run dev          # Tab 1

# 3. Run Frontend (Tab 2)
cd frontend
npm run dev

# 4. Test
# Open: http://localhost:5173
# Click chat button → Type: "Add a contact"
```

---

## 🤖 Available Chat Commands

| Command | Example |
|---------|---------|
| Add | "Add John with email john@example.com and phone 9999999999" |
| Show | "Show my contacts" |
| Update | "Update John's phone to 1111111111" |
| Delete | "Delete John" |
| Multi-turn | Bot asks for missing info |

---

## 📁 Key Files

### Backend
- `backend/services/llmService.js` - LLM integration
- `backend/tools/contactTools.js` - Tool definitions
- `backend/routes/chatRoutes.js` - API endpoint
- `backend/.env` - Your config (create from .env.example)

### Frontend
- `frontend/src/components/chatbot/ChatWindow.jsx` - Chat UI
- `frontend/src/components/chatbot/chatbotLogic.js` - Backend caller

---

## 🔧 LLM Configuration

### Ollama (Recommended - Free)
```env
LLM_PROVIDER=ollama
LLM_ENDPOINT=http://localhost:11434
LLM_MODEL=mistral
```

### Gemini (Free tier)
```env
LLM_PROVIDER=gemini
LLM_API_KEY=your_key_here
LLM_MODEL=gemini-pro
```

### OpenAI (Paid)
```env
LLM_PROVIDER=openai
LLM_API_KEY=sk_your_key_here
LLM_MODEL=gpt-3.5-turbo
```

---

## 🐛 Quick Troubleshooting

| Problem | Fix |
|---------|-----|
| "Cannot GET /chat" | Backend not running: `npm run dev` |
| Chat returns error | Check .env LLM config |
| Ollama connection error | `ollama serve` not running |
| Microphone not working | Use Chrome/Edge |

---

## 📚 Documentation

```
START → README_UPGRADE.md
        ↓
        QUICK_START.md (5 min setup)
        ↓
        INTEGRATION_GUIDE.md (complete guide)
        ↓
        API_DOCUMENTATION.md (API details)
        ↓
        IMPLEMENTATION_CHECKLIST.md (verify it works)
```

---

## ✅ Test Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Chat window opens
- [ ] Can add contact: "Add John email john@example.com phone 9999999999"
- [ ] Can show contacts: "Show my contacts"
- [ ] Can update contact: "Update John phone 1111111111"
- [ ] Can delete contact: "Delete John"
- [ ] Voice works (optional): Click 🎤 button

---

## 🎯 Architecture (30 seconds)

```
User Message
    ↓
Frontend (React)
    ↓
Backend (Node.js) - POST /chat
    ↓
LLM (OpenAI/Gemini/Ollama)
    ↓
Tool Decision (add/show/update/delete)
    ↓
Backend Executes Tool
    ↓
Database (MongoDB)
    ↓
Response Back to Chat UI
    ↓
Bot Message + Voice
```

---

## 💡 Pro Tips

1. **Use Ollama for dev** (free, fast, local)
2. **Start with OpenAI for production** (most accurate)
3. **Test with curl first:**
   ```bash
   curl -X POST http://localhost:5000/chat \
     -H "Content-Type: application/json" \
     -d '{"message": "Hi"}'
   ```
4. **Voice features work best in Chrome**
5. **Check browser console (F12) for errors**

---

## 🔗 Important Links

- **Setup:** [QUICK_START.md](QUICK_START.md)
- **Full Guide:** [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)
- **API Docs:** [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Checklist:** [IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md)
- **What Changed:** [WHAT_WAS_DONE.md](WHAT_WAS_DONE.md)

---

## 🟢 Go Live Checklist

- [ ] All chat operations work
- [ ] No errors in console
- [ ] Backend logs are clean
- [ ] Data persists correctly
- [ ] Voice optional features work
- [ ] Ready to customize
- [ ] Ready to deploy

---

## 📞 Need Help?

1. **Quick answers:** [QUICK_START.md](QUICK_START.md)
2. **Setup issues:** [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md#troubleshooting)
3. **API questions:** [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
4. **Architecture:** [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)

---

**You're ready to go! Start with QUICK_START.md** 🚀
