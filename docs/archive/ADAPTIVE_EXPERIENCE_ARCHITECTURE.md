# Adaptive Experience Engine (AE-1) — Architecture Specification

## Architecture Overview

The AE-1 Adaptive Experience Engine manages visual environment adaptation, cognitive density tuning, context presets, and focus automation without sacrificing user agency.

---

## 1. Core Principles of Adaptive Control

1. **User Authority Priority**: Automated adjustments must NEVER override active user focus or trigger abrupt global shifts during active typing or problem-solving.
2. **Context-Sensitive Presets**: Specific learning tasks benefit from specialized visual environments (e.g., long-form paper reading is best served by *Scholar*, whereas knowledge graph topology exploration is best served by *Architect*).
3. **Smooth Ambient Transitions**: Any adaptive theme transition must be executed via smooth CSS variable Interpolation ($200\text{ms} - 300\text{ms}$) with zero visual flash.

---

## 2. Adaptive Modes Engine Architecture

```
                       +-----------------------------------+
                       |    AE-1 Adaptive Engine Core      |
                       +-----------------------------------+
                                         |
         +-------------------------------+-------------------------------+
         |                               |                               |
  [Tier 1: Manual]               [Tier 2: Suggested]             [Tier 3: Profile Lock]
  Explicit Shortcuts             Context Ambient Banner          Route-Level Auto-Preset
  (⌘1..⌘6 / Header)              ("Switch to Scholar?")          (Workspace Specific)
```

### 2.1 Mode Definitions

1. **Manual Mode**: User maintains total manual control over theme and layout density. No automatic suggestions or profile locks occur.
2. **Suggested Mode (Recommended Default)**: When a user transitions to a route associated with a specific cognitive task (e.g., PDF Import or Reflection), AE-1 displays a subtle, non-intrusive ambient toast suggesting an optimized preset (e.g., *"Activate Scholar Reading Mode?"*).
3. **Workspace Profile Lock**: Routes are bound to user-configured default profiles:
   - `Route: /curriculum` (Learning Session) -> **Focus Mode + Operator / Scholar**
   - `Route: /knowledge_map` (Knowledge Graph) -> **Architect Grid**
   - `Route: /import` (Document Intake) -> **Scholar Paper**
   - `Route: /diagnostics` -> **Operator Command**

---

## 3. Context Presets & Behavior Profiles

AE-1 defines 4 cognitive behavior profiles:

| Behavior Profile | Cognitive Objective | Target Theme | Sidebar State | Density | Noise Filter |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Deep Absorption** | Reading & Synthesis | Scholar / Nocturne | Collapsed | Spacious (28px line) | Max (Hide status bar) |
| **Structural Modeling** | Mapping Concepts | Architect | Expanded | Compact (Mono grid) | Low |
| **Tactical Practice** | Flashcards / Quiz | Operator | Collapsed | High contrast | Medium |
| **Quiet Reflection** | Synthesis & Notes | Nocturne 2.0 | Hidden | Balanced | Max |

---

## 4. State Machine & Event Bus Integration

AE-1 subscribes to PLOS Event Bus canonical events:
- `SYSTEM_ROUTE_CHANGED`: Evaluates route-bound profile lock or triggers suggestion toast.
- `LEARNING_SESSION_STARTED`: Activates Focus Mode, hides non-essential headers, and locks focus.
- `LEARNING_SESSION_ENDED`: Restores ambient workspace shell state cleanly.
