/**
 * Random text and password hashing, using expo-crypto.
 * Nothing here uses Math.random, so the values are safe to use for passwords.
 */

import * as Crypto from "expo-crypto";

/** A unique id (UUID v4), used for users and reports. */
export function generateId(): string {
  return Crypto.randomUUID();
}

/** 16 random bytes written as lowercase hex, which gives 32 characters. */
export function generateSalt(): string {
  const bytes = Crypto.getRandomBytes(16);
  let hex = "";
  for (const byte of bytes) {
    // toString(16) gives one or two characters, so pad single digits with a "0".
    hex += byte.toString(16).padStart(2, "0");
  }
  return hex;
}

/** Hash the salt + password with SHA-256 and return the hex text. */
export async function hashPassword(password: string, salt: string): Promise<string> {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    salt + password,
    // Hex is also the default, but we say it out loud.
    { encoding: Crypto.CryptoEncoding.HEX }
  );
}

/** A 6-digit code for password reset, e.g. "042917". Never uses Math.random. */
export function generateResetCode(): string {
  const bytes = Crypto.getRandomBytes(4);
  // Put the 4 bytes together into one unsigned 32-bit number.
  const number =
    ((bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3]) >>> 0;
  // Keep the last 6 digits, then pad with zeros so it is always 6 characters.
  const code = number % 1000000;
  return code.toString().padStart(6, "0");
}
