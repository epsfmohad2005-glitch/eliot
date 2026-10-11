# Eliot PLOS — Dependency Graph & Directional Rules (Sprint 0.1)

This document details the unidirectional dependency hierarchy, permitted dependency pathways, and strictly forbidden import patterns in the Eliot PLOS architecture.

---

## Allowed Dependency Hierarchy (Top-Down Flow)

```
[Presentation / App Shell] (src/shared/components, src/App.tsx)
          │
          ▼
[Bounded Domain Gateways] (src/domains/dom-001..012)
          │
          ▼
[Kernel Core Engine] (src/core/errors, events, state, storage, ai, memory)
          │
          ▼
[Canonical Types & Config] (src/types, src/config)
```

---

## Module Dependency Matrix

| Source Module | Permitted Imports | Prohibited Imports |
|---|---|---|
| **`src/types/`** | None (Leaf module) | `src/core`, `src/domains`, `src/shared`, `React` |
| **`src/config/`** | None | `src/core`, `src/domains`, `src/shared`, `React` |
| **`src/core/errors/`** | `src/types` | `src/domains`, `src/shared`, `React` |
| **`src/core/events/`** | `src/types` | `src/domains`, `src/shared`, `React` |
| **`src/core/state/`** | `src/types`, `src/core/errors` | `src/domains`, `src/shared`, `React` |
| **`src/core/storage/`**| `src/core/errors` | `src/domains`, `src/shared`, `React` |
| **`src/core/ai/`** | `src/core/errors` | `src/domains`, `src/shared`, `React` |
| **`src/core/memory/`** | `src/types`, `src/core/errors` | `src/domains`, `src/shared`, `React` |
| **`src/domains/dom-XXX/`**| `src/types`, `src/core/*`, sibling domain contracts (`src/domains/dom-YYY/index.ts`) | Internal implementations of sibling domains (`src/domains/dom-YYY/contracts/...`), `src/shared/components` |
| **`src/shared/`** | `src/types`, `src/config`, `src/core/events`, `src/domains` | Internal domain files outside public `index.ts` barrels |

---

## Forbidden Dependency Patterns & Architectural Guardrails

### Rule 1: No Circular Dependencies
- `src/types/` must never import from `src/core/` or `src/domains/`.
- Domain modules must never import directly from `src/shared/` presentation components.

### Rule 2: Strict Cross-Domain Isolation
- `DOM-001` (Learning) cannot import private internal files from `DOM-002` (Memory).
- Cross-domain interactions MUST occur through one of two sanctioned patterns:
  1. **Contract Invocations:** Importing public interface definitions from `src/domains/dom-XXX/index.ts`.
  2. **Event Dispatching:** Publishing and subscribing to canonical domain events over `InMemoryEventBus`.

### Rule 3: Framework Neutrality in Core Kernel
- Files under `src/core/` MUST NOT import `React`, `ReactDOM`, or UI-specific libraries.
- The Core layer must remain 100% portable and runnable in pure Node.js, Web Workers, or headless container environments.

### Rule 4: Zero Direct State Mutation Across Boundaries
- State transitions must be requested via state machine instances (`LearningStageMachine`, `ReviewPipelineMachine`) returning monadic `Result<T, E>` values.
