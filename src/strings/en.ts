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

  // words used by the login and register forms only
  auth: {
    loginSubtitle: "Welcome back. Your money notebook is waiting.",
    registerSubtitle: "Create your account to start tracking your money.",
    nameLabel: "Full name",
    emailLabel: "Email",
    passwordLabel: "Password",
    confirmLabel: "Confirm password",
    rememberMe: "Remember me",
    loggingIn: "Logging in…",
    creating: "Creating account…",
    noAccount: "No account yet?",
    haveAccount: "Already have an account?",
    forgotLink: "Forgot password?",
    accountCreated: "Account created. Please log in.",
    passwordHelper: "At least 6 characters",
    forgotSubtitle: "Enter your registered email and we will give you a reset code.",
    resetSubtitle: "Enter the code and choose a new password.",
    sendCode: "Send reset code",
    sending: "Sending…",
    codeLabel: "Reset code",
    newPasswordLabel: "New password",
    confirmNewLabel: "Confirm new password",
    resetting: "Resetting…",
    yourCode: "Your reset code",
    codeNote: "In a real app this code would be sent to your email.",
    validForPrefix: "Valid for",
    minutesWord: "minutes",
    continue: "Continue",
    needNewCode: "Need a new code?",
    backToLogin: "Back to log in",
    passwordUpdated: "Password updated. Please log in with your new password.",
  },

  reports: {
    greetingMorning: "Good morning",
    greetingAfternoon: "Good afternoon",
    greetingEvening: "Good evening",
    balanceLabel: "Current balance",
    hideBalance: "Hide balance",
    showBalance: "Show balance",
    hiddenValue: "••••••",
    hiddenLabel: "Hidden",
    incomeLabel: "Total income",
    expensesLabel: "Total expenses",
    listTitle: "All reports",
    countLabel: "reports",
    emptyTitle: "No reports yet",
    emptyHint: "Tap Add report to record your first income or expense.",
    addButton: "Add report",
    incomeType: "Income",
    expenseType: "Expense",
    editHint: "Opens this report for editing",
  },

  form: {
    addSubtitle: "Record money coming in or going out.",
    editSubtitle: "Update the details of this report.",
    nameLabel: "Name",
    namePlaceholder: "e.g. Salary, Market shopping, Taxi fare",
    typeLabel: "Type",
    amountLabel: "Amount (FCFA)",
    amountPlaceholder: "e.g. 18500",
    dateLabel: "Date",
    dateHelper: "Format: YYYY-MM-DD",
    useToday: "Use today",
    today: "Today",
    yesterday: "Yesterday",
    saveReport: "Save",
    saving: "Saving…",
    notFoundTitle: "Report not found",
    notFoundHint: "This report may have been deleted.",
    backToReports: "Back to reports",
  },

  // titles and words used on the screens (the real content comes later)
  screens: {
    appName: "Personal Finance Tracker",
    login: "Log in",
    register: "Create account",
    forgotPassword: "Forgot password",
    resetPassword: "Reset password",
    reports: "Previous reports",
    addReport: "Add report",
    editReport: "Edit report",
    logout: "Log out",
    hello: "Hello",
    comingSoon: "This screen is built in the next step.",
  },
} as const;

export type Strings = typeof strings;
