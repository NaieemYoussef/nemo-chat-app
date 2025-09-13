import React from 'react';
import ChatInterface from './components/ChatInterface';
import Header from './components/Header';

const App: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Header />
      <main className="flex-grow flex justify-center overflow-hidden p-4 sm:p-8">
        <div className="w-full max-w-4xl h-full flex flex-col">
          <ChatInterface />
        </div>
      </main>
    </div>
  );
};

export default App;