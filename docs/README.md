# Eliot Engineering Documentation Index

Welcome to the canonical engineering documentation system for the **Eliot Personal Learning Operating System**. This repository organizes all specifications, architectural decision records, product guidelines, and historical archives into a structured, maintainable hierarchy.

---

## Document Directory Structure

```
docs/
├── architecture/      # Canonical Architecture & Technical Specifications
├── product/           # Product Philosophy, Vision & Workflows
├── development/       # Coding Standards, Testing & CI/CD Guidelines
├── adr/               # Architecture Decision Records (ADRs)
└── archive/           # Historical Sprint Reports, Audits & Reviews
```

---

## 1. Product Documentation (`docs/product/`)

Use these documents to understand Eliot's vision, constitutional principles, brand guidelines, and core user workflows:

* **[`PROJECT_BIBLE.md`](./product/PROJECT_BIBLE.md)** (Root: `/PROJECT_BIBLE.md`):
  * **When to use**: The primary constitutional blueprint for the entire system. Read before proposing new features, altering domain boundaries, or modifying UI paradigms. Contains all 17 foundational chapters.
* **[`CANONICAL_WORKFLOWS.md`](./product/CANONICAL_WORKFLOWS.md)**:
  * **When to use**: Detailed step-by-step specifications for user journeys (e.g. Ingesting content, Reviewing CKM, Executing missions, Submitting evidence).
* **[`USER_JOURNEY_MAP.md`](./product/USER_JOURNEY_MAP.md)**:
  * **When to use**: Visualizing state transitions, emotional cognitive flow, and stage progression from novice to sovereign professional.
* **[`BRAND_LANGUAGE_GUIDE.md`](./product/BRAND_LANGUAGE_GUIDE.md)**:
  * **When to use**: Copywriting rules, tone of voice, forbidden words ("genius", "great job"), and Socratic communication standards.

---

## 2. Architecture Documentation (`docs/architecture/`)

Use these documents when working on domain engines, database schemas, import providers, or design systems:

### Core Domain Specifications
* **[`CANONICAL_DOMAIN_MODEL.md`](./architecture/CANONICAL_DOMAIN_MODEL.md)**:
  * **When to use**: Complete domain specification for all 12 system domains (`dom-001` through `dom-012`) including entity interfaces and service contracts.
* **[`ELIOT_COGNITIVE_KNOWLEDGE_MODEL.md`](./architecture/ELIOT_COGNITIVE_KNOWLEDGE_MODEL.md)**:
  * **When to use**: CKM graph definitions, node types, dependency relationships, and mathematical mastery calculation formulas.
* **[`ELIOT_COGNITIVE_DECISION_ENGINE.md`](./architecture/ELIOT_COGNITIVE_DECISION_ENGINE.md)**:
  * **When to use**: Decision state machine rules, memory decay formulas, and attention intervention triggers.
* **[`DECISION_STATE_MACHINE.md`](./architecture/DECISION_STATE_MACHINE.md)** & **[`DECISION_RULE_MATRIX.md`](./architecture/DECISION_RULE_MATRIX.md)**:
  * **When to use**: Formal state machine rules governing mission control and learning stage gating.

### Ingestion & Commit Architecture
* **[`IMPORT_PIPELINE_SPECIFICATION.md`](./architecture/IMPORT_PIPELINE_SPECIFICATION.md)** & **[`IMPORT_PROVIDER_INTERFACE.md`](./architecture/IMPORT_PROVIDER_INTERFACE.md)**:
  * **When to use**: Implementing or extending source document import providers (`pdf-document`, `markdown-folder`).
* **[`KNOWLEDGE_EXTRACTION_SPEC.md`](./architecture/KNOWLEDGE_EXTRACTION_SPEC.md)**:
  * **When to use**: Tuning deterministic text AST parsing, code chunking, or candidate concept generation.
* **[`REAL_DATA_INTEGRATION_ARCHITECTURE.md`](./architecture/REAL_DATA_INTEGRATION_ARCHITECTURE.md)**:
  * **When to use**: Understanding immutable ledger commits (`KnowledgeLedger`) and SHA-256 cryptographic hashing.

### UI & Design System Architecture
* **[`FOUNDATION_COMPONENT_SYSTEM.md`](./architecture/FOUNDATION_COMPONENT_SYSTEM.md)** & **[`COMPONENT_GUIDELINES.md`](./architecture/COMPONENT_GUIDELINES.md)**:
  * **When to use**: Building new UI components using Foundation Component System primitives and design tokens.
* **[`ELIOT_DESIGN_LANGUAGE.md`](./architecture/ELIOT_DESIGN_LANGUAGE.md)**, **[`MOTION_IDENTITY_GUIDE.md`](./architecture/MOTION_IDENTITY_GUIDE.md)**, **[`VISUAL_SIGNATURE_GUIDE.md`](./architecture/VISUAL_SIGNATURE_GUIDE.md)**:
  * **When to use**: Guidance on color palettes, typography pairs, spatial rhythm, and motion transitions.

---

## 3. Development & CI/CD Documentation (`docs/development/`)

Use these documents during daily engineering, writing code, running tests, or preparing releases:

* **[`CODING_STANDARDS.md`](./development/CODING_STANDARDS.md)**:
  * **When to use**: Coding conventions, strict TypeScript rules, monadic `Result<T, E>` error handling, and component prop standards.
* **[`TESTING_STRATEGY.md`](./development/TESTING_STRATEGY.md)**:
  * **When to use**: Guidelines for writing Vitest unit tests, multi-domain integration pipeline tests, and Playwright E2E browser tests.
* **[`CONTRIBUTION_WORKFLOW.md`](./development/CONTRIBUTION_WORKFLOW.md)**:
  * **When to use**: Branching conventions, specification derivation rules, pre-commit checklists, and PR gatekeeping criteria.
* **[`RELEASE_WORKFLOW.md`](./development/RELEASE_WORKFLOW.md)**:
  * **When to use**: Production build pipelines (`npm run build`), esbuild server bundling, semantic versioning, and Cloud Run deployment.

---

## 4. Architecture Decision Records (`docs/adr/`)

Use ADRs to review foundational architectural choices and rationale:

* **[`ADR-001: Local-First Data Architecture`](./adr/ADR-001-local-first.md)**: Rationale for offline-first, client-side data sovereignty.
* **[`ADR-002: Rejection of Gamification`](./adr/ADR-002-no-gamification.md)**: Strict ban on XP, badges, streaks, and artificial dopamine mechanics.
* **[`ADR-003: CKM Graph Over Linear Courses`](./adr/ADR-003-ckm-over-courses.md)**: Modeling knowledge as a directed concept graph rather than linear modules.
* **[`ADR-004: Event-Driven Architecture`](./adr/ADR-004-event-driven-architecture.md)**: Decoupling domain services via a typed asynchronous `EventBus`.
* **[`ADR-005: Foundation Component System`](./adr/ADR-005-foundation-component-system.md)**: Standardized UI primitives, mathematical inner radii, and tokenized design.
* **[`ADR-006: Import Pipeline Philosophy`](./adr/ADR-006-import-pipeline-philosophy.md)**: Multi-stage ingestion with deterministic AST parsing and human review staging.
* **[`ADR-007: Single "Root" Visual Identity`](./adr/ADR-007-single-root-identity.md)**: Retiring the six-theme Theme System 2.0 in favor of one dark, restrained, terminal-influenced identity.

---

## 5. Historical Archive (`docs/archive/`)

* **[`docs/archive/`](./archive/)**: Contains 50+ historical sprint reports, gap analyses, red-team QA audits, and phase implementation summaries preserved for historical reference and auditability.
