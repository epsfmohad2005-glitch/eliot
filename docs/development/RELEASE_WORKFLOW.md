# Eliot Production Release Workflow & Deployment Guide

* **Document Version**: 1.0.0
* **Target Runtime**: Cloud Run Containers (Port 3000 / Nginx Reverse Proxy)

---

## 1. Semantic Versioning Protocol

Eliot releases follow strict Semantic Versioning (`vMAJOR.MINOR.PATCH`):

* **MAJOR (`vX.0.0`)**: Fundamental schema upgrades to the `KnowledgeLedger` or breaking changes to core domain contract interfaces.
* **MINOR (`v1.X.0`)**: Addition of new domain capabilities, import providers, workspace frames, or analytical metrics.
* **PATCH (`v1.0.X`)**: Bug fixes, performance optimizations, localized translation key additions, or documentation updates.

---

## 2. Build Pipeline Architecture

The release build pipeline operates as a dual compilation step handled via `npm run build`:

```
                  ┌───────────────────────────────┐
                  │       npm run build           │
                  └───────────────┬───────────────┘
                                  │
         ┌────────────────────────┴────────────────────────┐
         ▼                                                 ▼
┌─────────────────────────┐               ┌─────────────────────────────┐
│  Vite Frontend Build    │               │    esbuild Server Bundle    │
│  Outputs to dist/       │               │ Outputs to dist/server.cjs  │
└─────────────────────────┘               └─────────────────────────────┘
```

1. **Vite Build**: Compiles React 18, TypeScript, and CSS assets into static production bundles inside `dist/`.
2. **esbuild Bundler**: Compiles `server.ts` into a single, bundled, CommonJS file (`dist/server.cjs`). Bypasses runtime ES module resolution checks and optimizes container cold-start times.

---

## 3. Production Release Checklist

Before tagging a release tag:

1. **Clean Workspace State**: Ensure `git status` shows zero uncommitted changes.
2. **Audit Verification**: Run `npm run lint` and `npm run test` cleanly.
3. **End-to-End Verification**: Run `npm run test:e2e` against headless Chromium.
4. **Build Verification**: Run `npm run build` and ensure `dist/server.cjs` and `dist/index.html` are produced without errors.
5. **Start Script Verification**: Test container boot locally via `npm run start` (binds to `0.0.0.0:3000`).

---

## 4. Environment Variables

| Variable Name | Exposure | Required | Description |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | Server | Yes | Set to `"production"` during runtime. |
| `PORT` | Server | Yes (3000) | Hardcoded port 3000 bound to host `0.0.0.0`. |
| `GEMINI_API_KEY` | Server-Only | Optional | API key for server-side LLM extraction assistance. |

*Note: All new environment variables must be declared in `.env.example`.*
