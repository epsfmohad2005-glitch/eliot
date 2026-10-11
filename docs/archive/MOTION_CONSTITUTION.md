# Motion Constitution (TSA-1)

## Motion Design Governance

### 1. Timing Standards
* **Micro-interactions (Hover, Click, Toggle)**: `100ms` - `150ms`.
* **Structural Transitions (Modal open, View switch)**: `200ms` - `250ms`.
* **Complex Choreography (Graph layout collapse)**: Max `300ms`.

### 2. Easing Curves
* **Standard Ease-Out**: `cubic-bezier(0.16, 1, 0.3, 1)` (snappy, responsive entrance).
* **Smooth Exit**: `cubic-bezier(0.7, 0, 0.84, 0)` (quick dismissal).

### 3. Accessibility Constraints
* Strictly honor `prefers-reduced-motion: reduce`.
* When reduced motion is active, convert motion transforms into instantaneous opacity cross-fades ($<50\text{ms}$).
