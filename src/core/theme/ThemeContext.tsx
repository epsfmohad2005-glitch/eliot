/**
 * @file src/core/theme/ThemeContext.tsx
 * @description Eliot Root Identity — theme application and RTL handling.
 * As of ADR-007, Eliot has a single visual identity ("root"); this module
 * no longer switches between themes. It still owns zero-FOUC DOM
 * application and the RTL preference, which is independent of theme.
 * @license Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export const ROOT_THEME_ID = 'root' as const;

interface ThemeContextType {
  /** Always 'root'. Kept so existing call sites don't need conditional logic. */
  currentTheme: typeof ROOT_THEME_ID;
  isRtl: boolean;
  toggleRtl: () => void;
}

const RTL_STORAGE_KEY = 'eliot_rtl_preference';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isRtl, setIsRtlState] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(RTL_STORAGE_KEY) === 'true';
    }
    return false;
  });

  const applyToDOM = (rtl: boolean) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    root.setAttribute('data-theme', ROOT_THEME_ID);
    root.setAttribute('dir', rtl ? 'rtl' : 'ltr');
    root.classList.add('mode-root', 'dark');
    root.classList.toggle('rtl', rtl);
  };

  useEffect(() => {
    applyToDOM(isRtl);
  }, [isRtl]);

  const toggleRtl = () => {
    setIsRtlState((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(RTL_STORAGE_KEY, String(next));
      }
      return next;
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme: ROOT_THEME_ID,
        isRtl,
        toggleRtl,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
