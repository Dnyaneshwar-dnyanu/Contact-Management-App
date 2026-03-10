import React from 'react';

const MessageBubble = ({ message }) => {
  const isBot = message.sender === 'bot';
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-2`}>
      <div
        className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
          isBot
            ? 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
            : 'bg-blue-600 text-white rounded-tr-none'
        }`}
      >
        {message.text}
      </div>
    </div>
  );
};

export default MessageBubble;
