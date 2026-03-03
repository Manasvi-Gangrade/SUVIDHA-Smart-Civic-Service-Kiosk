import { useState, useEffect } from "react";
import { ClipboardList, Clock, CheckCircle2, AlertCircle, FileText, MessageSquarePlus, Ticket, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";

const requests = [
  {
    id: "SVD-2026-00142",
    dept: "Electricity",
    subject: "Faulty meter replacement",
    status: "In Progress",
    date: "2026-02-08",
    assignedTo: "Officer Ramesh K.",
    timeline: [
      { step: "Submitted", done: true, date: "Feb 8, 2026" },
      { step: "Assigned", done: true, date: "Feb 9, 2026" },
      { step: "In Progress", done: true, date: "Feb 10, 2026" },
      { step: "Resolved", done: false, date: "Expected: Feb 14" },
    ],
  },
  {
    id: "SVD-2026-00201",
    dept: "Waste Management",
    subject: "Missed garbage pickup",
    status: "Pending",
    date: "2026-02-10",
    assignedTo: "Unassigned",
    timeline: [
      { step: "Submitted", done: true, date: "Feb 10, 2026" },
      { step: "Assigned", done: false, date: "Pending" },
      { step: "In Progress", done: false, date: "—" },
      { step: "Resolved", done: false, date: "—" },
    ],
  },
  {
    id: "SVD-2026-00098",
    dept: "Water Supply",
    subject: "Pipeline leakage – Sector 12",
    status: "Resolved",
    date: "2026-01-25",
    assignedTo: "Officer Priya S.",
    timeline: [
      { step: "Submitted", done: true, date: "Jan 25, 2026" },
      { step: "Assigned", done: true, date: "Jan 26, 2026" },
      { step: "In Progress", done: true, date: "Jan 27, 2026" },
      { step: "Resolved", done: true, date: "Jan 29, 2026" },
    ],
  },
  {
    id: "SVD-2026-00067",
    dept: "Gas Distribution",
    subject: "New LPG connection",
    status: "Resolved",
    date: "2026-01-15",
    assignedTo: "Officer Sunil M.",
    timeline: [
      { step: "Submitted", done: true, date: "Jan 15, 2026" },
      { step: "Assigned", done: true, date: "Jan 16, 2026" },
      { step: "In Progress", done: true, date: "Jan 17, 2026" },
      { step: "Resolved", done: true, date: "Jan 18, 2026" },
    ],
  },
];

const statusColor: Record<string, string> = {
  "In Progress": "bg-secondary/10 text-secondary border border-secondary/20",
  Resolved: "bg-kiosk-green/10 text-kiosk-green border border-kiosk-green/20",
  Pending: "bg-muted text-muted-foreground border border-border",
};

const PIE_DATA = [
  { name: "Resolved", value: 2, color: "hsl(145 55% 42%)" },
  { name: "In Progress", value: 1, color: "hsl(33 100% 50%)" },
  { name: "Pending", value: 1, color: "hsl(220 10% 46%)" },
];

const BAR_DATA = [
  { dept: "Electricity", complaints: 14 },
  { dept: "Water", complaints: 9 },
  { dept: "Waste", complaints: 7 },
  { dept: "Gas", complaints: 5 },
  { dept: "Municipal", complaints: 4 },
  { dept: "Property", complaints: 2 },
];

const activeToken = { number: "E-105", status: "Waiting", dept: "Electricity" };

const DashboardPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Dynamic simulation for the dashboard
  const [liveRequests, setLiveRequests] = useState(requests);
  const [liveTotal, setLiveTotal] = useState(requests.length + 1200);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTotal(prev => prev + Math.floor(Math.random() * 3));
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { label: "Total City Requests", value: liveTotal, icon: FileText, color: "text-foreground", bg: "bg-muted" },
    { label: "My In Progress", value: liveRequests.filter((r) => r.status === "In Progress").length, icon: Clock, color: "text-secondary", bg: "bg-secondary/10" },
    { label: "My Resolved", value: liveRequests.filter((r) => r.status === "Resolved").length, icon: CheckCircle2, color: "text-kiosk-green", bg: "bg-kiosk-green/10" },
    { label: "My Pending", value: liveRequests.filter((r) => r.status === "Pending").length, icon: AlertCircle, color: "text-muted-foreground", bg: "bg-muted" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
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
            className="kiosk-touch-target hidden sm:inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-3 font-semibold text-secondary-foreground transition-all hover:brightness-110"
          >
            <MessageSquarePlus className="h-5 w-5" />
            {t("registerComplaint")}
          </button>
        </div>
      </div>

      <div className="container py-10 space-y-10">

        {/* Active Token Banner */}
        {activeToken && (
          <div className="rounded-2xl border border-secondary/20 bg-secondary/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-secondary/10 p-3">
                <Ticket className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Active Token ({activeToken.dept})</div>
                <div className="text-3xl font-black text-foreground tracking-widest">{activeToken.number}</div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Status</div>
                <div className="font-bold text-secondary animate-pulse">{activeToken.status}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Est. Wait</div>
                <div className="font-bold text-foreground">~12 mins</div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className={`rounded-xl border border-border ${s.bg} p-5 text-center kiosk-card-shadow`}>
              <div className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-card`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div className="text-3xl font-black text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Pie Chart */}
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card kiosk-card-shadow p-6">
            <h3 className="font-bold text-foreground mb-1">Status Breakdown</h3>
            <p className="text-xs text-muted-foreground mb-4">My complaints by status</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                  {PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} complaints`, name]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-col gap-1.5">
              {PIE_DATA.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  <span className="text-muted-foreground">{d.name}</span>
                  <span className="ml-auto font-semibold text-foreground">{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart */}
          <div className="lg:col-span-3 rounded-2xl border border-border bg-card kiosk-card-shadow p-6">
            <h3 className="font-bold text-foreground mb-1">Complaints by Department</h3>
            <p className="text-xs text-muted-foreground mb-4">City-wide data this month</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={BAR_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="dept" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.75rem",
                    fontSize: "12px"
                  }}
                />
                <Bar dataKey="complaints" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Request List with Expandable Timeline */}
        <div>
          <h2 className="mb-4 text-lg font-bold text-foreground">{t("dashboard.recent")}</h2>
          <div className="space-y-3">
            {requests.map((r) => {
              const isOpen = expandedId === r.id;
              return (
                <div key={r.id} className="rounded-xl border border-border bg-card kiosk-card-shadow overflow-hidden">
                  {/* Row Header */}
                  <button
                    onClick={() => setExpandedId(isOpen ? null : r.id)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
                  >
                    <div>
                      <div className="text-xs font-medium text-muted-foreground">{r.dept}</div>
                      <div className="font-semibold text-foreground mt-0.5">{r.subject}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {t("dashboard.id")}: {r.id} · {r.date}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[r.status]}`}>
                        {r.status}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Timeline */}
                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-border bg-muted/20">
                      <div className="mt-4 text-xs text-muted-foreground mb-3">
                        Assigned to: <span className="font-semibold text-foreground">{r.assignedTo}</span>
                      </div>
                      <div className="flex items-start gap-0">
                        {r.timeline.map((step, idx) => (
                          <div key={step.step} className="flex-1 flex flex-col items-center">
                            {/* Line connector */}
                            <div className="flex items-center w-full">
                              {idx > 0 && (
                                <div className={`h-0.5 flex-1 ${r.timeline[idx - 1].done ? "bg-kiosk-green" : "bg-border"}`} />
                              )}
                              <div
                                className={`h-5 w-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${step.done
                                  ? "bg-kiosk-green border-kiosk-green"
                                  : idx === r.timeline.findIndex((s) => !s.done)
                                    ? "border-secondary bg-secondary/10 animate-pulse"
                                    : "border-border bg-background"
                                  }`}
                              >
                                {step.done && <span className="text-white text-[9px]">✓</span>}
                              </div>
                              {idx < r.timeline.length - 1 && (
                                <div className={`h-0.5 flex-1 ${step.done ? "bg-kiosk-green" : "bg-border"}`} />
                              )}
                            </div>
                            <div className="mt-2 text-center">
                              <div className={`text-[10px] font-semibold ${step.done ? "text-kiosk-green" : "text-muted-foreground"}`}>
                                {step.step}
                              </div>
                              <div className="text-[9px] text-muted-foreground mt-0.5">{step.date}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
