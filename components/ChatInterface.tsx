import React, { useState, useRef, useEffect, useCallback } from 'react';
import { type Message, Sender } from '../types';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { initializeChat } from '../services/geminiService';
import { type Chat } from '@google/genai';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial',
      text: 'أهلاً بك، أنا رفيقك النفسي. أنا هنا لمساعدتك في استكشاف أفكارك ومشاعرك بأساليب علمية. كيف يمكنني مساعدتك اليوم؟',
      sender: Sender.Bot,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current = initializeChat();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading || !chatRef.current) return;

    const userMessage: Message = { id: Date.now().toString(), text, sender: Sender.User };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const botMessageId = (Date.now() + 1).toString();
    // Add a placeholder for the bot's message
    setMessages((prev) => [
      ...prev,
      { id: botMessageId, text: '', sender: Sender.Bot },
    ]);

    try {
      const result = await chatRef.current.sendMessageStream({ message: text });
      let streamedText = '';
      for await (const chunk of result) {
        streamedText += chunk.text;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId ? { ...msg, text: streamedText } : msg
          )
        );
      }
    } catch (error) {
      console.error('Error sending message to Gemini:', error);
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
  }, [isLoading]);

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
