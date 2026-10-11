# ELIOT EXPERIENCE IMPROVEMENT BACKLOG

**Version:** 1.0.0  
**Scope:** Prioritized Experience Refinements (P0, P1, P2, P3)  

---

## 1. Backlog Summary & Priority Rules

This backlog captures future refinements to polish the user experience across all screens. Items are prioritized strictly by impact on cognitive continuity and user clarity.

---

## 2. Prioritized Improvement Backlog

### P0 (Critical Experience Blockers — Must Complete Before Production Release)
* None. All P0 requirements (Boot migration, Mission Control migration, FCS-1 component library, PIP-1 brand identity, LocalFirst draft recovery) are 100% complete and verified.

---

### P1 (High Impact — Recommended During Screen Migrations)
* **P1-01: Learning Session Workspace Migration (SMS-3)**: Refactor active Learning Session view to consume FCS-1 components and tokenized surfaces.
* **P1-02: Onboarding Modal Migration (SMS-4)**: Refactor `OnboardingModal.tsx` using the FCS-1 `<Modal>` primitive for first-time setup consistency.

---

### P2 (Medium Impact — Polish & Ergonomics)
* **P2-01: Keyboard Shortcut Hints**: Add subtle visual keyboard triggers (`⌘K`, `Space`, `Esc`) in Layer 5 quiet information for power users.
* **P2-02: Long Session Eye-Rest Prompts**: Introduce optional non-intrusive micro-banners after 60 minutes of uninterrupted study.

---

### P3 (Low Impact — Long-Term Architectural Enhancements)
* **P3-01: Offline Telemetry Bus Visualization**: Enhance Layer 5 debug panel to display local IndexedDB transaction logs for developer auditing.
* **P3-02: Conceptual Audio Haptic Tones**: Implement optional low-frequency 120Hz sine pulse for focus sprint completion (Disabled by default).
