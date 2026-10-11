# Eliot PLOS — Project Tree (Sprint 0.1)

```
.
├── .gitignore
├── metadata.json
├── package.json
├── README.md
├── SPRINT_0_1_REVIEW.md
├── PROJECT_TREE.md
├── FILE_MANIFEST.md
├── ARCHITECTURE_MAP.md
├── DEPENDENCY_GRAPH.md
├── IMPLEMENTATION_SUMMARY.md
├── DEVIATION_REPORT.md
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    ├── assets/
    │   └── README.md
    ├── config/
    │   ├── environment.ts
    │   ├── featureFlags.ts
    │   └── index.ts
    ├── types/
    │   ├── domains.ts
    │   ├── events.ts
    │   ├── handoffs.ts
    │   └── index.ts
    ├── core/
    │   ├── errors/
    │   │   ├── DomainErrors.ts
    │   │   ├── Result.ts
    │   │   └── index.ts
    │   ├── events/
    │   │   ├── EventBus.ts
    │   │   ├── EventRegistry.ts
    │   │   ├── types.ts
    │   │   └── index.ts
    │   ├── state/
    │   │   ├── LearningStageMachine.ts
    │   │   ├── ReviewPipelineMachine.ts
    │   │   ├── types.ts
    │   │   └── index.ts
    │   ├── storage/
    │   │   ├── IndexedDBAdapter.ts
    │   │   ├── LocalStorageAdapter.ts
    │   │   ├── StorageAdapter.ts
    │   │   └── index.ts
    │   ├── ai/
    │   │   ├── AIProvider.ts
    │   │   ├── Constitution.ts
    │   │   ├── PromptTemplates.ts
    │   │   └── index.ts
    │   └── memory/
    │       ├── DecayEngine.ts
    │       ├── MemoryStore.ts
    │       └── index.ts
    ├── domains/
    │   ├── index.ts
    │   ├── dom-001-learning/
    │   │   ├── index.ts
    │   │   └── contracts/
    │   │       └── ServiceInterface.ts
    │   ├── dom-002-memory/
    │   │   ├── index.ts
    │   │   └── contracts/
    │   │       └── ServiceInterface.ts
    │   ├── dom-003-knowledge/
    │   │   ├── index.ts
    │   │   └── contracts/
    │   │       └── ServiceInterface.ts
    │   ├── dom-004-ai-core/
    │   │   ├── index.ts
    │   │   └── contracts/
    │   │       └── ServiceInterface.ts
    │   ├── dom-005-project/
    │   │   ├── index.ts
    │   │   └── contracts/
    │   │       └── ServiceInterface.ts
    │   ├── dom-006-career/
    │   │   ├── index.ts
    │   │   └── contracts/
    │   │       └── ServiceInterface.ts
    │   ├── dom-007-dashboard/
    │   │   ├── index.ts
    │   │   └── contracts/
    │   │       └── ServiceInterface.ts
    │   ├── dom-008-navigation/
    │   │   ├── index.ts
    │   │   └── contracts/
    │   │       └── ServiceInterface.ts
    │   ├── dom-009-review/
    │   │   ├── index.ts
    │   │   └── contracts/
    │   │       └── ServiceInterface.ts
    │   ├── dom-010-settings/
    │   │   ├── index.ts
    │   │   └── contracts/
    │   │       └── ServiceInterface.ts
    │   ├── dom-011-evidence/
    │   │   ├── index.ts
    │   │   └── contracts/
    │   │       └── ServiceInterface.ts
    │   └── dom-012-analytics/
    │       ├── index.ts
    │       └── contracts/
    │           └── ServiceInterface.ts
    └── shared/
        ├── components/
        │   ├── AppShell.tsx
        │   ├── HeaderBar.tsx
        │   ├── NavigationFrame.tsx
        │   ├── SystemStatusBar.tsx
        │   └── index.ts
        └── utils/
            ├── cn.ts
            └── index.ts
```
