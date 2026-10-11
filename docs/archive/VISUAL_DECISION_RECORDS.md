# Visual Decision Records (TSA-1)

## Architecture Decision Logs (VDRs)

### VDR-001: Adoption of CSS Custom Properties over CSS-in-JS
* **Status**: Approved
* **Context**: Runtime CSS-in-JS libraries introduce JS thread overhead and hydration bottlenecks.
* **Decision**: Use native CSS Custom Properties (`var(--semantic-token)`) toggled on `<html>` root node via `data-theme`.

### VDR-002: Standardization on Lucide Iconography
* **Status**: Approved
* **Context**: Mixed icon sets lead to inconsistent stroke weights and mismatched visual scales.
* **Decision**: Enforce `lucide-react` across all 13 workspace views with strict stroke weight matrices (`1.5px` - `2.0px`).

### VDR-003: Rejection of Dark Mode Glowing Cards
* **Status**: Approved
* **Context**: Radial glow effects reduce contrast legibility and trigger GPU composition strain.
* **Decision**: Replace drop shadows in dark mode with high-contrast `1px` structural borders (`--border-color`).
