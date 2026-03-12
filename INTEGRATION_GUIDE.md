# LLM-Powered Contact Management Chatbot - Integration Guide

## 🚀 Overview

Your Contact Management App has been upgraded with an AI-powered conversational assistant that can:
- ✅ Add new contacts through natural conversation
- ✅ Update contact information
- ✅ Delete contacts
- ✅ Show all contacts
- ✅ Handle voice input (Web Speech API)
- ✅ Maintain conversation history

The chatbot uses **tool/function calling** to make decisions about which operations to perform, ensuring the LLM never directly accesses the database.

---

## 📋 Architecture

```
User Message (Text or Voice)
    ↓
Frontend Chat UI (React)
    ↓
Backend /chat Endpoint (LLM Service)
    ↓
LLM Processes with Available Tools
    ↓
Tool Decision → Backend Executes API
    ↓
Response Back to Chat UI
    ↓
Display to User (Text + Optional Voice)
```

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB (local or cloud)
- LLM API Key (optional - you can use local Ollama)

### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

New dependency added:
- `axios` - for API calls to LLM providers

**Frontend:**
Already has all dependencies. If you want to add more speech features, nothing new is needed.

---

## 🔑 LLM Configuration

Choose ONE of the following LLM providers:

### Option 1: OpenAI (ChatGPT) - Recommended for Accuracy

1. **Get API Key:**
   - Go to https://platform.openai.com/account/api-keys
   - Create new API key
   - Copy the key

2. **Configure `.env`:**
   ```bash
   # backend/.env
   MONGODB_URI=mongodb://localhost:27017/contact-management
   
   LLM_PROVIDER=openai
   LLM_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxx
   LLM_MODEL=gpt-3.5-turbo
   
   PORT=5000
   ```

3. **Cost:** ~$0.002 per conversation (very cheap)

---

### Option 2: Google Gemini - Free Tier Available

1. **Get API Key:**
   - Go to https://makersuite.google.com/app/apikey
   - Create new API key
   - Copy the key

2. **Configure `.env`:**
   ```bash
   # backend/.env
   MONGODB_URI=mongodb://localhost:27017/contact-management
   
   LLM_PROVIDER=gemini
   LLM_API_KEY=xxxxxxxxxxxxxxxxxxxxxx
   LLM_MODEL=gemini-pro
   
   PORT=5000
   ```

3. **Cost:** Free tier available (60 requests/minute)

---

### Option 3: Ollama (Local, Free, Private) - Best for Development

1. **Install Ollama:**
   - Download from https://ollama.ai
   - Install and run the application

2. **Download a Model:**
   ```bash
   ollama run mistral
   # or: ollama run llama2
   # or: ollama run neural-chat
   ```

3. **Configure `.env`:**
   ```bash
   # backend/.env
   MONGODB_URI=mongodb://localhost:27017/contact-management
   
   LLM_PROVIDER=ollama
   LLM_ENDPOINT=http://localhost:11434
   LLM_MODEL=mistral
   
   PORT=5000
   ```

4. **Cost:** $0 (runs locally)

---

## 📂 New Files Added

### Backend

```
backend/
├── routes/
│   └── chatRoutes.js                 # NEW: Chat endpoint (LLM integration)
├── services/
│   └── llmService.js                 # NEW: LLM provider abstraction
├── tools/
│   └── contactTools.js               # NEW: Tool definitions & execution
├── .env.example                       # NEW: Environment template
└── server.js                          # MODIFIED: Added chat routes
```

### Frontend

```
frontend/
└── src/components/chatbot/
    ├── ChatbotWidget.jsx              # Floating chat button
    ├── ChatWindow.jsx                 # MODIFIED: LLM backend integration
    ├── MessageBubble.jsx              # Message display
    ├── VoiceInput.jsx                 # Voice input support
    └── chatbotLogic.js                # MODIFIED: LLM backend processing
```

---

## 🚀 Running the Application

### 1. Start MongoDB
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (no local installation needed)
```

### 2. Start Backend
```bash
cd backend
npm install
npm run dev
```

Server will start on `http://localhost:5000`

### 3. Start Frontend
```bash
cd frontend
npm run dev
```

Frontend will start on `http://localhost:5173` (or next available port)

### 4. Test the Chatbot

Open the app, click the chat bubble at bottom-right, and try:

**Add Contact:**
- "Add a contact"
- "Add John with email john@example.com and phone 9999999999"
- "Create a new contact named Sarah, email sarah@gmail.com, phone 8888888888"

**Show Contacts:**
- "Show my contacts"
- "List all contacts"
- "Display contacts"

**Update Contact:**
- "Update John's phone to 1111111111"
- "Change Sarah's email to newemail@gmail.com"
- "Edit John"

**Delete Contact:**
- "Delete John"
- "Remove Sarah"
- "Delete contact named John"

**Voice Input:**
- Click the microphone button
- Say what you want to do
- The LLM will process your voice and execute

---

## 🔧 Tool Definitions

The LLM has access to these tools:

### 1. add_contact
```json
{
  "name": "add_contact",
  "parameters": {
    "name": "Contact name (required)",
    "email": "Email address (required)",
    "phone": "Phone number (required)"
  }
}
```

### 2. get_contacts
```json
{
  "name": "get_contacts",
  "parameters": {}
}
```

### 3. update_contact
```json
{
  "name": "update_contact",
  "parameters": {
    "name": "Contact name to find (required)",
    "email": "New email (optional)",
    "phone": "New phone (optional)"
  }
}
```

### 4. delete_contact
```json
{
  "name": "delete_contact",
  "parameters": {
    "name": "Contact name to delete (required)"
  }
}
```

---

## 💬 Conversation Flow Example

```
User: "Add a new contact"
Bot: [Sends to LLM, LLM asks for information]
Bot: "I'll help you add a contact. What is the person's name?"

User: "Vikas"
Bot: [LLM understands we're collecting info for add_contact]
Bot: "What email should I add for Vikas?"

User: "vikas@gmail.com"
Bot: "And what's the phone number?"

User: "9980842007"
Bot: [LLM calls add_contact tool with all parameters]
Bot: "Contact 'Vikas' added successfully! (vikas@gmail.com, 9980842007)"
```

---

## 🎙️ Voice Features

The chatbot supports:

1. **Speech Recognition (User Voice → Text)**
   - Click microphone icon
   - Speak your request
   - Voice is converted to text and sent to LLM

2. **Speech Synthesis (Bot Text → Voice)**
   - Automatic text-to-speech for bot responses
   - Works in all modern browsers
   - Can be disabled if desired

**Browser Support:**
- Chrome ✅
- Firefox ✅
- Safari ✅
- Edge ✅
- Mobile browsers ✅

---

## 🔄 Conversation Management

Each session maintains conversation history with the LLM. This allows:

- Multi-turn conversations
- Context awareness
- Follow-up questions

**Reset Conversation:**
- Click the reset icon (↻) in chat header
- Clears conversation history
- Starts fresh

---

## 🛡️ Security Notes

1. **API Keys:** Never commit `.env` to git. Use `.env.example` as template
2. **Frontend:** Users don't send direct DB queries - only natural language
3. **Backend:** LLM never has DB access. Tool calling is sandboxed
4. **CORS:** Frontend and backend communicate via CORS (configured in server.js)

---

## 🐛 Troubleshooting

### Issue: Chat returns error
**Solution:** Check backend is running on port 5000
```bash
# Terminal
cd backend
npm run dev
```

### Issue: "Cannot GET /chat"
**Solution:** Ensure chatRoutes are imported in server.js (already done)

### Issue: LLM API key not working
**Solution:** 
- Verify API key in `.env` is correct
- Check API key has appropriate permissions
- For OpenAI: Visit https://platform.openai.com/account/api-keys
- For Gemini: Visit https://makersuite.google.com/app/apikey

### Issue: Ollama connection error
**Solution:**
- Ensure Ollama is running: `ollama serve`
- Check endpoint is `http://localhost:11434`
- Download model: `ollama run mistral` (takes ~5 min first time)

### Issue: Voice input not working
**Solution:**
- Check browser supports Web Speech API
- Try Chrome/Edge (best support)
- Allow microphone permission when prompted
- Check microphone is working

---

## 📊 API Endpoints

### Chat Endpoint
```
POST /chat
Content-Type: application/json

Body:
{
  "message": "Add a contact named John",
  "sessionId": "optional_session_id"
}

Response:
{
  "type": "text" | "tool",
  "content": "Response message",
  "contacts": [...],  // Only if showing contacts
  "success": true
}
```

### Reset Conversation
```
POST /chat/reset

Body:
{
  "sessionId": "optional_session_id"
}

Response:
{
  "message": "Conversation reset"
}
```

---

## 🎨 Customization

### Change Chat Appearance
Edit [frontend/src/components/chatbot/ChatWindow.jsx](frontend/src/components/chatbot/ChatWindow.jsx)

### Change LLM Behavior
Edit the system prompt in [backend/services/llmService.js](backend/services/llmService.js)

### Add More Tools
1. Define tool in [backend/tools/contactTools.js](backend/tools/contactTools.js)
2. Add execution logic in `executeTool()`
3. Tool will automatically be available to LLM

### Change Models
Update `.env`:
```bash
# OpenAI models: gpt-3.5-turbo, gpt-4, gpt-4-turbo
LLM_MODEL=gpt-4

# Gemini models: gemini-pro, gemini-1.5-pro
LLM_MODEL=gemini-1.5-pro

# Ollama models: mistral, llama2, neural-chat, starling-lm
LLM_MODEL=neural-chat
```

---

## 📚 Resources

- **OpenAI API:** https://platform.openai.com/docs/api-reference
- **Google Gemini:** https://ai.google.dev/docs
- **Ollama:** https://github.com/ollama/ollama
- **Web Speech API:** https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API

---

## ✨ Features Implemented

- ✅ LLM integration (OpenAI/Gemini/Ollama)
- ✅ Function/Tool calling
- ✅ Conversation history management
- ✅ Natural language CRUD operations
- ✅ Voice input (Speech Recognition)
- ✅ Voice output (Speech Synthesis)
- ✅ Error handling & validation
- ✅ Responsive chat UI
- ✅ Typing indicators
- ✅ Session management

---

## 🎉 You're All Set!

Your Contact Management App now has an intelligent AI assistant. Enjoy!

**Questions or issues?** Check the troubleshooting section above or review the code comments.

Happy chatting! 🤖💬
