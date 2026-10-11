# ELIOT: CANONICAL DOMAIN MODEL (CDM)
**Document Version:** 1.0  
**Phase:** Phase 3 — Canonical Domain Definition (CDD)  
**Author:** Chief Systems Architect  
**Status:** Permanent Conceptual Specification (Implementation Strictly Forbidden)  

---

## EXECUTIVE OVERVIEW

The **Canonical Domain Model (CDM)** establishes the immutable conceptual boundaries, ownership rules, data responsibilities, inputs/outputs, events, and business constraints for all domains comprising the **Eliot Personal Learning Operating System (PLOS)**.

This model is derived strictly from the **ELIOT_PROJECT_BIBLE.md**, the **ELIOT_PROJECT_UNDERSTANDING_REPORT.md**, and the **ELIOT_ARCHITECTURAL_READINESS_REVIEW.md**. It contains no code, no database schemas, no framework abstractions, and no UI layout implementations. It defines the pure conceptual architecture from which future technical schemas, API contracts, state engines, and prompt definitions will be derived.

---

## SYSTEM DOMAIN REGISTRY

The Eliot Personal Learning Operating System consists of **12 Canonical Domains** (10 mandated core domains + 2 explicitly justified specialized domains):

1. **DOM-001: Learning Domain**
2. **DOM-002: Memory Domain**
3. **DOM-003: Knowledge Domain**
4. **DOM-004: AI Core Domain**
5. **DOM-005: Project Domain**
6. **DOM-006: Career Domain**
7. **DOM-007: Dashboard Domain**
8. **DOM-008: Navigation Domain**
9. **DOM-009: Review Domain**
10. **DOM-010: Settings Domain**
11. **DOM-011: Evidence Domain** *(Justified Addition: Manages physical/digital artifacts produced during practice and projects)*
12. **DOM-012: Analytics & Velocity Domain** *(Justified Addition: Measures true cognitive velocity and mastery trends without vanity metrics)*

---

## CANONICAL DOMAIN DEFINITIONS

### DOM-001: LEARNING DOMAIN

#### DOMAIN ID
`DOM-001`

#### PURPOSE
The Learning Domain governs the user's active pedagogical trajectory. It enforces the 8-Stage Learning Lifecycle ($\text{Understanding} \rightarrow \text{Practicing} \rightarrow \text{Applying} \rightarrow \text{Building} \rightarrow \text{Reflecting} \rightarrow \text{Reviewing} \rightarrow \text{Mastering} \rightarrow \text{Using in Real Life}$), manages curriculum execution, and ensures no learning activity is marked complete without evidence of practical application.

#### RESPONSIBILITIES
- Owns the execution state of learning paths, units, lessons, and exercises.
- Enforces strict sequential progression through the 8-Stage Learning Lifecycle.
- Controls stage-gate transitions based on evidence evaluation and reflection completion.
- Coordinates practical exercise assignments for active learning units.
- Triggers review requests to the Review Domain upon completion of practical stages.

#### NON-RESPONSIBILITIES
- Must NEVER perform evaluation or grading of artifacts (owned by `DOM-009: Review Domain`).
- Must NEVER store persistent historical memory of user mistakes or habits (owned by `DOM-002: Memory Domain`).
- Must NEVER define industry career benchmarks or skill hierarchies (owned by `DOM-006: Career Domain` & `DOM-003: Knowledge Domain`).
- Must NEVER execute AI prompts directly (owned by `DOM-004: AI Core Domain`).

#### OWNED CONCEPTS
- `LearningPath`: The macro pedagogical journey mapped to a specific capability goal.
- `LearningUnit`: A modular node within a learning path representing a distinct subject area.
- `LearningStage`: An instance of one of the 8 stages in the learning lifecycle for a given unit.
- `LearningActivity`: A specific pedagogical task (reading, drill, exercise, reflection) within a stage.
- `StageGate`: The explicit criteria requiring verification before advancing to the next stage.

#### INPUTS
- Target Skill Nodes and Concept Dependencies (from `DOM-003: Knowledge Domain`).
- Career Targets and Competency Requirements (from `DOM-006: Career Domain`).
- Review Verdicts and Constructive Critiques (from `DOM-009: Review Domain`).
- Historical Weaknesses and Pace Adjustments (from `DOM-002: Memory Domain`).

#### OUTPUTS
- Active Learning Context and Current Task State (to `DOM-007: Dashboard Domain`).
- Stage Progression Requests and Artifact Submissions (to `DOM-009: Review Domain`).
- Stage Completion Events and Reflection Logs (to `DOM-002: Memory Domain`).

#### DEPENDENCIES
- `DOM-003: Knowledge Domain` (for domain graph nodes and concept prerequisites).
- `DOM-009: Review Domain` (for stage-gate validation and artifact reviews).
- `DOM-002: Memory Domain` (for historical context and adaptivity input).

#### DEPENDENTS
- `DOM-007: Dashboard Domain` (renders the active learning task).
- `DOM-005: Project Domain` (triggers project milestones linked to learning stages).
- `DOM-012: Analytics Domain` (tracks stage transition velocity).

#### DOMAIN EVENTS
- `LearningPathStarted`
- `LearningStageEntered`
- `PracticalActivityCompleted`
- `StageGateRequested`
- `StageGatePassed`
- `StageGateFailed`
- `LearningUnitCompleted`

#### BUSINESS RULES
1. **Rule of Mandatory Evidence:** No learning activity shall transition out of "Practicing", "Applying", or "Building" without an associated artifact registered in `DOM-011: Evidence Domain`.
2. **Rule of Sequential Gating:** Stages within a LearningUnit must be executed in exact 8-stage order. Skipping stages is strictly forbidden.
3. **Rule of Reflection Prerequisite:** Stage 5 ("Reflecting") must be completed by the user before Stage 6 ("Reviewing") can be initiated.

#### LIFECYCLE
Initialization (Path creation) $\rightarrow$ Active Execution (Navigating 8 stages per unit) $\rightarrow$ Stage Gating (Verification) $\rightarrow$ Completion (Unit mastery recorded) $\rightarrow$ Archival.

#### BOUNDARIES
Starts when a user selects or is assigned a learning path. Ends when all units in the path achieve verified mastery.

#### ARCHITECTURAL NOTES
The Learning Domain is a strict state machine. State transitions must be deterministic and fully auditable.

---

### DOM-002: MEMORY DOMAIN

#### DOMAIN ID
`DOM-002`

#### PURPOSE
The Memory Domain serves as the persistent cognitive repository of the user's entire learning history. It synthesizes skills, evidence, mistakes, reflections, strengths, weaknesses, habits, and confidence trends into an evolving, queryable intelligence base that informs all system decisions.

#### RESPONSIBILITIES
- Owns persistent records of user cognitive history, verified skills, and recurring mistakes.
- Synthesizes qualitative reflections into structured weakness/strength profiles.
- Tracks skill confidence decay over time when skills remain unpracticed.
- Provides contextual memory retrievals to the AI Core Domain to ensure explainable, personalized guidance.
- Logs historical evidence references and past review verdicts.

#### NON-RESPONSIBILITIES
- Must NEVER store raw LLM chat transcripts or conversational buffer logs.
- Must NEVER dictate active UI layouts or presentation logic.
- Must NEVER modify career targets or competency requirements.

#### OWNED CONCEPTS
- `MemoryItem`: An atomic, structured record of cognitive history (e.g., a specific mistake, a proven strength, a reflection insight).
- `SkillConfidenceProfile`: A time-weighted measure of user mastery confidence for a specific skill node.
- `MistakePattern`: A recurring logical, conceptual, or execution error identified across multiple submissions.
- `ReflectionArchive`: Synthesized qualitative self-assessments submitted during Stage 5.
- `CognitiveHabitProfile`: Observations regarding user study pace, execution consistency, and reflection depth.

#### INPUTS
- Reviewed Artifacts and Verdicts (from `DOM-009: Review Domain`).
- Completed Reflections and Stage Events (from `DOM-001: Learning Domain`).
- Project Milestones and Output Proofs (from `DOM-005: Project Domain`).
- AI Context Queries (from `DOM-004: AI Core Domain`).

#### OUTPUTS
- Relevant Historical Context and Weakness Profiles (to `DOM-004: AI Core Domain`).
- Mastery Decay Signals and Review Triggers (to `DOM-001: Learning Domain`).
- Skill Confidence Summaries (to `DOM-006: Career Domain` & `DOM-012: Analytics Domain`).

#### DEPENDENCIES
- `DOM-011: Evidence Domain` (for linking memory items to concrete artifacts).
- `DOM-009: Review Domain` (for ingesting evaluation verdicts).

#### DEPENDENTS
- `DOM-004: AI Core Domain` (requires Memory for personalized reasoning).
- `DOM-001: Learning Domain` (uses Memory for adaptive path adjustments).
- `DOM-006: Career Domain` (uses Memory to map proven capabilities to career readiness).

#### DOMAIN EVENTS
- `MemoryItemCreated`
- `MistakePatternDetected`
- `SkillConfidenceUpdated`
- `SkillConfidenceDecayed`
- `ReflectionSynthesized`

#### BUSINESS RULES
1. **Rule of Structured Storage:** Memory items must be structured into categorized entities (Mistake, Strength, Reflection, SkillState); raw, unparsed text streams are strictly forbidden.
2. **Rule of Evidence Citation:** Every positive skill confidence update in Memory must reference at least one verified artifact ID from `DOM-011: Evidence Domain`.
3. **Rule of Time Decay:** Skill confidence scores must decay at a defined temporal rate unless re-validated through practical execution.

#### LIFECYCLE
Ingestion (Event capture) $\rightarrow$ Synthesis (Categorization & Pattern Extraction) $\rightarrow$ Storage $\rightarrow$ Active Querying $\rightarrow$ Decay/Re-validation.

#### BOUNDARIES
Starts upon the receipt of verified learning events or reviews. Ends nowhere—Memory is permanent for the single user's lifetime.

#### ARCHITECTURAL NOTES
Memory is not chat history. It requires a hybrid vector-relational-graph storage paradigm to support semantic search and conceptual relationships.

---

### DOM-003: KNOWLEDGE DOMAIN

#### DOMAIN ID
`DOM-003`

#### PURPOSE
The Knowledge Domain owns the canonical conceptual map of skills, theories, principles, and domain models. It maintains the master directed graph of prerequisites and conceptual relationships across professional disciplines.

#### RESPONSIBILITIES
- Owns the master skill trees, concept dependencies, and domain knowledge graphs.
- Defines prerequisite constraints between theoretical concepts and practical skills.
- Maintains authoritative definitions, principles, and reference models for learning units.
- Validates structural integrity of learning paths against concept graphs.

#### NON-RESPONSIBILITIES
- Must NEVER track user progression or individual mastery states (owned by `DOM-001` & `DOM-002`).
- Must NEVER evaluate user work (owned by `DOM-009`).
- Must NEVER store personal user notes or reflections (owned by `DOM-002`).

#### OWNED CONCEPTS
- `ConceptNode`: An atomic theoretical topic or principle within a discipline.
- `SkillNode`: A practical capability requiring mastery of one or more ConceptNodes.
- `PrerequisiteEdge`: A directional relationship establishing required prior knowledge before attempting a ConceptNode or SkillNode.
- `DomainGraph`: The complete taxonomy and network of interconnected concepts and skills for a professional field.

#### INPUTS
- Curriculum Domain Specifications (from System Administrative Configurations).
- Skill Mapping Queries (from `DOM-006: Career Domain` & `DOM-001: Learning Domain`).

#### OUTPUTS
- Concept Graph Topology and Prerequisite Chains (to `DOM-001: Learning Domain`).
- Domain Skill Trees (to `DOM-006: Career Domain`).
- Reference Definitions (to `DOM-004: AI Core Domain`).

#### DEPENDENCIES
None (Self-contained foundational domain).

#### DEPENDENTS
- `DOM-001: Learning Domain` (uses Knowledge Graph to construct paths).
- `DOM-006: Career Domain` (maps career roles to Knowledge Graph nodes).
- `DOM-004: AI Core Domain` (references canonical concept definitions).

#### DOMAIN EVENTS
- `ConceptNodeCreated`
- `SkillTreeUpdated`
- `PrerequisiteChainModified`

#### BUSINESS RULES
1. **Rule of Acyclic Graphs:** Prerequisite relationships between concepts must form a Directed Acyclic Graph (DAG). Circular prerequisite chains are strictly illegal.
2. **Rule of Practical Anchor:** Every `ConceptNode` must link to at least one practical `SkillNode`. Pure theory without application is prohibited.

#### LIFECYCLE
Definition $\rightarrow$ Versioning $\rightarrow$ Graph Validation $\rightarrow$ Active Traversal.

#### BOUNDARIES
Starts at discipline definition. Ends at node graph boundary. Does not touch user state.

#### ARCHITECTURAL NOTES
The Knowledge Domain is a read-heavy graph structure. It represents the objective reality of the subject matter.

---

### DOM-004: AI CORE DOMAIN

#### DOMAIN ID
`DOM-004`

#### PURPOSE
The AI Core Domain serves as the intelligent reasoning and pedagogical orchestration engine of Eliot. It observes user activity, synthesizes Memory, conducts Socratic guidance, generates constructive critiques, and enforces the AI Constitution.

#### RESPONSIBILITIES
- Executes reasoning logic for path generation, review criticism, and Socratic guidance.
- Enforces the AI Constitution (Silence, Refusal of direct answers, Socratic questioning, Evidence citation).
- Formulates explainable recommendations backed by `DOM-002: Memory Domain`.
- Generates structured evaluation rubrics and diagnostic feedback for `DOM-009: Review Domain`.

#### NON-RESPONSIBILITIES
- Must NEVER generate code, write essays, or complete project deliverables on behalf of the user.
- Must NEVER store unparsed conversation history as user memory.
- Must NEVER bypass stage-gate rules or directly mutate user database state without domain events.

#### OWNED CONCEPTS
- `PedagogicalPromptTemplate`: A strictly bounded system prompt context enforcing constitutional rules.
- `ReasoningContext`: The assembled payload containing user memory, active task data, and evaluation rubrics.
- `CritiqueOutput`: A structured diagnostic response highlighting strengths, logical gaps, and required corrections.
- `SocraticGuideSession`: An active dialogue instance designed to guide the user to self-discovery.

#### INPUTS
- Active Task and Stage Payload (from `DOM-001: Learning Domain` & `DOM-005: Project Domain`).
- Historical Context and Weakness Profiles (from `DOM-002: Memory Domain`).
- Submission Artifacts (from `DOM-011: Evidence Domain`).
- User Queries (from `DOM-007: Dashboard Domain`).

#### OUTPUTS
- Structured Review Critiques (to `DOM-009: Review Domain`).
- Socratic Counter-Questions (to `DOM-007: Dashboard Domain`).
- Path Adaptation Recommendations (to `DOM-001: Learning Domain`).

#### DEPENDENCIES
- `DOM-002: Memory Domain` (for context retrieval).
- `DOM-011: Evidence Domain` (for artifact inspection).
- `DOM-003: Knowledge Domain` (for authoritative concept definitions).

#### DEPENDENTS
- `DOM-009: Review Domain` (uses AI Core for generating diagnostic reviews).
- `DOM-001: Learning Domain` (uses AI Core for adaptive path recommendations).
- `DOM-007: Dashboard Domain` (displays AI guidance responses).

#### DOMAIN EVENTS
- `AIReasoningInitiated`
- `SocraticResponseGenerated`
- `CritiqueGenerated`
- `AnswerRefusalTriggered`

#### BUSINESS RULES
1. **Rule of Non-Execution:** The AI Core shall strictly refuse any prompt requesting the direct generation of project solutions, code files, or completed exercise answers.
2. **Rule of Socratic Primacy:** When a user asks a direct conceptual question, the AI Core must respond with a diagnostic counter-question designed to test or guide mental model construction.
3. **Rule of Mandatory Citation:** Every critique output must cite at least one specific evidence record or memory record justifying the feedback.

#### LIFECYCLE
Context Assembly $\rightarrow$ Constitutional Guardrail Validation $\rightarrow$ LLM Reasoning Execution $\rightarrow$ Output Structuring $\rightarrow$ Dispatch.

#### BOUNDARIES
Starts at prompt payload construction. Ends at structured response delivery. Does not own database persistence.

#### ARCHITECTURAL NOTES
The AI Core must use strict structured JSON output enforcement and guardrail middleware to guarantee zero policy breaches.

---

### DOM-005: PROJECT DOMAIN

#### DOMAIN ID
`DOM-005`

#### PURPOSE
The Project Domain defines, structures, and manages real-world, authentic project deliverables that serve as the primary validators of user professional competence.

#### RESPONSIBILITIES
- Owns project specifications, deliverable requirements, milestone structures, and real-world criteria.
- Tracks project lifecycle from assignment to milestone submission and final approval.
- Links project deliverables to target skills in `DOM-003: Knowledge Domain`.
- Submits completed project deliverables to `DOM-011: Evidence Domain` and `DOM-009: Review Domain`.

#### NON-RESPONSIBILITIES
- Must NEVER evaluate or grade project deliverables (owned by `DOM-009`).
- Must NEVER store raw file storage blobs directly (owned by `DOM-011`).
- Must NEVER generate project code or assets (strictly forbidden by Law of Non-Dependency).

#### OWNED CONCEPTS
- `ProjectSpec`: The complete specification, scenario description, constraints, and requirements for a real-world project.
- `ProjectMilestone`: A distinct structural phase within a project requiring specific artifact deliverables.
- `ProjectInstance`: An active instance of a project assigned to the user.
- `DeliverableRequirement`: The explicit criteria and format required for a milestone submission.

#### INPUTS
- Target Skill Requirements (from `DOM-001: Learning Domain` & `DOM-006: Career Domain`).
- Review Verdicts (from `DOM-009: Review Domain`).

#### OUTPUTS
- Active Project Deliverable Tasks (to `DOM-007: Dashboard Domain`).
- Submitted Artifacts (to `DOM-011: Evidence Domain`).
- Project Completion Signals (to `DOM-001: Learning Domain` & `DOM-002: Memory Domain`).

#### DEPENDENCIES
- `DOM-003: Knowledge Domain` (for skill dependencies).
- `DOM-011: Evidence Domain` (for artifact registration).
- `DOM-009: Review Domain` (for deliverable evaluation).

#### DEPENDENTS
- `DOM-001: Learning Domain` (integrates projects into Stage 4 "Building").
- `DOM-007: Dashboard Domain` (displays project workspace context).
- `DOM-006: Career Domain` (uses project completion for portfolio building).

#### DOMAIN EVENTS
- `ProjectAssigned`
- `ProjectMilestoneStarted`
- `ProjectDeliverableSubmitted`
- `ProjectMilestoneApproved`
- `ProjectCompleted`

#### BUSINESS RULES
1. **Rule of Authentic Deliverables:** Projects must require real-world, non-trivial artifacts (e.g., runnable code, system architecture diagrams, technical writeups); multiple-choice quizzes are strictly illegal.
2. **Rule of Milestone Locking:** Subsequent project milestones remain locked until prior milestone deliverables receive an "Approved" verdict from `DOM-009`.

#### LIFECYCLE
Assignment $\rightarrow$ Active In-Progress $\rightarrow$ Milestone Submission $\rightarrow$ Review Pending $\rightarrow$ Approved/Revision Required $\rightarrow$ Completion.

#### BOUNDARIES
Starts upon project assignment. Ends upon final project milestone approval.

#### ARCHITECTURAL NOTES
Projects are the sole source of portfolio-grade evidence.

---

### DOM-006: CAREER DOMAIN

#### DOMAIN ID
`DOM-006`

#### PURPOSE
The Career Domain bridges the user's internal learning trajectory with real-world industry benchmarks, professional role standards, and career trajectories.

#### RESPONSIBILITIES
- Owns target career role profiles (e.g., Senior Systems Engineer, Staff AI Architect) and required competency matrices.
- Maps skill nodes from `DOM-003: Knowledge Domain` to professional role requirements.
- Calculates overall career readiness scores based on verified mastery in `DOM-002: Memory Domain`.
- Identifies competency gaps between current user state and target career roles.

#### NON-RESPONSIBILITIES
- Must NEVER create fake job application streaks or superficial networking feeds.
- Must NEVER evaluate user work directly.

#### OWNED CONCEPTS
- `CareerRoleProfile`: Industry benchmark definition for a specific professional title.
- `CompetencyMatrix`: The required set of skills and mastery levels needed for a role profile.
- `CareerReadinessAssessment`: A synthesized measure of user alignment with a target role based on verified evidence.
- `CompetencyGap`: A specific missing or unverified skill required for role readiness.

#### INPUTS
- Target Role Selection (from `DOM-010: Settings Domain` / User Goal).
- Verified Skill States and Confidence Scores (from `DOM-002: Memory Domain`).

#### OUTPUTS
- Required Skill Trees and Targets (to `DOM-001: Learning Domain`).
- Readiness Scores and Gap Analyses (to `DOM-007: Dashboard Domain` & `DOM-012: Analytics Domain`).

#### DEPENDENCIES
- `DOM-003: Knowledge Domain` (for skill definitions).
- `DOM-002: Memory Domain` (for verified skill states).

#### DEPENDENTS
- `DOM-001: Learning Domain` (uses Career targets to construct macro learning paths).
- `DOM-007: Dashboard Domain` (renders career readiness focus).

#### DOMAIN EVENTS
- `CareerTargetSelected`
- `CompetencyGapIdentified`
- `CareerReadinessUpdated`
- `RoleCompetencyAchieved`

#### BUSINESS RULES
1. **Rule of Verified Readiness:** Career readiness percentage must be calculated strictly from skills backed by approved artifacts in `DOM-011`; unverified claims carry zero weight.

#### LIFECYCLE
Target Role Selection $\rightarrow$ Gap Analysis $\rightarrow$ Path Mapping $\rightarrow$ Progressive Competency Verification $\rightarrow$ Role Readiness Achieved.

#### BOUNDARIES
Starts at target role selection. Ends at verified role readiness.

#### ARCHITECTURAL NOTES
The Career Domain gives real-world purpose to the entire learning operating system.

---

### DOM-007: DASHBOARD DOMAIN

#### DOMAIN ID
`DOM-007`

#### PURPOSE
The Dashboard Domain presents the single active operational context of Eliot to the user. It enforces the "Single Question Per Screen" UX principle, eliminates visual clutter, and manages the primary interaction workspace.

#### RESPONSIBILITIES
- Owns the focused workspace layout and presentation state.
- Enforces the "Single Question Per Screen" UX law.
- Renders active learning tasks, exercise prompts, project workspaces, and Socratic dialogues.
- Captures user inputs, submissions, and reflection logs for dispatch to core domains.

#### NON-RESPONSIBILITIES
- Must NEVER calculate business logic, mastery scores, or stage transitions internally.
- Must NEVER maintain independent persistent business state (must reflect core domains).
- Must NEVER render traditional multi-widget cluttered SaaS dashboards.

#### OWNED CONCEPTS
- `FocusedWorkspaceView`: The active single-context layout frame currently presented to the user.
- `ActiveContextFrame`: The specific operational question or task payload being displayed.
- `InteractionInputBuffer`: The local capture interface for user submissions and reflections.

#### INPUTS
- Active Task/Stage State (from `DOM-001: Learning Domain`).
- Active Project Deliverable Context (from `DOM-005: Project Domain`).
- AI Responses and Socratic Questions (from `DOM-004: AI Core Domain`).
- Review Critiques (from `DOM-009: Review Domain`).

#### OUTPUTS
- User Submissions and Artifact Actions (to `DOM-011: Evidence Domain` & `DOM-009: Review Domain`).
- User Reflection Entries (to `DOM-001: Learning Domain`).
- Navigation Intent Events (to `DOM-008: Navigation Domain`).

#### DEPENDENCIES
- `DOM-001: Learning Domain`
- `DOM-005: Project Domain`
- `DOM-004: AI Core Domain`
- `DOM-009: Review Domain`

#### DEPENDENTS
- User (Direct Human Interface).

#### DOMAIN EVENTS
- `WorkspaceViewRendered`
- `UserSubmissionAttempted`
- `ReflectionInputEntered`

#### BUSINESS RULES
1. **Rule of Single Cognitive Focus:** The Dashboard Domain is forbidden from rendering more than one primary task, exercise, or project workspace simultaneously. Multi-widget clutter is an architectural defect.

#### LIFECYCLE
Context Reception $\rightarrow$ View Framing $\rightarrow$ User Interaction Capture $\rightarrow$ Event Dispatch $\rightarrow$ View Refresh.

#### BOUNDARIES
Starts at user interface rendering. Ends at event dispatch to core backend domains.

#### ARCHITECTURAL NOTES
The Dashboard is a pure projection view of the system's active state machine.

---

### DOM-008: NAVIGATION DOMAIN

#### DOMAIN ID
`DOM-008`

#### PURPOSE
The Navigation Domain manages view state transitions, routing, and operational context switches. It enforces the "Invisible Navigation" UX law, ensuring state switches support mental models without distracting visual chrome.

#### RESPONSIBILITIES
- Owns application routing state, view transition stack, and workspace focus switches.
- Enforces seamless, ambient transitions between learning stages, projects, and settings.
- Manages back-stack history and deep-linking context frames.

#### NON-RESPONSIBILITIES
- Must NEVER contain business logic or stage gating rules.
- Must NEVER render navigation bars packed with traditional multi-tab links.

#### OWNED CONCEPTS
- `NavigationStack`: The ordered history of focused workspace contexts.
- `RouteIntent`: An explicit request to switch workspace focus.
- `WorkspaceTransition`: The ambient visual/logical shift from one focus state to another.

#### INPUTS
- User Navigation Actions (from `DOM-007: Dashboard Domain`).
- Automatic State Shift Signals (from `DOM-001: Learning Domain` upon stage completion).

#### OUTPUTS
- View Frame Switch Commands (to `DOM-007: Dashboard Domain`).

#### DEPENDENCIES
None (Pure UI state management domain).

#### DEPENDENTS
- `DOM-007: Dashboard Domain` (uses Navigation Domain for layout switching).

#### DOMAIN EVENTS
- `NavigationRequested`
- `WorkspaceFocusShifted`
- `BackStackPopped`

#### BUSINESS RULES
1. **Rule of Invisible Navigation:** Navigation controls must remain ambient and secondary to the active workspace task. Persistent, heavy top/side navigation panels are prohibited.

#### LIFECYCLE
Intent Capture $\rightarrow$ Transition Validation $\rightarrow$ Focus Shift $\rightarrow$ Stack Update.

#### BOUNDARIES
Starts at route intent. Ends at active view activation.

#### ARCHITECTURAL NOTES
Navigation should operate like a minimalist window manager state engine.

---

### DOM-009: REVIEW DOMAIN

#### DOMAIN ID
`DOM-009`

#### PURPOSE
The Review Domain evaluates all user submissions (exercises, code artifacts, project deliverables, reflections) against strict rubrics and evidence standards, producing diagnostic verdicts and constructive critiques.

#### RESPONSIBILITIES
- Owns review evaluation pipelines, rubric checks, and verdict generation.
- Coordinates with `DOM-004: AI Core Domain` to execute deep diagnostic criticism.
- Issues binding verdicts (`Approved`, `Revision Required`, `Rejected`).
- Generates required corrective action steps for submissions needing revision.

#### NON-RESPONSIBILITIES
- Must NEVER grant unearned approvals or issue superficial praise.
- Must NEVER modify curriculum paths directly (issues events that `DOM-001` consumes).

#### OWNED CONCEPTS
- `ReviewSubmission`: A payload containing submitted evidence artifacts and reflection logs awaiting evaluation.
- `EvaluationRubric`: The objective criteria used to judge submission quality.
- `ReviewVerdict`: The binding outcome of an evaluation (`Approved`, `Revision Required`).
- `DiagnosticCritique`: Detailed analysis of strengths, errors, and required fixes.

#### INPUTS
- Stage Gate Verification Requests (from `DOM-001: Learning Domain`).
- Project Milestone Submissions (from `DOM-005: Project Domain`).
- Submission Artifacts (from `DOM-011: Evidence Domain`).

#### OUTPUTS
- Verdicts and Critiques (to `DOM-001: Learning Domain`, `DOM-005: Project Domain`, & `DOM-002: Memory Domain`).

#### DEPENDENCIES
- `DOM-004: AI Core Domain` (for diagnostic reasoning).
- `DOM-011: Evidence Domain` (for artifact retrieval).

#### DEPENDENTS
- `DOM-001: Learning Domain` (uses verdicts for stage gating).
- `DOM-005: Project Domain` (uses verdicts for milestone approval).
- `DOM-002: Memory Domain` (stores verdicts in historical memory).

#### DOMAIN EVENTS
- `ReviewInitiated`
- `RubricEvaluated`
- `VerdictRenderedApproved`
- `VerdictRenderedRevisionRequired`

#### BUSINESS RULES
1. **Rule of Uncompromising Standards:** Submissions failing any mandatory rubric point must receive a `Revision Required` verdict along with specific actionable critique.
2. **Rule of Immutable Verdicts:** Rendered verdicts and their associated critiques cannot be deleted or overwritten; they remain permanent evidence records in Memory.

#### LIFECYCLE
Submission Receipt $\rightarrow$ Rubric Fetch $\rightarrow$ AI Diagnostic Execution $\rightarrow$ Verdict Rendering $\rightarrow$ Event Dispatch.

#### BOUNDARIES
Starts at review request. Ends at verdict publication.

#### ARCHITECTURAL NOTES
The Review Domain is the central quality gatekeeper of the operating system.

---

### DOM-010: SETTINGS DOMAIN

#### DOMAIN ID
`DOM-010`

#### PURPOSE
The Settings Domain manages single-user environment parameters, system preferences, target career selection, data export/reset controls, and AI behavior bounds.

#### RESPONSIBILITIES
- Owns single-user profile parameters, system preferences, and target goal configurations.
- Controls system reset, data archive, and evidence export operations.
- Manages AI tone and feedback intensity preferences within constitutional boundaries.

#### NON-RESPONSIBILITIES
- Must NEVER support multi-user account switching or multi-tenant user management in current single-user release.

#### OWNED CONCEPTS
- `UserProfile`: Single-user identity configuration and baseline goals.
- `SystemPreferences`: Operational settings (theme mode, notification bounds, workspace density).
- `AIInteractionPreferences`: Configured boundaries for AI Socratic intensity within constitutional limits.

#### INPUTS
- User Preference Modifications (from `DOM-007: Dashboard Domain`).

#### OUTPUTS
- Environment Settings (to all domains).
- Career Target Selections (to `DOM-006: Career Domain`).

#### DEPENDENCIES
None.

#### DEPENDENTS
- All domains (read system configuration).

#### DOMAIN EVENTS
- `SettingsUpdated`
- `CareerTargetChanged`
- `SystemDataResetInitiated`

#### BUSINESS RULES
1. **Rule of Single-User Purity:** The Settings Domain must enforce environment bounds for exactly one primary user.

#### LIFECYCLE
Initialization $\rightarrow$ Modification $\rightarrow$ Persistence $\rightarrow$ System Propagation.

#### BOUNDARIES
Starts at setting configuration. Ends at preference application.

#### ARCHITECTURAL NOTES
Settings govern operating system environmental parameters.

---

### DOM-011: EVIDENCE DOMAIN *(JUSTIFIED ADDITIONAL DOMAIN)*

#### DOMAIN ID
`DOM-011`

#### PURPOSE
**Justification:** The core philosophy mandates that *evidence produces confidence* and *no activity is complete without verifiable evidence*. A dedicated domain is required to own, index, store, verify, and retrieve physical and digital artifacts (code submissions, architectural diagrams, technical documents) produced during practical work and projects.

#### RESPONSIBILITIES
- Owns evidence artifact registration, content hashing, metadata indexing, and storage reference linkage.
- Guarantees artifact immutability and proof of authorship.
- Provides artifact payloads to `DOM-009: Review Domain` for inspection.

#### NON-RESPONSIBILITIES
- Must NEVER evaluate artifact quality or correctness (owned by `DOM-009`).
- Must NEVER modify learning stage state.

#### OWNED CONCEPTS
- `EvidenceArtifact`: An immutable digital submission (code file, document, diagram) produced by the user.
- `ArtifactMetadata`: Content hash, timestamp, media type, size, and author signature.
- `EvidenceCollection`: A grouped set of artifacts satisfying a project deliverable or exercise.

#### INPUTS
- User Submissions (from `DOM-007: Dashboard Domain` / `DOM-005: Project Domain`).

#### OUTPUTS
- Artifact Payloads (to `DOM-009: Review Domain` & `DOM-004: AI Core Domain`).
- Verified Evidence References (to `DOM-002: Memory Domain`).

#### DEPENDENCIES
None.

#### DEPENDENTS
- `DOM-009: Review Domain` (inspects artifacts).
- `DOM-002: Memory Domain` (cites artifacts).
- `DOM-005: Project Domain` (binds deliverables to artifacts).

#### DOMAIN EVENTS
- `EvidenceArtifactRegistered`
- `EvidenceHashVerified`
- `EvidenceCollectionAssembled`

#### BUSINESS RULES
1. **Rule of Immutability:** Registered evidence artifacts cannot be edited or overwritten. Submitting a revised artifact creates a new versioned artifact record.

#### LIFECYCLE
Submission $\rightarrow$ Hashing & Registration $\rightarrow$ Storage Linkage $\rightarrow$ Inspection Query $\rightarrow$ Permanent Archival.

#### BOUNDARIES
Starts at artifact upload/submission. Ends at storage registration.

#### ARCHITECTURAL NOTES
Evidence Artifacts form the user's permanent, tamper-proof professional portfolio.

---

### DOM-012: ANALYTICS & VELOCITY DOMAIN *(JUSTIFIED ADDITIONAL DOMAIN)*

#### DOMAIN ID
`DOM-012`

#### PURPOSE
**Justification:** Core principles strictly prohibit vanity metrics, artificial streaks, and fake gamification. A dedicated Analytics domain is required to compute legitimate, objective metrics: true cognitive velocity, stage completion duration, skill mastery retention trends, and reflection depth scores.

#### RESPONSIBILITIES
- Computes genuine cognitive velocity and learning pace.
- Measures time spent in active practical execution vs. passive reading.
- Tracks skill decay trends across the Knowledge Graph.
- Generates objective, non-gamified progress reports.

#### NON-RESPONSIBILITIES
- Must NEVER generate streak counters, points, leaderboards, or vanity badges.
- Must NEVER display artificial dopamine-inducing animations.

#### OWNED CONCEPTS
- `CognitiveVelocityMetric`: Rate of verified skill node mastery over time.
- `ExecutionRatio`: Ratio of time spent doing practical work vs. resource consumption.
- `MasteryTrend`: Longitudinal measure of skill retention across domains.

#### INPUTS
- Stage Transitions (from `DOM-001: Learning Domain`).
- Skill States and Confidence (from `DOM-002: Memory Domain`).
- Artifact Timestamps (from `DOM-011: Evidence Domain`).

#### OUTPUTS
- Objective Analytical Summaries (to `DOM-007: Dashboard Domain`).

#### DEPENDENCIES
- `DOM-001`, `DOM-002`, `DOM-011`.

#### DEPENDENTS
- `DOM-007: Dashboard Domain`.

#### DOMAIN EVENTS
- `VelocityRecalculated`
- `MasteryTrendUpdated`

#### BUSINESS RULES
1. **Rule of Zero Gamification:** The Analytics Domain is strictly forbidden from outputting streak counts, point scores, or gamified level numbers.

#### LIFECYCLE
Event Aggregation $\rightarrow$ Metric Computation $\rightarrow$ Trend Analysis $\rightarrow$ Reporting.

#### BOUNDARIES
Starts at domain event ingestion. Ends at metric calculation.

#### ARCHITECTURAL NOTES
Analytics must measure substance, not superficial activity.

---

## CROSS DOMAIN ANALYSIS

```
+-----------------------------------------------------------------------------------+
|                            CROSS-DOMAIN INTERACTION MAP                           |
+-----------------------------------------------------------------------------------+
| [Learning DOM-001] ----(Request Review)----> [Review DOM-009]                     |
|         |                                          |                              |
|   (Stage Event)                               (Render Verdict)                    |
|         |                                          |                              |
|         v                                          v                              |
| [Memory DOM-002] <---(Store History)-------------+                                |
|         ^                                                                         |
|         |                                                                         |
| (Retrieve Context)                                                                |
|         |                                                                         |
| [AI Core DOM-004] ----(Diagnostic Critique)---> [Review DOM-009]                 |
+-----------------------------------------------------------------------------------+
```

### 1. Interaction & Event Flow Integrity
The domain boundaries establish a clean unidirectional flow:
`Learning Domain` triggers stage activities $\rightarrow$ User submits artifact to `Evidence Domain` $\rightarrow$ `Review Domain` requests diagnostic evaluation from `AI Core Domain` (which queries `Memory Domain`) $\rightarrow$ `Review Domain` issues binding verdict $\rightarrow$ Verdict updates `Memory Domain` and signals `Learning Domain` to advance or hold the stage gate.

### 2. Potential Overlaps & Resolution
- **Overlap:** Potential conflict between `DOM-001: Learning` and `DOM-005: Project` regarding who owns project stage execution.
  - **Resolution:** `DOM-005: Project` owns the project specifications, milestones, and deliverable criteria. `DOM-001: Learning` simply references project milestones during Stage 4 ("Building") as an execution task.
- **Overlap:** Potential conflict between `DOM-002: Memory` and `DOM-009: Review` regarding who owns review verdicts.
  - **Resolution:** `DOM-009: Review` owns the active execution of evaluations and verdict generation. `DOM-002: Memory` stores historical verdict records as permanent memory items.

### 3. Circular Dependency Risk Elimination
- **Risk:** `DOM-001: Learning` $\rightarrow$ `DOM-004: AI Core` $\rightarrow$ `DOM-001: Learning` direct circular calls.
- **Elimination:** `AI Core` never calls `Learning Domain` directly. `AI Core` produces outputs consumed by `Review Domain` or `Dashboard Domain`. `Learning Domain` responds exclusively to domain events (`StageGatePassed`, `VerdictRendered`), preserving asynchronous decoupling.

---
**END OF CANONICAL DOMAIN MODEL**
