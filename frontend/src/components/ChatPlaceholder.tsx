import React from 'react';

interface ChatPlaceholderProps {
  message: string;
}

const ChatPlaceholder: React.FC<ChatPlaceholderProps> = ({ message }) => {
  return (
    <div className="flex items-center justify-center h-full text-gray-500">
      <p>{message}</p>
    </div>
  );
};

export default ChatPlaceholder;
