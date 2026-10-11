# ADR-005: Foundation Component System (FCS) & Design Tokens

* **Status**: Accepted
* **Date**: 2026-08-06
* **Deciders**: Eliot UX Core & Frontend Engineering Team
* **Technical Area**: Design System, UI Components, Styling Standards

---

## Context and Problem Statement
Inconsistent styling, ad-hoc inline classes, arbitrary color palettes, and random border radii create visual fatigue, degrade user focus, and introduce code duplication. For a Personal Learning Operating System, the visual interface must feel unified, calm, disciplined, and engineering-grade across every screen frame.

---

## Decision Drivers
1. **Visual Consistency**: Unified design tokens governing colors, typography, spacing, and borders.
2. **Mathematical Precision**: Explicit layout rules (such as nested corner radius alignment) preventing "AI Slop" artifacts.
3. **Accessibility & Focus**: High-contrast typography with warm, non-distracting background tones designed for prolonged focus.
4. **Maintenance Velocity**: Component reuse through atomic, modular UI primitives.

---

## Decision Outcome
**Chosen Option**: **Foundation Component System (FCS)**.

Eliot implements a standardized component architecture built on Tailwind CSS utility abstractions and design tokens (`src/config/design-tokens.ts`):
* **Palette**: Warm neutral canvas (`#FBFBF9`, `#F3F3EE`), slate typography (`#1A1A18`), amber warning accents (`#D97706`), emerald success indicators (`#059669`).
* **Typography**: Plus Jakarta Sans for UI display headings and technical body copy; monospace font for code blocks and SHA-256 hashes.
* **Spatial Grid**: Strict 8px mathematical grid ($8\text{px}, 16\text{px}, 24\text{px}, 32\text{px}, 48\text{px}$).
* **Nested Radius Formula**: Inner child border radius equals outer container radius minus padding ($R_{\text{inner}} = R_{\text{outer}} - P$).
* **FCS Primitives**: Standardized components (`FcsButton`, `FcsCard`, `FcsBadge`, `FcsInput`, `FcsContainer`, `FcsHeader`).

### Positive Consequences
* **Unified Visual Identity**: Every workspace frame looks cohesive and purposefully designed.
* **Elimination of Visual Noise**: Rejection of dark-mode cyan glows, heavy shadows, or unrequested gradients.
* **Rapid Component Authoring**: Standardized primitives accelerate UI feature development while maintaining standards.

### Negative Consequences
* **Strict Design Boundaries**: Developers cannot introduce custom ad-hoc colors or external UI themes without updating token definitions.
