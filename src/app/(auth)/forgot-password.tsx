import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Banner, Button, TextField } from "@/components";
import { RESET_CODE_MINUTES, requestPasswordReset } from "@/storage/auth";
import { strings } from "@/strings/en";
import { colors, layout, radius, spacing, typography } from "@/theme";
import { validateEmail } from "@/utils/validation";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [serviceError, setServiceError] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  function handleEmailChange(text: string) {
    setEmail(text);
    setEmailError(null);
    setServiceError(null);
    setCode(null);
  }

  async function handleSubmit() {
    if (working) {
      return;
    }

    const nextEmailError = validateEmail(email);
    setEmailError(nextEmailError);
    setServiceError(null);
    setCode(null);

    if (nextEmailError) {
      return;
    }

    setWorking(true);
    const result = await requestPasswordReset(email);
    setWorking(false);

    if (!result.ok) {
      setServiceError(result.error);
      return;
    }

    setCode(result.data.code);
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.title}>{strings.screens.forgotPassword}</Text>
        <View style={styles.rule} />
        <Text style={styles.subtitle}>{strings.auth.forgotSubtitle}</Text>
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
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />

        <Banner message={serviceError} tone="error" />

        <Button
          title={working ? strings.auth.sending : strings.auth.sendCode}
          onPress={handleSubmit}
          loading={working}
        />

        {code ? (
          <View style={styles.codeCard}>
            <Text style={styles.codeLabel}>{strings.auth.yourCode}</Text>
            <Text style={styles.code}>{code}</Text>
            <Text style={styles.codeCaption}>
              {strings.auth.validForPrefix} {RESET_CODE_MINUTES} {strings.auth.minutesWord}
            </Text>
            <Text style={styles.codeCaption}>{strings.auth.codeNote}</Text>
          </View>
        ) : null}

        {code ? (
          <Button
            title={strings.auth.continue}
            onPress={() =>
              router.push({ pathname: "/reset-password", params: { email } })
            }
          />
        ) : null}

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
  codeCard: {
    backgroundColor: colors.paperDeep,
    borderWidth: 2,
    borderColor: colors.gold,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  codeLabel: {
    ...typography.label,
    color: colors.inkSoft,
  },
  code: {
    ...typography.amountL,
    color: colors.ink,
    letterSpacing: 4,
  },
  codeCaption: {
    ...typography.caption,
    color: colors.inkSoft,
  },
  link: {
    ...typography.bodyStrong,
    color: colors.forest,
    minHeight: layout.minTouchTarget,
    paddingVertical: spacing.md,
  },
});
