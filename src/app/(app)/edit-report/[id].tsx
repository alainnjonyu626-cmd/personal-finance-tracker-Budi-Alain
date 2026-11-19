import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Button, ReportForm } from "@/components";
import { useAuth } from "@/context/AuthContext";
import { updateReport, getReport } from "@/storage/reports";
import type { Report } from "@/types/models";
import { strings } from "@/strings/en";
import { colors, layout, radius, spacing, typography } from "@/theme";

export default function EditReportScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { user } = useAuth();
  const router = useRouter();
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
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.title}>{strings.screens.editReport}</Text>
        <View style={styles.rule} />
      </View>

      {loading ? (
        <Text style={styles.loading}>{strings.common.loading}</Text>
      ) : report === null ? (
        <View style={styles.notFound}>
          <Text style={styles.notFoundTitle}>{strings.form.notFoundTitle}</Text>
          <Text style={styles.notFoundHint}>{strings.form.notFoundHint}</Text>
          <Button
            title={strings.form.backToReports}
            onPress={() => router.replace("/reports")}
          />
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
  loading: {
    ...typography.body,
    color: colors.inkSoft,
  },
  notFound: {
    gap: spacing.lg,
  },
  notFoundTitle: {
    ...typography.title,
    color: colors.ink,
  },
  notFoundHint: {
    ...typography.body,
    color: colors.inkSoft,
  },
});
