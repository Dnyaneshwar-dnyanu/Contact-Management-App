# 🤖 LLM-Powered MERN Contact Management Application

An advanced contact management system with an **AI-powered conversational chatbot** that can manage your contacts through natural language, powered by OpenAI, Google Gemini, or local Ollama.

## ✨ Key Features

### 🎯 AI-Powered Contact Management
- **Add contacts** through natural conversation
- **Update contact information** intelligently  
- **Delete contacts** with confirmation
- **Show contacts** in formatted lists
- **Multi-turn conversations** with context awareness

### 🗣️ Voice Capabilities
- 🎤 **Voice Input** - Speak your commands (Speech Recognition API)
- 🔊 **Voice Output** - Bot responds with speech (Speech Synthesis API)
- Supported on all modern browsers

### 🧠 Multiple AI Providers
- **OpenAI (ChatGPT)** - Most accurate, requires API key (~$0.002 per conversation)
- **Google Gemini** - Free tier available (60 requests/minute)
- **Ollama** - Local, free, completely private (recommended for development)

### 🔐 Secure Tool-Based Architecture
- LLM never directly accesses the database
- Function calling determines which operations to perform
- All commands validated and sandboxed
- Private conversations stay private (with Ollama)

---

## 🚀 Quick Start (5 Minutes)

### Option 1: Ollama (Free, Recommended)
```bash
# 1. Install Ollama: https://ollama.ai
# 2. Run Ollama in background:
ollama serve
ollama run mistral  # Download model

# 3. In another terminal:
cd backend
cp .env.example .env
# Edit .env: LLM_PROVIDER=ollama, LLM_ENDPOINT=http://localhost:11434
npm install && npm run dev

# 4. In another terminal:
cd frontend
npm run dev

# 5. Open: http://localhost:5173
```

### Option 2: Google Gemini (Free Tier)
```bash
# Get API key: https://makersuite.google.com/app/apikey
cd backend
cp .env.example .env
# Edit .env: LLM_PROVIDER=gemini, LLM_API_KEY=your_key, LLM_MODEL=gemini-pro
npm install && npm run dev

# In another terminal:
cd frontend
npm run dev
```

### Option 3: OpenAI (Most Accurate)
```bash
# Get API key: https://platform.openai.com/account/api-keys
cd backend
cp .env.example .env
# Edit .env: LLM_PROVIDER=openai, LLM_API_KEY=sk_your_key
npm install && npm run dev

# In another terminal:
cd frontend
npm run dev
```

## 📖 Documentation

| Document | Purpose |
|----------|---------|
| **[QUICK_START.md](QUICK_START.md)** | 🏃 5-minute setup guide (START HERE!) |
| **[INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)** | 📚 Complete setup, configuration, troubleshooting |
| **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** | 🔌 API endpoints, examples, conversation flows |
| **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** | 📋 Overview of changes and features |

## 💬 Example Conversations

### Add Contact (Conversational)
```
You:  "Add a new contact"
Bot:  "I'd be happy to help! What is the person's name?"
You:  "John Smith"
Bot:  "What is John's email address?"
You:  "john@example.com"
Bot:  "And what's John's phone number?"
You:  "9999999999"
Bot:  "Contact 'John Smith' added successfully! ✓"
```

### Quick Add (Direct)
```
You:  "Add Sarah with email sarah@gmail.com and phone 8888888888"
Bot:  "Contact 'Sarah' added successfully! ✓"
```

### Show Contacts
```
You:  "Show all my contacts"
Bot:  "You have 2 contacts:
       • John Smith (john@example.com, 9999999999)
       • Sarah (sarah@gmail.com, 8888888888)"
```

### Update & Delete
```
You:  "Update John's phone to 1111111111"
Bot:  "Contact 'John' updated successfully! ✓"

You:  "Delete Sarah"
Bot:  "Contact 'Sarah' has been deleted successfully! ✓"
```

## 🏗️ Architecture

```
┌──────────────────┐
│  React Frontend  │
│  • Chat UI       │
│  • Voice I/O     │
│  • Messages      │
└────────┬─────────┘
         │ POST /chat
         ▼
┌──────────────────────────────────┐
│   Node.js/Express Backend        │
│   • LLM Integration             │
│   • Tool Calling Logic          │
│   • Conversation Management     │
└────────┬────────────────────────┘
         │ Calls appropriate API
         ▼
┌──────────────────────────────────┐
│   MongoDB Database               │
│   • Stores Contacts              │
│   • Conversation History          │
└──────────────────────────────────┘
```

**Key Point:** The LLM decides WHICH operation to perform, backend executes it securely.

## 📂 Project Structure

```
contact-management-app/
├── backend/
│   ├── services/llmService.js           ✨ NEW: LLM integration (OpenAI/Gemini/Ollama)
│   ├── tools/contactTools.js            ✨ NEW: Tool definitions & execution
│   ├── routes/
│   │   ├── contactRoutes.js             (existing contact CRUD)
│   │   └── chatRoutes.js                ✨ NEW: Chat endpoint
│   ├── models/Contact.js                (existing)
│   ├── config/db.js                     (existing)
│   ├── server.js                        ✏️ MODIFIED: Added chat routes
│   ├── package.json                     ✏️ MODIFIED: Added axios
│   ├── .env.example                     ✨ NEW: Configuration template
│   └── .env                             (not in repo - you create this)
│
├── frontend/
│   └── src/
│       ├── components/chatbot/
│       │   ├── ChatbotWidget.jsx        (existing - floating button)
│       │   ├── ChatWindow.jsx           ✏️ MODIFIED: Better UX
│       │   ├── MessageBubble.jsx        (existing - message display)
│       │   ├── VoiceInput.jsx           (existing - voice support)
│       │   └── chatbotLogic.js          ✏️ MODIFIED: Backend LLM integration
│       ├── pages/
│       ├── App.jsx                      (existing - already imports chatbot)
│       └── main.jsx                     (existing)
│
├── QUICK_START.md                       ✨ NEW: 5-min setup
├── INTEGRATION_GUIDE.md                 ✨ NEW: Complete guide
├── API_DOCUMENTATION.md                 ✨ NEW: API reference
├── IMPLEMENTATION_SUMMARY.md            ✨ NEW: Overview
├── setup.sh                             ✨ NEW: Unix installer
├── setup.bat                            ✨ NEW: Windows installer
└── README.md                            (this file)
```

**Legend:** ✨ = New | ✏️ = Modified | (existing) = Unchanged

## 🔧 Configuration

### Backend `.env` File

**For Ollama (Free):**
```env
LLM_PROVIDER=ollama
LLM_ENDPOINT=http://localhost:11434
LLM_MODEL=mistral
MONGODB_URI=mongodb://localhost:27017/contact-management
PORT=5000
```

**For Google Gemini (Free tier):**
```env
LLM_PROVIDER=gemini
LLM_API_KEY=your_api_key_here
LLM_MODEL=gemini-pro
MONGODB_URI=mongodb://localhost:27017/contact-management
PORT=5000
```

**For OpenAI (Paid):**
```env
LLM_PROVIDER=openai
LLM_API_KEY=sk_your_key_here
LLM_MODEL=gpt-3.5-turbo
MONGODB_URI=mongodb://localhost:27017/contact-management
PORT=5000
```

## 📦 Installation

### Prerequisites
- Node.js 16+ (https://nodejs.org/)
- MongoDB (local or cloud: https://www.mongodb.com/cloud/atlas)
- One LLM provider (OpenAI, Gemini, or Ollama)

### Automated Setup

**On macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

**On Windows:**
```cmd
setup.bat
```

### Manual Setup

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your choice

# Frontend
cd ../frontend
npm install
```

## 🚀 Running the Application

### Terminal 1: Start Backend
```bash
cd backend
npm run dev

# Output: Server running on port 5000
```

### Terminal 2: Start Frontend
```bash
cd frontend
npm run dev

# Output: Local: http://localhost:5173
```

### Terminal 3 (if using Ollama): Keep Ollama Running
```bash
ollama serve

# Will need to run: ollama run mistral (first time)
```

## 🤖 Available Tools (What LLM Can Do)

The LLM has exactly 4 tools:

| Tool | Usage Example |
|------|---------------|
| `add_contact` | "Add John with email john@example.com and phone 9999999999" |
| `get_contacts` | "Show all my contacts" |
| `update_contact` | "Update John's phone to 1111111111" |
| `delete_contact` | "Delete Sarah" |

## 🎙️ Voice Features

### Speech Recognition (You → Bot)
- Click the 🎤 button to speak
- Your voice is converted to text
- Works on Chrome, Firefox, Safari, Edge

### Speech Synthesis (Bot → You)
- Bot automatically speaks its responses
- Adjustable rates and volumes
- Works on all modern browsers

## 🔐 Security Features

✅ **No Direct Database Access**
- LLM cannot query database directly
- All operations go through sandboxed tools
- Type-safe parameter validation

✅ **API Key Protection**
- Environment variables used for sensitive data
- Never commit `.env` to version control
- Multiple provider options for flexibility

✅ **Input Validation**
- Email format verification
- Phone number acceptance
- Contact name validation

## 🐛 Troubleshooting

**Q: Chat doesn't respond**
```
A: Check backend is running: cd backend && npm run dev
```

**Q: LLM API key errors**
```
A: Verify .env has correct API key
   - OpenAI: https://platform.openai.com/account/api-keys
   - Gemini: https://makersuite.google.com/app/apikey
```

**Q: Ollama connection error**
```
A: Ensure Ollama is running: ollama serve
   And model is downloaded: ollama run mistral
```

**Q: Voice input not working**
```
A: Use Chrome/Edge (best support)
   Check browser allows microphone
   Verify microphone is working
```

See [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md#troubleshooting) for more help.

## 📊 Tech Stack

### Frontend
- React 19 + Vite
- Tailwind CSS for styling
- Lucide React for icons
- Axios for HTTP requests
- Web Speech API (built-in browser)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Axios for LLM API calls
- Dotenv for configuration

### AI/ML
- **OpenAI API** (ChatGPT)
- **Google Gemini API**
- **Ollama** (local models)

## 📈 LLM Cost Comparison

| Provider | Cost | Speed | Accuracy | Privacy |
|----------|------|-------|----------|---------|
| **Ollama** | Free | ⚡ Fast | 🟡 Good | 🟢 Local |
| **Gemini** | Free (60/min) | 🟡 Fast | 🟢 Excellent | 🟠 Cloud |
| **OpenAI** | $0.002/msg | 🟡 Fast | 🟢 Excellent | 🟠 Cloud |

**Recommendation:** 
- Development: Ollama (free, fast)
- Production: OpenAI (most accurate) or Gemini (free tier)

## 🎓 Learning Resources

- **Complete Guide:** [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)
- **API Reference:** [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Quick Setup:** [QUICK_START.md](QUICK_START.md)
- **OpenAI Docs:** https://platform.openai.com/docs
- **Gemini Docs:** https://ai.google.dev/docs
- **Ollama:** https://github.com/ollama/ollama

## 🎯 Next Steps

1. **Choose your LLM provider** (Ollama = recommended)
2. **Run setup script** (`setup.sh` or `setup.bat`)
3. **Follow QUICK_START.md** (5 minutes)
4. **Test the chatbot** with sample contacts
5. **Customize** as needed (see INTEGRATION_GUIDE.md)

## 📝 API Reference

### Add Contact
```bash
curl -X POST http://localhost:5000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Add John with email john@example.com and phone 9999999999"}'
```

### Show Contacts
```bash
curl -X POST http://localhost:5000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Show my contacts"}'
```

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for full reference.

## 🎨 Customization

### Change Chat Appearance
Edit: `frontend/src/components/chatbot/ChatWindow.jsx`

### Change LLM Behavior
Edit: `backend/services/llmService.js` (system prompt)

### Add More Tools
1. Define in `backend/tools/contactTools.js`
2. Implement execution logic
3. Tool automatically available to LLM

### Use Different Models
Update `.env`:
```env
# OpenAI: gpt-3.5-turbo, gpt-4, gpt-4-turbo
# Gemini: gemini-pro, gemini-1.5-pro
# Ollama: mistral, llama2, neural-chat
LLM_MODEL=your_model_here
```

## 🚢 Deployment

### Deploy Backend
Recommended: Render, Railway, or Heroku
```bash
# Add start script to package.json if not there
npm start
```

### Deploy Frontend
Recommended: Vercel, Netlify, or GitHub Pages
```bash
npm run build
# Deploy dist/ folder
```

### Important for Production
- Use production LLM API endpoints
- Implement rate limiting
- Use session storage (Redis)
- Add authentication
- Enable HTTPS

See [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md#production-tips) for details.

## 📄 License

This project is part of a contact management application upgrade.

## 🤝 Support

- **Issues?** Check [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md#troubleshooting)
- **API Questions?** See [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Setup Stuck?** Read [QUICK_START.md](QUICK_START.md)

## ✨ Features Summary

✅ LLM Integration (3 providers)
✅ Natural Language Contact Management
✅ Voice Input & Output
✅ Multi-turn Conversations
✅ Tool/Function Calling Architecture
✅ Conversation History
✅ Error Handling
✅ Responsive UI
✅ Production-Ready Code
✅ Comprehensive Documentation

---

## 🎉 You're Ready!

**Start Here:** [QUICK_START.md](QUICK_START.md)

**Create amazing contact management experiences with AI!** 🤖💬
