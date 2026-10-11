# REAL DATA INTEGRATION ARCHITECTURE (RDI-1)
## The "Import Anything Engine" Specification

**System Version:** 1.0.0-RDI  
**Author:** Lead Cognitive Systems Architect  
**Status:** Architecture Proposal — Awaiting Approval  

---

## 1. Vision & Core Philosophy

The **Import Anything Engine (RDI-1)** eliminates the artificial friction between raw human knowledge and structured cognitive learning. Users do not think in file extensions, MIME types, or course syllabi; they simply state:

> *"I want to learn this."*

### The Core Architectural Law
> **"Never import Courses. Never import Lessons. Import Knowledge. Everything else is derived."**

Eliot treats all incoming assets—whether a 50-page PDF, a GitHub repository, a YouTube playlist, or a NotebookLM export—as raw semantic media. The RDI-1 pipeline ingests raw media, extracts atomic concepts, constructs dependency graphs, and derives personalized learning missions, practice challenges, and spaced-repetition memory review schedules.

---

## 2. High-Level Subsystem Architecture

The Import Engine operates as an isolated, pluggable subsystem placed directly in front of the **Cognitive Knowledge Model (CKM)** and **Cognitive Decision Engine (CDE)**.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          RAW IMPORT SOURCES (v1)                            │
│  [YouTube]  [PDF/EPUB]  [GitHub/ZIP]  [Web Docs]  [NotebookLM]  [Markdown]   │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      1. IMPORT PROVIDER LAYER (IPL)                         │
│  • Pluggable Provider Registry (`ImportProvider` interface)                │
│  • Validation, Source Metadata, Asset Enumeration, Local Hashing            │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │ Raw Extracted Assets
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                   2. KNOWLEDGE EXTRACTION LAYER (KEL)                       │
│  • Structural Normalization (Text, Code, Glossaries, Links)                 │
│  • Deterministic Semantic Chunking & Code AST Parsing                       │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │ Normalized Semantic Chunks
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     3. CKM MAPPING & AI VALIDATOR                           │
│  • Concept & Skill Candidate Generation                                    │
│  • Deterministic Schema Validation & Cyclic Dependency Guards               │
│  • Mapping into CKM Atomic Nodes, Dependencies, and Prerequisites           │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │ CKM Graph Structures
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    4. MISSION GENERATOR & SCHEDULER                         │
│  • Mission Generation (Reading, Practice, Reflection, Evidence)             │
│  • Initial Memory Review Schedule Calculation (Ebbinghaus S/R)               │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │ Immutable CKM Mutations
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                   COGNITIVE KNOWLEDGE MODEL (CKM) LEDGER                    │
│                        LocalFirst Persistent Storage                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Subsystem Boundaries & Security Principles

1. **Isolation Boundary**: Import providers have zero write access to CKM or CDE. They emit standardized intermediate representations (`ExtractedAsset[]`, `SemanticChunk[]`).
2. **LocalFirst Security & Sandboxing**: All binary parsing (PDFs, EPUBs, ZIP archives) occurs inside client-side Web Workers or sandboxed WebAssembly containers. Zero binary payloads are sent to third-party servers.
3. **Deterministic AI Boundaries**: AI services (Gemini/Antigravity) are strictly restricted to *candidate extraction* (suggesting concept titles, difficulty estimates, and relationships). All AI outputs pass through deterministic JSON schema validators, string sanitizers, and DAG cycle-detection algorithms before being committed to CKM.
4. **Content Deduplication**: Ingested sources generate a cryptographic SHA-256 fingerprint. Re-importing identical files or URLs updates metadata without duplicating storage nodes.

---

## 4. Derived Artifacts

From a single raw source ingestion, RDI-1 automatically derives:
* **Atomic Concept Nodes**: Discrete units of knowledge (`ConceptNode`).
* **Prerequisite Directed Acyclic Graph (DAG)**: Strict topological ordering of concepts.
* **Practice Challenge Templates**: Code snippets, terminal commands, or conceptual questions.
* **Metacognitive Reflection Prompts**: Open-ended synthesis questions.
* **Evidence Requirements**: Defined artifact proofs required for stage completion.
* **Spaced Repetition Review Queue**: Initial memory stability $S$ and review intervals $R(t)$.
