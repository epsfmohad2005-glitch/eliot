/**
 * @file src/shared/components/AppShell.tsx
 * @description Primary Mobile-First Responsive App Shell for Eliot Personal Learning OS.
 * @license Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HeaderBar } from './HeaderBar';
import { SystemStatusBar } from './SystemStatusBar';
import { NavigationFrame } from './NavigationFrame';
import { BootSequenceView, MissionControlView, OnboardingModal } from './boot';
import { LearningSessionWorkspace } from './learning';
import { KnowledgeMapView } from './knowledge';
import { MemoryTimelineView } from './memory';
import { FeedbackCenterModal, LocalTelemetryModal } from './feedback';
import { ComponentShowcaseView } from './showcase';
import { ImportWorkspaceView } from './import/ImportWorkspaceView';
import { DiagnosticsWorkspaceView } from './diagnostics';
import { SystemRoute } from '../../domains/dom-008-navigation';
import { MASTER_DOMAIN_REGISTRY } from '../../domains';
import { CANONICAL_EVENT_REGISTRY, eventBus } from '../../core/events';
import { logger, structuredErrorReporter } from '../../core/observability';
import { FEATURE_FLAGS, ENVIRONMENT_CONFIG } from '../../config';
import { ShieldCheck, Cpu, Database, Activity, Lock, RotateCcw } from 'lucide-react';

interface AppShellProps {
  children?: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = () => {
  const [isBooting, setIsBooting] = useState<boolean>(true);
  const [currentRoute, setCurrentRoute] = useState<SystemRoute>('workspace');
  const [isInspecting, setIsInspecting] = useState<boolean>(false);
  const [isLearningActive, setIsLearningActive] = useState<boolean>(false);
  const [recentEventsCount, setRecentEventsCount] = useState<number>(0);

  // Beta Content & Onboarding Sprint Modals
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
  const [isTelemetryOpen, setIsTelemetryOpen] = useState<boolean>(false);

  useEffect(() => {
    // Initialize Observability Global Error Handlers
    structuredErrorReporter.initGlobalErrorHandlers();
    logger.info('KERNEL', 'PLOS AppShell initialized with Observability Foundation.');

    // Subscribe to event bus for status update counts
    const handle = eventBus.subscribeAll(() => {
      setRecentEventsCount(eventBus.getHistory().length);
    });
    setRecentEventsCount(eventBus.getHistory().length);

    // Auto-check first-run onboarding
    if (typeof window !== 'undefined' && window.localStorage) {
      const completed = window.localStorage.getItem('eliot_onboarding_completed');
      if (!completed) {
        setIsOnboardingOpen(true);
      }
    }

    return () => handle.unsubscribe();
  }, []);

  const handleNavigate = (route: SystemRoute) => {
    setCurrentRoute(route);
    if (route === 'system_inspect') {
      setIsInspecting(true);
    } else {
      setIsInspecting(false);
    }
    if (route === 'curriculum') {
      setIsLearningActive(true);
    } else if (route === 'workspace') {
      setIsLearningActive(false);
    }
  };

  // If system is currently in boot sequence, render BootSequenceView
  if (isBooting) {
    return <BootSequenceView onBootComplete={() => setIsBooting(false)} />;
  }

  return (
    <div id="plos-app-root" className="min-h-screen bg-[var(--surface-bg)] text-[var(--text-primary)] flex flex-col font-sans antialiased transition-colors duration-200">
      {/* 1. Kernel System Status Bar (Hidden during Context Lock learning session) */}
      {!isLearningActive && (
        <SystemStatusBar
          onOpenTelemetry={() => setIsTelemetryOpen(true)}
        />
      )}

      {/* 2. Primary Header Bar (Hidden during Context Lock learning session) */}
      {!isLearningActive && (
        <HeaderBar
          activeRoute={currentRoute}
          onInspectToggle={() => setIsInspecting(!isInspecting)}
          isInspecting={isInspecting}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
          onOpenFeedback={() => setIsFeedbackOpen(true)}
          onOpenTelemetry={() => setIsTelemetryOpen(true)}
          onOpenShowcase={() => handleNavigate('showcase')}
        />
      )}

      {/* 3. Main Viewport Container */}
      <main id="plos-main-viewport" className={`flex-1 w-full mx-auto p-4 sm:p-6 flex flex-col gap-6 focus-transition-shell ${isLearningActive ? 'max-w-6xl sm:p-4' : 'max-w-4xl pb-28'}`}>
        {/* Architecture Inspector Modal/Drawer view */}
        {isInspecting ? (
          <section id="architecture-inspector-frame" className="bg-[var(--surface-card)] border border-[var(--border-color)] rounded-[var(--mode-radius)] p-5 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div>
                <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[var(--accent-signal)]" />
                  PLOS Kernel Architecture Inspector
                </h2>
                <p className="text-xs text-[var(--text-secondary)] font-mono mt-0.5">
                  12 Bounded Domain Contexts &amp; Kernel Boot Engine
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsBooting(true)}
                  className="text-xs font-mono bg-[var(--surface-low)] hover:bg-[var(--surface-high)] text-[var(--text-primary)] px-3 py-1.5 rounded-[var(--mode-radius)] border border-[var(--border-color)] flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[var(--accent-signal)]" />
                  Re-Run Boot
                </button>
                <button
                  onClick={() => setIsInspecting(false)}
                  className="text-xs font-mono bg-[var(--surface-low)] hover:bg-[var(--surface-high)] text-[var(--text-primary)] px-3 py-1.5 rounded-[var(--mode-radius)] border border-[var(--border-color)]"
                >
                  Close Inspector
                </button>
              </div>
            </div>

            {/* Bounded Context Grid */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-[var(--accent-signal)]" />
                12 Bounded Domain Placeholders Registered
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {MASTER_DOMAIN_REGISTRY.map((domain) => (
                  <div
                    key={domain.id}
                    id={`domain-card-${domain.id.toLowerCase()}`}
                    className="p-3.5 bg-[var(--surface-low)] border border-[var(--border-color)] rounded-[var(--mode-radius)] flex flex-col justify-between hover:border-[var(--accent-signal)] transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[var(--surface-card)] text-[var(--accent-signal)] border border-[var(--border-color)] rounded">
                          {domain.id}
                        </span>
                        <span className="text-[10px] font-mono text-[var(--status-success)] flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-success)]"></span>
                          {domain.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-[var(--text-primary)] mt-2 font-sans">{domain.name}</h4>
                      <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">{domain.description}</p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
                      <span>Code: {domain.codeName}</span>
                      <span>v{domain.version}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Canonical Event Bus Registry Overview */}
            <div className="space-y-3 pt-4 border-t border-[var(--border-color)]">
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[var(--accent-signal)]" />
                Canonical Event Registry ({CANONICAL_EVENT_REGISTRY.length} Events Registered)
              </h3>
              <div className="bg-[var(--surface-low)] p-3 rounded-[var(--mode-radius)] border border-[var(--border-color)] max-h-48 overflow-y-auto space-y-2 font-mono text-xs">
                {CANONICAL_EVENT_REGISTRY.map((evt) => (
                  <div key={evt.type} className="flex items-start justify-between text-[var(--text-primary)] border-b border-[var(--border-color)] pb-1.5 last:border-none">
                    <div>
                      <span className="text-[var(--accent-signal)] font-semibold">{evt.type}</span>
                      <p className="text-[11px] text-[var(--text-secondary)]">{evt.description}</p>
                    </div>
                    <span className="text-[10px] bg-[var(--surface-card)] px-1.5 py-0.5 text-[var(--text-secondary)] rounded border border-[var(--border-color)]">
                      Pub: {evt.publisherDomain}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : isLearningActive ? (
          /* Learning Session Workspace Frame */
          <LearningSessionWorkspace
            onExitWorkspace={() => {
              setIsLearningActive(false);
              setCurrentRoute('workspace');
            }}
          />
        ) : (
          /* Primary Route Workspace / Mission Control Container */
          <div id="route-viewport-frame" className="space-y-6">
            {currentRoute === 'workspace' ? (
              <MissionControlView
                onRebootRequest={() => setIsBooting(true)}
                onLaunchWorkspace={() => setIsLearningActive(true)}
                onOpenImport={() => setCurrentRoute('import')}
              />
            ) : currentRoute === 'knowledge_map' ? (
              <KnowledgeMapView
                onSelectConceptForSession={() => setIsLearningActive(true)}
              />
            ) : currentRoute === 'memory_timeline' ? (
              <MemoryTimelineView
                onTriggerReviewSession={() => setIsLearningActive(true)}
              />
            ) : currentRoute === 'import' ? (
              <ImportWorkspaceView
                onStartLearningSession={() => setIsLearningActive(true)}
                onCloseWorkspace={() => setCurrentRoute('workspace')}
              />
            ) : currentRoute === 'showcase' ? (
              <ComponentShowcaseView />
            ) : currentRoute === 'diagnostics' ? (
              <DiagnosticsWorkspaceView />
            ) : (
              <section id="active-route-container" className="bg-[var(--surface-card)] border border-[var(--border-color)] rounded-[var(--mode-radius)] p-6 shadow-md space-y-5">
                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[var(--text-primary)] capitalize">
                      {currentRoute} Frame Placeholder
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-[var(--text-secondary)] bg-[var(--surface-low)] px-2.5 py-1 rounded border border-[var(--border-color)]">
                    Sprint Boundary
                  </span>
                </div>

                <div className="p-6 bg-[var(--surface-low)] rounded-[var(--mode-radius)] border border-[var(--border-color)] text-center space-y-2">
                  <div className="inline-flex p-3 bg-[var(--surface-card)] rounded-full text-[var(--accent-signal)] border border-[var(--border-color)] mb-1">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-semibold text-[var(--text-primary)] capitalize">{currentRoute} Feature Module</h4>
                  <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
                    This domain route placeholder is established and bound to contract interfaces.
                  </p>
                </div>
              </section>
            )}

            {/* Feature Flags Grid */}
            <section id="feature-flags-matrix" className="bg-[var(--surface-card)] border border-[var(--border-color)] rounded-[var(--mode-radius)] p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-mono font-semibold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-2">
                <Database className="w-4 h-4 text-[var(--accent-signal)]" />
                Sprint Feature Rollout Flags
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 font-mono text-xs">
                {Object.entries(FEATURE_FLAGS).map(([key, enabled]) => (
                  <div key={key} className="p-2 bg-[var(--surface-low)] rounded-[var(--mode-radius)] border border-[var(--border-color)] flex items-center justify-between">
                    <span className="text-[var(--text-secondary)] text-[11px] truncate">{key}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${enabled ? 'bg-[var(--status-success)] text-[var(--status-success)] border border-[var(--status-success)]' : 'bg-[var(--surface-card)] text-[var(--text-muted)] border border-[var(--border-color)]'}`}>
                      {enabled ? 'ON' : 'SPRINT LOCK'}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* 4. Bottom Mobile-First Navigation Frame (Hidden during Context Lock learning session) */}
      {!isLearningActive && (
        <NavigationFrame
          currentRoute={currentRoute}
          onNavigate={handleNavigate}
          onLaunchWorkspace={() => setIsLearningActive(true)}
        />
      )}

      {/* 5. Sprint BCO-1 Beta Content & Onboarding Modals */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

      <FeedbackCenterModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      <LocalTelemetryModal
        isOpen={isTelemetryOpen}
        onClose={() => setIsTelemetryOpen(false)}
      />
    </div>
  );
};
