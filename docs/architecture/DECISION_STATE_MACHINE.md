# DECISION STATE MACHINE SPECIFICATION
## Eliot Cognitive Decision Engine (CDE)

**Version:** 1.0.0  
**Authority:** Constitutional Architecture Specification  
**Scope:** Formal State Transitions & Life-Cycle Governance  

---

### 1. State Topology Diagram

```
                 +-------------------+
                 |       IDLE        |
                 +---------+---------+
                           |
                           | Event Trigger (Boot, SessionEnd, DecayAlert)
                           v
                 +-------------------+
                 | INGESTING_VECTORS |
                 +---------+---------+
                           |
                           | State Vectors Validated
                           v
                 +-------------------+
                 | CHECKING_INVARIANTS|
                 +---------+---------+
                           |
                           | Prereqs & Hard Floors Validated
                           v
                 +-------------------+
                 | CALCULATING_METRICS|
                 +---------+---------+
                           |
                           | P, C, R, K, U Scores Derived
                           v
                 +-------------------+
                 | APPLYING_RULE_MATRIX
                 +---------+---------+
                           |
                           | Highest Priority Rule Matched
                           v
                 +-------------------+
                 |   EMITTING_TRACE  |
                 +---------+---------+
                           |
                           | Trace Logged & Published
                           v
                 +-------------------+
                 |     FINALIZED     |
                 +-------------------+
```

---

### 2. State Definitions

#### State 1: `IDLE`
- **Description:** Engine is dormant, awaiting system triggers.
- **Invariants:** No calculations running; state vector cache clean.
- **Allowed Triggers:** `BOOT_SEQUENCE_TRIGGER`, `SESSION_EXIT_TRIGGER`, `MEMORY_DECAY_ALARM`, `USER_REMOTIVATION_REQUEST`.

#### State 2: `INGESTING_VECTORS`
- **Description:** Queries domain services (DOM-001, DOM-002, DOM-003, DOM-011, DOM-007) to construct the current 13-vector state $\mathbf{I}$.
- **Guards:** All queried domain results must be non-null and valid `Result.ok`.
- **Exit Condition:** Complete state vector $\mathbf{I}$ constructed.

#### State 3: `CHECKING_INVARIANTS`
- **Description:** Verifies fundamental system invariants (Dependency satisfaction, Hard decay floor checks, Cognitive load limits).
- **Guards:** If dependency invariant is violated, candidate list is restricted exclusively to missing prerequisites.
- **Exit Condition:** Invariants passed or candidate set filtered.

#### State 4: `CALCULATING_METRICS`
- **Description:** Executes mathematical models for Priority ($P_{score}$), Confidence ($C_{score}$), Risk ($R_{score}$), Cost ($K_{score}$), and Urgency ($U_{score}$).
- **Guards:** All metric results must fall within $[0.0, 1.0]$ or specified difficulty bounds $[1, 5]$.
- **Exit Condition:** Scoring matrix compiled.

#### State 5: `APPLYING_RULE_MATRIX`
- **Description:** Scans the `DECISION_RULE_MATRIX.md` in descending priority order to find the first matching rule.
- **Guards:** Exactly one rule must match (default fallback rule guaranteed).
- **Exit Condition:** Match identified; decision outcome object instantiated.

#### State 6: `EMITTING_TRACE`
- **Description:** Constructs JSON-LD Decision Trace object, logs to immutable ledger, and dispatches `MissionRecommended` or `ReviewScheduled` domain event through `InMemoryEventBus`.
- **Guards:** SHA-256 digest of trace generated.
- **Exit Condition:** Event dispatch acknowledged.

#### State 7: `FINALIZED`
- **Description:** Decision cycle complete; outcome presented to UI frame or saved to workspace state. Transitions automatically back to `IDLE`.

---

### 3. Transition Table

| Source State | Event Trigger | Guard Condition | Target State | Action Executed |
| :--- | :--- | :--- | :--- | :--- |
| `IDLE` | `BOOT_SEQUENCE_TRIGGER` | Boot complete | `INGESTING_VECTORS` | Fetch domain states |
| `INGESTING_VECTORS` | `VECTORS_LOADED` | State vector $\mathbf{I}$ complete | `CHECKING_INVARIANTS` | Run invariant validator |
| `CHECKING_INVARIANTS` | `INVARIANTS_CHECKED` | $L_{load} > 0.85$ | `APPLYING_RULE_MATRIX` | Force `RULE-FATIGUE-RECOVERY` |
| `CHECKING_INVARIANTS` | `INVARIANTS_CHECKED` | Normal cognitive load | `CALCULATING_METRICS` | Run formula calculators |
| `CALCULATING_METRICS` | `METRICS_COMPILED` | Scores calculated | `APPLYING_RULE_MATRIX` | Scan rule matrix |
| `APPLYING_RULE_MATRIX` | `RULE_MATCHED` | Rule outcome selected | `EMITTING_TRACE` | Build trace & log |
| `EMITTING_TRACE` | `TRACE_LOGGED` | Bus dispatch ok | `FINALIZED` | Notify presentation |
| `FINALIZED` | `RESET_TRIGGER` | Automatic | `IDLE` | Clear temporary cache |

---

### 4. Error Handling & Recovery States

- **Vector Fetch Failure:** If any domain service fails to respond during `INGESTING_VECTORS`, transition to `FALLBACK_RECOVERY` state and issue safe, low-cost review unit.
- **Invariant Conflict:** If invariants produce an empty candidate list, transition to `DIAGNOSTIC_RECOVERY` and trigger a foundational skill diagnostic.

---
*End of Decision State Machine Specification.*
