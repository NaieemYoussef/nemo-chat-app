import React from 'react';
import { type Message, Sender } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === Sender.User;

  const wrapperClasses = isUser ? 'self-end' : 'self-start';
  const bubbleClasses = isUser
    ? 'bg-teal-500 text-white'
    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200';

  return (
    <div className={`flex w-full max-w-xl ${wrapperClasses}`}>
      <div
        className={`rounded-2xl px-4 py-3 shadow-md ${bubbleClasses}`}
        style={{
          borderBottomRightRadius: isUser ? '4px' : '16px',
          borderBottomLeftRadius: isUser ? '16px' : '4px',
        }}
      >
        <p className="text-base whitespace-pre-wrap">{message.text || '...'}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
