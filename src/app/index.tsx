import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  loginUser,
  registerUser,
  requestPasswordReset,
  resetPassword,
} from "@/storage/auth";
import { STORAGE_KEYS, readJSON, removeKey } from "@/storage/storage";
import { strings } from "@/strings/en";
import { colors, layout, radius, spacing, typography } from "@/theme";
import type { Report, User } from "@/types/models";
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

      {/* =================================================================
          Accounts self-test (temporary)
          Runs the accounts service step by step and prints one line per
          step, so we can see on screen that register, login and password
          reset really work. Delete this block later.
         ================================================================= */}
      <AccountsSelfTest />
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

// ---- Accounts self-test (temporary) ----
// The email and password used by every run of the test.
const TEST_EMAIL = "selftest@example.com";
const TEST_PASSWORD = "secret123";

// One line of the report: a tick or a cross, a short label, and the details.
interface TestLine {
  passed: boolean;
  label: string;
  detail: string;
}

function AccountsSelfTest() {
  // every line printed so far, and whether the test is running right now
  const [lines, setLines] = useState<TestLine[]>([]);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);

  // Run all the steps, one after the other, and print each result.
  async function runTest() {
    setRunning(true);
    setFinished(false);

    const results: TestLine[] = [];
    // Add one line and show it straight away.
    function record(step: string, passed: boolean, detail: string) {
      const line = { passed, label: step, detail };
      results.push(line);
      setLines([...results]);
    }

    // Start from a clean phone: no users, no codes, no session.
    await removeKey(STORAGE_KEYS.users);
    await removeKey(STORAGE_KEYS.resetCodes);
    await removeKey(STORAGE_KEYS.session);

    const email = TEST_EMAIL;

    // 1. A new account can be created.
    const registered = await registerUser({
      name: "Test User",
      email,
      password: TEST_PASSWORD,
    });
    record("1. Register new account", registered.ok, registered.ok ? registered.data.email : registered.error);

    // 2. The same email with different capitals is a duplicate.
    const duplicate = await registerUser({
      name: "Test User",
      email: "SelfTest@Example.com",
      password: TEST_PASSWORD,
    });
    record(
      "2. Duplicate email rejected",
      !duplicate.ok && duplicate.error === strings.errors.duplicateEmail,
      duplicate.ok ? "Accepted (wrong)" : duplicate.error,
    );

    // 3. The right password logs in.
    const login = await loginUser(email, TEST_PASSWORD);
    record("3. Login with right password", login.ok, login.ok ? login.data.name : login.error);

    // 4. A wrong password is refused.
    const badPassword = await loginUser(email, "wrongpass");
    record(
      "4. Wrong password refused",
      !badPassword.ok && badPassword.error === strings.errors.wrongCredentials,
      badPassword.ok ? "Accepted (wrong)" : badPassword.error,
    );

    // 5. An unknown email gets the SAME message as a wrong password.
    const unknownEmail = await loginUser("nobody@example.com", TEST_PASSWORD);
    record(
      "5. Unknown email: same message",
      !unknownEmail.ok && unknownEmail.error === strings.errors.wrongCredentials,
      unknownEmail.ok ? "Accepted (wrong)" : unknownEmail.error,
    );

    // 6. A reset cannot be requested for an email that is not registered.
    const nobodyReset = await requestPasswordReset("nobody@example.com");
    record(
      "6. Reset for unknown email refused",
      !nobodyReset.ok && nobodyReset.error === strings.errors.emailNotFound,
      nobodyReset.ok ? "Accepted (wrong)" : nobodyReset.error,
    );

    // 7. A reset code is created for a registered email. We keep it for later.
    const resetRequest = await requestPasswordReset(email);
    const realCode = resetRequest.ok ? resetRequest.data.code : "";
    record(
      "7. Reset code requested (6 digits)",
      resetRequest.ok && /^\d{6}$/.test(realCode),
      resetRequest.ok ? `Code: ${realCode}` : resetRequest.error,
    );

    // 8. A wrong code is refused (skipped in the rare case the real code is 000000).
    if (realCode === "000000") {
      record("8. Wrong code refused", true, "Skipped: the real code is 000000");
    } else {
      const badCode = await resetPassword(email, "000000", "newpass456");
      record(
        "8. Wrong code refused",
        !badCode.ok && badCode.error === strings.errors.codeInvalid,
        badCode.ok ? "Accepted (wrong)" : badCode.error,
      );
    }

    // 9. The real code changes the password.
    const reset = await resetPassword(email, realCode, "newpass456");
    record("9. Real code changes password", reset.ok, reset.ok ? "Password changed" : reset.error);

    // 10. The old password no longer works.
    const oldPassword = await loginUser(email, TEST_PASSWORD);
    record(
      "10. Old password refused",
      !oldPassword.ok,
      oldPassword.ok ? "Accepted (wrong)" : oldPassword.error,
    );

    // 11. The new password works.
    const newPassword = await loginUser(email, "newpass456");
    record(
      "11. New password works",
      newPassword.ok,
      newPassword.ok ? newPassword.data.email : newPassword.error,
    );

    // 12. The same code cannot be used a second time.
    const reuse = await resetPassword(email, realCode, "another789");
    record(
      "12. Code works only once",
      !reuse.ok && reuse.error === strings.errors.codeInvalid,
      reuse.ok ? "Accepted (wrong)" : reuse.error,
    );

    // 13. No password is ever written on the phone in plain text.
    const savedUsers = JSON.stringify(
      await readJSON<User[]>(STORAGE_KEYS.users, []),
    );
    const hasPlainPassword =
      savedUsers.includes("newpass456") || savedUsers.includes("secret123");
    record(
      "13. No plain password stored",
      !hasPlainPassword,
      hasPlainPassword ? "A password was found" : "Only hashes are saved",
    );

    setRunning(false);
    setFinished(true);
  }

  const allPassed = lines.every((line) => line.passed);

  return (
    <View style={styles.testCard}>
      <Text style={styles.label}>Accounts self-test (temporary)</Text>

      {/* the greyed-out look is only for the duration of the run (see button styles) */}
      <Pressable
        onPress={runTest}
        disabled={running}
        style={[styles.smallButton, running && styles.smallButtonDisabled]}
      >
        <Text style={styles.buttonText}>
          {running ? "Running…" : "Run accounts test"}
        </Text>
      </Pressable>

      {/* one line per step */}
      {lines.map((line) => (
        <Text key={line.label} style={styles.testLine}>
          {line.passed ? "✅" : "❌"} {line.label} — {line.detail}
        </Text>
      ))}

      {/* the summary, once everything has run */}
      {finished ? (
        <Text style={styles.testLine}>
          {allPassed ? "All steps passed ✅" : "Some steps failed ❌"}
        </Text>
      ) : null}
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

  // ---- Accounts self-test (temporary) ----
  // a small forest button, same look as the main one
  smallButton: {
    minHeight: layout.minTouchTarget,
    backgroundColor: colors.forest,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  // greyed out while the test is running
  smallButtonDisabled: {
    backgroundColor: colors.disabled,
  },
});
