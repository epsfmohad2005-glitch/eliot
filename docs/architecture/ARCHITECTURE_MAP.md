# Eliot PLOS — Architecture Map (Sprint 0.1)

This document maps the implementation directory structure directly to the **Clean Architecture & Domain-Driven Design (DDD)** principles governing the Eliot Personal Learning Operating System.

---

## Architectural Layer Mapping

```
+-----------------------------------------------------------------------+
|                         APP SHELL / PRESENTATION                       |
|           (src/App.tsx, src/shared/components/, src/main.tsx)          |
+-----------------------------------------------------------------------+
                                    |
                                    v
+-----------------------------------------------------------------------+
|                    BOUNDED DOMAIN CONTEXT GATEWAYS                    |
|                        (src/domains/dom-001..012)                     |
+-----------------------------------------------------------------------+
                |                                       |
                v                                       v
+-------------------------------+       +-------------------------------+
|          CORE ENGINE          |       |         SHARED UTILS          |
|  (src/core/errors, events,    |       |      (src/shared/utils)       |
|   state, storage, ai, memory) |       +-------------------------------+
+-------------------------------+
                |
                v
+-----------------------------------------------------------------------+
|                     CANONICAL TYPES & CONFIGURATION                   |
|                       (src/types/, src/config/)                       |
+-----------------------------------------------------------------------+
```

---

## Directory Responsibilities & Boundary Enforcement

### 1. `src/types/` — Canonical Domain Contracts
- **Role:** Pure interface definitions, enums, type aliases, and contract schemas.
- **Boundary Rules:**
  - MUST NOT import from any other application layer.
  - Serves as the ultimate source of truth for entity definitions across all domains.
  - Contains zero executable code or business logic.

### 2. `src/core/` — Kernel Core Engine Infrastructure
- **Role:** Framework-agnostic operational primitives and domain-independent engines.
  - `src/core/errors/`: Monadic `Result<T, E>` and domain error taxonomy.
  - `src/core/events/`: Async `InMemoryEventBus` broker and event registry.
  - `src/core/state/`: Deterministic state machines (`LearningStageMachine`, `ReviewPipelineMachine`).
  - `src/core/storage/`: Local-first storage adapter interfaces (`IndexedDBAdapter`, `LocalStorageAdapter`).
  - `src/core/ai/`: Socratic `AIConstitution` response guardrails & provider contracts.
  - `src/core/memory/`: `DecayEngine` temporal decay calculations (35% hard floor).
- **Boundary Rules:**
  - MAY import from `src/types/` and `src/config/`.
  - MUST NOT import from React or presentation components.
  - MUST NOT depend on specific domain implementations (`src/domains/`).

### 3. `src/domains/` — 12 Bounded Domain Contexts
- **Role:** Explicit Domain-Driven Design (DDD) module placeholders.
  - `DOM-001` Learning Engine
  - `DOM-002` Cognitive Memory
  - `DOM-003` Knowledge Graph
  - `DOM-004` Socratic AI Core
  - `DOM-005` Project Engine
  - `DOM-006` Career Matrix
  - `DOM-007` Workspace Presentation
  - `DOM-008` Router Navigation
  - `DOM-009` Review Pipeline
  - `DOM-010` System Settings
  - `DOM-011` Evidence Registry
  - `DOM-012` Learning Analytics
- **Boundary Rules:**
  - Each domain folder contains a strictly isolated `contracts/ServiceInterface.ts` and `index.ts`.
  - Domains MUST interact with other domains ONLY via public contract interfaces exported in `index.ts` or published domain events via `EventBus`.
  - Direct internal imports between different domain folders are strictly forbidden.

### 4. `src/shared/` — Shared UI & Layout Presentation
- **Role:** Mobile-first layout frame, navigation controls, status bars, and shared utility functions.
  - `src/shared/components/`: `AppShell`, `HeaderBar`, `NavigationFrame`, `SystemStatusBar`.
  - `src/shared/utils/`: Tailwind helper `cn()`.
- **Boundary Rules:**
  - UI components mount domain status representations and emit events via `EventBus`.
  - Presentation components MUST NOT embed database queries, direct API credentials, or unconstrained state logic.

### 5. Root Configuration (`src/config/`)
- **Role:** Application environment constants (`environment.ts`) and feature rollout flags (`featureFlags.ts`).
- **Boundary Rules:**
  - Global read-only configuration accessible across all layers.
