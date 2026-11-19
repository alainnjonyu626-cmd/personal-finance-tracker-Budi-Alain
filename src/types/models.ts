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
