/**
 * Every piece of text the user reads lives here.
 * More groups (login, reports, errors...) will be added in later steps.
 */

export const strings = {
  // words reused across many screens
  common: {
    currency: "FCFA",
    save: "Save",
    cancel: "Cancel",
    back: "Back",
    loading: "Loading…",
    // shown inside a password field to reveal or hide what was typed
    show: "Show",
    hide: "Hide",
    // spoken by a screen reader for the same show/hide button
    showPassword: "Show password",
    hidePassword: "Hide password",
  },

  // messages shown under an input when something is wrong
  errors: {
    // sign up and login
    nameRequired: "Please enter your name.",
    emailRequired: "Please enter your email.",
    emailInvalid: "That email doesn't look right. Example: name@example.com",
    passwordRequired: "Please enter a password.",
    passwordTooShort: "Your password must have at least 6 characters.",
    confirmRequired: "Please confirm your password.",
    passwordsMismatch: "The two passwords don't match.",
    // adding or editing a report
    reportNameRequired: "Please enter a name for this report.",
    typeRequired: "Please choose Income or Expense.",
    amountRequired: "Please enter an amount.",
    amountInvalid: "The amount must be a number, like 18500.",
    amountNotPositive: "The amount must be greater than 0.",
    amountTooLarge: "That amount is too large.",
    dateRequired: "Please choose a date.",
    dateInvalid: "That date isn't valid. Use the format YYYY-MM-DD.",
    // recovering a password
    codeRequired: "Please enter the reset code.",
    // answers that come from the accounts service (src/storage/auth.ts)
    duplicateEmail: "An account with this email already exists. Try logging in.",
    wrongCredentials: "Wrong email or password. Please try again.",
    emailNotFound:
      "We couldn't find an account with that email. Check the spelling or register.",
    codeInvalid: "That code is wrong. Check it and try again.",
    codeExpired: "That code has expired. Please request a new one.",
    saveFailed: "Something went wrong saving your data. Please try again.",
  },
} as const;

export type Strings = typeof strings;
