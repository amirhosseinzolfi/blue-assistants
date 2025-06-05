import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAssistantStore } from '../store/assistantStore';
import ChatInput from '../components/chat/ChatInput';
import ChatMessageItem from '../components/chat/ChatMessageItem';
import { getChatHistory, postChatMessage, ChatMessage, NewMessagePayload } from '../services/api';

const ChatPage: React.FC = () => {
  const { assistantId } = useParams<{ assistantId: string }>();
  const { assistants, selectedAssistantId, selectAssistant } = useAssistantStore();

  const [currentAssistantName, setCurrentAssistantName] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [errorLoadingHistory, setErrorLoadingHistory] = useState<string | null>(null);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [errorSendingMessage, setErrorSendingMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (assistantId) {
      const id = parseInt(assistantId, 10);
      if (selectedAssistantId !== id) {
        selectAssistant(id);
      }
      const assistant = assistants.find(a => a.id === id);
      setCurrentAssistantName(assistant ? assistant.name : 'Chat');
    } else {
      setCurrentAssistantName('Select an Assistant');
    }
  }, [assistantId, assistants, selectedAssistantId, selectAssistant]);

  useEffect(() => {
    if (assistantId) {
      const numericAssistantId = parseInt(assistantId, 10);
      if (!isNaN(numericAssistantId)) {
        setIsLoadingHistory(true);
        setErrorLoadingHistory(null);
        setMessages([]); // Clear previous messages before fetching new history
        getChatHistory(numericAssistantId)
          .then(history => {
            setMessages(history);
          })
          .catch(err => {
            console.error("Failed to load chat history:", err);
            setErrorLoadingHistory(err.message || 'Failed to load messages.');
            setMessages([]);
          })
          .finally(() => {
            setIsLoadingHistory(false);
          });
      }
    } else {
      setMessages([]);
    }
  }, [assistantId]);

  useEffect(() => {
    if (messages.length > 0 || !isLoadingHistory) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoadingHistory]);

  const handleSendMessage = async (messageText: string) => {
    if (!assistantId || isSendingMessage) return;

    const numericAssistantId = parseInt(assistantId, 10);
    if (isNaN(numericAssistantId)) return;

    setIsSendingMessage(true);
    setErrorSendingMessage(null);

    // Optimistic UI update for user's message
    const userMessage: ChatMessage = {
      id: Date.now(), // Temporary client-side ID, backend will assign actual ID
      assistant_id: numericAssistantId,
      content: messageText,
      sender_type: 'user',
      timestamp: new Date().toISOString(),
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    const payload: NewMessagePayload = { content: messageText };

    try {
      const aiResponse = await postChatMessage(numericAssistantId, payload);
      // Replace optimistic user message if backend returns it, or just add AI message
      // For now, assuming backend handles user message persistence and we only need to add AI's
      setMessages(prevMessages => {
        // Filter out temporary user message if backend sends a persisted version (not implemented here)
        // const filteredMessages = prevMessages.filter(msg => msg.id !== userMessage.id);
        // return [...filteredMessages, userMessage, aiResponse]; // If backend sends user msg too
        return [...prevMessages.filter(msg => msg.id !== userMessage.id), userMessage, aiResponse]; // Keep optimistic user message, add AI
      });
    } catch (err) {
      console.error("Failed to send message or get AI response:", err);
      setErrorSendingMessage(err.message || 'Failed to send message.');
      // Optionally remove optimistic message or mark it as failed
      setMessages(prevMessages => prevMessages.filter(msg => msg.id !== userMessage.id));
      // alert("Error: Could not send message."); // Basic feedback
    } finally {
      setIsSendingMessage(false);
    }
  };

  if (!assistantId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <p>Please select an assistant from the sidebar.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-800">
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-1" id="chat-messages-container">
        {isLoadingHistory && (
          <div className="text-center text-gray-400 py-10">Loading history...</div>
        )}
        {errorLoadingHistory && (
          <div className="text-center text-red-400 p-4 my-4 bg-red-900/50 rounded-md">
            Error loading history: {errorLoadingHistory}
          </div>
        )}
        {!isLoadingHistory && !errorLoadingHistory && messages.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            No messages yet. Start the conversation!
          </div>
        )}
        {messages.map((msg) => (
          <ChatMessageItem key={msg.id} message={msg} />
        ))}
        {errorSendingMessage && (
            <div className="text-center text-red-400 p-2 my-2 text-xs">
                Failed to send: {errorSendingMessage}
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSendMessage={handleSendMessage} isLoading={isSendingMessage} />
    </div>
  );
};
export default ChatPage;
