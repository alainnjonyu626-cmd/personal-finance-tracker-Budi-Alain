/**
 * The three font families and the text styles built from them.
 * The font names below are the exact names exported by the installed
 * @expo-google-fonts packages, so they must not be renamed.
 */

import type { TextStyle } from "react-native";

// Fraunces is used for headings and big numbers of words.
export const fonts = {
  display: "Fraunces_700Bold",
  displaySemi: "Fraunces_600SemiBold",
  // Instrument Sans is used for normal readable text.
  body: "InstrumentSans_400Regular",
  bodyStrong: "InstrumentSans_600SemiBold",
  // IBM Plex Mono is used for money amounts so digits line up.
  mono: "IBMPlexMono_500Medium",
  monoSemi: "IBMPlexMono_600SemiBold",
} as const;

export const typography = {
  // --- headings (Fraunces) ---
  // the biggest heading, for a big balance or a page hero
  displayXL: {
    fontFamily: fonts.display,
    fontSize: 44,
    lineHeight: 48,
  },
  // a section or screen heading
  displayL: {
    fontFamily: fonts.displaySemi,
    fontSize: 32,
    lineHeight: 38,
  },
  // a smaller heading, used for card titles
  title: {
    fontFamily: fonts.displaySemi,
    fontSize: 22,
    lineHeight: 28,
  },

  // --- body text (Instrument Sans) ---
  // normal paragraphs
  body: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
  },
  // text that needs a bit more weight, like a name or a total
  bodyStrong: {
    fontFamily: fonts.bodyStrong,
    fontSize: 16,
    lineHeight: 24,
  },
  // small uppercase label above a field or a group
  label: {
    fontFamily: fonts.bodyStrong,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  // quiet helper text under an input
  caption: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
  },

  // --- numbers (IBM Plex Mono) ---
  // money amounts inside a row or card
  amount: {
    fontFamily: fonts.mono,
    fontSize: 17,
    lineHeight: 24,
  },
  // a large money amount, like a balance
  amountL: {
    fontFamily: fonts.monoSemi,
    fontSize: 28,
    lineHeight: 34,
  },
} as const satisfies Record<string, TextStyle>;

// The type of a single text style, so screens can annotate their styles.
export type Typography = typeof typography;
export type TextPresetName = keyof Typography;
