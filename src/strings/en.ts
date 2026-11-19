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
} as const;

export type Strings = typeof strings;
