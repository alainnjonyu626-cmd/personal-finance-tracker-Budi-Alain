import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { ReportForm } from "@/components";
import { useAuth } from "@/context/AuthContext";
import { addReport } from "@/storage/reports";
import { strings } from "@/strings/en";
import { colors, layout, radius, spacing, typography } from "@/theme";
import { todayISO } from "@/utils/dates";

export default function AddReportScreen() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    return null;
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.title}>{strings.screens.addReport}</Text>
        <View style={styles.rule} />
      </View>

      <ReportForm
        initial={{ name: "", type: "", amount: "", date: todayISO() }}
        submitTitle={strings.form.saveReport}
        onSubmit={async (input) => {
          const result = await addReport(user.id, input);
          if (result.ok) {
            router.replace("/reports");
            return null;
          }
          return result.error;
        }}
        onCancel={() => router.replace("/reports")}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.xl,
    gap: spacing.lg,
    width: "100%",
    maxWidth: layout.maxContentWidth,
    alignSelf: "center",
  },
  header: {
    gap: spacing.sm,
  },
  title: {
    ...typography.displayL,
    color: colors.ink,
  },
  rule: {
    height: 3,
    width: spacing.huge,
    backgroundColor: colors.gold,
    borderRadius: radius.sm,
  },
});
