import React, { useState } from 'react';
import { SendIcon } from './Icons';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };


  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="اكتب رسالتك هنا..."
          className="flex-grow p-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
          rows={1}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className="p-3 bg-teal-500 text-white rounded-full disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-teal-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 flex-shrink-0"
          aria-label="إرسال رسالة"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <SendIcon />
          )}
        </button>
      </form>
        {isLoading && <p className="text-center text-sm mt-2 text-gray-500 dark:text-gray-400">رفيقك النفسي يكتب الآن...</p>}
    </div>
  );
};

export default ChatInput;
