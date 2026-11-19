import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  AuthScreen,
  Banner,
  Button,
  Icon,
  PasswordField,
  TextField,
} from "@/components";
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
  const [newCodeLinkFocused, setNewCodeLinkFocused] = useState(false);
  const [loginLinkFocused, setLoginLinkFocused] = useState(false);

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
    <AuthScreen
      title={strings.screens.resetPassword}
      subtitle={strings.auth.resetSubtitle}
      footer={
        <View style={styles.footer}>
          <Link href="/forgot-password" asChild>
            <Pressable
              accessibilityRole="link"
              onBlur={() => setNewCodeLinkFocused(false)}
              onFocus={() => setNewCodeLinkFocused(true)}
              style={[
                styles.link,
                newCodeLinkFocused && styles.linkFocused,
              ]}
            >
              <Text style={styles.linkText}>{strings.auth.needNewCode}</Text>
            </Pressable>
          </Link>
          <Link href="/login" asChild>
            <Pressable
              accessibilityRole="link"
              onBlur={() => setLoginLinkFocused(false)}
              onFocus={() => setLoginLinkFocused(true)}
              style={[
                styles.link,
                loginLinkFocused && styles.linkFocused,
              ]}
            >
              <Icon name="back" size={18} color={colors.forest} />
              <Text style={styles.linkText}>{strings.auth.backToLogin}</Text>
            </Pressable>
          </Link>
        </View>
      }
    >
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

      <TextField
        label={strings.auth.codeLabel}
        value={code}
        onChangeText={handleCodeChange}
        error={codeError}
        keyboardType="number-pad"
        autoCapitalize="none"
        returnKeyType="next"
        leftElement={<Icon name="key" size={20} color={colors.inkSoft} />}
      />

      <PasswordField
        label={strings.auth.newPasswordLabel}
        value={newPassword}
        onChangeText={handleNewPasswordChange}
        error={newPasswordError}
        helper={strings.auth.passwordHelper}
        autoComplete="new-password"
        returnKeyType="next"
        leftElement={<Icon name="lock" size={20} color={colors.inkSoft} />}
      />

      <PasswordField
        label={strings.auth.confirmNewLabel}
        value={confirmPassword}
        onChangeText={handleConfirmPasswordChange}
        error={confirmPasswordError}
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
        leftElement={<Icon name="lock" size={20} color={colors.inkSoft} />}
      />

      <Banner message={serviceError} tone="error" />

      <Button
        title={working ? strings.auth.resetting : strings.screens.resetPassword}
        onPress={handleSubmit}
        loading={working}
      />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  footer: {
    alignItems: "center",
    gap: spacing.sm,
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    minHeight: layout.minTouchTarget,
    paddingVertical: spacing.md,
    outlineWidth: 2,
    outlineStyle: "solid",
    outlineColor: "transparent",
    outlineOffset: 2,
    borderRadius: radius.sm,
  },
  linkFocused: {
    outlineColor: colors.gold,
  },
  linkText: {
    ...typography.bodyStrong,
    color: colors.forest,
  },
});
