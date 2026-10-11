# KNOWLEDGE EXTRACTION & CKM MAPPING SPECIFICATION (RDI-1)
## Provider-Independent Normalization & AI Validation Boundary

**System Version:** 1.0.0-RDI  
**Author:** Lead Cognitive Systems Architect  
**Status:** Architecture Proposal — Awaiting Approval  

---

## 1. Provider-Independent Extraction Layer (KEL)

The **Knowledge Extraction Layer (KEL)** consumes heterogeneous `ExtractedAsset` outputs from any provider and converts them into standardized, semantic text chunks.

### Core Extraction Pipeline:
1. **Text Normalization**: Strips HTML noise, standardizes UTF-8 unicode normalization, handles double-byte characters, and unifies whitespace.
2. **Heading Hierarchy Extraction**: Parses Markdown `#`, `##`, `###` or PDF font-size deltas into a hierarchical tree (`SectionNode`).
3. **Code AST Extraction**: Isolates embedded code blocks, identifies programming languages, and extracts exported function signatures and type interfaces.
4. **Link & Glossary Extraction**: Identifies inline links, technical definitions, acronyms, and inline references.
5. **Deterministic Semantic Chunking**:
   * Minimum chunk size: 200 words.
   * Maximum chunk size: 800 words.
   * Overlap margin: 50 words to prevent concept truncation across chunk boundaries.

---

## 2. CKM Mapping Layer

Normalized semantic chunks are mapped into native CKM entities:

| Extracted Semantic Entity | CKM Target Entity | Mapping Rule / Business Logic |
| :--- | :--- | :--- |
| Core Subject / Topic | `ConceptNode` | Mapped to atomic concepts with unique UUIDs. |
| Practical Operation | `SkillNode` | Mapped to actionable skills in Zone C (Practice Workspace). |
| Sequential Dependency | `PrerequisiteEdge` | Directed edge `Concept_A ──► Concept_B`. |
| Code Example / Spec | `WorkspaceTemplate` | Converted into runnable TS / Bash / Git templates. |
| Key Definition | `ReflectionPrompt` | Formulated into open-ended cognitive synthesis questions. |
| Execution Output / Proof | `EvidenceRequirement` | Formulated into SHA-256 hash or test artifact specs. |

---

## 3. AI Integration & Deterministic Validation Boundary

To ensure systemic safety, stability, and zero hallucinations in the cognitive graph, AI services operate strictly under deterministic validation rules.

```
 ┌────────────────┐         ┌───────────────────────────────┐
 │                │  Prompt  │                               │
 │ Raw Chunks     ├─────────►│  AI Model (Gemini Candidate)  │
 │                │          │                               │
 └────────────────┘          └──────────────┬────────────────┘
                                            │ Candidate JSON
                                            ▼
                             ┌───────────────────────────────┐
                             │ DETERMINISTIC VALIDATOR       │
                             │ • Zod Schema Check            │
                             │ • Cycle Guard (Tarjan's DAG)  │
                             │ • String Sanitizer            │
                             │ • Duplicate Key Discarder     │
                             └──────────────┬────────────────┘
                                            │ Validated JSON
                                            ▼
                             ┌───────────────────────────────┐
                             │  CKM Ledger Transaction       │
                             └───────────────────────────────┘
```

### Deterministic Validation Rules
1. **Schema Integrity**: AI candidate outputs MUST match exact Zod schemas for `ConceptNode` and `PrerequisiteEdge`. Any malformed output is automatically discarded or retried.
2. **Cyclic Dependency Guard**: The prerequisite builder executes Tarjan's Strongly Connected Components algorithm on candidate edges. If a cycle is detected (e.g., $A \rightarrow B \rightarrow C \rightarrow A$), the offending edge with the lowest confidence score is automatically pruned.
3. **No Direct Writes**: AI outputs are returned as uncommitted *candidate manifests*. They are only written to CKM when validated by the deterministic validator.
