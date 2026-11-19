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
  },
} as const;

export type Strings = typeof strings;
