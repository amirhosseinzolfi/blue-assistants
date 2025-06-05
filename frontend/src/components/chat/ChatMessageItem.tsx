import React from 'react';

// This will be expanded based on the ChatMessageRead schema from backend
export interface Message {
  id: string | number;
  content: string;
  sender_type: 'user' | 'ai'; // Align with backend SenderType
  timestamp: string | Date; // Consider standardizing to string (ISO) or Date object
  // assistant_id?: number; // If needed
}

interface ChatMessageItemProps {
  message: Message;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
  const isUser = message.sender_type === 'user';
  const time = message.timestamp instanceof Date ? message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex mb-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`py-2 px-4 rounded-xl max-w-lg lg:max-w-xl xl:max-w-2xl break-words shadow-md
                    ${isUser ? 'bg-sky-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-100 rounded-bl-none'}`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <p className={`text-xs mt-1 ${isUser ? 'text-sky-200' : 'text-gray-400'} text-right`}>
          {time}
        </p>
      </div>
    </div>
  );
};

export default ChatMessageItem;
