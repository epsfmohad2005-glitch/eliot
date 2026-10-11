# Theme System Architecture (TSA-1)

## Overview
The Eliot Theme System Architecture provides a runtime-decoupled, contract-driven styling engine powered by CSS Custom Properties and Semantic Token Contracts.

---

## Architecture Layers

```
+-------------------------------------------------------+
| Core Primitive Tokens (Colors, Radii, Font Sizes)    |
+-------------------------------------------------------+
                           |
                           v
+-------------------------------------------------------+
| Semantic Tokens (--surface-card, --text-primary)      |
+-------------------------------------------------------+
                           |
                           v
+-------------------------------------------------------+
| Component CSS Contracts (.fcs-button, .fcs-card)     |
+-------------------------------------------------------+
```

---

## Token Separation Standards

1. **Primitive Layer**: Hex values, absolute pixel dimensions, raw bezier curves.
2. **Semantic Layer**: Conceptual tokens bound to functional roles (`--bg-canvas`, `--surface-card`, `--border-subtle`, `--accent-primary`).
3. **Component Layer**: Styled using semantic variables only, ensuring full dynamic theme switching without re-rendering component trees.

---

## Theme Contract Specification
* Theme attributes are injected at the root `<html>` node (`data-theme="dark" | "light"`).
* CSS variable changes apply instantly across CSSOM without triggering layout recalculations in JS.
