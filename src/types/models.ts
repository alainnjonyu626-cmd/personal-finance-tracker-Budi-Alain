/**
 * The main data shapes used by the app.
 * A "report" is one transaction (one income or one expense).
 */

// A transaction can only be money coming in or money going out.
export type TransactionType = "income" | "expense";

/** One transaction saved by the user. */
export interface Report {
  // Unique id for this report (used to edit or delete it).
  id: string;
  // Id of the user who owns this report (each user sees only their own).
  userId: string;
  // Name typed by the user, e.g. "Salary" or "Taxi fare".
  name: string;
  // Whether this is income or expense.
  type: TransactionType;
  // Amount of money, always greater than 0. The + or − sign comes from the type.
  amount: number;
  // Date of the transaction, saved as text like "2026-11-01" (YYYY-MM-DD).
  date: string;
  // When the report was created in the app, in milliseconds (Date.now()).
  createdAt: number;
}

/** One user account. */
export interface User {
  // Unique id for this user.
  id: string;
  // Name typed by the user when registering.
  name: string;
  // Email address, always stored in lowercase so login is not case-sensitive.
  email: string;
  // The password after hashing. The real password is never stored.
  passwordHash: string;
  // Random text mixed into the hash, so two identical passwords look different.
  salt: string;
  // When the account was created, in milliseconds (Date.now()).
  createdAt: number;
}

/**
 * The answer of every storage service (accounts, reports...).
 * Either it worked and carries `data`, or it failed and carries a readable `error`.
 */
export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

/** The safe part of a user we keep in memory: never the password hash or the salt. */
export interface SessionUser {
  // Id of the logged-in user.
  id: string;
  // Name shown on screen, e.g. "Budi Alain".
  name: string;
  // Email, always lowercase.
  email: string;
}

/** One temporary code that lets a user choose a new password. */
export interface ResetCode {
  // Email of the account this code belongs to (lowercase).
  email: string;
  // The 6-digit code shown on screen, e.g. "042917".
  code: string;
  // When the code stops working, in milliseconds (Date.now()).
  expiresAt: number;
}
