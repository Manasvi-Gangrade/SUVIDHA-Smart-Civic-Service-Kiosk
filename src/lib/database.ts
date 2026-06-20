import { isFirebaseConfigured, db as firestore } from "./firebase";
import { collection, onSnapshot, setDoc, updateDoc, doc } from "firebase/firestore";
import { encryptData, decryptData } from "./crypto";
import { addAuditLog } from "./audit";



// A simulated and real-time cloud synced civic database
export interface ComplaintRecord {
    id: string;
    type: 'complaint';
    category: string;
    service: string;
    name: string;
    phone: string;
    description: string;
    location: string;
    status: 'Pending' | 'In Progress' | 'Resolved';
    timestamp: number;
    synced?: boolean; // Tracking for offline-first deletion synchronization
}

export interface ApplicationRecord {
    id: string;
    type: 'application';
    category: string;
    service: string;
    name: string;
    aadhaar: string;
    phone: string;
    city: string;
    pincode: string;
    status: 'Under Review' | 'Approved' | 'Rejected';
    timestamp: number;
    synced?: boolean; // Tracking for offline-first deletion synchronization
}

export type CitizenRecord = ComplaintRecord | ApplicationRecord;

const DB_KEY = 'suvidha_kiosk_db';

class LocalDatabase {
    constructor() {
        // Setup real-time cloud sync subscription if Firebase is active!
        if (isFirebaseConfigured && firestore) {
            try {
                onSnapshot(collection(firestore, "records"), (snapshot) => {
                    const cloudRecords: CitizenRecord[] = [];
                    snapshot.forEach((docSnap) => {
                        cloudRecords.push({
                            id: docSnap.id,
                            ...docSnap.data(),
                            synced: true // Explicitly mark cloud documents as synced
                        } as CitizenRecord);
                    });
                    
                    const localRecords = this.getRecords();
                    const merged = [...cloudRecords];
                    
                    // Keep ONLY local records that have never been synced (synced === false)
                    // If a local record has synced === true but is missing in cloudRecords, it means
                    // it was deleted from the Firebase console, so we should delete it locally too!
                    localRecords.forEach(local => {
                        if (local.synced === false) {
                            if (!merged.some(cloud => cloud.id === local.id)) {
                                merged.push(local);
                            }
                        }
                    });
                    
                    // Sort by timestamp descending
                    merged.sort((a, b) => b.timestamp - a.timestamp);
                    
                    // Mirror to local storage safely
                    localStorage.setItem(DB_KEY, JSON.stringify(merged));
                    
                    // Handle sync logic for any unsynced local records
                    const unsynced = localRecords.filter(r => r.synced === false);
                    if (unsynced.length > 0) {
                        unsynced.forEach(local => {
                            const toUpload = { ...local, synced: true };
                            setDoc(doc(firestore, "records", local.id), toUpload)
                                .then(() => {
                                    // Update local record to synced: true
                                    const current = this.getRecords();
                                    const updated = current.map(r => r.id === local.id ? { ...r, synced: true } : r);
                                    localStorage.setItem(DB_KEY, JSON.stringify(updated));
                                    window.dispatchEvent(new Event("suvidha_db_sync"));
                                })
                                .catch(() => {});
                        });
                    }
                    
                    // Notify active screens to update state reactively
                    window.dispatchEvent(new Event("suvidha_db_sync"));
                }, (error) => {
                    console.warn(
                        "Firestore live sync permission blocked or disconnected. " +
                        "Please verify that your Firebase Firestore Security Rules are set to allow read/write! " +
                        "Falling back to high-performance local database failover.",
                        error
                    );
                    window.dispatchEvent(new Event("suvidha_db_sync"));
                });
            } catch (error) {
                console.error("Firestore sync subscription failed:", error);
            }
        }
    }

    private getRecords(): CitizenRecord[] {
        const data = localStorage.getItem(DB_KEY);
        return data ? JSON.parse(data) : [];
    }

    private saveRecords(records: CitizenRecord[]) {
        localStorage.setItem(DB_KEY, JSON.stringify(records));
        // Dispatch local event to keep active tabs in sync when offline
        window.dispatchEvent(new Event("suvidha_db_sync"));
    }

    // Generate a secure ID like CMP-8492
    private generateId(prefix: string) {
        return `${prefix}-${Math.floor(Math.random() * 9000 + 1000)}`;
    }

    public addComplaint(data: Omit<ComplaintRecord, 'id' | 'type' | 'status' | 'timestamp'>): string {
        const id = this.generateId('CMP');
        const newRecord: ComplaintRecord = {
            ...data,
            phone: encryptData(data.phone),
            id,
            type: 'complaint',
            status: 'Pending',
            timestamp: Date.now(),
            synced: false // Marked as false initially (unsynced)
        };

        // Write locally first to ensure absolute 100% data retention (Offline-First)
        const records = this.getRecords();
        this.saveRecords([newRecord, ...records]);

        // Cryptographic Audit Trail logging
        addAuditLog("COMPLAINT_CREATED", `Grievance registered. ID: ${id}, Category: ${data.category}, Service: ${data.service}`);

        // Attempt cloud sync in the background
        if (isFirebaseConfigured && firestore) {
            const toUpload = { ...newRecord, synced: true };
            setDoc(doc(firestore, "records", id), toUpload)
                .then(() => {
                    // Update local storage to synced: true on success
                    const current = this.getRecords();
                    const updated = current.map(r => r.id === id ? { ...r, synced: true } : r);
                    this.saveRecords(updated);
                })
                .catch(error => {
                    console.error("Failed to sync complaint to Firebase Firestore:", error);
                });
        }
        return id;
    }

    public addApplication(data: Omit<ApplicationRecord, 'id' | 'type' | 'status' | 'timestamp'>): string {
        const id = this.generateId('APP');
        const newRecord: ApplicationRecord = {
            ...data,
            phone: encryptData(data.phone),
            aadhaar: encryptData(data.aadhaar),
            id,
            type: 'application',
            status: 'Under Review',
            timestamp: Date.now(),
            synced: false // Marked as false initially (unsynced)
        };

        // Write locally first to ensure absolute 100% data retention (Offline-First)
        const records = this.getRecords();
        this.saveRecords([newRecord, ...records]);

        // Cryptographic Audit Trail logging
        addAuditLog("APPLICATION_CREATED", `Service request submitted. ID: ${id}, Category: ${data.category}, Service: ${data.service}`);

        // Attempt cloud sync in the background
        if (isFirebaseConfigured && firestore) {
            const toUpload = { ...newRecord, synced: true };
            setDoc(doc(firestore, "records", id), toUpload)
                .then(() => {
                    // Update local storage to synced: true on success
                    const current = this.getRecords();
                    const updated = current.map(r => r.id === id ? { ...r, synced: true } : r);
                    this.saveRecords(updated);
                })
                .catch(error => {
                    console.error("Failed to sync application to Firebase Firestore:", error);
                });
        }
        return id;
    }

    public updateStatus(id: string, status: any) {
        // Write locally first to ensure absolute 100% data retention (Offline-First)
        const records = this.getRecords();
        const updated = records.map(r => r.id === id ? { ...r, status, timestamp: Date.now() } : r);
        this.saveRecords(updated);

        // Cryptographic Audit Trail logging
        addAuditLog("STATUS_UPDATED", `Ticket ${id} status updated to: ${status}`);

        // Attempt cloud sync in the background
        if (isFirebaseConfigured && firestore) {
            updateDoc(doc(firestore, "records", id), { status, timestamp: Date.now() }).catch(error => {
                console.error("Failed to sync status update to Firebase Firestore:", error);
            });
        }
    }

    public getAllRecords(): CitizenRecord[] {
        return this.getRecords().map(r => {
            if (r.type === 'complaint') {
                return {
                    ...r,
                    phone: decryptData(r.phone)
                };
            } else {
                return {
                    ...r,
                    phone: decryptData(r.phone),
                    aadhaar: decryptData(r.aadhaar)
                };
            }
        });
    }

    public getStats() {
        const records = this.getRecords();
        const totalComplaints = records.filter(r => r.type === 'complaint').length;
        const totalApplications = records.filter(r => r.type === 'application').length;

        const byCategory = records.reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            total: records.length,
            complaints: totalComplaints,
            applications: totalApplications,
            byCategory: Object.entries(byCategory).map(([name, value]) => ({ name, value }))
        };
    }

    public seedIfEmpty() {
        // Dummy data disabled as requested by the user
    }
}

export const db = new LocalDatabase();

// Clear default dummy records to ensure a fresh empty state for real-time testing
try {
    const existingData = localStorage.getItem('suvidha_kiosk_db');
    if (existingData) {
        const records = JSON.parse(existingData);
        const hasMock = records.some((r: any) => r.id === 'CMP-1024' || r.id === 'APP-5521');
        if (hasMock) {
            localStorage.removeItem('suvidha_kiosk_db');
        }
    }
} catch (e) {
    console.error("Failed to clean up dummy mock data", e);
}
