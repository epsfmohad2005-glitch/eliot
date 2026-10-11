# ELIOT FOUNDATION COMPONENT SYSTEM — DEVELOPER GUIDELINES

**Version:** 1.0.0  
**Scope:** Developer Usage Rules, Patterns, & Strict Anti-Patterns  

---

## 1. General Rules

1. **Zero Hardcoded Values**: Never write raw hex colors (e.g. `#00FFC2`), explicit pixel radii (e.g. `border-radius: 8px`), or raw font families in inline styles or component files. Use semantic CSS variables (`var(--accent-signal)`, `var(--mode-radius)`) or Tailwind theme classes (`font-ui-body`, `font-mono-ui`).
2. **Single Component Rule**: Do not create theme-specific duplicate components. A single `<Button>` or `<Card>` component must serve Eliot's single Root identity (see ADR-007) — this rule predates Root and remains the principle even with one identity: components consume design tokens, never hardcode a look.
3. **Accessibility First**: Every interactive control must provide an explicit `aria-label`, visible focus ring, and keyboard event handlers.
4. **Logical Layout Properties**: Use `text-start`, `text-end`, `ps-4`, `pe-4`, `ms-2`, `me-2` instead of directional `pl-4` or `mr-2` to guarantee clean Arabic (RTL) localization.

---

## 2. Usage Examples

### 2.1 Buttons & Actions
```tsx
import { Button, IconButton } from '@/shared/components/ui';

// Primary Action
<Button variant="primary" size="md" onClick={handleSave}>
  Save Changes
</Button>

// Destructive Action with Loading State
<Button variant="destructive" isLoading={isDeleting} onClick={handleDelete}>
  Delete Concept
</Button>

// Icon Button with Screen Reader Label
<IconButton icon={<GearIcon />} ariaLabel="Open Settings" variant="ghost" />
```

### 2.2 Form Controls & Selection
```tsx
import { TextInput, Checkbox, SelectMenu } from '@/shared/components/ui';

<TextInput
  label="Concept Title"
  placeholder="e.g. Quantum Entanglement"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  error={errors.title}
/>

<Checkbox
  label="Lock Cognitive Session"
  description="Prevents notifications during learning sprint."
  checked={isLocked}
  onChange={(e) => setIsLocked(e.target.checked)}
/>
```

### 2.3 Knowledge Primitives
```tsx
import { KnowledgeNode, MemoryCard, FocusMeter } from '@/shared/components/ui';

<KnowledgeNode
  title="General Relativity"
  domain="Physics"
  masteryScore={88}
  status="active"
  onClick={() => openNodeDetails('gr-101')}
/>

<MemoryCard
  concept="Ebbinghaus Curve"
  definition="Memory retention declines exponentially over time when no attempt is made to retain it."
  retentionIntervalDays={5}
  onReview={triggerReview}
/>

<FocusMeter score={94} label="Real-time Cognitive Load" />
```

---

## 3. Strict Anti-Patterns

❌ **NEVER DO THIS**:
```tsx
// ❌ WRONG: Hardcoded color, raw pixel radius, missing focus states
<button style={{ backgroundColor: '#00FFC2', borderRadius: '8px', color: '#000' }}>
  Click Me
</button>
```

✅ **ALWAYS DO THIS**:
```tsx
// ✅ CORRECT: Tokenized primitive automatically adapting across themes & RTL
<Button variant="primary" size="md">
  Click Me
</Button>
```
