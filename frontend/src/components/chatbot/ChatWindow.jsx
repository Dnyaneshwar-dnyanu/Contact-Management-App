import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import VoiceInput from './VoiceInput';
import { Send, X, Loader2 } from 'lucide-react';
import { processInput } from './chatbotLogic';

const ChatWindow = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Hi! I'm your Contact Assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatState, setChatState] = useState({ intent: null, step: null, data: {} });
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

    // Process logic
    const newState = await processInput(currentInput, chatState, setMessages);
    setChatState(newState);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[400px] w-full bg-gray-50 rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-blue-600 p-4 text-white flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <h3 className="font-semibold">Contact Assistant</h3>
        </div>
        <button onClick={onClose} className="hover:bg-blue-700 p-1 rounded transition">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
              <Loader2 className="animate-spin text-blue-600" size={18} />
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
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button
            onClick={() => handleSend()}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
