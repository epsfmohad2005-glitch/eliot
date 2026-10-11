# Visual Language (TSA-1)

## Spatial System & Rhythmic Rules

### 1. Mathematical Corner Radius Rule
* When a rounded element sits inside another rounded element:
  $$\text{Radius}_{\text{inner}} = \text{Radius}_{\text{outer}} - \text{Padding}_{\text{container}}$$
* Cap max corner radius at `12px` - `16px` for cards; reserve `24px` pills strictly for tags/badges.

### 2. Depth & Flattening Philosophy
* Reject nested cards inside cards.
* Enforce depth using clear structural whitespace, high-contrast structural borders (`1px`), and subtle background luminance steps rather than heavy drop shadows.

### 3. Container Padding Rules
* Minimum container outer padding: `16px`.
* Outer padding must always meet or exceed inner child gap spacing.
* Button horizontal padding: exactly $2\times$ vertical padding.
