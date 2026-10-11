# ELIOT ICONOGRAPHY GUIDE

**Version:** 1.0.0  
**Scope:** Icon System Rules, Geometry, Stroke Weights, & Domain Mapping  
**Library Standard:** `lucide-react` (Single Source of Truth)  

---

## 1. Iconography Philosophy

Iconography in Eliot is **functional, geometric, and understated**. Icons exist solely to provide instant spatial orientation and visual anchoring. They are never decorative illustrations, never multi-colored badges, and never animated for aesthetic distraction.

---

## 2. Universal Icon Rules

1. **Single Library Source**: All icons **MUST** be imported from `lucide-react`. Custom SVG icons or secondary icon libraries are strictly prohibited.
2. **Fixed Stroke Weight**: Standard stroke width is **1.5px** (`strokeWidth={1.5}`) for subtle elegance. Small 14px micro-icons may use **1.75px** stroke width for optical legibility.
3. **Monochrome Intent**: Icons inherit text color (`currentColor` / `text-[var(--text-secondary)]`). Icons are colored only when representing critical system states (`var(--accent-signal)`, warning, or error).
4. **Optical Sizing**:
   - Navigation & Headers: `18px` x `18px` (`w-4.5 h-4.5` or `w-4 h-4`).
   - Cards & Hero Badges: `24px` x `24px` (`w-6 h-6`).
   - Micro Indicators & Badges: `14px` x `14px` (`w-3.5 h-3.5`).
5. **No Decorative Background Circles**: Never place an icon inside a bright gradient circle unless it represents a structural functional control.

---

## 3. Standard Domain Icon Mappings

| Domain / Concept | Approved `lucide-react` Icon | Purpose & Usage |
| :--- | :--- | :--- |
| **System Kernel & Boot** | `<Cpu />` | Boot sequence focal point, kernel status. |
| **Mission Control** | `<Compass />` / `<Layers />` | Primary workspace navigation & status. |
| **Curriculum & Missions** | `<BookOpen />` / `<Target />` | Learning goals & mission progress. |
| **Knowledge Graph** | `<Network />` / `<Share2 />` | Concept map visualization. |
| **Memory & Retention** | `<Brain />` / `<History />` | Spaced repetition timeline & Ebbinghaus engine. |
| **Evidence & Sources** | `<ShieldCheck />` / `<FileText />` | Verification confidence & citation references. |
| **Focus & Timers** | `<Zap />` / `<Clock />` | Session timers & focus meter gauge. |
| **System Settings** | `<Sliders />` / `<Settings />` | Token configuration & visual mode switcher. |
| **Command Palette** | `<Terminal />` / `<Command />` | Keyboard command deck trigger (`⌘K`). |
| **Architecture Inspection**| `<Layers />` / `<Activity />` | Domain registry & event bus inspector. |

---

## 4. Theme Adaptation Rules

| Theme Mode | Icon Style | Stroke Color | Accent Override |
| :--- | :--- | :--- | :--- |
| **Operator** | Clean vector, sharp geometry | `text-slate-400` | Focus Mint (`#00FFC2`) |
| **Scholar** | Subtle weight, soft contrast | `text-[#5A524C]` | Scholarly Oxblood (`#800020`) |
| **Architect** | Grid-aligned blueprint vector | `text-slate-400` | Sky Mint (`#00FFC2`) |
