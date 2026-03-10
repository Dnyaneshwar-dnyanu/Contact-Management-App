import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

const VoiceInput = ({ onSpeechEnd }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = 'en-US';

      recog.onstart = () => setIsListening(true);
      recog.onend = () => setIsListening(false);
      recog.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onSpeechEnd(transcript);
      };

      setRecognition(recog);
    }
  }, [onSpeechEnd]);

  const toggleListening = () => {
    if (isListening) {
      recognition.stop();
    } else {
      if (recognition) recognition.start();
      else alert("Speech Recognition not supported in this browser.");
    }
  };

  return (
    <button
      onClick={toggleListening}
      className={`p-2 rounded-full transition-colors ${
        isListening ? 'bg-blue-500 text-white animate-pulse' : 'bg-red-400 text-gray-600 hover:bg-gray-200'
      }`}
      title={isListening ? "Stop Listening" : "Start Voice Input"}
    >
      {isListening ? <MicOff size={20} /> : <Mic size={20} />}
    </button>
  );
};

export default VoiceInput;
