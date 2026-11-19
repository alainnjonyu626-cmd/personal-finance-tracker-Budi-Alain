import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Button, Icon, ReportForm } from "@/components";
import { useAuth } from "@/context/AuthContext";
import { updateReport, getReport } from "@/storage/reports";
import type { Report } from "@/types/models";
import { strings } from "@/strings/en";
import { colors, radius, spacing, typography } from "@/theme";

export default function EditReportScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { user } = useAuth();
  const router = useRouter();
  const [backFocused, setBackFocused] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    if (!user || !id) {
      setReport(null);
      setLoading(false);
      return;
    }

    const userId = user.id;
    const reportId = id;
    setLoading(true);

    async function loadReport() {
      const result = await getReport(userId, reportId);
      if (active) {
        setReport(result);
        setLoading(false);
      }
    }

    void loadReport();

    return () => {
      active = false;
    };
  }, [user, id]);

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
          <Text style={styles.title}>{strings.screens.editReport}</Text>
          <Text style={styles.subtitle}>{strings.form.editSubtitle}</Text>
        </View>
      </View>

      <View style={styles.body}>
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={colors.forest} />
          </View>
        ) : report === null ? (
          <View style={styles.centered}>
            <View style={styles.notFound}>
              <Icon name="alert" size={32} color={colors.expense} />
              <Text style={styles.notFoundTitle}>{strings.form.notFoundTitle}</Text>
              <Text style={styles.notFoundHint}>{strings.form.notFoundHint}</Text>
              <Button
                title={strings.form.backToReports}
                onPress={() => router.replace("/reports")}
              />
            </View>
          </View>
        ) : (
          <ReportForm
            key={report.id}
            initial={{
              name: report.name,
              type: report.type,
              amount: String(report.amount),
              date: report.date,
            }}
            submitTitle={strings.form.saveReport}
            onSubmit={async (input) => {
              const result = await updateReport(user.id, report.id, input);
              if (result.ok) {
                router.replace("/reports");
                return null;
              }
              return result.error;
            }}
            onCancel={() => router.replace("/reports")}
          />
        )}
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
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  notFound: {
    alignItems: "center",
    gap: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  notFoundTitle: {
    ...typography.title,
    color: colors.ink,
  },
  notFoundHint: {
    ...typography.body,
    color: colors.inkSoft,
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
