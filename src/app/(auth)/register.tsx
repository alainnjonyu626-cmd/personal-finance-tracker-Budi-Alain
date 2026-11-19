/**
 * The register screen: name, email, password and confirm password.
 * On success we go to the login screen with ?registered=1, so it can show
 * the "Account created" banner. The user is NOT logged in here.
 */

import { Link, router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Banner, Button, PasswordField, TextField } from "@/components";
import { registerUser } from "@/storage/auth";
import { strings } from "@/strings/en";
import { colors, layout, radius, spacing, typography } from "@/theme";
import {
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
} from "@/utils/validation";

export default function RegisterScreen() {
  // What the user has typed so far.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // Messages shown under the fields, and the message from the service.
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [serviceError, setServiceError] = useState<string | null>(null);

  // True while the account is being created, so a second tap does nothing.
  const [working, setWorking] = useState(false);

  // Typing in a box removes its error and the old service message.
  function handleNameChange(text: string) {
    setName(text);
    setNameError(null);
    setServiceError(null);
  }

  function handleEmailChange(text: string) {
    setEmail(text);
    setEmailError(null);
    setServiceError(null);
  }

  function handlePasswordChange(text: string) {
    setPassword(text);
    setPasswordError(null);
    setServiceError(null);
  }

  function handleConfirmChange(text: string) {
    setConfirm(text);
    setConfirmError(null);
    setServiceError(null);
  }

  async function handleSubmit() {
    // Ignore a second press while the first request is still running.
    if (working) {
      return;
    }

    // 1. Check every field before calling the service.
    const nextNameError = validateName(name);
    const nextEmailError = validateEmail(email);
    const nextPasswordError = validatePassword(password);
    const nextConfirmError = validateConfirmPassword(password, confirm);

    setNameError(nextNameError);
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    setConfirmError(nextConfirmError);
    setServiceError(null);

    if (nextNameError || nextEmailError || nextPasswordError || nextConfirmError) {
      return;
    }

    // 2. Create the account (the service refuses an email already used).
    setWorking(true);
    const result = await registerUser({ name, email, password });
    setWorking(false);

    if (!result.ok) {
      setServiceError(result.error);
      return;
    }

    // 3. Back to the login screen, where a success banner is shown.
    router.replace({ pathname: "/login", params: { registered: "1" } });
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
        <Text style={styles.subtitle}>{strings.auth.registerSubtitle}</Text>
      </View>

      {/* the form */}
      <View style={styles.form}>
        <TextField
          label={strings.auth.nameLabel}
          value={name}
          onChangeText={handleNameChange}
          error={nameError}
          autoCapitalize="words"
          autoComplete="name"
          returnKeyType="next"
        />

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
          helper={strings.auth.passwordHelper}
          autoComplete="new-password"
          returnKeyType="next"
        />

        <PasswordField
          label={strings.auth.confirmLabel}
          value={confirm}
          onChangeText={handleConfirmChange}
          error={confirmError}
          autoComplete="new-password"
          returnKeyType="done"
          // pressing "done" on the keyboard sends the form
          onSubmitEditing={handleSubmit}
        />

        {/* the answer from the service, for example a duplicate email */}
        <Banner message={serviceError} tone="error" />

        <Button
          title={working ? strings.auth.creating : strings.screens.register}
          onPress={handleSubmit}
          loading={working}
        />

        {/* someone who already has an account goes to the login screen */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>{strings.auth.haveAccount}</Text>
          <Link href="/login" style={styles.link}>
            {strings.screens.login}
          </Link>
        </View>
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

  // --- link under the button ---
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
