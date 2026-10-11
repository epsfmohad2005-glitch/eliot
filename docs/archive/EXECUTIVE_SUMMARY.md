# EAR-1 — Executive Summary: Eliot Architecture Research

## Vision & Strategic Direction

Eliot is transitioning from a **Personal Learning Operating System (PLOS)** into a unified **AI + Automation Orchestration Platform**. The goal is to allow individuals and teams to orchestrate learning, cognitive synthesis, automated workflows, multi-agent AI execution, and external tool integrations while preserving Eliot's core design principles: **LocalFirst privacy, low-latency responsiveness, cognitive clarity (Focus Environment), and modular extensible design.**

---

## Strategic Research Summary

Our research evaluated workflow automation engines, AI orchestration frameworks, integration patterns, security models, scalability paths, and competitive architectures.

### Key Architectural Choices

1. **Automation Engine**: **Hybrid Custom Lightweight Event-Driven Engine + Temporal Bridge**
   - *LocalFirst Desktop/Browser*: Embed a light, deterministic, async state-machine engine directly in Eliot Core (leveraging the existing Event Bus, CKM, and Memory Engine).
   - *Cloud/Scale*: Bridge to **Temporal** for durable, fault-tolerant, long-running workflow execution across distributed node clusters.

2. **AI Orchestration**: **Multi-Provider Router + LangGraph / Antigravity Agent Runtime Integration**
   - Unified abstraction layer for Google Gemini, OpenAI, Anthropic Claude, NotebookLM, GitHub Copilot, and custom local models (Ollama/vLLM).
   - State graph-based agent loops using DAG structures for multi-step reasoning, tool execution, human-in-the-loop (HITL) pause points, and streaming state updates.

3. **Integration Architecture**: **Decoupled Gateway & Adapter Model**
   - Standardized connector schema for OAuth2/API Key authentication covering GitHub, Google Workspace (Drive, Gmail, Calendar), Chat Platforms (Telegram, Discord, Slack), and IDE extensions (VS Code, Cursor).

4. **Security Architecture**: **Zero-Trust Local Encryption + KMS Vault**
   - End-to-end encrypted storage for API keys and tokens locally (AES-256-GCM / Web Crypto) with Cloud KMS fallback for cloud sync, strict least-privilege scoping, and tamper-evident audit logging.

5. **LocalFirst & Scalability Boundary**:
   - Single-user mode runs 100% locally with IndexedDB / SQLite / WASM.
   - Scale-out mode leverages serverless control planes, NATS / Redis PubSub messaging, and worker pools handling up to 100,000+ concurrent users without compromising data sovereignty.

---

## Evaluation of Primary Alternatives

| Option | Recommendation | Primary Rationale |
| :--- | :--- | :--- |
| **n8n as Core Engine** | *Rejected for Core, Allowed as External Node* | Heavy Node.js footprint, weak TypeScript SDK embedding, not suitable for LocalFirst browser/embedded execution. |
| **Temporal as Core Engine** | *Adopted for Cloud Orchestration* | Unmatched state durability and event-sourcing model; requires a worker cluster so bridged for cloud mode. |
| **LangGraph as AI Engine** | *Adopted for Agent State Graphs* | Exceptional state graph primitives, clear HITL support, native TypeScript/Python support. |
| **Custom Eliot Engine** | *Adopted for Embedded LocalFirst* | Lightweight (<15KB overhead), zero external service dependency, natively binds to Eliot Event Bus and CKM. |

---

## Architectural Preservation Guarantee

This research preserves Eliot's existing frozen foundation:
- **CKM (Cognitive Knowledge Model)**: Serves as the primary semantic graph for workflow inputs/outputs.
- **Memory Engine**: Supplies contextual working memory and vector indices for AI agents.
- **Import Engine**: Acts as the ingest pipeline for workflow sources.
- **Event Bus**: Form the primary reactivity loop across the client and workers.
- **Focus Environment**: Serves as the distraction-free UI canvas for human approval and active agent monitoring.
