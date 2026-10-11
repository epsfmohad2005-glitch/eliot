# ELIOT PROJECT — ARCHITECTURE QUALITY SPRINT (AQS-1)
## SYSTEMIC RISK MATRIX & ARCHITECTURAL RISK ASSESSMENT

---

## 1. RISK ASSESSMENT FRAMEWORK

The **Eliot Systemic Risk Matrix** evaluates architectural, data integrity, security, operational, and evolutionary risks facing the system over a 10-year horizon.

### Risk Scoring Model
- **Impact (1–5)**: Catastrophic (5), Critical (4), Moderate (3), Minor (2), Negligible (1).
- **Probability (1–5)**: Frequent (5), Likely (4), Possible (3), Unlikely (2), Rare (1).
- **Risk Score (Impact × Probability)**: Critical Risk (20–25), High Risk (12–19), Medium Risk (6–11), Low Risk (1–5).

---

## 2. COMPREHENSIVE RISK MATRIX

| Risk ID | Risk Title | Category | Impact (1–5) | Prob (1–5) | Score | Risk Level | Mitigation Strategy | Core System Invariant |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :--- | :--- |
| **RSK-01** | Multi-Device Offline Ledger Divergence | Data Integrity / Offline | 5 | 3 | **15** | **HIGH** | Implement State-Based CRDTs (LWW-Element-Set) and Merkle Tree vector sync for SHA-256 evidence ledgers. | *Evidence ledger must form a single deterministic DAG across all nodes.* |
| **RSK-02** | Unbounded AI Evaluation API Expenses | Security / Financial | 4 | 4 | **16** | **HIGH** | Implement token rate limiters, client-side budget caps, and caching of static evaluation prompts. | *AI evaluation calls must conform to daily budget quotas per user workspace.* |
| **RSK-03** | Local Storage Encryption Breach | Security / Privacy | 4 | 3 | **12** | **HIGH** | AES-256-GCM encryption at rest for user reflections and sensitive notes using PBKDF2 derived keys. | *Zero personal reflection text stored in plaintext on disk.* |
| **RSK-04** | Latency Baseline Calibration Skew | Knowledge Model / UX | 3 | 4 | **12** | **HIGH** | Implement adaptive median response time baseline calculated per cognitive level and user profile. | *Cognitive strain score must normalize against individual median latency.* |
| **RSK-05** | Graph Dependency Cycles in Concepts | Knowledge Model / Data | 5 | 2 | **10** | **MEDIUM** | Enforce compile-time and runtime Directed Acyclic Graph (DAG) cycle validation on concept insertion. | *Concept prerequisite relationship graph must remain strictly acyclic.* |
| **RSK-06** | Event Bus Subscriber Exceptions | Architecture / Event | 3 | 3 | **9** | **MEDIUM** | Implement Dead Letter Queue (DLQ) with exponential backoff retry for asynchronous domain handlers. | *Domain events must either succeed across all subscribers or log to DLQ.* |
| **RSK-07** | Local Storage Eviction / Storage Cap | Offline / Infrastructure | 4 | 2 | **8** | **MEDIUM** | Request Persistent Storage Permission in IndexedDB; export auto-backups as encrypted JSON files. | *IndexedDB storage allocation must be explicitly declared persistent.* |
| **RSK-08** | Inconsistent Concept Mastery Weights | Domain Consistency | 3 | 2 | **6** | **MEDIUM** | Consolidate mathematical formula references into single source of truth in `CKM`. | *Concept mastery calculation must utilize exactly standard weights (0.35/0.45/0.20).* |
| **RSK-09** | UI State Leakage in Context Lock Mode | Architecture / UX | 2 | 3 | **6** | **MEDIUM** | Enforce global layout wrapper state query to suppress all non-essential navigation UI. | *When Context Lock is active, global navigation headers must not render.* |
| **RSK-10** | Third-Party Media Format Ingestion Failure | Extensibility / Asset | 2 | 3 | **6** | **MEDIUM** | Define standard `IAssetIngestionProvider` plugin architecture with schema fallback parsers. | *Asset ingestion must degrade gracefully to raw text when parser fails.* |
| **RSK-11** | Unpruned Abandoned Draft Sessions | Performance / DB | 2 | 3 | **6** | **MEDIUM** | Implement automated 30-day session pruning daemon for uncompleted draft learning sessions. | *Abandoned draft sessions older than 30 days must be automatically archived.* |
| **RSK-12** | Keyboard Accessibility Trapping Defect | Accessibility / UI | 2 | 2 | **4** | **LOW** | Wrap Context-Locked workspaces in standard WCAG 2.1 compliant focus trap components. | *Keyboard focus must remain trapped within active workspace during lock mode.* |

---

## 3. DETAILED RISK ANALYSIS & MITIGATION SPECIFICATIONS

### RSK-01: Multi-Device Offline Ledger Divergence
- **Description**: When a user operates Eliot offline across multiple client devices (e.g., laptop and tablet), concurrent modifications to `MemoryNode` decay curves and `Evidence` submission ledgers will diverge if synced later.
- **Architectural Mitigation**:
  1. For `MemoryNode` retentions, implement a state-based **LWW (Last-Write-Wins) Element-Set CRDT** keyed on UTC timestamps.
  2. For `Evidence` items, model the local ledger as an immutable **Cryptographic Directed Acyclic Graph (Merkle-DAG)** where entries reference parent hashes. Merging ledgers resolves to a simple graph union without conflicts.
- **Invariant**: *Evidence ledger must form a single deterministic DAG across all user nodes.*

---

### RSK-02: Unbounded AI Evaluation API Expenses
- **Description**: Active practice routines request real-time evaluation of user code submissions, answers, and reflections via Gemini API calls. Automated client retries or malformed loops could consume significant API quotas.
- **Architectural Mitigation**:
  1. Implement `AIEvaluationRateLimiter` middleware enforcing a hard limit of maximum 30 evaluation requests per hour per user.
  2. Cache evaluation responses for identical evidence payloads using SHA-256 hash lookup.
- **Invariant**: *AI evaluation calls must conform to daily budget quotas per user workspace.*

---

### RSK-03: Local Storage Encryption Breach
- **Description**: Eliot stores user reflections, notes, and session logs in browser IndexedDB. On shared hardware or unencrypted disks, raw personal reflections could be inspected.
- **Architectural Mitigation**:
  1. Encrypt all text fields in `Note`, `Reflection`, and `Evidence` entities before writing to IndexedDB using AES-256-GCM.
  2. Derive encryption keys from user master passcode via PBKDF2 with 600,000 iterations.
- **Invariant**: *Zero personal reflection text stored in plaintext on disk.*

---

### RSK-04: Latency Baseline Calibration Skew
- **Description**: `KNOWLEDGE_GAP_ANALYSIS.md` flags high cognitive strain if response latency $T_{\text{response}} > 2.5 \times T_{\text{baseline}}$. If $T_{\text{baseline}}$ is hardcoded globally, fast or slow typists will experience inaccurate gap detection.
- **Architectural Mitigation**:
  1. Calculate dynamic baseline $T_{\text{baseline}}$ using the 10-sample rolling median response time per user, per cognitive taxonomy level (`Remember`, `Apply`, `Create`).
- **Invariant**: *Cognitive strain score must normalize against individual median latency.*

---

### RSK-05: Graph Dependency Cycles in Concepts
- **Description**: Manual or automated ingestion of Concept prerequisite dependencies (`Concept A -> Concept B -> Concept A`) creates infinite recursion loops during prerequisite checks.
- **Architectural Mitigation**:
  1. Execute Tarjan’s Strongly Connected Components algorithm upon every `Prerequisite` insertion to reject any edge creation that introduces a cycle.
- **Invariant**: *Concept prerequisite relationship graph must remain strictly acyclic.*

---

## 4. SYSTEM RISK HEATMAP SUMMARY

```
                  IMPACT
          Negligible Minor  Moderate  Critical Catastrophic
          (1)        (2)    (3)       (4)      (5)
        ┌───────────┬──────┬─────────┬────────┬───────────┐
Frequent│           │      │         │ RSK-02 │           │
  (5)   ├───────────┼──────┼─────────┼────────┼───────────┤
Likely  │           │      │ RSK-04  │        │           │
  (4)   ├───────────┼──────┼─────────┼────────┼───────────┤
Possible│           │RSK-09│ RSK-06  │ RSK-03 │  RSK-01   │
  (3)   │           │RSK-10│ RSK-08  │ RSK-07 │           │
        │           │RSK-11│         │        │           │
        ├───────────┼──────┼─────────┼────────┼───────────┤
Unlikely│           │RSK-12│         │        │  RSK-05   │
  (2)   ├───────────┼──────┼─────────┼────────┼───────────┤
Rare    │           │      │         │        │           │
  (1)   └───────────┴──────┴─────────┴────────┴───────────┘
```
