# KNOWLEDGE RELATIONSHIP MATRIX
## Structural Graph & Cross-Entity Dependency Mapping
### Eliot Personal Learning Operating System (PLOS)

---

## 1. Executive Matrix Overview

The **Knowledge Relationship Matrix** defines the interaction rules, edge directional semantics, cascade rules, and state propagation behavior across all 16 core entities in the Eliot Cognitive Knowledge Model.

---

## 2. Entity Interaction Matrix

Legend:
- `M`: Many-to-Many Relationship
- `1:N`: One-to-Many
- `1:1`: One-to-One
- `X`: Self / Direct Reference
- `-`: No Direct Edge (Connected via intermediate entities)

| Source \ Target | Concept | Skill | Competency | Asset | Protocol | Evidence | Memory | Review | State | Session | Mission | Roadmap | Dep | Prereq | Path | Domain |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Concept** | X | 1:N | 1:N | 1:N | 1:N | 1:N | 1:1 | 1:N | 1:1 | 1:N | 1:N | 1:N | 1:N | 1:N | 1:N | N:1 |
| **Skill** | M | X | N:1 | - | 1:N | 1:N | - | - | - | 1:N | 1:N | 1:N | 1:N | 1:N | 1:N | N:1 |
| **Competency** | M | 1:N | X | - | - | 1:N | - | - | - | - | 1:N | 1:N | - | - | 1:N | N:1 |
| **Asset** | 1:N | - | - | X | 1:N | - | - | - | - | 1:N | 1:N | - | - | - | 1:N | N:1 |
| **Protocol** | 1:N | 1:N | - | - | X | 1:N | - | - | - | 1:N | 1:N | - | - | - | - | N:1 |
| **Evidence** | N:1 | N:1 | N:1 | - | - | X | - | - | 1:1 | N:1 | N:1 | - | - | - | - | - |
| **Memory** | 1:1 | - | - | - | - | - | X | 1:N | 1:1 | - | - | - | - | - | - | - |
| **Review** | N:1 | - | - | - | - | - | N:1 | X | 1:1 | - | - | - | - | - | - | - |
| **State** | 1:1 | - | - | - | - | - | 1:1 | - | X | - | - | - | - | - | - | - |
| **Session** | N:M | N:M | - | N:1 | N:1 | 1:N | - | - | - | X | N:1 | - | - | - | - | - |
| **Mission** | N:M | N:M | - | N:1 | - | 1:N | - | - | - | 1:N | X | N:1 | - | - | - | N:1 |
| **Roadmap** | N:M | N:M | N:M | - | - | - | - | - | - | - | 1:N | X | - | - | 1:N | N:1 |
| **Dependency**| 1:N | 1:N | - | - | - | - | - | - | - | - | - | - | X | - | - | - |
| **Prerequisite**| 1:N | - | - | - | - | - | - | - | - | - | - | - | - | X | - | - |
| **Path** | N:M | N:M | - | 1:N | - | - | - | - | - | 1:N | 1:N | N:1 | - | - | X | - |
| **Domain** | 1:N | 1:N | 1:N | 1:N | 1:N | - | - | - | - | - | 1:N | 1:N | - | - | - | X |

---

## 3. Propagation & Cascade Event Rules

When an event occurs in the system, edge relationships define exact propagation cascades:

```
[Evidence Submission Event]
       │
       ├──► 1. Verifies Concept (Sets Evidence Hash)
       ├──► 2. Updates Knowledge State (Recalculates Mastery Score Mc)
       ├──► 3. Resets Memory Node Decay Timer (Extends Memory Stability S)
       ├──► 4. Unlocks Prerequisite Checks for Dependent Concepts
       └──► 5. Re-evaluates Competency Growth Score (Cg)
```

### Event Cascade 1: Evidence Submitted
- **Source:** `EvidenceSubmissionView`
- **Cascade Triggered:**
  1. `Evidence` is hashed with SHA-256 and stored in LocalFirst ledger.
  2. Target `Concept.KnowledgeState` recalculates $M_c$ using Evidence Quality $E_q$.
  3. Associated `MemoryNode` decay timer is reset; Stability $S$ increases by factor $(1 + \alpha)$.
  4. Graph edge `Dependency` engine re-evaluates all child `Concept` prerequisites.
  5. If child concept prerequisites transition from `< 0.60` to `≥ 0.60`, child concept status changes from `Locked` to `Available`.

### Event Cascade 2: Spaced Review Due
- **Source:** System Kernel Spaced Scheduler
- **Cascade Triggered:**
  1. `MemoryNode` stability calculation indicates $R(t) < 0.50$.
  2. System generates a `ReviewNode` scheduled for active retrieval.
  3. `Concept.KnowledgeState` decay status transitions to `Decaying` or `Critical`.
  4. System Mission Control adjusts daily mission recommendation to include a retrieval review session.

### Event Cascade 3: Practice Execution Failure
- **Source:** `PracticeWorkspaceView`
- **Cascade Triggered:**
  1. `PracticeExecutionResult` returns `success: false`.
  2. Target `Skill.SkillProgression` score drops.
  3. System flags underlying `Concept` as `Gap Detected`.
  4. Remediation loop recommends re-viewing the specific `LearningAsset` that `Explains` the concept.

---

## 4. Relationship Directional Constraints

1. **Strict Acyclicity Rule (DAG):**
   - The graph formed by `Concept` nodes and `Prerequisite` / `DependsOn` edges MUST be a **Directed Acyclic Graph (DAG)**.
   - Circular dependencies (e.g., Concept A depends on Concept B, which depends on Concept A) are strictly prohibited and caught by graph validation algorithms.

2. **Domain Isolation Boundary:**
   - A `Concept` MUST belong to exactly ONE primary `Domain`.
   - Cross-domain relationships are permitted via `RelatedTo` edges, but cross-domain mutation of internal state is forbidden.

3. **Evidence Provenance Immutability:**
   - Once an `Evidence` item is linked to a `LearningSession` and `Concept`, the relationship is immutable. Evidence cannot be reassigned or deleted.

---

## 5. Summary & Verification

The Knowledge Relationship Matrix guarantees complete structural integrity across all subsystems of the Eliot Personal Learning Operating System.
