# ADR-003: Cognitive Knowledge Model (CKM) Graph Over Linear Courses

* **Status**: Accepted
* **Date**: 2026-08-06
* **Deciders**: Eliot Core Architecture Team & Pedagogical Engine Group
* **Technical Area**: Knowledge Representation, Curriculum Engine, Data Schema

---

## Context and Problem Statement
Traditional online learning relies on linear course structures: Module 1 → Module 2 → Module 3 → Certificate. Linear structures fail because real-world knowledge is a complex, non-linear directed graph of atomic concepts, skills, and prerequisite relationships. 

Linear courses force learners through redundant content they already understand, obscure underlying cross-domain dependencies, and make granular retention tracking impossible when a single sub-concept decays in memory.

---

## Decision Drivers
1. **Granular Mastery Tracking**: Tracking understanding at the level of individual atomic concepts rather than coarse "course progress percentages".
2. **Prerequisite Gating**: Ensuring a user masters necessary foundational concepts before attempting dependent advanced skills.
3. **Adaptive Learning Paths**: Dynamically updating learning trajectories based on verified evidence and memory decay without restarting full modules.
4. **Source Ingestion Agnosticism**: Extracted knowledge from disparate books, PDFs, and repositories must map into a unified personal knowledge graph.

---

## Decision Outcome
**Chosen Option**: **Cognitive Knowledge Model (CKM) Graph Architecture**.

Knowledge in Eliot is modeled as a directed acyclic graph (DAG) maintained by `dom-003-knowledge`:
* **Concept Nodes**: Atomic units of understanding (e.g. `CPT-SYS-MONADIC-RESULT`).
* **Skill Nodes**: Practical applications linked to concepts.
* **Dependency Edges**: Prerequisite relationships defining strict or recommended learning sequences.
* **Immutable Commit Versioning**: Knowledge states are committed as immutable snapshot versions (`v1.0.0`) in the `KnowledgeLedger`.

### Positive Consequences
* **Precision Navigation**: The system pinpoint-targets exact concept weaknesses without forcing full re-takes.
* **Prerequisite Safety**: Users cannot enter advanced stages without fulfilling prerequisite node mastery.
* **Modular Ingestion**: Independent source documents contribute nodes to a unified personal CKM.

### Negative Consequences
* **Graph Complexity**: Requires graph validation algorithms (`CommitValidationPipeline`) to prevent cyclic dependencies or dangling references.
