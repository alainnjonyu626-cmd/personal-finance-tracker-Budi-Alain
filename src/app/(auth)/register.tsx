/**
 * The register screen: name, email, password and confirm password.
 * On success we go to the login screen with ?registered=1, so it can show
 * the "Account created" banner. The user is NOT logged in here.
 */

import { Link, router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { AuthScreen, Banner, Button, Icon, PasswordField, TextField } from "@/components";
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
    <AuthScreen
      title={strings.screens.register}
      subtitle={strings.auth.registerSubtitle}
      footer={
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>{strings.auth.haveAccount}</Text>
          <Link href="/login" style={styles.link}>
            {strings.screens.login}
          </Link>
        </View>
      }
    >
      <TextField
        label={strings.auth.nameLabel}
        value={name}
        onChangeText={handleNameChange}
        error={nameError}
        autoCapitalize="words"
        autoComplete="name"
        returnKeyType="next"
        leftElement={<Icon name="person" size={20} color={colors.inkSoft} />}
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
        leftElement={<Icon name="mail" size={20} color={colors.inkSoft} />}
      />

      <PasswordField
        label={strings.auth.passwordLabel}
        value={password}
        onChangeText={handlePasswordChange}
        error={passwordError}
        helper={strings.auth.passwordHelper}
        autoComplete="new-password"
        returnKeyType="next"
        leftElement={<Icon name="lock" size={20} color={colors.inkSoft} />}
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
        leftElement={<Icon name="lock" size={20} color={colors.inkSoft} />}
      />

      {/* the answer from the service, for example a duplicate email */}
      <Banner message={serviceError} tone="error" />

      <Button
        title={working ? strings.auth.creating : strings.screens.register}
        onPress={handleSubmit}
        loading={working}
      />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  // --- link under the button ---
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
