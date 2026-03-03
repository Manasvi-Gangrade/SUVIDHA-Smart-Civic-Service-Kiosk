// A simulated backend using localStorage
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
}

export type CitizenRecord = ComplaintRecord | ApplicationRecord;

const DB_KEY = 'suvidha_kiosk_db';

class LocalDatabase {
    private getRecords(): CitizenRecord[] {
        const data = localStorage.getItem(DB_KEY);
        return data ? JSON.parse(data) : [];
    }

    private saveRecords(records: CitizenRecord[]) {
        localStorage.setItem(DB_KEY, JSON.stringify(records));
    }

    // Generate a random ID like CMP-8492
    private generateId(prefix: string) {
        return `${prefix}-${Math.floor(Math.random() * 9000 + 1000)}`;
    }

    public addComplaint(data: Omit<ComplaintRecord, 'id' | 'type' | 'status' | 'timestamp'>): string {
        const records = this.getRecords();
        const newRecord: ComplaintRecord = {
            ...data,
            id: this.generateId('CMP'),
            type: 'complaint',
            status: 'Pending',
            timestamp: Date.now()
        };
        this.saveRecords([newRecord, ...records]);
        return newRecord.id;
    }

    public addApplication(data: Omit<ApplicationRecord, 'id' | 'type' | 'status' | 'timestamp'>): string {
        const records = this.getRecords();
        const newRecord: ApplicationRecord = {
            ...data,
            id: this.generateId('APP'),
            type: 'application',
            status: 'Under Review',
            timestamp: Date.now()
        };
        this.saveRecords([newRecord, ...records]);
        return newRecord.id;
    }

    public getAllRecords(): CitizenRecord[] {
        return this.getRecords();
    }

    public getStats() {
        const records = this.getRecords();
        const totalComplaints = records.filter(r => r.type === 'complaint').length;
        const totalApplications = records.filter(r => r.type === 'application').length;

        // Group by category for charts
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

    // Seed with mock data for the hackathon demo if empty
    public seedIfEmpty() {
        if (this.getRecords().length === 0) {
            const mockData: CitizenRecord[] = [
                { id: 'CMP-1024', type: 'complaint', category: 'Electricity', service: 'Power Outage', name: 'Rahul S.', phone: '9876543210', description: 'No power since morning', location: 'Sector 4', status: 'In Progress', timestamp: Date.now() - 86400000 },
                { id: 'APP-5521', type: 'application', category: 'Water', service: 'New Connection', name: 'Priya K.', aadhaar: 'XXXX-XXXX-1234', phone: '9123456780', city: 'New Delhi', pincode: '110001', status: 'Approved', timestamp: Date.now() - 172800000 },
                { id: 'CMP-8812', type: 'complaint', category: 'Waste', service: 'Missed Pickup', name: 'Amit M.', phone: '9001122334', description: 'Garbage not collected for 3 days', location: 'Vasant Vihar', status: 'Pending', timestamp: Date.now() - 3600000 },
                { id: 'CMP-9921', type: 'complaint', category: 'Municipal', service: 'Pothole', name: 'Sneha P.', phone: '9988776655', description: 'Huge pothole on main road', location: 'Lajpat Nagar', status: 'Resolved', timestamp: Date.now() - 400000000 },
                { id: 'APP-1102', type: 'application', category: 'Property', service: 'Tax Registration', name: 'Rohan D.', aadhaar: 'XXXX-XXXX-9988', phone: '9876512345', city: 'New Delhi', pincode: '110015', status: 'Under Review', timestamp: Date.now() - 5000000 }
            ];
            this.saveRecords(mockData);
        }
    }
}

export const db = new LocalDatabase();
// Seed immediately
db.seedIfEmpty();
