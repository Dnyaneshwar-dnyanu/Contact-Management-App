import axios from 'axios';

const API_BASE = 'http://localhost:5000';

/**
 * Process user input by sending to LLM backend
 * The backend handles:
 * - LLM processing
 * - Tool calling decisions
 * - Contact CRUD operations
 * - Conversation history
 */
export const processInput = async (input, state, setMessages) => {
  const sessionId = state.sessionId || 'default';
  
  try {
    // Send message to backend LLM
    const response = await axios.post(`${API_BASE}/chat`, {
      message: input,
      sessionId: sessionId
    });

    const { type, content, contacts, success } = response.data;

    // Add bot message
    if (type === 'text') {
      // Regular text response
      setMessages((prev) => [...prev, { sender: 'bot', text: content }]);
      speak(content);
    } else if (type === 'tool') {
      // Tool execution response (contact operation)
      let botMessage = content;
      
      if (contacts && contacts.length > 0) {
        // Format contact list display
        const contactList = contacts
          .map(c => `${c.name} (${c.email}, ${c.phone})`)
          .join('\n');
        botMessage = `${content}\n\n${contactList}`;
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: botMessage }]);
      speak(content);
    }

    return {
      ...state,
      sessionId: sessionId
    };
  } catch (error) {
    console.error('Error processing input:', error);
    const errorMsg = error.response?.data?.content || 'Sorry, something went wrong. Please try again.';
    setMessages((prev) => [...prev, { sender: 'bot', text: errorMsg }]);
    speak(errorMsg);
    return state;
  }
};

/**
 * Text-to-speech using Web Speech API
 */
const speak = (msg) => {
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(msg);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Speech synthesis error:', error);
    }
  }
};

/**
 * Reset conversation on the backend
 */
export const resetConversation = async (sessionId = 'default') => {
  try {
    await axios.post(`${API_BASE}/chat/reset`, { sessionId });
  } catch (error) {
    console.error('Error resetting conversation:', error);
  }
};
