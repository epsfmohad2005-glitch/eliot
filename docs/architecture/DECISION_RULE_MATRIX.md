# DECISION RULE MATRIX
## Eliot Cognitive Decision Engine (CDE) Rule Set

**Version:** 1.0.0  
**Authority:** Constitutional Architecture Standard  
**Scope:** Deterministic Rule Selection & Action Mapping  

---

### 1. Overview

The Decision Rule Matrix defines the deterministic rules governing mission recommendations, review scheduling, recovery triggers, and stage gate clearances within the Cognitive Decision Engine (CDE). 

Rules are evaluated in strict priority order ($P_{rule}$). When multiple rules match, the rule with the highest priority score executes, generating a transparent explanation and decision trace.

---

### 2. Comprehensive Rule Table

| Rule ID | Priority | Condition Pattern | Engine Action | Decision Outcome | Generated Explanation |
| :--- | :---: | :--- | :--- | :--- | :--- |
| **RULE-DECAY-CRITICAL** | 100 | $R(t) < 0.35$ on any concept | Interrupt progression; queue critical decay review | **Force Critical Review Mission** | `"Concept [CONCEPT] retention dropped to critical floor ([R(t)]). Immediate review required before progression."` |
| **RULE-FATIGUE-RECOVERY** | 95 | $L_{load} > 0.85$ OR Session Duration $> 90$ mins | Halt active learning session; initiate cognitive rest | **Activate Recovery Protocol** | `"Cognitive load index is critical ([L_load]). Session halted to prevent memory interference."` |
| **RULE-PREREQ-BLOCKED** | 90 | Candidate Unit has $M_{prereq} < 0.70$ | Block unit candidate; redirect to unfulfilled prerequisite | **Recommend Prerequisite Remediation** | `"Unit [UNIT] locked: Prerequisite [PREREQ] mastery is [M_prereq], below required 0.70 threshold."` |
| **RULE-FAILURE-REMEDIATION**| 85 | Diagnostic/Practice Failure Count $H_{fail} \ge 2$ | Switch practice protocol; present socratic breakdown | **Recommend Socratic Remediation** | `"Repeated practice friction detected on [CONCEPT]. Switching to Socratic architecture decomposition."` |
| **RULE-DECAY-WARNING** | 80 | $0.35 \le R(t) < 0.60$ and $L_{load} < 0.70$ | Schedule spaced repetition review mission | **Queue Spaced Review Mission** | `"Memory stability schedule requires reinforcement for [CONCEPT] (R(t) = [R(t)])." ` |
| **RULE-GATE-VALIDATION** | 75 | All Stage Units complete AND $M_{stage} \ge 0.80$ | Trigger Stage Gate formal evaluation protocol | **Trigger Stage Gate Challenge** | `"Stage [STAGE] core units completed. Stage Gate evaluation unlocked for formal verification."` |
| **RULE-EVIDENCE-HARDEN** | 70 | $M_c \ge 0.80$ BUT verified evidence artifact count $N_{ev} = 0$ | Require high-quality code/architecture evidence submission | **Require Evidence Submission** | `"Concept [CONCEPT] mastery claims require verifiable SHA-256 evidence artifact."` |
| **RULE-OPTIMAL-ADVANCE** | 50 | All prerequisites $M_{prereq} \ge 0.75$, $R(t) \ge 0.70$, $L_{load} < 0.60$ | Select next sequential roadmap unit | **Recommend Primary Mission** | `"Prerequisites satisfied and memory retention optimal. Proceeding to Mission [UNIT]."` |
| **RULE-ACCELERATED-PATH** | 40 | Learning Velocity $V_{learn} > 1.5\times$ avg and $M_c \ge 0.90$ across stage | Offer advanced synthesis project or skipped unit evaluation | **Recommend Accelerated Challenge** | `"High learning velocity and mastery detected. Accelerated synthesis challenge available."` |

---

### 3. Rule Evaluation Algorithm

```
FUNCTION EvaluateRules(InputVector I, CandidateMissions C):
  FOR EACH rule IN Matrix SORTED BY Priority DESCENDING:
    IF rule.Matches(I, C) THEN
      Trace = CreateDecisionTrace(rule, I)
      LogTrace(Trace)
      RETURN CreateOutcome(rule, Trace)
    END IF
  END FOR
  RETURN DefaultFallbackMission(I)
END FUNCTION
```

---

### 4. Conflict Resolution Protocol

1. **Safety First:** Fatigue and memory decay rules (`RULE-FATIGUE-RECOVERY`, `RULE-DECAY-CRITICAL`) strictly override progression or acceleration rules.
2. **Deterministic Tie-Breaking:** If two rules share identical priority, the rule with lower cognitive cost ($K_{score}$) is selected.
3. **No Hidden State:** The condition pattern for every rule relies exclusively on explicitly calculated metrics from domain services.

---
*End of Decision Rule Matrix Specification.*
