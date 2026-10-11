# ELIOT DESIGN SYSTEM CHANGELOG

All notable changes to the Eliot Personal Learning Operating System (PLOS) Design System will be documented in this file.

---

## [2.0.0] - 2026-08-16 (Root Identity Migration)

### Changed
- **BREAKING**: Replaced the six-theme Theme System 2.0 (Operator, Scholar, Architect, Nocturne, Aurora, Minimal) with a single visual identity, "Root." See `docs/adr/ADR-007-single-root-identity.md` for full rationale.
- `ThemeContext` no longer switches themes; `useTheme()` now only exposes the fixed `currentTheme` (`'root'`) and independent RTL toggling.
- Accent signal color changed from theme-dependent to one fixed muted red (`#B5453D`).
- Added dedicated `--status-success` / `--status-warning` / `--status-error` tokens, distinct from the accent signal, to prevent brand-color/error-state collisions.
- Border radius tightened to a near-zero default (2px), replacing the softer per-theme radii.

### Removed
- Theme-switcher UI (dropdown in `HeaderBar`, theme strip in `ComponentShowcaseView`).
- `Newsreader` serif typeface (was Scholar-mode only).
- Scholar mode's light/paper surface — Eliot is dark-only as of this release.

---

## [1.0.0] - 2026-08-05 (FCS-1 Release)

### Added
- **Foundation Component System (FCS-1)** under `/src/shared/components/ui/`:
  - `Inputs.tsx`: `TextInput`, `SearchInput`, `PasswordInput`, `TextArea`, `NumberInput`.
  - `Buttons.tsx`: `Button`, `IconButton` supporting primary, secondary, ghost, destructive, loading, and disabled states.
  - `Navigation.tsx`: `NavigationItem`, `SidebarItem`, `HeaderAction`, `Breadcrumb`, `Tabs`, `CommandPaletteTrigger`.
  - `Containers.tsx`: `Card`, `Panel`, `Sheet`, `Section`, `WorkspaceSurface`.
  - `Feedback.tsx`: `Alert`, `Banner`, `Toast`, `Tooltip`, `EmptyState`, `ErrorState`.
  - `Selection.tsx`: `Checkbox`, `Radio`, `Toggle`, `SelectMenu`.
  - `Progress.tsx`: `ProgressBar`, `LinearProgress`, `StepIndicator`, `LoadingSkeleton`.
  - `Dialogs.tsx`: `Modal`, `ConfirmationDialog`, `CommandPalette`, `ContextMenu`.
  - `KnowledgePrimitives.tsx`: `KnowledgeNode`, `MemoryCard`, `EvidenceBadge`, `ConceptTag`, `StageIndicator`, `SessionTimer`, `FocusMeter`, `MissionStatus`.
- **Component Showcase Environment**:
  - `ComponentShowcaseView.tsx` under `/src/shared/components/showcase/`.
  - Dynamic theme switching (Operator, Scholar, Architect).
  - LTR / RTL localization preview toggle.
- **Documentation**:
  - `FOUNDATION_COMPONENT_SYSTEM.md`
  - `COMPONENT_GUIDELINES.md`
  - `COMPONENT_SHOWCASE_GUIDE.md`
  - `FCS_1_IMPLEMENTATION_REPORT.md`

---

## [0.9.0] - 2026-08-05 (DM-1 Design Migration Phase 1)

### Added
- Centralized Design Token System in `/src/config/design-tokens.ts`.
- Comprehensive CSS variable architecture in `/src/index.css`.
- Google Stitch font pairings preloaded in `/index.html`.
