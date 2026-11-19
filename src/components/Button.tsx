/**
 * The app's button, in three looks:
 * - primary: filled forest green (the main action)
 * - secondary: an outlined green button (a quieter action)
 * - danger: red (something that deletes or cancels)
 */

import { useState } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text } from "react-native";

import { colors, layout, radius, spacing, typography } from "@/theme";

export interface ButtonProps {
  // the words shown on the button
  title: string;
  // what happens when it is pressed
  onPress: () => void;
  // which of the three looks to use (primary by default)
  variant?: "primary" | "secondary" | "danger";
  // true makes it greyed out and impossible to press
  disabled?: boolean;
  // true shows a spinner instead of the title and ignores presses
  loading?: boolean;
  // optional words for a screen reader (the title is used otherwise)
  accessibilityLabel?: string;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  accessibilityLabel,
}: ButtonProps) {
  // true while the button is held down, so we can show the pressed look
  const [pressed, setPressed] = useState(false);
  // true while the button has keyboard focus, so we can draw the gold ring
  const [focused, setFocused] = useState(false);

  // A loading or disabled button does nothing.
  const blocked = disabled || loading;

  // No pressed look while the button is blocked.
  const showPressed = pressed && !blocked;

  // Collect the styles for the current variant and state.
  const boxStyles: StyleProp<ViewStyle>[] = [
    styles.base,
    variant === "primary" && styles.primary,
    variant === "secondary" && styles.secondary,
    variant === "danger" && styles.danger,
    showPressed && variant === "primary" && styles.primaryPressed,
    showPressed && variant === "secondary" && styles.secondaryPressed,
    showPressed && variant === "danger" && styles.dangerPressed,
    blocked && styles.blocked,
    focused && styles.focused,
    // on the web, draw the ring as a solid line so the browser's default
    // black focus ring can never show through
    Platform.OS === "web" && focused && styles.focusedWeb,
  ];

  const textStyles = [
    styles.title,
    variant === "primary" && styles.titleOnDark,
    variant === "secondary" && styles.titleSecondary,
    variant === "danger" && styles.titleOnDark,
    blocked && styles.titleBlocked,
  ];

  return (
    <Pressable
      onPress={onPress}
      // a blocked button is not reachable and not tab-focusable
      disabled={blocked}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      // allow keyboard focus on the web
      focusable
      accessibilityRole="button"
      // while loading the title is hidden, so the button still needs a name
      accessibilityLabel={accessibilityLabel ?? (loading ? title : undefined)}
      accessibilityState={{ disabled: blocked, busy: loading }}
      style={boxStyles}
    >
      {loading ? (
        // a spinner takes the place of the title while loading
        <ActivityIndicator color={colors.inkSoft} />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // shared shape of the three variants
  base: {
    minHeight: layout.minTouchTarget,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    // a ring drawn just outside the button. Transparent until focused, so
    // the button never changes size when the ring appears.
    outlineWidth: 2,
    outlineStyle: "solid",
    outlineColor: "transparent",
    outlineOffset: 2,
  },

  // --- primary (forest green) ---
  primary: {
    backgroundColor: colors.forest,
  },
  primaryPressed: {
    backgroundColor: colors.forestPressed,
  },

  // --- secondary (outlined) ---
  secondary: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.forest,
  },
  secondaryPressed: {
    backgroundColor: colors.paperDeep,
  },

  // --- danger (red) ---
  danger: {
    backgroundColor: colors.expense,
  },
  dangerPressed: {
    opacity: 0.85,
  },

  // --- not usable right now ---
  blocked: {
    backgroundColor: colors.disabled,
    borderColor: colors.disabled,
    opacity: 1,
  },

  // gold ring when the button has keyboard focus
  focused: {
    outlineColor: colors.gold,
    outlineWidth: 2,
    outlineOffset: 2,
  },

  // on the web, draw the ring as a solid line (not the browser's "auto") so
  // the gold colour always wins
  focusedWeb: {
    outlineStyle: "solid",
  },

  // the words on the button
  title: {
    ...typography.bodyStrong,
  },
  titleOnDark: {
    color: colors.paper,
  },
  titleSecondary: {
    color: colors.forest,
  },
  titleBlocked: {
    color: colors.inkSoft,
  },
});
