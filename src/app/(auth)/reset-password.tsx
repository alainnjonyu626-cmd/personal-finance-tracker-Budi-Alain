import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Banner, Button, PasswordField, TextField } from "@/components";
import { resetPassword } from "@/storage/auth";
import { strings } from "@/strings/en";
import { colors, layout, radius, spacing, typography } from "@/theme";
import {
  validateConfirmPassword,
  validateEmail,
  validatePassword,
  validateResetCode,
} from "@/utils/validation";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string | string[] }>();
  const initialEmail = Array.isArray(params.email)
    ? params.email[0] ?? ""
    : params.email ?? "";

  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [newPasswordError, setNewPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(
    null,
  );
  const [serviceError, setServiceError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  function handleEmailChange(text: string) {
    setEmail(text);
    setEmailError(null);
    setServiceError(null);
  }

  function handleCodeChange(text: string) {
    setCode(text);
    setCodeError(null);
    setServiceError(null);
  }

  function handleNewPasswordChange(text: string) {
    setNewPassword(text);
    setNewPasswordError(null);
    setServiceError(null);
  }

  function handleConfirmPasswordChange(text: string) {
    setConfirmPassword(text);
    setConfirmPasswordError(null);
    setServiceError(null);
  }

  async function handleSubmit() {
    if (working) {
      return;
    }

    const nextEmailError = validateEmail(email);
    const nextCodeError = validateResetCode(code);
    const nextNewPasswordError = validatePassword(newPassword);
    const nextConfirmPasswordError = validateConfirmPassword(
      newPassword,
      confirmPassword,
    );

    setEmailError(nextEmailError);
    setCodeError(nextCodeError);
    setNewPasswordError(nextNewPasswordError);
    setConfirmPasswordError(nextConfirmPasswordError);
    setServiceError(null);

    if (
      nextEmailError ||
      nextCodeError ||
      nextNewPasswordError ||
      nextConfirmPasswordError
    ) {
      return;
    }

    setWorking(true);
    const result = await resetPassword(email, code, newPassword);
    setWorking(false);

    if (!result.ok) {
      setServiceError(result.error);
      return;
    }

    router.replace({ pathname: "/login", params: { reset: "1" } });
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.title}>{strings.screens.resetPassword}</Text>
        <View style={styles.rule} />
        <Text style={styles.subtitle}>{strings.auth.resetSubtitle}</Text>
      </View>

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

        <TextField
          label={strings.auth.codeLabel}
          value={code}
          onChangeText={handleCodeChange}
          error={codeError}
          keyboardType="number-pad"
          autoCapitalize="none"
          returnKeyType="next"
        />

        <PasswordField
          label={strings.auth.newPasswordLabel}
          value={newPassword}
          onChangeText={handleNewPasswordChange}
          error={newPasswordError}
          helper={strings.auth.passwordHelper}
          autoComplete="new-password"
          returnKeyType="next"
        />

        <PasswordField
          label={strings.auth.confirmNewLabel}
          value={confirmPassword}
          onChangeText={handleConfirmPasswordChange}
          error={confirmPasswordError}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />

        <Banner message={serviceError} tone="error" />

        <Button
          title={working ? strings.auth.resetting : strings.screens.resetPassword}
          onPress={handleSubmit}
          loading={working}
        />

        <Link href="/forgot-password" style={styles.link}>
          {strings.auth.needNewCode}
        </Link>
        <Link href="/login" style={styles.link}>
          {strings.auth.backToLogin}
        </Link>
      </View>
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
  subtitle: {
    ...typography.body,
    color: colors.inkSoft,
  },
  form: {
    gap: spacing.lg,
  },
  link: {
    ...typography.bodyStrong,
    color: colors.forest,
    minHeight: layout.minTouchTarget,
    paddingVertical: spacing.md,
  },
});
