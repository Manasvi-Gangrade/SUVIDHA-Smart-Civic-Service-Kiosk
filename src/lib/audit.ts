/**
 * Cryptographic Hash Chain (Mini-Blockchain) Audit Trail Engine.
 * Ensures all actions performed in the kiosk system (complaints created, status changes)
 * are logged immutably. Tampering with any log breaks the hash chain.
 */

import { isFirebaseConfigured, db as firestore } from "./firebase";
import { setDoc, doc } from "firebase/firestore";

export interface AuditEntry {
  id: string;
  timestamp: number;
  action: string;
  details: string;
  prevHash: string;
  hash: string;
}

const AUDIT_KEY = "suvidha_audit_logs";

async function computeHash(timestamp: number, action: string, details: string, prevHash: string): Promise<string> {
  const dataStr = `${timestamp}-${action}-${details}-${prevHash}`;
  const msgUint8 = new TextEncoder().encode(dataStr);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function getAuditLogs(): AuditEntry[] {
  try {
    const data = localStorage.getItem(AUDIT_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to parse audit logs:", e);
    return [];
  }
}

function saveAuditLogs(logs: AuditEntry[]) {
  localStorage.setItem(AUDIT_KEY, JSON.stringify(logs));
  window.dispatchEvent(new Event("suvidha_audit_sync"));
}

/**
 * Creates and appends a new audit log to the cryptographic chain.
 */
export async function addAuditLog(action: string, details: string): Promise<AuditEntry> {
  const logs = getAuditLogs();
  const prevLog = logs[logs.length - 1];
  const prevHash = prevLog ? prevLog.hash : "GENESIS_BLOCK_HASH";
  const timestamp = Date.now();
  const id = `AUDIT-${Math.floor(Math.random() * 90000 + 10000)}`;

  const hash = await computeHash(timestamp, action, details, prevHash);
  const newLog: AuditEntry = {
    id,
    timestamp,
    action,
    details,
    prevHash,
    hash,
  };

  logs.push(newLog);
  saveAuditLogs(logs);

  // Sync to Firebase if available
  if (isFirebaseConfigured && firestore) {
    try {
      await setDoc(doc(firestore, "audit_logs", id), newLog);
    } catch (e) {
      console.warn("Failed to sync audit log to Cloud Firestore:", e);
    }
  }

  return newLog;
}

/**
 * Validates the entire hash chain starting from genesis block.
 * Detects if any node has been tampered with or replaced.
 */
export async function verifyAuditLogs(): Promise<{ isValid: boolean; tamperedIndex: number | null }> {
  const logs = getAuditLogs();
  for (let i = 0; i < logs.length; i++) {
    const log = logs[i];
    const prevLog = logs[i - 1];
    const expectedPrevHash = prevLog ? prevLog.hash : "GENESIS_BLOCK_HASH";

    // 1. Verify link integrity
    if (log.prevHash !== expectedPrevHash) {
      return { isValid: false, tamperedIndex: i };
    }

    // 2. Verify data hash integrity
    const computed = await computeHash(log.timestamp, log.action, log.details, log.prevHash);
    if (computed !== log.hash) {
      return { isValid: false, tamperedIndex: i };
    }
  }
  return { isValid: true, tamperedIndex: null };
}

/**
 * Helper to simulate an attacker trying to modify records to demonstrate tampering detection.
 */
export function simulateTampering(index: number, newDetails: string) {
  const logs = getAuditLogs();
  if (logs[index]) {
    logs[index].details = newDetails;
    saveAuditLogs(logs);
  }
}

/**
 * Resets/Seeds audit log if empty.
 */
export async function seedAuditLogsIfEmpty() {
  const logs = getAuditLogs();
  if (logs.length === 0) {
    await addAuditLog("SYSTEM_BOOT", "SUVIDHA Civic Kiosk system booted up successfully.");
    await addAuditLog("ENCRYPTION_INIT", "Zero-Knowledge AES-256 Client-Side engine initialized.");
  }
}
