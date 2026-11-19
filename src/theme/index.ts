/**
 * One single entry point for the design system.
 * Screens import from here instead of reaching into each file.
 */

export { colors, type Colors } from "./colors";
export {
  fonts,
  typography,
  type Typography,
  type TextPresetName,
} from "./typography";
export { spacing, radius, layout } from "./spacing";

import { colors } from "./colors";
import { fonts, typography } from "./typography";
import { spacing, radius, layout } from "./spacing";

// The whole design system bundled into one object.
export const theme = {
  colors,
  fonts,
  typography,
  spacing,
  radius,
  layout,
} as const;

export type Theme = typeof theme;
