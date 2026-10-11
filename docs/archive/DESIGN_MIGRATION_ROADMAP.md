# DESIGN MIGRATION ROADMAP (VIR-1)

This roadmap outlines the 5-phase execution plan for integrating the approved **Google Stitch Design Package** into **Eliot PLOS**. 

Each phase is strictly isolated to the visual layer, ensuring zero disruption to domain models, business logic, CKM/CDE state engines, or offline persistence.

---

## Phase Overview

```
┌────────────────────────────────────────────────────────────────────────┐
│ Phase 1: Design Tokens, Typography, & Foundation Colors                │
├────────────────────────────────────────────────────────────────────────┤
│ Phase 2: Base UI Components & Command Deck HUD Styling                 │
├────────────────────────────────────────────────────────────────────────┤
│ Phase 3: Mission Control, Boot Sequence, & Scholar Mode Workspace      │
├────────────────────────────────────────────────────────────────────────┤
│ Phase 4: Knowledge Map, Memory Timeline, & System Modals Refinement   │
├────────────────────────────────────────────────────────────────────────┤
│ Phase 5: Motion Easing, RTL Audit, Accessibility, & Final Polish      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Design Tokens, Typography, & Foundation Colors

**Objective**: Establish the core Google Stitch visual foundation within the application styling architecture.

### Tasks
1. **Font Preloading (`index.html`)**:
   * Add Google Fonts links for `Newsreader` (Serif: 400, 500, italic), `Inter` (Sans: 400, 500, 600), `IBM Plex Mono` (Mono: 400, 500), and `Material Symbols Outlined`.
2. **Tailwind Config / Theme Expansion**:
   * Register color tokens: `operator-bg` (`#0A0A0A`), `focus-mint` (`#00FFC2`), `scholar-ink` (`#1A1A1A`), `scholar-oxblood` (`#800020`), `surface-dim` (`#141313`), `blueprint-bg` (`#101827`).
   * Register typography families: `display-lg`, `headline-md`, `scholar-body`, `ui-body`, `mono-ui`.
   * Register spacing tokens: `gutter-scholar` (`120px`), `margin-desktop` (`64px`), `margin-mobile` (`24px`).
3. **Global CSS Utility Classes (`src/index.css`)**:
   * Define `.scholar-bg` paper texture overlay and mode container wrappers.

### Verification Criteria
* `compile_applet` & `lint_applet` pass cleanly.
* Font declarations load properly without build errors.

---

## Phase 2: Base UI Components & Command Deck HUD Styling

**Objective**: Refine shared interactive controls, buttons, inputs, and the Command Bar.

### Tasks
1. **Buttons & Controls**:
   * *Operator Primary*: Obsidian background `#0A0A0A`, 1px subtle border, Focus Mint `#00FFC2` text/icon, 8px radius.
   * *Scholar Ghost*: Transparent background, Ink `#1A1A1A` border, Newsreader serif text, 0px radius.
2. **Inputs & Command Deck**:
   * Implement floating translucent HUD Command Bar with backdrop blur (`backdrop-blur-2xl`), Focus Mint terminal icon indicator, and clear focus ring states.
3. **Status Bars & Header Navigation**:
   * Update `SystemStatusBar` and `HeaderBar` with `#141313` background surfaces and Focus Mint active status dots.

### Verification Criteria
* All interactive controls maintain explicit focus rings and 44px minimum touch targets on mobile.

---

## Phase 3: Mission Control, Boot Sequence, & Scholar Mode Workspace

**Objective**: Upgrade main operational views and introduce Scholar Mode for long-form study.

### Tasks
1. **Boot Experience & Intention Screen**:
   * Refactor `BootSequenceView` to offer technical blueprint grid background styling (`bg-[#101827]`, coordinate indicators, typewriter cursor effect).
2. **Mission Control**:
   * Restructure `MissionControlView` around the central Intention Deck with recovery flow links ("Resume Mission: Neural Architectures").
3. **Scholar Mode Workspace**:
   * Wrap `LearningSessionWorkspace`, `PracticeWorkspaceView`, and `ReflectionView` in a Scholar Mode paper canvas when active.
   * Set body text font to Newsreader 20px (`font-scholar-body`), background to Cream `#F5F2ED`, text to Ink `#1A1A1A`, and margin connector accents to Oxblood `#800020`.

### Verification Criteria
* Smooth visual transition between Operator (Dark) and Scholar (Paper) modes without layout shifts.

---

## Phase 4: Knowledge Map, Memory Timeline, & System Modals Refinement

**Objective**: Align data-dense analysis views and modal dialogs with Stitch tokens.

### Tasks
1. **Knowledge Map (`KnowledgeMapView`)**:
   * Style concept nodes with Focus Mint active highlights, sharp technical borders, and monospace category metadata.
2. **Memory Timeline (`MemoryTimelineView`)**:
   * Refine Ebbinghaus decay progress bars and review alert banners using high-contrast slate and mint indicators.
3. **Modals (`OnboardingModal`, `FeedbackCenterModal`, `LocalTelemetryModal`)**:
   * Apply translucent dark backdrop blur (`backdrop-blur-md`), 1px high-contrast borders, and clean typography hierarchy.

### Verification Criteria
* All graph visuals and memory decay bars render clearly in both LTR and RTL orientations.

---

## Phase 5: Motion Easing, RTL Audit, Accessibility, & Final Polish

**Objective**: Final visual auditing, animation tuning, and bilingual RTL verification.

### Tasks
1. **Motion Tuning**:
   * Verify all mode transitions and button hover states use smooth `200ms ease-out-quad` motion curves.
2. **Bilingual RTL Audit**:
   * Verify Arabic (`ar`) mode renders correctly with `dir="rtl"`, proper margins, and flipped directional arrow icons in Stitch layouts.
3. **Accessibility Audit**:
   * Ensure text contrast ratios meet WCAG AAA standards (> 7:1 for normal text, > 14:1 for Scholar mode).

### Verification Criteria
* Complete verification via `compile_applet` and `lint_applet`.
* 100% build green with zero visual regressions or broken state triggers.

---

## Architectural Protection Guarantee

At every phase of this roadmap, the following invariants are guaranteed:
* **NO domain model modifications**.
* **NO service interface changes**.
* **NO telemetry or state machine mutations**.
* **NO breaking changes to Arabic/English translations**.
