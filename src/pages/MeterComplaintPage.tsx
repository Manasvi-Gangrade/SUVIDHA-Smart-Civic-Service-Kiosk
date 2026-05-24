import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Gauge, ChevronRight, Loader2, ArrowLeft, Search,
  CheckCircle2, QrCode, AlertTriangle, Wrench, MoveHorizontal,
  Clock, User, ShieldCheck, Zap
} from "lucide-react";
import { db } from "@/lib/database";
import Receipt from "@/components/Receipt";

// ─── Types ────────────────────────────────────────────────────────────────────
type SubCategory = "malfunction" | "shifting" | null;
type Step = 1 | 2 | 3 | 4;

// ─── Severity config for Light Theme ──────────────────────────────────────────
const severityMap: Record<string, { label: string; color: string; sla: string; team: string; priority: number }> = {
  "Meter running fast / slow":     { label: "High",   color: "text-rose-700 bg-rose-50 border-rose-100",    sla: "24 Hours",   team: "Billing Meter Team",     priority: 1 },
  "Display screen dead / blank":   { label: "High",   color: "text-rose-700 bg-rose-50 border-rose-100",    sla: "24 Hours",   team: "Technical Field Team",   priority: 1 },
  "Meter physically damaged":      { label: "Critical",color: "text-rose-700 bg-rose-50 border-rose-100", sla: "6 Hours",    team: "Emergency Response Unit",priority: 0 },
  "Meter seal broken / tampered":  { label: "Critical",color: "text-rose-700 bg-rose-50 border-rose-100", sla: "6 Hours",    team: "Vigilance & Safety Team",priority: 0 },
  "No power but meter is fine":    { label: "Medium",  color: "text-amber-700 bg-amber-50 border-amber-100",sla: "48 Hours",  team: "Field Operations Team",  priority: 2 },
  "Sparking or burning smell":     { label: "Critical",color: "text-rose-700 bg-rose-50 border-rose-100", sla: "2 Hours",    team: "Emergency Safety Team",  priority: 0 },
  "Meter shifting – renovation":   { label: "Low",     color: "text-emerald-700 bg-emerald-50 border-emerald-100", sla: "7 Working Days", team: "Civil & Meter Team", priority: 3 },
  "Meter shifting – relocation":   { label: "Low",     color: "text-emerald-700 bg-emerald-50 border-emerald-100", sla: "7 Working Days", team: "Civil & Meter Team", priority: 3 },
  "Meter shifting – other reason": { label: "Medium",  color: "text-amber-700 bg-amber-50 border-amber-100",sla: "5 Working Days",team: "Field Operations Team", priority: 2 },
};

const malfunctionIssues = [
  "Meter running fast / slow",
  "Display screen dead / blank",
  "Meter physically damaged",
  "Meter seal broken / tampered",
  "No power but meter is fine",
  "Sparking or burning smell",
];

const shiftingReasons = [
  "Meter shifting – renovation",
  "Meter shifting – relocation",
  "Meter shifting – other reason",
];

const MeterComplaintPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [subCategory, setSubCategory] = useState<SubCategory>(null);

  // Step 2 fields
  const [consumerId, setConsumerId] = useState("");
  const [consumerIdError, setConsumerIdError] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [consumerName, setConsumerName] = useState("");

  // Step 3 fields
  const [selectedIssue, setSelectedIssue] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Output
  const [referenceId, setReferenceId] = useState("");
  const [ticketAssigned, setTicketAssigned] = useState("");

  const severity = severityMap[selectedIssue];
  const issueOptions = subCategory === "malfunction" ? malfunctionIssues : shiftingReasons;

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleConsumerIdChange = (val: string) => {
    const clean = val.replace(/\D/g, "").slice(0, 10);
    setConsumerId(clean);
    if (clean.length > 0 && clean.length < 10) setConsumerIdError("Must be exactly 10 digits");
    else setConsumerIdError("");
  };

  const handleVerify = () => {
    if (consumerId.length !== 10) { setConsumerIdError("Enter a valid 10-digit Consumer ID"); return; }
    setIsFetching(true);
    setTimeout(() => {
      setIsFetching(false);
      setConsumerName("Ramesh Kumar");   // mock fetch
      setStep(3);
    }, 1500);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const teamCode = `TKT-${Math.floor(Math.random() * 90000 + 10000)}`;
    const id = db.addComplaint({
      category: "Electricity – Meter",
      service: subCategory === "malfunction" ? "Meter Malfunction" : "Meter Shifting",
      name: consumerName || "Unknown",
      phone: consumerId,
      description: `${selectedIssue}: ${description}`,
      location: "Guwahati",
      status: "Pending",
    } as any);
    setTicketAssigned(teamCode);
    setTimeout(() => {
      setReferenceId(id);
      setIsSubmitting(false);
      setStep(4);
    }, 2000);
  };

  // Step 4: Receipt View (Wrapped in beautiful custom layout)
  if (step === 4 && severity) {
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
          <div className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(25,46,89,0.2)] border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <Receipt
              transactionId={referenceId}
              type={subCategory === "malfunction" ? "Meter Malfunction Complaint" : "Meter Shifting Request"}
              date={new Date().toLocaleDateString()}
              userName={consumerName || "Citizen"}
              details={[
                { label: "Consumer ID", value: consumerId },
                { label: "Issue", value: selectedIssue },
                { label: "Severity", value: severity.label },
                { label: "Assigned To", value: severity.team },
                { label: "Ticket No", value: ticketAssigned },
                { label: "Expected Resolution", value: severity.sla },
                { label: "Status", value: "Ticket Raised" },
              ]}
              onClose={() => navigate("/")}
            />
          </div>
        </div>
      </div>
    );
  }

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
              className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 px-5 py-2.5 bg-[#FD8008] hover:bg-[#e67000] text-white border border-[#FD8008]/20 rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 duration-200 group shadow-[0_4px_12px_rgba(253,128,8,0.3)] z-50"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>
            <div className="text-center">
              <h1 className="text-3xl font-[900] tracking-tight uppercase leading-none">Meter Complaints</h1>
              <p className="text-blue-200 text-xs font-bold mt-2 tracking-[0.3em] uppercase">Electricity Utility Services</p>
            </div>
          </div>

          <div className="flex-1 p-8 lg:p-12 overflow-y-auto custom-scrollbar bg-white">
            
            {/* Stepper */}
            {step > 1 && (
              <div className="flex items-center justify-between mb-12 px-4 max-w-2xl mx-auto">
                {[
                  { num: 2, label: "Verify" },
                  { num: 3, label: "Details" },
                ].map(({ num, label }) => (
                  <div key={num} className="flex flex-col items-center gap-3 flex-1 relative">
                    {num < 3 && (
                      <div className={`absolute left-1/2 right-[-50%] top-6 h-1 -z-10 ${step > num ? "bg-[#FD8008]" : "bg-slate-100"}`} />
                    )}
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black transition-all duration-500 shadow-xl border-4 border-white
                      ${step >= num ? "bg-[#FD8008] text-white scale-110 shadow-[#FD8008]/40" : "bg-slate-50 text-slate-400 border-slate-100"}`}>
                      {step > num ? <CheckCircle2 className="h-5 w-5" /> : num === 2 ? <Search className="h-5 w-5" /> : <Gauge className="h-5 w-5" />}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${step >= num ? "text-slate-700" : "text-slate-300"}`}>{label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* ── STEP 1: Sub-Category ─────────────────────────────────────── */}
            {step === 1 && (
              <div className="animate-in fade-in zoom-in-95 duration-500 max-w-3xl mx-auto">
                <h2 className="text-xl font-black text-[#192e59] uppercase tracking-wider flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-6 bg-[#FD8008] rounded-full" /> Select Complaint Type
                </h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-10 leading-relaxed">Choose the type of meter issue you are experiencing to get the right assistance.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Malfunction Card */}
                  <button
                    onClick={() => { setSubCategory("malfunction"); setStep(2); setSelectedIssue(malfunctionIssues[0]); }}
                    className="group p-8 rounded-[2rem] border border-slate-200 bg-slate-50 hover:border-[#FD8008] hover:bg-[#FD8008]/5 transition-all text-left flex flex-col gap-5 relative overflow-hidden shadow-sm"
                  >
                    <div className="absolute inset-0 bg-[#FD8008]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                    <div className="h-16 w-16 rounded-2xl bg-[#FD8008]/10 flex items-center justify-center group-hover:bg-[#FD8008] group-hover:scale-110 transition-all z-10 shadow-sm border border-slate-100">
                      <Wrench className="h-8 w-8 text-[#FD8008] group-hover:text-white transition-colors" />
                    </div>
                    <div className="z-10">
                      <h3 className="font-black text-[#192e59] text-lg leading-tight mb-2 uppercase tracking-tight">Meter Malfunction<br />or Damage</h3>
                      <p className="text-slate-400 text-xs font-medium leading-relaxed mt-2 uppercase tracking-wide">
                        Meter running fast/slow, display dead, physical damage, seal broken, sparking/burning smell
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-[#FD8008] font-black text-xs uppercase tracking-widest mt-auto z-10">
                      File Complaint <ChevronRight className="h-4 w-4 animate-pulse" />
                    </div>
                  </button>

                  {/* Shifting Card */}
                  <button
                    onClick={() => { setSubCategory("shifting"); setStep(2); setSelectedIssue(shiftingReasons[0]); }}
                    className="group p-8 rounded-[2rem] border border-slate-200 bg-slate-50 hover:border-emerald-500 hover:bg-emerald-500/5 transition-all text-left flex flex-col gap-5 relative overflow-hidden shadow-sm"
                  >
                    <div className="absolute inset-0 bg-emerald-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                    <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500 group-hover:scale-110 transition-all z-10 shadow-sm border border-slate-100">
                      <MoveHorizontal className="h-8 w-8 text-emerald-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="z-10">
                      <h3 className="font-black text-[#192e59] text-lg leading-tight mb-2 uppercase tracking-tight">Meter Shifting<br />Service</h3>
                      <p className="text-slate-400 text-xs font-medium leading-relaxed mt-2 uppercase tracking-wide">
                        Relocate your meter for home renovation, room shifting, or property restructuring
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest mt-auto z-10">
                      Request Shifting <ChevronRight className="h-4 w-4 animate-pulse" />
                    </div>
                  </button>
                </div>

                {/* Emergency banner */}
                <div className="mt-8 flex items-start gap-4 p-5 rounded-2xl bg-rose-50 border border-rose-100 shadow-md shadow-rose-500/5">
                  <AlertTriangle className="h-5 w-5 text-rose-500 mt-0.5 shrink-0 animate-bounce" />
                  <p className="text-rose-700 text-xs font-bold leading-relaxed uppercase tracking-wider">
                    For sparking, burning smell, or shock hazard — immediately call <span className="text-rose-900 font-black underline">1800-200-1234</span> (24/7 Emergency Helpline) before filing a complaint.
                  </p>
                </div>
              </div>
            )}

            {/* ── STEP 2: Consumer Verification ───────────────────────────── */}
            {step === 2 && (
              <div className="animate-in slide-in-from-right fade-in duration-500 max-w-2xl mx-auto">
                <div className="flex items-center gap-4 mb-2">
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center border shadow-sm ${subCategory === "malfunction" ? "bg-[#FD8008]/10 border-[#FD8008]/20" : "bg-emerald-50 border-emerald-100"}`}>
                    {subCategory === "malfunction" ? <Wrench className="h-7 w-7 text-[#FD8008]" /> : <MoveHorizontal className="h-7 w-7 text-emerald-500" />}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-[#192e59] uppercase tracking-tight">Consumer Verification</h2>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">{subCategory === "malfunction" ? "Meter Malfunction / Damage" : "Meter Shifting Service"}</p>
                  </div>
                </div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-10 mt-6 leading-relaxed">Enter your 10-digit Consumer ID or Registered Mobile Number to proceed.</p>

                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Consumer ID / Mobile Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={consumerId}
                      onChange={(e) => handleConsumerIdChange(e.target.value)}
                      className={`w-full bg-slate-50 border-2 rounded-2xl px-6 py-5 text-slate-800 text-2xl font-mono tracking-widest focus:ring-4 transition-all outline-none font-bold placeholder:text-slate-300
                        ${subCategory === "malfunction" ? "focus:ring-[#FD8008]/10 focus:border-[#FD8008]" : "focus:ring-emerald-500/10 focus:border-emerald-500"}
                        ${consumerIdError ? "border-rose-500" : "border-slate-200"}`}
                      placeholder="e.g. 9876543210"
                      maxLength={10}
                      autoFocus
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2">
                      {consumerId.length === 10
                        ? <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                        : <User className="h-6 w-6 text-slate-300" />}
                    </div>
                  </div>
                  {consumerIdError && <p className="text-rose-600 text-sm font-bold ml-1">{consumerIdError}</p>}
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider ml-1">Only numeric digits · Exactly 10 digits required</p>
                </div>

                <div className="mt-10 flex justify-between">
                  <button onClick={() => setStep(1)} className="text-slate-400 hover:text-slate-800 font-black uppercase tracking-wider px-4 transition-all">Back</button>
                  <button
                    onClick={handleVerify}
                    disabled={consumerId.length !== 10 || isFetching}
                    className={`px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-3 shadow-xl transition-all disabled:opacity-50 disabled:pointer-events-none hover:scale-105 active:scale-95 uppercase tracking-wider
                      ${subCategory === "malfunction" ? "bg-[#FD8008] text-white shadow-[#FD8008]/30" : "bg-emerald-600 text-white shadow-emerald-500/30"}`}
                  >
                    {isFetching ? <Loader2 className="h-6 w-6 animate-spin text-white" /> : <>Verify & Proceed <ChevronRight className="h-6 w-6 animate-pulse" /></>}
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Issue + Description + Upload ────────────────────── */}
            {step === 3 && (
              <div className="animate-in slide-in-from-right fade-in duration-500 space-y-8 max-w-2xl mx-auto">
                <div>
                  <h2 className="text-xl font-black text-[#192e59] uppercase tracking-wider flex items-center gap-2 mb-1">
                    <span className="w-1.5 h-6 bg-[#FD8008] rounded-full" />
                    {subCategory === "malfunction" ? "Describe the Issue" : "Shifting Request Details"}
                  </h2>
                  {consumerName && (
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-3">Filing for: <span className="text-slate-800 font-black">{consumerName}</span> · ID: <span className="font-mono text-slate-855 font-black">{consumerId}</span></p>
                  )}
                </div>

                {/* Issue Dropdown */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                    {subCategory === "malfunction" ? "Select Issue Type *" : "Reason for Shifting *"}
                  </label>
                  <select
                    value={selectedIssue}
                    onChange={(e) => setSelectedIssue(e.target.value)}
                    className="w-full bg-slate-55 border-2 border-slate-200 rounded-xl px-5 py-4 text-slate-700 focus:ring-4 focus:ring-[#FD8008]/10 focus:border-[#FD8008] outline-none font-bold"
                  >
                    {issueOptions.map((opt) => (
                      <option key={opt} className="bg-white text-slate-700">{opt}</option>
                    ))}
                  </select>
                </div>

                {/* SLA / Severity Preview — auto computed */}
                {selectedIssue && severity && (
                  <div className={`flex items-start gap-4 p-5 rounded-2xl border ${severity.color} animate-in fade-in duration-300 shadow-md`}>
                    <div className="shrink-0 mt-0.5">
                      {severity.priority <= 1
                        ? <AlertTriangle className="h-6 w-6" />
                        : severity.priority === 2
                          ? <Zap className="h-6 w-6 animate-pulse" />
                          : <ShieldCheck className="h-6 w-6" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <span className="font-black text-base uppercase tracking-tight">Severity: {severity.label}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full bg-white/30 border border-current">Auto-detected</span>
                      </div>
                      <p className="text-xs font-bold uppercase tracking-wider opacity-85 mt-2">Will be assigned to: <span className="font-black">{severity.team}</span></p>
                      <div className="flex items-center gap-2 mt-3">
                        <Clock className="h-4 w-4 opacity-75" />
                        <span className="text-xs font-bold uppercase tracking-widest">Expected Resolution: <span className="font-black">{severity.sla}</span></span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Additional Description (Optional)</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-55 border-2 border-slate-200 rounded-xl px-5 py-4 text-slate-800 focus:ring-4 focus:ring-[#FD8008]/10 focus:border-[#FD8008] transition-all outline-none resize-none font-bold placeholder:text-slate-300"
                    placeholder="Describe the issue in more detail (when it started, frequency, etc.)..."
                  />
                </div>

                {/* Photo Upload via QR */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-4">Site Verification Photo (Recommended)</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-7 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer relative overflow-hidden group text-center">
                      <div className="absolute inset-0 bg-[#FD8008]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                      <QrCode className="h-12 w-12 text-slate-300 mb-3 group-hover:text-[#FD8008] transition-colors group-hover:scale-110 duration-500" />
                      <p className="text-slate-700 font-black uppercase tracking-tight relative z-10 text-sm">Scan QR – Upload Meter Photo</p>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-2 relative z-10 leading-relaxed">Clear photo of meter/damage<br />(Secure Mobile Upload)</p>
                      <button className="mt-4 bg-[#FD8008] hover:bg-[#e67300] px-5 py-2 rounded-xl text-[10px] font-black text-white hover:bg-primary transition-colors shadow-lg relative z-10 uppercase tracking-widest">Show QR Code</button>
                    </div>
                    <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-7 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer relative overflow-hidden group text-center">
                      <div className="absolute inset-0 bg-[#FD8008]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                      <QrCode className="h-12 w-12 text-slate-300 mb-3 group-hover:text-[#FD8008] transition-colors group-hover:scale-110 duration-500" />
                      <p className="text-slate-700 font-black uppercase tracking-tight relative z-10 text-sm">Scan QR – Upload Site Photo</p>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-2 relative z-10 leading-relaxed">Wide shot of installation area<br />(Secure Mobile Upload)</p>
                      <button className="mt-4 bg-[#FD8008] hover:bg-[#e67300] px-5 py-2 rounded-xl text-[10px] font-black text-white hover:bg-primary transition-colors shadow-lg relative z-10 uppercase tracking-widest">Show QR Code</button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button onClick={() => setStep(2)} className="text-slate-400 hover:text-slate-800 font-black uppercase tracking-wider px-4 transition-all">Back</button>
                  <button
                    onClick={handleSubmit}
                    disabled={!selectedIssue || isSubmitting}
                    className="bg-[#FD8008] hover:bg-[#e67300] text-white px-12 py-5 rounded-2xl font-black text-xl flex items-center gap-3 shadow-xl shadow-[#FD8008]/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none uppercase tracking-wider"
                  >
                    {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin text-white" /> : "Submit Complaint"}
                  </button>
                </div>
              </div>
            )}

          </div>
          
          {/* Footer Decoration */}
          <div className="h-2 bg-gradient-to-r from-slate-100 via-[#192e59]/20 to-slate-100 flex-shrink-0"></div>
        </div>
      </div>
    </div>
  );
};

export default MeterComplaintPage;
