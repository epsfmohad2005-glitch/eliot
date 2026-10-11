/**
 * @file src/shared/components/NavigationFrame.tsx
 * @description Mobile-First Bottom & Ambient Frame Navigation Bar for PLOS App Shell.
 * @license Apache-2.0
 */

import React from 'react';
import { LayoutDashboard, Network, Activity, UploadCloud, Terminal, Play } from 'lucide-react';
import { SystemRoute } from '../../domains/dom-008-navigation';
import { useLanguage } from '../../i18n';

interface NavigationFrameProps {
  currentRoute: SystemRoute;
  onNavigate: (route: SystemRoute) => void;
  onLaunchWorkspace: () => void;
}

export const NavigationFrame: React.FC<NavigationFrameProps> = ({ currentRoute, onNavigate, onLaunchWorkspace }) => {
  const { t } = useLanguage();

  // 'curriculum' was a dead route — it had no case in AppShell's router and
  // fell through to a generic placeholder screen. Entering the actual
  // learning workspace isn't route-based at all (see AppShell's
  // isLearningActive flag), so it gets its own dedicated action button
  // below instead of a broken tab in this grid.
  const navItems = [
    { id: 'workspace' as SystemRoute, label: t('navigation.missionControl'), icon: LayoutDashboard },
    { id: 'import' as SystemRoute, label: 'Import RDI-1', icon: UploadCloud },
    { id: 'knowledge_map' as SystemRoute, label: t('navigation.knowledgeMap'), icon: Network },
    { id: 'memory_timeline' as SystemRoute, label: t('navigation.memoryTimeline'), icon: Activity },
    { id: 'diagnostics' as SystemRoute, label: 'PF-3 Diagnostics', icon: Terminal },
  ];

  return (
    <nav
      id="plos-navigation-frame"
      className="bg-[var(--surface-card)] border-t border-[var(--border-color)] text-[var(--text-secondary)] px-2 pt-2 fixed bottom-0 left-0 right-0 z-30 shadow-lg transition-colors"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
    >
      <div className="max-w-md mx-auto sm:max-w-2xl space-y-1.5">
        {/* Workspace is a distinct action (resume/start a learning session),
            not a route — kept visually separate from the route tabs below
            per explicit request, not squeezed in alongside them. */}
        <button
          id="nav-launch-workspace"
          onClick={onLaunchWorkspace}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-[var(--mode-radius)] bg-[var(--accent-signal)] text-[var(--accent-on-signal)] font-bold text-xs transition-opacity hover:opacity-90"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{t('navigation.workspace')}</span>
        </button>

        <div className="grid grid-cols-5 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-[var(--mode-radius)] transition-all text-[10px] font-medium tracking-tight ${
                  isActive
                    ? 'bg-[var(--surface-low)] text-[var(--accent-signal)] border border-[var(--border-color)] font-semibold'
                    : 'hover:bg-[var(--surface-low)] hover:text-[var(--text-primary)] border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-[var(--accent-signal)]' : 'text-[var(--text-secondary)]'}`} />
                <span className="truncate w-full text-center">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
