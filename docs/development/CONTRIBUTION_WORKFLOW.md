# Eliot Contribution & PR Workflow

* **Document Version**: 1.0.0
* **Target Audience**: All Contributors and Maintainers

---

## 1. Specification-First Contribution Model

Eliot operates under a **Specification-First Development Philosophy**. No code changes or feature additions may be submitted without an approved technical specification that directly references the **Project Bible** (`PROJECT_BIBLE.md`).

### Step 1: Specification Derivation
Before writing code:
1. Identify the target domain (`dom-001` through `dom-012`).
2. Verify that the feature aligns with the 8-stage learning lifecycle and constitutional principles.
3. Confirm non-goals: Reject any request introducing gamification, social feeds, public leaderboards, or AI ghostwriting.

### Step 2: Branch Naming Conventions
Create a feature branch from `main`:
* `feature/<domain>-<short-description>` (e.g. `feature/dom-002-decay-floor`)
* `fix/<domain>-<issue-description>` (e.g. `fix/dom-011-hash-mismatch`)
* `docs/<topic>` (e.g. `docs/adr-update`)

---

## 2. Local Development & Verification Steps

Before opening a pull request, execute the pre-commit verification checklist:

1. **Linting Verification**:
   ```bash
   npm run lint
   ```
   Must pass with zero TypeScript errors or linter warnings (`tsc --noEmit`).

2. **Automated Test Suite**:
   ```bash
   npm run test
   ```
   All unit and integration tests must pass with 100% success rate.

3. **End-to-End Test Suite**:
   ```bash
   npm run test:e2e
   ```
   All Playwright user journeys must execute green in headless Chromium.

4. **Production Build Verification**:
   ```bash
   npm run build
   ```
   Compiles Vite frontend bundle and esbuild CommonJS server (`dist/server.cjs`).

---

## 3. Pull Request Standards & Gatekeeping

Every Pull Request must include:
* **Title**: Clear, domain-prefixed description (e.g., `feat(dom-002): enforce memory decay cap floor`).
* **Summary**: Concise high-level summary of functional changes.
* **Test Verification Proof**: Output logs showing `npm run test` and `npm run test:e2e` passing.
* **Bible Traceability**: Citation of specific chapters from `PROJECT_BIBLE.md` justifying the change.

### PR Gatekeeping & Automatic Rejection Criteria
A pull request will be **immediately rejected** if it:
* Introduces XP, levels, badges, streaks, or confetti animations (violates ADR-002).
* Uses `any` types or bypasses strict TypeScript checks.
* Modifies `KnowledgeLedger` immutable records without backward compatibility migrations.
* Breaches domain boundaries with tight synchronous cross-domain imports.
