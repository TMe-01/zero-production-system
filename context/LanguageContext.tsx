import React, { createContext, useState, useEffect, useMemo } from 'react';
import { translations, TranslationKeys } from '../i18n/translations';
import { TaskCategory } from '../types';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (typeof translations)['en'];
  getCategoryName: (category: TaskCategory) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = useMemo(() => translations[language], [language]);

  const getCategoryName = (category: TaskCategory) => {
    const key = `category_${category}` as TranslationKeys;
    return t[key] || category;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getCategoryName }}>
      {children}
    </LanguageContext.Provider>
  );
};
