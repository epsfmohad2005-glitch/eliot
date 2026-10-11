# VISUAL INTEGRATION PLAN (VIR-1)

## Executive Summary

The **Visual Integration Review (VIR-1)** presents a comprehensive engineering and architectural plan to harmonize the existing **Eliot Personal Learning Operating System (PLOS)** visual layer with the newly approved **Google Stitch Design Package**. 

Eliot's functional core—including the Cognitive Knowledge Model (CKM), Cognitive Decision Engine (CDE), Memory Ebbinghaus Decay Engine, Local Ledger, Domain Event Bus, and Bilingual I18n System—remains 100% frozen and untouched. This integration is strictly confined to the visual presentation layer (CSS themes, Tailwind design tokens, font definitions, component styling, and mode-switching visual wrappers).

The Google Stitch Design Package introduces a refined **Dual-Palette Architecture**:
1. **Operator Mode (Default/Technical Dark)**: Obsidian (`#0A0A0A`) canvas, Deep Charcoal (`#121212`), `#141313` surfaces, and Focus Mint (`#00FFC2`) signal accent.
2. **Scholar Mode (Paper/Reading Light)**: Cream (`#F5F2ED`) paper surface, Ink (`#1A1A1A`) body typography, and Oxblood (`#800020`) scholarly accents.
3. **Architect Mode (Blueprint Technical)**: Deep Blueprint Dark Blue (`#101827`) with grid alignment lines and IBM Plex Mono accents.

By upgrading Eliot's visual tokens and component wrappers to support these Stitch states, Eliot will achieve higher spatial clarity, reduced long-session fatigue, and a distinct aesthetic distinction between technical management and deep scholarly focus.

---

## Overall Compatibility Score

| Compatibility Area | Score | Justification |
| :--- | :---: | :--- |
| **Philosophy & Intent** | `96 / 100` | Both frameworks mandate "Cognitive Silence", zero gamification fluff, and mathematical spatial discipline. |
| **Domain Architecture** | `100 / 100` | Zero domain service or state machine changes required. Visual layer is cleanly isolated. |
| **Typography System** | `92 / 100` | Upgrade from single sans-serif hierarchy to Inter (Utility) + Newsreader (Scholar Serif) + IBM Plex Mono. |
| **Color System** | `90 / 100` | Refinement from default Slate-950 dark theme to Dual-Palette (Operator Dark / Scholar Cream / Architect Grid). |
| **RTL & I18n Compatibility**| `95 / 100` | Stitch tokens preserve standard logical CSS properties and mirror transforms for Arabic/English support. |
| **Overall Readiness** | **`94 / 100`** | **EXCELLENT** — Ready for systematic 5-phase execution upon user approval. |

---

## Design Philosophy Alignment

* **Cognitive Silence**: Stitch reinforces Eliot's core philosophy of eliminating digital friction and visual clutter.
* **Dual-State Adaptation**:
  * *Operator Mode*: Optimizes high-density mission selection, system status, and ledger evidence verification.
  * *Scholar Mode*: Replaces harsh dark screens during long-form reading and reflection with a paper-textured Cream canvas (`#F5F2ED`) and serif typography (Newsreader 20px).
* **Mode Shift Easing**: Controlled 200ms `ease-out-quad` transitions prevent "cognitive snapping" during mode changes.

---

## Component Categorization

### Components Requiring Redesign (Visual Layout Upgrade)
1. **Command Bar / Intention Input**: Upgrade to Stitch Floating Command Deck with centered Intention prompt and Focus Mint terminal icons.
2. **Mission Control / Boot View**: Adapt to dual-mode (Operator HUD / Architect Grid) with technical coordinate overlays.
3. **Learning Workspace / Socratic View**: Support full **Scholar Mode** paper surface layout, Newsreader serif typography, and Oxblood margin notes.

### Components Requiring Refinement (Token & Style Alignment)
1. **System StatusBar & Header Bar**: Apply Operator Slate `#141313` surfaces and Focus Mint active status dots.
2. **Navigation Frame**: Apply 8px rounded Operator borders and clean mode toggles.
3. **Knowledge Map & Memory Timeline**: Update node borders, decay bars, and detail cards to respect Operator/Scholar color tokens.
4. **Onboarding & Feedback Modals**: Replace generic dark backdrops with backdrop-blur translucency and Stitch typography.

### Components Remaining Unchanged (Architecturally Frozen)
* All Domain Services (`learningDomainService`, `knowledgeDomainService`, `memoryDomainService`, `localTelemetryService`).
* All Types, State Machines, LocalStorage Persistence Logic, and Event Bus subscribers.
* Bilingual Translation Infrastructure (`useLanguage()`, `i18n/locales/en.ts`, `ar.ts`).

---

## Migration Strategies

### 1. Design Token Migration Strategy
* Extend `tailwind.config.js` or Vite CSS configuration with the official Stitch token names:
  * Colors: `operator-bg` (`#0A0A0A`), `focus-mint` (`#00FFC2`), `scholar-ink` (`#1A1A1A`), `scholar-oxblood` (`#800020`), `surface-container-low` (`#1C1B1B`), `blueprint-bg` (`#101827`).
  * Spacing: `gutter-scholar` (`120px`), `margin-desktop` (`64px`), `margin-mobile` (`24px`).
  * Radius: `sm` (4px), `DEFAULT` (8px), `md` (12px), `scholar` (0px sharp).

### 2. Typography Migration Strategy
* Import **Newsreader** (serif) and **IBM Plex Mono** alongside **Inter** in `index.html`.
* Map utility classes:
  * `.font-display-lg`: Newsreader 48px/56px
  * `.font-headline-md`: Newsreader 24px/32px
  * `.font-scholar-body`: Newsreader 20px/32px
  * `.font-ui-body`: Inter 15px/24px
  * `.font-mono-ui`: IBM Plex Mono / Inter 13px/20px

### 3. Color Migration Strategy
* Introduce a top-level theme state or class switcher (`mode-operator`, `mode-scholar`, `mode-architect`) attached to the main workspace layout.

### 4. Motion Migration Strategy
* Implement standard CSS / Motion timing curves: `transition-all duration-200 ease-out` for mode shifts and hover states.

### 5. Icon Migration Strategy
* Retain `lucide-react` for system icons while adding Material Symbols Outlined font fallback where specified in Stitch mockups.

---

## Responsive & RTL Strategy

* **Mobile Adaptability**: Collapse Scholar gutters (`120px` -> `24px`) on viewports under 768px. Touch targets remain minimum 44px.
* **RTL Mirroring**: Preserve all `isRTL` logic and direction-aware CSS flex/grid layout properties established in Sprint I18N-1.

---

## Risk Analysis

1. **Risk: Font Flashing (FOUT)**
   * *Mitigation*: Pre-connect and link Google Fonts (`Newsreader`, `Inter`, `IBM Plex Mono`) directly in `index.html` header.
2. **Risk: Contrast Degradation in Scholar Mode**
   * *Mitigation*: Maintain `#1A1A1A` Ink on `#F5F2ED` Cream (WCAG AAA contrast ratio > 14:1).
3. **Risk: Unintended Component State Mutations**
   * *Mitigation*: Strictly wrap visual mode switches in presentation-only React Context, keeping domain logic unaware of theme changes.

---

## Estimated Implementation Phases

* **Phase 1**: Design Tokens, Fonts, & Tailwind Theme Setup
* **Phase 2**: Base Component Library Styling (Buttons, Inputs, Cards)
* **Phase 3**: Core Views Upgrade (Mission Control, Workspace, Socratic Scholar Mode)
* **Phase 4**: Secondary Views Upgrade (Knowledge Map, Memory Timeline, Modals)
* **Phase 5**: RTL Verification, Animations, & Final Polish Audit
