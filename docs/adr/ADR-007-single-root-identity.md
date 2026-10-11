# ADR-007: Single "Root" Visual Identity (Retiring Theme System 2.0)

* **Status**: Accepted (retroactively documented — the code change shipped first, this ADR closes the documentation gap per Project Bible §10)
* **Date**: 2026-08-16
* **Deciders**: Product Owner, with Claude acting as architecture supervisor
* **Technical Area**: Design Tokens, Theme Engine, Visual Identity

---

## Context and Problem Statement

Eliot originally shipped with Theme System 2.0: six selectable themes (Operator, Scholar, Architect, Nocturne, Aurora, Minimal), each with its own full color palette, implemented via `src/config/design-tokens.ts`, a `ThemeContext` provider with runtime switching, and a per-theme CSS variable block in `src/index.css`.

The product owner judged the resulting visual identity generic — closer to a developer-tool dark mode than a distinct product identity — and wanted something closer to the atmosphere of the show *Mr. Robot*: dark, technical, restrained, quietly intense. Internal self-critique already on file (`THEME_CRITIQUE.md`) independently reached a similar conclusion: Operator, the closest existing theme to this mood, scored only 7/10 on distinctiveness and was noted as "close to standard IDE dark themes."

A six-theme system also worked against Eliot's own stated visual philosophy (§16 of the Project Bible): more themes means more surface area for inconsistency, and a switchable theme undercuts the idea of Eliot having *an* identity rather than a wardrobe of them.

## Decision Drivers

1. **Product identity over configurability.** Eliot is built for one primary user (§1 of the Bible); a personal system benefits more from one considered identity than from six divided ones.
2. **Explicit non-negotiable constraint**: no literal reproduction of *Mr. Robot*'s show-specific visual assets (masks, logos, exact color grading) — only the general mood (dark, restrained, technical, high-contrast, not cyberpunk).
3. **Consistency with existing anti-pattern rules** (§16): no gradients, no glow except sparing, purposeful exceptions; near-zero border radius; monospace for technical/data text.
4. **Avoid accidental collision between semantic and brand color.** Once red became the single accent, "error" could no longer also be red — this ADR's implementation introduced dedicated, distinct `--status-success` / `--status-warning` / `--status-error` tokens for that reason.

## Decision Outcome

**Chosen option: retire Theme System 2.0 entirely and replace it with one identity, "Root."**

* Palette: near-black background (`#0B0C0C`), one muted accent — desaturated red (`#B5453D`) — used for the primary/brand signal only. Status colors are intentionally a different hue family (muted green/amber/plum) so they never read as "the accent" by accident.
* Typography: `JetBrains Mono` / `IBM Plex Mono` for technical and data text, `Inter` for body/UI text.
* Border radius near zero (2px default) — sharper, more technical than the prior themes' softer rounding.
* A small set of **opt-in, sparingly-applied** terminal-inspired utilities were added (`.scanlines`, `.terminal-cursor`, `.type-in`, `.glow-signal`, `.scan-sweep`, `.bracket-label`) — used only where they earn their place (currently: the boot sequence, and the primary hint-request action in the practice workspace), not applied globally, to avoid the "cyberpunk clutter" anti-pattern explicitly rejected in §16.
* `ThemeContext` no longer switches between themes; `useTheme()` now only exposes the (always-`'root'`) `currentTheme` and independent RTL toggling — reading direction is a real, orthogonal user preference and was kept, theme switching was not.

**Rejected alternative**: evolving the existing Operator theme into the sole identity, rather than designing a new one. Considered and explicitly declined by the product owner in favor of a fresh palette — Operator's own self-critique score (7/10 distinctiveness) was part of the reasoning.

### Positive Consequences
* One identity to maintain, test, and keep visually consistent — no per-theme regression surface.
* Distinct, collision-free semantic status colors as a direct side effect of no longer being able to reuse "red = error."
* Closer alignment with the product's own stated anti-genericism principle.

### Negative Consequences
* Loses the light-mode option Scholar previously provided; Eliot is now dark-only. Not currently viewed as a problem (no light-mode requirement was ever stated), but is a real capability removed, not just a repaint.
* Any documentation or onboarding material describing "6 themes" is now stale and needs updating wherever it's found (see Project Bible directory-tree references, `THEME_ENGINE_SPECIFICATION.md`, `THEME_MIGRATION_*` docs if still present under `docs/`).

## Compliance & Enforcement

No new theme, palette, or `ThemeId`-style switcher should be reintroduced without a superseding ADR. Any new UI work should consume the existing Root tokens (`ROOT_PALETTE` in `design-tokens.ts`, the CSS variables in `index.css`) rather than hardcoding colors, and must not reuse the brand accent color for error/warning/success states — those have their own dedicated tokens specifically to prevent the collision this ADR's implementation had to fix.
