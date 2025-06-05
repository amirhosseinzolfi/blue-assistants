import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (messageText: string) => void;
  isLoading?: boolean; // To disable input while AI is responding
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [messageText, setMessageText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      onSendMessage(messageText.trim());
      setMessageText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700 bg-gray-800">
      <div className="flex items-center space-x-3">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-sky-500 focus:border-sky-500 text-gray-100 placeholder-gray-400 disabled:opacity-70"
          autoFocus
        />
        <button
          type="submit"
          disabled={isLoading || !messageText.trim()}
          className="p-3 bg-sky-600 text-white rounded-lg hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 disabled:opacity-50 disabled:bg-sky-700 transition-colors"
          aria-label="Send message"
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
