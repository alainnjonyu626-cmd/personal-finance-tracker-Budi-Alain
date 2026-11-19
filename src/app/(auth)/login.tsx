/**
 * The login screen: email, password, "Remember me" and a button.
 * On success we only set the user; the (auth) layout then sends the user
 * to the reports screen by itself.
 */

import { Link, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { AuthScreen, Banner, Button, Icon, PasswordField, TextField } from "@/components";
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
    <AuthScreen
      title={strings.screens.login}
      subtitle={strings.auth.loginSubtitle}
      footer={
        <View style={styles.footer}>
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>{strings.auth.noAccount}</Text>
            <Link href="/register" style={styles.link}>
              {strings.screens.register}
            </Link>
          </View>
          <Link href="/forgot-password" style={styles.link}>
            {strings.auth.forgotLink}
          </Link>
        </View>
      }
    >
      {/* shown once, right after the account was created */}
      {justRegistered ? (
        <Banner message={strings.auth.accountCreated} tone="success" />
      ) : justReset ? (
        <Banner message={strings.auth.passwordUpdated} tone="success" />
      ) : null}

      <TextField
        label={strings.auth.emailLabel}
        value={email}
        onChangeText={handleEmailChange}
        error={emailError}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        returnKeyType="next"
        leftElement={<Icon name="mail" size={20} color={colors.inkSoft} />}
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
        leftElement={<Icon name="lock" size={20} color={colors.inkSoft} />}
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
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  footer: {
    alignItems: "center",
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
