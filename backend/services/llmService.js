/**
 * LLM Service Layer
 * Supports: OpenAI (ChatGPT), Google Gemini, and Ollama (local)
 * Handles message processing with tool calling
 */

const axios = require('axios');

class LLMService {
  constructor() {
    this.provider = process.env.LLM_PROVIDER || 'openai';
    this.apiKey = process.env.LLM_API_KEY;
    this.endpoint = process.env.LLM_ENDPOINT;
    this.model = process.env.LLM_MODEL || 'gpt-3.5-turbo';
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
      if (this.provider === 'openai') {
        return await this.callOpenAI(userMessage, tools);
      } else if (this.provider === 'gemini') {
        return await this.callGemini(userMessage, tools);
      } else if (this.provider === 'ollama') {
        return await this.callOllama(userMessage, tools);
      } else {
        throw new Error(`Unsupported LLM provider: ${this.provider}`);
      }
    } catch (error) {
      console.error('LLM Error:', error);
      return {
        type: 'text',
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`
      };
    }
  }

  /**
   * Call OpenAI API with function calling
   */
  async callOpenAI(userMessage, tools) {
    const openaiTools = tools.map(tool => ({
      type: 'function',
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters
      }
    }));

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: this.model,
        messages: this.buildMessages(),
        tools: openaiTools,
        tool_choice: 'auto',
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const choice = response.data.choices[0];

    if (choice.message.tool_calls && choice.message.tool_calls.length > 0) {
      const toolCall = choice.message.tool_calls[0];
      const toolName = toolCall.function.name;
      const toolArgs = JSON.parse(toolCall.function.arguments);

      // Add assistant message to history
      this.conversationHistory.push({
        role: 'assistant',
        content: choice.message.content || '',
        tool_calls: choice.message.tool_calls
      });

      return {
        type: 'tool',
        content: 'Executing...',
        toolName: toolName,
        toolArgs: toolArgs
      };
    } else {
      const content = choice.message.content;
      this.conversationHistory.push({
        role: 'assistant',
        content: content
      });

      return {
        type: 'text',
        content: content
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

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;

    const body = {
      contents: [
        {
            role : "user" ,
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
          'x-goog-api-key': process.env.LLM_API_KEY
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

      console.error(
        "Response Data:",
        JSON.stringify(error.response.data, null, 2)
      );

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
   * Call Ollama (local LLM) with function calling
   */
  async callOllama(userMessage, tools) {
    const toolsDescription = tools.map(tool => 
      `Tool: ${tool.name}\nDescription: ${tool.description}\nParameters: ${JSON.stringify(tool.parameters)}`
    ).join('\n\n');

    const systemPrompt = `You are a helpful contact management assistant. You have access to the following tools:

${toolsDescription}

When the user requests an action, respond with a JSON function call in this format:
{"tool": "tool_name", "args": {"arg1": "value1", "arg2": "value2"}}

If the user just wants to chat or if you can't determine which tool to use, respond normally without a function call.`;

    const response = await axios.post(
      `${this.endpoint}/api/generate`,
      {
        model: this.model,
        prompt: userMessage,
        system: systemPrompt,
        stream: false
      }
    );

    const content = response.data.response;

    // Try to parse function call
    try {
      const functionCallMatch = content.match(/\{"tool":\s*"([^"]+)",\s*"args":\s*(\{[^}]+\})\}/);
      if (functionCallMatch) {
        const toolName = functionCallMatch[1];
        const toolArgs = JSON.parse(functionCallMatch[2]);

        this.conversationHistory.push({
          role: 'assistant',
          content: content
        });

        return {
          type: 'tool',
          content: 'Executing...',
          toolName: toolName,
          toolArgs: toolArgs
        };
      }
    } catch (e) {
      // Not a function call, treat as text
    }

    this.conversationHistory.push({
      role: 'assistant',
      content: content
    });

    return {
      type: 'text',
      content: content
    };
  }

  /**
   * Build messages array for LLM
   */
  buildMessages() {
    const systemMessage = {
      role: 'system',
      content: `You are a helpful contact management assistant. You help users manage their contacts through a conversational interface. 
      
Be concise and friendly in your responses. When executing tools, be clear about what action you're performing.
If the user asks for something you can't do with the available tools, let them know.
Always confirm successful operations with a friendly message.`
    };

    return [systemMessage, ...this.conversationHistory];
  }

  /**
   * Build prompt for Gemini
   */
  buildGeminiPrompt(userMessage) {
    return `User: ${userMessage}\n\nYou are a helpful contact management assistant. Help the user manage their contacts.`;
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
