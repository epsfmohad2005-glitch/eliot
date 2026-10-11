/**
 * @file src/i18n/LanguageContext.tsx
 * @description React Context & Provider for Eliot PLOS Internationalization (i18n) and RTL state.
 * @license Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupportedLanguage, Translations } from './types';
import { en } from './locales/en';
import { ar } from './locales/ar';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (keyPath: string, params?: Record<string, string | number>) => string;
  isRTL: boolean;
  translations: Translations;
}

const dictionaries: Record<SupportedLanguage, Translations> = { en, ar };

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY = 'eliot_language';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');

  useEffect(() => {
    // Load initial language preference
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem(STORAGE_KEY) as SupportedLanguage;
        if (saved && (saved === 'en' || saved === 'ar')) {
          setLanguageState(saved);
          applyDocumentDirection(saved);
        } else {
          applyDocumentDirection('en');
        }
      }
    } catch {
      applyDocumentDirection('en');
    }
  }, []);

  const applyDocumentDirection = (lang: SupportedLanguage) => {
    if (typeof document !== 'undefined') {
      const isArabic = lang === 'ar';
      document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
      if (isArabic) {
        document.documentElement.classList.add('rtl-mode');
      } else {
        document.documentElement.classList.remove('rtl-mode');
      }
    }
  };

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    applyDocumentDirection(lang);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, lang);
      }
    } catch {
      // ignore storage error
    }
  };

  const t = (keyPath: string, params?: Record<string, string | number>): string => {
    const keys = keyPath.split('.');
    let dict: any = dictionaries[language] || en;
    let fallbackDict: any = en;

    for (const k of keys) {
      if (dict && typeof dict === 'object' && k in dict) {
        dict = dict[k];
      } else {
        dict = undefined;
        break;
      }
    }

    if (dict === undefined) {
      for (const k of keys) {
        if (fallbackDict && typeof fallbackDict === 'object' && k in fallbackDict) {
          fallbackDict = fallbackDict[k];
        } else {
          fallbackDict = undefined;
          break;
        }
      }
      dict = fallbackDict;
    }

    if (typeof dict !== 'string') {
      return keyPath;
    }

    let result = dict;
    if (params) {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        result = result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
      });
    }

    return result;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isRTL,
        translations: dictionaries[language],
      }}
    >
      <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'rtl-root' : 'ltr-root'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
