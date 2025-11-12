import React from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { useTheme } from '../hooks/useTheme';
import CurrentTime from './CurrentTime';
import { PlusIcon, SunIcon, MoonIcon, MenuIcon } from './Icons';

interface HeaderProps {
  onAddTask: () => void;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddTask, onToggleSidebar }) => {
  const { t, language, setLanguage } = useTranslations();
  const { theme, setTheme } = useTheme();

  const handleLanguageChange = (lang: 'en' | 'ar') => {
    setLanguage(lang);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center text-gray-800 dark:text-white flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <button onClick={onToggleSidebar} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
           <MenuIcon className="w-6 h-6"/>
        </button>
        <h1 className="text-2xl font-bold hidden md:block">ZERO Production System</h1>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <CurrentTime />
        <div className="flex">
            <button 
                onClick={() => handleLanguageChange('en')}
                className={`px-3 py-1 text-sm rounded-l-md ${language === 'en' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
            >
                EN
            </button>
            <button 
                onClick={() => handleLanguageChange('ar')}
                className={`px-3 py-1 text-sm rounded-r-md ${language === 'ar' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
            >
                AR
            </button>
        </div>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            {theme === 'dark' ? <SunIcon className="w-5 h-5 text-yellow-400" /> : <MoonIcon className="w-5 h-5 text-gray-700" />}
        </button>
        <button
          onClick={onAddTask}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-2 md:px-4 rounded-lg flex items-center gap-2 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          <span className="hidden md:inline">{t.add_task}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
