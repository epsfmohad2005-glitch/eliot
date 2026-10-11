# Eliot Automated Testing Strategy & Verification Pipeline

* **Document Version**: 1.0.0
* **Frameworks**: Vitest 4.x, React Testing Library 16.x, Playwright 1.x, V8 Coverage

---

## 1. Testing Architecture Overview

Eliot enforces a multi-layered testing pyramid to guarantee zero-flakiness, high determinism, and complete verification across unit, integration, and E2E layers.

```
                  ┌────────────────────────┐
                  │    Playwright E2E      │  (9 Scenarios)
                  ├────────────────────────┤
                  │  Integration Pipelines │  (4 Core Workflows)
                  ├────────────────────────┤
                  │  Unit & Domain Services│  (28+ Unit Tests)
                  └────────────────────────┘
```

---

## 2. Test Layer Specifications

### Layer 1: Unit Tests (Vitest + JSDOM)
* **Location**: Alongside domain service implementation files (e.g. `src/domains/dom-002-memory/MemoryDomainService.test.ts`).
* **Focus**: Domain business logic, mathematical formulas ($M_c$, exponential decay), validators, and core utilities.
* **Execution**: Ultra-fast in-memory execution (<1s total runtime).

### Layer 2: Integration Pipeline Tests (Vitest)
* **Location**: `src/tests/integration/*.test.ts`.
* **Focus**: End-to-end multi-domain interactions without UI rendering:
  1. `ImportExtractionReview.test.ts`: Source file ingestion → CKM-C extraction → Review workspace staging.
  2. `ReviewCommit.test.ts`: Candidate model validation → Immutable commit generation → Ledger append.
  3. `CommitMemoryEngine.test.ts`: Ledger commit activation → Concept synchronization → Memory practice & stability updates.
  4. `ReflectionEvidenceDashboard.test.ts`: Reflection quality validation → SHA-256 evidence hashing → Mission control dashboard state update.

### Layer 3: End-to-End Tests (Playwright)
* **Location**: `e2e/app.spec.ts`.
* **Focus**: Complete browser automation testing core user flows in headless Chromium:
  * Application boot & workspace frame rendering
  * PDF and Markdown source document import
  * Knowledge review concept approvals and commit execution
  * Active learning mission execution and evidence submission

---

## 3. Test Fixtures & Assertions

* **Test Assertion Helper (`assertOk`)**:
  Located in `src/test/utils.tsx`, validates monadic `Result<T, E>` types:
  ```typescript
  import { assertOk } from '../test/utils';
  const res = await memoryService.getMemoryItem('mem_001');
  assertOk(res); // Narrow-types res to { ok: true, value: MemoryItemEntity }
  ```

* **Shared Fixtures (`src/test/fixtures/index.ts`)**:
  Provides immutable baseline test objects (`mockSourceMetadata`, `mockExtractedAssets`, `mockCandidateModel`).

* **Domain Mock Factory (`src/test/factories/index.ts`)**:
  Provides dynamic entity generators (`DomainMockFactory.createMemoryItem()`, `DomainMockFactory.createConceptNode()`).

---

## 4. Execution Commands

```bash
# Execute full Vitest suite (Unit + Integration)
npm run test

# Execute Unit tests only
npm run test:unit

# Execute Integration tests only
npm run test:integration

# Run full V8 Code Coverage Report
npm run test:coverage

# Execute Playwright E2E browser tests
npm run test:e2e
```

---

## 5. Coverage Target Standards

| Category | Statements | Branches | Functions | Lines |
| :--- | :---: | :---: | :---: | :---: |
| **Core Domain Services** | > 90% | > 75% | > 85% | > 90% |
| **Overall Codebase** | > 70% | > 50% | > 70% | > 70% |
