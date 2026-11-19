import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Button } from "@/components";
import { useAuth } from "@/context/AuthContext";
import { getUserReports } from "@/storage/reports";
import { strings } from "@/strings/en";
import { colors, layout, radius, spacing, typography } from "@/theme";
import type { Report } from "@/types/models";
import { calculateTotals } from "@/utils/balance";
import { formatDisplayDate } from "@/utils/dates";
import { formatMoney, signedAmount } from "@/utils/money";

export default function ReportsScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const userId = user?.id;
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!userId) {
        return;
      }

      let isFocused = true;
      setLoading(true);

      getUserReports(userId).then((nextReports) => {
        if (isFocused) {
          setReports(nextReports);
          setLoading(false);
        }
      });

      return () => {
        isFocused = false;
      };
    }, [userId]),
  );

  const totals = useMemo(() => calculateTotals(reports), [reports]);

  if (!user) {
    return null;
  }

  const listHeader = (
    <View>
      <View style={styles.greetingRow}>
        <Text style={styles.greeting} numberOfLines={1}>
          {`${strings.screens.hello}, ${user.name}`}
        </Text>
        <View style={styles.logoutButton}>
          <Button
            title={strings.screens.logout}
            variant="secondary"
            onPress={() => void signOut()}
          />
        </View>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.cardLabel}>{strings.reports.balanceLabel}</Text>
        <Text
          style={[
            styles.balance,
            totals.balance < 0 && styles.negativeBalance,
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {formatMoney(totals.balance)}
        </Text>
        <View style={styles.goldRule} />
        <View style={styles.totalsRow}>
          <View style={styles.totalCell}>
            <Text style={styles.cardLabel}>{strings.reports.incomeLabel}</Text>
            <Text style={styles.incomeAmount} numberOfLines={1}>
              {`▲ ${formatMoney(totals.totalIncome)}`}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalCell}>
            <Text style={styles.cardLabel}>{strings.reports.expensesLabel}</Text>
            <Text style={styles.expenseAmount} numberOfLines={1}>
              {`▼ ${formatMoney(totals.totalExpenses)}`}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.listTitle}>{strings.reports.listTitle}</Text>
    </View>
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReportRow
            item={item}
            onPress={() =>
              router.push({
                pathname: "/edit-report/[id]",
                params: { id: item.id },
              })
            }
          />
        )}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          loading ? (
            <Text style={styles.emptyLoading}>{strings.common.loading}</Text>
          ) : (
            <View style={styles.emptyBlock}>
              <Text style={styles.emptyTitle}>{strings.reports.emptyTitle}</Text>
              <Text style={styles.emptyHint}>{strings.reports.emptyHint}</Text>
            </View>
          )
        }
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.bottomBar}>
        <Button
          title={strings.reports.addButton}
          onPress={() => router.push("/add-report")}
        />
      </View>
    </View>
  );
}

function ReportRow({
  item,
  onPress,
}: {
  item: Report;
  onPress: () => void;
}) {
  const [focused, setFocused] = useState(false);
  const isIncome = item.type === "income";
  const typeLabel =
    item.type === "income"
      ? strings.reports.incomeType
      : strings.reports.expenseType;
  const arrow = isIncome ? "▲" : "▼";

  return (
    <Pressable
      onPress={onPress}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      focusable
      accessibilityRole="button"
      accessibilityLabel={`${item.name}, ${typeLabel}, ${formatMoney(item.amount)}, ${formatDisplayDate(item.date)}`}
      accessibilityHint={strings.reports.editHint}
      style={({ pressed }) => [
        styles.reportRow,
        pressed && styles.reportRowPressed,
        focused && styles.reportRowFocused,
      ]}
    >
      <View style={styles.reportDetails}>
        <Text style={styles.reportName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.reportCaption} numberOfLines={1}>
          {`${formatDisplayDate(item.date)} · ${typeLabel}`}
        </Text>
      </View>
      <Text
        style={[
          styles.reportAmount,
          isIncome ? styles.incomeAmount : styles.expenseAmount,
        ]}
        numberOfLines={1}
      >
        {`${arrow} ${signedAmount(item.type, item.amount)}`}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  listContent: {
    flexGrow: 1,
    padding: spacing.xl,
    paddingBottom: spacing.huge * 3,
    width: "100%",
    maxWidth: layout.maxContentWidth,
    alignSelf: "center",
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  greeting: {
    ...typography.title,
    color: colors.ink,
    flex: 1,
  },
  logoutButton: {
    width: 120,
  },
  balanceCard: {
    backgroundColor: colors.paperDeep,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginTop: spacing.lg,
  },
  cardLabel: {
    ...typography.label,
    color: colors.inkSoft,
  },
  balance: {
    ...typography.displayXL,
    color: colors.ink,
  },
  negativeBalance: {
    color: colors.expense,
  },
  goldRule: {
    height: 3,
    width: spacing.huge * 2,
    backgroundColor: colors.gold,
    borderRadius: radius.sm,
    marginVertical: spacing.lg,
  },
  totalsRow: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: spacing.md,
  },
  totalCell: {
    flex: 1,
    gap: spacing.xs,
  },
  divider: {
    width: 1,
    backgroundColor: colors.line,
  },
  incomeAmount: {
    ...typography.amount,
    color: colors.income,
  },
  expenseAmount: {
    ...typography.amount,
    color: colors.expense,
  },
  listTitle: {
    ...typography.label,
    color: colors.inkSoft,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  emptyLoading: {
    ...typography.body,
    color: colors.inkSoft,
    textAlign: "center",
    paddingVertical: spacing.xl,
  },
  emptyBlock: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  emptyTitle: {
    ...typography.title,
    color: colors.ink,
    textAlign: "center",
  },
  emptyHint: {
    ...typography.body,
    color: colors.inkSoft,
    textAlign: "center",
  },
  reportRow: {
    minHeight: 64,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    outlineWidth: 2,
    outlineStyle: "solid",
    outlineColor: "transparent",
    outlineOffset: 2,
  },
  reportRowPressed: {
    backgroundColor: colors.paperDeep,
  },
  reportRowFocused: {
    outlineColor: colors.gold,
  },
  reportDetails: {
    flex: 1,
    marginRight: spacing.md,
  },
  reportName: {
    ...typography.bodyStrong,
    color: colors.ink,
  },
  reportCaption: {
    ...typography.caption,
    color: colors.inkSoft,
  },
  reportAmount: {
    flexShrink: 0,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.xl,
    backgroundColor: colors.paper,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
});
