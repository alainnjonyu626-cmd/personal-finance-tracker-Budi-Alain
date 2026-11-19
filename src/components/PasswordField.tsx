/**
 * A password box: the same TextField, but with a "Show" / "Hide" button on the
 * right that switches between dots and normal letters.
 */

import { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { TextField } from "./TextField";
import type { TextFieldProps } from "./TextField";
import { strings } from "@/strings/en";
import { colors, layout, spacing, typography } from "@/theme";

// Every TextField prop except the two this component decides itself:
// secureTextEntry is handled by the Show/Hide button, and rightElement is
// reserved for that button.
export type PasswordFieldProps = Omit<
  TextFieldProps,
  "secureTextEntry" | "rightElement"
>;

export function PasswordField(props: PasswordFieldProps) {
  // true while the password is visible as normal letters
  const [visible, setVisible] = useState(false);

  // the Show/Hide button, given to TextField as its rightElement
  const toggle = (
    <Pressable
      onPress={() => setVisible(!visible)}
      accessibilityRole="button"
      accessibilityLabel={
        visible ? strings.common.hidePassword : strings.common.showPassword
      }
      style={styles.toggle}
    >
      <Text style={styles.toggleText}>
        {visible ? strings.common.hide : strings.common.show}
      </Text>
    </Pressable>
  );

  return (
    <TextField
      {...props}
      // hiding the text means "secure"
      secureTextEntry={!visible}
      rightElement={toggle}
    />
  );
}

const styles = StyleSheet.create({
  // a tap area tall enough to hit easily, centred on the right of the box
  toggle: {
    minHeight: layout.minTouchTarget,
    justifyContent: "center",
    paddingLeft: spacing.sm,
  },
  toggleText: {
    ...typography.bodyStrong,
    color: colors.forest,
  },
});
