/**
 * The accounts service: register, login and password reset.
 * It reads and writes the local storage, so the screens stay simple.
 * No function ever throws: on a problem it returns { ok: false, error }.
 */

import { STORAGE_KEYS, readJSON, removeKey, writeJSON } from "@/storage/storage";
import { strings } from "@/strings/en";
import type { ResetCode, ServiceResult, SessionUser, User } from "@/types/models";
import { generateId, generateResetCode, generateSalt, hashPassword } from "@/utils/crypto";
import { normalizeEmail } from "@/utils/validation";

// A reset code works for 10 minutes.
export const RESET_CODE_MINUTES = 10;

// Short names for the error texts, so the code below stays readable.
const errors = strings.errors;

// The user kept in memory while the app is open (so a reload clears it).
let memorySession: SessionUser | null = null;

/** Load the saved users list. An empty list when nothing is saved yet. */
function loadUsers(): Promise<User[]> {
  return readJSON<User[]>(STORAGE_KEYS.users, []);
}

/** Load the saved reset codes. An empty list when nothing is saved yet. */
function loadResetCodes(): Promise<ResetCode[]> {
  return readJSON<ResetCode[]>(STORAGE_KEYS.resetCodes, []);
}

/** Keep only the safe fields of a user (no hash, no salt). */
function toSessionUser(user: User): SessionUser {
  return { id: user.id, name: user.name, email: user.email };
}

/** Create a new account. Fails when the email is already taken. */
export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<ServiceResult<SessionUser>> {
  try {
    const email = normalizeEmail(input.email);
    const users = await loadUsers();

    // The same email cannot be used twice (we compare lowercase emails).
    if (users.some((user) => user.email === email)) {
      return { ok: false, error: errors.duplicateEmail };
    }

    // Never save the real password, only the hash made with a fresh salt.
    const salt = generateSalt();
    const passwordHash = await hashPassword(input.password, salt);

    const user: User = {
      id: generateId(),
      name: input.name.trim(),
      email,
      passwordHash,
      salt,
      createdAt: Date.now(),
    };

    if (!(await writeJSON(STORAGE_KEYS.users, [...users, user]))) {
      return { ok: false, error: errors.saveFailed };
    }
    return { ok: true, data: toSessionUser(user) };
  } catch {
    return { ok: false, error: errors.saveFailed };
  }
}

/** Check an email and password. A wrong email and a wrong password look the same. */
export async function loginUser(
  email: string,
  password: string,
): Promise<ServiceResult<SessionUser>> {
  try {
    const wantedEmail = normalizeEmail(email);
    const users = await loadUsers();
    const user = users.find((item) => item.email === wantedEmail);

    // Unknown email OR wrong password: the same message on purpose.
    if (!user) {
      return { ok: false, error: errors.wrongCredentials };
    }

    const passwordHash = await hashPassword(password, user.salt);
    if (passwordHash !== user.passwordHash) {
      return { ok: false, error: errors.wrongCredentials };
    }
    return { ok: true, data: toSessionUser(user) };
  } catch {
    return { ok: false, error: errors.wrongCredentials };
  }
}

/** Create a 6-digit code for a registered email. */
export async function requestPasswordReset(
  email: string,
): Promise<ServiceResult<{ code: string; expiresAt: number }>> {
  try {
    const wantedEmail = normalizeEmail(email);
    const users = await loadUsers();

    if (!users.some((user) => user.email === wantedEmail)) {
      return { ok: false, error: errors.emailNotFound };
    }

    const code = generateResetCode();
    const expiresAt = Date.now() + RESET_CODE_MINUTES * 60 * 1000;

    // A new request replaces the old code for this email.
    const others = (await loadResetCodes()).filter(
      (item) => item.email !== wantedEmail,
    );

    if (!(await writeJSON(STORAGE_KEYS.resetCodes, [...others, { email: wantedEmail, code, expiresAt }]))) {
      return { ok: false, error: errors.saveFailed };
    }
    return { ok: true, data: { code, expiresAt } };
  } catch {
    return { ok: false, error: errors.saveFailed };
  }
}

/** Use a reset code once to choose a new password. */
export async function resetPassword(
  email: string,
  code: string,
  newPassword: string,
): Promise<ServiceResult<true>> {
  try {
    const wantedEmail = normalizeEmail(email);
    const users = await loadUsers();
    const user = users.find((item) => item.email === wantedEmail);

    if (!user) {
      return { ok: false, error: errors.emailNotFound };
    }

    const records = await loadResetCodes();
    const record = records.find((item) => item.email === wantedEmail);

    // No record, or a different code: the code is wrong.
    if (!record || record.code !== code.trim()) {
      return { ok: false, error: errors.codeInvalid };
    }
    if (Date.now() > record.expiresAt) {
      return { ok: false, error: errors.codeExpired };
    }

    // A new salt too, because the password changed.
    const salt = generateSalt();
    const passwordHash = await hashPassword(newPassword, salt);
    const updatedUsers = users.map((item) =>
      item.id === user.id ? { ...item, salt, passwordHash } : item,
    );

    if (!(await writeJSON(STORAGE_KEYS.users, updatedUsers))) {
      return { ok: false, error: errors.saveFailed };
    }

    // The code is used up: remove it so it can never work a second time.
    if (
      !(await writeJSON(
        STORAGE_KEYS.resetCodes,
        records.filter((item) => item.email !== wantedEmail),
      ))
    ) {
      return { ok: false, error: errors.saveFailed };
    }
    return { ok: true, data: true };
  } catch {
    return { ok: false, error: errors.saveFailed };
  }
}

/**
 * Remember the logged-in user.
 * With `remember` true the session is also saved, so it survives a reload.
 */
export async function saveSession(
  user: SessionUser,
  remember: boolean,
): Promise<void> {
  memorySession = user;
  if (remember) {
    // A failed save is not fatal: the user simply stays logged in for this visit.
    await writeJSON(STORAGE_KEYS.session, user);
  }
}

/** The logged-in user, or null. Null if that account no longer exists. */
export async function loadSession(): Promise<SessionUser | null> {
  const session = memorySession ?? (await readJSON<SessionUser | null>(STORAGE_KEYS.session, null));

  if (!session) {
    return null;
  }

  // The account may have been deleted: only return a user that really exists.
  const users = await loadUsers();
  const exists = users.some((user) => user.id === session.id);
  return exists ? session : null;
}

/** Forget the logged-in user. */
export async function clearSession(): Promise<void> {
  memorySession = null;
  await removeKey(STORAGE_KEYS.session);
}
