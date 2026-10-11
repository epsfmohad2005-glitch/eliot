/**
 * @file src/i18n/LanguageSwitcher.tsx
 * @description Accessible Language Switcher component for runtime EN / AR toggling.
 * @license Apache-2.0
 */

import React from 'react';
import { Languages, Check } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { SupportedLanguage } from './types';

export const LanguageSwitcher: React.FC<{ variant?: 'compact' | 'full' }> = ({ variant = 'compact' }) => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    const nextLang: SupportedLanguage = language === 'en' ? 'ar' : 'en';
    setLanguage(nextLang);
  };

  return (
    <button
      id="btn-language-switcher"
      type="button"
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--surface-card)] hover:bg-[var(--surface-high)] text-[var(--text-secondary)] border border-[var(--border-color)] text-xs font-mono transition-all cursor-pointer shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
      aria-label={`Switch Language. Current: ${language === 'en' ? 'English' : 'Arabic'}`}
      title="Switch Language / تغيير اللغة"
    >
      <Languages className="w-3.5 h-3.5 text-indigo-400" />
      <span className="font-bold uppercase">{language === 'en' ? 'EN' : 'عربي'}</span>
      {variant === 'full' && (
        <span className="text-[10px] text-[var(--text-secondary)] font-sans ml-1">
          ({language === 'en' ? 'العربية' : 'English'})
        </span>
      )}
    </button>
  );
};
