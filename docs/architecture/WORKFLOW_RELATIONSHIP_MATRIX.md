# ELIOT: WORKFLOW RELATIONSHIP MATRIX & STATE HANDOFF SPECIFICATION
**Document Version:** 1.0  
**Phase:** Phase 3.5 — Canonical Workflow Definition (CWD)  
**Author:** Principal Systems Designer  
**Status:** Permanent Operational Specification (Implementation Strictly Forbidden)  

---

## EXECUTIVE SUMMARY

This document defines the structural relationships, transition dynamics, trigger types, and state handoff contracts across all 20 canonical workflows of the **Eliot Personal Learning Operating System (PLOS)**.

It guarantees that operational transitions between user journeys, AI reviews, evidence submissions, memory updates, and career progression are completely deterministic, zero-loss, and free of dead ends or circular locks.

---

## 1. COMPREHENSIVE WORKFLOW INTERACTION MATRIX

The following matrix maps operational transitions between workflows:
- **T** = Triggers (Directly initiates target workflow upon completion or event)
- **C** = Conditional Trigger (Initiates target workflow only if specific conditions are met)
- **H** = Handoff Payload (Passes active state payload to target workflow)
- **--** = No Direct Workflow Coupling

| Source Workflow \ Target Workflow | WF01 First Launch | WF02 Daily Session | WF03 Learning | WF04 Lesson Comp | WF05 Practice | WF06 Project | WF07 Evidence | WF08 AI Review | WF09 Memory Upd | WF10 Review Sched | WF11 Mastery Eval | WF12 Skill Unlock | WF13 Knowl Consol | WF14 Career Prog | WF15 Goal Plan | WF16 Dash Refresh | WF17 Fail & Recov | WF18 Long Inact | WF19 AI Interven | WF20 Session End |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **WF01 First Launch** | -- | -- | T,H | -- | -- | -- | -- | -- | T,H | -- | -- | -- | -- | T,H | -- | T | -- | -- | -- | -- |
| **WF02 Daily Session** | -- | -- | C,H | -- | -- | C,H | -- | -- | -- | -- | -- | -- | -- | -- | -- | T | -- | C,H | -- | -- |
| **WF03 Learning** | -- | -- | -- | T | C,H | C,H | -- | -- | -- | -- | C,H | -- | C,H | -- | -- | T | -- | -- | C | -- |
| **WF04 Lesson Comp** | -- | -- | T,H | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | T | -- | -- | -- | -- |
| **WF05 Practice** | -- | -- | T,H | -- | -- | -- | T,H | -- | -- | -- | -- | -- | -- | -- | -- | T | C | -- | C | -- |
| **WF06 Project** | -- | -- | T,H | -- | -- | -- | T,H | -- | -- | -- | C,H | -- | -- | C,H | -- | T | C | -- | C | -- |
| **WF07 Evidence** | -- | -- | -- | -- | -- | -- | -- | T,H | -- | C,H | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- |
| **WF08 AI Review** | -- | -- | -- | -- | -- | -- | -- | -- | T,H | -- | -- | -- | -- | -- | -- | T | C,H | -- | -- | -- |
| **WF09 Memory Upd** | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | C,H | -- | -- | C,H | -- | -- | -- | -- | -- | -- |
| **WF10 Review Sched** | -- | -- | -- | -- | -- | -- | -- | T,H | -- | -- | -- | -- | -- | -- | -- | T | -- | -- | -- | -- |
| **WF11 Mastery Eval**| -- | -- | -- | -- | -- | -- | -- | -- | T,H | -- | -- | T,H | -- | -- | -- | -- | -- | -- | -- | -- |
| **WF12 Skill Unlock**| -- | -- | T,H | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | T,H | -- | T | -- | -- | -- | -- |
| **WF13 Knowl Consol**| -- | -- | T,H | -- | -- | -- | -- | -- | T,H | -- | -- | -- | -- | -- | -- | T | -- | -- | -- | -- |
| **WF14 Career Prog** | -- | -- | C,H | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | T | -- | -- | -- | -- |
| **WF15 Goal Plan**   | -- | -- | T,H | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | T,H | -- | T | -- | -- | -- | -- |
| **WF16 Dash Refresh** | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- |
| **WF17 Fail & Recov**| -- | -- | T,H | -- | C,H | C,H | T,H | -- | T,H | -- | -- | -- | -- | -- | -- | T | -- | -- | C | -- |
| **WF18 Long Inact**  | -- | -- | T,H | -- | C,H | -- | -- | -- | T,H | -- | -- | -- | -- | -- | -- | T | -- | -- | -- | -- |
| **WF19 AI Interven** | -- | -- | T,H | -- | C,H | C,H | -- | -- | T,H | -- | -- | -- | -- | -- | -- | T | -- | -- | -- | -- |
| **WF20 Session End** | -- | -- | -- | -- | -- | -- | -- | -- | T,H | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- |

---

## 2. TRIGGER CLASSIFICATION REGISTRY

Workflows are initiated via four distinct operational trigger mechanisms:

### 2.1 User-Initiated Triggers
- **WF01 First Launch:** User opens application for the first time.
- **WF02 Daily Session:** User launches application for a working session.
- **WF04 Lesson Completion:** User clicks "Complete Lesson" or finishes required lesson interaction.
- **WF07 Evidence Submission:** User submits exercise code or project deliverable.
- **WF15 Goal Planning:** User accesses settings to modify career targets or time commitment.
- **WF20 Session End:** User initiates session exit or window close.

### 2.2 System / State Machine-Triggered
- **WF03 Learning:** Activated by system upon starting or advancing a `LearningUnit`.
- **WF05 Practice:** Triggered when entering Stage 2 ("Practicing") or Stage 3 ("Applying").
- **WF06 Project:** Triggered when entering Stage 4 ("Building") or activating a project.
- **WF11 Mastery Evaluation:** Triggered upon Stage 7 ("Mastering") completion or final project approval.
- **WF12 Skill Unlock:** Triggered when a `SkillNode` achieves verified "Mastered" status.
- **WF13 Knowledge Consolidation:** Triggered upon finishing a major curriculum module cluster.
- **WF16 Dashboard Refresh:** Triggered automatically whenever domain states change to update UI.
- **WF17 Failure & Recovery:** Triggered automatically upon receiving a `Revision Required` verdict.

### 2.3 Event-Driven Triggers
- **WF08 AI Review:** Triggered by `EvidenceArtifactRegistered` event from `DOM-011`.
- **WF09 Memory Update:** Triggered by `VerdictRendered`, `StageGatePassed`, or `ReflectionInputEntered` events.
- **WF14 Career Progression:** Triggered by `SkillMastered` or `ProjectCompleted` events.
- **WF19 AI Intervention:** Triggered by `InteractionFrictionDetected` event (3+ drill/review failures).

### 2.4 Temporal / Scheduled Triggers
- **WF10 Review Scheduling:** Scheduled by system when AI service encounters rate limits or offline state.
- **WF18 Long Inactivity:** Triggered at session launch if elapsed time since last session exceeds 14 days.

---

## 3. STATE HANDOFF CONTRACTS & PAYLOAD SCHEMAS

When one workflow transitions into another, state is passed via immutable handoff payloads:

### HANDOFF-01: Evidence Submission $\rightarrow$ AI Review Workflow
- **Originating Workflow:** WF07 Evidence Submission
- **Target Workflow:** WF08 AI Review Workflow
- **Payload Schema:**
  - `artifact_id`: String (Immutable content hash)
  - `unit_id`: String (Active LearningUnit ID)
  - `stage_number`: Integer (Active stage 1-8)
  - `evaluation_rubric_id`: String (Reference to rubric criteria)
  - `user_reflection_text`: String (Stage 5 qualitative reflection content)

### HANDOFF-02: AI Review $\rightarrow$ Memory Update / Failure & Recovery Workflows
- **Originating Workflow:** WF08 AI Review Workflow
- **Target Workflows:** WF09 Memory Update Workflow, WF17 Failure & Recovery Workflow
- **Payload Schema:**
  - `submission_id`: String
  - `verdict_status`: Enum (`Approved`, `Revision Required`)
  - `diagnostic_critique`: String (Detailed feedback)
  - `corrective_steps`: Array of Strings (Required fix items)
  - `rubric_scores`: Map of Criteria ID to Score/Status

### HANDOFF-03: Mastery Evaluation $\rightarrow$ Skill Unlock Workflow
- **Originating Workflow:** WF11 Mastery Evaluation
- **Target Workflow:** WF12 Skill Unlock Workflow
- **Payload Schema:**
  - `skill_node_id`: String
  - `mastery_score`: Float (Time-weighted confidence value)
  - `supporting_artifact_ids`: Array of Strings (Verified evidence citations)
  - `timestamp`: String (ISO-8601 completion time)

### HANDOFF-04: Skill Unlock $\rightarrow$ Career Progression Workflow
- **Originating Workflow:** WF12 Skill Unlock Workflow
- **Target Workflow:** WF14 Career Progression Workflow
- **Payload Schema:**
  - `unlocked_skill_ids`: Array of Strings
  - `mastered_skill_ids`: Array of Strings
  - `target_role_id`: String (Active career role profile ID)

---

## 4. END-TO-END OPERATIONAL LIFECYCLE MAP

The 20 workflows operate as a continuous, unified system loop:

```
+---------------------------------------------------------------------------------------+
|                             ELIOT OPERATIONAL LIFECYCLE LOOP                          |
+---------------------------------------------------------------------------------------+
|  [WF01 First Launch]                                                                  |
|         |                                                                             |
|         v                                                                             |
|  [WF02 Daily Session] <---------------------------------------------+                |
|         |                                                           |                |
|         |--(Long Inactivity?)--> [WF18 Long Inactivity]             |                |
|         |                                   |                       |                |
|         v                                   v                       |                |
|  [WF03 Learning Workflow (Stages 1-8)] <----+                       |                |
|         |                                                           |                |
|         |-- Stage 2/3 --> [WF05 Practice]                           |                |
|         |-- Stage 4   --> [WF06 Project]                            |                |
|         |-- Stage 5   --> [WF07 Evidence Submission]                |                |
|                                   |                                 |                |
|                                   v                                 |                |
|                         [WF08 AI Review]                            |                |
|                           /          \                              |                |
|                 (Approved)            (Revision Required)           |                |
|                     /                    \                          |                |
|                    v                      v                         |                |
|          [WF09 Memory Update]     [WF17 Failure & Recovery]         |                |
|                    |                      |                         |                |
|                    v                      +--(Fix & Resubmit)-------+                |
|          [WF11 Mastery Eval]                                        |                |
|                    |                                                |                |
|                    v                                                |                |
|          [WF12 Skill Unlock]                                        |                |
|                    |                                                |                |
|                    v                                                |                |
|          [WF14 Career Progression]                                  |                |
|                    |                                                |                |
|                    v                                                |                |
|          [WF20 Session End] ----------------------------------------+                |
+---------------------------------------------------------------------------------------+
```

---
**END OF WORKFLOW RELATIONSHIP MATRIX**
