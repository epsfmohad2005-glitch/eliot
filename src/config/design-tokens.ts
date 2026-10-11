/**
 * ELIOT Personal Learning Operating System (PLOS)
 * Centralized Design Token System — "Root" Identity (TS-3)
 *
 * Single source of truth for Eliot's one visual identity: a restrained,
 * terminal-influenced dark environment. Supersedes the prior six-theme
 * Theme System 2.0 (Operator / Scholar / Architect / Nocturne / Aurora /
 * Minimal) per ADR-007 — see docs/adr/ADR-007-single-root-identity.md.
 *
 * Design intent: dark, technical, restrained, high-contrast, quiet.
 * One muted signal color. No gradients, no glow, no glassmorphism.
 */

export interface ColorPalette {
  readonly background: string;
  readonly surface: string;
  readonly surfaceLow: string;
  readonly surfaceHigh: string;
  readonly surfaceBright: string;
  readonly primary: string;
  readonly onPrimary: string;
  readonly focusAccent: string;
  readonly textPrimary: string;
  readonly textSecondary: string;
  readonly textMuted: string;
  readonly border: string;
  readonly borderSubtle: string;
  readonly success: string;
  readonly warning: string;
  readonly error: string;
  readonly chartPrimary: string;
  readonly chartSecondary: string;
}

export const ROOT_PALETTE: ColorPalette = {
  background: '#0B0C0C',      // Near-black, faint green-grey undertone
  surface: '#131515',         // Panel surface, one step up from background
  surfaceLow: '#0E0F0F',      // Recessed surface (inputs, wells)
  surfaceHigh: '#1A1D1C',     // Elevated surface (hover, active row)
  surfaceBright: '#232726',   // Highest elevation (selected, modal)
  primary: '#D8DAD6',         // Broken white — never pure white
  onPrimary: '#0B0C0C',
  focusAccent: '#B5453D',     // Desaturated alert red — the one signal/brand color
  textPrimary: '#D8DAD6',
  textSecondary: '#8B9490',
  textMuted: '#5A625E',
  border: '#252827',
  borderSubtle: '#181A19',
  // Status colors are deliberately NOT red — the brand accent already owns
  // red, so "error" can't also be red without erasing the distinction
  // between "this is important" and "this is broken".
  success: '#5C8A73',         // Muted phosphor green (the former accent, repurposed)
  warning: '#B8823D',         // Muted amber
  error: '#9C4A7A',           // Muted plum — visually distinct from the red accent
  chartPrimary: '#B5453D',
  chartSecondary: '#8C6A63',
};

export const FONT_FAMILIES = {
  utility: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  absorption: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  mono: '"JetBrains Mono", "IBM Plex Mono", Menlo, Monaco, Consolas, monospace',
} as const;

export const TYPOGRAPHY_TOKENS = {
  displayLg: {
    fontFamily: FONT_FAMILIES.absorption,
    fontSize: '36px',
    lineHeight: '44px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
  },
  headlineMd: {
    fontFamily: FONT_FAMILIES.absorption,
    fontSize: '24px',
    lineHeight: '32px',
    fontWeight: '600',
    letterSpacing: '0em',
  },
  scholarBody: {
    fontFamily: FONT_FAMILIES.absorption,
    fontSize: '18px',
    lineHeight: '28px',
    fontWeight: '400',
    letterSpacing: '0em',
  },
  uiBody: {
    fontFamily: FONT_FAMILIES.utility,
    fontSize: '14px',
    lineHeight: '22px',
    fontWeight: '400',
    letterSpacing: '0em',
  },
  uiBodyBold: {
    fontFamily: FONT_FAMILIES.utility,
    fontSize: '14px',
    lineHeight: '22px',
    fontWeight: '600',
    letterSpacing: '0em',
  },
  labelSm: {
    fontFamily: FONT_FAMILIES.utility,
    fontSize: '12px',
    lineHeight: '16px',
    fontWeight: '500',
    letterSpacing: '0.04em',
  },
  monoUi: {
    fontFamily: FONT_FAMILIES.mono,
    fontSize: '13px',
    lineHeight: '20px',
    fontWeight: '400',
    letterSpacing: '0em',
  },
} as const;

export const SPACING_TOKENS = {
  base: '8px',
  stackXs: '4px',
  stackSm: '8px',
  stackMd: '16px',
  stackLg: '32px',
  marginMobile: '24px',
  marginDesktop: '64px',
  gutterScholar: '120px',
} as const;

export const BORDER_RADIUS_TOKENS = {
  sm: '0px',
  DEFAULT: '2px',
  md: '3px',
  lg: '4px',
  xl: '6px',
  full: '9999px', // reserved for avatars/status dots only
} as const;

export const SHADOW_TOKENS = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
} as const;

export const MOTION_TOKENS = {
  durations: {
    fast: '100ms',
    normal: '200ms',
    slow: '300ms',
  },
  curves: {
    snappy: 'cubic-bezier(0.16, 1, 0.3, 1)',
    exit: 'cubic-bezier(0.7, 0, 0.84, 0)',
  },
  transitions: {
    page: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
    modal: 'all 100ms cubic-bezier(0.16, 1, 0.3, 1)',
    focus: 'all 100ms cubic-bezier(0.16, 1, 0.3, 1)',
    hover: 'all 100ms cubic-bezier(0.16, 1, 0.3, 1)',
  },
} as const;

export const DESIGN_TOKENS = {
  palette: ROOT_PALETTE,
  typography: TYPOGRAPHY_TOKENS,
  spacing: SPACING_TOKENS,
  borderRadius: BORDER_RADIUS_TOKENS,
  shadows: SHADOW_TOKENS,
  motion: MOTION_TOKENS,
} as const;

export type DesignTokens = typeof DESIGN_TOKENS;
