/**
 * @file src/shared/components/SystemStatusBar.tsx
 * @description System Status Bar displaying PLOS Kernel health and Theme System 2.0 readiness.
 * @license Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Cpu, Wifi, WifiOff } from 'lucide-react';
import { ENVIRONMENT_CONFIG } from '../../config';
import { useLanguage } from '../../i18n';

interface SystemStatusBarProps {
  onOpenTelemetry?: () => void;
}

export const SystemStatusBar: React.FC<SystemStatusBarProps> = ({ onOpenTelemetry }) => {
  const { t } = useLanguage();
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div
      id="system-status-bar"
      className="w-full bg-[var(--surface-card)] text-[var(--text-secondary)] text-xs px-3 py-1.5 flex items-center justify-between border-b border-[var(--border-color)] tracking-wide font-mono select-none transition-colors"
    >
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1 text-[var(--accent-signal)] font-semibold">
          <span className="w-2 h-2 rounded-full bg-[var(--accent-signal)] animate-pulse"></span>
          PLOS KERNEL
        </span>
        <span className="text-[var(--text-muted)] hidden sm:inline">|</span>
        <span className="text-[var(--text-secondary)] hidden sm:inline-flex items-center gap-1">
          <Cpu className="w-3.5 h-3.5 text-[var(--accent-signal)]" />
          {ENVIRONMENT_CONFIG.sprintStage}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Offline / Online Network Sync Indicator */}
        <button
          onClick={onOpenTelemetry}
          className={`flex items-center gap-1 px-2 py-0.5 rounded-[var(--mode-radius)] border text-[11px] cursor-pointer hover:opacity-80 transition-opacity bg-[var(--surface-low)] text-[var(--text-primary)] border-[var(--border-color)]`}
          title="Inspect Local Privacy Telemetry Audit"
        >
          {isOnline ? (
            <>
              <Wifi className="w-3 h-3 text-[var(--accent-signal)]" />
              <span>{t('statusBar.onlineSync')}</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3 text-[var(--status-warning)]" />
              <span>{t('statusBar.offlineLedger')}</span>
            </>
          )}
        </button>

        <span className="hidden md:flex items-center gap-1 text-[var(--text-secondary)]">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-signal)]" />
          <span>{t('statusBar.domainsBound')}</span>
        </span>

        <span className="flex items-center gap-1 text-[var(--accent-signal)] font-medium bg-[var(--surface-low)] px-2 py-0.5 rounded-[var(--mode-radius)] border border-[var(--border-color)]">
          <Activity className="w-3 h-3" />
          {t('statusBar.statusReady')}
        </span>
      </div>
    </div>
  );
};
