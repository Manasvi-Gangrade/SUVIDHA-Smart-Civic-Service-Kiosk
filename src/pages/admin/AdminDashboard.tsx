import { FileText, Clock, CheckCircle2, AlertCircle, FilePlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { db, CitizenRecord } from "@/lib/database";
import { useEffect, useState } from "react";

const AdminDashboard = () => {
    const { t } = useTranslation();
    const [statsData, setStatsData] = useState({ total: 0, complaints: 0, applications: 0, byCategory: [] as any[] });
    const [recentRecords, setRecentRecords] = useState<CitizenRecord[]>([]);

    useEffect(() => {
        setStatsData(db.getStats());
        setRecentRecords(db.getAllRecords().slice(0, 5)); // Last 5
    }, []);

    const stats = [
        { label: t("admin.totalComplaints"), value: statsData.complaints, icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Total Applications", value: statsData.applications, icon: FilePlus, color: "text-purple-500", bg: "bg-purple-500/10" },
        { label: t("admin.resolved"), value: Math.floor(statsData.complaints * 0.4), icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
        { label: t("admin.critical"), value: Math.floor(statsData.complaints * 0.1), icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t("admin.dashboardTitle")}</h1>
                <p className="text-muted-foreground">{t("admin.dashboardWelcome")}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="rounded-xl border bg-card p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-full ${stat.bg}`}>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                <h3 className="text-2xl font-bold">{stat.value}</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="rounded-xl border bg-card shadow-sm">
                <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold">{t("admin.recentActivity")}</h3>
                </div>
                <div className="p-6">
                    <div className="space-y-6">
                        {recentRecords.map((record) => (
                            <div key={record.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                                <div>
                                    <p className="font-medium text-foreground">{record.type === 'complaint' ? "New Complaint Logged" : "New Application Submitted"}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {record.name} • {record.category} • {record.id}
                                    </p>
                                </div>
                                <span className={`text-xs font-semibold px-2 py-1 flex items-center gap-1 rounded-full ${record.type === 'application' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {record.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
