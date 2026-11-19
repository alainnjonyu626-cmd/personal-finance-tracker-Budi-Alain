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
    </ScrollView>
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
});
