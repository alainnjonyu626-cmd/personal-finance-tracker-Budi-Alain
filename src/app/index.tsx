import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { strings } from "@/strings/en";
import { colors, layout, radius, spacing, typography } from "@/theme";
import type { Report } from "@/types/models";
import { calculateTotals, sortNewestFirst } from "@/utils/balance";
import { formatMoney } from "@/utils/money";

// ---------------------------------------------------------------------------
// Balance test (temporary)
// Five fake reports used only to check that the balance helpers work.
// This whole block will be deleted once the real screens exist.
// ---------------------------------------------------------------------------
const TEST_REPORTS: Report[] = [
  {
    id: "test-1",
    userId: "test",
    name: "Monthly salary",
    type: "income",
    amount: 150000,
    date: "2026-11-01",
    createdAt: 1000,
  },
  {
    id: "test-2",
    userId: "test",
    name: "House rent",
    type: "expense",
    amount: 60000,
    date: "2026-11-03",
    createdAt: 2000,
  },
  {
    id: "test-3",
    userId: "test",
    name: "Market shopping",
    type: "expense",
    amount: 18500,
    date: "2026-11-07",
    createdAt: 3000,
  },
  {
    id: "test-4",
    userId: "test",
    name: "Freelance design job",
    type: "income",
    amount: 40000,
    date: "2026-11-12",
    createdAt: 4000,
  },
  {
    id: "test-5",
    userId: "test",
    name: "Electricity bill",
    type: "expense",
    amount: 9200,
    date: "2026-11-15",
    createdAt: 5000,
  },
];

// 190,000 in minus 77,700 out = 102,300 left.
const EXPECTED_BALANCE = 102300;

// A temporary screen whose only job is to let you see the design system:
// fonts, colours, spacing and states all in one place.
export default function DesignCheck() {
  // true while the mouse/finger is down on the button
  const [pressed, setPressed] = useState(false);
  // true while the button has keyboard focus (the gold ring is shown)
  const [focused, setFocused] = useState(false);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ---- headings ---- */}
      <Text style={styles.displayL}>Design check</Text>

      {/* ---- big balance with a gold rule under it ---- */}
      <Text style={styles.balanceLabel}>{strings.common.currency}</Text>
      <Text style={styles.balance}>102,300 FCFA</Text>
      <View style={styles.goldRule} />

      {/* ---- income and expense rows ---- */}
      <View style={styles.rows}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Income</Text>
          <Text style={styles.incomeAmount}>▲ + 150,000</Text>
        </View>
        <View style={styles.line} />
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Expense</Text>
          <Text style={styles.expenseAmount}>▼ − 60,000</Text>
        </View>
      </View>

      {/* ---- one paragraph of body text ---- */}
      <Text style={styles.body}>
        Your balance is everything you earned minus everything you spent. It is
        always calculated for you and is never typed by hand.
      </Text>

      {/* ---- one uppercase label ---- */}
      <Text style={styles.label}>Recent activity</Text>

      {/* ---- forest button, with pressed and focus states ---- */}
      <Pressable
        onPress={() => {}}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        // track keyboard focus so we can show the gold ring
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          styles.button,
          pressed && styles.buttonPressed,
          focused && styles.buttonFocused,
        ]}
        // allow the button to receive keyboard focus on web
        focusable
      >
        <Text style={styles.buttonText}>{strings.common.save}</Text>
      </Pressable>

      {/* ---- paper card with a thin ruled border ---- */}
      <View style={styles.card}>
        <Text style={styles.title}>Taxi fare</Text>
        <Text style={styles.caption}>Today · Expense</Text>
        <Text style={styles.expenseAmount}>− 2,500 FCFA</Text>
      </View>

      {/* =================================================================
          Balance test (temporary)
          Shows what calculateTotals and sortNewestFirst return, so we can
          see the numbers on screen. Delete this block later.
         ================================================================= */}
      <BalanceTest />
    </ScrollView>
  );
}

// ---- Balance test (temporary) ----
// A small component that works out the totals from the fake reports above.
function BalanceTest() {
  const totals = calculateTotals(TEST_REPORTS);
  const newestFirst = sortNewestFirst(TEST_REPORTS);
  const balanceIsCorrect = totals.balance === EXPECTED_BALANCE;

  return (
    <View style={styles.testCard}>
      <Text style={styles.label}>Balance test (temporary)</Text>

      {/* the balance, the income and the expenses */}
      <Text style={styles.testBalance}>{formatMoney(totals.balance)}</Text>
      <Text style={styles.testLine}>
        Total income: {formatMoney(totals.totalIncome)}
      </Text>
      <Text style={styles.testLine}>
        Total expenses: {formatMoney(totals.totalExpenses)}
      </Text>

      {/* check that the balance is exactly 102,300 */}
      <Text style={styles.testLine}>
        Expected: 102,300 FCFA {balanceIsCorrect ? "✅" : "❌"}
      </Text>

      {/* names in newest-first order: the first one is "Electricity bill" */}
      <Text style={styles.label}>Order (newest first)</Text>
      {newestFirst.map((report) => (
        <Text key={report.id} style={styles.testLine}>
          {report.date} · {report.name}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  // the page itself
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  // inner padding so nothing touches the edges
  content: {
    padding: spacing.xl,
    gap: spacing.lg,
    paddingBottom: spacing.huge,
  },

  // text styles come straight from the theme
  displayL: {
    ...typography.displayL,
    color: colors.ink,
  },
  balanceLabel: {
    ...typography.label,
    color: colors.inkSoft,
    marginTop: spacing.sm,
  },
  balance: {
    ...typography.displayXL,
    color: colors.ink,
  },
  // the gold accent line under the balance
  goldRule: {
    height: 3,
    width: spacing.huge * 2,
    backgroundColor: colors.gold,
    borderRadius: radius.sm,
    marginTop: -spacing.sm,
  },

  // income / expense list
  rows: {
    backgroundColor: colors.paperDeep,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: layout.minTouchTarget,
  },
  line: {
    height: 1,
    backgroundColor: colors.line,
  },
  rowLabel: {
    ...typography.bodyStrong,
    color: colors.ink,
  },
  incomeAmount: {
    ...typography.amount,
    color: colors.income,
  },
  expenseAmount: {
    ...typography.amount,
    color: colors.expense,
  },

  body: {
    ...typography.body,
    color: colors.ink,
  },
  label: {
    ...typography.label,
    color: colors.inkSoft,
  },

  // the primary button
  button: {
    minHeight: layout.minTouchTarget,
    backgroundColor: colors.forest,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    // a ring drawn just outside the button. Transparent until focused, so
    // the button never changes size when the ring appears.
    borderWidth: 0,
    outlineWidth: 3,
    outlineStyle: "solid",
    outlineColor: "transparent",
    outlineOffset: 2,
  } as const,
  // darker forest while held down
  buttonPressed: {
    backgroundColor: colors.forestPressed,
  },
  // gold ring when the button has keyboard focus
  buttonFocused: {
    outlineColor: colors.gold,
  } as const,
  buttonText: {
    ...typography.bodyStrong,
    color: colors.paper,
  },

  // a simple card
  card: {
    backgroundColor: colors.paperDeep,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  title: {
    ...typography.title,
    color: colors.ink,
  },
  caption: {
    ...typography.caption,
    color: colors.inkSoft,
  },

  // ---- Balance test (temporary) ----
  testCard: {
    backgroundColor: colors.paperDeep,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.line,
  },
  testBalance: {
    ...typography.amountL,
    color: colors.ink,
  },
  testLine: {
    ...typography.body,
    color: colors.inkSoft,
  },
});
