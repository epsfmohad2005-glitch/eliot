# ELIOT: CANONICAL WORKFLOWS (CW)
**Document Version:** 1.0  
**Phase:** Phase 3.5 — Canonical Workflow Definition (CWD)  
**Author:** Principal Systems Designer  
**Status:** Permanent Operational Specification (Implementation Strictly Forbidden)  

---

## EXECUTIVE OVERVIEW

This document establishes the 20 canonical operational workflows governing the **Eliot Personal Learning Operating System (PLOS)**. These workflows define *how* Eliot operates conceptually across user journeys, AI decision flows, memory updates, learning lifecycles, project milestones, and career progression.

All workflows conform strictly to the **ELIOT_PROJECT_BIBLE.md** and **CANONICAL_DOMAIN_MODEL.md**. They are technology-agnostic, database-free, and code-free, serving as the bridge between domain architecture and future technical state machines.

---

## CANONICAL WORKFLOW DEFINITIONS

---

### WORKFLOW 1: FIRST LAUNCH WORKFLOW

#### Purpose
Initializes the single-user Personal Learning Operating System environment, establishes the user's career baseline, builds the initial memory profile, and generates the macro learning trajectory.

#### Trigger
The single user launches Eliot for the very first time on a fresh environment installation.

#### Preconditions
System installation complete; no prior user state exists in Memory or Settings domains.

#### Actors
- User
- `DOM-010: Settings Domain`
- `DOM-006: Career Domain`
- `DOM-003: Knowledge Domain`
- `DOM-001: Learning Domain`
- `DOM-002: Memory Domain`
- `DOM-004: AI Core Domain`
- `DOM-007: Dashboard Domain`

#### Inputs
- Target Career Role selection (e.g., Staff Systems Engineer)
- Baseline self-assessment inputs
- Available weekly commitment budget

#### Outputs
- Initialized `UserProfile` in `DOM-010`
- Configured Target `CareerRoleProfile` in `DOM-006`
- Initial `CompetencyGap` analysis
- First macro `LearningPath` in `DOM-001`
- Baseline `MemoryItem` records in `DOM-002`

#### Step-by-Step Conceptual Flow
1. User opens Eliot and is presented with a singular diagnostic context: "Define your Target Career Role."
2. User selects or inputs their primary professional target role.
3. `DOM-006: Career Domain` fetches the associated `CompetencyMatrix` from `DOM-003: Knowledge Domain`.
4. Eliot prompts the user for a baseline diagnostic self-assessment on prerequisite skills.
5. `DOM-006: Career Domain` computes the initial `CompetencyGap`.
6. `DOM-001: Learning Domain` constructs the initial macro `LearningPath` addressing the highest-priority competency gaps.
7. `DOM-002: Memory Domain` registers the baseline memory state, recording initial confidence baselines and goals.
8. `DOM-004: AI Core Domain` verifies the path complies with the 8-Stage Learning Lifecycle.
9. `DOM-007: Dashboard Domain` renders the single active workspace view for Stage 1 ("Understanding") of the first `LearningUnit`.

#### Possible Branches
- **Success:** Environment initialized; first learning unit loaded in Stage 1.
- **Failure:** Invalid target role selection or corrupted knowledge graph node; prompts user to re-select valid career profile.
- **Retry:** User modifies initial goal inputs before finalizing.
- **Cancelled:** User exits before completing diagnostic; system remains uninitialized.
- **Interrupted:** Environment closes mid-launch; state drops and restarts on next launch.

#### Business Rules
- Must initialize the environment for exactly one user.
- Cannot skip initial career goal selection.
- First active task must start strictly at Stage 1 ("Understanding").

#### AI Responsibilities
- Evaluates self-assessment answers to prevent unrealistic skill claims without evidence.
- Ensures generated macro path contains no cyclic prerequisite errors.

#### Memory Responsibilities
- Permanently records initial user baseline goals, declared strengths, and target career timestamp.

#### Completion Criteria
First learning unit is active in Stage 1 on the workspace; initial career gap analysis is stored in Memory.

#### Failure Conditions
Incomplete diagnostic inputs or inability to resolve career target against Knowledge Graph nodes.

#### Architectural Notes
First Launch runs exactly once in the lifecycle of a single-user environment installation.

#### Future Engineering Notes
Future state machine implementations must ensure atomic transaction across Settings, Memory, and Learning initialization.

---

### WORKFLOW 2: DAILY SESSION WORKFLOW

#### Purpose
Governs the user's daily entry into Eliot, restoring workspace state, checking for decayed skills, evaluating pending reviews, and presenting the single next actionable task.

#### Trigger
User opens Eliot at the beginning of a working session.

#### Preconditions
System is initialized (First Launch completed); active learning path exists.

#### Actors
- User
- `DOM-007: Dashboard Domain`
- `DOM-001: Learning Domain`
- `DOM-002: Memory Domain`
- `DOM-009: Review Domain`
- `DOM-012: Analytics Domain`

#### Inputs
- Current system timestamp
- Preserved workspace state

#### Outputs
- Focused single-task workspace view
- Refreshed skill decay state
- Session start event

#### Step-by-Step Conceptual Flow
1. User launches Eliot.
2. `DOM-002: Memory Domain` executes background temporal decay check on verified skill confidence profiles.
3. If a critical skill has decayed below threshold, `DOM-002` issues `SkillDecayThresholdBreached` event.
4. `DOM-009: Review Domain` checks for pending evaluation verdicts from prior offline or background reviews.
5. `DOM-001: Learning Domain` determines the highest-priority active task:
   - *Option A:* Unresolved revision required from prior review.
   - *Option B:* Refresher drill for decayed skill.
   - *Option C:* Continuation of active `LearningUnit` at current stage.
6. `DOM-012: Analytics Domain` logs session launch timestamp and updates velocity trends.
7. `DOM-007: Dashboard Domain` renders the single active workspace frame corresponding to the selected task.

#### Possible Branches
- **Success:** Active task presented; session in progress.
- **Interrupted:** Unresolved revision required; workspace forces focus on correcting prior submission.

#### Business Rules
- Must present exactly one primary operational focus upon launch.
- Revision required from a failed review takes absolute priority over new learning units.

#### AI Responsibilities
- Remains silent unless a decay refresher or review revision requires Socratic context.

#### Memory Responsibilities
- Recalculates time-decayed skill scores based on elapsed time since last practice.

#### Completion Criteria
Workspace renders the single active operational context for the day's session.

#### Failure Conditions
Corrupted session state; falls back to last verified stage-gate event in Memory.

#### Architectural Notes
Enforces ambient continuity—the user never asks "What should I do today?".

#### Future Engineering Notes
Session initialization should complete within milliseconds to preserve an instant OS feel.

---

### WORKFLOW 3: LEARNING WORKFLOW

#### Purpose
Guides the user through the active execution of a `LearningUnit` across the 8-Stage Learning Lifecycle.

#### Trigger
User activates or advances into a `LearningUnit`.

#### Preconditions
`LearningUnit` prerequisites are satisfied in `DOM-003: Knowledge Domain`.

#### Actors
- User
- `DOM-001: Learning Domain`
- `DOM-003: Knowledge Domain`
- `DOM-004: AI Core Domain`
- `DOM-007: Dashboard Domain`

#### Inputs
- Active `LearningUnit` ID
- Current `LearningStage` (Stages 1 through 8)

#### Outputs
- Stage completion progress
- Transition request to next stage

#### Step-by-Step Conceptual Flow
1. User enters active `LearningUnit` at Stage 1 ("Understanding").
2. `DOM-001` provides curated conceptual resources from `DOM-003: Knowledge Domain`.
3. User confirms understanding and advances to Stage 2 ("Practicing").
4. `DOM-001` presents targeted mechanics drills.
5. User executes drills and advances to Stage 3 ("Applying").
6. `DOM-001` presents integrated multi-concept exercises.
7. Upon completing exercises, user advances to Stage 4 ("Building") for project deliverable construction.
8. User executes project work and proceeds to Stage 5 ("Reflecting").
9. User submits qualitative reflection, triggering Stage 6 ("Reviewing").
10. `DOM-001` requests review from `DOM-009: Review Domain`.
11. Upon `Approved` verdict, user advances to Stage 7 ("Mastering") where skill state is updated.
12. User advances to Stage 8 ("Using in Real Life") for open-ended professional application.

#### Possible Branches
- **Success:** User completes all 8 stages sequentially.
- **Failure:** Stage 6 review yields `Revision Required`; user returned to Stage 4 or 3 for corrective execution.

#### Business Rules
- Stages must be executed in exact sequential order (1 $\rightarrow$ 8).
- No stage can be skipped or bypassed.

#### AI Responsibilities
- Acts as Socratic guide during conceptual queries in Stages 1-3.

#### Memory Responsibilities
- Records stage entry and exit timestamps.

#### Completion Criteria
All 8 stages for the unit are marked completed with verified evidence.

#### Failure Conditions
Attempting to skip stages or failing review at Stage 6.

#### Architectural Notes
The Learning Workflow is the core state machine of Eliot.

#### Future Engineering Notes
Implement as a strict deterministic state machine with immutable transition logs.

---

### WORKFLOW 4: LESSON COMPLETION WORKFLOW

#### Purpose
Finalizes a specific lesson or activity within a learning stage, verifying local criteria before advancing to the next activity.

#### Trigger
User completes the required interaction for a lesson/activity within a stage.

#### Preconditions
Lesson activity is currently active in `DOM-001`.

#### Actors
- User
- `DOM-001: Learning Domain`
- `DOM-007: Dashboard Domain`

#### Inputs
- Activity completion signal
- Activity interaction payload

#### Outputs
- Updated activity status
- Unlocked next lesson or stage advancement signal

#### Step-by-Step Conceptual Flow
1. User completes interaction for active lesson (e.g., finishes reading conceptual material or completes a drill).
2. User clicks "Complete Lesson" or submits exercise payload.
3. `DOM-001` validates local lesson completion criteria (e.g., non-empty input, minimum time spent).
4. `DOM-001` marks lesson as completed.
5. If more lessons remain in current stage, `DOM-007` renders next lesson.
6. If all lessons in stage are complete, `DOM-001` unlocks stage transition.

#### Possible Branches
- **Success:** Lesson completed; next lesson loaded or stage transition unlocked.
- **Failure:** Incomplete lesson criteria; user prompted to complete required interaction.

#### Business Rules
- Lessons cannot be marked complete without meeting activity interaction rules.

#### AI Responsibilities
- None during basic lesson completion unless Socratic clarification was requested.

#### Memory Responsibilities
- Logs activity duration.

#### Completion Criteria
Lesson state set to completed in active unit.

#### Failure Conditions
Empty submission or unfulfilled interaction requirements.

#### Architectural Notes
Granular inner loop within the broader Learning Workflow.

#### Future Engineering Notes
Keep client-side validation fast and responsive.

---

### WORKFLOW 5: PRACTICE WORKFLOW

#### Purpose
Governs execution of targeted drills during Stage 2 ("Practicing") and Stage 3 ("Applying").

#### Trigger
User enters Stage 2 or Stage 3 of a `LearningUnit`.

#### Preconditions
Stage 1 ("Understanding") completed.

#### Actors
- User
- `DOM-001: Learning Domain`
- `DOM-011: Evidence Domain`
- `DOM-007: Dashboard Domain`

#### Inputs
- Practice drill parameters
- User code/exercise output

#### Outputs
- Registered practice artifact in `DOM-011`
- Drill evaluation status

#### Step-by-Step Conceptual Flow
1. `DOM-001` presents practice drill prompt in workspace.
2. User writes code or constructs exercise solution.
3. User submits practice output.
4. `DOM-011: Evidence Domain` hashes and registers the practice artifact.
5. System validates output against drill test conditions.
6. If tests pass, practice drill is marked complete.
7. If tests fail, user receives error feedback and retries drill.

#### Possible Branches
- **Success:** Drill completed successfully; artifact registered.
- **Failure:** Drill tests fail; user prompted to debug and resubmit.

#### Business Rules
- Multiple-choice answers forbidden; practice must require construction of real outputs.

#### AI Responsibilities
- Offers Socratic diagnostic hints if user fails drill multiple times.

#### Memory Responsibilities
- Records practice drill attempt count and error types.

#### Completion Criteria
All required practice drills in stage passed with registered evidence artifacts.

#### Failure Conditions
Unresolved drill test failures.

#### Architectural Notes
Enforces "No passive learning" principle.

#### Future Engineering Notes
Practice execution requires safe client-side or containerized test execution engine.

---

### WORKFLOW 6: PROJECT WORKFLOW

#### Purpose
Manages the lifecycle of real-world projects during Stage 4 ("Building"), from spec review to milestone submissions and final project completion.

#### Trigger
User advances to Stage 4 ("Building") of a `LearningUnit` or activates a standalone project.

#### Preconditions
Stages 1-3 completed; required skills verified.

#### Actors
- User
- `DOM-005: Project Domain`
- `DOM-011: Evidence Domain`
- `DOM-009: Review Domain`
- `DOM-007: Dashboard Domain`

#### Inputs
- `ProjectSpec` ID
- Milestone deliverable artifacts

#### Outputs
- Milestone completion state
- Approved project evidence portfolio item

#### Step-by-Step Conceptual Flow
1. `DOM-005: Project Domain` loads `ProjectSpec` and renders project workspace in `DOM-007`.
2. User reviews scenario, architecture requirements, and milestone 1 deliverable specs.
3. User constructs project deliverables locally or in workspace.
4. User submits Milestone 1 deliverable.
5. Triggers Evidence Submission Workflow (Workflow 7) and AI Review Workflow (Workflow 8).
6. Upon `Approved` verdict, Milestone 1 is marked complete and Milestone 2 is unlocked.
7. Steps 3-6 repeat for all project milestones.
8. Upon final milestone approval, `DOM-005` emits `ProjectCompleted` event.

#### Possible Branches
- **Success:** All project milestones approved; project complete.
- **Failure:** Deliverable receives `Revision Required`; milestone locked until revised submission approved.

#### Business Rules
- Milestones must be completed sequentially.
- Projects must yield tangible, portfolio-grade artifacts.

#### AI Responsibilities
- Evaluates project deliverables against industry benchmark rubrics in Review Workflow.

#### Memory Responsibilities
- Links approved project artifacts to user's permanent skill portfolio in Memory.

#### Completion Criteria
All project milestones approved by Review Domain.

#### Failure Conditions
Unresolved deliverable revisions or project abandonment.

#### Architectural Notes
Projects are the ultimate validators of professional capability.

#### Future Engineering Notes
Project specifications must be versioned and immutable once started.

---

### WORKFLOW 7: EVIDENCE SUBMISSION WORKFLOW

#### Purpose
Captures, hashes, registers, and verifies the immutability of digital artifacts submitted by the user.

#### Trigger
User submits a file, code repository, or document for an exercise or project deliverable.

#### Preconditions
User is in an active practice, building, or review stage.

#### Actors
- User
- `DOM-011: Evidence Domain`
- `DOM-009: Review Domain`

#### Inputs
- Raw artifact payload (code files, documents, architectural diagrams)
- Submission metadata

#### Outputs
- Immutable `EvidenceArtifact` record with content hash ID
- `EvidenceArtifactRegistered` event

#### Step-by-Step Conceptual Flow
1. User clicks "Submit Deliverable" in workspace.
2. `DOM-011: Evidence Domain` receives raw artifact payload.
3. `DOM-011` computes cryptographic content hash of payload.
4. `DOM-011` checks for duplicate hash conflicts (`EDGE-002`). If identical hash exists from prior submission, raises `ArtifactHashConflictDetected` and rejects submission.
5. `DOM-011` stores artifact payload and metadata, assigning unique `artifact_id`.
6. `DOM-011` emits `EvidenceArtifactRegistered` event.
7. `DOM-009: Review Domain` ingests event and initiates review pipeline.

#### Possible Branches
- **Success:** Artifact registered; review pipeline triggered.
- **Failure:** Duplicate artifact hash detected; submission rejected.

#### Business Rules
- Registered evidence artifacts are immutable and cannot be edited or overwritten.
- Re-submitting modified work creates a new versioned artifact ID.

#### AI Responsibilities
- None during registration.

#### Memory Responsibilities
- None directly (Memory links to artifact ID after review).

#### Completion Criteria
Artifact assigned immutable hash ID and stored in Evidence Domain.

#### Failure Conditions
Duplicate content hash or corrupted payload transfer.

#### Architectural Notes
Ensures tamper-proof proof of authorship.

#### Future Engineering Notes
Use SHA-256 or BLAKE3 content hashing for artifact registration.

---

### WORKFLOW 8: AI REVIEW WORKFLOW

#### Purpose
Executes diagnostic evaluation of submitted evidence artifacts against evaluation rubrics, generating binding verdicts and constructive critique.

#### Trigger
`EvidenceArtifactRegistered` event received by `DOM-009: Review Domain`.

#### Preconditions
Submission artifact exists in `DOM-011`; evaluation rubric exists in `DOM-009` / `DOM-003`.

#### Actors
- `DOM-009: Review Domain`
- `DOM-004: AI Core Domain`
- `DOM-002: Memory Domain`
- `DOM-011: Evidence Domain`

#### Inputs
- `artifact_id`
- `EvaluationRubric`
- User historical memory context

#### Outputs
- `VerdictRendered` event (`Approved` or `Revision Required`)
- `DiagnosticCritique` payload

#### Step-by-Step Conceptual Flow
1. `DOM-009` fetches artifact payload from `DOM-011`.
2. `DOM-009` fetches associated `EvaluationRubric`.
3. `DOM-009` requests context retrieval from `DOM-002: Memory Domain` (user's past mistakes and strengths).
4. `DOM-009` dispatches review evaluation payload to `DOM-004: AI Core Domain`.
5. `DOM-004` evaluates artifact against rubric criteria using Socratic/diagnostic prompt context.
6. `DOM-004` generates structured critique highlighting strengths, logical gaps, and required fixes.
7. `DOM-009` processes AI output and issues binding verdict:
   - *Approved:* All mandatory rubric items satisfied.
   - *Revision Required:* One or more mandatory rubric items failed.
8. `DOM-009` publishes `VerdictRendered` event.

#### Possible Branches
- **Success (Approved):** Verdict published; Stage Gate opens.
- **Success (Revision Required):** Verdict published with corrective steps; workspace locked to revision.
- **Interrupted (AI Outage):** API rate limit or outage (`EDGE-001`); submission set to `Pending Review`; asynchronous retry scheduled.

#### Business Rules
- AI must never grant unearned approvals or output superficial praise.
- Every failure must include specific, actionable, diagnostic critique.

#### AI Responsibilities
- Executes objective rubric evaluation enforcing AI Constitution.

#### Memory Responsibilities
- Ingests review verdict and critique into permanent user history.

#### Completion Criteria
Binding verdict and critique published.

#### Failure Conditions
AI service failure (handled gracefully via retry queue) or malformed evaluation output.

#### Architectural Notes
The central quality gatekeeper of Eliot.

#### Future Engineering Notes
AI response must be forced into strict JSON schema matching `VerdictPayload`.

---

### WORKFLOW 9: MEMORY UPDATE WORKFLOW

#### Purpose
Ingests review verdicts, reflections, and stage completion events, synthesizing them into structured memory items, mistake patterns, and updated skill confidence scores.

#### Trigger
Receipt of `VerdictRendered`, `StageGatePassed`, or `ReflectionInputEntered` events.

#### Preconditions
Valid event payload published by source domain.

#### Actors
- `DOM-002: Memory Domain`
- Source Domains (`DOM-009`, `DOM-001`, `DOM-005`)

#### Inputs
- Domain event payload
- Associated artifact references

#### Outputs
- Updated `SkillConfidenceProfile`
- New `MemoryItem` / `MistakePattern` records

#### Step-by-Step Conceptual Flow
1. `DOM-002: Memory Domain` ingests event payload.
2. If event is `VerdictRendered (Approved)`:
   - Increases confidence score for associated `SkillNode`s.
   - Cites `artifact_id` in skill profile.
3. If event is `VerdictRendered (Revision Required)`:
   - Extracts identified errors and updates or creates a `MistakePattern` entity.
   - Lowers or holds confidence score for affected skills.
4. If event is `ReflectionInputEntered`:
   - Analyzes qualitative reflection text and archives in `ReflectionArchive`.
   - Extracts self-reported confidence and cognitive friction points.
5. `DOM-002` updates persistent memory graph.
6. `DOM-002` emits `SkillConfidenceUpdated` or `MemoryItemCreated` event.

#### Possible Branches
- **Success:** Memory graph updated cleanly.
- **Failure:** Corrupted event payload; event moved to dead-letter queue for reprocessing.

#### Business Rules
- Memory updates must be structured; storing raw conversation transcripts as memory is prohibited.
- Positive confidence updates must reference verified evidence artifact IDs.

#### AI Responsibilities
- Used asynchronously for extracting structured entities from qualitative reflection text.

#### Memory Responsibilities
- Owns persistent data structure and synthesis logic.

#### Completion Criteria
Memory graph successfully updated and saved.

#### Failure Conditions
Invalid event schema or missing artifact reference.

#### Architectural Notes
Ensures memory continuously improves future system decisions.

#### Future Engineering Notes
Execute memory updates asynchronously to prevent blocking UI interactions.

---

### WORKFLOW 10: REVIEW SCHEDULING WORKFLOW

#### Purpose
Schedules, tracks, and triggers asynchronous background review tasks when immediate synchronous evaluation is unavailable or queued.

#### Trigger
Review request issued when AI service is busy, offline, or processing batch submissions.

#### Preconditions
Submission artifact registered in `DOM-011`.

#### Actors
- `DOM-009: Review Domain`
- System Scheduler
- `DOM-007: Dashboard Domain`

#### Inputs
- Pending review task ID
- Retry configuration parameters

#### Outputs
- Scheduled review job
- Status update to workspace view

#### Step-by-Step Conceptual Flow
1. `DOM-009` detects AI service rate limit or deferred evaluation mode.
2. `DOM-009` creates `PendingReviewTask` record and enqueues job in system scheduler.
3. `DOM-007` updates workspace view to display "Review Pending - You will be notified upon completion."
4. User is allowed to engage in non-dependent study activities or exit session.
5. System scheduler triggers review job when service recovers.
6. AI Review Workflow (Workflow 8) executes.
7. Upon verdict publication, `DOM-007` updates view state or alerts user upon next login.

#### Possible Branches
- **Success:** Review executed asynchronously; verdict published.
- **Failure:** Max retries exceeded; flags administrative system alert.

#### Business Rules
- Review scheduling must never auto-approve or bypass evaluation due to delays.

#### AI Responsibilities
- Executes review when triggered by scheduler.

#### Memory Responsibilities
- Logs review delay metrics.

#### Completion Criteria
Scheduled review job completes and renders verdict.

#### Failure Conditions
Persistent service outage exceeding max retry window.

#### Architectural Notes
Guarantees system resilience against external API outages (`EDGE-001`).

#### Future Engineering Notes
Implement exponential backoff retry logic in job queue.

---

### WORKFLOW 11: MASTERY EVALUATION WORKFLOW

#### Purpose
Evaluates holistic skill mastery across multiple verified artifacts, reflections, and project milestones to determine if a `SkillNode` transitions to "Mastered" status.

#### Trigger
Completion of Stage 7 ("Mastering") in a `LearningUnit` or final project milestone approval.

#### Preconditions
Stage 6 review approved; associated evidence artifacts registered.

#### Actors
- `DOM-001: Learning Domain`
- `DOM-002: Memory Domain`
- `DOM-003: Knowledge Domain`
- `DOM-012: Analytics Domain`

#### Inputs
- `SkillNode` ID
- Accumulated artifact history and confidence scores

#### Outputs
- `SkillMastered` event
- Updated Knowledge Graph user overlay

#### Step-by-Step Conceptual Flow
1. `DOM-001` requests holistic mastery evaluation for target `SkillNode`.
2. `DOM-002: Memory Domain` calculates time-weighted confidence score across all historical practice and project artifacts referencing the skill.
3. `DOM-002` verifies that:
   - Minimum required artifact count is met.
   - Latest review verdicts are `Approved`.
   - Confidence score exceeds mastery threshold (e.g., $\ge 85/100$).
   - No unresolved `MistakePattern` exists for this skill.
4. If criteria met, `DOM-002` marks `SkillNode` status as "Mastered".
5. `DOM-001` emits `SkillMastered` event.
6. `DOM-012: Analytics Domain` updates true cognitive velocity trends.

#### Possible Branches
- **Success:** Skill marked Mastered; dependent skills unlocked.
- **Failure:** Mastery criteria unfulfilled; skill remains "In Progress"; additional practice assigned.

#### Business Rules
- Mastery cannot be granted based on a single exercise; requires multi-artifact proof over time.

#### AI Responsibilities
- None (mastery is determined deterministically from evidence metrics in Memory).

#### Memory Responsibilities
- Maintains authoritative skill mastery state.

#### Completion Criteria
`SkillNode` status transitioned to "Mastered" in Memory.

#### Failure Conditions
Insufficient evidence density or presence of active uncorrected mistake patterns.

#### Architectural Notes
Mastery is an objective, evidence-backed status, not an arbitrary claim.

#### Future Engineering Notes
Mastery evaluation algorithms must be deterministic and fully testable.

---

### WORKFLOW 12: SKILL UNLOCK WORKFLOW

#### Purpose
Evaluates the DAG (Directed Acyclic Graph) in `DOM-003: Knowledge Domain` upon skill mastery events to unlock downstream concepts and learning units.

#### Trigger
Receipt of `SkillMastered` event from `DOM-001` / `DOM-002`.

#### Preconditions
A `SkillNode` has achieved verified "Mastered" status.

#### Actors
- `DOM-003: Knowledge Domain`
- `DOM-001: Learning Domain`
- `DOM-006: Career Domain`

#### Inputs
- Mastered `SkillNode` ID

#### Outputs
- List of newly unlocked `SkillNode`s and `LearningUnit`s
- Updated `LearningPath` state

#### Step-by-Step Conceptual Flow
1. `DOM-003: Knowledge Domain` receives `SkillMastered` event.
2. `DOM-003` identifies all downstream dependent nodes connected via `PrerequisiteEdge`s.
3. For each downstream node, `DOM-003` checks if ALL prerequisite nodes are now "Mastered".
4. For nodes where all prerequisites are satisfied, `DOM-003` marks node status as "Unlocked".
5. `DOM-001: Learning Domain` updates macro `LearningPath`, making associated `LearningUnit`s available for enrollment.
6. `DOM-006: Career Domain` recalculates gap progress.

#### Possible Branches
- **Success:** Downstream skills unlocked; learning path updated.
- **No-Op:** Prerequisite chain still has other unmastered nodes; no new skills unlocked yet.

#### Business Rules
- Unlocking is strictly governed by DAG prerequisite completeness. Skipping prerequisites is illegal.

#### AI Responsibilities
- None.

#### Memory Responsibilities
- Logs skill unlock timestamps.

#### Completion Criteria
Downstream nodes evaluated and unlocked where prerequisites are complete.

#### Failure Conditions
Cyclic dependency error in Knowledge Graph (caught during domain validation).

#### Architectural Notes
Ensures structural integrity of learning trajectories.

#### Future Engineering Notes
Graph traversal algorithms must handle deep prerequisite chains efficiently.

---

### WORKFLOW 13: KNOWLEDGE CONSOLIDATION WORKFLOW

#### Purpose
Synthesizes cross-unit learnings, reviews reflection trends, and consolidates mental models during transition phases between major curriculum modules.

#### Trigger
Completion of a major `LearningPath` module or cluster of related units.

#### Preconditions
All units in module completed with verified mastery.

#### Actors
- User
- `DOM-001: Learning Domain`
- `DOM-002: Memory Domain`
- `DOM-004: AI Core Domain`
- `DOM-007: Dashboard Domain`

#### Inputs
- Completed module ID
- Historical reflections and project critiques for module

#### Outputs
- Synthesized mental model summary
- Consolidated memory insights

#### Step-by-Step Conceptual Flow
1. `DOM-001` detects completion of all units in a major module.
2. `DOM-001` initiates Knowledge Consolidation phase.
3. `DOM-004: AI Core` retrieves all reflections and project critiques for the module from `DOM-002`.
4. `DOM-004` generates a diagnostic consolidation workspace presenting key mental models and past friction points overcome.
5. User completes a comparative reflection prompt in `DOM-007`.
6. `DOM-002` archives consolidated insight record.
7. `DOM-001` unlocks next major curriculum module.

#### Possible Branches
- **Success:** Consolidation complete; user advances to next major module.
- **Retry:** User reflection lacks depth; AI prompts Socratic follow-up.

#### Business Rules
- Consolidation must focus on deep conceptual synthesis, not rote repetition.

#### AI Responsibilities
- Synthesizes module history into meaningful comparative insights.

#### Memory Responsibilities
- Permanently stores consolidated milestone reflections.

#### Completion Criteria
Consolidation reflection completed and archived.

#### Failure Conditions
Superficial reflection submitted.

#### Architectural Notes
Reinforces long-term retention and mental model integration.

#### Future Engineering Notes
Consolidation phases act as natural resting points between intense project modules.

---

### WORKFLOW 14: CAREER PROGRESSION WORKFLOW

#### Purpose
Recalculates real-world career readiness scores, updates competency matrices, and highlights remaining skill gaps as mastery events occur.

#### Trigger
Receipt of `SkillMastered` or `ProjectCompleted` events.

#### Preconditions
Active target `CareerRoleProfile` selected in `DOM-006`.

#### Actors
- `DOM-006: Career Domain`
- `DOM-002: Memory Domain`
- `DOM-003: Knowledge Domain`
- `DOM-012: Analytics Domain`

#### Inputs
- `SkillMastered` or `ProjectCompleted` event payload
- Target `CareerRoleProfile`

#### Outputs
- Updated `CareerReadinessAssessment` percentage
- Updated `CompetencyGap` report

#### Step-by-Step Conceptual Flow
1. `DOM-006: Career Domain` ingests mastery or project event.
2. `DOM-006` fetches required `CompetencyMatrix` for active `CareerRoleProfile`.
3. `DOM-006` checks verified mastery status in `DOM-002` for all required skills.
4. `DOM-006` recalculates overall career readiness percentage:
   $$\text{Readiness \%} = \frac{\sum \text{Verified Mastered Role Skills}}{\text{Total Required Role Skills}} \times 100$$
5. `DOM-006` updates `CompetencyGap` report, removing newly mastered skills.
6. `DOM-006` emits `CareerReadinessUpdated` event.
7. If readiness reaches 100%, emits `RoleCompetencyAchieved` event.

#### Possible Branches
- **Success:** Readiness score updated; gap report refreshed.
- **Milestone Reached:** 100% readiness achieved for target role.

#### Business Rules
- Career readiness must be computed strictly from verified evidence in Memory; unverified claims carry zero weight.

#### AI Responsibilities
- None.

#### Memory Responsibilities
- Stores historical career readiness progression curve.

#### Completion Criteria
Career readiness score and gap analysis updated.

#### Failure Conditions
Unresolved or unverified skill claims.

#### Architectural Notes
Connects daily execution directly to professional career goals.

#### Future Engineering Notes
Keep readiness calculation deterministic and fully transparent to user.

---

### WORKFLOW 15: GOAL PLANNING WORKFLOW

#### Purpose
Allows the user to adjust target career roles, set time commitments, or re-prioritize learning trajectories.

#### Trigger
User initiates goal modification in `DOM-010: Settings Domain` or completes a target role.

#### Preconditions
System initialized.

#### Actors
- User
- `DOM-010: Settings Domain`
- `DOM-006: Career Domain`
- `DOM-001: Learning Domain`
- `DOM-002: Memory Domain`

#### Inputs
- New target `CareerRoleProfile` selection or commitment budget change

#### Outputs
- Updated `CareerRoleProfile` in `DOM-006`
- Re-aligned macro `LearningPath` in `DOM-001`

#### Step-by-Step Conceptual Flow
1. User enters Goal Planning context in workspace (`DOM-007`).
2. User selects new target career role or adjusts weekly time commitment.
3. `DOM-010` notifies `DOM-006: Career Domain`.
4. `DOM-006` executes Gap Analysis against user's existing verified skills in `DOM-002`.
5. `DOM-001: Learning Domain` adjusts or regenerates macro `LearningPath` to address new gap priorities (`EDGE-003`).
6. Previously verified skill masteries in `DOM-002` remain intact.
7. Workspace updates to present the first task of the re-aligned path.

#### Possible Branches
- **Success:** Goal updated; learning path re-aligned seamlessly.
- **Cancelled:** User exits planning view without saving changes.

#### Business Rules
- Changing career goals must NEVER delete or invalidate previously verified skill masteries in Memory.

#### AI Responsibilities
- Assists in explaining competency gaps for newly selected roles.

#### Memory Responsibilities
- Preserves all historical evidence regardless of target role changes.

#### Completion Criteria
New career goal saved and macro learning path re-aligned.

#### Failure Conditions
Invalid role selection or unpersisted setting changes.

#### Architectural Notes
Supports evolving career ambitions while preserving historical proof of capability.

#### Future Engineering Notes
Path re-alignment should archive old paths without deleting historical logs.

---

### WORKFLOW 16: DASHBOARD REFRESH WORKFLOW

#### Purpose
Updates and renders the workspace view, ensuring compliance with the "Single Question Per Screen" UX law whenever domain state changes.

#### Trigger
Domain state change events (`StageGateEntered`, `VerdictRendered`, `WorkspaceFocusShifted`).

#### Preconditions
Active workspace view frame exists.

#### Actors
- `DOM-007: Dashboard Domain`
- Core Engine Domains

#### Inputs
- Active task context payload
- View frame specification

#### Outputs
- Updated `FocusedWorkspaceView` rendered on display

#### Step-by-Step Conceptual Flow
1. `DOM-007` receives domain state update event.
2. `DOM-007` fetches active task context payload from responsible domain (`DOM-001`, `DOM-005`, or `DOM-009`).
3. `DOM-007` clears non-active elements, enforcing single-context layout.
4. `DOM-007` renders new `FocusedWorkspaceView` displaying exactly one primary task, exercise, or review context.
5. `DOM-007` presents primary input/interaction control.

#### Possible Branches
- **Success:** View refreshed cleanly; single focus maintained.
- **Error:** Invalid task payload; falls back to error recovery view frame.

#### Business Rules
- Dashboard MUST NOT render multi-widget dashboard clutter or competing task panels.

#### AI Responsibilities
- None during layout rendering.

#### Memory Responsibilities
- None.

#### Completion Criteria
Workspace view updated with single operational focus.

#### Failure Conditions
Attempting to render multi-task or conflicting layout contexts.

#### Architectural Notes
Ensures absolute alignment with UX Philosophy.

#### Future Engineering Notes
Implement reactive, single-frame component rendering.

---

### WORKFLOW 17: FAILURE & RECOVERY WORKFLOW

#### Purpose
Handles submission review failures, guides user through revision execution, and corrects mistaken mental models.

#### Trigger
Receipt of `VerdictRendered (Revision Required)` event from `DOM-009: Review Domain`.

#### Preconditions
User submission evaluated and failed mandatory rubric points.

#### Actors
- User
- `DOM-001: Learning Domain`
- `DOM-009: Review Domain`
- `DOM-004: AI Core Domain`
- `DOM-007: Dashboard Domain`

#### Inputs
- Failed `submission_id`
- `DiagnosticCritique` and corrective steps array

#### Outputs
- Workspace focused on revision task
- Updated mistake records in Memory

#### Step-by-Step Conceptual Flow
1. `DOM-009` issues `VerdictRendered (Revision Required)` event.
2. `DOM-001: Learning Domain` locks stage gate and transitions unit state to "Revision Required".
3. `DOM-007: Dashboard Domain` renders Revision Workspace view.
4. Workspace presents diagnostic critique highlighting exact logical gaps and specific corrective actions needed.
5. User reviews critique and can invoke Socratic dialogue with `DOM-004: AI Core` for conceptual guidance.
6. User modifies code/deliverable to address identified errors.
7. User resubmits revised deliverable (Triggers Workflow 7 & 8).

#### Possible Branches
- **Success:** Revised submission approved; stage gate unlocked.
- **Repeated Failure:** Second revision fails; AI Core provides deeper diagnostic breakdown or assigns prerequisite drill.

#### Business Rules
- Failed submissions MUST be revised and approved before advancing; bypassing failed reviews is strictly forbidden.

#### AI Responsibilities
- Provides diagnostic critique and Socratic clarification; strictly refuses to supply corrected code.

#### Memory Responsibilities
- Records mistake pattern and tracks revision attempt count.

#### Completion Criteria
Revised deliverable receives `Approved` verdict from Review Domain.

#### Failure Conditions
User attempts to bypass revision view without resubmitting.

#### Architectural Notes
Transforms errors into primary learning opportunities.

#### Future Engineering Notes
Revision views must clearly diff prior failed submission against critique points.

---

### WORKFLOW 18: LONG INACTIVITY WORKFLOW

#### Purpose
Handles user return after an extended period of inactivity (e.g., weeks or months), calculating skill decay and presenting a gentle re-entry path.

#### Trigger
User launches Eliot after an elapsed time exceeding inactivity threshold (e.g., > 14 days).

#### Preconditions
System initialized; prior memory state exists.

#### Actors
- User
- `DOM-002: Memory Domain`
- `DOM-001: Learning Domain`
- `DOM-007: Dashboard Domain`
- `DOM-004: AI Core Domain`

#### Inputs
- Elapsed time delta since last session timestamp

#### Outputs
- Recalculated skill confidence scores
- Re-entry refresher workspace frame

#### Step-by-Step Conceptual Flow
1. User launches Eliot after 30 days of inactivity.
2. `DOM-002: Memory Domain` calculates elapsed time delta.
3. `DOM-002` applies temporal decay functions across all verified skill confidence profiles.
4. `DOM-002` identifies top 1-2 core skills that have decayed below confidence thresholds.
5. `DOM-001: Learning Domain` constructs a brief, low-stakes "Re-entry Refresher Drill" covering decayed core concepts.
6. `DOM-007: Dashboard Domain` presents Re-entry Workspace view: "Welcome back. Let's start with a brief 5-minute refresher on core concepts before resuming your project."
7. User completes refresher drill.
8. Skill confidence restored; user returned to active `LearningUnit` stage.

#### Possible Branches
- **Success:** Refresher completed; confidence restored; normal learning resumed.
- **Bypass Allowed:** User chooses to attempt active project task immediately; if project task fails, refresher becomes mandatory.

#### Business Rules
- Must welcome user calmly without guilt messages, artificial streak-loss warnings, or punitive notifications.

#### AI Responsibilities
- Generates targeted, encouraging Socratic refresher questions.

#### Memory Responsibilities
- Updates decay metrics based on elapsed time.

#### Completion Criteria
Refresher completed or active task successfully resumed.

#### Failure Conditions
Severe skill degradation causing repeated failure on active tasks (triggers structured path rollback).

#### Architectural Notes
Rejects guilt-based notification loops; respects human life interruptions.

#### Future Engineering Notes
Decay algorithms should cap maximum decay to prevent resetting a user to complete zero.

---

### WORKFLOW 19: AI INTERVENTION WORKFLOW

#### Purpose
Triggers Socratic guidance or path adaptation when the system detects user frustration, looping errors, or superficial reflections.

#### Trigger
Detection of 3+ consecutive failed drill attempts, repeated submission errors, or superficial reflection text (< 20 words).

#### Preconditions
User is actively engaged in workspace interaction.

#### Actors
- `DOM-004: AI Core Domain`
- `DOM-001: Learning Domain`
- `DOM-002: Memory Domain`
- `DOM-007: Dashboard Domain`

#### Inputs
- Interaction friction signals (attempt counts, error logs, reflection length)

#### Outputs
- Socratic intervention prompt
- Adaptive path adjustment request

#### Step-by-Step Conceptual Flow
1. `DOM-001` or `DOM-009` detects interaction friction signal (e.g., user failed same practice drill 3 times).
2. Domain emits `InteractionFrictionDetected` event.
3. `DOM-004: AI Core Domain` intercepts event and analyzes user's past `MistakePattern`s in `DOM-002`.
4. `DOM-004` generates a targeted Socratic intervention payload:
   - "I notice you're encountering an issue with pointer references. Let's step back: What happens to memory allocation when this variable goes out of scope?"
5. `DOM-007: Dashboard Domain` displays intervention panel above exercise canvas.
6. User responds to Socratic question, clarifying mental model.
7. User resumes exercise with corrected understanding.

#### Possible Branches
- **Success:** Socratic dialogue resolves mental block; user completes exercise.
- **Escalation:** User remains blocked; AI Core recommends temporary pause or prerequisite refresher unit.

#### Business Rules
- AI intervention MUST use Socratic questioning; strictly forbidden from providing direct code answers.

#### AI Responsibilities
- Detects cognitive friction and delivers targeted mental model guidance.

#### Memory Responsibilities
- Logs friction event and successful resolution strategy.

#### Completion Criteria
User completes exercise or accepts recommended refresher unit.

#### Failure Conditions
User ignores intervention and continues blindly guessing (workspace locks to mandatory Socratic step after 5 failures).

#### Architectural Notes
Protects learning quality by preventing blind guess-and-check habits.

#### Future Engineering Notes
Friction detection thresholds should be configurable per learning style.

---

### WORKFLOW 20: SESSION END WORKFLOW

#### Purpose
Gracefully concludes an active user working session, saving all workspace states, persisting memory updates, and generating a brief session summary.

#### Trigger
User closes Eliot or explicitly clicks "End Session".

#### Preconditions
Session in progress.

#### Actors
- User
- `DOM-007: Dashboard Domain`
- `DOM-002: Memory Domain`
- `DOM-012: Analytics Domain`

#### Inputs
- Session end trigger
- Active workspace state

#### Outputs
- Persisted workspace state
- Logged session summary event

#### Step-by-Step Conceptual Flow
1. User clicks "End Session" or initiates window close.
2. `DOM-007: Dashboard Domain` captures unpersisted interaction buffer state.
3. `DOM-001` and `DOM-005` save exact active stage, lesson, and project milestone checkpoints.
4. `DOM-002: Memory Domain` flushes pending memory items and updates persistent storage graph.
5. `DOM-012: Analytics Domain` calculates session duration, practical execution ratio, and completed milestones.
6. `DOM-007` displays brief, objective session summary:
   - "Session Complete. Time Spent: 45m (80% Practical Execution). Advanced to Stage 4 in Systems Programming."
7. Application state shuts down cleanly.

#### Possible Branches
- **Success:** State saved; session closed cleanly.
- **Abrupt Termination:** Window closed forcibly; background unload handler saves active checkpoint.

#### Business Rules
- Must persist exact workspace checkpoint so user resumes seamlessly in next session.
- Session summary must be objective and devoid of artificial cheerleading or streak counters.

#### AI Responsibilities
- None.

#### Memory Responsibilities
- Flushes all pending transactional state to persistent storage.

#### Completion Criteria
All domain states persisted; session closed cleanly.

#### Failure Conditions
Storage write failure during shutdown (mitigated by auto-saving checkpoints after every stage transition).

#### Architectural Notes
Guarantees state integrity across session boundaries.

#### Future Engineering Notes
Use incremental auto-saving during session so shutdown takes < 100ms.

---
**END OF CANONICAL WORKFLOWS**
