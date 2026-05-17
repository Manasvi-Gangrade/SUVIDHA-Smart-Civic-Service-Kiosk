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

// ─── Severity config ──────────────────────────────────────────────────────────
const severityMap: Record<string, { label: string; color: string; sla: string; team: string; priority: number }> = {
  "Meter running fast / slow":     { label: "High",   color: "text-red-400 bg-red-500/10 border-red-500/30",    sla: "24 Hours",   team: "Billing Meter Team",     priority: 1 },
  "Display screen dead / blank":   { label: "High",   color: "text-red-400 bg-red-500/10 border-red-500/30",    sla: "24 Hours",   team: "Technical Field Team",   priority: 1 },
  "Meter physically damaged":      { label: "Critical",color: "text-rose-400 bg-rose-500/10 border-rose-500/30", sla: "6 Hours",    team: "Emergency Response Unit",priority: 0 },
  "Meter seal broken / tampered":  { label: "Critical",color: "text-rose-400 bg-rose-500/10 border-rose-500/30", sla: "6 Hours",    team: "Vigilance & Safety Team",priority: 0 },
  "No power but meter is fine":    { label: "Medium",  color: "text-amber-400 bg-amber-500/10 border-amber-500/30",sla: "48 Hours",  team: "Field Operations Team",  priority: 2 },
  "Sparking or burning smell":     { label: "Critical",color: "text-rose-400 bg-rose-500/10 border-rose-500/30", sla: "2 Hours",    team: "Emergency Safety Team",  priority: 0 },
  "Meter shifting – renovation":   { label: "Low",     color: "text-teal-400 bg-teal-500/10 border-teal-500/30", sla: "7 Working Days", team: "Civil & Meter Team", priority: 3 },
  "Meter shifting – relocation":   { label: "Low",     color: "text-teal-400 bg-teal-500/10 border-teal-500/30", sla: "7 Working Days", team: "Civil & Meter Team", priority: 3 },
  "Meter shifting – other reason": { label: "Medium",  color: "text-amber-400 bg-amber-500/10 border-amber-500/30",sla: "5 Working Days","team": "Field Operations Team", priority: 2 },
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

// ─── Component ────────────────────────────────────────────────────────────────
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

  // ── Receipt ───────────────────────────────────────────────────────────────────
  if (step === 4 && severity) {
    return (
      <div className="min-h-screen bg-[#0f172a]/95 flex items-center justify-center p-6">
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
    );
  }

  // ── Main Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0f172a] pb-20">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#1e2e50] py-10">
        <div className="container flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="rounded-2xl bg-white/10 p-4 text-white hover:bg-white/20 transition-all">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div className="rounded-3xl bg-white/10 p-5 backdrop-blur-md border border-white/20">
            <Gauge className="h-10 w-10 text-orange-400" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Meter-Related Complaints</h1>
            <p className="text-white/60 font-medium">Electricity Utility Services</p>
          </div>
        </div>
      </div>

      <div className="container max-w-3xl py-12">
        {/* Stepper */}
        {step > 1 && (
          <div className="flex items-center justify-between mb-14 px-4">
            {[
              { num: 2, label: "Verify" },
              { num: 3, label: "Details" },
            ].map(({ num, label }) => (
              <div key={num} className="flex flex-col items-center gap-3 flex-1 relative">
                {num < 3 && (
                  <div className={`absolute left-1/2 right-[-50%] top-6 h-1 -z-10 ${step > num ? "bg-orange-500" : "bg-white/10"}`} />
                )}
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl border-4 border-[#0f172a]
                  ${step >= num ? "bg-orange-500 text-white scale-110 shadow-orange-500/40" : "bg-white/5 text-white/40 border-white/5"}`}>
                  {step > num ? <CheckCircle2 className="h-5 w-5" /> : num === 2 ? <Search className="h-5 w-5" /> : <Gauge className="h-5 w-5" />}
                </div>
                <span className={`text-xs font-bold uppercase tracking-widest ${step >= num ? "text-white" : "text-white/30"}`}>{label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="bg-[#1e2e50]/40 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl p-8 md:p-12">

          {/* ── STEP 1: Sub-Category ─────────────────────────────────────── */}
          {step === 1 && (
            <div className="animate-in fade-in zoom-in-95 duration-500">
              <h2 className="text-2xl font-black text-white flex items-center gap-3 mb-3">
                <div className="w-1.5 h-8 bg-orange-500 rounded-full" /> Select Complaint Type
              </h2>
              <p className="text-white/50 mb-10">Choose the type of meter issue you are experiencing to get the right assistance.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Malfunction Card */}
                <button
                  onClick={() => { setSubCategory("malfunction"); setStep(2); setSelectedIssue(malfunctionIssues[0]); }}
                  className="group p-8 rounded-[2rem] border-2 border-white/10 bg-white/5 hover:border-orange-500 hover:bg-orange-500/5 transition-all text-left flex flex-col gap-5"
                >
                  <div className="h-16 w-16 rounded-2xl bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500 group-hover:scale-110 transition-all">
                    <Wrench className="h-8 w-8 text-orange-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-lg leading-tight mb-2">Meter Malfunction<br />or Damage</h3>
                    <p className="text-white/40 text-sm font-medium leading-relaxed">
                      Meter running fast/slow, display dead, physical damage, seal broken, sparking/burning smell
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-orange-400 font-bold text-sm mt-auto">
                    File Complaint <ChevronRight className="h-4 w-4" />
                  </div>
                </button>

                {/* Shifting Card */}
                <button
                  onClick={() => { setSubCategory("shifting"); setStep(2); setSelectedIssue(shiftingReasons[0]); }}
                  className="group p-8 rounded-[2rem] border-2 border-white/10 bg-white/5 hover:border-teal-500 hover:bg-teal-500/5 transition-all text-left flex flex-col gap-5"
                >
                  <div className="h-16 w-16 rounded-2xl bg-teal-500/10 flex items-center justify-center group-hover:bg-teal-500 group-hover:scale-110 transition-all">
                    <MoveHorizontal className="h-8 w-8 text-teal-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-lg leading-tight mb-2">Meter Shifting<br />Service</h3>
                    <p className="text-white/40 text-sm font-medium leading-relaxed">
                      Relocate your meter for home renovation, room shifting, or property restructuring
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-teal-400 font-bold text-sm mt-auto">
                    Request Shifting <ChevronRight className="h-4 w-4" />
                  </div>
                </button>
              </div>

              {/* Info banner */}
              <div className="mt-8 flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
                <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
                <p className="text-white/50 text-sm font-medium">
                  For sparking, burning smell, or shock hazard — immediately call <span className="text-white font-bold">1800-200-1234</span> (24/7 Emergency Helpline) before filing a complaint.
                </p>
              </div>
            </div>
          )}

          {/* ── STEP 2: Consumer Verification ───────────────────────────── */}
          {step === 2 && (
            <div className="animate-in slide-in-from-right fade-in duration-500">
              <div className="flex items-center gap-3 mb-2">
                <div className={`h-10 w-10 rounded-2xl flex items-center justify-center ${subCategory === "malfunction" ? "bg-orange-500/20" : "bg-teal-500/20"}`}>
                  {subCategory === "malfunction" ? <Wrench className="h-5 w-5 text-orange-400" /> : <MoveHorizontal className="h-5 w-5 text-teal-400" />}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Consumer Verification</h2>
                  <p className="text-white/50 text-sm">{subCategory === "malfunction" ? "Meter Malfunction / Damage" : "Meter Shifting Service"}</p>
                </div>
              </div>
              <p className="text-white/40 mb-10 mt-4">Enter your 10-digit Consumer ID or Registered Mobile Number to proceed.</p>

              <div className="space-y-3">
                <label className="text-sm font-bold text-white/70 ml-1">Consumer ID / Mobile Number</label>
                <div className="relative">
                  <input
                    type="text"
                    value={consumerId}
                    onChange={(e) => handleConsumerIdChange(e.target.value)}
                    className={`w-full bg-white/5 border rounded-2xl px-6 py-5 text-white text-2xl font-mono tracking-widest focus:ring-4 transition-all outline-none
                      ${subCategory === "malfunction" ? "focus:ring-orange-500/20 focus:border-orange-500" : "focus:ring-teal-500/20 focus:border-teal-500"}
                      ${consumerIdError ? "border-rose-500" : "border-white/10"}`}
                    placeholder="1234567890"
                    maxLength={10}
                    autoFocus
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2">
                    {consumerId.length === 10
                      ? <CheckCircle2 className="h-6 w-6 text-green-400" />
                      : <User className="h-6 w-6 text-white/20" />}
                  </div>
                </div>
                {consumerIdError && <p className="text-rose-400 text-sm font-bold ml-1">{consumerIdError}</p>}
                <p className="text-white/30 text-xs ml-1">Only numeric digits · Exactly 10 digits required</p>
              </div>

              <div className="mt-10 flex justify-between">
                <button onClick={() => setStep(1)} className="text-white/50 hover:text-white font-bold px-4 transition-all">Back</button>
                <button
                  onClick={handleVerify}
                  disabled={consumerId.length !== 10 || isFetching}
                  className={`px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-3 shadow-xl transition-all disabled:opacity-50 disabled:pointer-events-none hover:scale-105 active:scale-95
                    ${subCategory === "malfunction" ? "bg-orange-500 text-white shadow-orange-500/30" : "bg-teal-500 text-white shadow-teal-500/30"}`}
                >
                  {isFetching ? <Loader2 className="h-6 w-6 animate-spin" /> : <>Verify & Proceed <ChevronRight className="h-6 w-6" /></>}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Issue + Description + Upload ────────────────────── */}
          {step === 3 && (
            <div className="animate-in slide-in-from-right fade-in duration-500 space-y-8">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-3 mb-1">
                  <div className="w-1.5 h-8 bg-orange-500 rounded-full" />
                  {subCategory === "malfunction" ? "Describe the Issue" : "Shifting Request Details"}
                </h2>
                {consumerName && (
                  <p className="text-white/40 text-sm mt-2">Filing for: <span className="text-white font-bold">{consumerName}</span> · ID: <span className="font-mono text-white/70">{consumerId}</span></p>
                )}
              </div>

              {/* Issue Dropdown */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/70 ml-1">
                  {subCategory === "malfunction" ? "Select Issue Type *" : "Reason for Shifting *"}
                </label>
                <select
                  value={selectedIssue}
                  onChange={(e) => setSelectedIssue(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                >
                  {issueOptions.map((opt) => (
                    <option key={opt} className="bg-slate-900">{opt}</option>
                  ))}
                </select>
              </div>

              {/* SLA / Severity Preview — auto computed */}
              {selectedIssue && severity && (
                <div className={`flex items-start gap-4 p-5 rounded-2xl border ${severity.color} animate-in fade-in duration-300`}>
                  <div className="shrink-0 mt-0.5">
                    {severity.priority <= 1
                      ? <AlertTriangle className="h-6 w-6" />
                      : severity.priority === 2
                        ? <Zap className="h-6 w-6" />
                        : <ShieldCheck className="h-6 w-6" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span className="font-black text-base">Severity: {severity.label}</span>
                      <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-white/10">Auto-detected</span>
                    </div>
                    <p className="text-sm opacity-80">Will be assigned to: <span className="font-bold">{severity.team}</span></p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="h-4 w-4 opacity-70" />
                      <span className="text-sm font-bold">Expected Resolution: <span className="text-white">{severity.sla}</span></span>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/70 ml-1">Additional Description (Optional)</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none resize-none"
                  placeholder="Describe the issue in more detail (when it started, frequency, etc.)..."
                />
              </div>

              {/* Photo Upload via QR */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-white/70 ml-1">Site Verification Photo (Recommended)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="border-2 border-dashed border-white/10 rounded-[2rem] p-7 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition-all cursor-pointer relative overflow-hidden group text-center">
                    <div className="absolute inset-0 bg-orange-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <QrCode className="h-12 w-12 text-white/30 mb-3 group-hover:text-orange-400 transition-colors" />
                    <p className="text-white font-bold relative z-10">Scan QR – Upload Meter Photo</p>
                    <p className="text-white/40 text-xs mt-2 relative z-10 leading-relaxed">Clear photo of meter/damage<br />(Secure Mobile Upload)</p>
                    <button className="mt-4 bg-white/10 px-5 py-2 rounded-xl text-xs font-bold text-white hover:bg-orange-500 transition-colors shadow-sm relative z-10">Show QR Code</button>
                  </div>
                  <div className="border-2 border-dashed border-white/10 rounded-[2rem] p-7 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition-all cursor-pointer relative overflow-hidden group text-center">
                    <div className="absolute inset-0 bg-orange-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <QrCode className="h-12 w-12 text-white/30 mb-3 group-hover:text-orange-400 transition-colors" />
                    <p className="text-white font-bold relative z-10">Scan QR – Upload Site Photo</p>
                    <p className="text-white/40 text-xs mt-2 relative z-10 leading-relaxed">Wide shot of installation area<br />(Secure Mobile Upload)</p>
                    <button className="mt-4 bg-white/10 px-5 py-2 rounded-xl text-xs font-bold text-white hover:bg-orange-500 transition-colors shadow-sm relative z-10">Show QR Code</button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button onClick={() => setStep(2)} className="text-white/50 hover:text-white font-bold px-4 transition-all">Back</button>
                <button
                  onClick={handleSubmit}
                  disabled={!selectedIssue || isSubmitting}
                  className="bg-orange-500 text-white px-12 py-5 rounded-2xl font-black text-xl flex items-center gap-3 shadow-xl shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : "Submit Complaint"}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default MeterComplaintPage;
