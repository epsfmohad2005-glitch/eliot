# EAR-1 — Automation & Workflow Engine Research

## Comparative Analysis Matrix

| Engine | Execution Model | Embeddability in LocalFirst | State Durability | AI Agent Native Support | Developer Experience | License |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **n8n** | Node.js Process / REST | Low (Heavy server) | High (Postgres/SQLite) | Medium (LangChain nodes) | High (Visual UI) | Sustainable Use (FairCode) |
| **Activepieces** | Node.js / Docker | Medium | High (Postgres) | Medium (Built-in AI pieces) | High (Visual/Code) | MIT |
| **Trigger.dev** | Serverless / Node.js | Low (Cloud/Docker) | Very High (Postgres/Redis) | High (v3 background tasks) | High (Pure TS code) | Apache 2.0 |
| **Temporal** | Go Engine / TS SDK | Low (Requires cluster) | Maximum (Event Sourcing) | High (Deterministic loops) | High (Code-first) | MIT |
| **Windmill** | Rust Backend / JS/Py | Medium (Docker) | High (Postgres) | Medium | High (Code + UI) | AGPLv3 / Enterprise |
| **Kestra** | Java / Plugin Architecture | Low (JVM container) | High (Postgres/Kafka) | Medium (Declarative YAML) | High (YAML + UI) | Apache 2.0 |
| **Pipedream** | Cloud Serverless | Zero (Proprietary Cloud) | High | High | High (JS/Python) | Proprietary |
| **LangGraph** | JS/TS & Python Graph | High (Light library) | High (Memory/DB Checkpointers) | Maximum (Built for AI Agents) | High (Code) | MIT |
| **Custom Engine** | TS Event Bus + IndexedDB | Maximum (Native) | High (LocalFirst IndexedDB) | Native to Eliot CKM | Maximum (Native TS) | Native |

---

## Detailed Evaluation of Evaluated Systems

### 1. n8n
- **Overview**: FairCode workflow automation platform with a visual node editor and 400+ integrations.
- **Advantages**: Rich library of pre-built triggers and actions; visual debugging UI; strong community.
- **Disadvantages**: Heavy Node.js process with direct DB coupling; difficult to embed directly into a LocalFirst browser runtime; licensing restrictions for commercial redistribution.
- **Verdict**: **Rejected for Core Core Engine.** Suitable only as an optional external webhook connector bridge.

### 2. Temporal
- **Overview**: Code-first durable execution engine using event sourcing to guarantee workflow execution despite crashes or network failures.
- **Advantages**: Industry standard for fault tolerance; deterministic replay; robust SDK in TypeScript; seamless handling of long-running sleeping workflows (days/months).
- **Disadvantages**: Requires running the Temporal Server cluster (Go + DB); high infrastructure complexity for desktop/local-only single-user deployments.
- **Verdict**: **Adopted as the Cloud Scale/Enterprise Orchestration Backend.**

### 3. Trigger.dev (v3)
- **Overview**: TypeScript-first background task engine built on OpenTelemetry.
- **Advantages**: Excellent developer experience with zero cold starts and long-running background task execution.
- **Disadvantages**: Heavily optimized for Node.js serverless runtimes; not runnable in browser WASM/Web Worker environments.
- **Verdict**: **Evaluated as alternative cloud task runner.**

### 4. LangGraph (JS/TS)
- **Overview**: Framework for building stateful, multi-actor applications with LLMs using graph structures.
- **Advantages**: Native human-in-the-loop (HITL) pause/resume points; built-in checkpointers (Memory, Postgres, IndexedDB); lightweight JavaScript execution runtime.
- **Disadvantages**: Optimized for agent decision graphs rather than arbitrary multi-system ETL/webhooks.
- **Verdict**: **Adopted for AI Agent State Graphs & Multi-Agent Loops.**

### 5. Custom Eliot Embedded Workflow Engine
- **Overview**: Lightweight TypeScript state-machine engine built directly on top of the existing Eliot Event Bus, CKM, and LocalFirst IndexedDB storage.
- **Advantages**: 100% LocalFirst compatible; zero external container dependencies; instant startup in browser/desktop; native bindings to Focus Mode and Memory Engine.
- **Disadvantages**: Must implement custom retry logic and persistence durability primitives.
- **Verdict**: **Adopted for Eliot LocalFirst Desktop Runtime.**

---

## Strategic Recommendation: Hybrid Automation Architecture

Eliot will adopt a **Dual-Tier Hybrid Workflow Architecture**:

1. **Embedded Tier (LocalFirst Single-User / Desktop)**:
   - Powered by a **Custom Lightweight Event-Driven Engine** embedded in `@eliot/core`.
   - Uses **LangGraph JS** for complex multi-step AI reasoning loops.
   - States are persisted directly in IndexedDB/SQLite via the Eliot Memory Engine.

2. **Cloud/Scale Tier (Multi-User / Enterprise)**:
   - Powered by **Temporal** for durable background jobs, schedule executions, and multi-tenant task distribution.
   - Connects to the LocalFirst tier via encrypted bidirectional sync (NATS/WebSockets).
