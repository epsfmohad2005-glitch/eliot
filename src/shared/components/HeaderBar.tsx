/**
 * @file src/shared/components/HeaderBar.tsx
 * @description Header Bar component displaying Eliot's application shell identity.
 * @license Apache-2.0
 */

import React from 'react';
import { Layers, Terminal, Sparkles, Globe } from 'lucide-react';
import { ENVIRONMENT_CONFIG } from '../../config';
import { useLanguage, LanguageSwitcher } from '../../i18n';
import { useTheme } from '../../core/theme/ThemeContext';

interface HeaderBarProps {
  activeRoute: string;
  onInspectToggle: () => void;
  isInspecting: boolean;
  onOpenOnboarding?: () => void;
  onOpenFeedback?: () => void;
  onOpenTelemetry?: () => void;
  onOpenShowcase?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  activeRoute,
  onInspectToggle,
  isInspecting,
  onOpenOnboarding,
  onOpenFeedback,
  onOpenTelemetry,
  onOpenShowcase,
}) => {
  const { t } = useLanguage();
  const { isRtl, toggleRtl } = useTheme();

  return (
    <header
      id="plos-header-bar"
      className="bg-[var(--surface-card)] border-b border-[var(--border-color)] text-[var(--text-primary)] px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-md transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[var(--accent-signal)] text-[var(--accent-on-signal)] rounded-[var(--mode-radius)] shadow-inner">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-[var(--text-primary)] tracking-tight font-sans">
              {t('header.systemTitle')} <span className="text-[var(--accent-signal)] font-semibold text-xs ml-1 bg-[var(--surface-low)] px-1.5 py-0.5 rounded border border-[var(--border-color)]">PLOS</span>
            </h1>
            <span className="text-[10px] text-[var(--text-secondary)] font-mono bg-[var(--surface-low)] px-1.5 py-0.5 rounded border border-[var(--border-color)]">
              v{ENVIRONMENT_CONFIG.appVersion}
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] font-mono hidden sm:block">
            {t('header.systemSubtitle')}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Language Switcher */}
        <LanguageSwitcher variant="compact" />

        {/* Reading direction toggle — independent of the (single) visual identity */}
        <button
          id="btn-rtl-toggle"
          onClick={toggleRtl}
          className="flex items-center gap-1.5 text-xs font-mono px-2.5 py-1.5 rounded-[var(--mode-radius)] bg-[var(--surface-low)] hover:bg-[var(--surface-high)] text-[var(--text-primary)] border border-[var(--border-color)] transition-all"
          title="Toggle reading direction"
        >
          <Globe className="w-3.5 h-3.5 text-[var(--accent-signal)]" />
          <span className="hidden sm:inline">{isRtl ? 'RTL' : 'LTR'}</span>
        </button>

        {/* Everything below is secondary/utility — kept off the phone header
            entirely (not just visually squeezed) and only shown from tablet
            width up, so the mobile header stays to just branding + language. */}
        {onOpenOnboarding && (
          <button
            onClick={onOpenOnboarding}
            className="hidden sm:flex items-center gap-1.5 text-xs font-mono px-2.5 py-1.5 rounded-[var(--mode-radius)] bg-[var(--surface-low)] hover:bg-[var(--surface-high)] text-[var(--text-primary)] border border-[var(--border-color)] transition-all"
            title="Re-open First-Run Orientation"
          >
            <span>{t('common.orientation')}</span>
          </button>
        )}

        {onOpenFeedback && (
          <button
            onClick={onOpenFeedback}
            className="hidden sm:flex items-center gap-1.5 text-xs font-mono px-2.5 py-1.5 rounded-[var(--mode-radius)] bg-[var(--surface-low)] hover:bg-[var(--surface-high)] text-[var(--text-primary)] border border-[var(--border-color)] transition-all"
            title="Open Beta Feedback Center"
          >
            <span>{t('common.feedback')}</span>
          </button>
        )}

        {onOpenShowcase && (
          <button
            id="btn-open-showcase"
            onClick={onOpenShowcase}
            className={`hidden sm:flex items-center gap-1.5 text-xs font-mono px-2.5 py-1.5 rounded-[var(--mode-radius)] transition-all border ${
              activeRoute === 'showcase'
                ? 'bg-[var(--accent-signal)] border-[var(--accent-signal)] text-[var(--accent-on-signal)] font-bold'
                : 'bg-[var(--surface-low)] hover:bg-[var(--surface-high)] text-[var(--text-primary)] border-[var(--border-color)]'
            }`}
            title="Open FCS-1 Component Showcase"
          >
            <span>FCS-1 Showcase</span>
          </button>
        )}

        <button
          id="btn-inspect-architecture"
          onClick={onInspectToggle}
          className={`hidden sm:flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-[var(--mode-radius)] transition-all border ${
            isInspecting
              ? 'bg-[var(--accent-signal)] border-[var(--accent-signal)] text-[var(--accent-on-signal)] font-bold'
              : 'bg-[var(--surface-low)] hover:bg-[var(--surface-high)] text-[var(--text-primary)] border-[var(--border-color)]'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>{isInspecting ? t('common.close') : t('common.inspectArchitecture')}</span>
        </button>

        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-[var(--surface-low)] border border-[var(--border-color)] rounded-[var(--mode-radius)] text-xs font-mono text-[var(--text-secondary)]">
          <Sparkles className="w-3.5 h-3.5 text-[var(--accent-signal)]" />
          <span>Route: <strong className="text-[var(--text-primary)] capitalize">{activeRoute}</strong></span>
        </div>
      </div>
    </header>
  );
};
