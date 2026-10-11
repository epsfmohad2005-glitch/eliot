# ELIOT PERSONAL LEARNING OPERATING SYSTEM (PLOS)
## FOUNDATION COMPONENT SYSTEM SPECIFICATION (FCS-1)

**Version:** 1.0.0  
**Status:** Approved & Implemented  
**Author:** Lead Design Systems Engineer  
**Token Foundation:** Google Stitch Specification (VIR-1 / DM-1)

---

## 1. Overview & System Philosophy

The **Foundation Component System (FCS-1)** is Eliot's permanent visual component language. Built upon the Design Token System established in DM-1, FCS-1 provides a unified, strictly tokenized library of UI primitives that power every interaction across the personal learning operating system.

FCS-1 adheres strictly to Eliot's core visual identity principle: **Cognitive Silence**. Every component is designed to minimize visual noise while communicating state with mathematical clarity.

---

## 2. Architecture & Token Consumption

Every component in FCS-1 consumes visual tokens exclusively from `/src/config/design-tokens.ts` and the centralized CSS variable architecture defined in `/src/index.css`.

### Structural Hierarchy:
```
                                 ┌─────────────────────────────────┐
                                 │   Design Token System (DM-1)    │
                                 │  (/src/config/design-tokens.ts) │
                                 └────────────────┬────────────────┘
                                                  │
                                 ┌────────────────▼────────────────┐
                                 │    CSS Variable Architecture    │
                                 │        (/src/index.css)         │
                                 └────────────────┬────────────────┘
                                                  │
                                 ┌────────────────▼────────────────┐
                                 │   Foundation Component Library  │
                                 │     (/src/shared/components/ui) │
                                 └────────────────┬────────────────┘
                                                  │
                                 ┌────────────────▼────────────────┐
                                 │    Component Showcase (FCS-1)   │
                                 │ (/src/shared/components/showcase)│
                                 └─────────────────────────────────┘
```

---

## 3. Component Taxonomy

### 3.1 Input Primitives (`/src/shared/components/ui/Inputs.tsx`)
* **`TextInput`**: Standard single-line input with optional left/right icons, labels, error states, and helper text.
* **`SearchInput`**: Specialized search input with magnifying glass icon and instant clear button.
* **`PasswordInput`**: Secure input with visibility toggle.
* **`TextArea`**: Multi-line reflection and note input.
* **`NumberInput`**: Numeric input with step, min, and max validation constraints.

### 3.2 Button Primitives (`/src/shared/components/ui/Buttons.tsx`)
* **`Button`**: Primary, Secondary, Ghost, and Destructive variants. Supports `sm`, `md`, and `lg` sizes, loading spinners, and left/right icon placement.
* **`IconButton`**: Compact accessible icon control with minimum 44px touch targets.

### 3.3 Navigation Primitives (`/src/shared/components/ui/Navigation.tsx`)
* **`NavigationItem`**: Active/inactive route item with numeric badge support.
* **`SidebarItem`**: Expanded navigation item with descriptive subtitle.
* **`HeaderAction`**: System header icon action with pulse notification indicator.
* **`Breadcrumb`**: Hierarchical path indicator supporting truncation and click handlers.
* **`Tabs`**: Segmented tab control supporting `underline` and `pills` styling.
* **`CommandPaletteTrigger`**: Global trigger button displaying system keyboard shortcut (`⌘K`).

### 3.4 Container Primitives (`/src/shared/components/ui/Containers.tsx`)
* **`Card`**: Surface container supporting `default`, `elevated`, `outline`, and `paper` (texture) variants.
* **`Panel`**: Structured card with header bar, title, subtitle, and action slot.
* **`Sheet`**: Slide-over panel supporting left/right drawer transitions.
* **`Section`**: Structural section wrapper with heading and action slot.
* **`WorkspaceSurface`**: Root layout wrapper automatically applying mode styles (`mode-operator`, `mode-scholar`, `mode-architect`).

### 3.5 Feedback Primitives (`/src/shared/components/ui/Feedback.tsx`)
* **`Alert`**: Categorized message box (`info`, `success`, `warning`, `error`).
* **`Banner`**: Top-level system banner with action trigger.
* **`Toast`**: Non-blocking floating notification message.
* **`Tooltip`**: Hover/focus popover displaying contextual micro-copy.
* **`EmptyState`**: Empty collection placeholder with icon, title, description, and primary CTA.
* **`ErrorState`**: Error boundary placeholder with exception message and retry trigger.

### 3.6 Selection Primitives (`/src/shared/components/ui/Selection.tsx`)
* **`Checkbox`**: Standard checkbox with custom SVG check indicator.
* **`Radio`**: Single-choice radio button with animated indicator.
* **`Toggle`**: Accessible toggle switch supporting `sm` and `md` sizes.
* **`SelectMenu`**: Dropdown select menu with standard option rendering.

### 3.7 Progress Primitives (`/src/shared/components/ui/Progress.tsx`)
* **`ProgressBar`**: Determinate linear progress bar displaying percentage.
* **`LinearProgress`**: Indeterminate continuous animation progress bar.
* **`StepIndicator`**: Multi-step wizard indicator showing completed and active steps.
* **`LoadingSkeleton`**: Animated skeleton box for content placeholder loading.

### 3.8 Dialog & Overlay Primitives (`/src/shared/components/ui/Dialogs.tsx`)
* **`Modal`**: Centered modal overlay with backdrop blur, focus trapping, and Esc key dismissal.
* **`ConfirmationDialog`**: Pre-configured confirmation modal with destructive variant support.
* **`CommandPalette`**: Searchable command deck supporting keyboard shortcuts.
* **`ContextMenu`**: Floating right-click context menu.

### 3.9 Eliot Domain Primitives (`/src/shared/components/ui/KnowledgePrimitives.tsx`)
* **`KnowledgeNode`**: Graph node representation displaying domain, mastery percentage, and state (`active`, `decaying`, `mastered`, `unexplored`).
* **`MemoryCard`**: Spaced repetition memory item displaying Ebbinghaus review intervals.
* **`EvidenceBadge`**: Scientific source evidence confidence indicator (`0.0 - 1.0`).
* **`ConceptTag`**: Hashtag concept pill supporting selection and deletion.
* **`StageIndicator`**: 4-stage learning pipeline progress (`INTAKE → ABSORPTION → SYNTHESIS → RETENTION`).
* **`SessionTimer`**: Monospaced session timer with play/pause controls.
* **`FocusMeter`**: Cognitive focus level gauge.
* **`MissionStatus`**: Active learning mission card with progress bar.

---

## 4. Visual Identity Tokens

As of ADR-007, Eliot has a single visual identity ("Root") rather than switchable themes. All FCS-1 components consume these tokens — never a hardcoded value — so this table has one column, not several:

| Visual Token | Root Identity |
| :--- | :--- |
| **Accent Signal** | Muted Red (`#B5453D`) |
| **Surface Background** | Near-Black (`#0B0C0C`) |
| **Border Radius** | 2px default (near-zero, technical) |
| **Typography Pair** | Inter (UI/body) + JetBrains Mono / IBM Plex Mono (technical/data) |
| **Status Colors** | Success `#5C8A73` / Warning `#B8823D` / Error `#9C4A7A` — deliberately distinct from the Accent Signal so brand color and error state are never confused |

---

## 5. Accessibility & Technical Compliance

* **Focus Indicators**: 2px solid ring with 2px offset (`var(--focus-ring-color)`).
* **Touch Target**: Minimum 44px x 44px on mobile viewports.
* **Keyboard Navigation**: Full support for `Tab`, `Shift+Tab`, `Escape`, `Enter`, and `Space`.
* **RTL Mirroring**: Full support for LTR/RTL text directions using logical properties.
