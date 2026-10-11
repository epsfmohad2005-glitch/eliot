# ELIOT: SPRINT 0 — FOUNDATION RUNTIME IMPLEMENTATION PLAN
**Document Version:** 1.0  
**Phase:** Sprint 0 — Foundation Runtime Planning  
**Author:** Chief Systems Architect & Lead Software Engineer  
**Status:** Pending Steering Committee Approval (Implementation Strictly Blocked)  

---

## 1. SPRINT GOAL

The primary goal of **Sprint 0** is to establish the architectural scaffold, domain isolation interfaces, event bus foundations, type definitions, state machine boundaries, and runtime infrastructure for the **Eliot Personal Learning Operating System (PLOS)**.

Sprint 0 builds the foundational substrate upon which all future domain features, AI reasoning engines, evidence registries, and user interfaces will be safely constructed in subsequent sprints. No application feature code or UI business logic will be implemented in Sprint 0; execution is strictly restricted to core foundation runtime architecture.

---

## 2. SPRINT SCOPE

### In Scope:
- Core application folder structure establishing strict 12-domain modular isolation.
- Global TypeScript interfaces and domain event contracts matching `CANONICAL_DOMAIN_MODEL.md` and `DOMAIN_RELATIONSHIP_MATRIX.md`.
- Asynchronous Event Bus interface and in-memory event broker pattern for cross-domain decoupled communications.
- Domain service abstractions and contract boundary enforcement wrappers.
- State Machine lifecycle definitions (XState v5 conceptual setup) for the 8-Stage Learning Lifecycle and Review evaluation pipelines.
- Structured Error and Result types (`Result<T, E>`) for zero-exception, deterministic error handling.
- Local Persistence Abstraction interfaces (IndexedDB / LocalStorage adapters) for offline-first data durability.
- AI Core abstraction contracts, prompt context builders, and constitutional response guardrail interfaces.
- Environment configuration and feature flag definitions in `.env.example` and runtime configuration registries.

### Out of Scope (Deferred to Sprints 1+):
- UI component construction and React visual layout rendering.
- Actual backend API integration or Gemini LLM live API calls.
- IndexedDB database schema migrations or physical database setup.
- User authentication, OAuth identity flows, or Cloud Run deployment pipelines.

---

## 3. DELIVERABLES

1. **`SPRINT_0_IMPLEMENTATION_PLAN.md`**: Approved production-grade implementation specification for Sprint 0.
2. **Domain Type System (`/src/types/`)**: TypeScript interface definitions for all 12 canonical domains, entities, domain events, and handoff payloads.
3. **Event Broker Engine (`/src/core/events/`)**: Strongly typed Event Bus interface and publisher/subscriber event dispatch engine.
4. **Domain Contract Interfaces (`/src/domains/`)**: Isolated module boundary contracts for all 12 domains.
5. **State Machine Foundation (`/src/core/state/`)**: Deterministic state machine transition engines for stage gating and review flows.
6. **Persistence Adapters (`/src/core/storage/`)**: Local storage and IndexedDB repository abstraction interfaces.
7. **AI & Memory Abstraction Contracts (`/src/core/ai/`, `/src/core/memory/`)**: Structured prompt wrappers, guardrails, and context retrieval adapters.

---

## 4. FOLDER STRUCTURE

The workspace directory structure enforces strict modular domain isolation and layered clean architecture:

```
/src
├── core/                        # Core runtime infrastructure (Framework-agnostic)
│   ├── events/                  # Cross-domain Event Bus and Event Broker
│   │   ├── EventBus.ts          # Event subscription interface
│   │   ├── EventRegistry.ts     # Master registry of 24+ canonical events
│   │   └── types.ts             # Event payload contracts
│   ├── state/                   # Deterministic State Machine Engine
│   │   ├── LearningStageMachine.ts # 8-Stage Learning Lifecycle state chart
│   │   ├── ReviewPipelineMachine.ts# Review verdict state chart
│   │   └── types.ts             # State machine transition contracts
│   ├── storage/                 # Persistence Abstractions
│   │   ├── StorageAdapter.ts    # Repository interface (KV and Document)
│   │   ├── IndexedDBAdapter.ts  # Local browser database wrapper
│   │   └── LocalStorageAdapter.ts# Fallback local preference storage
│   ├── ai/                      # AI Core Foundations & Guardrails
│   │   ├── AIProvider.ts        # Abstract AI service contract
│   │   ├── Constitution.ts      # Guardrail validator (Silence, Socratic rules)
│   │   └── PromptTemplates.ts   # Bounded prompt context formatters
│   ├── memory/                  # Cognitive Memory Engine Interfaces
│   │   ├── MemoryStore.ts       # Hybrid vector-relational store contract
│   │   └── DecayEngine.ts       # Temporal decay calculation formulas
│   └── errors/                  # Deterministic Error Handling
│       ├── Result.ts            # Monadic Result<T, E> implementation
│       └── DomainErrors.ts      # Error taxonomy per domain
│
├── domains/                     # The 12 Canonical Bounded Contexts
│   ├── dom-001-learning/        # Learning Domain Contracts & Logic
│   ├── dom-002-memory/          # Memory Domain Contracts & Logic
│   ├── dom-003-knowledge/       # Knowledge Graph Contracts & Logic
│   ├── dom-004-ai-core/         # AI Core Domain Contracts & Logic
│   ├── dom-005-project/         # Project Domain Contracts & Logic
│   ├── dom-006-career/          # Career Domain Contracts & Logic
│   ├── dom-007-dashboard/       # Dashboard Presentation Contracts
│   ├── dom-008-navigation/      # Navigation Router Contracts
│   ├── dom-009-review/          # Review Domain Contracts & Logic
│   ├── dom-010-settings/        # Settings & User Profile Contracts
│   ├── dom-011-evidence/        # Evidence Domain & Artifact Hasher
│   └── dom-012-analytics/       # Analytics & Velocity Contracts
│
├── types/                       # Master Canonical Types
│   ├── domains.ts               # Core domain ID and entity types
│   ├── events.ts                # Master event payload schemas
│   ├── handoffs.ts              # Cross-workflow handoff contracts
│   └── index.ts                 # Unified type exporter
│
└── config/                      # Environment & Runtime Configuration
    ├── environment.ts           # Environment variable validation
    └── featureFlags.ts          # Feature toggle definitions
```

---

## 5. MODULE STRUCTURE

Each domain folder under `/src/domains/` follows a standardized, encapsulated internal structure:

```
/src/domains/dom-xxx-name/
├── contracts/                   # Inbound and Outbound Interfaces
│   ├── ServiceInterface.ts      # Public API offered to other domains
│   └── EventHandlers.ts         # Event subscription listeners
├── model/                       # Domain Entities & Value Objects
│   ├── Entities.ts              # Core entity interfaces
│   └── ValueObjects.ts          # Immutable value types
├── services/                    # Internal Domain Logic
│   └── DomainService.ts         # Core business logic implementation
└── index.ts                     # Single Public Gateway (Strict Export Barrel)
```

**Rule:** Other domains MAY ONLY import from `/src/domains/dom-xxx-name/index.ts`. Deep imports into internal subdirectories (e.g., `import { ... } from 'dom-001/services/DomainService'`) are strictly forbidden.

---

## 6. APPLICATION LAYERS

The application is structured into four explicit clean architecture layers:

```
+-------------------------------------------------------------------------+
|  LAYER 4: PRESENTATION LAYER (React Components, Dashboard Views, UI)    |
+-------------------------------------------------------------------------+
                                    | (Dispatches UI events)
                                    v
+-------------------------------------------------------------------------+
|  LAYER 3: APPLICATION SERVICE LAYER (Use Cases, Workflow Orchestrators) |
+-------------------------------------------------------------------------+
                                    | (Invokes domain contracts)
                                    v
+-------------------------------------------------------------------------+
|  LAYER 2: DOMAIN LAYER (Pure Domain Logic, Entities, Events, Rules)    |
+-------------------------------------------------------------------------+
                                    | (Uses infrastructure abstractions)
                                    v
+-------------------------------------------------------------------------+
|  LAYER 1: INFRASTRUCTURE LAYER (Storage Adapters, Event Bus, AI SDK)    |
+-------------------------------------------------------------------------+
```

1. **Domain Layer (Layer 2):** Pure, framework-free business logic and type definitions. Contains zero dependencies on React, Vite, or external APIs.
2. **Infrastructure Layer (Layer 1):** Low-level utility implementations (IndexedDB, Event Bus, HTTP clients). Implements contracts defined in Domain and Core layers.
3. **Application Layer (Layer 3):** Orchestrates the 20 Canonical Workflows by composing domain services and event dispatches.
4. **Presentation Layer (Layer 4):** UI components and view controllers. Interacts with the system exclusively through Application Layer contracts and Event Bus subscriptions.

---

## 7. DEPENDENCY RULES

- **Rule 1 (Inward Dependency Law):** Outer layers may depend on inner layers; inner layers MUST NEVER depend on outer layers. Domain Layer (Layer 2) has zero external dependencies.
- **Rule 2 (Domain Isolation):** Domains may not import internal service files from other domains. All cross-domain interaction occurs via public domain index contracts or asynchronous Event Bus dispatch.
- **Rule 3 (No Circular Imports):** Circular dependencies between modules or domains are blocked by strict ESLint rules and barrel exports.
- **Rule 4 (No Direct Infrastructure Instantiation):** Domain services access infrastructure (storage, AI) through abstract interfaces provided via Dependency Injection.

---

## 8. SERVICE BOUNDARIES

Each domain exposes an explicit, strongly typed Service Interface:

- **`ILearningDomainService`**: Manages unit advancement, stage-gate verification requests, and path status queries.
- **`IMemoryDomainService`**: Exposes skill confidence profiles, mistake pattern queries, and memory synthesis methods.
- **`IKnowledgeDomainService`**: Provides read-only DAG traversal for prerequisite chains and concept definitions.
- **`IAICoreDomainService`**: Executes constitutional prompt formatting, Socratic response generation, and critique formatting.
- **`IProjectDomainService`**: Controls project milestone state, deliverable requirements, and completion checks.
- **`ICareerDomainService`**: Manages competency matrix mapping, career readiness score updates, and gap analyses.
- **`IReviewDomainService`**: Manages rubric evaluations, submission queuing, and verdict publishing.
- **`IEvidenceDomainService`**: Handles artifact hashing, registration, immutability verification, and payload retrieval.

---

## 9. STATE MANAGEMENT STRATEGY (CONCEPTUAL ONLY)

- **Domain State Machines:** Core business transitions (such as the 8-Stage Learning Lifecycle and Review Pipeline) are governed by explicit, deterministic state machines using XState v5. State transitions cannot occur without valid event triggers and passing guard conditions.
- **Reactive Event Bus:** Cross-domain communication is driven by an asynchronous Event Bus. When a domain mutates state, it publishes a domain event. Subscribing domains respond reactively without tight coupling.
- **Single Source of Truth:** Every entity has exactly one single owner domain. State is never duplicated across multiple domain stores; view components query owner domain services via unified hooks.

---

## 10. OFFLINE STRATEGY (CONCEPTUAL ONLY)

- **Local-First Architecture:** All user data, active learning stage states, evidence artifacts, and memory logs are persisted locally in IndexedDB before any network sync occurs.
- **Offline Action Queue:** When network connectivity or AI services are unavailable, operations (such as evidence submissions) are stored in an offline queue (`WF10 Review Scheduling`).
- **Cryptographic Artifact Verification:** Evidence artifacts are content-hashed (SHA-256) locally prior to storage, ensuring tamper-proof integrity offline.
- **Graceful Degradation:** AI-dependent workflows (`WF08`) transition to `Pending Review` state during offline periods without blocking non-dependent study or practice activities.

---

## 11. AI INTEGRATION READINESS

- **Abstract Provider Interface:** The AI Core isolates LLM SDK calls behind an `AIProvider` contract, ensuring seamless adaptability across Gemini versions or fallback providers.
- **Constitutional Guardrail Pipeline:** All prompt payloads pass through an outbound guardrail filter enforcing Silence (no unrequested interruptions), Socratic Questioning (no direct code answers), and Evidence Citation rules.
- **Structured JSON Schema Enforcement:** Review evaluations and critiques force LLM responses into strict, validated JSON schemas matching `VerdictPayload` contracts.
- **Server-Side Proxy Security:** API keys remain strictly hidden on the server side via `/api/*` proxy endpoints, preventing browser exposure.

---

## 12. MEMORY INTEGRATION READINESS

- **Hybrid Memory Model Interface:** Prepares abstraction contracts for storing structured relational items (mistake patterns, skill states) and vector embeddings (reflection insights).
- **Temporal Decay Engine:** Defines deterministic mathematical formulas for calculating time-decayed skill confidence scores ($\text{Confidence}(t) = C_0 \cdot e^{-\lambda t}$ with hard decay floor at $35\%$).
- **Context Budget Manager:** Includes token context budget trimming abstractions to ensure memory context payloads delivered to `DOM-004` fit cleanly within token limits.

---

## 13. MOBILE-FIRST READINESS

- **Single-Context Touch Target Specs:** Architecture enforces single-task workspace view frames (`DOM-007`), ensuring UI controls scale naturally down to mobile viewports (minimum 44px touch targets).
- **Responsive Navigation Frames:** `DOM-008: Navigation Domain` manages clean view transitions without requiring multi-panel desktop chrome.
- **Low-Bandwidth Optimization:** Payload contracts are light, JSON-serializable structures optimized for mobile battery and data efficiency.

---

## 14. FUTURE SCALABILITY

- **Modular Plugin Architecture:** Domains can be enhanced or replaced independently without affecting adjacent domains due to strict contract boundaries.
- **Vector Search Expansion:** The memory store interface allows upgrading from local in-memory search to cloud vector databases (e.g., Firestore vector search) seamlessly.
- **Multi-Device Sync Preparation:** Immutable domain events and content-hashed evidence records enable conflict-free eventual consistency syncing across devices in future releases.

---

## 15. CODING STANDARDS (CONCEPTUAL ONLY)

- **Strict TypeScript:** No `any` types permitted. All domain models, event payloads, and service methods must use explicit, strongly typed interfaces.
- **Deterministic Error Handling:** Domain methods return `Result<T, E>` monads (`Success(data)` or `Failure(error)`) instead of throwing unhandled runtime exceptions.
- **Immutability by Default:** All domain events, value objects, and evidence artifacts are marked `readonly`.
- **Pure Functions for Domain Rules:** Business logic calculations (e.g., career readiness percentage, skill decay points) are implemented as pure, side-effect-free functions.

---

## 16. RISKS

| Risk ID | Description | Impact | Mitigation Strategy |
|---|---|---|---|
| **RISK-01** | Type complexity explosion across 12 domains | Medium | Centralize core interfaces in `/src/types/` with strict barrel exports. |
| **RISK-02** | Cyclic event triggers causing infinite loops | High | Implement loop detection and event execution depth caps in the Event Bus. |
| **RISK-03** | Local storage size limits (IndexedDB/LocalStorage) | Medium | Content-hash evidence artifacts and compress payload strings. |
| **RISK-04** | Developer drift introducing UI logic into Domain Layer | High | Enforce strict ESLint layer boundary import rules. |

---

## 17. ACCEPTANCE CRITERIA

1. **Architecture Integrity:** Folder structure strictly mirrors all 12 domains and 4 clean architecture layers.
2. **Type Coverage:** 100% strongly typed interface coverage for all entities, 24+ domain events, and 4 handoff payloads without `any`.
3. **Event Bus Functional Contract:** Event Bus correctly publishes, subscribes, and dispatches strongly typed domain events.
4. **State Machine Validity:** Learning Stage state chart correctly models all 8 stages and enforces sequential transitions.
5. **Compilation Success:** The project compiles cleanly via `compile_applet` with zero TypeScript errors or linter warnings.
6. **Zero Code Rule Compliance:** No UI layout rendering or backend API feature logic is built in Sprint 0.

---

## 18. DEFINITION OF DONE

Sprint 0 is considered complete when:
- All files listed in Section 19 are generated and compiled cleanly.
- `compile_applet` runs and reports build success.
- `lint_applet` runs with zero fatal syntax or type errors.
- The foundation runtime is completely ready for Sprint 1 feature development.

---

## 19. FILES EXPECTED TO BE CREATED IN SPRINT 0

Upon receiving steering committee approval to execute Sprint 0 implementation, the following files will be created in the codebase:

```
/src/types/domains.ts
/src/types/events.ts
/src/types/handoffs.ts
/src/types/index.ts

/src/core/errors/Result.ts
/src/core/errors/DomainErrors.ts

/src/core/events/EventBus.ts
/src/core/events/EventRegistry.ts
/src/core/events/types.ts

/src/core/state/LearningStageMachine.ts
/src/core/state/ReviewPipelineMachine.ts
/src/core/state/types.ts

/src/core/storage/StorageAdapter.ts
/src/core/storage/IndexedDBAdapter.ts
/src/core/storage/LocalStorageAdapter.ts

/src/core/ai/AIProvider.ts
/src/core/ai/Constitution.ts
/src/core/ai/PromptTemplates.ts

/src/core/memory/MemoryStore.ts
/src/core/memory/DecayEngine.ts

/src/domains/dom-001-learning/contracts/ServiceInterface.ts
/src/domains/dom-001-learning/index.ts

/src/domains/dom-002-memory/contracts/ServiceInterface.ts
/src/domains/dom-002-memory/index.ts

/src/domains/dom-003-knowledge/contracts/ServiceInterface.ts
/src/domains/dom-003-knowledge/index.ts

/src/domains/dom-004-ai-core/contracts/ServiceInterface.ts
/src/domains/dom-004-ai-core/index.ts

/src/domains/dom-005-project/contracts/ServiceInterface.ts
/src/domains/dom-005-project/index.ts

/src/domains/dom-006-career/contracts/ServiceInterface.ts
/src/domains/dom-006-career/index.ts

/src/domains/dom-007-dashboard/contracts/ServiceInterface.ts
/src/domains/dom-007-dashboard/index.ts

/src/domains/dom-008-navigation/contracts/ServiceInterface.ts
/src/domains/dom-008-navigation/index.ts

/src/domains/dom-009-review/contracts/ServiceInterface.ts
/src/domains/dom-009-review/index.ts

/src/domains/dom-010-settings/contracts/ServiceInterface.ts
/src/domains/dom-010-settings/index.ts

/src/domains/dom-011-evidence/contracts/ServiceInterface.ts
/src/domains/dom-011-evidence/index.ts

/src/domains/dom-012-analytics/contracts/ServiceInterface.ts
/src/domains/dom-012-analytics/index.ts

/src/config/environment.ts
/src/config/featureFlags.ts
```

---

## 20. ENGINEERING REVIEW

### Summary of Architectural Audit:
- **Domain Coverage:** 100% alignment with `CANONICAL_DOMAIN_MODEL.md` (DOM-001 through DOM-012).
- **Workflow Alignment:** 100% alignment with `CANONICAL_WORKFLOWS.md` (WF01 through WF20).
- **Layering & Isolation:** Clean separation between Domain, Infrastructure, Application, and Presentation layers guaranteed.
- **Readiness:** The implementation plan provides an airtight, production-grade roadmap for setting up Eliot's foundation runtime cleanly without developer ambiguity or architectural drift.

---
**END OF SPRINT 0 IMPLEMENTATION PLAN**
