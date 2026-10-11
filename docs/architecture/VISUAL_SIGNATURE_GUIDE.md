# ELIOT VISUAL SIGNATURE GUIDE

**Version:** 1.0.0  
**Scope:** Logotype, Surface Atmospheres, Component Personality, & Visual Recognition  

---

## 1. Visual Signature Overview

The **Visual Signature** defines the aesthetic hallmark that makes Eliot instantly recognizable across any device or theme. Eliot is anchored by **Cognitive Silence**: wide negative space, mathematically defined typography, strict mode-adaptive surfaces, and zero artificial ornamentation.

---

## 2. Eliot Typographic Logotype

Eliot does **not** use a graphical icon logo (such as a mascot or stylized abstract shape) as its primary mark. Instead, Eliot uses a **Typographic Wordmark** system.

### Wordmark Rules:
1. **Lettering**: `ELIOT` rendered in uppercase display typography with wide tracking (`tracking-widest` / `letter-spacing: 0.15em`).
2. **Sub-Brand Descriptor**: `PERSONAL LEARNING OS` or `PLOS KERNEL` in monospaced secondary text (`font-mono-ui text-[10px] tracking-wider text-[var(--text-secondary)]`).
3. **Theme Adaptability**:
   - **Operator Mode**: Plus Jakarta Sans / Inter Bold in high-contrast white with Focus Mint pulse dot.
   - **Scholar Mode**: Newsreader Serif Bold in Ink Black (`#1A1A1A`) with Scholarly Oxblood accent.
   - **Architect Mode**: IBM Plex Mono Bold in Blueprint Sky text with subtle grid alignment.

---

## 3. Surface Atmospheres & Physics

Eliot establishes visual signature through three distinct, tokenized surface atmospheres:

| Atmosphere | Mode Name | Surface Color | Border Style | Typographic Pairing |
| :--- | :--- | :--- | :--- | :--- |
| **Obsidian Technical** | Operator | `#0A0A0A` (Dark) | Subtle Slate Stroke (`#1E293B`) | Plus Jakarta Sans + IBM Plex Mono |
| **Paper Scholar** | Scholar | `#F5F2ED` (Light) | Warm Ink Stroke (`#E5DFD5`) | Newsreader + Ink Sans |
| **Blueprint Grid** | Architect | `#101827` (Blueprint) | Grid Lines (`rgba(56, 189, 248, 0.15)`) | IBM Plex Mono + Inter |

---

## 4. Component Personality Rules

### 4.1 Surface Cards (`Card`, `Panel`)
- **Zero Nested Cards**: Cards inside cards are strictly prohibited. Hierarchy is established through whitespace, typography, and subtle background tone shifts (`--surface-low` vs `--surface-card`).
- **Mathematical Radius Rule**: Outer corner radius equals inner padding plus inner radius (`Outer Radius = Inner Radius + Padding`).

### 4.2 Buttons & Controls (`Button`, `IconButton`)
- **Horizontal Padding**: Button horizontal padding must equal exactly **2x** vertical padding (`px-4 py-2`).
- **Single-Line Label Guarantee**: Button, tab, and pill labels sit strictly on one line (`white-space: nowrap`).

### 4.3 Progress & Stage Philosophy
- **4-Stage Learning Pipeline**: Progress is always mapped to Eliot's epistemic stages (`INTAKE → ABSORPTION → SYNTHESIS → RETENTION`).
- **No Gamified XP**: Progress is displayed as mathematical confidence percentages or Ebbinghaus decay intervals.

---

## 5. Audio Philosophy (Conceptual Framework)

Eliot does **not** currently implement audio feedback to maintain absolute cognitive silence by default.

### Conceptual Future Guidelines:
- **Subaudible Tactile Feedback**: If audio is ever requested, sounds must be subaudible, low-frequency haptic tones (e.g. 120Hz sine pulse for focus sprint completion).
- **Default Silence**: Audio feedback must remain disabled by default to honor the principle of Cognitive Silence.
