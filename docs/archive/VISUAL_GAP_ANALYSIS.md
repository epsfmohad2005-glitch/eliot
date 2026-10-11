# VISUAL GAP ANALYSIS (VIR-1)

This report detail every visual difference between the current **Eliot PLOS** implementation and the approved **Google Stitch Design Package**, along with severity classification and concrete action recommendations.

---

## Gap Summary Matrix

| Gap ID | Category | Description | Severity | Recommended Action |
| :--- | :--- | :--- | :---: | :--- |
| **GAP-01** | Color & Theme | Dark theme uses generic Slate-950 instead of Stitch Obsidian (`#0A0A0A`) & Focus Mint (`#00FFC2`). | **High** | Map Stitch color tokens into Tailwind theme and root CSS variables. |
| **GAP-02** | Deep Work Mode | Absence of light "Scholar Mode" (Paper Cream `#F5F2ED` with Oxblood `#800020` accents). | **Critical** | Implement presentation-only Scholar Mode container switcher for reading & reflection views. |
| **GAP-03** | Typography | Application relies primarily on generic sans-serif without Newsreader serif or IBM Plex Mono. | **High** | Load Newsreader & IBM Plex Mono fonts in `index.html` and define `.font-display-lg` and `.font-scholar-body` classes. |
| **GAP-04** | Command Deck | Mission Control intension prompt uses standard input card rather than central floating HUD Command Bar. | **High** | Redesign Intention Prompt container to match Stitch floating Command Deck HUD layout. |
| **GAP-05** | Border Radius | Uniform 8px/12px border radii used across all views without distinction between Operator (8px) and Scholar (0px sharp). | **Medium** | Apply mode-dependent border-radius classes (`rounded-lg` for Operator, `rounded-none` for Scholar). |
| **GAP-06** | Architect View | Boot sequence lacks optional Blueprint Grid overlay (`#101827` background with technical coordinate crosshairs). | **Medium** | Add technical blueprint grid pattern utility to boot sequence background framing. |
| **GAP-07** | Icon System | Current icons are strictly Lucide SVG without optional Material Symbols font alignment. | **Low** | Include Material Symbols font link in `index.html` as secondary icon utility where applicable. |
| **GAP-08** | Spatial Gutters | Workspace padding is standard 16px/24px without Scholar's 120px wide reading margin on desktop viewports. | **Medium** | Add `md:px-gutter-scholar` (`120px`) spacing token to long-form reading contexts. |

---

## Detailed Gap Analysis by Component

### 1. Global Shell & Navigation Header (`HeaderBar`, `NavigationFrame`, `SystemStatusBar`)
* **Current Implementation**: Slate-900 background with Indigo-500 active indicators and standard sans-serif text.
* **Stitch Specification**: Obsidian `#0A0A0A` background, Focus Mint `#00FFC2` active state dots, monospace status labels, and seamless mode indicator.
* **Gap Severity**: **High**
* **Action**: Update surface background classes to `bg-operator-bg` (`#0A0A0A`) and signal accents to `text-focus-mint`.

### 2. Intention & Mission Control (`MissionControlView`)
* **Current Implementation**: Standard dashboard grid showing stats, enqueued units, and simple input box.
* **Stitch Specification**: Centered command prompt ("What is my intention for this session?"), translucent floating command bar (`backdrop-blur-2xl`), Focus Mint terminal icon, and subtle bottom recovery button ("Resume Mission").
* **Gap Severity**: **High**
* **Action**: Refactor container layout to match the minimalist centered command bar HUD structure.

### 3. Socratic Learning & Practice Workspace (`LearningSessionWorkspace`, `PracticeWorkspaceView`, `ReflectionView`)
* **Current Implementation**: Dark slate container for all study, practice, and reflection stages.
* **Stitch Specification**: Seamless transition into **Scholar Mode**—Paper Cream background (`#F5F2ED`), Ink `#1A1A1A` text, 20px Newsreader serif body text, 0px sharp rectangular card edges, and Oxblood `#800020` margin annotations.
* **Gap Severity**: **Critical**
* **Action**: Add Scholar Mode visual wrapper class to long-form reading and reflection views.

### 4. Knowledge Map & Memory Timeline (`KnowledgeMapView`, `MemoryTimelineView`)
* **Current Implementation**: Standard dark graph node layout with blue/purple decay indicators.
* **Stitch Specification**: High-precision Operator dark palette with Focus Mint node highlights, sharp border outlines, and explicit technical metadata grids.
* **Gap Severity**: **Medium**
* **Action**: Update node colors and memory retention track styling to utilize Focus Mint and Slate contrast tokens.

### 5. Modals & Dialogs (`OnboardingModal`, `FeedbackCenterModal`, `LocalTelemetryModal`)
* **Current Implementation**: Standard dark rounded cards (`rounded-xl` / `bg-slate-900`).
* **Stitch Specification**: Translucent backdrop blur (`backdrop-blur-md`), 1px high-contrast borders, and clear typographic hierarchy.
* **Gap Severity**: **Medium**
* **Action**: Refine backdrop styling and border properties across modal dialog wrappers.

---

## Alignment & Preservation Verification

* **Bilingual / RTL Integrity**: All proposed visual changes use logical CSS layout properties (`text-start`, `flex-row`, `ms-auto`) and preserve the `isRTL` flip transforms introduced in Sprint I18N-1.
* **Architecture Shield**: No state stores, domain services, API boundaries, or DB schemas are modified.

---

## Conclusion & Action Statement

All visual gaps are purely presentation-level and can be systematically closed across 5 implementation phases without touching any application logic or domain services.
