import { useState } from "react";
import { Search, Clock, CheckCircle2, AlertCircle, ArrowRight, Calendar, User, ShieldCheck, Download, Printer } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const mockResults = [
  { 
    id: "SVD-2026-00142", 
    department: "Electricity", 
    subject: "Faulty meter replacement", 
    status: "In Progress", 
    date: "2026-02-08", 
    sla: "Expected Resolution: Feb 15, 2026",
    tat: "TAT: 7 Days",
    steps: [
      { label: "Submitted", date: "Feb 08", done: true },
      { label: "Verification", date: "Feb 09", done: true },
      { label: "Technician Assigned", date: "Feb 10", done: true },
      { label: "Site Visit", date: "Feb 12", done: false },
      { label: "Resolution", date: "Pending", done: false },
    ]
  },
  { 
    id: "SVD-2026-00098", 
    department: "Water Supply", 
    subject: "Pipeline leakage – Sector 12", 
    status: "Resolved", 
    date: "2026-01-25", 
    sla: "Completed on Jan 28, 2026",
    tat: "TAT: 3 Days",
    steps: [
      { label: "Submitted", date: "Jan 25", done: true },
      { label: "Assessment", date: "Jan 26", done: true },
      { label: "Repair Done", date: "Jan 27", done: true },
      { label: "Verified", date: "Jan 28", done: true },
    ]
  }
];

const statusStyles: Record<string, string> = {
  "In Progress": "bg-blue-500 text-white",
  "Resolved": "bg-green-500 text-white",
  "Pending": "bg-amber-500 text-white",
};

const TrackPage = () => {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) setSearched(true);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pb-20">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#1e2e50] py-12">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="rounded-3xl bg-primary p-5 shadow-xl shadow-primary/20">
              <Search className="h-10 w-10 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight">Track Your Request</h1>
              <p className="text-white/60 font-medium mt-1">Real-time status of your civic applications & complaints</p>
            </div>
          </div>

          <div className="flex w-full md:w-auto gap-3">
             <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 md:w-80 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-lg outline-none focus:ring-4 focus:ring-primary/20 transition-all font-mono"
              placeholder="Enter Ticket ID (e.g. SVD-001)"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-black text-lg hover:brightness-110 transition-all shadow-xl shadow-primary/20"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="container max-w-5xl py-12">
        {!searched ? (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
             <div className="h-32 w-32 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <Search className="h-16 w-16" />
             </div>
             <h2 className="text-2xl font-bold">Search results will appear here</h2>
             <p className="max-w-xs mt-2 font-medium">Use your Application Reference ID or Mobile Number to track status.</p>
          </div>
        ) : (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {mockResults.map((r) => (
              <div key={r.id} className="bg-[#1e2e50]/40 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden p-8 md:p-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-10 border-b border-white/5">
                   <div className="flex items-center gap-6">
                      <div className="h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                         <ShieldCheck className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs font-black uppercase tracking-widest text-primary mb-1">{r.department} Department</div>
                        <h3 className="text-2xl font-black tracking-tight">{r.subject}</h3>
                        <div className="flex items-center gap-4 mt-2 text-white/50 font-medium">
                           <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {r.date}</span>
                           <span className="h-1 w-1 bg-white/20 rounded-full" />
                           <span className="font-mono text-white/70">ID: {r.id}</span>
                        </div>
                      </div>
                   </div>
                   <div className="flex flex-col items-end gap-3">
                      <span className={`px-6 py-2.5 rounded-full text-sm font-black tracking-wide ${statusStyles[r.status]}`}>
                        {r.status.toUpperCase()}
                      </span>
                      <div className="text-xs font-bold text-white/40 uppercase tracking-tighter">{r.tat}</div>
                   </div>
                </div>

                {/* SLA Banner */}
                <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 flex items-center gap-4 mb-12">
                   <Clock className="h-8 w-8 text-primary" />
                   <div>
                      <h4 className="font-black text-primary uppercase text-xs tracking-widest">SLA TRACKER</h4>
                      <p className="text-lg font-bold text-white/90">{r.sla}</p>
                   </div>
                </div>

                {/* Timeline */}
                <div className="relative">
                   <div className="absolute left-8 top-0 bottom-0 w-1 bg-white/5 -z-10" />
                   <div className="space-y-10">
                      {r.steps.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-8">
                           <div className={`h-16 w-16 rounded-2xl flex items-center justify-center border-4 border-[#0f172a] shadow-lg transition-all duration-500
                              ${step.done ? "bg-primary text-primary-foreground scale-110" : "bg-white/5 text-white/20"}`}>
                              {step.done ? <CheckCircle2 className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
                           </div>
                           <div>
                              <p className={`text-lg font-black tracking-tight ${step.done ? "text-white" : "text-white/30"}`}>{step.label}</p>
                              <p className="text-sm font-bold text-white/40">{step.date}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="mt-16 pt-10 border-t border-white/5 flex flex-wrap gap-4">
                   <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all border border-white/10">
                      <Printer className="h-5 w-5" /> Print Status
                   </button>
                   <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all border border-white/10">
                      <Download className="h-5 w-5" /> Download Report
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Back Button */}
      <button
        onClick={() => navigate("/")}
        className="kiosk-touch-target fixed bottom-10 left-10 z-50 flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 px-8 py-4 rounded-3xl text-lg font-black text-white transition-all shadow-2xl"
      >
        <ArrowRight className="w-6 h-6 rotate-180" />
        BACK HOME
      </button>
    </div>
  );
};

export default TrackPage;
