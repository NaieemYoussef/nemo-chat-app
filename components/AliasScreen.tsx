import React, { useState } from 'react';

interface AliasScreenProps {
  onStartSession: (alias: string | null) => void;
}

const AliasScreen: React.FC<AliasScreenProps> = ({ onStartSession }) => {
  const [alias, setAlias] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (alias.trim()) {
      onStartSession(alias.trim());
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 font-sans">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center mx-4">
        <div>
          <h1 className="text-3xl font-bold text-teal-600 dark:text-teal-400">
            مرحباً بك في نيمو 🐡 المسافر
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            رفيقك للحفاظ على صحتك النفسية.
          </p>
        </div>
        <div className="text-right">
          <p className="text-gray-700 dark:text-gray-200">
            للحفاظ على خصوصيتك ومتابعة تقدمك، يمكنك إنشاء هوية مستعارة. سيتم حفظ محادثاتك بشكل آمن على جهازك فقط.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            placeholder="أدخل هويتك المستعارة هنا"
            className="w-full px-4 py-2 text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border rounded-md focus:border-teal-400 focus:ring-teal-300 focus:ring-opacity-40 focus:outline-none focus:ring text-center"
            aria-label="هوية مستعارة"
          />
          <button
            type="submit"
            disabled={!alias.trim()}
            className="w-full px-4 py-2 font-semibold text-white bg-teal-500 rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            بدء الدردشة ومتابعة الجلسات
          </button>
        </form>
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative px-2 bg-white dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400">
            أو
          </div>
        </div>
        <button
          onClick={() => onStartSession(null)}
          className="w-full px-4 py-2 font-semibold text-teal-600 dark:text-teal-400 bg-transparent border border-teal-500 rounded-md hover:bg-teal-50 dark:hover:bg-gray-700 focus:outline-none transition-colors"
        >
          المتابعة كزائر (لن يتم حفظ المحادثة)
        </button>
      </div>
    </div>
  );
};

export default AliasScreen;
