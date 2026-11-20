import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import {
  AccessibilityInfo,
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { strings } from "@/strings/en";
import { colors, layout, radius, spacing, typography } from "@/theme";

import { Logo } from "./Logo";

export interface AuthScreenProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthScreen({
  title,
  subtitle,
  children,
  footer,
}: AuthScreenProps) {
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let mounted = true;
    let animation: Animated.CompositeAnimation | undefined;

    void AccessibilityInfo.isReduceMotionEnabled().then((reduceMotion) => {
      if (!mounted) {
        return;
      }

      if (reduceMotion) {
        entrance.setValue(1);
        return;
      }

      animation = Animated.timing(entrance, {
        toValue: 1,
        duration: 400,
        useNativeDriver: Platform.OS !== "web",
      });
      animation.start();
    });

    return () => {
      mounted = false;
      animation?.stop();
    };
  }, [entrance]);

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.hero}>
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
          <View style={styles.walletCircle}>
            <Logo size={32} color={colors.forest} />
          </View>
          <Text style={styles.appName}>{strings.screens.appName}</Text>
          <Text accessibilityRole="header" style={styles.title}>
            {title}
          </Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <Animated.View
          style={[
            styles.body,
            {
              opacity: entrance,
              transform: [
                {
                  translateY: entrance.interpolate({
                    inputRange: [0, 1],
                    outputRange: [12, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {children}
          {footer != null ? (
            <View style={styles.footer}>{footer}</View>
          ) : null}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  hero: {
    backgroundColor: colors.forest,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.huge,
    paddingBottom: spacing.xxl,
    overflow: "hidden",
  },
  goldCoin: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: radius.pill,
    backgroundColor: colors.gold,
    opacity: 0.18,
  },
  goldCoinOutline: {
    position: "absolute",
    top: -10,
    right: -10,
    width: 100,
    height: 100,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.gold,
    backgroundColor: "transparent",
    opacity: 0.35,
  },
  walletCircle: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  appName: {
    ...typography.label,
    color: colors.forestSoft,
    marginTop: spacing.lg,
  },
  title: {
    ...typography.displayL,
    color: colors.paper,
    marginTop: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.forestSoft,
    marginTop: spacing.sm,
  },
  body: {
    flexGrow: 1,
    width: "100%",
    maxWidth: layout.maxContentWidth,
    alignSelf: "center",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  footer: {
    marginTop: spacing.sm,
  },
});
