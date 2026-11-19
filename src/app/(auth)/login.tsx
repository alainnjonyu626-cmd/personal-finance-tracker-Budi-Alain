/**
 * Placeholder for the login screen. The real form comes in the next step.
 */

import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { strings } from "@/strings/en";
import { colors, layout, spacing, typography } from "@/theme";

export default function LoginScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>{strings.screens.login}</Text>
      <Text style={styles.hint}>{strings.screens.comingSoon}</Text>

      <Link href="/register" style={styles.link}>
        {strings.screens.register}
      </Link>
      <Link href="/forgot-password" style={styles.link}>
        {strings.screens.forgotPassword}
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
