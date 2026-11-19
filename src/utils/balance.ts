/**
 * Helpers that work on a list of reports: totals, sorting and filtering.
 * All functions return new data and never change the array they receive.
 */

import type { Report } from "@/types/models";

/** Round to 2 decimals so tiny floating point errors do not show up. */
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** The three numbers shown on the home screen. */
export interface Totals {
  // All the money that came in.
  totalIncome: number;
  // All the money that went out.
  totalExpenses: number;
  // What is left: income minus expenses.
  balance: number;
}

/**
 * Add up a list of reports.
 * Example: income 190,000 and expenses 77,700 gives a balance of 112,300.
 */
export function calculateTotals(reports: Report[]): Totals {
  let totalIncome = 0;
  let totalExpenses = 0;

  for (const report of reports) {
    if (report.type === "income") {
      totalIncome += report.amount;
    } else {
      totalExpenses += report.amount;
    }
  }

  return {
    totalIncome: round2(totalIncome),
    totalExpenses: round2(totalExpenses),
    balance: round2(totalIncome - totalExpenses),
  };
}

/**
 * A new list sorted newest first: by date descending, and when two reports
 * share the same date, the one created last comes first.
 * Dates are "YYYY-MM-DD" text, so they can be compared directly as strings.
 */
export function sortNewestFirst(reports: Report[]): Report[] {
  // [...reports] makes a copy, so the original list keeps its order.
  return [...reports].sort((a, b) => {
    if (a.date !== b.date) {
      // Newer date first.
      return a.date < b.date ? 1 : -1;
    }
    // Same date: newer createdAt first.
    return b.createdAt - a.createdAt;
  });
}

/** Only the reports that belong to this user. */
export function filterByUser(reports: Report[], userId: string): Report[] {
  return reports.filter((report) => report.userId === userId);
}
