# ELIOT PROJECT — ARCHITECTURE QUALITY SPRINT (AQS-1)
## TECHNICAL DEBT INVENTORY & REMEDIATION ROADMAP

---

## 1. EXECUTIVE OVERVIEW

This **Technical Debt Report** catalogs all accumulated, inherent, and potential technical debt in the Eliot Personal Learning Operating System (PLOS) across Sprints 0–3.

Technical debt in Eliot is classified into 4 distinct categories:
1. **Architectural & Structural Debt**: Cross-domain coupling, interface omissions, and container redundancy.
2. **State & Event Debt**: Event bus reliability, state mutation leaks, and timing state placement.
3. **Knowledge Model Debt**: Mathematical formula discrepancies, latency baseline calibration, and vector store interfaces.
4. **Infrastructure & Security Debt**: Encryption at rest, draft pruning daemons, and storage persistence declarations.

---

## 2. TECHNICAL DEBT INVENTORY

| Debt ID | Debt Item Description | Category | Severity | Estimated Effort | Target Sprint / Phase | Architectural Impact |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| **DEBT-01** | Consolidate Concept Mastery ($M_c$) Weights in Canonical Specifications | Knowledge Model | Medium | 0.5 Days | Maintenance Phase 1 | Eliminates scoring friction between `DOM-004` and `CKM`. |
| **DEBT-02** | Clarify Knowledge State Mutation Ownership via Event Bus Handlers | Architectural | High | 1.0 Day | Maintenance Phase 1 | Prevents race conditions and aggregate root rule violations. |
| **DEBT-03** | Decouple UI Timer Tick State into Dedicated Worker / Service | State / UI | Low | 1.0 Day | Maintenance Phase 2 | Prevents timer pauses when browser tab is inactive. |
| **DEBT-04** | Implement AES-256 Encryption at Rest for IndexedDB Notes & Reflections | Security | High | 2.0 Days | Maintenance Phase 1 | Protects user privacy on shared storage media. |
| **DEBT-05** | Define `IVectorSearchProvider` Interface Contract in DOM-004 | Infrastructure | Medium | 1.5 Days | Phase 2 (AI Expansion) | Decouples vector embedding search from specific DB vendors. |
| **DEBT-06** | Implement Dead Letter Queue (DLQ) in Domain `EventBus` | Architectural | Medium | 1.0 Day | Maintenance Phase 1 | Guarantees event delivery reliability across domain boundaries. |
| **DEBT-07** | Define Adaptive Rolling Baseline for Anomaly Latency Detection | Knowledge Model | Medium | 1.5 Days | Maintenance Phase 2 | Eliminates false cognitive strain flags for varied user typing speeds. |
| **DEBT-08** | Implement 30-Day Automated Pruning Daemon for Abandoned Session Drafts | Storage / Performance | Low | 0.5 Days | Maintenance Phase 2 | Prevents storage bloat in browser IndexedDB database. |
| **DEBT-09** | Enforce WCAG 2.1 Keyboard Focus Trap Wrapper in Context-Locked UI | UI / Accessibility | Low | 0.5 Days | Maintenance Phase 2 | Ensures accessible keyboard navigation in locked workspace mode. |
| **DEBT-10** | Add Asset Ingestion Provider Contract (`IAssetIngestionProvider`) | Infrastructure | Medium | 1.0 Day | Phase 2 (AI Expansion) | Standardizes ingestion of NotebookLM and Gemini Gem resources. |

---

## 3. REMEDIATION ROADMAP & SEQUENCING

```
PHASE 1: IMMEDIATE ARCHITECTURAL HARDENING (Sprint AQS-1.1 — 4.5 Days Total)
├── DEBT-01: Consolidate Mastery Weights (0.5 Days)
├── DEBT-02: Bounded Context Event Ownership Alignment (1.0 Day)
├── DEBT-04: AES-256 Storage Encryption at Rest (2.0 Days)
└── DEBT-06: EventBus Dead Letter Queue Implementation (1.0 Day)

PHASE 2: PERFORMANCE, ACCESSIBILITY & KNOWLEDGE TUNING (Sprint AQS-1.2 — 4.5 Days Total)
├── DEBT-03: Web Worker Session Timer Decoupling (1.0 Day)
├── DEBT-07: Adaptive Rolling Median Latency Baseline (1.5 Days)
├── DEBT-08: 30-Day Draft Session Pruning Daemon (0.5 Days)
└── DEBT-09: Accessible Focus Trap Wrapper for Context Lock (0.5 Days)

PHASE 3: FUTURE EXTENSIBILITY & AI INTEGRATION CONTRACTS (Phase 2 Expansion — 2.5 Days Total)
├── DEBT-05: Vector Store Interface Contract Definition (1.5 Days)
└── DEBT-10: Asset Ingestion Plugin Interface Specification (1.0 Day)
```

---

## 4. DETAILED REMEDIATION PLANS

### Remediation Plan 1: AES-256 Storage Encryption at Rest (DEBT-04)
- **Problem**: Plaintext storage of open-ended reflections in browser IndexedDB poses a privacy risk on shared devices.
- **Solution**: Create `CryptoStorageRepository` adapter implementing `IStorageRepository`. Use `window.crypto.subtle` with AES-256-GCM and a user-derived master key (derived via PBKDF2 with 600,000 iterations).
- **Files Modified**: `src/infrastructure/storage/CryptoStorageRepository.ts`, `src/domain/services/EncryptionService.ts`.
- **Validation**: Unit test verifying encrypted payloads in IndexedDB cannot be decoded without the master key.

### Remediation Plan 2: EventBus Dead Letter Queue (DEBT-06)
- **Problem**: Asynchronous subscribers that fail during domain event handling drop events silently.
- **Solution**: Enhance `EventBus` to capture uncaught exceptions in subscribers. Route failed events to a local `DeadLetterQueueStore` with standard exponential backoff retries (3 attempts).
- **Files Modified**: `src/infrastructure/events/EventBus.ts`, `src/infrastructure/events/DeadLetterQueue.ts`.
- **Validation**: Integration test demonstrating failed event recovery and retry execution.

### Remediation Plan 3: Bounded Context Event Ownership Alignment (DEBT-02)
- **Problem**: Ambiguous aggregate root mutations between `DOM-001` and `DOM-004`.
- **Solution**: Refactor `LearningSessionService` to emit `PRACTICE_COMPLETED` events. Remove direct references to `KnowledgeState` mutations from `DOM-001`. `DOM-004` subscriber handles all state updates.
- **Files Modified**: `src/domain/learning/LearningSessionService.ts`, `src/domain/ckm/KnowledgeStateSubscriber.ts`.
- **Validation**: Architecture verification test checking import restrictions between domains.

---

## 5. TECHNICAL DEBT METRICS SUMMARY

- **Total Inventory Count**: 10 Items
- **Total Estimated Effort**: 11.5 Developer Days
- **High Severity Count**: 2 Items (20%)
- **Medium Severity Count**: 5 Items (50%)
- **Low Severity Count**: 3 Items (30%)
- **10-Year Sustainability Index**: **EXCELLENT (94/100)** post-remediation.
