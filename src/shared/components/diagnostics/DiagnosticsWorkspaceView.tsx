/**
 * @file src/shared/components/diagnostics/DiagnosticsWorkspaceView.tsx
 * @description Integrated Diagnostics Workspace & EventBus Inspector UI for Eliot PLOS (Sprint PF-3).
 * @license Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  Bug,
  Boxes,
  CheckCircle2,
  Clock,
  Copy,
  Cpu,
  Database,
  Download,
  Filter,
  Layers,
  Play,
  RefreshCw,
  Search,
  ShieldAlert,
  Terminal,
  Trash2,
  X,
  Zap,
} from 'lucide-react';
import {
  LogLevel,
  LogEntry,
  LogStorageStats,
  PerformanceMetric,
  StructuredErrorReport,
  EventBusMetric,
  localLogStore,
  logger,
  performanceTracker,
  structuredErrorReporter,
} from '../../../core/observability';
import { eventBus } from '../../../core/events';
import { BaseDomainEvent, CanonicalEventType } from '../../../types';
import { MASTER_DOMAIN_REGISTRY } from '../../../domains';
import {
  DomainArchitectureBanner,
  DomainArchitectureIndicator,
  DomainArchitectureInspectModal,
  DomainEventAuditLogView,
  DomainValidationSummaryView,
  DomainEventStreamDrawer,
} from '../session';

import { PerformanceDashboardView } from './PerformanceDashboardView';

type DiagnosticTab = 'dashboard' | 'logs' | 'eventbus' | 'performance' | 'errors' | 'architecture';

export const DiagnosticsWorkspaceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DiagnosticTab>('logs');
  const [isArchInspectOpen, setIsArchInspectOpen] = useState(false);
  const [isEventStreamOpen, setIsEventStreamOpen] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  // 1. Logs Stream State
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState<LogStorageStats | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<LogLevel | 'ALL'>('ALL');
  const [domainFilter, setDomainFilter] = useState<string>('');
  const [correlationSearch, setCorrelationSearch] = useState<string>('');
  const [textQuery, setTextQuery] = useState<string>('');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  // 2. EventBus Inspector State
  const [eventHistory, setEventHistory] = useState<readonly BaseDomainEvent[]>([]);
  const [eventMetrics, setEventMetrics] = useState<EventBusMetric[]>([]);
  const [subscriptionCounts, setSubscriptionCounts] = useState<Record<string, number>>({});
  const [eventSearch, setEventSearch] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<BaseDomainEvent | null>(null);

  // Mock Event Publisher
  const [mockEventType, setMockEventType] = useState<CanonicalEventType>('DashboardRefreshed');
  const [mockPayload, setMockPayload] = useState<string>('{\n  "source": "DiagnosticsWorkspace"\n}');
  const [publishStatusMessage, setPublishStatusMessage] = useState<string | null>(null);

  // 3. Performance Metrics State
  const [perfMetrics, setPerfMetrics] = useState<readonly PerformanceMetric[]>([]);
  const [slowOps, setSlowOps] = useState<PerformanceMetric[]>([]);

  // 4. Structured Errors State
  const [errorReports, setErrorReports] = useState<readonly StructuredErrorReport[]>([]);
  const [selectedError, setSelectedError] = useState<StructuredErrorReport | null>(null);

  // Auto-refresh interval
  useEffect(() => {
    refreshData();
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refreshData();
    }, 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, selectedLevel, domainFilter, correlationSearch, textQuery]);

  const refreshData = () => {
    // Load Logs
    const queriedLogs = localLogStore.query({
      level: selectedLevel === 'ALL' ? undefined : selectedLevel,
      domain: domainFilter || undefined,
      correlationId: correlationSearch || undefined,
      search: textQuery || undefined,
    });
    setLogs(queriedLogs.slice().reverse()); // Newest first
    setStats(localLogStore.getStats());

    // Load EventBus
    setEventHistory(eventBus.getHistory().slice().reverse());
    setEventMetrics(eventBus.getMetrics());
    setSubscriptionCounts(eventBus.getSubscriptionCounts());

    // Load Performance
    setPerfMetrics(performanceTracker.getMetrics().slice().reverse());
    setSlowOps(performanceTracker.getSlowOperations().slice().reverse());

    // Load Errors
    setErrorReports(structuredErrorReporter.getReports().slice().reverse());
  };

  const handleClearLogs = () => {
    localLogStore.clear();
    logger.info('DIAGNOSTICS', 'Local logs purged via Diagnostics Workspace.');
    refreshData();
  };

  const handleExportJSON = () => {
    const jsonStr = localLogStore.exportJSON();
    downloadFile(jsonStr, `plos_logs_${Date.now()}.json`, 'application/json');
  };

  const handleExportText = () => {
    const textStr = localLogStore.exportText();
    downloadFile(textStr, `plos_logs_${Date.now()}.txt`, 'text/plain');
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePublishMockEvent = () => {
    try {
      const payloadObj = JSON.parse(mockPayload);
      eventBus.publish({
        eventId: `evt_diag_${Date.now().toString(36)}`,
        eventType: mockEventType,
        sourceDomain: 'DOM-008',
        timestamp: new Date().toISOString(),
        payload: payloadObj,
      });
      setPublishStatusMessage(`Event '${mockEventType}' published successfully!`);
      setTimeout(() => setPublishStatusMessage(null), 3000);
      refreshData();
    } catch (err: any) {
      setPublishStatusMessage(`JSON Parse Error: ${err.message}`);
    }
  };

  const getLevelBadgeClass = (level: LogLevel) => {
    switch (level) {
      case 'TRACE':
        return 'bg-[var(--surface-high)] text-[var(--text-secondary)] border-[var(--border-color)]';
      case 'DEBUG':
        return 'bg-sky-950 text-sky-400 border-sky-800';
      case 'INFO':
        return 'bg-[var(--status-success)] text-[var(--status-success)] border-[var(--status-success)]';
      case 'WARN':
        return 'bg-[var(--status-warning)] text-[var(--status-warning)] border-[var(--status-warning)]';
      case 'ERROR':
        return 'bg-rose-950 text-rose-400 border-rose-800';
      case 'FATAL':
        return 'bg-purple-950 text-purple-400 border-purple-800';
    }
  };

  return (
    <div id="diagnostics-workspace-view" className="space-y-6 font-sans">
      {/* Workspace Header */}
      <div className="bg-[var(--surface-card)] border border-[var(--border-color)] rounded-xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-[var(--text-primary)]">PLOS Observability & Diagnostics Workspace</h2>
          </div>
          <p className="text-xs text-[var(--text-secondary)] font-mono mt-0.5">
            Sprint PF-3 • Central Logger • Correlation IDs • Local Storage • EventBus Inspector
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto justify-between md:justify-end">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono border flex items-center gap-1.5 transition-colors ${
              autoRefresh
                ? 'bg-[var(--status-success)]/80 text-[var(--status-success)] border-[var(--status-success)]'
                : 'bg-[var(--surface-high)] text-[var(--text-secondary)] border-[var(--border-color)]'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-spin' : ''}`} />
            <span>{autoRefresh ? 'Live Streaming' : 'Paused'}</span>
          </button>

          <button
            onClick={refreshData}
            className="px-3 py-1.5 bg-[var(--surface-high)] hover:bg-[var(--surface-bright)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-lg text-xs font-mono flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[var(--border-color)] font-mono text-xs gap-1 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-t-lg font-bold flex items-center gap-2 border-t border-x transition-colors ${
            activeTab === 'logs'
              ? 'bg-[var(--surface-card)] border-[var(--border-color)] text-indigo-400 border-b-[var(--border-color)]'
              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-card)]/50'
          }`}
        >
          <Database className="w-4 h-4 text-sky-400" />
          <span>Central Logs Stream ({stats?.totalLogs || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('eventbus')}
          className={`px-4 py-2 rounded-t-lg font-bold flex items-center gap-2 border-t border-x transition-colors ${
            activeTab === 'eventbus'
              ? 'bg-[var(--surface-card)] border-[var(--border-color)] text-indigo-400 border-b-[var(--border-color)]'
              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-card)]/50'
          }`}
        >
          <Activity className="w-4 h-4 text-[var(--status-success)]" />
          <span>EventBus Inspector ({eventHistory.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('performance')}
          className={`px-4 py-2 rounded-t-lg font-bold flex items-center gap-2 border-t border-x transition-colors ${
            activeTab === 'performance'
              ? 'bg-[var(--surface-card)] border-[var(--border-color)] text-indigo-400 border-b-[var(--border-color)]'
              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-card)]/50'
          }`}
        >
          <Zap className="w-4 h-4 text-[var(--status-warning)]" />
          <span>Performance ({slowOps.length} Slow)</span>
        </button>

        <button
          onClick={() => setActiveTab('errors')}
          className={`px-4 py-2 rounded-t-lg font-bold flex items-center gap-2 border-t border-x transition-colors ${
            activeTab === 'errors'
              ? 'bg-[var(--surface-card)] border-[var(--border-color)] text-indigo-400 border-b-[var(--border-color)]'
              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-card)]/50'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>Structured Errors ({errorReports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('architecture')}
          className={`px-4 py-2 rounded-t-lg font-bold flex items-center gap-2 border-t border-x transition-colors ${
            activeTab === 'architecture'
              ? 'bg-[var(--surface-card)] border-[var(--border-color)] text-indigo-400 border-b-[var(--border-color)]'
              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-card)]/50'
          }`}
        >
          <Boxes className="w-4 h-4 text-[var(--accent-signal)]" />
          <span>Domain Architecture</span>
        </button>
      </div>

      {/* Tab 1: Central Logs Stream View */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          {/* Storage & Control Toolbar */}
          <div className="bg-[var(--surface-card)] border border-[var(--border-color)] rounded-xl p-4 shadow-md space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-[var(--text-secondary)]">
                  <Database className="w-4 h-4 text-sky-400" />
                  <span>Buffer: <strong className="text-[var(--text-primary)]">{stats?.totalLogs || 0} / 1000</strong></span>
                </div>
                <div className="text-[var(--text-muted)]">|</div>
                <div className="text-[var(--text-secondary)]">
                  Size: <strong className="text-[var(--text-primary)]">{Math.round((stats?.estimatedSizeBytes || 0) / 1024)} KB</strong>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportJSON}
                  className="px-2.5 py-1 bg-[var(--surface-high)] hover:bg-[var(--surface-bright)] text-[var(--text-secondary)] border border-[var(--border-color)] rounded flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5 text-sky-400" />
                  <span>JSON</span>
                </button>
                <button
                  onClick={handleExportText}
                  className="px-2.5 py-1 bg-[var(--surface-high)] hover:bg-[var(--surface-bright)] text-[var(--text-secondary)] border border-[var(--border-color)] rounded flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5 text-[var(--status-success)]" />
                  <span>Text</span>
                </button>
                <button
                  onClick={handleClearLogs}
                  className="px-2.5 py-1 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Purge Logs</span>
                </button>
              </div>
            </div>

            {/* Filter controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-[var(--border-color)] text-xs font-mono">
              {/* Level selector */}
              <div>
                <label className="text-[10px] text-[var(--text-muted)] uppercase font-bold block mb-1">Log Level</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value as any)}
                  className="w-full bg-[var(--surface-low)] border border-[var(--border-color)] rounded px-2.5 py-1.5 text-[var(--text-primary)] focus:outline-none focus:border-indigo-600"
                >
                  <option value="ALL">ALL LEVELS</option>
                  <option value="TRACE">TRACE</option>
                  <option value="DEBUG">DEBUG</option>
                  <option value="INFO">INFO</option>
                  <option value="WARN">WARN</option>
                  <option value="ERROR">ERROR</option>
                  <option value="FATAL">FATAL</option>
                </select>
              </div>

              {/* Domain filter */}
              <div>
                <label className="text-[10px] text-[var(--text-muted)] uppercase font-bold block mb-1">Domain Context</label>
                <input
                  type="text"
                  placeholder="e.g. DOM-008, KERNEL"
                  value={domainFilter}
                  onChange={(e) => setDomainFilter(e.target.value)}
                  className="w-full bg-[var(--surface-low)] border border-[var(--border-color)] rounded px-2.5 py-1.5 text-[var(--text-primary)] focus:outline-none focus:border-indigo-600"
                />
              </div>

              {/* Correlation ID search */}
              <div>
                <label className="text-[10px] text-[var(--text-muted)] uppercase font-bold block mb-1">Correlation ID</label>
                <input
                  type="text"
                  placeholder="e.g. corr_..."
                  value={correlationSearch}
                  onChange={(e) => setCorrelationSearch(e.target.value)}
                  className="w-full bg-[var(--surface-low)] border border-[var(--border-color)] rounded px-2.5 py-1.5 text-[var(--text-primary)] focus:outline-none focus:border-indigo-600"
                />
              </div>

              {/* Keyword query */}
              <div>
                <label className="text-[10px] text-[var(--text-muted)] uppercase font-bold block mb-1">Keyword Query</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search logs..."
                    value={textQuery}
                    onChange={(e) => setTextQuery(e.target.value)}
                    className="w-full bg-[var(--surface-low)] border border-[var(--border-color)] rounded px-2.5 py-1.5 pr-7 text-[var(--text-primary)] focus:outline-none focus:border-indigo-600"
                  />
                  <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute right-2.5 top-2.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Logs Table */}
          <div className="bg-[var(--surface-card)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-md">
            <div className="max-h-[500px] overflow-y-auto">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead className="bg-[var(--surface-low)] sticky top-0 border-b border-[var(--border-color)] text-[var(--text-secondary)] text-[10px] uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Level</th>
                    <th className="p-3">Domain</th>
                    <th className="p-3">Message</th>
                    <th className="p-3">Correlation ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--text-muted)]/60">
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-[var(--text-muted)] italic">
                        No log records matching active filter criteria.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr
                        key={log.id}
                        onClick={() => setSelectedLog(log)}
                        className="hover:bg-[var(--surface-high)] cursor-pointer transition-colors"
                      >
                        <td className="p-3 text-[var(--text-secondary)] whitespace-nowrap text-[11px]">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getLevelBadgeClass(
                              log.level
                            )}`}
                          >
                            {log.level}
                          </span>
                        </td>
                        <td className="p-3 text-indigo-300 font-semibold whitespace-nowrap">
                          {log.domain}
                        </td>
                        <td className="p-3 text-[var(--text-primary)] max-w-md truncate">
                          {log.message}
                          {log.error && (
                            <span className="ml-2 text-rose-400 text-[11px]">
                              [{log.error.name}]
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-[var(--text-muted)] text-[11px] whitespace-nowrap">
                          {log.correlationId}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: EventBus Inspector View */}
      {activeTab === 'eventbus' && (
        <div className="space-y-4 font-mono text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Event Metrics Summary */}
            <div className="bg-[var(--surface-card)] border border-[var(--border-color)] rounded-xl p-4 space-y-2">
              <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold block">
                Total Published Events
              </span>
              <span className="text-2xl font-bold text-[var(--status-success)]">{eventHistory.length}</span>
              <p className="text-[11px] text-[var(--text-secondary)]">In-memory capped history buffer (max 1000)</p>
            </div>

            <div className="bg-[var(--surface-card)] border border-[var(--border-color)] rounded-xl p-4 space-y-2">
              <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold block">
                Registered Event Types
              </span>
              <span className="text-2xl font-bold text-indigo-400">{eventMetrics.length}</span>
              <p className="text-[11px] text-[var(--text-secondary)]">Canonical events dispatched during session</p>
            </div>

            <div className="bg-[var(--surface-card)] border border-[var(--border-color)] rounded-xl p-4 space-y-2">
              <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold block">
                Global Event Listeners
              </span>
              <span className="text-2xl font-bold text-sky-400">
                {subscriptionCounts['__global__'] || 0} Active
              </span>
              <p className="text-[11px] text-[var(--text-secondary)]">Subscribed cross-domain subscribers</p>
            </div>
          </div>

          {/* Mock Event Publisher Box */}
          <div className="bg-[var(--surface-card)] border border-[var(--border-color)] rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
              <Play className="w-4 h-4 text-[var(--status-success)]" />
              EventBus Mock Dispatcher &amp; Replayer
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-[var(--text-muted)] uppercase font-bold block mb-1">
                  Target Event Type
                </label>
                <select
                  value={mockEventType}
                  onChange={(e) => setMockEventType(e.target.value as CanonicalEventType)}
                  className="w-full bg-[var(--surface-low)] border border-[var(--border-color)] rounded px-2.5 py-1.5 text-[var(--text-primary)] focus:outline-none"
                >
                  <option value="DashboardRefreshed">DashboardRefreshed</option>
                  <option value="LearningUnitStarted">LearningUnitStarted</option>
                  <option value="StageGateRequested">StageGateRequested</option>
                  <option value="StageGatePassed">StageGatePassed</option>
                  <option value="PracticeCompleted">PracticeCompleted</option>
                  <option value="VerdictRendered">VerdictRendered</option>
                  <option value="SkillMastered">SkillMastered</option>
                  <option value="ImportStarted">ImportStarted</option>
                  <option value="ImportCompleted">ImportCompleted</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[var(--text-muted)] uppercase font-bold block mb-1">
                  Event Payload (JSON)
                </label>
                <textarea
                  value={mockPayload}
                  onChange={(e) => setMockPayload(e.target.value)}
                  rows={2}
                  className="w-full bg-[var(--surface-low)] border border-[var(--border-color)] rounded px-2.5 py-1 text-[var(--text-primary)] focus:outline-none font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              {publishStatusMessage ? (
                <span className="text-xs text-[var(--status-success)] font-bold">{publishStatusMessage}</span>
              ) : (
                <span className="text-xs text-[var(--text-muted)]">
                  Emits event with current correlation ID context
                </span>
              )}

              <button
                onClick={handlePublishMockEvent}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold text-xs flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Publish Event</span>
              </button>
            </div>
          </div>

          {/* Event Stream Table */}
          <div className="bg-[var(--surface-card)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-md">
            <div className="p-3 bg-[var(--surface-low)] border-b border-[var(--border-color)] flex items-center justify-between">
              <span className="font-bold text-[var(--text-secondary)] uppercase text-[10px]">
                Dispatched Domain Events Stream
              </span>
              <input
                type="text"
                placeholder="Filter events..."
                value={eventSearch}
                onChange={(e) => setEventSearch(e.target.value)}
                className="bg-[var(--surface-card)] border border-[var(--border-color)] rounded px-2 py-1 text-[var(--text-primary)] text-xs w-48"
              />
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[var(--surface-low)] text-[var(--text-secondary)] text-[10px] uppercase border-b border-[var(--border-color)]">
                  <tr>
                    <th className="p-3">Time</th>
                    <th className="p-3">Event Type</th>
                    <th className="p-3">Source Domain</th>
                    <th className="p-3">Correlation ID</th>
                    <th className="p-3">Payload Summary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--text-muted)]/60">
                  {eventHistory.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-[var(--text-muted)] italic">
                        No events dispatched yet.
                      </td>
                    </tr>
                  ) : (
                    eventHistory
                      .filter(
                        (e) =>
                          !eventSearch ||
                          e.eventType.toLowerCase().includes(eventSearch.toLowerCase()) ||
                          e.sourceDomain.toLowerCase().includes(eventSearch.toLowerCase()) ||
                          (e.correlationId && e.correlationId.toLowerCase().includes(eventSearch.toLowerCase()))
                      )
                      .map((evt) => (
                        <tr
                          key={evt.eventId}
                          onClick={() => setSelectedEvent(evt)}
                          className="hover:bg-[var(--surface-high)] cursor-pointer transition-colors"
                        >
                          <td className="p-3 text-[var(--text-secondary)] text-[11px]">
                            {new Date(evt.timestamp).toLocaleTimeString()}
                          </td>
                          <td className="p-3 text-[var(--status-success)] font-bold">{evt.eventType}</td>
                          <td className="p-3 text-indigo-300">{evt.sourceDomain}</td>
                          <td className="p-3 text-[var(--text-muted)] text-[11px]">{evt.correlationId || 'N/A'}</td>
                          <td className="p-3 text-[var(--text-secondary)] max-w-xs truncate text-[11px]">
                            {JSON.stringify(evt.payload)}
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Performance Metrics View */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <PerformanceDashboardView />

          <div className="space-y-4 font-mono text-xs">
            <div className="bg-[var(--surface-card)] border border-[var(--border-color)] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[var(--status-warning)]" />
                  Execution Duration Benchmarks
                </h3>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Monitors operation durations and alerts when execution exceeds 50ms.
                </p>
              </div>

              <button
                onClick={() => {
                  performanceTracker.clear();
                  refreshData();
                }}
                className="px-2.5 py-1 bg-[var(--surface-high)] hover:bg-[var(--surface-bright)] text-[var(--text-secondary)] border border-[var(--border-color)] rounded text-xs"
              >
                Clear Benchmarks
              </button>
            </div>

            {/* Slow Ops Warning Card */}
            {slowOps.length > 0 && (
              <div className="p-3 bg-[var(--status-warning)]/60 border border-[var(--status-warning)] rounded-lg space-y-2">
                <span className="font-bold text-[var(--status-warning)] flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-[var(--status-warning)]" />
                  {slowOps.length} Slow Operation Alert(s) Detected (&gt;50ms)
                </span>
                <div className="space-y-1 text-[11px]">
                  {slowOps.map((op) => (
                    <div key={op.id} className="flex items-center justify-between text-[var(--status-warning)]/90 border-b border-[var(--status-warning)]/40 pb-1">
                      <span>[{op.domain}] {op.label}</span>
                      <span className="font-bold text-[var(--status-warning)]">{op.durationMs}ms</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Performance Table */}
          <div className="bg-[var(--surface-card)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-md">
            <div className="max-h-[450px] overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[var(--surface-low)] text-[var(--text-secondary)] text-[10px] uppercase border-b border-[var(--border-color)]">
                  <tr>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Operation Label</th>
                    <th className="p-3">Domain</th>
                    <th className="p-3">Duration (ms)</th>
                    <th className="p-3">Correlation ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--text-muted)]/60">
                  {perfMetrics.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-[var(--text-muted)] italic">
                        No performance benchmarks recorded yet.
                      </td>
                    </tr>
                  ) : (
                    perfMetrics.map((metric) => (
                      <tr key={metric.id} className="hover:bg-[var(--surface-high)] transition-colors">
                        <td className="p-3 text-[var(--text-secondary)] text-[11px]">
                          {new Date(metric.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="p-3 text-[var(--text-primary)] font-semibold">{metric.label}</td>
                        <td className="p-3 text-indigo-300">{metric.domain}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              metric.isSlow
                                ? 'bg-[var(--status-warning)] text-[var(--status-warning)] border border-[var(--status-warning)]'
                                : 'bg-[var(--surface-low)] text-[var(--status-success)] border border-[var(--border-color)]'
                            }`}
                          >
                            {metric.durationMs}ms
                          </span>
                        </td>
                        <td className="p-3 text-[var(--text-muted)] text-[11px]">{metric.correlationId}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )}

      {/* Tab 4: Structured Errors Dashboard View */}
      {activeTab === 'errors' && (
        <div className="space-y-4 font-mono text-xs">
          <div className="bg-[var(--surface-card)] border border-[var(--border-color)] rounded-xl p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Structured Errors &amp; Exception Register
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Captures uncaught global errors and explicit domain failure reports.
              </p>
            </div>

            <button
              onClick={() => {
                structuredErrorReporter.clear();
                refreshData();
              }}
              className="px-2.5 py-1 bg-[var(--surface-high)] hover:bg-[var(--surface-bright)] text-[var(--text-secondary)] border border-[var(--border-color)] rounded text-xs"
            >
              Clear Errors
            </button>
          </div>

          <div className="bg-[var(--surface-card)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-md">
            <div className="max-h-[450px] overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[var(--surface-low)] text-[var(--text-secondary)] text-[10px] uppercase border-b border-[var(--border-color)]">
                  <tr>
                    <th className="p-3">Time</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Domain</th>
                    <th className="p-3">Error Message</th>
                    <th className="p-3">Correlation ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--text-muted)]/60">
                  {errorReports.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-[var(--status-success)] italic">
                        No errors recorded in current session. System status healthy.
                      </td>
                    </tr>
                  ) : (
                    errorReports.map((report) => (
                      <tr
                        key={report.id}
                        onClick={() => setSelectedError(report)}
                        className="hover:bg-[var(--surface-high)] cursor-pointer transition-colors"
                      >
                        <td className="p-3 text-[var(--text-secondary)] text-[11px]">
                          {new Date(report.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              report.isUncaught
                                ? 'bg-purple-950 text-purple-300 border border-purple-800'
                                : 'bg-rose-950 text-rose-300 border border-rose-800'
                            }`}
                          >
                            {report.isUncaught ? 'UNCAUGHT' : 'REPORTED'}
                          </span>
                        </td>
                        <td className="p-3 text-indigo-300">{report.domain}</td>
                        <td className="p-3 text-rose-200 font-semibold truncate max-w-xs">
                          {report.message}
                        </td>
                        <td className="p-3 text-[var(--text-muted)] text-[11px]">{report.correlationId}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'architecture' && (
        <div className="space-y-4">
          <DomainArchitectureBanner
            onInspect={() => setIsArchInspectOpen(true)}
            onOpenEventStream={() => setIsEventStreamOpen(true)}
            activeDomainCount={MASTER_DOMAIN_REGISTRY.length}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DomainValidationSummaryView />
            <div className="bg-[var(--surface-card)] border border-[var(--border-color)] rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider font-mono">
                Bounded Contexts
              </h3>
              <div className="flex flex-wrap gap-2">
                {MASTER_DOMAIN_REGISTRY.map((domain) => (
                  <DomainArchitectureIndicator key={domain.id} domainId={domain.id} showLabel />
                ))}
              </div>
            </div>
          </div>

          <DomainEventAuditLogView maxEvents={100} />
        </div>
      )}

      <DomainArchitectureInspectModal
        isOpen={isArchInspectOpen}
        onClose={() => setIsArchInspectOpen(false)}
      />
      <DomainEventStreamDrawer
        isOpen={isEventStreamOpen}
        onClose={() => setIsEventStreamOpen(false)}
      />

      {/* Detail Modal for Selected Log */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-[var(--surface-low)]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--surface-card)] border border-[var(--border-color)] rounded-xl p-6 shadow-2xl max-w-xl w-full space-y-4 font-mono text-xs text-[var(--text-primary)] relative">
            <button
              onClick={() => setSelectedLog(null)}
              className="absolute top-4 right-4 p-1 text-[var(--text-secondary)] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-[var(--border-color)] pb-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getLevelBadgeClass(selectedLog.level)}`}>
                {selectedLog.level}
              </span>
              <h3 className="text-sm font-bold text-[var(--text-primary)] mt-2">{selectedLog.message}</h3>
            </div>

            <div className="space-y-2 text-[11px]">
              <div>
                <span className="text-[var(--text-muted)] uppercase block text-[10px]">Log ID / Timestamp:</span>
                <span className="text-[var(--text-secondary)]">{selectedLog.id} ({selectedLog.timestamp})</span>
              </div>
              <div>
                <span className="text-[var(--text-muted)] uppercase block text-[10px]">Domain:</span>
                <span className="text-indigo-400">{selectedLog.domain}</span>
              </div>
              <div>
                <span className="text-[var(--text-muted)] uppercase block text-[10px]">Correlation ID:</span>
                <span className="text-[var(--status-success)]">{selectedLog.correlationId}</span>
              </div>
              {selectedLog.context && (
                <div>
                  <span className="text-[var(--text-muted)] uppercase block text-[10px]">Context Data:</span>
                  <pre className="p-2.5 bg-[var(--surface-low)] rounded border border-[var(--border-color)] text-[var(--text-secondary)] overflow-x-auto text-[11px]">
                    {JSON.stringify(selectedLog.context, null, 2)}
                  </pre>
                </div>
              )}
              {selectedLog.error && (
                <div>
                  <span className="text-rose-400 uppercase block text-[10px]">Error Details:</span>
                  <pre className="p-2.5 bg-rose-950/40 border border-rose-800 rounded text-rose-200 overflow-x-auto text-[11px]">
                    {selectedLog.error.name}: {selectedLog.error.message}
                    {selectedLog.error.stack && `\n\n${selectedLog.error.stack}`}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal for Selected Event */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-[var(--surface-low)]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--surface-card)] border border-[var(--border-color)] rounded-xl p-6 shadow-2xl max-w-xl w-full space-y-4 font-mono text-xs text-[var(--text-primary)] relative">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 p-1 text-[var(--text-secondary)] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-[var(--border-color)] pb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--status-success)] text-[var(--status-success)] border border-[var(--status-success)]">
                {selectedEvent.eventType}
              </span>
              <h3 className="text-sm font-bold text-[var(--text-primary)] mt-2">Event ID: {selectedEvent.eventId}</h3>
            </div>

            <div className="space-y-2 text-[11px]">
              <div>
                <span className="text-[var(--text-muted)] uppercase block text-[10px]">Source Domain:</span>
                <span className="text-indigo-400">{selectedEvent.sourceDomain}</span>
              </div>
              <div>
                <span className="text-[var(--text-muted)] uppercase block text-[10px]">Correlation ID:</span>
                <span className="text-[var(--status-success)]">{selectedEvent.correlationId || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[var(--text-muted)] uppercase block text-[10px]">Payload:</span>
                <pre className="p-2.5 bg-[var(--surface-low)] rounded border border-[var(--border-color)] text-[var(--text-secondary)] overflow-x-auto text-[11px]">
                  {JSON.stringify(selectedEvent.payload, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal for Selected Error */}
      {selectedError && (
        <div className="fixed inset-0 z-50 bg-[var(--surface-low)]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--surface-card)] border border-[var(--border-color)] rounded-xl p-6 shadow-2xl max-w-xl w-full space-y-4 font-mono text-xs text-[var(--text-primary)] relative">
            <button
              onClick={() => setSelectedError(null)}
              className="absolute top-4 right-4 p-1 text-[var(--text-secondary)] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-[var(--border-color)] pb-2">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  selectedError.isUncaught ? 'bg-purple-950 text-purple-300' : 'bg-rose-950 text-rose-300'
                }`}
              >
                {selectedError.errorName}
              </span>
              <h3 className="text-sm font-bold text-[var(--text-primary)] mt-2">{selectedError.message}</h3>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[var(--text-muted)] uppercase block text-[10px]">Report ID:</span>
                  <span className="text-emerald-400 font-bold select-all">{selectedError.id}</span>
                </div>
                <div className="text-right">
                  <span className="text-[var(--text-muted)] uppercase block text-[10px]">Timestamp:</span>
                  <span className="text-[var(--text-secondary)]">{new Date(selectedError.timestamp).toISOString()}</span>
                </div>
              </div>
              <div>
                <span className="text-[var(--text-muted)] uppercase block text-[10px]">Domain &amp; Correlation:</span>
                <span className="text-[var(--text-secondary)]">{selectedError.domain} • {selectedError.correlationId}</span>
              </div>
              {selectedError.userContext && Object.keys(selectedError.userContext).length > 0 && (
                <div>
                  <span className="text-[var(--text-muted)] uppercase block text-[10px]">User &amp; Execution Context:</span>
                  <pre className="p-2 bg-[var(--surface-low)] border border-[var(--border-color)] rounded text-indigo-200 overflow-x-auto text-[10px]">
                    {JSON.stringify(selectedError.userContext, null, 2)}
                  </pre>
                </div>
              )}
              {selectedError.stackTrace && (
                <div>
                  <span className="text-[var(--text-muted)] uppercase block text-[10px]">Stack Trace:</span>
                  <pre className="p-2.5 bg-[var(--surface-low)] border border-[var(--border-color)] rounded text-rose-300 overflow-x-auto text-[10px]">
                    {selectedError.stackTrace}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
