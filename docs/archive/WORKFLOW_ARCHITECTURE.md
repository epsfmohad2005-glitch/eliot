# EAR-1 — Workflow Architecture & State Management

## Core Workflow Capabilities

The Eliot Workflow Engine provides a comprehensive runtime for execution, failure recovery, and observability across both LocalFirst browser runtimes and Cloud worker nodes.

---

## Technical Specifications

### 1. Execution Models

- **Event-Driven Workflows**:
  - Triggered by internal Eliot Event Bus signals (e.g., `CKM_NODE_CREATED`, `SOURCE_INGESTED`, `PRACTICE_DRILL_COMPLETED`) or external webhooks (e.g., GitHub push, Telegram message).
  - Sub-millisecond dispatch overhead in LocalFirst runtime.

- **Scheduled Workflows**:
  - Cron-based (e.g., `0 8 * * *` for daily cognitive review) or relative delay timers (e.g., `in 4 hours`).
  - Uses Web Workers / Service Workers locally, and Temporal Schedules in cloud mode.

- **Long-Running & Multi-Step Jobs**:
  - Supports workflows spanning minutes, days, or weeks (e.g., spaced-repetition learning tracks, multi-week research digests).
  - Uses state check-pointing at every node step to allow instant pause/resume across browser restarts.

---

## 2. Resilience & Reliability Primitives

```
+------------------+     Execute Step     +-------------------+
|  Workflow State  | -------------------> |    Worker Node    |
+------------------+                      +-------------------+
       ^                                            |
       |               Success / State Checkpoint   |
       +<-------------------------------------------+
       |                                            |
       | Fail (Retryable Error)                     | Fail (Non-retryable / Exceeded Max)
       v                                            v
+------------------+                      +-------------------+
| Exponential      |                      | Dead Letter Queue |
| Backoff Timer    |                      | & User Alert      |
+------------------+                      +-------------------+
```

- **Exponential Backoff & Jitter**:
  - Configurable retry policies per step: `maxAttempts`, `initialIntervalMs`, `backoffCoefficient`, `maximumIntervalMs`.

- **Idempotency & Replay Protection**:
  - Every step execution receives a deterministic `idempotencyKey` derived from `workflowId + stepId + attemptNumber`.
  - Ensures re-running a failed workflow never duplicates side-effects (e.g., double sending a message or double posting an API call).

- **Human-in-the-Loop (HITL) Approvals**:
  - Workflows can enter a `SUSPENDED_AWAITING_APPROVAL` state.
  - The Focus Bar / AppShell UI presents a clean approval prompt.
  - Upon user confirmation or denial, execution resumes cleanly from the exact checkpoint.

---

## 3. Parallel Execution & Fan-Out/Fan-In

- Supports `ParallelGroup` execution steps where multiple sub-tasks execute concurrently (e.g., fetching 5 research URLs in parallel).
- Aggregates results using standard promises / async generators with `Promise.allSettled` semantics.

---

## 4. State Persistence & Audit Trails

- **LocalFirst State Store**:
  - Workflow state, step history, and execution logs are stored in IndexedDB using the Eliot Memory Engine format.
- **Audit Logging**:
  - Every state transition emits an immutable `WorkflowAuditEvent` to the audit log:
    ```typescript
    interface WorkflowAuditEvent {
      eventId: string;
      workflowId: string;
      stepId: string;
      previousState: string;
      newState: string;
      timestamp: number;
      payloadHash: string;
      actor: 'system' | 'user' | 'agent';
    }
    ```
- **Observability**:
  - Integrated directly into Eliot's existing Observability architecture.
