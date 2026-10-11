# Eliot PLOS — File Manifest (Sprint 0.1)

| Relative File Path | Purpose | Domain / Layer Ownership | Internal / External Dependencies |
|---|---|---|---|
| `package.json` | Project scripts & dependencies manifest | Root Infrastructure | npm, Vite, React, Tailwind |
| `metadata.json` | Platform application metadata & frame permissions | Root Infrastructure | None |
| `README.md` | Primary architecture documentation & execution guide | Root Documentation | None |
| `SPRINT_0_1_REVIEW.md` | Sprint 0.1 audit report & completion checklist | Root Audit | None |
| `PROJECT_TREE.md` | Complete file & directory hierarchy map | Root Review Package | None |
| `FILE_MANIFEST.md` | Detailed list of created files, purpose & ownership | Root Review Package | None |
| `ARCHITECTURE_MAP.md` | Structural layer alignment & boundary rules | Root Review Package | None |
| `DEPENDENCY_GRAPH.md` | Cross-module directional dependency map | Root Review Package | None |
| `IMPLEMENTATION_SUMMARY.md` | Breakdown of implemented skeleton components | Root Review Package | None |
| `DEVIATION_REPORT.md` | Scope compliance & deviation audit report | Root Review Package | None |
| `src/main.tsx` | React DOM root hydration entrypoint | Presentation Entrypoint | `React`, `ReactDOM`, `App.tsx` |
| `src/App.tsx` | Main application entry point mounting `AppShell` | Presentation Entrypoint | `src/shared/components` |
| `src/index.css` | Global Tailwind CSS styling entrypoint | Presentation Styling | Tailwind CSS (`@import "tailwindcss"`) |
| `src/assets/README.md` | Asset guidelines and design token references | Assets Layer | None |
| `src/config/environment.ts` | System environment constants and version metadata | Config Layer | None |
| `src/config/featureFlags.ts` | Sprint feature rollout flags definition | Config Layer | None |
| `src/config/index.ts` | Master barrel exporter for configuration | Config Layer | `environment.ts`, `featureFlags.ts` |
| `src/types/domains.ts` | Master domain IDs, entity contracts, & stage types | Canonical Types Layer | None |
| `src/types/events.ts` | Canonical domain event types & payload schemas | Canonical Types Layer | `domains.ts` |
| `src/types/handoffs.ts` | Cross-workflow state handoff payload contracts | Canonical Types Layer | `domains.ts` |
| `src/types/index.ts` | Master barrel exporter for canonical types | Canonical Types Layer | `domains.ts`, `events.ts`, `handoffs.ts` |
| `src/core/errors/Result.ts` | Monadic `Result<T, E>` zero-exception container | Core Engine (Errors) | None |
| `src/core/errors/DomainErrors.ts` | Structured domain error taxonomy hierarchy | Core Engine (Errors) | `src/types` |
| `src/core/errors/index.ts` | Master barrel exporter for core errors | Core Engine (Errors) | `Result.ts`, `DomainErrors.ts` |
| `src/core/events/types.ts` | Event bus contract interfaces & handler handles | Core Engine (Events) | `src/types` |
| `src/core/events/EventRegistry.ts` | Master registry of 14 canonical event types | Core Engine (Events) | `src/types` |
| `src/core/events/EventBus.ts` | In-memory asynchronous event broker singleton | Core Engine (Events) | `src/types`, `types.ts` |
| `src/core/events/index.ts` | Master barrel exporter for event bus engine | Core Engine (Events) | `types.ts`, `EventRegistry.ts`, `EventBus.ts` |
| `src/core/state/types.ts` | State machine contract interfaces | Core Engine (State) | `src/types`, `src/core/errors` |
| `src/core/state/LearningStageMachine.ts` | Deterministic 8-stage lifecycle machine | Core Engine (State) | `src/types`, `src/core/errors`, `types.ts` |
| `src/core/state/ReviewPipelineMachine.ts` | Deterministic AI review state machine | Core Engine (State) | `src/core/errors`, `types.ts` |
| `src/core/state/index.ts` | Master barrel exporter for state engines | Core Engine (State) | `types.ts`, `LearningStageMachine.ts`, `ReviewPipelineMachine.ts` |
| `src/core/storage/StorageAdapter.ts` | Storage repository interface definition | Core Engine (Storage) | `src/core/errors` |
| `src/core/storage/IndexedDBAdapter.ts` | IndexedDB repository adapter placeholder | Core Engine (Storage) | `src/core/errors`, `StorageAdapter.ts` |
| `src/core/storage/LocalStorageAdapter.ts` | LocalStorage adapter for preferences | Core Engine (Storage) | `src/core/errors`, `StorageAdapter.ts` |
| `src/core/storage/index.ts` | Master barrel exporter for storage adapters | Core Engine (Storage) | `StorageAdapter.ts`, `IndexedDBAdapter.ts`, `LocalStorageAdapter.ts` |
| `src/core/ai/AIProvider.ts` | Abstract AI provider contract for server LLM | Core Engine (AI Core) | `src/core/errors` |
| `src/core/ai/Constitution.ts` | Outbound AI response guardrail validator | Core Engine (AI Core) | `src/core/errors` |
| `src/core/ai/PromptTemplates.ts` | Bounded prompt context formatters | Core Engine (AI Core) | None |
| `src/core/ai/index.ts` | Master barrel exporter for AI core engine | Core Engine (AI Core) | `AIProvider.ts`, `Constitution.ts`, `PromptTemplates.ts` |
| `src/core/memory/MemoryStore.ts` | Cognitive memory store interface contract | Core Engine (Memory) | `src/types`, `src/core/errors` |
| `src/core/memory/DecayEngine.ts` | Temporal memory decay calculator (35% floor) | Core Engine (Memory) | None |
| `src/core/memory/index.ts` | Master barrel exporter for memory engine | Core Engine (Memory) | `MemoryStore.ts`, `DecayEngine.ts` |
| `src/domains/dom-001-learning/contracts/ServiceInterface.ts` | Inbound/outbound service interface | `DOM-001` Learning Domain | `src/types`, `src/core/errors` |
| `src/domains/dom-001-learning/index.ts` | Public gateway barrel & domain metadata | `DOM-001` Learning Domain | `ServiceInterface.ts` |
| `src/domains/dom-002-memory/contracts/ServiceInterface.ts` | Inbound/outbound service interface | `DOM-002` Memory Domain | `src/types`, `src/core/errors` |
| `src/domains/dom-002-memory/index.ts` | Public gateway barrel & domain metadata | `DOM-002` Memory Domain | `ServiceInterface.ts` |
| `src/domains/dom-003-knowledge/contracts/ServiceInterface.ts` | Inbound/outbound service interface | `DOM-003` Knowledge Domain | `src/core/errors` |
| `src/domains/dom-003-knowledge/index.ts` | Public gateway barrel & domain metadata | `DOM-003` Knowledge Domain | `ServiceInterface.ts` |
| `src/domains/dom-004-ai-core/contracts/ServiceInterface.ts` | Inbound/outbound service interface | `DOM-004` AI Core Domain | `src/core/ai`, `src/core/errors` |
| `src/domains/dom-004-ai-core/index.ts` | Public gateway barrel & domain metadata | `DOM-004` AI Core Domain | `ServiceInterface.ts` |
| `src/domains/dom-005-project/contracts/ServiceInterface.ts` | Inbound/outbound service interface | `DOM-005` Project Domain | `src/core/errors` |
| `src/domains/dom-005-project/index.ts` | Public gateway barrel & domain metadata | `DOM-005` Project Domain | `ServiceInterface.ts` |
| `src/domains/dom-006-career/contracts/ServiceInterface.ts` | Inbound/outbound service interface | `DOM-006` Career Domain | `src/types`, `src/core/errors` |
| `src/domains/dom-006-career/index.ts` | Public gateway barrel & domain metadata | `DOM-006` Career Domain | `ServiceInterface.ts` |
| `src/domains/dom-007-dashboard/contracts/ServiceInterface.ts` | Inbound/outbound service interface | `DOM-007` Dashboard Domain | `src/core/errors` |
| `src/domains/dom-007-dashboard/index.ts` | Public gateway barrel & domain metadata | `DOM-007` Dashboard Domain | `ServiceInterface.ts` |
| `src/domains/dom-008-navigation/contracts/ServiceInterface.ts` | Inbound/outbound service interface | `DOM-008` Navigation Domain | `src/core/errors` |
| `src/domains/dom-008-navigation/index.ts` | Public gateway barrel & domain metadata | `DOM-008` Navigation Domain | `ServiceInterface.ts` |
| `src/domains/dom-009-review/contracts/ServiceInterface.ts` | Inbound/outbound service interface | `DOM-009` Review Domain | `src/types`, `src/core/errors` |
| `src/domains/dom-009-review/index.ts` | Public gateway barrel & domain metadata | `DOM-009` Review Domain | `ServiceInterface.ts` |
| `src/domains/dom-010-settings/contracts/ServiceInterface.ts` | Inbound/outbound service interface | `DOM-010` Settings Domain | `src/core/errors` |
| `src/domains/dom-010-settings/index.ts` | Public gateway barrel & domain metadata | `DOM-010` Settings Domain | `ServiceInterface.ts` |
| `src/domains/dom-011-evidence/contracts/ServiceInterface.ts` | Inbound/outbound service interface | `DOM-011` Evidence Domain | `src/types`, `src/core/errors` |
| `src/domains/dom-011-evidence/index.ts` | Public gateway barrel & domain metadata | `DOM-011` Evidence Domain | `ServiceInterface.ts` |
| `src/domains/dom-012-analytics/contracts/ServiceInterface.ts` | Inbound/outbound service interface | `DOM-012` Analytics Domain | `src/core/errors` |
| `src/domains/dom-012-analytics/index.ts` | Public gateway barrel & domain metadata | `DOM-012` Analytics Domain | `ServiceInterface.ts` |
| `src/domains/index.ts` | Master gateway barrel exporter for all 12 domains | Bounded Domains Registry | `dom-001` .. `dom-012` barrels |
| `src/shared/utils/cn.ts` | Class name joining utility function | Shared Utilities | None |
| `src/shared/utils/index.ts` | Master barrel exporter for shared utilities | Shared Utilities | `cn.ts` |
| `src/shared/components/SystemStatusBar.tsx` | Kernel health & status statusbar component | Shared Presentation | `lucide-react`, `src/config` |
| `src/shared/components/HeaderBar.tsx` | Header bar showing PLOS identity and controls | Shared Presentation | `lucide-react`, `src/config` |
| `src/shared/components/NavigationFrame.tsx` | Mobile-first bottom frame navigation bar | Shared Presentation | `lucide-react`, `DOM-008` |
| `src/shared/components/AppShell.tsx` | Mobile-first responsive app shell container | Shared Presentation | `lucide-react`, `src/config`, `src/domains`, `src/core/events` |
| `src/shared/components/index.ts` | Master barrel exporter for layout components | Shared Presentation | `AppShell`, `HeaderBar`, `NavigationFrame`, `SystemStatusBar` |
