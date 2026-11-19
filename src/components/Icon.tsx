import type { ComponentProps } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "@/theme";

const glyphs = {
  add: "add",
  back: "arrow-back",
  calendar: "calendar-outline",
  chevron: "chevron-forward",
  eye: "eye-outline",
  eyeOff: "eye-off-outline",
  income: "arrow-up",
  expense: "arrow-down",
  lock: "lock-closed-outline",
  logout: "log-out-outline",
  mail: "mail-outline",
  person: "person-outline",
  key: "key-outline",
  check: "checkmark",
  alert: "alert-circle-outline",
  wallet: "wallet-outline",
} as const satisfies Record<string, ComponentProps<typeof Ionicons>["name"]>;

export type IconName = keyof typeof glyphs;

export function Icon({
  name,
  size = 20,
  color = colors.ink,
}: {
  name: IconName;
  size?: number;
  color?: string;
}) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Ionicons name={glyphs[name]} size={size} color={color} />
    </View>
  );
}
