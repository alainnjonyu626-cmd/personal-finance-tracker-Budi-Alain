import { StyleSheet, View } from "react-native";

import { colors, radius } from "@/theme";

export interface LogoProps {
  size?: number;
  color?: string;
}

const bars = [0, 1, 2, 3] as const;

export function Logo({ size = 56, color = colors.gold }: LogoProps) {
  const barStyle = {
    width: size * 0.1,
    height: size * 0.62,
    borderRadius: radius.pill,
    backgroundColor: color,
  };

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.container, { width: size, height: size }]}
    >
      <View style={styles.verticalBars}>
        {bars.map((bar) => (
          <View key={bar} style={barStyle} />
        ))}
      </View>
      <View
        style={[
          styles.diagonalBar,
          {
            left: size * 0.45,
            top: size * 0.025,
            width: size * 0.1,
            height: size * 0.95,
            borderRadius: radius.pill,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  verticalBars: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  diagonalBar: {
    position: "absolute",
    transform: [{ rotate: "-62deg" }],
  },
});
