# ELIOT COGNITIVE DECISION ENGINE (CDE)
## Architectural Specification & Decision Constitution

**Version:** 1.0.0  
**Authority:** Constitutional Architecture Specification  
**Scope:** Decision Intelligence & Recommendation Engine  
**Status:** Frozen / Architectural Standard  

---

### 1. Decision Philosophy

The Eliot Cognitive Decision Engine (CDE) operates as a deterministic, auditable, and mathematical decision intelligence model. It rejects non-deterministic, black-box AI recommendations, stochastic trial-and-error paths, and gamified dopamine heuristics. 

The core philosophy rests upon four pillars:
1. **Determinism over Speculation:** Every decision is derived strictly from observable domain metrics (Knowledge, Memory, Evidence, Cognitive Load).
2. **Cognitive Integrity:** The engine prioritizes long-term memory stability ($S$) and conceptual mastery ($M_c$) over speed or superficial progress.
3. **Traceability & Auditability:** Every recommendation generates an immutable decision trace containing exact inputs, formula evaluations, weights, and rules triggered.
4. **Zero Dopamine / Zero Gamification:** Decisions optimize for true cognitive acquisition, never engagement metrics, click-through rates, or arbitrary streaks.

---

### 2. Decision Principles

1. **Principle of Explainable Derivation:** No recommendation may be delivered to the user without a human-readable explanation derived directly from underlying metrics.
2. **Principle of Dependency Invariance:** A concept or mission cannot be recommended if its prerequisite dependencies fail to meet minimum mastery thresholds ($M_{prereq} < 0.70$).
3. **Principle of Memory Decay Primacy:** Review missions driven by memory decay curves ($R(t) < 0.60$) override new content acquisition unless cognitive fatigue forces a recovery state.
4. **Principle of Cognitive Energy Alignment:** Mission difficulty ($D_{mission}$) must match the learner's current cognitive capacity ($E_{capacity}$) to maintain optimal challenge without burnout.
5. **Principle of Evidence-Backed Mastery:** Mastery cannot be updated or assumed without a verified SHA-256 evidence artifact ($E_q > 0.0$).

---

### 3. Decision Layers

The Cognitive Decision Engine operates across four distinct operational temporal layers:

```
+-------------------------------------------------------------------------+
|                      LONG-TERM DECISION LAYER                           |
|      (Career Goals, Core Mastery Horizons, Lifetime Skill Graphs)       |
+------------------------------------+------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                      STRATEGIC DECISION LAYER                           |
|      (Learning Roadmaps, Stage Gate Thresholds, Macro Curricula)        |
+------------------------------------+------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                      TACTICAL DECISION LAYER                            |
|      (Unit Ordering, Adaptive Review Schedules, Recovery Plans)         |
+------------------------------------+------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                      IMMEDIATE DECISION LAYER                           |
|     (Next Mission Selection, Session Micro-Pacing, Focus Duration)      |
+-------------------------------------------------------------------------+
```

#### 3.1 Immediate Layer (Micro: Seconds to Hours)
- **Scope:** Real-time learning session pacing, next immediate mission selection, active note prompting, focus timer duration, immediate review interventions.
- **Evaluation Interval:** Per session start, completion, or cognitive load shift.

#### 3.2 Tactical Layer (Meso: Days to Weeks)
- **Scope:** Spaced repetition scheduling, unit sequencing, recovery protocol activation, practice protocol selection (Programming vs Architecture vs Debugging).
- **Evaluation Interval:** Post-session evidence submission or daily boot sequence.

#### 3.3 Strategic Layer (Macro: Weeks to Months)
- **Scope:** Milestone evaluation, Stage Gate entry validation, curriculum branch adjustments, project complexity escalation.
- **Evaluation Interval:** Milestone completion or major diagnostic failure.

#### 3.4 Long-Term Layer (Horizon: Months to Years)
- **Scope:** Goal tracking alignment, target mastery deadlines, systemic skill gap identification, domain mastery verification.
- **Evaluation Interval:** Monthly review cycle or explicit goal reconfiguration.

---

### 4. Decision Inputs

The CDE evaluates a structured 13-vector input state $\mathbf{I}$:

$$\mathbf{I} = \langle K, M, E, G, R, T, E_{cap}, L_{load}, V_{learn}, H_{fail}, D_{graph}, P_{pref}, S_{context} \rangle$$

1. **Knowledge Vector ($K$):** Concept nodes, mastery scores ($M_c$), confidence scores ($K_c$), iteration counts ($N$).
2. **Memory Vector ($M$):** Retention scores ($R(t)$), memory stability ($S$), last practice timestamps ($t_{last}$), decay floor caps ($0.35$).
3. **Evidence Vector ($E$):** Artifact UUIDs, SHA-256 digests, verification statuses, evidence quality scores ($E_q$).
4. **Goals Vector ($G$):** Target domain competencies, target mastery thresholds, target completion dates.
5. **Roadmap Vector ($R$):** Curricular dependency graph, stage gate nodes, milestone checkpoints.
6. **Time Vector ($T$):** Available daily study duration, historical session lengths, timestamp of current evaluation.
7. **Energy Vector ($E_{cap}$):** Self-reported or inferred cognitive stamina ($0.0 \to 1.0$).
8. **Cognitive Load Vector ($L_{load}$):** Cumulative fatigue, session duration in current window, interaction density score.
9. **Learning Velocity Vector ($V_{learn}$):** Average concepts mastered per week, average time to achieve $M_c \ge 0.85$.
10. **Failure History Vector ($H_{fail}$):** Diagnostic attempt failures, unvalidated reflections, practice test retry rates.
11. **Dependency Graph Vector ($D_{graph}$):** Topological ordering, prerequisite linkages, bottleneck node identification.
12. **Preferences Vector ($P_{pref}$):** Preferred learning source modalities (Documentation, Video, PDF, Socratic Gem).
13. **Session Context ($S_{context}$):** Current active unit, current stage number ($1 \to 10$).

---

### 5. Decision Outputs

The engine produces a structured Decision Outcome $\mathbf{O}$:

1. **Next Primary Mission:** Selected Unit ID, Objective, and Practice Protocol.
2. **Next Review Schedule:** Target review dates and specific concepts flagged for Ebbinghaus retention reinforcement.
3. **Mission Difficulty Level ($D_{mission}$):** Calibrated difficulty rating ($1 \to 5$).
4. **Mission Priority Score ($P_{score}$):** Standardized priority rank ($0.00 \to 1.00$).
5. **Estimated Focus Duration:** Recommended session duration (minutes).
6. **Recovery Plan:** Remediation steps when failure history or cognitive fatigue thresholds are breached.
7. **Learning Sequence Order:** Recommended topological path through remaining roadmap units.
8. **Roadmap Adjustment Directives:** Recommended pacing acceleration or prerequisite insertion.

---

### 6. Mathematical Models

#### 6.1 Priority Score Model ($P_{score}$)

The Priority Score determines which mission or review action takes top precedence.

$$P_{score} = w_1 \cdot U_{score} + w_2 \cdot (1 - R(t)) + w_3 \cdot D_{crit} + w_4 \cdot G_{align} - w_5 \cdot L_{load}$$

Where:
- $U_{score}$: Urgency score derived from goal deadlines and decay thresholds.
- $R(t)$: Current memory retention score of the target concept ($0.0 \to 1.0$).
- $D_{crit}$: Dependency Criticality (number of downstream concepts blocked by this node).
- $G_{align}$: Alignment score with active user goal objectives ($0.0 \to 1.0$).
- $L_{load}$: Current user cognitive load penalty ($0.0 \to 1.0$).
- Standard weights: $w_1 = 0.30$, $w_2 = 0.30$, $w_3 = 0.20$, $w_4 = 0.15$, $w_5 = 0.05$.

#### 6.2 Confidence Score Model ($C_{score}$)

Evaluates the CDE's statistical confidence in a recommended action.

$$C_{score} = \sqrt{K_c \cdot \left(\frac{N_{ev}}{N_{ev} + 1}\right) \cdot (1 - \sigma_{fail}^2)}$$

Where:
- $K_c$: Knowledge Confidence ($1 - \exp(-N/5)$).
- $N_{ev}$: Count of verified evidence artifacts supporting the concept.
- $\sigma_{fail}^2$: Variance of failure attempts on associated diagnostic evaluations.

#### 6.3 Risk Score Model ($R_{score}$)

Calculates the cognitive or schedule risk of failing or skipping a given mission.

$$R_{score} = \alpha \cdot (1 - M_{prereq}) + \beta \cdot (1 - R(t)) \cdot D_{crit} + \gamma \cdot H_{fail\_rate}$$

Where:
- $M_{prereq}$: Minimum mastery score among all direct prerequisites.
- $D_{crit}$: Downstream topological dependency impact factor.
- $H_{fail\_rate}$: Historical failure rate on similar protocol tasks.
- Weights: $\alpha = 0.45$, $\beta = 0.35$, $\gamma = 0.20$.

#### 6.4 Cost Model ($K_{score}$)

Estimates the cognitive energy cost required to complete the mission.

$$K_{score} = D_{mission} \cdot \left(1 + 0.5 \cdot (1 - M_c)\right) \cdot \left(1 + 0.3 \cdot L_{load}\right)$$

Where:
- $D_{mission}$: Base difficulty of the mission ($1.0 \to 5.0$).
- $M_c$: Learner's current mastery of the concept ($0.0 \to 1.0$).
- $L_{load}$: Current cognitive fatigue index ($0.0 \to 1.0$).

#### 6.5 Urgency Model ($U_{score}$)

Determines temporal necessity of immediate action.

$$U_{score} = \max\left( \frac{T_{elapsed}}{T_{deadline}}, \quad 1 - \frac{R(t)}{R_{floor}} \right)$$

Where:
- $T_{elapsed} / T_{deadline}$: Fraction of target deadline window consumed.
- $R_{floor}$: Minimum allowable retention floor ($0.35$).

#### 6.6 Opportunity Model ($O_{score}$)

Measures the systemic learning leverage gained by completing a mission.

$$O_{score} = \frac{\sum_{i \in \text{Unblocked}} \text{Weight}(i)}{1 + K_{score}}$$

Where $\sum \text{Weight}(i)$ is the sum of importance weights of all downstream units unblocked upon mastering this mission.

---

### 7. Decision Trace Model

Every decision evaluated by the CDE produces an immutable Decision Trace object stored in the LocalFirst repository.

```json
{
  "traceId": "trace_cde_984102948102",
  "timestamp": "2026-08-04T14:15:00.000Z",
  "decisionType": "MISSION_SELECTION",
  "inputs": {
    "conceptId": "CPT-SYS-MONADIC-RESULT",
    "retentionScore": 0.52,
    "masteryScore": 0.74,
    "cognitiveLoad": 0.25,
    "prereqMastery": 0.92
  },
  "formulas": {
    "priorityScore": 0.885,
    "confidenceScore": 0.912,
    "riskScore": 0.142,
    "cognitiveCost": 2.15,
    "urgencyScore": 0.800
  },
  "ruleEvaluations": [
    { "ruleId": "RULE-DECAY-REFORCE", "matched": true, "action": "FORCE_REVIEW_MISSION" }
  ],
  "outcome": {
    "selectedUnitId": "unit_stage3_001",
    "recommendedProtocol": "Programming",
    "reasonCode": "DECAY_THRESHOLD_BREACHED"
  }
}
```

---

### 8. Decision Explanation Model

The CDE provides deterministic, non-opaque, human-readable explanations formatted without fluff:

- **Format Template:**
  `"Mission [UNIT_ID] recommended because [CONCEPT_NAME] retention (R(t) = X.XX) dropped below target floor (0.60). Prerequisite mastery is verified at YY%. Estimated cognitive cost: Z.Z units."`

- **Rules for Explanations:**
  1. Must directly reference specific quantitative values ($R(t)$, $M_c$, $E_q$, $U_{score}$).
  2. Must highlight prerequisite status.
  3. Must never use generic phrasing like "AI suggests" or "Based on your interests".

---

### 9. Decision Lifecycle

```
[ EVENT / BOOT TRIGGER ]
          |
          v
  1. Ingest State Vectors (K, M, E, G, L, etc.)
          |
          v
  2. Filter Eligible Candidate Missions (Check Dependency Graph Invariants)
          |
          v
  3. Evaluate Mathematical Models (Priority, Risk, Cost, Urgency)
          |
          v
  4. Apply Decision Rule Matrix Constraints
          |
          v
  5. Select Optimal Decision Outcome
          |
          v
  6. Generate Immutable Decision Trace & Explanation
          |
          v
  7. Publish Domain Event (MissionRecommended / ReviewScheduled)
```

---

### 10. Decision State Machine

The CDE operates within five explicit operational states:

1. **IDLE:** Waiting for trigger event (Boot, Session End, Diagnostic Submission).
2. **EVALUATING_INPUTS:** Validating vector completeness and checking prerequisite invariants.
3. **CALCULATING_METRICS:** Executing Priority, Risk, Cost, and Confidence mathematical models.
4. **APPLYING_RULES:** Resolving rule matrix conflicts and selecting final outcome.
5. **FINALIZED:** Trace written to ledger, decision emitted to presentation shell.

---

### 11. Decision Invariants

1. **Dependency Invariant:** $M_{prereq} \ge 0.70$ for all direct parent nodes before any child unit can be recommended.
2. **Decay Floor Invariant:** If any concept retention $R(t) < 0.35$, it MUST be queued for immediate review before new content acquisition.
3. **Cognitive Load Ceiling Invariant:** If $L_{load} > 0.85$, the engine is strictly forbidden from recommending high-difficulty ($D > 3$) missions; it MUST activate a Recovery or Light Review protocol.
4. **Evidence Grounding Invariant:** A concept cannot reach $M_c > 0.80$ without at least one verified Evidence Artifact ($E_q \ge 0.85$).

---

### 12. Decision Extension Points

1. **Custom Plugin Providers:** Dynamic integration of new `ILearningSourceProvider` content types.
2. **Domain-Specific Risk Calculators:** Injecting specific risk formulas for specialized verticals (e.g., Medical board exams, Distributed systems engineering).
3. **Adaptive Spacing Algorithms:** Swapping baseline Ebbinghaus decay formulas with FSRS-4.5 or SM-2 variants without altering the Decision Layer interfaces.

---
*End of Specification.*
