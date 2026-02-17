import { ClipboardList, Clock, CheckCircle2, AlertCircle, FileText, MessageSquarePlus, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const requests = [
  { id: "SVD-2026-00142", dept: "Electricity", subject: "Faulty meter replacement", status: "In Progress", date: "2026-02-08" },
  { id: "SVD-2026-00201", dept: "Waste Management", subject: "Missed garbage pickup", status: "Pending", date: "2026-02-10" },
  { id: "SVD-2026-00098", dept: "Water Supply", subject: "Pipeline leakage – Sector 12", status: "Resolved", date: "2026-01-25" },
  { id: "SVD-2026-00067", dept: "Gas Distribution", subject: "New LPG connection", status: "Resolved", date: "2026-01-15" },
];

const statusColor: Record<string, string> = {
  "In Progress": "bg-secondary/10 text-secondary",
  Resolved: "bg-kiosk-green/10 text-kiosk-green",
  Pending: "bg-muted text-muted-foreground",
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const stats = [
    { label: t("dashboard.total"), value: requests.length, icon: FileText, color: "text-foreground" },
    { label: t("dashboard.pending"), value: requests.filter(r => r.status === "In Progress").length, icon: Clock, color: "text-secondary" },
    { label: t("dashboard.resolved"), value: requests.filter(r => r.status === "Resolved").length, icon: CheckCircle2, color: "text-kiosk-green" },
    { label: t("dashboard.pending"), value: requests.filter(r => r.status === "Pending").length, icon: AlertCircle, color: "text-muted-foreground" },
  ];

  // Mock Active Token (In a real app, this would come from context/api)
  const activeToken = { number: "E-105", status: "Waiting", dept: "Electricity" };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="border-b border-border bg-primary py-8">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-secondary p-4">
              <ClipboardList className="h-8 w-8 text-secondary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-foreground">{t("dashboard.title")}</h1>
              <p className="text-primary-foreground/70">{t("dashboardDesc")}</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/complaint")}
            className="kiosk-touch-target hidden sm:inline-flex items-center gap-2 rounded-lg bg-secondary px-5 py-3 font-semibold text-secondary-foreground transition-all hover:brightness-110"
          >
            <MessageSquarePlus className="h-5 w-5" />
            {t("registerComplaint")}
          </button>
        </div>
      </div>

      <div className="container py-10">

        {/* Active Token Banner */}
        {activeToken && (
          <div className="mb-10 rounded-xl border border-secondary/20 bg-secondary/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-secondary/10 p-3">
                <Ticket className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Active Token ({activeToken.dept})</div>
                <div className="text-2xl font-bold text-foreground">{activeToken.number}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Status</div>
                <div className="font-semibold text-secondary animate-pulse">{activeToken.status}</div>
              </div>
              <button className="text-sm font-medium text-primary hover:underline">View Details</button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-10">
          {stats.map((s) => (
            <div key={s.label} className="rounded-lg bg-card kiosk-card-shadow p-5 text-center">
              <s.icon className={`mx-auto h-6 w-6 ${s.color}`} />
              <div className="mt-2 text-2xl font-bold text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Request list */}
        <h2 className="mb-4 text-lg font-bold text-foreground">{t("dashboard.recent")}</h2>
        <div className="space-y-3">
          {requests.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded-lg bg-card kiosk-card-shadow p-5">
              <div>
                <div className="text-xs font-medium text-muted-foreground">{r.dept}</div>
                <div className="font-semibold text-foreground">{r.subject}</div>
                <div className="text-xs text-muted-foreground mt-1">{t("dashboard.id")}: {r.id} • {r.date}</div>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[r.status]}`}>
                {r.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
