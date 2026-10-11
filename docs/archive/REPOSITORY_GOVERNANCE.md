# EAR-1 — Repository & Engineering Governance

## Governance Philosophy

As Eliot expands into an AI + Automation Orchestration Platform, maintaining architectural integrity, system reliability, and high code quality requires strict, automated governance controls.

---

## Technical Governance Standards

### 1. Decision Standards: RFCs & ADRs

- **Architectural Decision Records (ADRs)**:
  - Every architectural change (e.g., adding a database, modifying CKM schema, changing AI router behavior) MUST be documented as an ADR in `/docs/adr/000X-title.md`.
  - Required sections: `Status`, `Context`, `Decision`, `Consequences`, `Alternatives Considered`.

- **Request for Comments (RFCs)**:
  - Major feature proposals require an RFC reviewed by at least two maintainers before implementation begins.

---

## 2. CI/CD Pipeline & Automated Testing Gates

```
[Git Push] --> [Lint & TypeCheck] --> [Unit Tests] --> [Integration Tests] --> [E2E Playwright] --> [Security Scan] --> [Release Gate]
```

- **Testing Thresholds**:
  - **Unit Test Coverage**: Minimum 85% statement coverage required for core modules (`@eliot/core`, `@eliot/ai-router`, `@eliot/workflow`).
  - **Type Checking**: Strict TypeScript validation (`tsc --noEmit`) with zero `any` suppressions in core packages.
  - **E2E Validation**: Playwright test suite covering Focus Environment transitions, CKM node creation, and workflow execution.

---

## 3. AI-Generated Code Governance & Safety Guardrails

Because Eliot leverages AI agent coders (including Antigravity, Gemini, and Cursor):

1. **Mandatory Human / Automated Review Gate**:
   - AI-generated pull requests must pass 100% of automated linting, type-checking, and build compilation before human review.
   - AI code MUST NOT modify frozen core architectural boundaries without explicit maintainer override.

2. **Automated Static Analysis & Dependency Audit**:
   - `npm audit` / Snyk scan runs on every PR to prevent hallucinated dependency injections or vulnerable npm packages.
   - AST parsing checks enforce security rules (e.g., preventing un-sanitized `eval()`, unsafe `innerHTML`, or hardcoded secrets).

3. **Branch Protection Rules**:
   - `main` branch requires signed commits, status checks pass, and at least 1 approving maintainer review.
