# ELIOT MOTION IDENTITY GUIDE

**Version:** 1.0.0  
**Scope:** Motion Architecture, Easing Curves, Durations, & Accessibility Compliance  

---

## 1. Motion Philosophy

Motion in Eliot is **instant, calm, and purposeful**. As a private cognitive operating system, Eliot avoids flashy animations, bouncy physics, elastic transforms, or celebratory confetti effects. Motion exists exclusively to communicate state transitions and preserve spatial continuity.

### Core Motion Principles:
1. **Zero Distraction**: Animations must complete quickly without drawing attention to themselves.
2. **Ease-Out Precision**: All UI transitions enter using smooth `ease-out-quad` curves.
3. **Spatial Continuity**: Modals, sheets, and views fade smoothly into view rather than springing across the canvas.

---

## 2. Easing & Duration Specifications

| Transition Type | Standard Duration | Approved Easing Curve | Tailwind / CSS Class |
| :--- | :--- | :--- | :--- |
| **Micro Interactions** (Hover, Focus, Buttons) | `150ms` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | `transition-all duration-150 ease-out-quad` |
| **Standard UI Transitions** (Tabs, Cards, Collapsibles) | `200ms` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | `transition-all duration-200 ease-out-quad` |
| **Overlay / Modal Motion** (Dialogs, Sheets, Command Palette) | `250ms` | `cubic-bezier(0.16, 1, 0.3, 1)` | `transition-all duration-250 ease-out` |
| **Progress & Timers** (Progress bars, Focus meters) | `300ms` | `linear` / `ease-out` | `transition-all duration-300 ease-out` |

---

## 3. Specific Component Motion Rules

### 3.1 Boot Sequence (`BootSequenceView.tsx`)
- Progress bar fills smoothly with `duration-300 ease-out`.
- Completed step items switch status badges with `duration-200 ease-out-quad`.
- Diagnostics drawer expands smoothly without layout jumps.

### 3.2 Command Palette (`CommandPalette.tsx`)
- Backdrop blur fades in over `150ms`.
- Command window scales subtly from `0.98` to `1.0` with `opacity-100`.
- Search filtered item list updates instantly with zero stagger delay.

### 3.3 Dialogs & Side Sheets (`Modal.tsx`, `Sheet.tsx`)
- Backdrop opacity transitions over `200ms`.
- Side sheets slide along the logical inline axis over `250ms`.

---

## 4. Reduced Motion & Accessibility

All FCS-1 components and application screens **MUST** respect the user's operating system preferences for reduced motion:

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

In Tailwind, use `motion-reduce:transition-none` on animated wrappers to ensure instant state changes when reduced motion is requested.
