# PLOS Observability Foundation Architecture (Sprint PF-3)

## 1. Executive Summary

Sprint **PF-3 (Observability Foundation)** establishes a production-grade, local-first observability stack for the Eliot Personal Learning Operating System (PLOS). Designed for high determinism, full privacy, and zero external service overhead, the foundation provides structural logging, cross-domain correlation tracing, bounded local persistence, real-time event bus inspection, execution benchmarking, and structured exception handling.

---

## 2. Core Pillars of Observability

### 2.1 Central Logger (`src/core/observability/Logger.ts`)
- **Log Levels**: `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL`.
- **Structural Attributes**: Timestamp (ISO 8601), Level, Domain Namespace, Message, Correlation ID, Context Payload, Error Stack, Duration (ms).
- **Multi-Sink Dispatching**: Outputs formatted entries to `console`, persists to `LocalLogStore`, and dispatches diagnostic events to the `EventBus`.

### 2.2 Correlation IDs (`src/core/observability/CorrelationContext.ts`)
- Generates context-bound unique IDs (format: `corr_[timestamp]_[random]`).
- Automatically attached to all log records, performance traces, error reports, and published domain events via `BaseDomainEvent.correlationId`.
- Supports context tracking across asynchronous boundaries (`runWithCorrelationIdAsync`).

### 2.3 Local Log Storage (`src/core/observability/LocalLogStore.ts`)
- **Bounded Buffer**: Capped FIFO retention buffer (default: 1,000 entries).
- **LocalStorage Persistence**: Auto-synced to `localStorage` key `eliot_local_logs` with storage quota fallback protection.
- **Structured Query Engine**: Filter logs by Level, Minimum Severity, Domain ID, Correlation ID, Keyword query, and Time Range.
- **Data Exporting**: Direct client-side export in JSON (`exportJSON`) or formatted plain text (`exportText`).

### 2.4 Performance Timing (`src/core/observability/PerformanceTracker.ts`)
- Utilizes `performance.now()` for high-resolution timing.
- **Slow Operation Alerts**: Automatic warning generation when operation duration exceeds **50ms**.
- **Sync & Async Helpers**: `measureSync` and `measureAsync` wrappers for domain functions.

### 2.5 Structured Error Reporting (`src/core/observability/StructuredErrorReporter.ts`)
- Normalizes errors, strings, and objects into `StructuredErrorReport` schemas.
- **Global Event Listeners**: Initializes `window.onerror` and `window.onunhandledrejection` handlers.
- **Result Monad Integration**: Direct capture of `Result.fail` errors via `captureResultError`.

### 2.6 EventBus Inspector (`src/core/events/EventBus.ts`)
- Tracks event execution duration, listener execution errors, and subscription counts per event type.
- Maintains event history with correlation ID context.
- Provides interactive mock event publishing and replay capability.

### 2.7 Diagnostics Workspace (`src/shared/components/diagnostics/DiagnosticsWorkspaceView.tsx`)
- Tabbed UI for live log streaming, EventBus monitoring, performance benchmarks, and structured error inspection.
- Integrated into `SystemRoute` navigation (`'diagnostics'`).

---

## 3. Directory Layout

```
src/core/observability/
├── CorrelationContext.ts        # Correlation ID tracking & propagation
├── LocalLogStore.ts             # LocalStorage FIFO log persistence & query engine
├── Logger.ts                    # Central structured logger
├── PerformanceTracker.ts        # Execution timer & slow operation warning engine
├── StructuredErrorReporter.ts  # Structured error normalizer & window error handlers
├── types.ts                     # Observability domain contracts & interfaces
└── index.ts                     # Public barrel exporter

src/shared/components/diagnostics/
├── DiagnosticsWorkspaceView.tsx # Diagnostics Workspace & EventBus Inspector UI
└── index.ts                     # Barrel exporter
```

---

## 4. Verification & Testing

- `compile_applet`: Verified zero build or TypeScript type errors.
- `lint_applet`: Verified 100% linter compliance.
