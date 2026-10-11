# Eliot — Personal Learning Operating System (PLOS)

> **A deterministic, local-first Personal Learning Operating System powered by event-driven clean architecture, Socratic guidance, an immutable knowledge ledger, and an 8-stage cognitive mastery lifecycle.**

---

## Master References & Documentation

* **[`PROJECT_BIBLE.md`](./PROJECT_BIBLE.md)**: The constitutional blueprint and technical architecture reference for Eliot.
* **[`docs/README.md`](./docs/README.md)**: The complete engineering documentation index (Architecture, Product, Development, ADRs, Archive).

---

## Core System Architecture

1. **`src/core/` (Kernel Core Engines)**:
   * **`EventBus`**: Typed asynchronous cross-domain event dispatcher (`src/core/events/EventBus.ts`).
   * **`ImportEngine`**: Multi-format document ingestion (`pdf-document`, `markdown-folder`) with SHA-256 fingerprinting.
   * **`ExtractionEngine`**: Deterministic text AST parsing and candidate concept (CKM-C) extraction.
   * **`KnowledgeLedger`**: Immutable commit graph generating versioned CKM snapshots (`v1.0.0`).

2. **`src/domains/` (12 Bounded Domain Services)**:
   * **`dom-001-learning`**: 8-stage learning lifecycle & reflection quality validation.
   * **`dom-002-memory`**: Exponential cognitive memory decay calculation & stability tracking.
   * **`dom-003-knowledge`**: Cognitive Knowledge Model (CKM) directed graph & mastery scoring ($M_c$).
   * **`dom-004-ai-core`**: Socratic feedback evaluation & AI Constitution guardrails.
   * **`dom-005-project`**: Real-world deliverable management.
   * **`dom-006-career`**: Skill matrix mapping & industry benchmark alignment.
   * **`dom-007-dashboard`**: Mission Control single-context workspace focus.
   * **`dom-008-navigation`**: Ambient spatial viewport transitions.
   * **`dom-009-review`**: Candidate model staging, concept editing & duplicate merging.
   * **`dom-010-settings`**: User environment preferences & local persistence settings.
   * **`dom-011-evidence`**: SHA-256 cryptographic evidence hashing & verification.
   * **`dom-012-analytics`**: True cognitive velocity tracking without vanity metrics.

3. **`src/i18n/` (Internationalization)**:
   * Full English (`en`) and Arabic (`ar`) translation support with Right-to-Left (RTL) layout mirroring.

---

## Quick Start & Commands

```bash
# Start development server on port 3000
npm run dev

# Run TypeScript linter & type check
npm run lint

# Run full Vitest test suite (Unit + Integration)
npm run test

# Run V8 code coverage report
npm run test:coverage

# Run Playwright E2E browser tests
npm run test:e2e

# Build production bundle (Vite + esbuild CommonJS server)
npm run build

# Start production server
npm run start
```
