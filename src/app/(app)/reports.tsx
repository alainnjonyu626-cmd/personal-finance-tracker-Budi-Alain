import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AccessibilityInfo,
  ActivityIndicator,
  Animated,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Icon } from "@/components";
import { useAuth } from "@/context/AuthContext";
import { STORAGE_KEYS, readJSON, writeJSON } from "@/storage/storage";
import { getUserReports } from "@/storage/reports";
import { strings } from "@/strings/en";
import { colors, radius, spacing, typography } from "@/theme";
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
  const [hidden, setHidden] = useState(false);
  const [logoutFocused, setLogoutFocused] = useState(false);
  const [balanceButtonFocused, setBalanceButtonFocused] = useState(false);
  const [addFocused, setAddFocused] = useState(false);
  const hiddenWasToggled = useRef(false);
  const heroProgress = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    let isMounted = true;

    void readJSON<boolean>(STORAGE_KEYS.hideBalance, false).then((savedHidden) => {
      if (isMounted && !hiddenWasToggled.current) {
        setHidden(savedHidden);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    void AccessibilityInfo.isReduceMotionEnabled().then((reduceMotionEnabled) => {
      if (!isMounted) {
        return;
      }

      if (reduceMotionEnabled) {
        heroProgress.setValue(1);
        return;
      }

      Animated.timing(heroProgress, {
        toValue: 1,
        duration: 450,
        useNativeDriver: Platform.OS !== "web",
      }).start();
    });

    return () => {
      isMounted = false;
      heroProgress.stopAnimation();
    };
  }, [heroProgress]);

  const totals = useMemo(() => calculateTotals(reports), [reports]);

  if (!user) {
    return null;
  }

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? strings.reports.greetingMorning
      : hour < 18
        ? strings.reports.greetingAfternoon
        : strings.reports.greetingEvening;
  const firstName = user.name.trim().split(/\s+/)[0] || user.name;

  function toggleBalanceVisibility() {
    const nextHidden = !hidden;
    hiddenWasToggled.current = true;
    setHidden(nextHidden);
    void writeJSON(STORAGE_KEYS.hideBalance, nextHidden);
  }

  return (
    <View style={styles.screen}>
      <View style={styles.fixedContent}>
        <View style={styles.topBar}>
          <View style={styles.greetingBlock}>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.name} numberOfLines={1}>
              {firstName}
            </Text>
          </View>
          <Pressable
            onPress={() => void signOut()}
            onFocus={() => setLogoutFocused(true)}
            onBlur={() => setLogoutFocused(false)}
            focusable
            accessibilityRole="button"
            accessibilityLabel={strings.screens.logout}
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && styles.iconButtonPressed,
              logoutFocused && styles.focused,
              Platform.OS === "web" && logoutFocused && styles.focusedWeb,
            ]}
          >
            <Icon name="logout" size={22} color={colors.forest} />
          </Pressable>
        </View>

        <Animated.View
          style={[
            styles.balanceCard,
            {
              opacity: heroProgress,
              transform: [
                {
                  translateY: heroProgress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View
            pointerEvents="none"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={styles.goldCoin}
          />
          <View
            pointerEvents="none"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={styles.goldCoinOutline}
          />

          <View style={styles.balanceLabelRow}>
            <Text style={styles.cardLabel}>{strings.reports.balanceLabel}</Text>
            <Pressable
              onPress={toggleBalanceVisibility}
              onFocus={() => setBalanceButtonFocused(true)}
              onBlur={() => setBalanceButtonFocused(false)}
              focusable
              accessibilityRole="button"
              accessibilityLabel={
                hidden
                  ? strings.reports.showBalance
                  : strings.reports.hideBalance
              }
              style={({ pressed }) => [
                styles.balanceVisibilityButton,
                pressed && styles.iconButtonPressed,
                balanceButtonFocused && styles.focused,
                Platform.OS === "web" &&
                  balanceButtonFocused &&
                  styles.focusedWeb,
              ]}
            >
              <Icon
                name={hidden ? "eyeOff" : "eye"}
                size={22}
                color={colors.paper}
              />
            </Pressable>
          </View>
          <Text
            style={[
              styles.balance,
              totals.balance < 0 && styles.negativeBalance,
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
            accessibilityLabel={hidden ? strings.reports.hiddenLabel : undefined}
          >
            {hidden ? strings.reports.hiddenValue : formatMoney(totals.balance)}
          </Text>

          <View style={styles.horizontalDivider} />

          <View style={styles.totalsRow}>
            <View style={styles.totalCell}>
              <View style={styles.totalLabelRow}>
                <Icon name="income" size={16} color={colors.incomeOnDark} />
                <Text style={styles.totalLabel}>{strings.reports.incomeLabel}</Text>
              </View>
              <Text
                style={styles.incomeOnDark}
                numberOfLines={1}
                accessibilityLabel={hidden ? strings.reports.hiddenLabel : undefined}
              >
                {hidden
                  ? strings.reports.hiddenValue
                  : formatMoney(totals.totalIncome)}
              </Text>
            </View>
            <View style={styles.verticalDivider} />
            <View style={styles.totalCell}>
              <View style={styles.totalLabelRow}>
                <Icon name="expense" size={16} color={colors.expenseOnDark} />
                <Text style={styles.totalLabel}>{strings.reports.expensesLabel}</Text>
              </View>
              <Text
                style={styles.expenseOnDark}
                numberOfLines={1}
                accessibilityLabel={hidden ? strings.reports.hiddenLabel : undefined}
              >
                {hidden
                  ? strings.reports.hiddenValue
                  : formatMoney(totals.totalExpenses)}
              </Text>
            </View>
          </View>
        </Animated.View>

        <View style={styles.sectionHeader}>
          <Text style={styles.listTitle}>{strings.reports.listTitle}</Text>
          <View style={styles.countPill}>
            <Text
              style={styles.countText}
              accessibilityLabel={`${reports.length} ${strings.reports.countLabel}`}
            >
              {reports.length}
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        style={styles.reportList}
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={ReportSeparator}
        ListEmptyComponent={
          loading ? (
            <View style={styles.emptyState}>
              <ActivityIndicator size="large" color={colors.forest} />
            </View>
          ) : (
            <EmptyState />
          )
        }
      />

      <View
        style={styles.floatingActionContainer}
        pointerEvents="box-none"
      >
        <Pressable
          onPress={() => router.push("/add-report")}
          onFocus={() => setAddFocused(true)}
          onBlur={() => setAddFocused(false)}
          focusable
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.addButtonPressed,
            addFocused && styles.focused,
            Platform.OS === "web" && addFocused && styles.focusedWeb,
          ]}
        >
          <View style={styles.addIconCircle}>
            <Icon name="add" size={18} color={colors.forest} />
          </View>
          <Text style={styles.addButtonText}>{strings.reports.addButton}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function ReportSeparator() {
  return <View style={styles.reportSeparator} />;
}

function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconCircle}>
        <Icon name="wallet" size={32} color={colors.forest} />
      </View>
      <Text style={styles.emptyTitle}>{strings.reports.emptyTitle}</Text>
      <Text style={styles.emptyHint}>{strings.reports.emptyHint}</Text>
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
  const typeLabel = isIncome
    ? strings.reports.incomeType
    : strings.reports.expenseType;

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
        focused && styles.focused,
        Platform.OS === "web" && focused && styles.focusedWeb,
      ]}
    >
      <View
        style={[
          styles.reportBadge,
          isIncome ? styles.incomeTint : styles.expenseTint,
        ]}
      >
        <Icon
          name={isIncome ? "income" : "expense"}
          size={20}
          color={isIncome ? colors.income : colors.expense}
        />
      </View>
      <View style={styles.reportDetails}>
        <Text style={styles.reportName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.reportCaption} numberOfLines={1}>
          {`${formatDisplayDate(item.date)} · ${typeLabel}`}
        </Text>
      </View>
      <View style={styles.reportAmountGroup}>
        <Text
          style={[
            styles.reportAmount,
            isIncome ? styles.incomeAmount : styles.expenseAmount,
          ]}
          numberOfLines={1}
        >
          {signedAmount(item.type, item.amount)}
        </Text>
        <Icon name="chevron" size={16} color={colors.inkSoft} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  fixedContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greetingBlock: {
    flex: 1,
  },
  greeting: {
    ...typography.caption,
    color: colors.inkSoft,
  },
  name: {
    ...typography.displayL,
    color: colors.ink,
  },
  logoutButton: {
    width: 48,
    height: 48,
    minHeight: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.paperDeep,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
    outlineWidth: 2,
    outlineStyle: "solid",
    outlineColor: "transparent",
    outlineOffset: 2,
  },
  iconButtonPressed: {
    backgroundColor: colors.line,
  },
  balanceCard: {
    backgroundColor: colors.forest,
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginTop: spacing.lg,
    overflow: "hidden",
  },
  goldCoin: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: radius.pill,
    backgroundColor: colors.gold,
    opacity: 0.18,
  },
  goldCoinOutline: {
    position: "absolute",
    top: -10,
    right: -10,
    width: 100,
    height: 100,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.gold,
    backgroundColor: "transparent",
    opacity: 0.35,
  },
  balanceLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardLabel: {
    ...typography.label,
    color: colors.forestSoft,
  },
  balanceVisibilityButton: {
    width: 48,
    height: 48,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -spacing.sm,
    marginRight: -spacing.sm,
    borderRadius: radius.pill,
    outlineWidth: 2,
    outlineStyle: "solid",
    outlineColor: "transparent",
    outlineOffset: 2,
  },
  balance: {
    ...typography.displayXL,
    color: colors.paper,
  },
  negativeBalance: {
    color: colors.expenseOnDark,
  },
  horizontalDivider: {
    height: 1,
    backgroundColor: colors.forestLine,
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
  totalLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  totalLabel: {
    ...typography.caption,
    color: colors.forestSoft,
    flexShrink: 1,
  },
  verticalDivider: {
    width: 1,
    backgroundColor: colors.forestLine,
  },
  incomeOnDark: {
    ...typography.amount,
    color: colors.incomeOnDark,
  },
  expenseOnDark: {
    ...typography.amount,
    color: colors.expenseOnDark,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  listTitle: {
    ...typography.label,
    color: colors.inkSoft,
  },
  countPill: {
    backgroundColor: colors.paperDeep,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
  },
  countText: {
    ...typography.caption,
    color: colors.ink,
  },
  reportList: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xs,
    paddingBottom: 120,
  },
  reportSeparator: {
    height: spacing.sm,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.xl,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: radius.pill,
    backgroundColor: colors.paperDeep,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
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
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.paperDeep,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: spacing.md,
    outlineWidth: 2,
    outlineStyle: "solid",
    outlineColor: "transparent",
    outlineOffset: 2,
  },
  reportRowPressed: {
    backgroundColor: colors.line,
  },
  focused: {
    outlineColor: colors.gold,
    outlineWidth: 2,
    outlineOffset: 2,
  },
  focusedWeb: {
    outlineStyle: "solid",
  },
  reportBadge: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  incomeTint: {
    backgroundColor: colors.incomeTint,
  },
  expenseTint: {
    backgroundColor: colors.expenseTint,
  },
  reportDetails: {
    flex: 1,
    marginHorizontal: spacing.md,
  },
  reportName: {
    ...typography.bodyStrong,
    color: colors.ink,
  },
  reportCaption: {
    ...typography.caption,
    color: colors.inkSoft,
  },
  reportAmountGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  reportAmount: {
    ...typography.amount,
    flexShrink: 1,
  },
  incomeAmount: {
    color: colors.income,
  },
  expenseAmount: {
    color: colors.expense,
  },
  floatingActionContainer: {
    position: "absolute",
    bottom: spacing.xl,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  addButton: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
    backgroundColor: colors.forest,
    outlineWidth: 2,
    outlineStyle: "solid",
    outlineColor: "transparent",
    outlineOffset: 2,
    ...(Platform.OS === "web"
      ? { boxShadow: `0 8px 24px ${colors.ink}33` }
      : {
          shadowColor: colors.ink,
          shadowOpacity: 0.2,
          shadowRadius: 12,
          elevation: 6,
        }),
  },
  addButtonPressed: {
    backgroundColor: colors.forestPressed,
  },
  addIconCircle: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    backgroundColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    ...typography.bodyStrong,
    color: colors.paper,
  },
});
