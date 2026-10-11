# ELIOT COGNITIVE KNOWLEDGE MODEL (CKM)
## Constitutional Architecture Specification v1.0
### Foundation of Eliot Personal Learning Operating System (PLOS)

---

## 1. Executive Vision & Core Axioms

The **Cognitive Knowledge Model (CKM)** defines how the Eliot Personal Learning Operating System understands, structures, models, tracks, and transforms human knowledge.

The CKM rejects traditional LMS (Learning Management System) paradigms that treat education as static course consumption, linear video completion, or artificial gamification (XP, streaks, badges).

### The Golden Rule of CKM Architecture

> **"Courses are NOT first-class objects. Lessons are merely transient containers. Concepts are permanent."**

In CKM:
1. **Concepts are the atomic unit of truth.** Everything in Eliot—skills, evidence, memory node decay, recommendations, review scheduling, roadmap planning—maps directly back to permanent **Concepts**.
2. **Every recommendation must reference Concepts.** The system never recommends "taking Module 2". It recommends "reinforcing *Concept: Monadic Error Containers* because your retrieval confidence has decayed to 32%".
3. **Every evidence item must strengthen Concepts.** Submitting a GitHub commit or terminal session hash does not award generic points; it updates the evidence weight and mastery coefficient of specific underlying Concepts.
4. **Memory and Review exist per Concept.** Spaced repetition, cognitive load, and decay curves are tracked at the atomic Concept level.

---

## 2. Core Entities Architecture

The CKM defines **16 foundational entities**. Each entity has explicit architectural boundaries.

```
                  ┌─────────────────────────────────────────┐
                  │                 DOMAIN                  │
                  └────────────────────┬────────────────────┘
                                       │ 1:N
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │                ROADMAP                  │
                  └────────────────────┬────────────────────┘
                                       │ 1:N
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │                MISSION                  │
                  └────────────────────┬────────────────────┘
                                       │ 1:N
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │             LEARNING PATH               │
                  └────────────────────┬────────────────────┘
                                       │ 1:N
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │            LEARNING SESSION             │
                  └────────────────────┬────────────────────┘
                                       │ 1:N
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │             LEARNING ASSET              │
                  └────────────────────┬────────────────────┘
                                       │ maps to
                                       ▼
  ┌───────────────────┐        ┌───────────────┐        ┌───────────────────┐
  │     PROTOCOL      ├───────►│    CONCEPT    │◄───────┤    COMPETENCY     │
  └───────────────────┘        └───┬───────┬───┘        └─────────┬─────────┘
                                   │       │                      │
                          1:1      │       │ 1:1                  │ 1:N
                       ┌───────────┘       └───────────┐          ▼
                       ▼                               ▼   ┌───────────────┐
              ┌─────────────────┐             ┌────────┴──┐│     SKILL     │
              │  MEMORY NODE    │             │ KNOWLEDGE │└───────────────┘
              └────────┬────────┘             │   STATE   │
                       │ 1:N                  └───────────┘
                       ▼
              ┌─────────────────┐             ┌───────────┐
              │   REVIEW NODE   │             │ EVIDENCE  │
              └─────────────────┘             └───────────┘
```

---

### Entity 1: Concept

- **Purpose:** The permanent, immutable, atomic unit of human knowledge in Eliot.
- **Responsibilities:**
  - Uniquely identify a single principle, mental model, or architectural pattern (e.g., `CONCEPT-SYS-MONADIC-RESULT`).
  - Maintain canonical semantic definition, prerequisites, and child relationships.
  - Serve as the anchor for Memory Nodes, Knowledge States, and Review Nodes.
- **Non-Responsibilities:**
  - Does NOT track user practice sessions or temporal logs (handled by `LearningSession` and `MemoryNode`).
  - Does NOT store source media files (handled by `LearningAsset`).
- **Owned Data:**
  - `id: String` (e.g., `concept_monadic_result`)
  - `code: String` (e.g., `CPT-SYS-042`)
  - `name: String`
  - `summary: String`
  - `domainId: String`
  - `cognitiveLevel: 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create'`
  - `canonicalTaxonomyPath: String` (e.g., `Systems.Architecture.ErrorHandling.Monads`)
- **Lifecycle:** Created during Domain Mapping -> Updated via Refinement -> Permanent (Never Deleted).
- **Relationships:**
  - `BelongsTo` -> Domain
  - `DependsOn` -> Concept
  - `Prerequisite` -> Concept
  - `ExplainedBy` -> LearningAsset
  - `VerifiedBy` -> Evidence
- **Future Extension Points:** Semantic vector embedding generation for automated graph resolution.

---

### Entity 2: Skill

- **Purpose:** The practical, procedural capability to perform a specific action using one or more Concepts.
- **Responsibilities:**
  - Bridge theoretical Concepts to actionable engineering execution (e.g., `SKILL-TS-EVENT-DISPATCHER`).
  - Define measurable rubrics for code execution, terminal commands, or diagnostic workflows.
- **Non-Responsibilities:**
  - Does NOT store abstract mental models or definitions (handled by `Concept`).
  - Does NOT assess high-level strategic problem-solving (handled by `Competency`).
- **Owned Data:**
  - `id: String`
  - `name: String`
  - `skillType: 'Programming' | 'Git' | 'Linux' | 'Algorithms' | 'Debugging' | 'Architecture'`
  - `rubricCriteria: List<String>`
  - `targetEfficiencySeconds: Number`
- **Lifecycle:** Draft -> Active -> Deprecated (if industry practice changes).
- **Relationships:**
  - `Requires` -> Concept (N:M)
  - `DemonstratedBy` -> Evidence
  - `UsedIn` -> Mission
- **Future Extension Points:** Automated CLI rubric grading parsers.

---

### Entity 3: Competency

- **Purpose:** The high-level synthesis of multiple Skills and Concepts demonstrating holistic capability.
- **Responsibilities:**
  - Represent production-grade engineering mastery (e.g., `COMP-DISTRIBUTED-SYSTEMS-RESILIENCE`).
  - Evaluate ability to navigate trade-offs, architecture decisions, and failure modes.
- **Non-Responsibilities:**
  - Does NOT represent single terminal commands or code syntax.
- **Owned Data:**
  - `id: String`
  - `title: String`
  - `targetLevel: 'Junior' | 'Mid' | 'Senior' | 'Principal' | 'Architect'`
  - `evaluationRubric: List<RubricItem>`
- **Lifecycle:** Defined by Domain Engineers -> Evaluated continuously.
- **Relationships:**
  - `ComposedOf` -> Skill (1:N)
  - `GroundedIn` -> Concept (1:N)
  - `VerifiedBy` -> Evidence
- **Future Extension Points:** Multi-agent peer architecture review simulations.

---

### Entity 4: Learning Asset

- **Purpose:** The media material or source text used to explain or demonstrate a Concept.
- **Responsibilities:**
  - Encapsulate external or internal source media (Video, Documentation, NotebookLM synthesis, Gemini Gem, PDF Spec, Article, Plugin).
  - Provide structured input for learning sessions.
- **Non-Responsibilities:**
  - Does NOT track whether the user mastered the material.
  - Does NOT store user notes or reflections.
- **Owned Data:**
  - `id: String`
  - `title: String`
  - `assetType: 'Video' | 'Documentation' | 'NotebookLM' | 'Gemini Gem' | 'PDF' | 'Article' | 'Plugin'`
  - `uri: String`
  - `estimatedReadingMinutes: Number`
- **Lifecycle:** Ingested -> Indexed -> Active.
- **Relationships:**
  - `Explains` -> Concept (1:N)
  - `UsedIn` -> LearningSession
- **Future Extension Points:** Dynamic multimodal video timestamp indexing.

---

### Entity 5: Protocol

- **Purpose:** Standard operating procedure or step-by-step cognitive algorithm for solving a class of problems.
- **Responsibilities:**
  - Provide structured execution steps for complex tasks (e.g., `PROTOCOL-DEBUG-MEMORY-LEAK`).
  - Standardize diagnostic or architectural workflows.
- **Non-Responsibilities:**
  - Does NOT track individual user execution logs.
- **Owned Data:**
  - `id: String`
  - `title: String`
  - `steps: List<ProtocolStep>`
  - `expectedArtifactType: EvidenceType`
- **Lifecycle:** Active -> Versioned.
- **Relationships:**
  - `Uses` -> Concept
  - `Executes` -> Skill
- **Future Extension Points:** Interactive flowchart execution engines.

---

### Entity 6: Evidence

- **Purpose:** Immutable proof of active learning, code execution, or concept mastery.
- **Responsibilities:**
  - Capture tangible outputs (`Code`, `Repository`, `Markdown`, `Text`, `Screenshot`, `Files`, `Links`).
  - Generate cryptographic SHA-256 hash proofs of user artifacts.
- **Non-Responsibilities:**
  - Does NOT award artificial points, XP, or badges.
- **Owned Data:**
  - `id: String`
  - `evidenceType: EvidenceType`
  - `payload: String`
  - `sha256Hash: String`
  - `timestamp: DateTime`
  - `verificationStatus: 'Pending' | 'Verified' | 'Rejected'`
- **Lifecycle:** Created -> Hashed -> Verified -> Permanently Stored in LocalFirst ledger.
- **Relationships:**
  - `Verifies` -> Concept
  - `Strengthens` -> KnowledgeState
  - `ProducedBy` -> LearningSession
- **Future Extension Points:** On-chain cryptographic attestation anchoring.

---

### Entity 7: Memory Node

- **Purpose:** Tracks the psychological memory trace and retention state of a single Concept for a user.
- **Responsibilities:**
  - Model memory decay over time using Ebbinghaus/SuperMemo curves.
  - Track memory strength, stability, and last retrieval date.
- **Non-Responsibilities:**
  - Does NOT store raw course text or UI components.
- **Owned Data:**
  - `id: String`
  - `conceptId: String`
  - `retrievalStrength: Number` (0.0 to 1.0)
  - `memoryStabilityDays: Number`
  - `repetitionCount: Number`
  - `lastReviewedAt: DateTime`
  - `nextReviewDueAt: DateTime`
- **Lifecycle:** Initialized upon first Concept encounter -> Updated on every retrieval.
- **Relationships:**
  - `AnchoredTo` -> Concept (1:1)
  - `Generates` -> ReviewNode
- **Future Extension Points:** Machine-learning-driven personalized half-life prediction models.

---

### Entity 8: Review Node

- **Purpose:** Represents a single scheduled or completed spaced retrieval review event.
- **Responsibilities:**
  - Record active recall performance, response latency, and score.
  - Trigger updates to the associated `MemoryNode`.
- **Non-Responsibilities:**
  - Does NOT store long-term historical trends.
- **Owned Data:**
  - `id: String`
  - `memoryNodeId: String`
  - `scheduledFor: DateTime`
  - `completedAt: DateTime?`
  - `recallScore: 'Zero' | 'Hard' | 'Good' | 'Easy'`
  - `responseLatencyMs: Number`
- **Lifecycle:** Scheduled -> Active -> Completed / Missed.
- **Relationships:**
  - `Reviews` -> MemoryNode
  - `RefersTo` -> Concept
- **Future Extension Points:** Contextual recall question generators.

---

### Entity 9: Knowledge State

- **Purpose:** The real-time calculated cognitive mastery state of a Concept for a user.
- **Responsibilities:**
  - Combine memory stability, evidence quality, and practice results into a single authoritative mastery score.
  - Power system gap identification and remediation triggers.
- **Non-Responsibilities:**
  - Does NOT store raw text notes.
- **Owned Data:**
  - `conceptId: String`
  - `masteryScore: Number` (0.00 to 1.00)
  - `confidenceInterval: Number`
  - `evidenceCount: Number`
  - `decayStatus: 'Optimal' | 'Decaying' | 'Critical'`
  - `updatedAt: DateTime`
- **Lifecycle:** Calculated continuously on event publication.
- **Relationships:**
  - `Evaluates` -> Concept (1:1)
  - `InformedBy` -> Evidence & MemoryNode
- **Future Extension Points:** Real-time Bayesian probability updates.

---

### Entity 10: Learning Session

- **Purpose:** The transient execution workspace session where active learning and practice occur.
- **Responsibilities:**
  - Maintain Context Lock state, focus timer, active source media, terminal logs, notes, and reflection.
  - Monitor cognitive load density.
- **Non-Responsibilities:**
  - Does NOT persist beyond session lifecycle except through produced Evidence and Notes.
- **Owned Data:**
  - `sessionId: String`
  - `unitId: String`
  - `objective: String`
  - `isContextLocked: Boolean`
  - `sessionDurationSeconds: Number`
  - `cognitiveLoadPercent: Number`
  - `isCompleted: Boolean`
- **Lifecycle:** Initialized -> Active (Locked) -> Concluded -> Saved.
- **Relationships:**
  - `Executes` -> Mission / LearningPath
  - `Produces` -> Evidence & Notes
  - `Targets` -> Concept (1:N)
- **Future Extension Points:** Live voice streaming and peer pair-programming sync.

---

### Entity 11: Mission

- **Purpose:** An actionable, outcome-driven learning goal assigned to the user for a specific session.
- **Responsibilities:**
  - Focus user attention on a single concrete task (e.g., "Construct In-Memory Event Dispatcher").
  - Define clear acceptance criteria and required evidence.
- **Non-Responsibilities:**
  - Does NOT act as a multi-month course syllabus.
- **Owned Data:**
  - `id: String`
  - `title: String`
  - `purpose: String`
  - `estimatedMinutes: Number`
  - `targetStage: StageNumber` (1: Understanding, 2: Practicing, 3: Applying, 4: Evaluating)
- **Lifecycle:** Planned -> Active -> Verified -> Archived.
- **Relationships:**
  - `TargetConcepts` -> Concept (1:N)
  - `BelongsTo` -> Roadmap
  - `ExecutedIn` -> LearningSession
- **Future Extension Points:** Dynamic AI mission generation based on concept decay.

---

### Entity 12: Roadmap

- **Purpose:** Strategic long-term progression path towards a comprehensive engineering role or domain mastery.
- **Responsibilities:**
  - Structure sequence of Missions and Milestones over weeks/months.
  - Provide macro-level clarity without forcing rigid linear paths.
- **Non-Responsibilities:**
  - Does NOT store daily session state.
- **Owned Data:**
  - `id: String`
  - `title: String`
  - `targetRole: String`
  - `milestones: List<Milestone>`
- **Lifecycle:** Drafted -> Active -> Adapted -> Completed.
- **Relationships:**
  - `Contains` -> Mission (1:N)
  - `Covers` -> Domain
- **Future Extension Points:** Adaptive career roadmap synchronization with industry job market demand.

---

### Entity 13: Dependency

- **Purpose:** Formal representation of structural relationship constraints between Concepts or Skills.
- **Responsibilities:**
  - Enforce prerequisite checks and path resolution algorithms.
- **Non-Responsibilities:**
  - Does NOT store content or assets.
- **Owned Data:**
  - `sourceId: String`
  - `targetId: String`
  - `dependencyType: 'HardPrerequisite' | 'SoftPrerequisite' | 'Reinforcing'`
  - `weight: Number` (0.0 to 1.0)
- **Lifecycle:** Static in schema -> Dynamic in recommendation graph.
- **Relationships:**
  - `Connects` -> Concept / Skill
- **Future Extension Points:** Automated graph cycle detection.

---

### Entity 14: Prerequisite

- **Purpose:** Explicit declaration that Concept A must achieve a minimum threshold before Concept B can be unlocked.
- **Responsibilities:**
  - Protect user from cognitive overload caused by skipping foundational knowledge.
- **Non-Responsibilities:**
  - Does NOT prevent exploration; only provides recommendations and warnings.
- **Owned Data:**
  - `prerequisiteConceptId: String`
  - `targetConceptId: String`
  - `minimumMasteryRequired: Number` (e.g., 0.70)
- **Lifecycle:** Permanent in knowledge graph.
- **Relationships:**
  - `Guards` -> Concept
- **Future Extension Points:** Dynamic prerequisite relaxation based on user prior knowledge.

---

### Entity 15: Learning Path

- **Purpose:** A dynamic, personalized sequence of Learning Assets and Missions generated to achieve a specific Concept goal.
- **Responsibilities:**
  - Reorder and adapt content based on user real-time mastery and decay rates.
- **Non-Responsibilities:**
  - Is NOT a static pre-packaged video course playlist.
- **Owned Data:**
  - `id: String`
  - `targetConceptIds: List<String>`
  - `currentStepIndex: Number`
  - `isAdaptive: Boolean`
- **Lifecycle:** Generated -> Executed -> Re-indexed.
- **Relationships:**
  - `Sequences` -> LearningAsset & Mission
- **Future Extension Points:** Multi-modal AI path generation.

---

### Entity 16: Domain

- **Purpose:** High-level bounded context and subject matter boundary (e.g., Systems Engineering, Machine Learning, Operating Systems).
- **Responsibilities:**
  - Organize related Concepts, Skills, and Protocols into coherent architectural contexts.
  - Enforce clean boundary isolation across PLOS modules.
- **Non-Responsibilities:**
  - Does NOT contain transient user session state.
- **Owned Data:**
  - `id: String` (e.g., `DOM-001`)
  - `name: String`
  - `version: String`
  - `status: 'Initialized' | 'Active' | 'Deprecated'`
- **Lifecycle:** Registered in system manifest -> Permanent.
- **Relationships:**
  - `Encapsulates` -> Concept, Skill, Competency
- **Future Extension Points:** Dynamic domain plugin architecture.

---

## 3. Formal Relationship Types & Semantics

Every relationship in CKM has explicit directional semantics and impact rules:

| Relationship Name | Source Entity | Target Entity | Directional Semantics | Impact on Target |
| :--- | :--- | :--- | :--- | :--- |
| **Depends On** | Concept / Skill | Concept | Source cannot be mastered without Target | Blocks progression if Target mastery < 0.60 |
| **Prerequisite** | Concept | Concept | Target requires prior understanding of Source | Generates prerequisite check warning |
| **Explains** | Learning Asset | Concept | Source provides theoretical or media explanation | Increases retrieval confidence |
| **Reinforces** | Practice / Evidence | Concept | Source actively applies and validates Target | Slows decay rate; boosts mastery score |
| **Belongs To** | Concept / Skill | Domain | Source is contained within target domain boundary | Categorizes knowledge context |
| **Requires** | Skill / Mission | Concept | Source execution depends on Target understanding | Flags missing concepts upon failure |
| **Uses** | Protocol | Concept / Skill | Source operational steps implement Target | Demonstrates procedural application |
| **Produces** | Learning Session | Evidence | Source execution generates Target artifact | Hash verified in LocalFirst ledger |
| **Improves** | Evidence / Practice | Knowledge State | High quality evidence increases Target score | Multiplies confidence weight |
| **Weakens** | Time / Non-Review | Memory Node | Passage of time without review decays Target | Triggers review recommendation |
| **Related To** | Concept | Concept | Horizontal similarity without hard dependency | Enables contextual discovery |
| **Derived From** | Evidence | Learning Session | Target is source provenance for Source | Establishes audit trail |
| **Verified By** | Concept / Skill | Evidence | Target validates true capability of Source | Sets verification status to True |
| **Reviewed By** | Memory Node | Review Node | Source stability is updated by Target recall | Resets decay timer |

---

## 4. Core Mathematical Models

### 4.1. Concept Mastery Model ($M_c$)

The Concept Mastery Score ($M_c \in [0.00, 1.00]$) determines a user's absolute proficiency in a concept. It combines memory retrieval strength ($R$), evidence quality ($E_q$), and practice success rate ($P$).

$$M_c = w_r \cdot R(t) + w_e \cdot E_q + w_p \cdot P$$

Where:
- $w_r = 0.35$ (Weight of Memory Retrieval)
- $w_e = 0.45$ (Weight of Verified Evidence)
- $w_p = 0.20$ (Weight of Practice Execution)
- $w_r + w_e + w_p = 1.00$

---

### 4.2. Knowledge Decay Model ($R(t)$)

Memory retrieval strength decays exponentially over time following a modified Ebbinghaus retention function calibrated for technical concepts:

$$R(t) = \exp\left( -\frac{t}{S \cdot c_{\text{diff}}} \right)$$

Where:
- $t$: Time elapsed in days since last retrieval.
- $S$: Memory Stability (in days). Increases exponentially with successful reviews:
  $$S_{\text{new}} = S_{\text{old}} \cdot (1 + \alpha \cdot d_{\text{recall}})$$
- $\alpha$: Recall multiplier ($\alpha = 0.4$ for Good, $0.8$ for Easy).
- $c_{\text{diff}}$: Concept complexity factor ($1.0$ for foundational, $1.5$ for complex architecture).

---

### 4.3. Evidence Quality Model ($E_q$)

Not all evidence is equal. Evidence quality ($E_q \in [0.00, 1.00]$) is computed based on artifact verification, depth, and SHA-256 cryptographic proof:

$$E_q = Q_{\text{base}} \cdot V_{\text{hash}} \cdot D_{\text{depth}}$$

Where:
- $Q_{\text{base}}$: Base quality score per type (`Code` = 1.0, `Repository` = 0.95, `Markdown` = 0.85, `Text` = 0.70, `Screenshot` = 0.60).
- $V_{\text{hash}}$: Cryptographic verification factor ($1.0$ if SHA-256 verified, $0.5$ if raw payload).
- $D_{\text{depth}}$: Artifact length/complexity factor ($\min(1.0, \frac{\text{chars}}{300})$).

---

### 4.4. Skill Progression Model ($S_p$)

Skill progression ($S_p$) tracks procedural speed and accuracy:

$$S_p = \frac{\text{Test Cases Passed}}{\text{Total Test Cases}} \times \min\left(1.0, \frac{T_{\text{target}}}{T_{\text{actual}}}\right)$$

---

### 4.5. Competency Growth Model ($C_g$)

Competency growth is the weighted geometric mean of underlying Concept Masteries ($M_{c_i}$) and Skill Progressions ($S_{p_j}$):

$$C_g = \left( \prod_{i=1}^n M_{c_i}^{w_i} \right) \times \left( \prod_{j=1}^m S_{p_j}^{v_j} \right)$$

This ensures that a severe weakness in any single core Concept drags down the total Competency score, preventing false positives.

---

### 4.6. Knowledge Confidence Model ($K_c$)

The Knowledge Confidence Model reflects system statistical confidence in the calculated mastery:

$$K_c = 1.0 - \exp\left( -\frac{N_{\text{interactions}}}{5} \right)$$

Where $N_{\text{interactions}}$ is the total number of practice sessions, reviews, and evidence submissions recorded for the concept.

---

## 5. Global Architectural Rules & Constraints

1. **Rule 1: Zero Artificial Gamification**
   - The system shall NEVER display XP, levels, leaderboards, streaks, or badges.
   - Progress is measured strictly in verified Concept Mastery ($M_c$) and Evidence SHA-256 hashes.

2. **Rule 2: Context Lock Discipline**
   - During active learning, the system locks context. Distractions, external navigation, and global headers are hidden until evidence is submitted or the workspace is explicitly exited.

3. **Rule 3: Open-Ended Reflection Constraint**
   - Self-assessments must never be binary Yes/No toggles. Reflections require open-ended cognitive synthesis with a minimum character depth requirement.

4. **Rule 4: Concept-First Indexing**
   - No data item exists in Eliot without linking to a Concept ID. Unlinked notes, unlinked code snippets, or unlinked logs are invalid in the system store.

---

## 6. Document Metadata & Approval

- **Document ID:** `DOC-ARCH-CKM-001`
- **Version:** `1.0.0`
- **Status:** `Architectural Foundation Approved`
- **Scope:** `Permanent Constitutional Architecture for Eliot PLOS`
