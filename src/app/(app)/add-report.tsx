import { useRouter } from "expo-router";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useState } from "react";

import { Icon, ReportForm } from "@/components";
import { useAuth } from "@/context/AuthContext";
import { addReport } from "@/storage/reports";
import { strings } from "@/strings/en";
import { colors, radius, spacing, typography } from "@/theme";
import { todayISO } from "@/utils/dates";

export default function AddReportScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [backFocused, setBackFocused] = useState(false);

  if (!user) {
    return null;
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.replace("/reports")}
          onFocus={() => setBackFocused(true)}
          onBlur={() => setBackFocused(false)}
          focusable
          accessibilityRole="button"
          accessibilityLabel={strings.form.backToReports}
          style={[
            styles.backButton,
            backFocused && styles.focused,
            Platform.OS === "web" && backFocused && styles.focusedWeb,
          ]}
        >
          <Icon name="back" size={22} color={colors.forest} />
        </Pressable>
        <View style={styles.heading}>
          <Text style={styles.title}>{strings.screens.addReport}</Text>
          <Text style={styles.subtitle}>{strings.form.addSubtitle}</Text>
        </View>
      </View>

      <View style={styles.body}>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  backButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
    backgroundColor: colors.paperDeep,
    borderWidth: 1,
    borderColor: colors.line,
    outlineWidth: 2,
    outlineStyle: "solid",
    outlineColor: "transparent",
    outlineOffset: 2,
  },
  heading: {
    flex: 1,
  },
  title: {
    ...typography.displayL,
    color: colors.ink,
  },
  subtitle: {
    ...typography.caption,
    color: colors.inkSoft,
  },
  body: {
    flex: 1,
  },
  focused: {
    outlineColor: colors.gold,
    outlineWidth: 2,
    outlineOffset: 2,
  },
  focusedWeb: {
    outlineStyle: "solid",
  },
});
