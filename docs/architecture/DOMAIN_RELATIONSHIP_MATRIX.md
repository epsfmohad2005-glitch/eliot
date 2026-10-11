# ELIOT: DOMAIN RELATIONSHIP MATRIX & CONTRACT SPECIFICATION
**Document Version:** 1.0  
**Phase:** Phase 3 — Canonical Domain Definition (CDD)  
**Author:** Chief Systems Architect  
**Status:** Permanent Conceptual Specification (Implementation Strictly Forbidden)  

---

## EXECUTIVE SUMMARY

This document defines the interaction contracts, producer/consumer flows, event subscription channels, and data ownership boundaries between all 12 canonical domains comprising the **Eliot Personal Learning Operating System (PLOS)**.

The relationship matrix guarantees that no domain breaches its non-responsibilities, no circular dependencies occur, and all cross-domain data mutations are executed strictly via asynchronous domain events and explicit contract queries.

---

## 1. COMPREHENSIVE DOMAIN INTERACTION MATRIX

The following matrix maps interaction dependencies across all 12 domains.  
- **P** = Producer (Originates events or data consumed by the target domain)
- **C** = Consumer (Consumes events or queries data from the source domain)
- **R** = Reference Only (Reads immutable metadata without mutation)
- **--** = No Direct Interaction

| Source Domain \ Target Domain | DOM-001 Learning | DOM-002 Memory | DOM-003 Knowledge | DOM-004 AI Core | DOM-005 Project | DOM-006 Career | DOM-007 Dashboard | DOM-008 Navigation | DOM-009 Review | DOM-010 Settings | DOM-011 Evidence | DOM-012 Analytics |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **DOM-001 Learning** | -- | P | R | P | P | -- | P | P | P | -- | P | P |
| **DOM-002 Memory** | C | -- | R | P | C | P | C | -- | P | -- | R | P |
| **DOM-003 Knowledge** | R | R | -- | R | R | R | -- | -- | R | -- | -- | R |
| **DOM-004 AI Core** | C | C | R | -- | C | -- | P | -- | P | R | C | -- |
| **DOM-005 Project** | C | P | R | P | -- | P | P | P | P | -- | P | P |
| **DOM-006 Career** | P | C | R | -- | P | -- | P | -- | -- | R | -- | P |
| **DOM-007 Dashboard** | C | -- | -- | C | C | C | -- | P | C | P | P | C |
| **DOM-008 Navigation** | -- | -- | -- | -- | -- | -- | P | -- | -- | -- | -- | -- |
| **DOM-009 Review** | P | P | R | C | P | -- | P | -- | -- | -- | C | P |
| **DOM-010 Settings** | R | -- | -- | R | -- | P | P | -- | -- | -- | -- | -- |
| **DOM-011 Evidence** | -- | P | -- | C | C | -- | -- | -- | P | -- | -- | P |
| **DOM-012 Analytics** | -- | -- | -- | -- | -- | -- | P | -- | -- | -- | -- | -- |

---

## 2. PRODUCER / CONSUMER EVENT SUBSCRIPTION CONTRACTS

### 2.1 Event Subscription Pipeline

```
+---------------------------------------------------------------------------------------+
|                               EVENT SUBSCRIPTION PIPELINE                             |
+---------------------------------------------------------------------------------------+
| PRODUCER EVENT                --> SUBSCRIBING DOMAINS (CONSUMERS)                     |
+---------------------------------------------------------------------------------------+
| DOM-001: StageGateRequested   --> DOM-009: Review Domain                              |
| DOM-001: StageGatePassed      --> DOM-002: Memory, DOM-012: Analytics, DOM-007: Dash |
| DOM-005: MilestoneSubmitted   --> DOM-011: Evidence, DOM-009: Review Domain           |
| DOM-009: VerdictRendered      --> DOM-001: Learning, DOM-002: Memory, DOM-005: Proj  |
| DOM-002: MemoryItemCreated    --> DOM-004: AI Core, DOM-006: Career Domain            |
| DOM-011: ArtifactRegistered   --> DOM-009: Review, DOM-002: Memory Domain             |
+---------------------------------------------------------------------------------------+
```

### 2.2 Contract Specifications

#### CONTRACT-01: Learning Stage Gate Verification
- **Producer:** `DOM-001: Learning Domain`
- **Consumers:** `DOM-009: Review Domain`, `DOM-011: Evidence Domain`
- **Event Name:** `StageGateRequested`
- **Payload Contract:**
  - `unit_id`: ID of the active LearningUnit
  - `stage_number`: Target stage (1 to 8)
  - `artifact_ref`: ID of submitted evidence artifact from `DOM-011`
  - `user_reflection`: Text content of Stage 5 reflection entry
- **Guarantees:** `DOM-001` halts stage progression until `DOM-009` publishes a `VerdictRendered` event.

#### CONTRACT-02: Review Verdict Dispatch
- **Producer:** `DOM-009: Review Domain`
- **Consumers:** `DOM-001: Learning Domain`, `DOM-002: Memory Domain`, `DOM-005: Project Domain`
- **Event Name:** `VerdictRendered`
- **Payload Contract:**
  - `submission_id`: ID of evaluated submission
  - `verdict_status`: Enum (`Approved`, `Revision Required`)
  - `diagnostic_critique`: Structured feedback string
  - `corrective_steps`: Array of required fix tasks (if revision required)
  - `rubric_scores`: Detailed points against evaluation criteria
- **Guarantees:** `DOM-001` opens the next stage gate ONLY if `verdict_status == Approved`.

#### CONTRACT-03: Memory Context Retrieval
- **Producer:** `DOM-002: Memory Domain`
- **Consumer:** `DOM-004: AI Core Domain`
- **Query Type:** Synchronous Contract Read
- **Input Contract:**
  - `concept_ids`: Array of active ConceptNode IDs
  - `user_id`: Single user identifier
  - `max_context_items`: Context budget cap
- **Output Contract:**
  - `historical_mistakes`: Array of relevant past error patterns
  - `proven_strengths`: Array of verified skill proficiencies
  - `confidence_scores`: Map of concept IDs to decay-adjusted confidence values

#### CONTRACT-04: Evidence Artifact Registration
- **Producer:** `DOM-007: Dashboard Domain` / `DOM-005: Project Domain`
- **Consumer:** `DOM-011: Evidence Domain`
- **Event Name:** `EvidenceArtifactRegistered`
- **Payload Contract:**
  - `artifact_id`: Unique immutable artifact hash identifier
  - `content_payload`: Raw submission file, code blob, or document content
  - `metadata`: Timestamp, file type, byte size, author signature
- **Guarantees:** Artifact is assigned an immutable hash ID before any review evaluation begins.

---

## 3. DATA OWNERSHIP & BOUNDARY MATRIX

To eliminate data ambiguity and multi-owner race conditions, every core conceptual entity in Eliot is assigned an **Exclusive Single Owner Domain**:

| Entity / Concept | Exclusive Owner Domain | Read Access Allowed | Mutation Allowed By |
|---|---|---|---|
| `LearningPath` / `LearningStage` | `DOM-001: Learning` | Dashboard, Analytics, AI Core | `DOM-001` ONLY |
| `MemoryItem` / `MistakePattern` | `DOM-002: Memory` | AI Core, Career, Analytics | `DOM-002` ONLY |
| `ConceptNode` / `SkillNode` | `DOM-003: Knowledge` | All Domains | Administrative Config ONLY |
| `ReasoningContext` / `PromptSpec` | `DOM-004: AI Core` | Review Domain | `DOM-004` ONLY |
| `ProjectSpec` / `Milestone` | `DOM-005: Project` | Dashboard, Learning, Review | `DOM-005` ONLY |
| `CareerRoleProfile` / `GapAnalysis` | `DOM-006: Career` | Dashboard, Learning | `DOM-006` ONLY |
| `FocusedWorkspaceView` | `DOM-007: Dashboard` | Navigation Domain | `DOM-007` ONLY |
| `NavigationStack` / `Route` | `DOM-008: Navigation` | Dashboard Domain | `DOM-008` ONLY |
| `EvaluationRubric` / `Verdict` | `DOM-009: Review` | Learning, Memory, Project | `DOM-009` ONLY |
| `UserProfile` / `Preferences` | `DOM-010: Settings` | All Domains | `DOM-010` ONLY |
| `EvidenceArtifact` | `DOM-011: Evidence` | Review, Memory, AI Core | `DOM-011` ONLY |
| `CognitiveVelocityMetric` | `DOM-012: Analytics` | Dashboard Domain | `DOM-012` ONLY |

---

## 4. DECOUPLING AND DEEP ARCHITECTURAL INTEGRITY

### 4.1 Anti-Pattern Guardrails
1. **No Shared Database Mutators:** No domain is permitted to write directly to another domain's database storage. All cross-domain state changes must occur via domain events or formal API contracts.
2. **No Direct UI-to-AI Bypass:** The UI (`DOM-007`) cannot trigger raw LLM calls without routing through `DOM-004: AI Core Domain`, ensuring prompt templates and constitutional guardrails are always enforced.
3. **No Unverified Memory Ingestion:** Memory items cannot be written directly by user inputs; they must be generated from verified review verdicts (`DOM-009`) or synthesized stage completion events (`DOM-001`).

---
**END OF DOMAIN RELATIONSHIP MATRIX**
