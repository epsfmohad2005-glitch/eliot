# Theme Engine Specification (TSA-1)

## System Specification
The Eliot Theme Engine governs mode transitions, theme state persistence, and contrast integrity monitoring at runtime.

---

## Core Engine Requirements

### 1. Persistence & Hydration
* Theme preferences persist across sessions using `localStorage` key `eliot_theme_preference`.
* Zero-FOUC (Flash of Unstyled Content) execution via synchronous inline root initialization.

### 2. High-Contrast Guardrails
* Runtime validation ensures background-to-text contrast ratio $\ge 4.5:1$ for body copy and $\ge 3.0:1$ for heavy interface controls.
* Surface-to-canvas luminance delta bounded to $\le 12\%$ in dark mode and $\le 7\%$ in light mode.

### 3. Theme Engine Interface Contract
* State hooks and dispatchers control mode switching (`light`, `dark`, `system`).
* System preference media query (`prefers-color-scheme`) automatically respected when mode is set to `system`.
