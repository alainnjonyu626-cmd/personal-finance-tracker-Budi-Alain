import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Icon } from "@/components/Icon";
import { strings } from "@/strings/en";
import { colors, layout, radius, spacing, typography } from "@/theme";
import type { ReportInput } from "@/storage/reports";
import type { TransactionType } from "@/types/models";
import { toISODate, todayISO } from "@/utils/dates";
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
      <View
        style={[
          styles.typeBadge,
          selected && value === "income" && styles.incomeBadgeSelected,
          selected && value === "expense" && styles.expenseBadgeSelected,
        ]}
      >
        <Icon
          name={value}
          size={18}
          color={
            selected
              ? colors.paper
              : colors.inkSoft
          }
        />
      </View>
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
      {selected ? (
        <View style={styles.typeCheck}>
          <Icon
            name="check"
            size={16}
            color={value === "income" ? colors.income : colors.expense}
          />
        </View>
      ) : null}
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
          label={strings.reports.incomeType}
          selected={value === "income"}
          onPress={onChange}
        />
        <TypeOption
          value="expense"
          label={strings.reports.expenseType}
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

function DateChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      focusable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      style={[
        styles.dateChip,
        selected && styles.dateChipSelected,
        focused && styles.focused,
        Platform.OS === "web" && focused && styles.focusedWeb,
      ]}
    >
      <Text style={[styles.dateChipText, selected && styles.dateChipTextSelected]}>
        {label}
      </Text>
    </Pressable>
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

  const today = todayISO();
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = toISODate(yesterdayDate);

  return (
    <KeyboardAvoidingView
      style={styles.form}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Banner message={bannerMessage} />

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
          size="large"
          leftElement={<Text style={styles.currency}>{strings.common.currency}</Text>}
        />

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
          leftElement={<Icon name="wallet" size={20} color={colors.inkSoft} />}
        />

        <View style={styles.dateFields}>
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
            leftElement={<Icon name="calendar" size={20} color={colors.inkSoft} />}
          />
          <View style={styles.dateChips}>
            <DateChip
              label={strings.form.today}
              selected={date === today}
              onPress={() => {
                setDate(today);
                clearFieldError("date");
              }}
            />
            <DateChip
              label={strings.form.yesterday}
              selected={date === yesterday}
              onPress={() => {
                setDate(yesterday);
                clearFieldError("date");
              }}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.cancelButton}>
          <Button
            title={strings.common.cancel}
            variant="secondary"
            onPress={onCancel}
            disabled={saving}
          />
        </View>
        <View style={styles.submitButton}>
          <Button
            title={saving ? strings.form.saving : submitTitle}
            onPress={handleSubmit}
            loading={saving}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  form: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.xl,
  },
  footer: {
    flexDirection: "row",
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: colors.paper,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
  currency: {
    ...typography.bodyStrong,
    color: colors.inkSoft,
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
    minHeight: 84,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderWidth: 2,
    borderRadius: radius.lg,
    padding: spacing.md,
    position: "relative",
    outlineWidth: 2,
    outlineStyle: "solid",
    outlineColor: "transparent",
    outlineOffset: 2,
  },
  incomeSelected: {
    backgroundColor: colors.incomeTint,
    borderColor: colors.income,
  },
  expenseSelected: {
    backgroundColor: colors.expenseTint,
    borderColor: colors.expense,
  },
  typeOptionUnselected: {
    backgroundColor: colors.paperDeep,
    borderColor: colors.line,
  },
  typeBadge: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
    backgroundColor: colors.paper,
  },
  incomeBadgeSelected: {
    backgroundColor: colors.income,
  },
  expenseBadgeSelected: {
    backgroundColor: colors.expense,
  },
  typeOptionText: {
    ...typography.bodyStrong,
    flexShrink: 1,
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
  typeCheck: {
    position: "absolute",
    top: spacing.xs,
    right: spacing.xs,
  },
  dateFields: {
    gap: spacing.md,
  },
  dateChips: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  dateChip: {
    minHeight: layout.minTouchTarget,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.paperDeep,
    outlineWidth: 2,
    outlineStyle: "solid",
    outlineColor: "transparent",
    outlineOffset: 2,
  },
  dateChipSelected: {
    backgroundColor: colors.forest,
    borderColor: colors.forest,
  },
  dateChipText: {
    ...typography.bodyStrong,
    color: colors.ink,
  },
  dateChipTextSelected: {
    color: colors.paper,
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
