import { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { strings } from "@/strings/en";
import { colors, layout, radius, spacing, typography } from "@/theme";
import type { ReportInput } from "@/storage/reports";
import type { TransactionType } from "@/types/models";
import { todayISO } from "@/utils/dates";
import {
  parseAmount,
  validateAmount,
  validateDate,
  validateReportName,
  validateType,
} from "@/utils/validation";

import { Banner } from "./Banner";
import { Button } from "./Button";
import { TextField } from "./TextField";

interface ReportFormProps {
  initial: {
    name: string;
    type: TransactionType | "";
    amount: string;
    date: string;
  };
  submitTitle: string;
  onSubmit: (input: ReportInput) => Promise<string | null>;
  onCancel: () => void;
}

interface ReportFormErrors {
  name: string | null;
  type: string | null;
  amount: string | null;
  date: string | null;
}

interface TypeSelectorProps {
  value: TransactionType | "";
  error: string | null;
  onChange: (value: TransactionType) => void;
}

function TypeOption({
  value,
  label,
  selected,
  onPress,
}: {
  value: TransactionType;
  label: string;
  selected: boolean;
  onPress: (value: TransactionType) => void;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <Pressable
      onPress={() => onPress(value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      focusable
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ checked: selected }}
      style={[
        styles.typeOption,
        value === "income" && selected && styles.incomeSelected,
        value === "expense" && selected && styles.expenseSelected,
        !selected && styles.typeOptionUnselected,
        focused && styles.focused,
        Platform.OS === "web" && focused && styles.focusedWeb,
      ]}
    >
      <Text
        style={[
          styles.typeOptionText,
          value === "income" && selected && styles.incomeSelectedText,
          value === "expense" && selected && styles.expenseSelectedText,
          !selected && styles.typeOptionUnselectedText,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function TypeSelector({ value, error, onChange }: TypeSelectorProps) {
  return (
    <View style={styles.typeField}>
      <Text style={styles.label}>{strings.form.typeLabel}</Text>
      <View style={styles.typeOptions} accessibilityRole="radiogroup">
        <TypeOption
          value="income"
          label={`▲ ${strings.reports.incomeType}`}
          selected={value === "income"}
          onPress={onChange}
        />
        <TypeOption
          value="expense"
          label={`▼ ${strings.reports.expenseType}`}
          selected={value === "expense"}
          onPress={onChange}
        />
      </View>
      {error ? (
        <Text accessibilityRole="alert" style={styles.typeError}>
          {`⚠ ${error}`}
        </Text>
      ) : null}
    </View>
  );
}

export function ReportForm({
  initial,
  submitTitle,
  onSubmit,
  onCancel,
}: ReportFormProps) {
  const [name, setName] = useState(initial.name);
  const [type, setType] = useState<TransactionType | "">(initial.type);
  const [amount, setAmount] = useState(initial.amount);
  const [date, setDate] = useState(initial.date);
  const [errors, setErrors] = useState<ReportFormErrors>({
    name: null,
    type: null,
    amount: null,
    date: null,
  });
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function clearFieldError(field: keyof ReportFormErrors) {
    setErrors((previous) => ({ ...previous, [field]: null }));
    setBannerMessage(null);
  }

  async function handleSubmit() {
    if (saving) {
      return;
    }

    const nextErrors: ReportFormErrors = {
      name: validateReportName(name),
      type: validateType(type),
      amount: validateAmount(amount),
      date: validateDate(date),
    };
    setErrors(nextErrors);
    setBannerMessage(null);

    if (nextErrors.name || nextErrors.type || nextErrors.amount || nextErrors.date) {
      return;
    }

    setSaving(true);
    const parsedAmount = parseAmount(amount);
    if (parsedAmount === null || type === "") {
      setBannerMessage(strings.errors.saveFailed);
      setSaving(false);
      return;
    }

    const message = await onSubmit({
      name: name.trim(),
      type,
      amount: parsedAmount,
      date: date.trim(),
    });
    setSaving(false);
    setBannerMessage(message);
  }

  return (
    <View style={styles.form}>
      <TextField
        label={strings.form.nameLabel}
        placeholder={strings.form.namePlaceholder}
        value={name}
        onChangeText={(text) => {
          setName(text);
          clearFieldError("name");
        }}
        error={errors.name}
        autoCapitalize="sentences"
        returnKeyType="next"
      />

      <TypeSelector
        value={type}
        error={errors.type}
        onChange={(nextType) => {
          setType(nextType);
          clearFieldError("type");
        }}
      />

      <TextField
        label={strings.form.amountLabel}
        placeholder={strings.form.amountPlaceholder}
        value={amount}
        onChangeText={(text) => {
          setAmount(text);
          clearFieldError("amount");
        }}
        error={errors.amount}
        keyboardType="decimal-pad"
        returnKeyType="next"
      />

      <TextField
        label={strings.form.dateLabel}
        value={date}
        onChangeText={(text) => {
          setDate(text);
          clearFieldError("date");
        }}
        error={errors.date}
        helper={strings.form.dateHelper}
        autoCapitalize="none"
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
      />
      <Button
        title={strings.form.useToday}
        variant="secondary"
        onPress={() => {
          setDate(todayISO());
          clearFieldError("date");
        }}
      />

      <Banner message={bannerMessage} />

      <Button
        title={saving ? strings.form.saving : submitTitle}
        onPress={handleSubmit}
        loading={saving}
      />
      <Button
        title={strings.common.cancel}
        variant="secondary"
        onPress={onCancel}
        disabled={saving}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.lg,
  },
  typeField: {
    gap: spacing.xs,
  },
  label: {
    ...typography.label,
    color: colors.inkSoft,
  },
  typeOptions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  typeOption: {
    flex: 1,
    minHeight: layout.minTouchTarget,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    outlineWidth: 2,
    outlineStyle: "solid",
    outlineColor: "transparent",
    outlineOffset: 2,
  },
  incomeSelected: {
    backgroundColor: colors.incomeTint,
    borderWidth: 2,
    borderColor: colors.income,
  },
  expenseSelected: {
    backgroundColor: colors.expenseTint,
    borderWidth: 2,
    borderColor: colors.expense,
  },
  typeOptionUnselected: {
    backgroundColor: colors.paperDeep,
    borderWidth: 1,
    borderColor: colors.line,
  },
  typeOptionText: {
    ...typography.bodyStrong,
  },
  incomeSelectedText: {
    color: colors.income,
  },
  expenseSelectedText: {
    color: colors.expense,
  },
  typeOptionUnselectedText: {
    color: colors.ink,
  },
  focused: {
    outlineColor: colors.gold,
    outlineWidth: 2,
    outlineOffset: 2,
  },
  focusedWeb: {
    outlineStyle: "solid",
  },
  typeError: {
    ...typography.caption,
    color: colors.expense,
  },
});
