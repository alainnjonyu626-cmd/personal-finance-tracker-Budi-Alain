/**
 * The login screen: email, password, "Remember me" and a button.
 * On success we only set the user; the (auth) layout then sends the user
 * to the reports screen by itself.
 */

import { Link, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Banner, Button, PasswordField, TextField } from "@/components";
import { useAuth } from "@/context/AuthContext";
import { loginUser } from "@/storage/auth";
import { strings } from "@/strings/en";
import { colors, layout, radius, spacing, typography } from "@/theme";
import { validateEmail } from "@/utils/validation";

export default function LoginScreen() {
  // Read the route params for success banners after registration or recovery.
  const params = useLocalSearchParams<{ registered?: string; reset?: string }>();
  // The success banner is shown right after a successful registration.
  const justRegistered = params.registered === "1";
  const justReset = params.reset === "1";

  // The user state of the whole app (signIn logs the user in).
  const { signIn } = useAuth();

  // What the user has typed so far.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  // Messages shown under the fields, and the message from the service.
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [serviceError, setServiceError] = useState<string | null>(null);

  // True while the login request is running, so a second tap does nothing.
  const [working, setWorking] = useState(false);

  // Typing in the email box removes its error and the old service message.
  function handleEmailChange(text: string) {
    setEmail(text);
    setEmailError(null);
    setServiceError(null);
  }

  // Typing in the password box removes its error and the old service message.
  function handlePasswordChange(text: string) {
    setPassword(text);
    setPasswordError(null);
    setServiceError(null);
  }

  async function handleSubmit() {
    // Ignore a second press while the first request is still running.
    if (working) {
      return;
    }

    // 1. Check the two fields before calling the service.
    const nextEmailError = validateEmail(email);
    // At login we only care about an empty password, not its length.
    const nextPasswordError = password.length === 0 ? strings.errors.passwordRequired : null;

    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    setServiceError(null);

    if (nextEmailError || nextPasswordError) {
      return;
    }

    // 2. Ask the accounts service if this email and password match a user.
    setWorking(true);
    const result = await loginUser(email, password);
    setWorking(false);

    if (!result.ok) {
      setServiceError(result.error);
      return;
    }

    // 3. Log in. We do not navigate: the (auth) layout does it once user is set.
    await signIn(result.data, remember);
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      // a tap on a link works even while the keyboard is open
      keyboardShouldPersistTaps="handled"
    >
      {/* the page header */}
      <View style={styles.header}>
        <Text style={styles.appName}>{strings.screens.appName}</Text>
        {/* a short gold rule under the title */}
        <View style={styles.rule} />
        <Text style={styles.subtitle}>{strings.auth.loginSubtitle}</Text>
      </View>

      {/* shown once, right after the account was created */}
      {justRegistered ? (
        <Banner message={strings.auth.accountCreated} tone="success" />
      ) : justReset ? (
        <Banner message={strings.auth.passwordUpdated} tone="success" />
      ) : null}

      {/* the form */}
      <View style={styles.form}>
        <TextField
          label={strings.auth.emailLabel}
          value={email}
          onChangeText={handleEmailChange}
          error={emailError}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          returnKeyType="next"
        />

        <PasswordField
          label={strings.auth.passwordLabel}
          value={password}
          onChangeText={handlePasswordChange}
          error={passwordError}
          autoComplete="current-password"
          returnKeyType="done"
          // pressing "done" on the keyboard sends the form
          onSubmitEditing={handleSubmit}
        />

        {/* the "Remember me" checkbox */}
        <Pressable
          onPress={() => setRemember(!remember)}
          style={styles.checkboxRow}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: remember }}
          accessibilityLabel={strings.auth.rememberMe}
        >
          <View style={[styles.box, remember && styles.boxChecked]}>
            {/* the tick only appears when the box is checked */}
            {remember ? <Text style={styles.tick}>✓</Text> : null}
          </View>
          <Text style={styles.checkboxLabel}>{strings.auth.rememberMe}</Text>
        </Pressable>

        {/* the answer from the service, for example "Wrong email or password" */}
        <Banner message={serviceError} tone="error" />

        <Button
          title={working ? strings.auth.loggingIn : strings.screens.login}
          onPress={handleSubmit}
          loading={working}
        />

        {/* someone without an account goes to the register screen */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>{strings.auth.noAccount}</Text>
          <Link href="/register" style={styles.link}>
            {strings.screens.register}
          </Link>
        </View>

        {/* a quiet link for a forgotten password */}
        <Link href="/forgot-password" style={styles.link}>
          {strings.auth.forgotLink}
        </Link>
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
  // the column of content: centred when the screen is taller than the form
  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.xl,
    gap: spacing.lg,
    // never wider than the phone frame, even on a desktop
    width: "100%",
    maxWidth: layout.maxContentWidth,
    alignSelf: "center",
  },

  // --- header ---
  header: {
    gap: spacing.sm,
  },
  appName: {
    ...typography.displayL,
    color: colors.ink,
  },
  rule: {
    height: 3,
    width: spacing.huge,
    backgroundColor: colors.gold,
    borderRadius: radius.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.inkSoft,
  },

  // fields stacked with a small gap
  form: {
    gap: spacing.lg,
  },

  // --- "Remember me" ---
  // the whole row is tappable and tall enough for a finger
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    minHeight: layout.minTouchTarget,
    // a gold ring drawn outside the row when it has keyboard focus
    outlineWidth: 2,
    outlineStyle: "solid",
    outlineColor: "transparent",
    outlineOffset: 2,
    borderRadius: radius.sm,
    ...(Platform.OS === "web" ? { cursor: "pointer" as const } : {}),
  },
  box: {
    width: 24,
    height: 24,
    borderWidth: 1.5,
    borderColor: colors.forest,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  // filled forest green when checked
  boxChecked: {
    backgroundColor: colors.forest,
  },
  tick: {
    ...typography.bodyStrong,
    color: colors.paper,
    lineHeight: 20,
  },
  checkboxLabel: {
    ...typography.body,
    color: colors.ink,
  },

  // --- links under the button ---
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  footerText: {
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
