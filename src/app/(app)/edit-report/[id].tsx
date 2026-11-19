/**
 * Placeholder for the edit report screen. The real form comes in the next step.
 */

import { Link, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { strings } from "@/strings/en";
import { colors, layout, spacing, typography } from "@/theme";

export default function EditReportScreen() {
  // The id comes from the route "/edit-report/[id]".
  const params = useLocalSearchParams<{ id: string | string[] }>();

  // A route can repeat a parameter, so it may already be a list.
  // We simply show the first one.
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>{strings.screens.editReport}</Text>
      <Text style={styles.id}>{id}</Text>
      <Text style={styles.hint}>{strings.screens.comingSoon}</Text>

      <Link href="/reports" style={styles.link}>
        {strings.screens.reports}
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
  id: {
    ...typography.body,
    color: colors.inkSoft,
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
