/**
 * Spacing, corner rounding and layout limits.
 * Using one scale keeps gaps between elements consistent everywhere.
 */

// gaps and padding, from smallest to largest
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  huge: 48,
} as const;

// how round a corner is: small chips, cards, sheets
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

// rules that apply to the whole layout
export const layout = {
  // anything you can tap must be at least this tall
  minTouchTarget: 48,
  // the phone frame never grows wider than this, even on a desktop screen
  maxContentWidth: 480,
} as const;
