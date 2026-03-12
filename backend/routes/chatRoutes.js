/**
 * Chat Routes
 * Handles the /chat endpoint for LLM-based conversations
 */

const express = require('express');
const router = express.Router();
const LLMService = require('../services/llmService');
const { TOOLS, executeTool } = require('../tools/contactTools');

// Store LLM service per session (in production, use session management)
const llmSessions = new Map();

function getLLMService(sessionId) {
  if (!llmSessions.has(sessionId)) {
    llmSessions.set(sessionId, new LLMService());
  }
  return llmSessions.get(sessionId);
}

/**
 * POST /chat
 * Handles user messages and returns bot responses
 * Body: { message: string, sessionId?: string }
 * Response: { type: 'text' | 'tool', content: string, contacts?: array }
 */
router.post('/', async (req, res) => {
  try {
    const { message, sessionId = 'default' } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const llm = getLLMService(sessionId);
    
    // Get LLM response (which might include tool calling)
    const llmResponse = await llm.processMessage(message, TOOLS);

    // If LLM decided to call a tool
    if (llmResponse.type === 'tool') {
      try {
        const toolResult = await executeTool(llmResponse.toolName, llmResponse.toolArgs);
        
        // Add tool result to conversation history
        llm.addToolResult(llmResponse.toolName, toolResult);

        // Prepare response
        const response = {
          type: 'tool',
          content: toolResult.message || toolResult.error || 'Operation completed',
          contacts: toolResult.contacts || null,
          success: toolResult.success || false
        };

        res.json(response);
      } catch (toolError) {
        console.error('Tool execution error:', toolError);
        res.status(500).json({
          type: 'text',
          content: `Error executing tool: ${toolError.message}`
        });
      }
    } else {
      // Just return the text response from LLM
      res.json({
        type: 'text',
        content: llmResponse.content
      });
    }
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      type: 'text',
      content: 'Sorry, something went wrong. Please try again.'
    });
  }
});

/**
 * POST /chat/reset
 * Reset conversation for a session
 */
router.post('/reset', (req, res) => {
  const { sessionId = 'default' } = req.body;
  
  const llm = getLLMService(sessionId);
  llm.resetConversation();
  
  res.json({ message: 'Conversation reset' });
});

module.exports = router;
