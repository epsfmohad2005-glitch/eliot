# ELIOT: PROJECT DOCUMENT INDEX
**Document Version:** 1.0  
**Phase:** Architecture Review Package  
**Target Audience:** Independent Architecture Auditors & System Reviewers  

---

## EXECUTIVE SUMMARY

This document provides a comprehensive index and functional role description for all architectural specifications, relationship matrices, audit reports, and implementation plans comprising the **Eliot Personal Learning Operating System (PLOS)** specification suite.

---

## DOCUMENT INDEX & ROLE SPECIFICATIONS

### 1. Governance & Navigation Documents

- **`README.md`**
  - **Role:** Package Entry Point & Governance Overview.
  - **Description:** Introduces the Architecture Review Package, defines its purpose for independent review, and establishes `ELIOT_PROJECT_BIBLE.md` as the supreme constitutional authority over all lower-level technical specifications.

- **`PROJECT_DOCUMENT_INDEX.md`**
  - **Role:** Master Specification Directory (This Document).
  - **Description:** Catalogs every document in the repository, explaining its functional purpose, authoring phase, and architectural scope.

- **`DOCUMENT_DEPENDENCY_MAP.md`**
  - **Role:** Reading Order & Dependency Hierarchy Specification.
  - **Description:** Maps structural dependencies between specifications and outlines the recommended sequential reading order for independent architectural evaluation.

---

### 2. Level 0: Constitutional Foundations

- **`ELIOT_PROJECT_BIBLE.md`**
  - **Role:** Supreme Constitutional Bible.
  - **Description:** The supreme authority of the Eliot project. Establishes the core philosophy (Personal Learning Operating System), non-negotiable architectural laws, the 8-Stage Learning Lifecycle, anti-slop UI design principles, cognitive memory models, and constitutional guardrails.

- **`ELIOT_PROJECT_UNDERSTANDING_REPORT.md`**
  - **Role:** Architectural Synthesis & Comprehension Report.
  - **Description:** Synthesizes and demonstrates deep understanding of the Project Bible, validating alignment across core learning philosophy, AI integration boundaries, and technical constraints.

- **`ELIOT_ARCHITECTURAL_READINESS_REVIEW.md`**
  - **Role:** Readiness Assessment & Pre-Domain Gap Review.
  - **Description:** Audits foundational project concepts for readiness prior to formal domain modeling, identifying initial architectural risks and mitigation strategies.

---

### 3. Level 1: Canonical Domain Architecture (Phase 3 — CDD)

- **`CANONICAL_DOMAIN_MODEL.md`**
  - **Role:** Formal Domain Specification (CDD).
  - **Description:** Formally defines the 12 Canonical Bounded Contexts (`DOM-001` through `DOM-012`). For each domain, it specifies primary responsibilities, explicit non-responsibilities, owned domain concepts, inputs, outputs, direct dependencies, canonical domain events, invariant business rules, and state lifecycles.

- **`DOMAIN_RELATIONSHIP_MATRIX.md`**
  - **Role:** Domain Interaction & Contract Matrix.
  - **Description:** Maps structural interactions, event publisher/subscriber contracts, read/write API boundaries, and single data ownership across all 12 domains.

- **`DOMAIN_GAP_ANALYSIS.md`**
  - **Role:** Domain Boundary Audit & Risk Analysis.
  - **Description:** Performs a rigorous architectural audit of domain boundaries, identifying potential overlap risks, missing event links, unassigned logic, and technical edge cases.

- **`MANDATORY_ENGINEERING_REPORT.md`**
  - **Role:** Phase 3 Engineering Review Report.
  - **Description:** Synthesizes Phase 3 (Canonical Domain Definition) outputs, providing architectural decisions, assumptions, missing information, risk assessments, and confidence scores for the domain model.

---

### 4. Level 2: Canonical Workflow Architecture (Phase 3.5 — CWD)

- **`CANONICAL_WORKFLOWS.md`**
  - **Role:** Canonical Operational Workflows Definition (CWD).
  - **Description:** Formally defines the 20 Canonical Workflows (`WF01` through `WF20`) governing user journeys, practice drills, AI review evaluations, evidence submissions, memory updates, career progression, and failure recoveries.

- **`WORKFLOW_RELATIONSHIP_MATRIX.md`**
  - **Role:** Workflow Interaction & State Handoff Matrix.
  - **Description:** Defines operational transitions, trigger classifications (User, System, Event, Temporal), state handoff payload schemas (`HANDOFF-01` to `HANDOFF-04`), and the end-to-end lifecycle loop across all 20 workflows.

- **`WORKFLOW_GAP_ANALYSIS.md`**
  - **Role:** Operational Workflow Audit & Loop Trap Analysis.
  - **Description:** Audits operational workflows for infinite revision loops, AI over/under-intervention risks, memory decay over-penalization, and dashboard UI rendering priority hierarchies.

- **`ENGINEERING_REVIEW_REPORT.md`**
  - **Role:** Phase 3.5 Engineering Review Report.
  - **Description:** Synthesizes Phase 3.5 (Canonical Workflow Definition) outputs, detailing architectural decisions, operational risks, self-critiques, and phase readiness scores.

---

### 5. Level 3: Runtime Implementation Planning (Sprint 0)

- **`SPRINT_0_IMPLEMENTATION_PLAN.md`**
  - **Role:** Foundation Runtime Implementation Plan.
  - **Description:** Defines the production-grade implementation specification for Sprint 0. Outlines goals, scope, folder structure, 4-layer clean architecture, modular domain isolation rules, Event Bus interfaces, state machine engines, storage abstraction adapters, and acceptance criteria.

---
**END OF PROJECT DOCUMENT INDEX**
