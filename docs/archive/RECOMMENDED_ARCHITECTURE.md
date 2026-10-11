# EAR-1 — Recommended Target Architecture

## Architectural Vision

The recommended architecture evolves Eliot into a **Modular Hybrid AI + Automation Platform** while honoring and preserving all frozen foundation components.

---

## High-Level System Architecture Blueprint

```
+-----------------------------------------------------------------------------------+
|                                ELIOT APPSHELL                                     |
|  [Focus Environment] | [CKM Graph Surface] | [Workspace] | [Theme Engine]          |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                             ELIOT CORE EVENT BUS                                  |
+-----------------------------------------------------------------------------------+
       |                                  |                                  |
       v                                  v                                  v
+-----------------------+      +-----------------------+      +---------------------+
|  CKM & Memory Engine  |      | Embedded TS Workflow  |      | Multi-Model AI      |
|  (LocalFirst Ingest)  |      | State Engine          |      | Router              |
+-----------------------+      +-----------------------+      +---------------------+
       |                                  |                                  |
       +----------------------------------+----------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                      PERSISTENCE & SYNC BOUNDARY                                  |
|   LocalFirst: IndexedDB / SQLite WASM  <--->  Cloud Sync: NATS / Temporal         |
+-----------------------------------------------------------------------------------+
```

---

## Detailed Component Specifications

### 1. Integration with Frozen Eliot Core Systems

- **CKM (Cognitive Knowledge Model)**:
  - Serves as the primary domain data model. Workflows produce CKM nodes; AI agents query CKM concept graphs for context.

- **Memory Engine**:
  - Provides local vector search and embedding indexes used by the AI Router for RAG (Retrieval-Augmented Generation).

- **Import Engine**:
  - Serves as the ingest adapter for external workflow inputs (GitHub repos, PDFs, Google Drive files).

- **Event Bus**:
  - Acts as the central pub/sub mechanism linking UI interactions, background workflow triggers, and live agent streams.

- **Focus Environment (AE-1A / AE-1A.1)**:
  - Serves as the dedicated, distraction-free interface during active agent execution, human approval prompts, and practice sessions.

---

## Rationale & Trade-Off Analysis

### Selected Architecture: Hybrid Modular Engine
- **Advantages**:
  - 100% LocalFirst capability maintained for single users.
  - Zero lock-in to heavy cloud backend infrastructure.
  - Seamless scale-out to Temporal & Cloud KMS when team or enterprise features are enabled.
  - High resilience against network outages and third-party API downtime.
- **Disadvantages**:
  - Requires maintaining two execution backends (Embedded TS Engine for LocalFirst, Temporal for Cloud).
- **Rejected Alternatives**:
  - *Pure n8n Engine*: Rejected due to heavy process overhead and lack of LocalFirst browser support.
  - *Pure Cloud Temporal*: Rejected because single-user offline desktop execution would fail without an active server connection.

---

## Migration Strategy & Backward Compatibility

1. **Zero Breaking Schema Changes**:
   - CKM node formats and Memory Engine storage structures remain 100% backward compatible.
2. **Incremental Package Rollout**:
   - New functionality introduced via modular packages (`@eliot/workflow`, `@eliot/ai-router`, `@eliot/connectors`) that register directly with the existing `EventBus`.

---

# IF I WERE BUILDING ELIOT TODAY

If I were building Eliot today as an AI + Automation Orchestration Platform, I would choose the following definitive architecture:

### 1. System Architecture
A **LocalFirst Hybrid Monorepo** (`@eliot/core`, `@eliot/workflow`, `@eliot/ai-router`, `@eliot/connectors`, `@eliot/ui`). The client application runs in the browser or desktop (Tauri/Electron) as an offline-capable LocalFirst app that connects seamlessly to an optional, lightweight Cloud Control Plane for multi-device sync, heavy background execution, and team collaboration.

### 2. Workflow Engine Choice
A **Dual-Tier Hybrid Workflow Architecture**:
- **Local Runtime**: Embedded TypeScript State Machine Engine running on Web Workers and IndexedDB/SQLite WASM, using **LangGraph JS** for agentic reasoning loops.
- **Cloud/Scale Runtime**: **Temporal** cluster for durable, distributed, long-running workflow executions, retries, and scheduled cron jobs.

### 3. AI Provider Architecture
A **Multi-Provider AI Router (`@eliot/ai-router`)** with:
- **Primary Fast Inference & Multimodal**: Google Gemini (Flash 2.5 & Pro 1.5) with full 2M CKM context windows.
- **Complex Code & Synthesis**: Anthropic Claude 3.5 Sonnet with prompt caching.
- **Local Offline Inference**: Local Ollama / vLLM integration for offline privacy-first execution.
- **Circuit Breaker**: Automatic rate-limit tracking, exponential backoff, and dynamic fallback routing.

### 4. Integration Architecture
An **Isolated Connector Gateway (`@eliot/connectors`)**:
- Standardized `NormalizedExternalEvent` contract across GitHub, Google Workspace (Drive, Gmail, Calendar), Telegram, Discord, Slack, and VS Code / Cursor.
- Conditional HTTP polling fallbacks for desktop runtimes + Webhook ingestion gateways for cloud runtimes.

### 5. Security Model
A **Zero-Trust Client-Side Vault**:
- Secrets encrypted locally using **AES-256-GCM** via Web Crypto API with keys derived via PBKDF2 / OS Keychain.
- Envelope encryption using GCP/AWS KMS for cloud deployments.
- Strict OAuth 2.0 PKCE with minimal, granular scopes and sandboxed Web Worker / microVM code execution.

### 6. LocalFirst / Cloud Boundary
- **100% Local Operations**: All CKM node creation, Memory Engine indexing, and simple workflow steps run locally on device.
- **Asynchronous Cloud Delta Sync**: Real-time CRDT / NATS JetStream sync for multi-device synchronization and team workflows.

### 7. Event Architecture
An **Event-Sourced Reactive Bus**:
- Core events (`CKM_NODE_CREATED`, `WORKFLOW_STEP_COMPLETED`, `AGENT_TOOL_EXECUTED`) emit through `@eliot/core` Event Bus.
- Every state transition generates an immutable, tamper-evident audit log event.

### 8. Migration Strategy
- **Phase 0**: Freeze core CKM, Memory Engine, Import Engine, and Focus Environment.
- **Phase 1**: Expose event hooks on `@eliot/core` Event Bus.
- **Phase 2**: Mount `@eliot/workflow` and `@eliot/ai-router` as opt-in background workers without modifying existing UI state.

### 9. First 5 Implementation Sprints
1. **Sprint 1 — Core Event Bus & Embedded Engine**: Build `@eliot/workflow` embedded state machine with IndexedDB durability.
2. **Sprint 2 — Multi-Model AI Router & LangGraph**: Build `@eliot/ai-router` supporting Gemini, Claude, and local Ollama with HITL approval nodes.
3. **Sprint 3 — Security Vault & Connectors**: Build AES-256-GCM vault and connectors for GitHub, Google Workspace, and Telegram.
4. **Sprint 4 — Temporal Cloud Bridge & Sync**: Deploy Temporal cluster and NATS JetStream for scale-out execution.
5. **Sprint 5 — Focus Environment UI Integration**: Integrate agent thinking streams and workflow control into Focus Bar with E2E testing.

