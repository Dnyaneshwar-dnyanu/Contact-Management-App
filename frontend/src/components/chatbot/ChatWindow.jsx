import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import VoiceInput from './VoiceInput';
import { Send, X, Loader2, RotateCcw } from 'lucide-react';
import { processInput, resetConversation } from './chatbotLogic';

const ChatWindow = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Hi! I'm your Contact Assistant. You can ask me to add, update, delete or show your contacts. What would you like to do?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatState, setChatState] = useState({ sessionId: `session_${Date.now()}` });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text) => {
    const currentInput = text || input;
    if (!currentInput.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: currentInput }]);
    setInput('');
    setIsLoading(true);

    // Process with LLM backend
    const newState = await processInput(currentInput, chatState, setMessages);
    setChatState(newState);
    setIsLoading(false);
  };

  const handleReset = async () => {
    await resetConversation(chatState.sessionId);
    setMessages([
      { sender: 'bot', text: "Hi! I'm your Contact Assistant. You can ask me to add, update, delete or show your contacts. What would you like to do?" }
    ]);
  };

  return (
    <div className="flex flex-col h-[500px] w-full bg-gray-50 rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
          <div>
            <h3 className="font-semibold text-lg">Contact Assistant</h3>
            <p className="text-xs text-blue-100">AI-powered • Always here to help</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleReset} 
            className="hover:bg-blue-700 p-2 rounded transition" 
            title="Reset conversation"
          >
            <RotateCcw size={20} />
          </button>
          <button 
            onClick={onClose} 
            className="hover:bg-blue-700 p-2 rounded transition"
            title="Close chat"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm flex items-center space-x-2">
              <Loader2 className="animate-spin text-blue-600" size={18} />
              <span className="text-sm text-gray-600">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <VoiceInput onSpeechEnd={(text) => handleSend(text)} />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me to add, show, update or delete contacts..."
            className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
