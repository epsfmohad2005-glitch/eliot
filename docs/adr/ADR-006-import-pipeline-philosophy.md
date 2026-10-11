# ADR-006: Multi-Stage Import Pipeline and Deterministic Extraction Philosophy

* **Status**: Accepted
* **Date**: 2026-08-06
* **Deciders**: Eliot Core Architecture Team & Data Ingestion Group
* **Technical Area**: Source Material Ingestion, AST Parsing, Extraction Engine

---

## Context and Problem Statement
Transforming raw, unstructured learning sources (PDF documents, Markdown folders, textbooks) into structured Cognitive Knowledge Models (CKM) is a critical entry point for Eliot. Relying solely on unstructured LLM prompting for ingestion causes hallucinated concepts, inconsistent schemas, missing prerequisites, and non-reproducible knowledge graphs.

---

## Decision Drivers
1. **Determinism & Reproducibility**: Re-importing the same source material must yield consistent structural chunks and metadata.
2. **Format Provider Extensibility**: System must cleanly support new file formats (PDF, Markdown, EPUB) through uniform interfaces.
3. **Cryptographic Integrity**: Source files must be fingerprinted using SHA-256 to detect duplicates and verify authenticity.
4. **Human Review Gatekeeping**: Ingested concepts must undergo human review before entering the active knowledge ledger.

---

## Decision Outcome
**Chosen Option**: **Multi-Stage Pipeline with Deterministic Extraction Engine**.

Source ingestion follows a strict 4-phase pipeline:
1. **Import Phase (`ImportProviderInterface`)**: Formats (`pdf-document`, `markdown-folder`) parse raw assets into structured text items and extract metadata.
2. **Deterministic Extraction (`DeterministicExtractionEngine`)**: Computes SHA-256 source fingerprints, extracts text AST headings, parses code snippets, and forms candidate concepts (CKM-C) without AI execution.
3. **Review Workspace (`dom-009-review`)**: Staging environment where the user inspects candidate concepts, edits tags, merges duplicate suggestions, and approves nodes.
4. **Knowledge Commit (`KnowledgeCommitEngine`)**: Validates graph integrity, generates a commit hash, and appends the snapshot to the immutable `KnowledgeLedger`.

```
[Raw Source File]
       │
       ▼
[Import Provider] ──► [AST Parsing & Fingerprinting]
                                │
                                ▼
                   [Deterministic Engine] ──► [Candidate Model (CKM-C)]
                                                     │
                                                     ▼
                                           [Human Review Workspace]
                                                     │
                                                     ▼
                                          [Immutable Ledger Commit]
```

### Positive Consequences
* **Deterministic Baseline**: Structure and chunking are fully reproducible without AI cost or flakiness.
* **Integrity & Security**: SHA-256 hashes safeguard against tampered or duplicate source files.
* **Human Oversight**: The user retains complete authority over what concepts enter their personal knowledge graph.

### Negative Consequences
* **Staged Onboarding**: Requires an explicit review step rather than one-click auto-ingestion.
