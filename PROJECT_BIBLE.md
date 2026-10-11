# ELIOT PROJECT BIBLE
**The Master Constitutional & Technical Architecture Reference for the Eliot Personal Learning Operating System**  
**Document Version:** 2.1.0  
**Status:** Permanent Constitutional & Engineering Blueprint  

> This is the single canonical copy of the Project Bible. A duplicate previously existed at `docs/product/PROJECT_BIBLE.md`; it has been removed and merged into this file to resolve the conflict. Do not recreate a second copy — if `docs/product/` needs a pointer, link to this file instead of copying its content.

---

## 1. PRODUCT PHILOSOPHY

Eliot is built on the radical premise that **information access is no longer the bottleneck to human achievement—structured mastery, deliberate practice, persistent memory, and objective evidence are.**

Historical educational software categorizes itself into repositories of content (LMS platforms), transactional assistants (chatbots), or passive organizational tools (note-taking and productivity apps). None of these accept structural responsibility for transforming an individual human being from a complete novice into a sovereign, high-caliber professional.

Eliot is a **Personal Learning Operating System (PLOS)**. It operates under four non-negotiable foundational pillars:

1. **Single-User Focus**: Eliot targets exactly one learner. Deep personalization, cognitive state alignment, and memory retention take absolute precedence over multi-user abstractions.
2. **Evidence Primacy**: No concept is marked as "mastered" without verifiable, practical proof of execution and architectural synthesis.
3. **Non-Dependent AI**: AI functions as an uncompromising reviewer, Socratic guide, and path architect—it never completes work, writes project code, or solves problems on behalf of the user.
4. **Operating System Paradigm**: Eliot is an immersive, focused operating environment designed for deep work, characterized by low visual noise, zero cognitive clutter, and single operational focus.

---

## 2. VISION

To serve as the definitive lifelong cognitive operating system that replaces self-reported claims and superficial credentials with an **immutable, verified portfolio of practical work**, transforming human capability through systematic, evidence-backed practice.

---

## 3. SCOPE

Eliot provides a complete end-to-end cognitive loop:

* **Source Material Ingestion**: Multi-format document import (`pdf-document`, `markdown-folder`) with AST parsing, chunking, and SHA-256 fingerprinting.
* **Cognitive Knowledge Model (CKM) Extraction**: Deterministic and AI-assisted extraction of candidate concepts, skills, and prerequisite dependencies.
* **Interactive Knowledge Review Workspace**: Staging environment for approving, editing, merging, and tagging extracted concepts.
* **Immutable Knowledge Ledger**: Cryptographically verifiable commit graph enforcing versioned snapshot releases (`v1.0.0`).
* **8-Stage Learning Lifecycle**: Stage-gated progression from initial understanding down to real-world deployment (`Understanding` → `Practicing` → `Applying` → `Building` → `Reflecting` → `Reviewing` → `Mastering` → `Using in Real Life`).
* **Cognitive Memory Engine**: Ebbinghaus-inspired exponential decay modeling, tracking memory stability ($S$) and retention ($R$) to trigger targeted re-entry refreshers.
* **Mission Control Workspace**: Single-context active workspace focusing user attention on the exact current learning objective.
* **Cryptographic Evidence Verification**: SHA-256 hashed evidence artifacts linked directly to verified knowledge nodes.

---

## 4. NON-GOALS

Eliot strictly rejects features that foster cognitive passivity or artificial engagement:

* **No LMS / Course Marketing**: No course catalogs, instructor storefronts, or passive video playlists.
* **No Gamification**: No artificial point stores, vanity badges, public leaderboards, or manipulative streak counters.
* **No Social / Feed Mechanics**: No chat rooms, social activity feeds, or peer comparison metrics.
* **No AI Ghostwriting**: No automated code generation for user assignments or AI-written reflection responses.
* **No Multi-User SaaS Bloat**: No tenant isolation, team permissions, or organizational management panels.

---

## 5. ARCHITECTURE OVERVIEW

Eliot uses a **Local-First, Event-Driven Full-Stack Architecture** running on React 18, Vite, TypeScript, and Node.js.

```
+-----------------------------------------------------------------------+
|                           USER INTERFACE (UX SHELL)                   |
|       (Operating System Paradigm / FCS Components / Focused Views)    |
+-----------------------------------+-----------------------------------+
                                    |
                                    v
+-----------------------------------------------------------------------+
|                          EVENT BUS (Core Events)                      |
|           (Typed Async Dispatcher / Loose Domain Coupling)             |
+-----------------+-----------------+-----------------+-----------------+
                  |                 |                 |
                  v                 v                 v
+-------------------+     +-------------------+     +-------------------+
|   MEMORY ENGINE   |     | KNOWLEDGE ENGINE  |     |   LEARNING ENGINE |
| (dom-002-memory)  |     |(dom-003-knowledge)|     | (dom-001-learning)|
+-------------------+     +-------------------+     +-------------------+
                  |                 |                 |
                  +-----------------+-----------------+
                                    |
                                    v
+-----------------------------------------------------------------------+
|                     IMMUTABLE KNOWLEDGE LEDGER                        |
|        (Cryptographic Commit Engine / Versioned CKM Snapshots)         |
+-----------------------------------------------------------------------+
```

* **Event-Driven Core**: Domains communicate asynchronously via a strongly typed `EventBus`, preventing tight circular coupling.
* **Domain Service Isolation**: Logic is segregated into 12 self-contained domain modules (`dom-001` through `dom-012`), each defining its interface contract in `contracts/ServiceInterface.ts`.
* **Monadic Error Handling**: Domain operations return explicit `Result<T, E>` types (`Ok` / `Err`), eliminating uncaught runtime exceptions.
* **Local-First Persistence**: State is maintained in client-side memory and local storage with zero cloud dependencies required for core cognitive loops.

---

## 6. DOMAIN OVERVIEW

The Eliot architecture comprises 12 distinct domains:

1. **`dom-001-learning` (Learning Domain)**: Manages the 8-stage learning lifecycle, curriculum progression, and reflection quality validation (`ReflectionQualityValidator`).
2. **`dom-002-memory` (Memory Domain)**: Implements cognitive memory decay calculations, practice event stability updates, and retention floor enforcement.
3. **`dom-003-knowledge` (Knowledge Domain)**: Maintains the conceptual CKM directed graph, prerequisite maps, and mathematical mastery scores ($M_c$).
4. **`dom-004-ai-core` (AI Core Domain)**: Orchestrates LLM prompt execution, Socratic feedback generation, and extraction assistance adhering to the AI Constitution.
5. **`dom-005-project` (Project Domain)**: Manages real-world project deliverables, task requirements, and artifact submission criteria.
6. **`dom-006-career` (Career Domain)**: Maps concept mastery to industry benchmark roles and skill matrices.
7. **`dom-007-dashboard` (Dashboard Domain)**: Controls Mission Control operational state, primary action focus, and workspace frame switching.
8. **`dom-008-navigation` (Navigation Domain)**: Handles ambient spatial transitions across application frames without breaking user focus.
9. **`dom-009-review` (Review Domain)**: Governs candidate knowledge model staging, concept editing, duplicate merging, and validation.
10. **`dom-010-settings` (Settings Domain)**: Manages user environment preferences, language selection, and local persistence options.
11. **`dom-011-evidence` (Evidence Domain)**: Registers evidence artifacts, computes SHA-256 cryptographic hashes, and verifies content integrity.
12. **`dom-012-analytics` (Analytics Domain)**: Tracks cognitive velocity, mastery growth, and evidence density without vanity metrics.

---

## 7. UX PRINCIPLES

1. **Single Active Operational Context**: Every view answers exactly one question (e.g., "What is the current learning objective?").
2. **Low Cognitive Friction**: Eliminate unnecessary modal dialogs, complex multi-step forms, and redundant navigation bars.
3. **Ambient System State**: Progress indicators and attention alerts adapt subtly without interrupting active execution.
4. **Desktop-First Precision, Fluid Responsiveness**: Interfaces are designed for deep workstation focus while remaining responsive on mobile viewports.

---

## 8. DESIGN PRINCIPLES

Eliot implements the **Foundation Component System (FCS)**:

* **Palette**: Warm neutral background palette (`#FBFBF9`, `#F3F3EE`) with deep slate typography (`#1A1A18`) and subtle amber/emerald status accents.
* **Typography**: Plus Jakarta Sans for high-contrast display headings and technical body text; monospace formatting for code and cryptographic hashes.
* **Spacing & Rhythm**: 8px mathematical spatial grid ($8\text{px}, 16\text{px}, 24\text{px}, 32\text{px}, 48\text{px}$).
* **Nested Radius Rule**: Outer container radius minus padding equals inner child radius ($R_{\text{inner}} = R_{\text{outer}} - P$).
* **No AI Slop**: Strict ban on glowing cyan dark modes, arbitrary glassmorphism, heavy drop shadows, or decorative gradients.

---

## 9. LOCALIZATION PRINCIPLES

* **Dual Language Support**: Full internationalization for English (`en`) and Arabic (`ar`).
* **RTL Spatial Mirroring**: Complete Right-to-Left directional layout adaptation for Arabic mode.
* **Context-Driven i18n**: Translations managed via React Context (`LanguageProvider`) without external translation bloat.
* **No Hardcoded UI Text**: All user-facing labels must reference i18n dictionary keys (`src/i18n/locales/en.ts` & `ar.ts`).

---

## 10. TESTING STRATEGY

Eliot employs a deterministic, zero-flakiness automated testing infrastructure:

* **Unit Testing (Vitest)**: Tests domain services, mathematical formulas, validators, and core engines in isolation.
* **Integration Testing (Vitest)**: Verifies multi-stage pipeline flows (`Import → Extraction → Review`, `Review → Commit`, `Commit → Memory`, `Reflection → Evidence → Dashboard`).
* **End-to-End Testing (Playwright)**: Automates multi-scenario browser user journeys across headless Chromium.
* **Coverage Engine (V8)**: Tracks statement, branch, function, and line coverage targets (>70% overall, >90% core domain engines).

---

## 11. IMPORT ENGINE PHILOSOPHY

The Import Engine ingests external knowledge without making assumptions:

* **Provider Abstraction**: Implements `ImportProviderInterface` for uniform asset processing across PDF documents (`pdf-document`) and Markdown repositories (`markdown-folder`).
* **Deterministic Parsing**: Extracts structured text ASTs, code blocks, and metadata without requiring AI execution.
* **Fingerprinting**: Generates SHA-256 fingerprints for source files to prevent duplicate ingestion.
* **Candidate Staging**: Ingested content is converted into Candidate Knowledge Models (CKM-C) that require human approval before entering the active knowledge graph.

---

## 12. CKM PHILOSOPHY

The **Cognitive Knowledge Model (CKM)** replaces linear course sequences with a directed graph of atomic concepts and practical skills:

* **Graph Nodes & Edges**: Concepts are nodes; prerequisite and dependency relationships are directed edges.
* **Immutable Snapshot Commits**: Knowledge graphs are committed as immutable snapshots (`v1.0.0`) in the `KnowledgeLedger`.
* **Mathematical Mastery ($M_c$)**: Concept mastery score is computed dynamically:
  $$M_c = 0.35 \cdot S_c + 0.45 \cdot R_c + 0.20 \cdot E_c$$
  where $S_c$ is skill confidence, $R_c$ is memory retention, and $E_c$ is evidence quality score.

---

## 13. MEMORY ENGINE PHILOSOPHY

Memory is modeled using Ebbinghaus-inspired cognitive decay mechanics:

* **Memory Stability ($S$)**: Increments exponentially with each successful practice event and reflection submission.
* **Retention Score ($R$)**: Decays over elapsed time ($t$) according to stability ($S$):
  $$R(t) = e^{-\frac{t}{S}}$$
* **Decay Cap Floor**: Retention is bounded by a hard floor ($R_{\text{floor}} = 0.35$), preventing permanent loss of core foundational knowledge.
* **Re-Entry Refresher**: When retention drops below the critical threshold ($R < 0.60$), Mission Control automatically queues a targeted refresher session.

---

## 14. CODING STANDARDS

* **Strict TypeScript**: `noImplicitAny`, `strictNullChecks`, and explicit return types required on all public methods.
* **Monadic Results**: Always return `Result<T, E>` for domain service methods—never throw raw exceptions across domain boundaries.
* **Immutable Operations**: Avoid mutating entity state directly; return fresh object copies.
* **Clean Exports**: Every domain module exposes a clean public interface via `index.ts`.

---

## 15. REPOSITORY STRUCTURE

```
/
├── docs/                      # Engineering & Documentation Hierarchy
│   ├── architecture/          # Canonical System Architecture Specs
│   ├── product/               # Product Philosophy & Workflows
│   ├── development/           # Coding Standards & Testing Guidelines
│   ├── adr/                   # Architecture Decision Records (ADR-001..007)
│   ├── archive/               # Historical Sprint Reports & Audits
│   └── README.md              # Documentation Index
├── e2e/                       # Playwright End-to-End Suite
├── src/
│   ├── core/                  # Core Engines (Import, Extraction, Commit, EventBus, AI)
│   ├── domains/               # 12 Segregated Bounded Domain Modules
│   ├── components/            # FCS Component System
│   ├── config/                # Design Tokens & Environment Configuration
│   ├── i18n/                  # Localization Context & Locales (en/ar)
│   ├── test/                  # Test Utilities, Fixtures & Factories
│   ├── tests/integration/     # Multi-Domain Pipeline Tests
│   ├── App.tsx                # Main Application Shell
│   └── main.tsx               # Entry Point
├── PROJECT_BIBLE.md           # Master Project Blueprint (Canonical — single copy)
├── package.json               # Dependencies and Test Scripts
├── vite.config.ts             # Vite Build Configuration
├── vitest.config.ts           # Vitest Test Configuration
└── playwright.config.ts       # Playwright E2E Configuration
```

---

## 16. CONTRIBUTION WORKFLOW

1. **Specification First**: Every major feature addition must derive from a technical specification aligned with this Bible.
2. **Branch Hygiene**: Work must take place on isolated topic branches (`feature/`, `fix/`).
3. **Pre-Commit Verification**: Code must pass `npm run lint` and `npm run test` cleanly before pull request submission.
4. **Zero-Regression Gatekeeping**: PRs that introduce unverified mastery metrics, artificial gamification, or breaking domain contract changes will be immediately rejected.

---

## 17. RELEASE WORKFLOW

1. **Version Tagging**: Releases adhere strictly to Semantic Versioning (`vX.Y.Z`).
2. **Ledger Migration Safety**: New release versions must maintain backward compatibility with existing `KnowledgeLedger` commits.
3. **Automated Verification**: Build pipeline executes full unit, integration, and E2E test suites prior to deployment artifact generation (`npm run build`).
4. **Cloud Run Production Readiness**: Bundled CommonJS server (`dist/server.cjs`) boots on port 3000 behind reverse proxy layer.

---
**END OF PROJECT BIBLE**
