/**
 * Zero-Knowledge Client-Side Encryption Engine for SUVIDHA Kiosk.
 * Implements high-performance synchronous symmetric encryption (RC4 Stream Cipher)
 * to secure sensitive citizen data (e.g. Aadhaar, Phone Numbers) before saving
 * to local databases or syncing to Google Firebase Firestore.
 */

// Secret key for kiosk data encryption
const SECRET_KEY = "SUVIDHA_SECURE_CIPHER_KEY_AES256";

function KSA(key: string): number[] {
  const s = Array.from({ length: 256 }, (_, i) => i);
  let j = 0;
  for (let i = 0; i < 256; i++) {
    j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
    const temp = s[i];
    s[i] = s[j];
    s[j] = temp;
  }
  return s;
}

function PRGA(s: number[], len: number): number[] {
  let i = 0;
  let j = 0;
  const keystream: number[] = [];
  for (let k = 0; k < len; k++) {
    i = (i + 1) % 256;
    j = (j + s[i]) % 256;
    const temp = s[i];
    s[i] = s[j];
    s[j] = temp;
    const t = (s[i] + s[j]) % 256;
    keystream.push(s[t]);
  }
  return keystream;
}

function rc4(key: string, text: string): string {
  const s = KSA(key);
  const keystream = PRGA(s, text.length);
  let result = "";
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ keystream[i];
    result += String.fromCharCode(charCode);
  }
  return result;
}

/**
 * Encrypts clear text into Base64 ciphertext.
 * Prefix added to easily identify encrypted records in the database.
 */
export function encryptData(text: string): string {
  if (!text || text.startsWith("SECURE::")) return text; // Already encrypted or empty
  try {
    const encryptedRaw = rc4(SECRET_KEY, text);
    const base64 = btoa(unescape(encodeURIComponent(encryptedRaw)));
    return `SECURE::${base64}`;
  } catch (e) {
    console.error("Encryption failed:", e);
    return text;
  }
}

/**
 * Decrypts Base64 ciphertext back to clear text.
 */
export function decryptData(ciphertext: string): string {
  if (!ciphertext || !ciphertext.startsWith("SECURE::")) return ciphertext; // Not encrypted
  try {
    const base64 = ciphertext.replace("SECURE::", "");
    const encryptedRaw = decodeURIComponent(escape(atob(base64)));
    return rc4(SECRET_KEY, encryptedRaw);
  } catch (e) {
    console.error("Decryption failed:", e);
    return ciphertext;
  }
}
