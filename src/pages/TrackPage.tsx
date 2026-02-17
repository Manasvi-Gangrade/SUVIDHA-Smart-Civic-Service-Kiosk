import { useState } from "react";
import { Search, Clock, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const mockResults = [
  { id: "SVD-2026-00142", department: "Electricity", subject: "Faulty meter replacement", status: "In Progress", date: "2026-02-08", sla: "3 days remaining" },
  { id: "SVD-2026-00098", department: "Water Supply", subject: "Pipeline leakage – Sector 12", status: "Resolved", date: "2026-01-25", sla: "Completed" },
  { id: "SVD-2026-00201", department: "Waste Management", subject: "Missed garbage pickup", status: "Pending", date: "2026-02-10", sla: "5 days remaining" },
];

const statusStyles: Record<string, string> = {
  "In Progress": "bg-secondary/10 text-secondary",
  "Resolved": "bg-kiosk-green/10 text-kiosk-green",
  "Pending": "bg-muted text-muted-foreground",
};

const statusIcons: Record<string, any> = {
  "In Progress": Clock,
  "Resolved": CheckCircle2,
  "Pending": AlertCircle,
};

const TrackPage = () => {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-primary py-8">
        <div className="container flex items-center gap-4">
          <div className="rounded-2xl bg-secondary p-4">
            <Search className="h-8 w-8 text-secondary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary-foreground">{t("track.title")}</h1>
            <p className="text-primary-foreground/70">{t("trackStatusDesc")}</p>
          </div>
        </div>
      </div>

      <div className="container max-w-xl py-10">
        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="kiosk-touch-target flex-1 rounded-lg border border-input bg-card px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder={t("track.placeholder")}
          />
          <button
            onClick={() => setSearched(true)}
            className="kiosk-touch-target rounded-lg bg-secondary px-6 py-3 font-semibold text-secondary-foreground transition-all hover:brightness-110"
          >
            {t("track.searchButton")}
          </button>
        </div>

        {searched && (
          <div className="mt-8 space-y-4 animate-slide-up">
            <h2 className="text-lg font-bold text-foreground">Results</h2>
            {mockResults.map((r) => {
              const StatusIcon = statusIcons[r.status];
              return (
                <div key={r.id} className="rounded-lg bg-card kiosk-card-shadow p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-medium text-muted-foreground">{r.department}</div>
                      <div className="mt-1 font-bold text-foreground">{r.subject}</div>
                      <div className="mt-1 text-sm text-muted-foreground">ID: {r.id} • {r.date}</div>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[r.status]}`}>
                      <StatusIcon className="h-3.5 w-3.5" />
                      {r.status}
                    </span>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">{r.sla}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackPage;
