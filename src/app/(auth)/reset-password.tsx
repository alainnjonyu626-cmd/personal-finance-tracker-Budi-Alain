/**
 * Placeholder for the reset password screen. The real form comes next.
 */

import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { strings } from "@/strings/en";
import { colors, layout, spacing, typography } from "@/theme";

export default function ResetPasswordScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>{strings.screens.resetPassword}</Text>
      <Text style={styles.hint}>{strings.screens.comingSoon}</Text>

      <Link href="/login" style={styles.link}>
        {strings.screens.login}
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
    padding: spacing.xl,
  },
  title: {
    ...typography.displayL,
    color: colors.ink,
  },
  hint: {
    ...typography.body,
    color: colors.inkSoft,
  },
  // every tappable link is big enough for a finger
  link: {
    ...typography.bodyStrong,
    color: colors.forest,
    minHeight: layout.minTouchTarget,
    paddingVertical: spacing.md,
  },
});
