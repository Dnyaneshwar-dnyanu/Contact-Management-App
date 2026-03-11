# API Documentation - LLM Chat Endpoint

## Overview

The backend now includes a new `/chat` endpoint that integrates LLM (Large Language Model) capabilities for natural language contact management. The endpoint handles tool calling, allowing the LLM to decide which CRUD operations to perform.

---

## Base URL

```
http://localhost:5000/chat
```

---

## Endpoints

### 1. POST /chat - Process Chat Message

Sends a user message to the LLM and returns the bot's response. The LLM may decide to execute tools (CRUD operations).

**Request:**
```http
POST /chat
Content-Type: application/json

{
  "message": "Add a new contact named John with email john@example.com and phone 9999999999",
  "sessionId": "user_123"  // Optional: for conversation history
}
```

**Response - Text Response:**
```json
{
  "type": "text",
  "content": "I'll help you add that contact. Can you please confirm the details?"
}
```

**Response - Tool Execution:**
```json
{
  "type": "tool",
  "content": "Contact 'John' added successfully!",
  "success": true,
  "contacts": null
}
```

**Response - Show Contacts:**
```json
{
  "type": "tool",
  "content": "Found 3 contacts",
  "success": true,
  "contacts": [
    {
      "name": "John",
      "email": "john@example.com",
      "phone": "9999999999"
    },
    {
      "name": "Sarah",
      "email": "sarah@gmail.com",
      "phone": "8888888888"
    },
    {
      "name": "Mike",
      "email": "mike@yahoo.com",
      "phone": "7777777777"
    }
  ]
}
```

**Response - Error:**
```json
{
  "type": "text",
  "content": "Sorry, I encountered an error: [error message]"
}
```

---

### 2. POST /chat/reset - Reset Conversation

Clears the conversation history for a session, starting fresh.

**Request:**
```http
POST /chat/reset
Content-Type: application/json

{
  "sessionId": "user_123"  // Optional: use default if omitted
}
```

**Response:**
```json
{
  "message": "Conversation reset"
}
```

---

## Tools Available to LLM

The LLM has access to these tools for decision-making:

### Tool: add_contact

**Description:** Add a new contact to the database

**Parameters:**
- `name` (string, required): Contact's full name
- `email` (string, required): Contact's email address (must be unique)
- `phone` (string, required): Contact's phone number

**Example:**
```
User: "Add John with email john@example.com and phone 9999999999"
→ LLM calls: add_contact(name="John", email="john@example.com", phone="9999999999")
```

---

### Tool: get_contacts

**Description:** Retrieve all contacts from the database

**Parameters:** None

**Example:**
```
User: "Show me all contacts"
→ LLM calls: get_contacts()
```

**Returns:**
```json
{
  "contacts": [
    { "name": "John", "email": "john@example.com", "phone": "9999999999" },
    { "name": "Sarah", "email": "sarah@gmail.com", "phone": "8888888888" }
  ]
}
```

---

### Tool: update_contact

**Description:** Update a contact's information by name

**Parameters:**
- `name` (string, required): Contact's name to find and update
- `email` (string, optional): New email address
- `phone` (string, optional): New phone number

**Example:**
```
User: "Update John's phone to 1111111111"
→ LLM calls: update_contact(name="John", phone="1111111111")
```

---

### Tool: delete_contact

**Description:** Delete a contact by name

**Parameters:**
- `name` (string, required): Contact's name to delete

**Example:**
```
User: "Delete John"
→ LLM calls: delete_contact(name="John")
```

---

## Conversation Examples

### Example 1: Add Contact (Multi-turn)

**Turn 1:**
```
User Message: "I want to add a new contact"

Request:
{
  "message": "I want to add a new contact",
  "sessionId": "session_1"
}

Response:
{
  "type": "text",
  "content": "I'd be happy to help! What is the person's name?"
}
```

**Turn 2:**
```
User Message: "His name is John"

Request:
{
  "message": "His name is John",
  "sessionId": "session_1"
}

Response:
{
  "type": "text",
  "content": "What is John's email address?"
}
```

**Turn 3:**
```
User Message: "john@example.com"

Request:
{
  "message": "john@example.com",
  "sessionId": "session_1"
}

Response:
{
  "type": "text",
  "content": "And what's John's phone number?"
}
```

**Turn 4:**
```
User Message: "9999999999"

Request:
{
  "message": "9999999999",
  "sessionId": "session_1"
}

Response:
{
  "type": "tool",
  "content": "Contact 'John' added successfully! (john@example.com, 9999999999)",
  "success": true,
  "contacts": null
}
```

### Example 2: Direct Add (Single Message)

```
User Message: "Add a contact named Sarah with email sarah@gmail.com and phone 8888888888"

Request:
{
  "message": "Add a contact named Sarah with email sarah@gmail.com and phone 8888888888",
  "sessionId": "session_1"
}

Response:
{
  "type": "tool",
  "content": "Contact 'Sarah' added successfully! (sarah@gmail.com, 8888888888)",
  "success": true,
  "contacts": null
}
```

### Example 3: Show Contacts

```
User Message: "Show all my contacts"

Request:
{
  "message": "Show all my contacts",
  "sessionId": "session_1"
}

Response:
{
  "type": "tool",
  "content": "Found 2 contacts",
  "success": true,
  "contacts": [
    {
      "name": "John",
      "email": "john@example.com",
      "phone": "9999999999"
    },
    {
      "name": "Sarah",
      "email": "sarah@gmail.com",
      "phone": "8888888888"
    }
  ]
}
```

### Example 4: Update Contact

```
User Message: "Update John's phone to 1111111111"

Request:
{
  "message": "Update John's phone to 1111111111",
  "sessionId": "session_1"
}

Response:
{
  "type": "tool",
  "content": "Contact 'John' updated successfully! (john@example.com, 1111111111)",
  "success": true,
  "contacts": null
}
```

### Example 5: Delete Contact

```
User Message: "Delete Sarah"

Request:
{
  "message": "Delete Sarah",
  "sessionId": "session_1"
}

Response:
{
  "type": "tool",
  "content": "Contact 'Sarah' has been deleted successfully!",
  "success": true,
  "contacts": null
}
```

---

## Error Handling

### Missing Required Field

```
User Message: "Add John with email john@example.com"  // Missing phone

Response:
{
  "type": "text",
  "content": "To add a contact, I need the name, email, and phone number. Could you provide the phone number for John?"
}
```

### Duplicate Email

```
User Message: "Add John with email john@example.com and phone 9999999999"  // Email already exists

Response:
{
  "type": "tool",
  "content": "Sorry, a contact with email john@example.com already exists.",
  "success": false
}
```

### Contact Not Found

```
User Message: "Delete NonexistentContact"

Response:
{
  "type": "tool",
  "content": "Sorry, I couldn't find a contact named 'NonexistentContact'",
  "success": false
}
```

### Invalid Request

```
{
  "status": 400,
  "error": "Message is required"
}
```

### LLM Service Error

```
{
  "status": 500,
  "type": "text",
  "content": "Sorry, something went wrong. Please try again."
}
```

---

## Session Management

Each conversation can have a unique `sessionId` to maintain context. Without a sessionId, the default session is used.

**Benefits:**
- Multiple conversations can run simultaneously
- Each maintains separate history
- Reset one without affecting others

**Example:**
```javascript
// User 1
POST /chat
{ "message": "Add John", "sessionId": "user_1" }

// User 2
POST /chat
{ "message": "Add Sarah", "sessionId": "user_2" }

// Reset User 1 only
POST /chat/reset
{ "sessionId": "user_1" }
```

---

## Response Types

### text
Normal conversational response. The LLM is asking questions or providing information without executing tools.

```json
{
  "type": "text",
  "content": "What's the contact's email address?"
}
```

### tool
Tool execution response. The LLM called a function and completed a CRUD operation.

```json
{
  "type": "tool",
  "content": "Contact added successfully",
  "success": true,
  "contacts": [...]  // Only if showing contacts
}
```

---

## Best Practices

1. **Use SessionId for Accuracy:** Provide consistent sessionId to maintain conversation context
   ```javascript
   const sessionId = userId || "default";
   ```

2. **Handle Errors Gracefully:** Check response.success and type
   ```javascript
   if (response.success) {
     // Display contacts or success message
   } else {
     // Show error or retry
   }
   ```

3. **Be Specific in Requests:** More details help LLM make correct decisions
   ```
   ✅ Good: "Add John with email john@example.com and phone 9999999999"
   ❌ Bad: "Add John"  (LLM will ask for more info)
   ```

4. **Use Natural Language:** The LLM understands various phrasings
   ```
   All equivalent to get_contacts:
   - "Show my contacts"
   - "List all contacts"
   - "Display contacts"
   - "What contacts do I have?"
   ```

---

## Integration Examples

### React/JavaScript
```javascript
async function sendChatMessage(message, sessionId) {
  const response = await fetch('http://localhost:5000/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sessionId })
  });
  return response.json();
}
```

### cURL
```bash
curl -X POST http://localhost:5000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Add a contact named John",
    "sessionId": "user_123"
  }'
```

### Python
```python
import requests

response = requests.post('http://localhost:5000/chat', json={
    'message': 'Add a contact named John',
    'sessionId': 'user_123'
})
print(response.json())
```

---

## LLM Provider Configuration

The endpoint works with multiple LLM providers configured via environment variables:

- **OpenAI:** `LLM_PROVIDER=openai`
- **Google Gemini:** `LLM_PROVIDER=gemini`
- **Ollama:** `LLM_PROVIDER=ollama`

See [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) for detailed setup instructions.

---

## Rate Limiting (Optional Enhancement)

For production, consider implementing rate limiting:

```javascript
const rateLimit = require('express-rate-limit');

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limit each session to 100 requests per windowMs
});

router.post('/', chatLimiter, chatHandler);
```

---

## Performance Notes

- Average response time: 1-3 seconds (depends on LLM provider)
- Ollama (local): Fastest, no API call overhead
- Gemini: Fast, free tier available
- OpenAI: Most accurate but requires API key

---

## Monitoring & Debugging

Enable verbose logging in backend/services/llmService.js:

```javascript
console.log('LLM Response:', response);
console.log('Tool Called:', toolName, 'with args:', toolArgs);
```

Check server logs for:
- API errors
- Tool execution issues
- Conversation state

---

**End of Documentation**
