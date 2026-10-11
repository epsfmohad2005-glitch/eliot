/**
 * @file src/App.tsx
 * @description Main Application Entry Point mounting ThemeProvider & PLOS AppShell.
 * @license Apache-2.0
 */

import { AppShell } from './shared/components';
import { LanguageProvider } from './i18n';
import { ThemeProvider } from './core/theme/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppShell />
      </LanguageProvider>
    </ThemeProvider>
  );
}
