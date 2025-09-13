import React, { useState, useRef, useEffect } from 'react';
import { type Message, Sender } from '../types';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial',
      text: 'أهلاً بك، أنا رفيقك النفسي. أنا هنا لمساعدتك في استكشاف أفكارك ومشاعرك بأساليب علمية. كيف يمكنني مساعدتك اليوم؟',
      sender: Sender.Bot,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), text, sender: Sender.User };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const botMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: botMessageId, text: '', sender: Sender.Bot },
    ]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text, history: messages }),
      });

      if (!response.ok || !response.body) {
          throw new Error(`Request failed with status ${response.status}`);
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        streamedText += decoder.decode(value, { stream: true });
        
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId ? { ...msg, text: streamedText } : msg
          )
        );
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? { ...msg, text: 'عذراً، حدث خطأ ما. يرجى المحاولة مرة أخرى.' }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="flex-grow p-6 overflow-y-auto">
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <ChatInput 
        onSendMessage={handleSendMessage} 
        isLoading={isLoading} 
      />
    </div>
  );
};

export default ChatInterface;
