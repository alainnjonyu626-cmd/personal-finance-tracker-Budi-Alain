/**
 * A small message box used for answers from the app:
 * red with "⚠" for a problem, green with "✓" for a success.
 * Nothing is drawn when there is no message.
 */

import { StyleSheet, Text, View } from "react-native";

import { colors, fonts, radius, spacing, typography } from "@/theme";

export interface BannerProps {
  // the words to show; empty, null or undefined draws nothing
  message?: string | null;
  // error (default) or success
  tone?: "error" | "success";
}

export function Banner({ message, tone = "error" }: BannerProps) {
  // Nothing to say, so draw nothing.
  if (!message) {
    return null;
  }

  const isError = tone === "error";

  return (
    <View
      // read out straight away, because it is news about what just happened
      accessibilityRole="alert"
      style={[styles.banner, isError ? styles.errorBanner : styles.successBanner]}
    >
      <Text style={isError ? styles.errorText : styles.successText}>
        {/* a symbol, so the meaning never relies on colour alone */}
        <Text style={styles.icon}>{isError ? "⚠" : "✓"}</Text>
        {` ${message}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // the box around the message
  banner: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
  },
  // problem: soft red fill, red edge
  errorBanner: {
    backgroundColor: colors.expenseTint,
    borderColor: colors.expense,
  },
  // success: soft green fill, green edge
  successBanner: {
    backgroundColor: colors.incomeTint,
    borderColor: colors.income,
  },

  // the symbol in front of the message, in a font that has both of them
  icon: {
    fontFamily: fonts.bodyStrong,
  },

  // the words inside
  errorText: {
    ...typography.body,
    color: colors.expense,
  },
  successText: {
    ...typography.body,
    color: colors.income,
  },
});
