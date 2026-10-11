# ADR-004: Event-Driven Architecture and Typed EventBus

* **Status**: Accepted
* **Date**: 2026-08-06
* **Deciders**: Eliot Core Architecture Team
* **Technical Area**: Cross-Domain Communication, System Decoupling, Event Architecture

---

## Context and Problem Statement
Eliot consists of 12 distinct functional domains (`dom-001` through `dom-012`). Direct synchronous method calls between domains (e.g. `LearningDomain` directly importing and invoking `MemoryDomain` and `DashboardDomain`) leads to tight coupling, circular import dependencies, and fragile code paths where modifying one domain destabilizes unrelated system views.

---

## Decision Drivers
1. **Domain Decoupling**: Bounded context isolation where domains react to state changes without hard dependencies on handlers.
2. **Type Safety**: Event payloads must be strongly typed across publish and subscribe operations.
3. **Auditability**: Asynchronous event streams provide a clear execution trace for system events (e.g., practice event completed, evidence verified, memory decay threshold reached).
4. **Testability**: Individual domains can be tested in isolation by emitting or mocking event bus triggers.

---

## Decision Outcome
**Chosen Option**: **Centralized Typed EventBus & EventRegistry**.

Cross-domain communication is mediated through a single, strongly typed `EventBus` (`src/core/events/EventBus.ts`):
* All system events are declared in `EventRegistry` with strict TypeScript payload interfaces.
* Domains publish events (`eventBus.publish('PRACTICE_EVENT_COMPLETED', payload)`) without knowing which downstream listeners exist.
* Downstream domains (`dom-002-memory`, `dom-007-dashboard`, `dom-012-analytics`) subscribe independently.

```
[User Action in UI]
       │
       ▼
[LearningDomain] ──(Publishes)──► [EventBus]
                                     │
                 ┌───────────────────┼───────────────────┐
                 ▼                   ▼                   ▼
          [MemoryDomain]    [DashboardDomain]   [AnalyticsDomain]
```

### Positive Consequences
* **Zero Direct Domain Imports**: Eliminates circular imports across bounded contexts.
* **Extensibility**: Adding a new listener (e.g. telemetry logging) requires zero changes to the publishing domain.
* **Clean Asynchronous Execution**: Non-blocking event distribution improves UI performance.

### Negative Consequences
* **Indirect Execution Flow**: Traceability requires checking `EventRegistry` subscriptions rather than stepping through direct call stacks.
