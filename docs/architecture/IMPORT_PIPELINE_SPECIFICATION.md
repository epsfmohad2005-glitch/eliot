# IMPORT PIPELINE SPECIFICATION (RDI-1)
## Deterministic 10-Stage Knowledge Transformation Pipeline

**System Version:** 1.0.0-RDI  
**Author:** Lead Cognitive Systems Architect  
**Status:** Architecture Proposal — Awaiting Approval  

---

## 1. Pipeline Execution Model

The RDI-1 pipeline transforms raw unstructured or semi-structured media into structured CKM nodes through **10 discrete, deterministic stages**. Each stage is idempotent, observable, and independently replaceable.

```
 [1. Ingest] ──► [2. Parse] ──► [3. Normalize] ──► [4. Chunk] ──► [5. Detect Concepts]
                                                                        │
 [10. Index] ◄── [9. Schedule] ◄── [8. Evidence] ◄── [7. Missions] ◄── [6. Build Graph]
```

---

## 2. Detailed Pipeline Stages

### Stage 1: Source Ingestion & Validation
* **Input**: User-provided URL, File Blob, Folder Handle, or OAuth Payload.
* **Process**: Validates source reachability, file integrity, MIME types, and permission boundaries. Generates `SourceFingerprint` (SHA-256).
* **Output**: Validated `ImportSourceDescriptor`.

### Stage 2: Raw Asset Extraction & Parsing
* **Input**: `ImportSourceDescriptor`.
* **Process**: Invokes the provider-specific adapter to extract raw text, transcripts, code trees, image metadata, and attachments.
* **Output**: Collection of `RawAsset` objects (e.g., transcripts, source files, document pages).

### Stage 3: Structural Normalization
* **Input**: `RawAsset[]`.
* **Process**: Standardizes character encoding, strips formatting noise, extracts Markdown headers, resolves relative links, and constructs uniform document DOM trees.
* **Output**: `NormalizedDocumentTree`.

### Stage 4: Semantic Chunking
* **Input**: `NormalizedDocumentTree`.
* **Process**: Applies semantic boundary detection (paragraph clusters, AST code blocks, video timestamp markers) to create cohesive chunks of 250–750 words.
* **Output**: `SemanticChunk[]` with position anchors.

### Stage 5: Concept & Skill Identification
* **Input**: `SemanticChunk[]`.
* **Process**: Leverages hybrid NLP & AI candidate extraction to identify core concepts, technical terms, code patterns, and practical skills.
* **Output**: `CandidateConcept[]` and `CandidateSkill[]`.

### Stage 6: Dependency & Prerequisite Graph Construction
* **Input**: Candidate concepts and skills.
* **Process**: Analyzes co-occurrence, explicit references, and conceptual ordering to construct a Directed Acyclic Graph (DAG). Runs topological sorting and cyclic dependency detection.
* **Output**: Validated `PrerequisiteGraph`.

### Stage 7: Mission & Practice Generation
* **Input**: `PrerequisiteGraph` and semantic chunks.
* **Process**: Maps concepts into learning missions (Stage 1 Read, Stage 2 Practice, Stage 3 Apply) and generates interactive code/terminal workspace templates.
* **Output**: `LearningMissionTemplate[]`.

### Stage 8: Reflection & Evidence Requirement Mapping
* **Input**: Mission templates.
* **Process**: Formulates open-ended cognitive reflection prompts (non-binary) and defines verifiable evidence submission rules (SHA-256 proof, code tests, or log outputs).
* **Output**: `MissionVerificationSpec[]`.

### Stage 9: Initial Review Schedule Calculation
* **Input**: Generated concepts and evidence requirements.
* **Process**: Initializes Ebbinghaus memory stability parameters ($S_0 = 1.0$ day, initial recall probability $R = 1.0$) for each concept node.
* **Output**: `InitialReviewSchedule`.

### Stage 10: CKM Ledger Indexing
* **Input**: Complete intermediate manifest.
* **Process**: Performs an atomic commit transaction to insert concept nodes, prerequisite edges, missions, and review items into the LocalFirst CKM storage layer.
* **Output**: `ImportTransactionReceipt`.

---

## 3. Error Recovery & Resiliency

1. **Interrupted Imports**: Pipeline state is checkpointed in IndexedDB after Stage 4 and Stage 7. Resuming reuses cached chunks without re-parsing raw files.
2. **Missing Transcripts / Text**: If a YouTube video lacks closed captions, the pipeline flags the source for speech-to-text processing or falls back to video description metadata.
3. **Broken Repositories / Files**: Syntax or parse errors in individual source files are logged as non-fatal warnings; valid files continue through extraction.
4. **Duplicate Ingestion**: Re-importing a source detects the SHA-256 fingerprint and offers to perform a *delta refresh* or *overwrite update*.
