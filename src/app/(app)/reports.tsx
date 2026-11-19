/**
 * Placeholder for the reports list. The real balance and list come next.
 */

import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/components";
import { useAuth } from "@/context/AuthContext";
import { strings } from "@/strings/en";
import { colors, layout, spacing, typography } from "@/theme";

export default function ReportsScreen() {
  // The guards make sure this screen only opens with a logged-in user.
  const { user, signOut } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>{strings.screens.reports}</Text>
      <Text style={styles.greeting}>{`${strings.screens.hello}, ${user.name}`}</Text>
      <Text style={styles.hint}>{strings.screens.comingSoon}</Text>

      <Link href="/add-report" style={styles.link}>
        {strings.screens.addReport}
      </Link>

      {/* No navigation here: signing out makes the guard redirect to login. */}
      <Button title={strings.screens.logout} onPress={() => void signOut()} />
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
  greeting: {
    ...typography.body,
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
