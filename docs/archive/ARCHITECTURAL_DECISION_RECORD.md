# ELIOT: ARCHITECTURAL DECISION RECORD (ADR)
**Document Version:** 1.0  
**Phase:** Phase 3.9 — Architectural Decision Record (ADR)  
**Author:** Chief Architecture Historian  
**Status:** Permanent Historical Record (Approved & Immutable Architecture Decisions)  

---

## EXECUTIVE SUMMARY

The **Architectural Decision Record (ADR)** serves as the permanent historical memory of the **Eliot Personal Learning Operating System (PLOS)**. It documents the rationale, context, problem statements, trade-offs, rejected alternatives, long-term impacts, and immutability status of all fundamental architectural decisions approved throughout Phases 1 to 3.5.

This document exists to ensure future system engineers, AI agents, and architects understand *why* Eliot was designed with these specific boundaries, preventing the reopening of finalized architectural decisions without deep comprehension of their underlying philosophy.

---

## ARCHITECTURAL DECISION REGISTRY

---

### ADR-001: PROJECT IDENTITY AS A PERSONAL LEARNING OPERATING SYSTEM (PLOS)

#### Status
Approved

#### Problem
Traditional learning platforms are built as content marketplaces, video streaming hubs, or course completion trackers. They prioritize content consumption and visual streak metrics over cognitive skill acquisition, causing users to collect badges while failing to build real-world capability.

#### Decision
Eliot is explicitly defined and structured as a **Personal Learning Operating System (PLOS)**—a single-user cognitive runtime environment that orchestrates learning trajectories, enforces practical application, preserves long-term cognitive memory, and verifies professional readiness.

#### Rationale
An Operating System controls resources, manages execution states, enforces rules, and provides a continuous environment for work. Framing Eliot as a PLOS aligns system architecture with active execution, state preservation, and structural discipline rather than passive content consumption.

#### Alternatives Considered
1. **Course Marketplace / LMS Model:** Rejected because it treats learning as passive content consumption and lacks system-enforced evidence verification.
2. **Flashcard / Spaced-Repetition App Model:** Rejected because it isolates atomized memory cards from real-world project construction and career competency mapping.

#### Benefits
- Establishes a clear, high-agency architectural focus centered on mastery.
- Eliminates SaaS clutter, vanity badges, and superficial progress metrics.
- Unifies learning, memory, project execution, and career tracking into a single OS environment.

#### Trade-offs
- Requires higher initial architectural complexity than standard course apps.
- Demands active, high-effort user participation rather than passive video watching.

#### Long-term Impact
Permanently defines Eliot as an active cognitive environment rather than a passive learning application.

#### Affected Documents
- `ELIOT_PROJECT_BIBLE.md`
- `CANONICAL_DOMAIN_MODEL.md`

#### Can This Decision Change?
**No.** This is the core identity of the project. Changing it destroys the fundamental premise of Eliot.

#### Notes for Future Architects
Never refactor Eliot into a standard SaaS course platform or learning management system.

---

### ADR-002: SINGLE-USER ARCHITECTURE

#### Status
Approved

#### Problem
Multi-tenant architectures introduce massive initial complexity: user access control lists, tenant data isolation, multi-tenant database partitioning, organization billing, and social feature noise. Building for multi-tenancy early distracts from solving the deep single-user cognitive feedback loop.

#### Decision
Eliot is designed strictly as a **Single-User Architecture**. The runtime environment, memory graph, evidence storage, and state engines operate exclusively for one primary user per instance.

#### Rationale
Cognitive mastery is an deeply personal, high-focus endeavor. Eliminating multi-tenant overhead guarantees zero data leakage, zero multi-user database complexity, maximum local performance, and zero social distraction features (leaderboards, public feeds, social comparison).

#### Alternatives Considered
1. **Multi-Tenant SaaS Architecture:** Rejected due to premature complexity, data isolation overhead, and the distraction of social/multi-user features.

#### Benefits
- Drastically simplifies data storage, domain schemas, and state management.
- Enables local-first, offline-durable data architecture without multi-tenant sync locks.
- Protects user privacy and eliminates social comparison noise.

#### Trade-offs
- Multi-user collaboration or team dashboard capabilities require separate dedicated expansion.

#### Long-term Impact
Ensures all system performance, memory indices, and UI focus are tuned for single-user mastery.

#### Affected Documents
- `ELIOT_PROJECT_BIBLE.md`
- `CANONICAL_DOMAIN_MODEL.md` (DOM-010)
- `SPRINT_0_IMPLEMENTATION_PLAN.md`

#### Can This Decision Change?
**No** for the core engine. Future enterprise variants may wrap instances, but the core engine remains single-user.

#### Notes for Future Architects
Do not introduce multi-user account tables, org hierarchies, or social feeds into the core domain schemas.

---

### ADR-003: AI PHILOSOPHY — SOCRATIC GUIDE & CONSTITUTIONAL BOUNDS

#### Status
Approved

#### Problem
Generative AI tools frequently act as "homework solvers," generating complete code, answers, and essays for users. This creates an illusion of competence while crippling actual human cognitive skill development.

#### Decision
The AI Core (`DOM-004`) operates under a strict **AI Constitution**. AI is strictly constrained to act as a **Socratic Guide** and **Diagnostic Evaluator**. The AI is explicitly forbidden from outputting completed project solutions, writing code deliverables on behalf of the user, or providing unsolicited interruptions.

#### Rationale
Learning occurs when the human brain engages in active retrieval, problem decomposition, and error correction. AI that writes code for the student steals cognitive effort. Socratic questioning forces mental model construction.

#### Alternatives Considered
1. **Generative Autocomplete / Copilot Model:** Rejected because generating full code solutions for students destroys learning efficacy.
2. **Unconstrained Chatbot Assistant:** Rejected because raw LLM chat leads to unstructured distraction, superficial praise, and hallucinations.

#### Benefits
- Guarantees genuine human cognitive growth and problem-solving capability.
- Eliminates AI-induced laziness and false competence.
- Provides deep diagnostic feedback based on objective rubrics.

#### Trade-offs
- Users seeking instant code generation will experience intentional friction.

#### Long-term Impact
Establishes Eliot as an environment where the user builds the skill, not the AI.

#### Affected Documents
- `ELIOT_PROJECT_BIBLE.md`
- `CANONICAL_DOMAIN_MODEL.md` (DOM-004)
- `CANONICAL_WORKFLOWS.md` (WF08, WF19)

#### Can This Decision Change?
**No.** The AI Constitution is immutable.

#### Notes for Future Architects
Never add a "Generate Code Solution" button or feature to the AI Core.

---

### ADR-004: LEARNING PHILOSOPHY — PRACTICAL APPLICATION PRIMACY

#### Status
Approved

#### Problem
Traditional education over-indexes on passive theory (reading books, watching lectures) without immediate practical application. Students retain less than 10% of passively consumed material after 30 days.

#### Decision
Eliot enforces **Practical Application Primacy**. Theoretical understanding (`Stage 1`) must immediately transition into mechanics practice (`Stage 2`), integrated application (`Stage 3`), and project building (`Stage 4`). Reading without building is disallowed from completing learning units.

#### Rationale
Skill mastery requires procedural execution and muscle memory. Theory only makes sense when attached to concrete artifacts created during practical execution.

#### Alternatives Considered
1. **Theory-First Curriculum Model:** Rejected due to low retention rates and lack of verifiable proof of capability.

#### Benefits
- High skill retention and real-world execution capability.
- Produces tangible evidence artifacts for every learning unit.

#### Trade-offs
- Requires active creation of project specifications and practice drill test engines.

#### Long-term Impact
Guarantees every completed unit in Eliot translates directly to functional skill.

#### Affected Documents
- `ELIOT_PROJECT_BIBLE.md`
- `CANONICAL_DOMAIN_MODEL.md` (DOM-001)

#### Can This Decision Change?
**No.** Practical application is a foundational law of the PLOS.

#### Notes for Future Architects
Ensure every learning unit includes required practical drills and project deliverables.

---

### ADR-005: COGNITIVE MEMORY ENGINE & TEMPORAL DECAY MODEL

#### Status
Approved

#### Problem
User memory is treated in standard systems as raw chat logs or simple flashcard databases. Memory decays naturally over time, but standard systems either ignore decay entirely or reset user progress completely during inactive periods.

#### Decision
Eliot establishes a dedicated **Memory Domain (`DOM-002`)** using a structured memory graph (mistakes, strengths, reflections) combined with a **Temporal Decay Engine**. Skill confidence decays gracefully over time ($\text{Confidence}(t) = C_0 \cdot e^{-\lambda t}$), but enforces a **Hard Decay Floor at 35%** to prevent demoralizing returning users. Memory is explicitly NOT raw chat history.

#### Rationale
Skill retention decreases without practice, but foundational knowledge never resets to zero. Capping memory decay at 35% respects past human achievement while accurately signaling the need for brief re-entry refresher drills.

#### Alternatives Considered
1. **Uncapped Exponential Decay (Spaced Repetition Reset):** Rejected because resetting past progress to zero demoralizes users returning after real-life breaks.
2. **No Decay (Static Mastery Flags):** Rejected because it creates a false sense of competence for unpracticed skills.

#### Benefits
- Accurately reflects cognitive decay while protecting user motivation.
- Provides context-aware memory retrieval for AI Socratic guidance.

#### Trade-offs
- Requires background decay calculations and time-weighted confidence profiling.

#### Long-term Impact
Sustains long-term learning trajectories across years of user activity.

#### Affected Documents
- `CANONICAL_DOMAIN_MODEL.md` (DOM-002)
- `CANONICAL_WORKFLOWS.md` (WF09, WF18)
- `SPRINT_0_IMPLEMENTATION_PLAN.md`

#### Can This Decision Change?
The specific decay constant $\lambda$ can be tuned, but the **Hard Decay Floor (35%)** and structured memory paradigm cannot be removed.

#### Notes for Future Architects
Never store raw unparsed LLM chat transcripts as memory items.

---

### ADR-006: EVIDENCE-BASED LEARNING & IMMUTABLE ARTIFACT HASHING

#### Status
Approved

#### Problem
Learners frequently claim mastery based on superficial quizzes or self-assessments without concrete proof of work, leading to resume inflation and gap failures during professional execution.

#### Decision
Eliot establishes the **Rule of Mandatory Evidence** via a dedicated **Evidence Domain (`DOM-011`)**. No stage gate, skill mastery, or career readiness score can be updated without referencing an immutable digital evidence artifact (code, document, architecture diagram) hashed with SHA-256 upon submission.

#### Rationale
Evidence produces genuine confidence. Hashing artifacts ensures proof of authorship, immutability, and tamper-proof portfolio creation.

#### Alternatives Considered
1. **Multiple-Choice Quiz Assessment:** Rejected because quizzes test recognition, not construction capability.
2. **Self-Reported Completion Checkboxes:** Rejected because unverified claims carry zero weight in real-world professional roles.

#### Benefits
- Builds a authentic, tamper-proof portfolio of real-world work.
- Guarantees career readiness percentages reflect actual capability.

#### Trade-offs
- Requires artifact file handling and content hashing infrastructure.

#### Long-term Impact
Provides verified, verifiable proof of human competence.

#### Affected Documents
- `CANONICAL_DOMAIN_MODEL.md` (DOM-011)
- `CANONICAL_WORKFLOWS.md` (WF07)
- `DOMAIN_RELATIONSHIP_MATRIX.md`

#### Can This Decision Change?
**No.** Mandatory evidence is a core architectural law.

#### Notes for Future Architects
All positive skill confidence updates in `DOM-002` must reference a valid `artifact_id` in `DOM-011`.

---

### ADR-007: 8-STAGE LEARNING LIFECYCLE

#### Status
Approved

#### Problem
Learning progression in existing platforms is haphazard, jumping from reading directly to exam tests without structured cognitive stages, causing gaps in conceptual understanding and practical application.

#### Decision
All learning execution in Eliot follows an immutable, sequential **8-Stage Learning Lifecycle**:
$$\text{Understanding (1)} \rightarrow \text{Practicing (2)} \rightarrow \text{Applying (3)} \rightarrow \text{Building (4)} \rightarrow \text{Reflecting (5)} \rightarrow \text{Reviewing (6)} \rightarrow \text{Mastering (7)} \rightarrow \text{Using in Real Life (8)}$$

#### Rationale
Each stage addresses a specific cognitive transformation: mental model construction (1), mechanics (2), integration (3), synthesis (4), metacognition (5), evaluation (6), consolidation (7), and real-world transfer (8). Skipping stages breaks cognitive development.

#### Alternatives Considered
1. **Freeform Unstructured Content Browsing:** Rejected due to cognitive gaps and lack of completion verification.
2. **3-Stage (Read-Quiz-Pass) Model:** Rejected as insufficient for professional-grade skill acquisition.

#### Benefits
- Enforces consistent, predictable pedagogical structure across all subjects.
- Prevents premature advancement without metacognitive reflection and review.

#### Trade-offs
- Strict sequential gating prevents skipping stages within an active unit.

#### Long-term Impact
Serves as the foundational state machine for the entire Learning Domain.

#### Affected Documents
- `ELIOT_PROJECT_BIBLE.md`
- `CANONICAL_DOMAIN_MODEL.md` (DOM-001)
- `CANONICAL_WORKFLOWS.md` (WF03)

#### Can This Decision Change?
**No.** The 8 stages are immutable core philosophy.

#### Notes for Future Architects
The state machine in `LearningStageMachine.ts` must strictly enforce sequential stage transitions 1 through 8.

---

### ADR-008: MOBILE-FIRST READINESS & TOUCH TARGET SCALING

#### Status
Approved

#### Problem
Complex educational applications often degrade into unusable layouts on mobile viewports due to multi-panel desktop clutter, tiny touch controls, and dense navigation sidebars.

#### Decision
Eliot enforces **Mobile-First Readiness** at the architectural level. All workspace views (`DOM-007`) are designed as single-context touch frames with minimum 44px touch targets, fluid layouts, and ambient navigation (`DOM-008`).

#### Rationale
Learning occurs in diverse environments (desktops, tablets, mobile devices). A clean mobile-first layout forces visual simplification, eliminating SaaS clutter and ensuring usability across all device form factors.

#### Alternatives Considered
1. **Desktop-Only Dashboard Layout:** Rejected because it excludes mobile/tablet execution contexts and encourages UI clutter.

#### Benefits
- Clean, focused interface on every screen size.
- Fast rendering performance and low cognitive load.

#### Trade-offs
- Prevents multi-panel dashboard layouts on desktop.

#### Long-term Impact
Ensures Eliot is completely accessible across mobile, tablet, and desktop environments.

#### Affected Documents
- `ELIOT_PROJECT_BIBLE.md`
- `CANONICAL_DOMAIN_MODEL.md` (DOM-007, DOM-008)
- `SPRINT_0_IMPLEMENTATION_PLAN.md`

#### Can This Decision Change?
**No.** Mobile-first responsiveness is a mandatory design constraint.

#### Notes for Future Architects
Ensure all UI buttons maintain minimum 44px touch targets and single-context layouts.

---

### ADR-009: LOCAL-FIRST & OFFLINE-DURABLE ARCHITECTURE

#### Status
Approved

#### Problem
Web applications that rely entirely on persistent server connectivity fail or lock up when the user experiences network drops, high latency, or API service outages.

#### Decision
Eliot implements a **Local-First & Offline-Durable Architecture**. All active stage states, evidence artifacts, user reflections, and memory records are written locally to IndexedDB before any background network sync occurs. AI operations gracefully queue as `Pending Review` during network outages (`WF10`).

#### Rationale
The user's learning flow must never be interrupted by network flakiness. Local storage guarantees instant workspace responsiveness (< 50ms) and complete data ownership by the user.

#### Alternatives Considered
1. **Cloud-First API Architecture:** Rejected because network latency degrades UI responsiveness and network loss causes work loss.

#### Benefits
- Zero data loss during unexpected connection drops.
- Instant workspace loading and snappy user experience.
- Full offline capability for non-AI study and practice activities.

#### Trade-offs
- Requires local storage repository abstraction adapters and sync queue management.

#### Long-term Impact
Establishes Eliot as a reliable, resilient operating system.

#### Affected Documents
- `CANONICAL_DOMAIN_MODEL.md` (DOM-011)
- `CANONICAL_WORKFLOWS.md` (WF10)
- `SPRINT_0_IMPLEMENTATION_PLAN.md`

#### Can This Decision Change?
**No.** Local-first durability is foundational.

#### Notes for Future Architects
Always save state mutations to IndexedDB locally before attempting remote sync.

---

### ADR-010: DOMAIN-DRIVEN ARCHITECTURE (12 CANONICAL DOMAINS)

#### Status
Approved

#### Problem
Monolithic codebases without explicit domain boundaries suffer from spaghetti code, implicit state coupling, unmaintainable features, and multi-owner data race conditions.

#### Decision
Eliot is structured into **12 Canonical Bounded Contexts**:
`DOM-001: Learning`, `DOM-002: Memory`, `DOM-003: Knowledge`, `DOM-004: AI Core`, `DOM-005: Project`, `DOM-006: Career`, `DOM-007: Dashboard`, `DOM-008: Navigation`, `DOM-009: Review`, `DOM-010: Settings`, `DOM-011: Evidence`, `DOM-012: Analytics`.

#### Rationale
Domain-driven design isolates responsibilities, prevents boundary creep, and establishes single data ownership for every conceptual entity in the system.

#### Alternatives Considered
1. **Feature-Folder / Utility-Based Monolith:** Rejected due to coupling, ambiguous entity ownership, and rapid architectural decay.

#### Benefits
- Clean separation of concerns and maintainable modular codebase.
- Clear data ownership boundaries eliminate multi-writer bugs.

#### Trade-offs
- Requires formal contract interfaces (`ServiceInterface.ts`) between domains.

#### Long-term Impact
Guarantees codebase maintainability as Eliot expands.

#### Affected Documents
- `CANONICAL_DOMAIN_MODEL.md`
- `DOMAIN_RELATIONSHIP_MATRIX.md`
- `SPRINT_0_IMPLEMENTATION_PLAN.md`

#### Can This Decision Change?
New specialized domains may be added if explicitly justified, but existing 12 domain boundaries are fixed.

#### Notes for Future Architects
Never bypass domain contract interfaces or write directly to another domain's storage.

---

### ADR-011: CLEAN ARCHITECTURE LAYERING & STRICT BARREL EXPORTS

#### Status
Approved

#### Problem
Direct dependencies between UI components and database infrastructure lead to brittle applications where changing a storage engine or UI framework breaks core business logic.

#### Decision
Eliot enforces a **4-Layer Clean Architecture**:
`Layer 4: Presentation` $\rightarrow$ `Layer 3: Application Services` $\rightarrow$ `Layer 2: Domain Layer` $\rightarrow$ `Layer 1: Infrastructure Layer`.
Inter-domain imports are strictly restricted to domain public gateway barrel exports (`/src/domains/dom-xxx/index.ts`).

#### Rationale
Inner layers (Domain) must remain pure TypeScript without external framework dependencies. Barrel exports enforce strict encapsulated boundaries, preventing outer modules from reaching into internal domain implementations.

#### Alternatives Considered
1. **Ad-hoc Relative Path Imports:** Rejected because deep imports break encapsulation and create hidden circular dependencies.

#### Benefits
- Framework-agnostic business logic.
- Independent testability of core domain rules.

#### Trade-offs
- Requires disciplined import rules and barrel exports.

#### Long-term Impact
Allows UI or infrastructure upgrades without touching domain logic.

#### Affected Documents
- `SPRINT_0_IMPLEMENTATION_PLAN.md`

#### Can This Decision Change?
**No.** Clean layering and barrel export rules are mandatory.

#### Notes for Future Architects
Enforce barrel exports via ESLint rules (`no-restricted-imports`).

---

### ADR-012: ASYNCHRONOUS EVENT-DRIVEN COMMUNICATION

#### Status
Approved

#### Problem
Direct synchronous coupling between domains (e.g., Learning Domain directly calling Review Domain methods) creates tight dependency loops, making the system fragile and prone to circular locks.

#### Decision
Cross-domain state notifications are executed via an **Asynchronous Event Bus** using strongly typed domain events (`StageGateRequested`, `VerdictRendered`, `SkillMastered`, `EvidenceArtifactRegistered`).

#### Rationale
Event-driven architecture decouples event producers from consumers. Domains react independently to state changes without needing direct references to adjacent domain logic.

#### Alternatives Considered
1. **Synchronous Direct Method Call Chains:** Rejected due to high risk of circular dependencies and blocking call stacks.

#### Benefits
- Decoupled, extensible architecture.
- Easy integration of secondary subscribers (e.g., Analytics listening to stage events).

#### Trade-offs
- Requires an event broker and strongly typed payload event schemas.

#### Long-term Impact
Ensures system scalability and zero circular domain dependencies.

#### Affected Documents
- `DOMAIN_RELATIONSHIP_MATRIX.md`
- `WORKFLOW_RELATIONSHIP_MATRIX.md`
- `SPRINT_0_IMPLEMENTATION_PLAN.md`

#### Can This Decision Change?
**No.** Asynchronous domain events are the primary cross-domain communication mechanism.

#### Notes for Future Architects
Always publish a domain event when an entity undergoes a significant state transition.

---

### ADR-013: AI NON-DEPENDENCY PRINCIPLE

#### Status
Approved

#### Problem
If an application cannot function when its underlying AI API is offline, rate-limited, or deprecated, the application is fundamentally fragile and unusable during outages.

#### Decision
Eliot operates on the **AI Non-Dependency Principle**. The core operating system, stage progression, exercise drills, local persistence, and dashboard navigation must remain 100% functional even if external AI APIs are completely disabled or unreachable.

#### Rationale
AI is an advisory and diagnostic enhancement, not the core state machine. All critical learning rules, stage transitions, and test validations are deterministic and self-contained.

#### Alternatives Considered
1. **AI-Dependent App Architecture:** Rejected because external API outages render the application useless.

#### Benefits
- Complete system reliability and resilience.
- Lower operational costs and zero single point of failure.

#### Trade-offs
- Requires static rule-based rubric validators as fallbacks when AI is offline.

#### Long-term Impact
Guarantees Eliot will function reliably for decades regardless of commercial AI API changes.

#### Affected Documents
- `ELIOT_PROJECT_BIBLE.md`
- `CANONICAL_DOMAIN_MODEL.md` (DOM-004)
- `WORKFLOW_GAP_ANALYSIS.md` (GAP-WF-002)

#### Can This Decision Change?
**No.** Non-dependency is a core architectural law.

#### Notes for Future Architects
Never make a core domain state transition strictly dependent on an external LLM network response.

---

### ADR-014: DASHBOARD PHILOSOPHY — SINGLE QUESTION PER SCREEN & ZERO CLUTTER

#### Status
Approved

#### Problem
Traditional SaaS dashboards overwhelm users with multi-widget layouts, sidebar link walls, notification bells, and competing visual charts, inducing cognitive fatigue and distracting focus.

#### Decision
The Dashboard Domain (`DOM-007`) enforces the **Single Question Per Screen** law. At any given moment, the screen renders exactly ONE primary task, exercise, or review context. Persistent navigation bars and widget walls are forbidden.

#### Rationale
Learning requires intense focus. Removing visual clutter reduces cognitive load and directs 100% of the user's attention to solving the current problem.

#### Alternatives Considered
1. **Multi-Widget Portal Dashboard:** Rejected due to visual distraction and split user attention.

#### Benefits
- Maximum user focus and immersion.
- Eliminates SaaS clutter and visual fatigue.

#### Trade-offs
- Requires explicit state priority hierarchy (`WF16`) to select the single active screen context.

#### Long-term Impact
Establishes a signature minimalist UX identity for Eliot.

#### Affected Documents
- `ELIOT_PROJECT_BIBLE.md`
- `CANONICAL_DOMAIN_MODEL.md` (DOM-007)
- `WORKFLOW_GAP_ANALYSIS.md` (GAP-WF-007)

#### Can This Decision Change?
**No.** Single-context focus is non-negotiable.

#### Notes for Future Architects
Do not place secondary stats widgets or sidebars alongside the active workspace screen.

---

### ADR-015: REVIEW PHILOSOPHY — UNCOMPROMISING DIAGNOSTIC STANDARDS

#### Status
Approved

#### Problem
Educational applications frequently grant unearned approvals, issue generic praise ("Great job!"), or pass incomplete submissions to keep users feeling good, creating false confidence.

#### Decision
The Review Domain (`DOM-009`) enforces **Uncompromising Diagnostic Standards**. Evaluations judge submissions strictly against objective rubrics. If any mandatory point fails, the submission receives a `Revision Required` verdict with specific, actionable critique. Superficial praise is banned.

#### Rationale
Rigorous, honest feedback is essential for true skill mastery. Soft approvals allow logical flaws to fester into career-defeating mistakes.

#### Alternatives Considered
1. **Lenient Auto-Pass Model:** Rejected because it creates false confidence and invalidates evidence quality.

#### Benefits
- Guarantees high skill quality and reliable portfolio proof.
- Builds real resilience and error-debugging capability in the learner.

#### Trade-offs
- Users must revise failed work before advancing (`WF17`).

#### Long-term Impact
Ensures an "Approved" verdict from Eliot carries absolute credibility.

#### Affected Documents
- `CANONICAL_DOMAIN_MODEL.md` (DOM-009)
- `CANONICAL_WORKFLOWS.md` (WF08, WF17)

#### Can This Decision Change?
**No.** Standards cannot be compromised.

#### Notes for Future Architects
Never configure the review engine to issue unearned passes or superficial praise.

---

### ADR-016: CAREER GUIDANCE PHILOSOPHY — VERIFIED COMPETENCY MAPPING

#### Status
Approved

#### Problem
Career planning tools rely on self-reported resume skills, superficial job match percentages, or arbitrary quiz scores that fail to reflect actual industry role capabilities.

#### Decision
The Career Domain (`DOM-006`) calculates **Career Readiness** strictly by mapping verified skill masteries (backed by approved artifacts in `DOM-011`) against industry-standard `CareerRoleProfile` competency matrices.

#### Rationale
Real-world readiness is binary: either you have verified proof of capability for a required skill, or you have a competency gap. Unverified claims carry zero weight.

#### Alternatives Considered
1. **Self-Reported Skill Ratings:** Rejected due to inaccurate self-bias and inflation.

#### Benefits
- Transparent, honest measure of job market readiness.
- Direct alignment between daily exercises and ultimate career goals.

#### Trade-offs
- Career readiness percentages increase only through verified artifact approvals.

#### Long-term Impact
Gives clear purpose and measurable direction to all learning paths.

#### Affected Documents
- `CANONICAL_DOMAIN_MODEL.md` (DOM-006)
- `CANONICAL_WORKFLOWS.md` (WF14)

#### Can This Decision Change?
**No.** Career mapping must remain evidence-backed.

#### Notes for Future Architects
Ensure `CareerReadinessAssessment` formulas only count skills backed by approved artifacts.

---

### ADR-017: LONG-TERM EXTENSIBILITY VIA MODULAR DOMAIN PLUGINS

#### Status
Approved

#### Problem
Monolithic architectures become unmodifiable over time as new feature requirements force ugly hacks into core system code.

#### Decision
Eliot's architecture supports **Long-Term Extensibility** by decoupling domain interfaces from internal implementations. New domain modules (e.g., specialized compiler adapters or external repository sync tools) can be plugged in via standard interface contracts without altering core domain state engines.

#### Rationale
Clear domain interfaces (`ServiceInterface.ts`) and event subscriptions allow future expansion while keeping core learning state engines stable and immutable.

#### Alternatives Considered
1. **Tightly Coupled Feature Extensions:** Rejected due to regression risks and architectural decay.

#### Benefits
- High architectural longevity and safe feature additions.

#### Trade-offs
- Requires abstract interface definitions for all service contracts.

#### Long-term Impact
Allows Eliot to evolve for decades without requiring structural rewrites.

#### Affected Documents
- `CANONICAL_DOMAIN_MODEL.md`
- `SPRINT_0_IMPLEMENTATION_PLAN.md`

#### Can This Decision Change?
**No.** Interface-based extension is a core software pattern.

#### Notes for Future Architects
Always define explicit TypeScript interfaces before implementing new subsystem services.

---

### ADR-018: SEPARATION OF CONCERNS — DATA, STATE, AND PRESENTATION

#### Status
Approved

#### Problem
Mixing state management, UI rendering, database persistence, and domain business rules inside single UI components leads to unmaintainable, untestable code.

#### Decision
Eliot enforces strict **Separation of Concerns**. UI components (`DOM-007`) are pure presentation views; state charts (`/src/core/state/`) manage lifecycle transitions; domain services (`/src/domains/`) execute business rules; storage adapters (`/src/core/storage/`) handle persistence.

#### Rationale
Separating concerns ensures each subsystem can be tested, refactored, or replaced independently without triggering breaking changes across the codebase.

#### Alternatives Considered
1. **Fat Component Architecture (React state + business logic in UI):** Rejected due to high bug density and lack of testability.

#### Benefits
- High code quality, easy unit testing, and maintainable state.

#### Trade-offs
- Requires distinct files for types, state machines, domain logic, and UI views.

#### Long-term Impact
Guarantees pristine codebase maintainability.

#### Affected Documents
- `SPRINT_0_IMPLEMENTATION_PLAN.md`

#### Can This Decision Change?
**No.** Separation of concerns is a fundamental software engineering principle.

#### Notes for Future Architects
Keep React components lightweight and free of raw business logic.

---

### ADR-019: DOCUMENTATION-FIRST ARCHITECTURAL APPROACH

#### Status
Approved

#### Problem
Projects that jump directly into writing code without prior formal architecture specification suffer from scope creep, contradictory designs, refactoring loops, and wasted engineering effort.

#### Decision
Eliot enforces a **Documentation-First Architectural Approach**. No line of feature code or UI scaffold is written until all constitutional laws, domain models, interaction matrices, operational workflows, gap audits, and sprint plans are fully defined, audited, and approved.

#### Rationale
Fixing architectural flaws in text specifications costs minutes; fixing architectural flaws in production code costs weeks or months. Thorough specifications guarantee execution speed during implementation.

#### Alternatives Considered
1. **Code-First / Agile Prototyping Approach:** Rejected due to high risk of architectural drift, messy codebases, and philosophy violations.

#### Benefits
- Unambiguous blueprint for future engineering execution.
- Prevents architectural drift and costly code rewrites.

#### Trade-offs
- Demands rigorous initial architectural documentation phases.

#### Long-term Impact
Provides a complete, permanent reference specification suite for the codebase.

#### Affected Documents
- All specification documents (Phases 1 through 3.9).

#### Can This Decision Change?
**No.** Specifications must always precede implementation.

#### Notes for Future Architects
Update architectural specifications before making significant structural code changes.

---

### ADR-020: SPRINT-BASED FOUNDATION RUNTIME PLANNING (SPRINT 0)

#### Status
Approved

#### Problem
Attempting to implement user features before setting up type systems, event buses, state machines, and folder structures leads to inconsistent, uncoordinated code creation.

#### Decision
Implementation begins exclusively with **Sprint 0 — Foundation Runtime Planning**. Sprint 0 focuses 100% on scaffolding core TypeScript interfaces, clean architecture folder boundaries, the Event Bus, state machine engines, and storage adapters. Zero UI feature code is built in Sprint 0.

#### Rationale
A solid runtime foundation ensures that subsequent feature sprints (Sprints 1+) build upon clean, pre-tested infrastructure, preventing foundation rewrites mid-project.

#### Alternatives Considered
1. **Vertical Feature Slicing from Day 1:** Rejected because building UI without underlying event and state infrastructure creates technical debt.

#### Benefits
- Rock-solid runtime infrastructure before UI construction.
- Accelerated development speed for all subsequent feature sprints.

#### Trade-offs
- Postpones visible UI rendering until Sprint 1.

#### Long-term Impact
Guarantees a clean, resilient codebase foundation.

#### Affected Documents
- `SPRINT_0_IMPLEMENTATION_PLAN.md`

#### Can This Decision Change?
**No.** Sprint 0 foundation planning is mandatory before feature execution.

#### Notes for Future Architects
Complete Sprint 0 foundation runtime tasks before commencing Sprint 1 UI features.

---

## ARCHITECTURE CONSISTENCY AUDIT

### 1. Audit Summary
A complete consistency audit was executed across all 20 Architectural Decision Records (ADR-001 through ADR-020) against the project specifications (`ELIOT_PROJECT_BIBLE.md`, `CANONICAL_DOMAIN_MODEL.md`, `CANONICAL_WORKFLOWS.md`, `SPRINT_0_IMPLEMENTATION_PLAN.md`).

### 2. Audit Findings
- **Missing Decisions:** None. All core operational, pedagogical, technical, and UX decisions are fully documented.
- **Conflicting Decisions:** Zero conflicts identified. All decisions strictly reinforce the core philosophy of evidence-backed, single-user learning without AI shortcuts or gamified distraction.
- **Weakly Justified Decisions:** None. Every decision includes explicit rationale, benefits, trade-offs, and rejected alternatives.
- **Decisions Requiring Future Validation (Tuning):**
  - ADR-005 (Memory Decay Engine): Specific decay constant $\lambda$ requires empirical tuning during user testing.
  - ADR-019 (AI Intervention Thresholds): Interaction friction signal sensitivity requires calibration during Sprint 2.

### 3. Immutable Core Decisions (Can Never Change)
The following decisions are permanently locked and cannot be changed without destroying the identity of Eliot:
- **ADR-001:** Project Identity as PLOS
- **ADR-002:** Single-User Architecture
- **ADR-003:** AI Philosophy (Socratic Guide & Refusal Rule)
- **ADR-004:** Practical Application Primacy
- **ADR-006:** Mandatory Evidence & Immutable Hashing
- **ADR-007:** 8-Stage Learning Lifecycle
- **ADR-013:** AI Non-Dependency Principle
- **ADR-014:** Single Question Per Screen Dashboard UX

---
**END OF ARCHITECTURAL DECISION RECORD**
