# EAR-1 — Competitive Architecture & Workflow Analysis

## Overview

This analysis evaluates the architectural blueprints, state management models, extension ecosystems, and AI integration patterns of ten leading productivity, developer, and knowledge platforms.

---

## Comparative Platform Matrix

| Platform | Core Storage & State Model | Sync / Network Architecture | Extension & Workflow Engine | AI Integration Pattern |
| :--- | :--- | :--- | :--- | :--- |
| **GitHub** | Relational DB + Git Object Store | Server-centric REST/GraphQL | Actions (YAML / Docker runners) | Copilot / Agentic Workspace |
| **Linear** | Local-first SQLite + IndexedDB | Real-time WebSocket sync engine | GraphQL API + Webhooks | Agentic triage & issue auto-summarization |
| **Notion** | Block-based tree structure | Client-server GraphQL | Integrations API + Webhooks | Notion AI (In-line block generation) |
| **Cursor** | Local VS Code file system | Client + Cloud RPC Agent | Extension Host API | Agentic file diffs & background codebase indexing |
| **Raycast** | Local SQLite + OS Native APIs | Client-first + Cloud extensions | Node.js / React Extension API | In-line AI commands & prompt bar |
| **Obsidian** | Local Markdown Files (.md) | LocalFirst + Optional Sync | TypeScript Plugin API | Community AI plugins (RAG over local files) |
| **Superhuman** | Local IndexedDB cache | Real-time background sync | Internal workflow rules engine | AI Drafts & Auto-summarization |
| **Mem** | Graph database | Cloud-centric REST | API Connectors | Mem X (Self-organizing graph retrieval) |
| **Fabric** | Unified spatial storage | Cloud object store | Web connectors | Auto-tagging & multimodal search |
| **Windsurf** | Local filesystem + Shadow Git | Client + Cloud Cascade Flow | Extension Host API | Cascade agentic workspace reasoning |

---

## Architectural Deep Dives & Lessons for Eliot

### 1. Linear: The Benchmark for LocalFirst Real-time Sync
- **Architectural Takeaway**: Linear uses an SQLite database in the client (via IndexedDB/WASM) that renders instantly. Changes write to a local transaction log immediately, then flush asynchronously over a WebSocket connection to a central server.
- **Application to Eliot**: Reaffirms Eliot's LocalFirst strategy. Eliot's CKM graph and Memory Engine must retain instant local write characteristics, syncing deltas in the background.

### 2. Raycast: The Benchmark for Lightweight Extensibility
- **Architectural Takeaway**: Raycast provides a React + Node.js extension API that executes locally with sub-10ms launcher response times. Extensions run in isolated processes and communicate with the core host via IPC.
- **Application to Eliot**: Eliot's workflow connectors and custom actions should follow Raycast's sandboxed extension model to allow community developers to build custom learning sources and automation blocks safely.

### 3. Cursor & Windsurf: Agentic IDE & Context Management
- **Architectural Takeaway**: These tools index entire local codebases using background vector embeddings and shadow Git trees to feed agentic loops with precise context slices.
- **Application to Eliot**: Eliot's Memory Engine and CKM already store cognitive nodes. Adopting Cursor's context-slicing approach allows Eliot's Coder and Synthesizer agents to construct optimal prompts without token overflow.

### 4. Obsidian: Uncompromising Data Ownership
- **Architectural Takeaway**: Obsidian stores plain Markdown files on local disk. Zero vendor lock-in.
- **Application to Eliot**: Eliot's Import Engine and CKM should maintain human-readable local markdown/JSON exports so users never feel locked into a proprietary database format.
