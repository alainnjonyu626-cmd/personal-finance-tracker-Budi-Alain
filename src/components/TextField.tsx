/**
 * A single text input with a label above it and a hint or an error below it.
 * Every colour, size and gap comes from the theme, so it looks the same
 * everywhere it is used.
 */

import type { ReactNode } from "react";
import { useState } from "react";
import type {
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
  TextInputProps,
} from "react-native";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { colors, layout, radius, spacing, typography } from "@/theme";

// The list of props a TextField accepts. PasswordField reuses it.
export interface TextFieldProps {
  // the little uppercase name above the box
  label: string;
  // what is typed right now
  value: string;
  // called with the new text every time the user types
  onChangeText: (text: string) => void;
  // when this is set, the box turns red and the message is shown below it
  error?: string | null;
  // quiet help text below the box (hidden while there is an error)
  helper?: string;
  // grey text inside an empty box
  placeholder?: string;
  // which keyboard the phone should show (email, numbers, ...)
  keyboardType?: KeyboardTypeOptions;
  // "none" stops the phone from capitalising the first letter
  autoCapitalize?: "none" | "sentences" | "words";
  // tells the browser/phone what kind of text this is, so it can autofill
  autoComplete?: TextInputProps["autoComplete"];
  // dots instead of letters, used for passwords
  secureTextEntry?: boolean;
  // false makes the field read-only and greyed out
  editable?: boolean;
  // what the keyboard's enter key says ("next", "done", ...)
  returnKeyType?: ReturnKeyTypeOptions;
  // called when the user presses that enter key
  onSubmitEditing?: () => void;
  // anything placed on the right inside the box (like a Show/Hide button)
  rightElement?: ReactNode;
  // optional content placed on the left inside the box
  leftElement?: ReactNode;
  // larger input style for amounts
  size?: "default" | "large";
}

export function TextField({
  label,
  value,
  onChangeText,
  error,
  helper,
  placeholder,
  keyboardType,
  autoCapitalize,
  autoComplete,
  secureTextEntry,
  editable,
  returnKeyType,
  onSubmitEditing,
  rightElement,
  leftElement,
  size = "default",
}: TextFieldProps) {
  // true while this box has the focus, so we can draw the gold ring
  const [focused, setFocused] = useState(false);

  // An error counts only when it is a real message (not null or "").
  const hasError = Boolean(error);

  // The text under the box: the error wins over the helper.
  const message = hasError ? error : helper;

  return (
    <View style={styles.field}>
      {/* the label */}
      <Text style={styles.label}>{label}</Text>

      {/* the box itself: the gold ring is drawn outside it, so its size never changes */}
      <View
        style={[
          styles.box,
          size === "large" && styles.boxLarge,
          focused && styles.boxFocused,
          hasError && styles.boxError,
        ]}
      >
        {leftElement ? <View style={styles.left}>{leftElement}</View> : null}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.inkSoft}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          secureTextEntry={secureTextEntry}
          editable={editable}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          // a screen reader reads the label for this box
          accessibilityLabel={label}
          // on the web, also tell it the box contains a wrong value
          {...(Platform.OS === "web" && hasError
            ? { "aria-invalid": true as const }
            : {})}
          style={[
            styles.input,
            size === "large" && styles.inputLarge,
            Platform.OS === "web" && styles.inputWeb,
          ]}
        />

        {/* optional content on the right, such as a Show/Hide button */}
        {rightElement ? <View style={styles.right}>{rightElement}</View> : null}
      </View>

      {/* the error or the helper line under the box */}
      {message ? (
        <Text
          // an error should be announced as soon as it appears
          accessibilityRole={hasError ? "alert" : undefined}
          style={hasError ? styles.errorText : styles.helperText}
        >
          {hasError ? "⚠ " : ""}
          {message}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  // label, box and message stacked with a small gap
  field: {
    gap: spacing.xs,
  },
  label: {
    ...typography.label,
    color: colors.inkSoft,
  },

  // the input box
  box: {
    minHeight: layout.minTouchTarget,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.paperDeep,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    // a ring drawn just outside the box. Transparent until focused, so the
    // box never changes size when the ring appears (same trick as the Save button).
    outlineWidth: 2,
    outlineStyle: "solid",
    outlineColor: "transparent",
    outlineOffset: 2,
  },
  boxLarge: {
    minHeight: 64,
  },
  // gold ring while the box has the focus
  boxFocused: {
    outlineColor: colors.gold,
  },
  // red border when there is an error
  boxError: {
    borderColor: colors.expense,
  },

  // the text inside the box
  input: {
    flex: 1,
    // let the box decide the height
    paddingVertical: 0,
    margin: 0,
    ...typography.body,
    color: colors.ink,
  },
  inputLarge: {
    ...typography.amountL,
  },

  // no border of its own and no visible outline on the web: the box around
  // it draws the border and the gold focus ring. The outline stays solid and
  // transparent (never "none") so that the browser's own black focus ring can
  // never appear on the text itself.
  inputWeb: {
    borderWidth: 0,
    outlineStyle: "solid",
    outlineColor: "transparent",
  },
  // the Show/Hide button sits on the right, a small gap from the text
  right: {
    marginLeft: spacing.sm,
  },
  left: {
    alignItems: "center",
    marginRight: spacing.sm,
  },

  // the two possible lines under the box
  helperText: {
    ...typography.caption,
    color: colors.inkSoft,
  },
  errorText: {
    ...typography.caption,
    color: colors.expense,
  },
});
