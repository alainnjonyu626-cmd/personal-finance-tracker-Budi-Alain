/**
 * Validation helpers.
 * Every validator takes the text the user typed and returns either an error
 * message (from strings.errors) or null when the input is fine.
 * The screens show that message under the input, so no screen writes its own text.
 */

import { strings } from "@/strings/en";
import { isValidISODate } from "@/utils/dates";

// All error texts in one place, so the code below stays short to read.
const errors = strings.errors;

// The biggest amount we accept: 999,999,999 FCFA.
const MAX_AMOUNT = 999999999;

// An email must look like name@example.com: no spaces, a dot, and 2+ letters at the end.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// A number with at most 2 decimals. No scientific notation ("1e5"), no letters.
const AMOUNT_PATTERN = /^-?\d+(\.\d{1,2})?$/;

/** Remove the spaces before and after the text. */
function clean(value: string): string {
  return value.trim();
}

/** Email is stored in lowercase, so "Budi@Mail.com" becomes "budi@mail.com". */
export function normalizeEmail(email: string): string {
  return clean(email).toLowerCase();
}

/** The name cannot be empty. */
export function validateName(value: string): string | null {
  if (clean(value).length === 0) {
    return errors.nameRequired;
  }
  return null;
}

/** The email cannot be empty and must look like an email address. */
export function validateEmail(value: string): string | null {
  const email = clean(value);

  if (email.length === 0) {
    return errors.emailRequired;
  }
  if (!EMAIL_PATTERN.test(email)) {
    return errors.emailInvalid;
  }
  return null;
}

/**
 * The password cannot be empty and needs at least 6 characters.
 * We do NOT trim it: a space is a real character in a password.
 */
export function validatePassword(value: string): string | null {
  if (value.length === 0) {
    return errors.passwordRequired;
  }
  if (value.length < 6) {
    return errors.passwordTooShort;
  }
  return null;
}

/** The second password cannot be empty and must be exactly the same as the first. */
export function validateConfirmPassword(
  password: string,
  confirm: string,
): string | null {
  if (confirm.length === 0) {
    return errors.confirmRequired;
  }
  if (confirm !== password) {
    return errors.passwordsMismatch;
  }
  return null;
}

/** The report name cannot be empty. */
export function validateReportName(value: string): string | null {
  if (clean(value).length === 0) {
    return errors.reportNameRequired;
  }
  return null;
}

/** The type must be exactly "income" or "expense". */
export function validateType(value: string): string | null {
  if (value === "income" || value === "expense") {
    return null;
  }
  return errors.typeRequired;
}

/**
 * Turn typed text into a number: "18,500" -> 18500, "1 234.5" -> 1234.5.
 * Returns null when the text is not a plain number.
 */
export function parseAmount(raw: string): number | null {
  // Commas and spaces are just decoration that people type by habit.
  const text = clean(raw).replace(/,/g, "").replace(/\s/g, "");

  if (!AMOUNT_PATTERN.test(text)) {
    return null;
  }

  const value = Number(text);

  // A very long number could still be Infinity; that is not a real amount.
  if (!Number.isFinite(value)) {
    return null;
  }
  return value;
}

/** Check the amount: not empty, a real number, greater than 0 and not too large. */
export function validateAmount(raw: string): string | null {
  if (clean(raw).length === 0) {
    return errors.amountRequired;
  }

  const value = parseAmount(raw);
  if (value === null) {
    return errors.amountInvalid;
  }

  if (value <= 0) {
    return errors.amountNotPositive;
  }
  if (value > MAX_AMOUNT) {
    return errors.amountTooLarge;
  }
  return null;
}

/** Check the date: not empty, and a real calendar day written as YYYY-MM-DD. */
export function validateDate(raw: string): string | null {
  const text = clean(raw);

  if (text.length === 0) {
    return errors.dateRequired;
  }
  if (!isValidISODate(text)) {
    return errors.dateInvalid;
  }
  return null;
}

/** The reset code cannot be empty. */
export function validateResetCode(value: string): string | null {
  if (clean(value).length === 0) {
    return errors.codeRequired;
  }
  return null;
}
