import { useState, useEffect } from "react";
import { Search, Clock, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight, Calendar, User, ShieldCheck, Download, Printer } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { db, CitizenRecord } from "@/lib/database";

const statusStyles: Record<string, string> = {
  "In Progress": "bg-[#FD8008]/20 text-[#FD8008] border border-[#FD8008]/30",
  "Resolved": "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  "Approved": "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  "Pending": "bg-slate-100 text-slate-600 border border-slate-200",
  "Under Review": "bg-[#FD8008]/20 text-[#FD8008] border border-[#FD8008]/30",
  "Rejected": "bg-rose-500/20 text-rose-400 border border-rose-500/30",
};

const TrackPage = () => {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<CitizenRecord[]>([]);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!query.trim()) return;
    
    const all = db.getAllRecords();
    const cleanQuery = query.trim().toUpperCase();
    
    // Search by ID (exact or partial) or exact Phone number
    const filtered = all.filter(r => 
      r.id.toUpperCase().includes(cleanQuery) || 
      r.phone === query.trim() ||
      r.name.toUpperCase().includes(cleanQuery)
    );
    
    setResults(filtered);
    setSearched(true);
  };

  useEffect(() => {
    const handleSync = () => {
      if (searched && query.trim()) {
        const all = db.getAllRecords();
        const cleanQuery = query.trim().toUpperCase();
        const filtered = all.filter(r => 
          r.id.toUpperCase().includes(cleanQuery) || 
          r.phone === query.trim() ||
          r.name.toUpperCase().includes(cleanQuery)
        );
        setResults(filtered);
      }
    };
    window.addEventListener("suvidha_db_sync", handleSync);
    return () => window.removeEventListener("suvidha_db_sync", handleSync);
  }, [searched, query]);

  const getTimelineSteps = (record: CitizenRecord) => {
    const isApp = record.type === "application";
    const dateStr = new Date(record.timestamp).toLocaleDateString("en-IN", { day: '2-digit', month: 'short' });
    
    if (isApp) {
      const isApproved = record.status === "Approved";
      const isRejected = record.status === "Rejected";
      return [
        { label: "Submitted", date: dateStr, done: true },
        { label: "Document Verification", date: record.status !== "Under Review" ? "Completed" : "In Progress", done: record.status !== "Under Review" },
        { label: "Under Review", date: record.status !== "Under Review" ? "Completed" : "In Progress", done: record.status !== "Under Review" },
        { 
          label: isRejected ? "Rejected" : "Approval State", 
          date: isApproved || isRejected ? "Finished" : "Pending", 
          done: isApproved || isRejected,
          error: isRejected
        },
      ];
    } else {
      // Complaint
      const isResolved = record.status === "Resolved";
      const isInProgress = record.status === "In Progress";
      return [
        { label: "Grievance Logged", date: dateStr, done: true },
        { label: "Verification & Assignment", date: isInProgress || isResolved ? "Completed" : "In Progress", done: isInProgress || isResolved },
        { label: "Technician Field Inspection", date: isResolved ? "Completed" : isInProgress ? "Scheduled" : "Pending", done: isResolved },
        { label: "Grievance Resolution", date: isResolved ? "Resolved Successfully" : "Pending", done: isResolved },
      ];
    }
  };

  const handleDownloadReport = (r: CitizenRecord) => {
    const reportText = `========================================
       SUVIDHA CIVIC SERVICE KIOSK
       OFFICIAL STATUS REPORT
========================================
Reference ID    : ${r.id}
Date Logged     : ${new Date(r.timestamp).toLocaleDateString("en-IN")}
Category        : ${r.category}
Service Item    : ${r.service}
Citizen Name    : ${r.name}
Mobile Number   : ${r.phone}
Current Status  : ${r.status}
Report Generated: ${new Date().toLocaleString("en-IN")}

----------------------------------------
Current Timeline Status:
${getTimelineSteps(r).map(step => `- ${step.label} [${step.date}]: ${step.done ? "COMPLETED" : "PENDING"}`).join("\n")}

========================================
This is an official computer-generated
municipal report. No signature required.
========================================`;
    
    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `suvidha_report_${r.id}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-gradient-to-br from-[#0f172a] via-[#192e59] to-[#0f172a] flex flex-col relative overflow-hidden font-sans">
      
      {/* Background Video Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-30 mix-blend-overlay">
          <source src="/videos/14904045_3840_2160_30fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[#192e59]/20" />
      </div>

      <div className="flex-1 container relative z-10 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(25,46,89,0.2)] border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
          
          {/* Header Section */}
          <div className="bg-[#192e59] p-8 text-white relative flex-shrink-0">
            <button 
              onClick={() => navigate(-1)} 
              className="absolute left-6 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="text-center">
              <h1 className="text-3xl font-[900] tracking-tight uppercase leading-none">Track Your Request</h1>
              <p className="text-blue-200 text-xs font-bold mt-2 tracking-[0.3em] uppercase">Real-Time Status Queries</p>
            </div>
          </div>

          <div className="flex-shrink-0 p-6 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-white border-2 border-slate-200 rounded-xl pl-12 pr-6 py-3.5 text-slate-800 text-lg outline-none focus:ring-4 focus:ring-[#FD8008]/10 focus:border-[#FD8008] transition-all font-mono font-bold placeholder:text-slate-300"
                placeholder="Enter Ticket ID (e.g. CMP-1024) or Mobile Number"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              className="w-full sm:w-auto bg-[#FD8008] hover:bg-[#e67300] text-white px-10 py-4 rounded-xl font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#FD8008]/20 uppercase tracking-wider"
            >
              Search
            </button>
          </div>

          <div className="flex-1 p-8 lg:p-12 overflow-y-auto custom-scrollbar bg-white">
            {!searched ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-200 shadow-sm">
                  <Search className="h-10 w-10 text-[#FD8008]" />
                </div>
                <h2 className="text-xl font-black text-[#192e59] uppercase tracking-wide">Enter Reference ID</h2>
                <p className="max-w-xs text-sm text-slate-400 mt-2 font-bold uppercase tracking-wider">Use the ID on your printed kiosk receipt or your registered mobile number to fetch status details.</p>
              </div>
            ) : results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center animate-in zoom-in-95 duration-300">
                <div className="h-24 w-24 bg-rose-50 rounded-full flex items-center justify-center mb-4 border border-rose-100 shadow-sm">
                  <AlertCircle className="h-10 w-10 text-rose-500" />
                </div>
                <h2 className="text-xl font-black text-rose-700 uppercase tracking-wide">No Records Found</h2>
                <p className="max-w-xs text-sm text-slate-400 mt-2 font-bold uppercase tracking-wider">Please double check your Ticket Reference ID or mobile entry and try again.</p>
              </div>
            ) : (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-500">
                {results.map((r) => (
                  <div key={r.id} className="bg-slate-50 border border-slate-200 rounded-[2rem] p-6 lg:p-8 shadow-inner relative overflow-hidden">
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-8 border-b border-slate-200/60">
                      <div className="flex items-center gap-5">
                        <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm">
                          <ShieldCheck className="h-7 w-7 text-[#FD8008]" />
                        </div>
                        <div>
                          <div className="text-xs font-black uppercase tracking-widest text-[#FD8008] mb-1">{r.category}</div>
                          <h3 className="text-xl font-black tracking-tight text-[#192e59] leading-none mb-2">{r.service}</h3>
                          <div className="flex items-center gap-3 text-slate-400 text-xs font-bold uppercase tracking-wider">
                            <span>Logged for: {r.name}</span>
                            <span className="h-1 w-1 bg-slate-200 rounded-full" />
                            <span className="font-mono text-slate-600 font-black">{r.id}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col md:items-end gap-2 shrink-0">
                        <span className={`px-5 py-2 rounded-full text-xs font-black tracking-widest uppercase ${statusStyles[r.status]}`}>
                          {r.status}
                        </span>
                        <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                          Last Updated: {new Date(r.timestamp).toLocaleDateString("en-IN")}
                        </div>
                      </div>
                    </div>

                    {/* Timeline Tracker */}
                    <div className="relative pl-4">
                      <div className="absolute left-10 top-0 bottom-0 w-1 bg-slate-200 -z-10" />
                      <div className="space-y-8">
                        {getTimelineSteps(r).map((step, idx) => (
                          <div key={idx} className="flex items-center gap-6">
                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center border-4 border-slate-50 shadow-md transition-all duration-500
                              ${step.done ? "bg-[#FD8008] text-white scale-110 shadow-[#FD8008]/20" : "bg-white text-slate-300 border-slate-100"}`}>
                              {step.done ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                            </div>
                            <div>
                              <p className={`text-base font-black tracking-tight ${step.done ? "text-slate-800" : "text-slate-400"}`}>{step.label}</p>
                              <p className="text-xs font-bold text-slate-400">{step.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-200/60 flex flex-wrap gap-4 justify-end">
                      <button 
                        onClick={() => window.print()}
                        className="bg-white hover:bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 border border-slate-200 transition-all text-xs shadow-sm hover:scale-105 active:scale-95 duration-200"
                      >
                        <Printer className="h-4 w-4 text-[#FD8008]" /> Print Status
                      </button>
                      <button 
                        onClick={() => handleDownloadReport(r)}
                        className="bg-white hover:bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 border border-slate-200 transition-all text-xs shadow-sm hover:scale-105 active:scale-95 duration-200"
                      >
                        <Download className="h-4 w-4 text-[#FD8008]" /> Download Report
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Accent */}
          <div className="h-2 bg-gradient-to-r from-slate-100 via-[#192e59]/20 to-slate-100 flex-shrink-0"></div>
        </div>
      </div>
    </div>
  );
};

export default TrackPage;
