# Eliot PLOS — Theme Migration Report

## Migration Overview

This report documents the migration of Eliot PLOS from legacy static styling to Theme System 2.0 (TS-2). The migration replaced hardcoded color classes with dynamic CSS design tokens without breaking any component APIs or domain contracts.

---

## Token Mapping Table

| Legacy Property | TS-2 Design Token | CSS Variable | Operator Default | Scholar Default | Architect Default |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `bg-slate-950` | Surface Background | `--surface-bg` | `#0A0A0A` | `#F5F2ED` | `#101827` |
| `bg-slate-900` | Surface Card | `--surface-card` | `#141313` | `#FAF8F5` | `#0F172A` |
| `bg-slate-800` | Surface Low Container | `--surface-low` | `#1C1B1B` | `#EBE7E1` | `#131C2E` |
| `text-slate-100` | Primary Text | `--text-primary` | `#E5E2E1` | `#1A1A1A` | `#F8FAFC` |
| `text-slate-400` | Secondary Text | `--text-secondary` | `#9CA3AF` | `#4A4A4A` | `#94A3B8` |
| `text-indigo-400`| Accent Signal | `--accent-signal` | `#00FFC2` | `#800020` | `#38BDF8` |
| `border-slate-800`| Border Color | `--border-color` | `#374151` | `#D4D0C8` | `rgba(255,255,255,0.15)` |
| `rounded-lg` | Mode Border Radius | `--mode-radius` | `0.5rem` | `0px` | `0.25rem` |

---

## Migrated FCS-1 Primitives

1. **`Button` & `IconButton`**: Updated to consume `--accent-signal`, `--accent-on-signal`, and `--mode-radius`.
2. **`TextInput`, `SearchInput`, `TextArea`, `NumberInput`**: Tokenized background, focus ring color, and border.
3. **`Card`, `Panel`, `Sheet`, `Section`**: Migrated to tokenized card surface and paper/blueprint textures.
4. **`Modal`, `ConfirmationDialog`, `CommandPalette`, `ContextMenu`**: Backdrop blur and mode-adaptive overlay containers.
5. **`KnowledgeNode`, `MemoryCard`, `EvidenceBadge`, `ConceptTag`**: Domain knowledge primitives fully styled via active theme tokens.

---

## Verification & Compatibility
- **API Stability**: Zero changes to component props, signatures, or exported contracts.
- **State Persistence**: Theme preference saved in `localStorage.getItem('eliot_theme_preference')`.
- **Zero FOUC**: Synchronous script initialization during initial render prevents theme flash.
