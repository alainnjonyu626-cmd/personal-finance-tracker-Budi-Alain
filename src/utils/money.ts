/**
 * Money formatting helpers.
 * We do not use Intl or toLocaleString: we write the formatting by hand
 * so every phone shows exactly the same result.
 */

import { strings } from "@/strings/en";
import type { TransactionType } from "@/types/models";

// The real minus sign (U+2212), which looks better than the keyboard hyphen.
const MINUS = "\u2212";

/**
 * Round to at most 2 decimals, dropping useless trailing zeros.
 * Example: 1234.5 -> "1234.5", 10.999 -> "11", 5 -> "5".
 */
function trimDecimals(value: number): string {
  // toFixed(2) gives a string like "1234.50"; we remove the trailing zeros below.
  let text = Math.abs(value).toFixed(2);

  // Remove zeros at the end, then a dot left alone at the end.
  if (text.includes(".")) {
    text = text.replace(/0+$/, "").replace(/\.$/, "");
  }

  return text;
}

/** Put a comma between every group of 3 digits: "102300" -> "102,300". */
function addThousands(text: string): string {
  // Work on the part before the dot only.
  const [whole, decimals] = text.split(".");
  let grouped = "";

  // Walk from the end, adding a comma every 3 digits.
  for (let i = 0; i < whole.length; i++) {
    // Digits left behind us (excluding the current one).
    const digitsLeft = whole.length - i;
    if (i > 0 && digitsLeft % 3 === 0) {
      grouped += ",";
    }
    grouped += whole[i];
  }

  return decimals ? grouped + "." + decimals : grouped;
}

/**
 * Format a number for display: "102,300", "1,234.5", "0", "−5,000".
 * Whole numbers have no decimals; others show up to 2 decimals.
 */
export function formatAmount(value: number): string {
  // A negative amount starts with the real minus sign.
  const sign = value < 0 ? MINUS : "";

  // Break the number into digits (no sign) and group them.
  return sign + addThousands(trimDecimals(value));
}

/** Same as formatAmount, followed by the currency: "102,300 FCFA". */
export function formatMoney(value: number): string {
  return formatAmount(value) + " " + strings.common.currency;
}

/** Add the sign for the type: income is "+ ", expense is "− ". */
export function signedAmount(type: TransactionType, amount: number): string {
  const sign = type === "income" ? "+" : MINUS;

  // The amount is always shown as a positive number, because the type gives the sign.
  return sign + " " + formatAmount(Math.abs(amount));
}
