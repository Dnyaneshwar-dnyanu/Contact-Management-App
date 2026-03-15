/**
 * LLM Service Layer
 * Supports: Google Gemini
 * Handles message processing with tool calling
 */

const axios = require('axios');

class LLMService {
  constructor() {
    this.apiKey = process.env.LLM_API_KEY;
    this.model = process.env.LLM_MODEL;
    this.conversationHistory = [];
  }

  /**
   * Send message to LLM and get tool calling response
   * Returns: { type: 'text' | 'tool', content: string, toolName?: string, toolArgs?: object }
   */
  async processMessage(userMessage, tools) {
    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      content: userMessage
    });

    try {
      return await this.callGemini(userMessage, tools);
    } catch (error) {
      console.error('LLM Error:', error);
      return {
        type: 'text',
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`
      };
    }
  }

  /**
   * Call Google Gemini API with function calling
   */
  async callGemini(userMessage, tools) {
    try {
      const geminiTools = {
        functionDeclarations: tools.map(tool => ({
          name: tool.name,
          description: tool.description,
          parameters: {
            type: 'object',
            properties: tool.parameters.properties,
            required: tool.parameters.required
          }
        }))
      };

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent`;

      const body = {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: this.buildGeminiPrompt(userMessage)
              }
            ]
          }
        ],
        tools: [geminiTools],
        generationConfig: {
          temperature: 0.7
        }
      };

      // DEBUG LOGS
      console.log("\n===== GEMINI REQUEST =====");
      console.log("URL:", url);
      console.log("BODY:", JSON.stringify(body, null, 2));
      console.log("==========================\n");

      const response = await axios.post(
        url,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': this.apiKey
          }
        }
      );

      console.log("\n===== GEMINI RESPONSE =====");
      console.log(JSON.stringify(response.data, null, 2));
      console.log("===========================\n");

      const content = response.data.candidates[0].content.parts;

      if (content.some(part => part.functionCall)) {
        const functionCall = content.find(part => part.functionCall).functionCall;

        this.conversationHistory.push({
          role: 'assistant',
          content: JSON.stringify(functionCall)
        });

        return {
          type: 'tool',
          content: 'Executing...',
          toolName: functionCall.name,
          toolArgs: functionCall.args || {}
        };
      } else {
        const textContent = content.find(part => part.text)?.text || 'No response';

        this.conversationHistory.push({
          role: 'assistant',
          content: textContent
        });

        return {
          type: 'text',
          content: textContent
        };
      }
    } catch (error) {
      console.error("\n===== GEMINI API ERROR =====");
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);
        console.error("Response Data:", JSON.stringify(error.response.data, null, 2));
      } else if (error.request) {
        console.error("No response received from Gemini:");
        console.error(error.request);
      } else {
        console.error("Axios Error Message:", error.message);
      }
      console.error("=============================\n");
      throw error;
    }
  }

  /**
   * Build prompt for Gemini
   */
  buildGeminiPrompt(userMessage) {
    return `You are a professional Contact Management Assistant. 
Your goal is to help users manage their personal and professional contacts efficiently.

You have access to several tools:
- add_contact: Use this when the user wants to add a new person. You MUST ask for name, email, and phone if they are missing.
- get_contacts: Use this to show the list of all contacts.
- delete_contact: Use this to remove a contact. You need the name of the contact.
- update_contact: Use this to change details of an existing contact.

Rules:
1. Be polite and concise.
2. If a user's request is ambiguous, ask for clarification.
3. When adding a contact, ensure you have all required fields (name, email, phone).
4. For updates and deletions, confirm the name of the contact.
5. If the user just says hi or hello, greet them and explain what you can do.

Current User Message: ${userMessage}`;
  }

  /**
   * Add tool result to conversation history
   */
  addToolResult(toolName, result) {
    this.conversationHistory.push({
      role: 'user',
      content: `Tool result from ${toolName}: ${JSON.stringify(result)}`
    });
  }

  /**
   * Clear conversation history
   */
  resetConversation() {
    this.conversationHistory = [];
  }
}

module.exports = LLMService;
