import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import Header from './components/Header';
import AliasScreen from './components/AliasScreen';
import { type Message, Sender } from './types';

const INITIAL_MESSAGE: Message = {
  id: 'initial',
  text: 'أهلاً بك، أنا رفيقك النفسي. أنا هنا لمساعدتك في استكشاف أفكارك ومشاعرك بأساليب علمية. كيف يمكنني مساعدتك اليوم؟',
  sender: Sender.Bot,
};

const App: React.FC = () => {
  const [alias, setAlias] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [appInitialized, setAppInitialized] = useState(false);

  const handleStartSession = (selectedAlias: string | null) => {
    if (selectedAlias) {
      try {
        const savedHistory = localStorage.getItem(`chatHistory_${selectedAlias}`);
        if (savedHistory) {
          setMessages(JSON.parse(savedHistory));
        } else {
          setMessages([INITIAL_MESSAGE]);
        }
      } catch (error) {
        console.error("Failed to parse chat history:", error);
        setMessages([INITIAL_MESSAGE]);
      }
      setAlias(selectedAlias);
    } else {
      setMessages([INITIAL_MESSAGE]);
      setAlias(null);
    }
    setAppInitialized(true);
  };

  const handleSwitchUser = () => {
    setAlias(null);
    setMessages([]);
    setAppInitialized(false);
  };

  useEffect(() => {
    if (appInitialized && alias && messages.length > 0) {
      try {
        localStorage.setItem(`chatHistory_${alias}`, JSON.stringify(messages));
      } catch (error) {
        console.error("Failed to save chat history:", error);
      }
    }
  }, [messages, alias, appInitialized]);

  if (!appInitialized) {
    return <AliasScreen onStartSession={handleStartSession} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Header alias={alias} onSwitchUser={handleSwitchUser} />
      <main className="flex-grow flex justify-center overflow-hidden p-4 sm:p-8">
        <div className="w-full max-w-4xl h-full flex flex-col">
          <ChatInterface messages={messages} setMessages={setMessages} />
        </div>
      </main>
    </div>
  );
};

export default App;
