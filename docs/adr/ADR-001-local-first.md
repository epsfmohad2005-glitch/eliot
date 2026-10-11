# ADR-001: Local-First Data Architecture & Persistence Strategy

* **Status**: Accepted
* **Date**: 2026-08-06
* **Deciders**: Eliot Core Architecture Team
* **Technical Area**: Storage, State Management, Data Sovereignty

---

## Context and Problem Statement
Traditional learning management platforms and educational tools depend heavily on cloud-hosted databases, requiring active internet connectivity and user account creation before providing value. This introduces network latency, privacy concerns regarding personal cognitive history, and potential data lock-in. 

For a Personal Learning Operating System (PLOS) designed for deep workstation focus, we require an architecture that guarantees zero latency, privacy by default, offline functionality, and complete user ownership of historical evidence and learning artifacts.

---

## Decision Drivers
1. **User Sovereignty & Privacy**: Learning progress, reflections, and historical mistakes are deeply sensitive personal cognitive data.
2. **Instant Operational Responsiveness**: Workspace navigation and practice interactions must respond in <16ms without network round-trip overhead.
3. **Offline Continuity**: The user must be able to study, reflect, and complete exercises during offline periods.
4. **Resilience & Simplicity**: Eliminating complex remote database synchronization and auth server infrastructure for single-user core loops.

---

## Considered Options
1. **Cloud-First SaaS Architecture** (PostgreSQL/Firebase + Remote Auth)
2. **Hybrid Cloud Sync** (Remote database with local cache fallback)
3. **Local-First Architecture** (In-memory reactive state + LocalStorage / IndexedDB persistence with optional cryptographic backup exports)

---

## Decision Outcome
**Chosen Option**: **Option 3 — Local-First Architecture**.

Eliot stores all active knowledge models, memory decay states, evidence artifacts, and user preferences locally within browser/runtime storage. The `KnowledgeLedger` records immutable cryptographic commit snapshots locally.

### Positive Consequences
* **Zero Network Latency**: UI state updates instantly without awaiting server HTTP responses.
* **Complete Privacy**: Sensitive reflections and evidence remain strictly on the user's machine.
* **Offline First**: All 8 stages of the learning lifecycle run seamlessly without an active internet connection.
* **Simplified Infrastructure**: Zero backend database maintenance or user account management complexity for core operations.

### Negative Consequences
* **Multi-Device Sync Complexity**: Syncing state across multiple physical devices requires manual export/import or custom encrypted sync adapters.
* **Storage Capacity Floor**: Browser local storage quotas (~5MB–50MB depending on storage engine) require structured JSON serialization and periodic evidence cleanup.

---

## Compliance & Enforcement
All domain services (`dom-001` through `dom-012`) must read and write state via local reactive memory stores or local storage adapters. Remote network calls are strictly restricted to optional LLM inference services or manual export triggers.
