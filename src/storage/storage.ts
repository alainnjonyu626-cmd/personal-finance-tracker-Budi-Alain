/**
 * Small helpers around AsyncStorage.
 * Every function is safe: on any problem it returns a fallback instead of throwing.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

/** The names of the values we keep on the phone. The "pft:" prefix avoids clashing with other apps. */
export const STORAGE_KEYS = {
  users: "pft:users",
  resetCodes: "pft:resetCodes",
  reports: "pft:reports",
  session: "pft:session",
} as const;

/**
 * Read a value and turn it back from JSON into a JS value.
 * If the key is missing, or anything goes wrong, we return `fallback`.
 */
export async function readJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const text = await AsyncStorage.getItem(key);
    // A missing key comes back as null.
    if (text === null) {
      return fallback;
    }
    return JSON.parse(text) as T;
  } catch {
    // Bad JSON or a storage error: use the fallback.
    return fallback;
  }
}

/**
 * Turn a value into JSON text and save it.
 * Returns true when it worked, false when it failed.
 */
export async function writeJSON(key: string, value: unknown): Promise<boolean> {
  try {
    const text = JSON.stringify(value);
    // JSON.stringify returns undefined for values it cannot write.
    if (text === undefined) {
      return false;
    }
    await AsyncStorage.setItem(key, text);
    return true;
  } catch {
    // Cannot stringify or cannot save: report failure.
    return false;
  }
}

/** Delete a saved value. Errors are ignored on purpose. */
export async function removeKey(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // Nothing to do: the value is gone or we could not reach storage.
  }
}
