/**
 * The reports service: read, add, edit and delete transactions.
 * All reports are kept in ONE array under STORAGE_KEYS.reports.
 * No function ever throws: on a problem it returns an error or a safe fallback.
 */

import { STORAGE_KEYS, readJSON, writeJSON } from "@/storage/storage";
import { strings } from "@/strings/en";
import type { Report, ServiceResult, TransactionType } from "@/types/models";
import { filterByUser, sortNewestFirst } from "@/utils/balance";
import { generateId } from "@/utils/crypto";
import { isValidISODate } from "@/utils/dates";

// Short name for the error texts, so the code below stays readable.
const errors = strings.errors;

/** What the user fills in when adding or editing a report. */
export type ReportInput = {
  name: string;
  type: TransactionType;
  amount: number;
  date: string;
};

/** Load the saved reports. An empty list when nothing is saved yet. */
function loadReports(): Promise<Report[]> {
  return readJSON<Report[]>(STORAGE_KEYS.reports, []);
}

/** Round to 2 decimals so amounts like 12.3456 become 12.35. */
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Check the input again before saving (the screen already checks it,
 * but the service never trusts what it receives).
 * Returns an error message, or null when the input is fine.
 */
function checkInput(input: ReportInput): string | null {
  if (input.name.trim().length === 0) {
    return errors.reportNameRequired;
  }
  if (input.type !== "income" && input.type !== "expense") {
    return errors.typeRequired;
  }
  if (typeof input.amount !== "number" || !Number.isFinite(input.amount)) {
    return errors.amountInvalid;
  }
  if (input.amount <= 0) {
    return errors.amountNotPositive;
  }
  if (!isValidISODate(input.date)) {
    return errors.dateInvalid;
  }
  return null;
}

/** All the reports of one user, newest first. An empty list on any error. */
export async function getUserReports(userId: string): Promise<Report[]> {
  try {
    const reports = await loadReports();
    return sortNewestFirst(filterByUser(reports, userId));
  } catch {
    return [];
  }
}

/** One report, but only if it exists AND belongs to this user. Otherwise null. */
export async function getReport(
  userId: string,
  reportId: string,
): Promise<Report | null> {
  try {
    const reports = await loadReports();
    const report = reports.find((item) => item.id === reportId);

    // A report of another user looks like it does not exist.
    if (!report || report.userId !== userId) {
      return null;
    }
    return report;
  } catch {
    return null;
  }
}

/** Create a new report for this user and save it. */
export async function addReport(
  userId: string,
  input: ReportInput,
): Promise<ServiceResult<Report>> {
  try {
    const problem = checkInput(input);
    if (problem) {
      return { ok: false, error: problem };
    }

    const report: Report = {
      id: generateId(),
      userId,
      name: input.name.trim(),
      type: input.type,
      amount: round2(input.amount),
      date: input.date,
      createdAt: Date.now(),
    };

    const reports = await loadReports();

    if (!(await writeJSON(STORAGE_KEYS.reports, [...reports, report]))) {
      return { ok: false, error: errors.saveFailed };
    }
    return { ok: true, data: report };
  } catch {
    return { ok: false, error: errors.saveFailed };
  }
}

/**
 * Change an existing report. Only the reports of this user can be changed.
 * The id, the owner and the creation time never change.
 */
export async function updateReport(
  userId: string,
  reportId: string,
  input: ReportInput,
): Promise<ServiceResult<Report>> {
  try {
    const problem = checkInput(input);
    if (problem) {
      return { ok: false, error: problem };
    }

    const reports = await loadReports();
    const old = reports.find((item) => item.id === reportId);

    // Not found, or it belongs to someone else: we do not touch it.
    if (!old || old.userId !== userId) {
      return { ok: false, error: errors.saveFailed };
    }

    const updated: Report = {
      ...old,
      name: input.name.trim(),
      type: input.type,
      amount: round2(input.amount),
      date: input.date,
    };

    const newList = reports.map((item) => (item.id === reportId ? updated : item));

    if (!(await writeJSON(STORAGE_KEYS.reports, newList))) {
      return { ok: false, error: errors.saveFailed };
    }
    return { ok: true, data: updated };
  } catch {
    return { ok: false, error: errors.saveFailed };
  }
}

/** Remove a report. Only the reports of this user can be removed. */
export async function deleteReport(
  userId: string,
  reportId: string,
): Promise<ServiceResult<true>> {
  try {
    const reports = await loadReports();
    const report = reports.find((item) => item.id === reportId);

    // Not found, or it belongs to someone else: nothing is deleted.
    if (!report || report.userId !== userId) {
      return { ok: false, error: errors.saveFailed };
    }

    const newList = reports.filter((item) => item.id !== reportId);

    if (!(await writeJSON(STORAGE_KEYS.reports, newList))) {
      return { ok: false, error: errors.saveFailed };
    }
    return { ok: true, data: true };
  } catch {
    return { ok: false, error: errors.saveFailed };
  }
}
