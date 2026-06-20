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
    synced?: boolean;
    attachments?: { name: string; timestamp: number }[];
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
    synced?: boolean;
}

export type CitizenRecord = ComplaintRecord | ApplicationRecord;

const DB_KEY = 'suvidha_kiosk_db';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const mapFrontendDeptToBackend = (dept: string): string => {
    const d = dept.toLowerCase();
    if (d.includes('elect')) return 'electricity';
    if (d.includes('gas')) return 'gas';
    return 'municipal';
};

const mapBackendApp = (app: any): ApplicationRecord => ({
    id: app.applicationId,
    type: 'application',
    category: app.department,
    service: app.serviceType,
    name: app.formData?.fullName || app.citizenName || 'Citizen',
    phone: app.formData?.phone || '',
    aadhaar: app.formData?.aadhaar || '',
    city: app.formData?.city || '',
    pincode: app.formData?.pincode || '',
    status: app.status === 'approved' ? 'Approved' : app.status === 'rejected' ? 'Rejected' : 'Under Review',
    timestamp: new Date(app.createdAt || app.timestamp).getTime(),
    synced: true
});

const mapBackendGrievance = (g: any): ComplaintRecord => ({
    id: g.complaintId,
    type: 'complaint',
    category: g.department,
    service: g.category,
    name: g.citizenName || 'Citizen',
    phone: g.citizenPhone || '',
    description: g.description,
    location: g.location || 'Not provided',
    status: g.status === 'resolved' ? 'Resolved' : g.status === 'in_progress' ? 'In Progress' : 'Pending',
    timestamp: new Date(g.createdAt || g.timestamp).getTime(),
    synced: true
});

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
                            synced: true
                        } as CitizenRecord);
                    });
                    
                    const localRecords = this.getRecords();
                    const merged = [...cloudRecords];
                    
                    localRecords.forEach(local => {
                        if (local.synced === false) {
                            if (!merged.some(cloud => cloud.id === local.id)) {
                                merged.push(local);
                            }
                        }
                    });
                    
                    merged.sort((a, b) => b.timestamp - a.timestamp);
                    localStorage.setItem(DB_KEY, JSON.stringify(merged));
                    
                    const unsynced = localRecords.filter(r => r.synced === false);
                    if (unsynced.length > 0) {
                        unsynced.forEach(local => {
                            const toUpload = { ...local, synced: true };
                            setDoc(doc(firestore, "records", local.id), toUpload)
                                .then(() => {
                                    const current = this.getRecords();
                                    const updated = current.map(r => r.id === local.id ? { ...r, synced: true } : r);
                                    localStorage.setItem(DB_KEY, JSON.stringify(updated));
                                    window.dispatchEvent(new Event("suvidha_db_sync"));
                                })
                                .catch(() => {});
                        });
                    }
                    
                    window.dispatchEvent(new Event("suvidha_db_sync"));
                }, (error) => {
                    console.warn("Firestore live sync disconnected.", error);
                    window.dispatchEvent(new Event("suvidha_db_sync"));
                });
            } catch (error) {
                console.error("Firestore sync subscription failed:", error);
            }
        }

        // Sync with local Express backend periodically
        this.syncWithBackend();
        setInterval(() => this.syncWithBackend(), 10000);
    }

    private getRecords(): CitizenRecord[] {
        const data = localStorage.getItem(DB_KEY);
        return data ? JSON.parse(data) : [];
    }

    private saveRecords(records: CitizenRecord[]) {
        localStorage.setItem(DB_KEY, JSON.stringify(records));
        window.dispatchEvent(new Event("suvidha_db_sync"));
    }

    private generateId(prefix: string) {
        return `${prefix}-${Math.floor(Math.random() * 9000 + 1000)}`;
    }

    private async syncWithBackend() {
        const token = localStorage.getItem('smartcity_token');
        if (!token) return;

        try {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };

            const appsRes = await fetch(`${API_URL}/api/civic/applications`, { headers });
            let apps: any[] = [];
            if (appsRes.ok) {
                const body = await appsRes.json();
                if (body.success && Array.isArray(body.data)) apps = body.data;
            }

            const grievancesRes = await fetch(`${API_URL}/api/civic/grievances`, { headers });
            let grievances: any[] = [];
            if (grievancesRes.ok) {
                const body = await grievancesRes.json();
                if (body.success && Array.isArray(body.data)) grievances = body.data;
            }

            if (apps.length > 0 || grievances.length > 0) {
                const mappedApps = apps.map(mapBackendApp);
                const mappedGrievances = grievances.map(mapBackendGrievance);
                
                const localRecords = this.getRecords();
                const mergedMap = new Map<string, CitizenRecord>();
                
                localRecords.forEach(r => mergedMap.set(r.id, r));
                mappedApps.forEach(r => mergedMap.set(r.id, r));
                mappedGrievances.forEach(r => mergedMap.set(r.id, r));

                const sorted = Array.from(mergedMap.values()).sort((a, b) => b.timestamp - a.timestamp);
                localStorage.setItem(DB_KEY, JSON.stringify(sorted));
                window.dispatchEvent(new Event("suvidha_db_sync"));
            }
        } catch (error) {
            // Quietly catch offline connection failures
        }
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
            synced: false
        };

        const records = this.getRecords();
        this.saveRecords([newRecord, ...records]);
        addAuditLog("COMPLAINT_CREATED", `Grievance registered. ID: ${id}, Category: ${data.category}, Service: ${data.service}`);

        // 1. Firebase Cloud Sync
        if (isFirebaseConfigured && firestore) {
            setDoc(doc(firestore, "records", id), { ...newRecord, synced: true })
                .then(() => {
                    const current = this.getRecords();
                    this.saveRecords(current.map(r => r.id === id ? { ...r, synced: true } : r));
                })
                .catch(() => {});
        }

        // 2. Express Backend Sync
        const token = localStorage.getItem('smartcity_token');
        if (token) {
            fetch(`${API_URL}/api/civic/grievances`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    complaintId: id,
                    department: mapFrontendDeptToBackend(data.category),
                    category: data.service,
                    description: data.description,
                    priority: 'medium'
                })
            }).catch(() => {});
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
            synced: false
        };

        const records = this.getRecords();
        this.saveRecords([newRecord, ...records]);
        addAuditLog("APPLICATION_CREATED", `Service request submitted. ID: ${id}, Category: ${data.category}, Service: ${data.service}`);

        // 1. Firebase Cloud Sync
        if (isFirebaseConfigured && firestore) {
            setDoc(doc(firestore, "records", id), { ...newRecord, synced: true })
                .then(() => {
                    const current = this.getRecords();
                    this.saveRecords(current.map(r => r.id === id ? { ...r, synced: true } : r));
                })
                .catch(() => {});
        }

        // 2. Express Backend Sync
        const token = localStorage.getItem('smartcity_token');
        if (token) {
            fetch(`${API_URL}/api/civic/applications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    applicationId: id,
                    department: mapFrontendDeptToBackend(data.category),
                    serviceType: data.service,
                    formData: {
                        fullName: data.name,
                        phone: data.phone,
                        aadhaar: data.aadhaar,
                        city: data.city,
                        pincode: data.pincode
                    }
                })
            }).catch(() => {});
        }

        return id;
    }

    public updateStatus(id: string, status: any) {
        const records = this.getRecords();
        const updated = records.map(r => r.id === id ? { ...r, status, timestamp: Date.now() } : r);
        this.saveRecords(updated);
        addAuditLog("STATUS_UPDATED", `Ticket ${id} status updated to: ${status}`);

        // 1. Firebase Cloud Sync
        if (isFirebaseConfigured && firestore) {
            updateDoc(doc(firestore, "records", id), { status, timestamp: Date.now() }).catch(() => {});
        }

        // 2. Express Backend Sync
        fetch(`${API_URL}/api/civic/admin/update-status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-admin-key': 'smartcity-admin-key'
            },
            body: JSON.stringify({
                itemType: id.startsWith('CMP') ? 'grievance' : 'application',
                itemId: id,
                status: status === 'Approved' ? 'approved' : status === 'Rejected' ? 'rejected' : status === 'Resolved' ? 'resolved' : status === 'In Progress' ? 'in_progress' : 'submitted',
                remarks: 'Status updated from kiosk panel'
            })
        }).catch(() => {});
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

    public seedIfEmpty() {}
}

export const db = new LocalDatabase();

export async function loginOrSignupToBackend(aadhaar: string, mobile: string, name: string) {
    try {
        const loginRes = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ method: 'aadhaar', value: aadhaar })
        });
        
        if (loginRes.ok) {
            const data = await loginRes.json();
            if (data.success && data.token) {
                localStorage.setItem('smartcity_token', data.token);
                localStorage.setItem('smartcity_citizen', JSON.stringify(data.citizen));
                return;
            }
        }
        
        const signupRes = await fetch(`${API_URL}/api/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullName: name || 'Citizen',
                aadhaar: aadhaar.padStart(12, '0'),
                mobile: mobile.padStart(10, '0'),
                accountId: `ACC-MH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                email: `${(name || 'citizen').toLowerCase().replace(/\s+/g, '')}@suvidha.gov.in`
            })
        });
        
        if (signupRes.ok) {
            const retryRes = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ method: 'aadhaar', value: aadhaar })
            });
            if (retryRes.ok) {
                const data = await retryRes.json();
                if (data.success && data.token) {
                    localStorage.setItem('smartcity_token', data.token);
                    localStorage.setItem('smartcity_citizen', JSON.stringify(data.citizen));
                }
            }
        }
    } catch (e) {
        // Quietly fail for offline mode
    }
}

try {
    const existingData = localStorage.getItem('suvidha_kiosk_db');
    if (existingData) {
        const records = JSON.parse(existingData);
        const hasMock = records.some((r: any) => r.id === 'CMP-1024' || r.id === 'APP-5521');
        if (hasMock) {
            localStorage.removeItem('suvidha_kiosk_db');
        }
    }
} catch (e) {}
