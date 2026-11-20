import { Link, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AuthScreen, Banner, Button, Icon, TextField } from "@/components";
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
  const [loginLinkFocused, setLoginLinkFocused] = useState(false);
  const codeOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let active = true;
    let animation: Animated.CompositeAnimation | undefined;

    codeOpacity.setValue(0);
    if (!code) {
      return;
    }

    void AccessibilityInfo.isReduceMotionEnabled().then((reduceMotion) => {
      if (!active) {
        return;
      }

      if (reduceMotion) {
        codeOpacity.setValue(1);
        return;
      }

      animation = Animated.timing(codeOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: Platform.OS !== "web",
      });
      animation.start();
    });

    return () => {
      active = false;
      animation?.stop();
    };
  }, [code, codeOpacity]);

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
    <AuthScreen
      title={strings.screens.forgotPassword}
      subtitle={strings.auth.forgotSubtitle}
      footer={
        <View style={styles.footer}>
          <Link href="/login" asChild>
            <Pressable
              accessibilityRole="link"
              onBlur={() => setLoginLinkFocused(false)}
              onFocus={() => setLoginLinkFocused(true)}
              style={StyleSheet.flatten([
                styles.link,
                loginLinkFocused && styles.linkFocused,
              ])}
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
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
        leftElement={<Icon name="mail" size={20} color={colors.inkSoft} />}
      />

      <Banner message={serviceError} tone="error" />

      <Button
        title={working ? strings.auth.sending : strings.auth.sendCode}
        onPress={handleSubmit}
        loading={working}
      />

      {code ? (
        <Animated.View style={[styles.codeCard, { opacity: codeOpacity }]}>
          <View
            pointerEvents="none"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={styles.goldCoin}
          />
          <View
            pointerEvents="none"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={styles.goldCoinOutline}
          />

          <View style={styles.codeHeading}>
            <View style={styles.keyCircle}>
              <Icon name="key" size={18} color={colors.forest} />
            </View>
            <Text style={styles.codeLabel}>{strings.auth.yourCode}</Text>
          </View>

          <View
            accessible
            accessibilityLabel={`${strings.auth.yourCode}: ${code.split("").join(" ")}`}
            style={styles.digitRow}
          >
            {code.split("").map((digit, index) => (
              <View key={`${index}-${digit}`} style={styles.digitBox}>
                <Text
                  accessibilityElementsHidden
                  importantForAccessibility="no-hide-descendants"
                  style={styles.digit}
                >
                  {digit}
                </Text>
              </View>
            ))}
          </View>

          <Text style={styles.codeCaption}>
            {strings.auth.validForPrefix} {RESET_CODE_MINUTES}{" "}
            {strings.auth.minutesWord}
          </Text>
          <Text style={styles.codeNote}>{strings.auth.codeNote}</Text>
        </Animated.View>
      ) : null}

      {code ? (
        <Button
          title={strings.auth.continue}
          onPress={() =>
            router.push({ pathname: "/reset-password", params: { email } })
          }
        />
      ) : null}
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  footer: {
    alignItems: "center",
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
  codeCard: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: colors.forest,
    borderRadius: radius.xl,
    padding: spacing.xl,
  },
  goldCoin: {
    position: "absolute",
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: radius.pill,
    backgroundColor: colors.gold,
    opacity: 0.18,
  },
  goldCoinOutline: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 72,
    height: 72,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.gold,
    backgroundColor: "transparent",
    opacity: 0.35,
  },
  codeHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  keyCircle: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  codeLabel: {
    ...typography.label,
    color: colors.forestSoft,
  },
  digitRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  digitBox: {
    flex: 1,
    maxWidth: 52,
    aspectRatio: 0.8,
    borderRadius: radius.md,
    backgroundColor: colors.paper,
    alignItems: "center",
    justifyContent: "center",
  },
  digit: {
    ...typography.amountL,
    color: colors.ink,
    textAlign: "center",
    includeFontPadding: false,
  },
  codeCaption: {
    ...typography.caption,
    color: colors.forestSoft,
    marginTop: spacing.lg,
  },
  codeNote: {
    ...typography.caption,
    color: colors.forestSoft,
    marginTop: spacing.xs,
  },
});
