import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { translations } from '../i18n/translations';

type Language = 'en' | 'id';
// Use one language as the reference for keys to ensure type safety
type TranslationKey = keyof typeof translations.en; 

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, replacements?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('id'); // Default to Indonesian

  const t = useCallback((key: TranslationKey, replacements?: { [key: string]: string | number }): string => {
    // Fallback to English if a key is missing in the current language
    let text = translations[language][key] || translations['en'][key];
    if (!text) {
        console.warn(`Translation key "${key}" not found.`);
        return key;
    }
    
    if (replacements) {
        Object.keys(replacements).forEach(rKey => {
            const regex = new RegExp(`{${rKey}}`, 'g');
            text = text.replace(regex, String(replacements[rKey]));
        });
    }
    return text;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
