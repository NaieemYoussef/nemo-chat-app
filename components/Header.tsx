
import React from 'react';

interface HeaderProps {
  alias: string | null;
  onSwitchUser: () => void;
}

const Header: React.FC<HeaderProps> = ({ alias, onSwitchUser }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex-shrink-0">
      <div className="container mx-auto max-w-4xl flex justify-between items-center">
        <div className="flex-1">
          {alias && (
            <span className="text-sm text-gray-500 dark:text-gray-400" aria-label={`المستخدم الحالي: ${alias}`}>
              مرحباً، <span className="font-medium">{alias}</span>
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold text-teal-600 dark:text-teal-400 text-center flex-1">
          نيمو 🐡 المسافر
        </h1>
        <div className="flex-1 text-left">
          <button
            onClick={onSwitchUser}
            className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 rounded-md px-2 py-1"
            aria-label="تغيير المستخدم أو تسجيل الخروج"
          >
            تغيير المستخدم
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
