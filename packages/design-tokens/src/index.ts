/** Platform-neutral source values for web and a future native client. */
export const colors = {
  background: "#0B0B10",
  surface: "#15151D",
  surfaceElevated: "#22222B",
  primary: "#7C3AED",
  primaryDeep: "#6D28D9",
  primaryGlow: "#A78BFA",
  signature: "#D9363E",
  textPrimary: "#F5F5F7",
  textSecondary: "#A7A7B3",
  border: "#2E2E38",
  accentCyan: "#22D3EE",
} as const;

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
} as const;

export const radius = {
  small: 8,
  medium: 14,
  large: 22,
  pill: 999,
} as const;

export const fontFamilies = {
  sans: "Vazirmatn Variable, Vazirmatn, Tahoma, Arial, sans-serif",
  mono: "ui-monospace, SFMono-Regular, Consolas, monospace",
} as const;

export const fontSizes = {
  caption: 12,
  small: 14,
  body: 16,
  h3: 20,
  h2: 28,
  h1: 40,
  display: 56,
} as const;

export const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  black: 800,
} as const;

export const shadows = {
  raised: "0 16px 48px rgba(0, 0, 0, 0.32)",
  focus: "0 0 0 3px rgba(167, 139, 250, 0.42)",
  violetGlow: "0 0 32px rgba(124, 58, 237, 0.28)",
} as const;

export const borders = {
  subtle: `1px solid ${colors.border}`,
  focus: `2px solid ${colors.primaryGlow}`,
} as const;

export const motion = {
  duration: { fast: 120, normal: 200, slow: 320 },
  easing: {
    standard: "cubic-bezier(0.2, 0, 0, 1)",
    enter: "cubic-bezier(0, 0, 0.2, 1)",
    exit: "cubic-bezier(0.4, 0, 1, 1)",
  },
} as const;

export const zIndex = {
  base: 0,
  sticky: 20,
  overlay: 40,
  modal: 60,
  toast: 80,
} as const;

export const breakpoints = {
  small: 480,
  medium: 768,
  large: 1024,
  wide: 1280,
} as const;

export const tokens = {
  borders,
  breakpoints,
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  motion,
  radius,
  shadows,
  spacing,
  zIndex,
} as const;

export type DesignTokens = typeof tokens;
