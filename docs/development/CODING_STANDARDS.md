# Eliot Engineering Coding Standards

* **Document Version**: 1.0.0
* **Target Audience**: All Eliot Core & Domain Engineers
* **Scope**: TypeScript, React, Domain Architecture, State Management

---

## 1. General Engineering Principles

1. **Explicit Monadic Error Handling (`Result<T, E>`)**:
   Domain service methods must return explicit `Result<T, E>` types (`Ok` / `Err`) instead of throwing raw exceptions across domain boundaries.
   ```typescript
   // GOOD
   async getConcept(id: string): Promise<Result<ConceptNode, DomainError>> { ... }

   // BAD
   async getConcept(id: string): Promise<ConceptNode> {
     if (!found) throw new Error("Not found");
   }
   ```

2. **Strict TypeScript & Zero `any`**:
   * Enable strict mode (`noImplicitAny`, `strictNullChecks`).
   * Do not use `any`. Use unknown, generics, or explicit union types.
   * Do not use `import type` to import enum values.

3. **Immutable Domain Entities**:
   Domain models must be updated immutably. Never mutate entity properties directly.
   ```typescript
   // GOOD
   const updatedNode = { ...node, masteryScore: 0.85 };

   // BAD
   node.masteryScore = 0.85;
   ```

4. **Domain Contract Segregation**:
   Every domain directory (`src/domains/dom-XXX-<name>/`) must expose its public contract via `contracts/ServiceInterface.ts` and export its service via `index.ts`. Private helpers must remain internal to the domain directory.

---

## 2. React & UI Component Standards

1. **Functional Components with TypeScript Props**:
   Define explicit prop interfaces for every React component.
   ```typescript
   interface MissionCardProps {
     title: string;
     progressPercent: number;
     onStartSession: (id: string) => void;
   }
   ```

2. **Tailwind Utility & FCS Design Tokens**:
   * Use Foundation Component System primitives (`FcsButton`, `FcsCard`, `FcsBadge`).
   * Apply design token CSS variables or Tailwind classes directly.
   * Inline `style={{ ... }}` attributes are forbidden.

3. **Import Placement & Structure**:
   Place all imports at the top level of the file in the following order:
   1. React & External Libraries
   2. Core Engines & EventBus
   3. Domain Services & Entities
   4. FCS Components & Design Tokens
   5. Types & Interfaces

4. **No Hardcoded UI Strings**:
   All user-facing text strings must reference translation dictionary keys via `useLanguage()` or i18n helper hooks.

---

## 3. Asynchronous & Event Standards

1. **Typed EventBus Publishing**:
   Events published to `EventBus` must reference keys defined in `EventRegistry`:
   ```typescript
   eventBus.publish('PRACTICE_EVENT_COMPLETED', {
     conceptId: 'CPT-001',
     score: 0.9,
     timestamp: new Date().toISOString()
   });
   ```

2. **Lazy API & Service Initialization**:
   SDKs or external API clients must initialize lazily when first invoked to prevent application crashes on boot if environment keys are unconfigured.

---

## 4. File Naming Conventions

| Artifact | Convention | Example |
| :--- | :--- | :--- |
| **Domain Services** | PascalCase | `MemoryDomainService.ts` |
| **Domain Contracts** | PascalCase | `ServiceInterface.ts` |
| **React Components** | PascalCase | `MissionControlFrame.tsx` |
| **Utility Functions** | camelCase | `cryptoUtils.ts` |
| **Unit Tests** | `.test.ts` / `.test.tsx` | `MemoryDomainService.test.ts` |
| **Integration Tests**| `.test.ts` | `CommitMemoryEngine.test.ts` |
