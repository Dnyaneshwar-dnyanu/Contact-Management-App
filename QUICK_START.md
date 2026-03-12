# Quick Start Guide - LLM Contact Assistant

Get your AI-powered chatbot running in 5 minutes!

## 1️⃣ Choose Your LLM Provider

Pick ONE option:

### 🆓 **Cheapest: Ollama (Free, Local)**
```bash
# Download: https://ollama.ai

# Run Ollama (keep this running):
ollama serve

# In another terminal, download a model:
ollama run mistral
```
**Then in `.env`:**
```
LLM_PROVIDER=ollama
LLM_ENDPOINT=http://localhost:11434
LLM_MODEL=mistral
```

### 💰 **Best Value: Google Gemini (Free tier)**
1. Get API key: https://makersuite.google.com/app/apikey
2. **In `.env`:**
```
LLM_PROVIDER=gemini
LLM_API_KEY=your_api_key_here
LLM_MODEL=gemini-pro
```

### 🟢 **Most Accurate: OpenAI (Paid)**
1. Get API key: https://platform.openai.com/account/api-keys
2. **In `.env`:**
```
LLM_PROVIDER=openai
LLM_API_KEY=sk_your_key_here
LLM_MODEL=gpt-3.5-turbo
```

---

## 2️⃣ Setup Backend

```bash
cd backend

# Copy env template
cp .env.example .env

# Edit .env with your chosen LLM (see step 1)
# nano .env    # or use your editor

# Install dependencies
npm install

# Start server
npm run dev
```

✅ Backend running on `http://localhost:5000`

---

## 3️⃣ Setup Frontend

```bash
cd frontend

# Already has all dependencies!
npm run dev
```

✅ Frontend running on `http://localhost:5173`

---

## 4️⃣ Open Browser

Go to: `http://localhost:5173`

---

## 5️⃣ Test Chatbot

Click the 🟦 chat button in bottom-right

**Try these:**
- "Add a contact named John, email john@example.com, phone 9999999999"
- "Show my contacts"
- "Update John's phone to 1111111111"
- "Delete John"
- "Add Sarah" (bot will ask for details)

---

## ✨ Features to Try

🎤 **Voice Input**
- Click the 🎤 button
- Speak your request
- Bot responds with voice too!

💬 **Natural Language**
- "What contacts do I have?"
- "Create a new contact"
- "Tell me about John"
- "Remove the contact named Sarah"

🔄 **Multi-turn Conversations**
- Bot asks for missing info
- Maintains context across messages
- Can restart with ↻ button

---

## 📊 LLM Quality Comparison

| | **Ollama** | **Gemini** | **OpenAI** |
|---|---|---|---|
| Cost | Free | Free (60req/min) | $0.002/msg |
| Speed | Very Fast | Fast | Fast |
| Accuracy | Good | Excellent | Excellent |
| Setup | 5 min | 2 min | 2 min |
| Privacy | Local | Cloud | Cloud |

**Recommendation:** Start with Ollama for development, use OpenAI for production.

---

## 🐛 Issues?

**"Can't connect to backend"**
```bash
# Check if backend is running:
# Terminal 1: cd backend && npm run dev
```

**"Chat doesn't respond"**
```bash
# Check your LLM provider:

# Ollama:
curl http://localhost:11434/api/tags

# OpenAI/Gemini: 
# Verify API key in .env
```

**"Voice input not working"**
- Use Chrome/Edge (best support)
- Check microphone permissions
- Reload page

---

## 📁 File Structure

```
Your App
├── backend/
│   ├── .env                    ← Your LLM config here!
│   ├── services/llmService.js  ← LLM integration
│   ├── tools/contactTools.js   ← Tool definitions
│   ├── routes/chatRoutes.js    ← Chat endpoint
│   └── server.js
├── frontend/
│   └── src/components/chatbot/
│       ├── ChatWindow.jsx      ← Main chat UI
│       ├── chatbotLogic.js     ← Sends to backend
│       ├── VoiceInput.jsx
│       └── MessageBubble.jsx
└── INTEGRATION_GUIDE.md        ← Full documentation
```

---

## 🔗 Conversation Flow

```
You: "Add John with email john@example.com"
     ↓
[Frontend] ChatbotWidget.jsx
     ↓
[Backend] POST /chat → llmService.js
     ↓
[LLM] "I need to call add_contact tool"
     ↓
[Backend] contactTools.js executes add_contact()
     ↓
[Database] MongoDB saves contact
     ↓
[Bot] "Contact added successfully!"
     ↓
[You] See message with 🎤 voice response
```

---

## 🚀 Production Tips

1. **Use environment-specific configs**
   ```bash
   # .env.development  (Ollama - free)
   # .env.production   (OpenAI - accurate)
   ```

2. **Add session management**
   - Store sessions in Redis
   - Limit conversation history

3. **Implement rate limiting**
   - Prevent abuse
   - Manage API costs

See `INTEGRATION_GUIDE.md` for production checklist.

---

## 📚 Learn More

- **Full Docs:** [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)
- **API Details:** [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **LLM Providers:**
  - OpenAI: https://openai.com/pricing
  - Gemini: https://ai.google.dev
  - Ollama: https://ollama.ai

---

**Enjoy your AI Contact Assistant! 🤖**

Questions? Check `INTEGRATION_GUIDE.md` → Troubleshooting section.
