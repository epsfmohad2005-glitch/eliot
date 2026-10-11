# AE-1A.1 — Motion Audit Report

## Motion Constitution Compliance

All animations across Eliot PLOS Focus Mode have been audited against strict motion principles.

---

## Animation Classification & Durations

| Motion Category | Allowed Motion Vectors | Duration | Easing Curve |
| :--- | :--- | :--- | :--- |
| **Focus Warm-up / Cool-down** | Opacity, `translateY(-4px)` to `translateY(0)`, `max-width` | 600 ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| **Micro Interactions (Hover/Pills)** | Opacity, background color | 100–200 ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| **Modal Overlays (Pause / Exit)** | Opacity, subtle scale | 200 ms | `cubic-bezier(0.16, 1, 0.3, 1)` |

---

## Prohibited Motion Verification

- **Elastic / Bounce Effects**: **REJECTED** (0 instances)
- **Spring Exaggeration**: **REJECTED** (0 instances)
- **Full Application Blur**: **REJECTED** (0 instances)
- **Page-level Zooming**: **REJECTED** (0 instances)

---

## Accessibility Motion Override

In accordance with WCAG 2.1 Success Criterion 2.3.3:
```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
When reduced motion is requested by the user's OS, all transitions complete in 0.01 ms instantly.
