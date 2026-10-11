# EAR-1 — Scalability & Growth Plan

## Growth Progression Overview

Eliot is designed to scale gracefully from a single-user LocalFirst desktop/browser app up to an enterprise platform serving 100,000+ active users without re-architecting core business logic or sacrificing data privacy.

---

## 4-Stage Scaling Model

```
STAGE 1: 1 User (LocalFirst) 
   --> STAGE 2: 100 Users (P2P / Hybrid Sync)
      --> STAGE 3: 10,000 Users (Distributed Cloud Workers)
         --> STAGE 4: 100,000+ Users (Global Edge + Multi-Tenant Control Plane)
```

| Dimension | Stage 1 (1 User) | Stage 2 (100 Users) | Stage 3 (10,000 Users) | Stage 4 (100,000+ Users) |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Deployment** | Single Browser / Desktop | Self-Hosted Node / Docker | Cloud Managed Kubernetes / Cloud Run | Global Edge + Distributed Worker Fleet |
| **State Storage** | IndexedDB / SQLite WASM | SQLite / Postgres | PostgreSQL (Cloud SQL) + Redis | Multi-Region CockroachDB / Spanner + Redis Cluster |
| **Event Bus & Messaging** | In-Memory Event Bus | Local PubSub | NATS JetStream / Redis Streams | Global NATS Cluster / Apache Kafka |
| **Workflow Engine** | Embedded TS Engine | Embedded TS + Web Workers | Temporal Cluster (Go) | Temporal Multi-Region Cluster |
| **AI Processing** | Direct Provider API | Direct Provider + Local Proxy | Shared AI Proxy + Queue | Distributed AI Proxy + Rate Limit Mesh + Caching |
| **Sync Strategy** | Local Only | Encrypted CRDTs / WebSockets | Real-Time Sync Server | Edge Delta Sync + LocalFirst Rehydration |

---

## Detailed Stage Specifications

### Stage 1: Single User (LocalFirst Baseline)
- **Architecture**: 100% client-side execution. Core application runs in browser or Electron/Tauri container.
- **Storage**: IndexedDB for CKM nodes, Memory Engine embeddings, and workflow state.
- **Compute**: Web Workers process background tasks and vector calculations without blocking the UI thread.
- **Cost**: $0 infrastructure cost.

### Stage 2: Small Teams (100 Users)
- **Architecture**: Lightweight team server added for collaborative CKM graph editing and shared workflow execution.
- **Storage**: Single PostgreSQL instance with pgvector for shared embeddings.
- **Sync**: WebSockets streaming CRDT (Conflict-Free Replicated Data Types) state changes between clients.

### Stage 3: Scale-Up Growth (10,000 Users)
- **Architecture**: Decoupled control plane and execution worker nodes.
- **Task Queue**: NATS JetStream handles event dispatching and job distribution.
- **Workflow Durability**: Temporal cluster manages background jobs, retries, and scheduled tasks.
- **AI Rate Limiting**: Centralized AI Proxy manages quota distribution across providers (Gemini, Anthropic, OpenAI) with redis-backed token bucket algorithms.

### Stage 4: Enterprise Scale (100,000+ Users)
- **Architecture**: Multi-region edge deployment. Control plane runs near users; heavy AI and background worker fleets auto-scale dynamically.
- **Storage**: Multi-region database with row-level encryption and tenant isolation.
- **LocalFirst Guarantee**: Even at Stage 4, users retain full local offline capability. Cloud sync operates asynchronously in the background.
