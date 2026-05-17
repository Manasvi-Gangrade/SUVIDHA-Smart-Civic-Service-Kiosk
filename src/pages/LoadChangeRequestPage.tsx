import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlugZap, ChevronRight, Loader2, Search, CheckCircle2,
  QrCode, ArrowLeft, User, Zap, FileText
} from "lucide-react";
import { db } from "@/lib/database";
import Receipt from "@/components/Receipt";

// Mock consumer profiles for demo
const mockConsumers: Record<string, { name: string; address: string; currentLoad: string; category: string; accountNo: string }> = {
  "9876543210": { name: "Ramesh Kumar", address: "42, Zoo Road, Guwahati, Assam 781005", currentLoad: "3", category: "Domestic", accountNo: "ELEC-GUW-00421" },
  "8800112233": { name: "Sunita Devi", address: "12, Ganeshguri, Guwahati, Assam 781006", currentLoad: "5", category: "Commercial", accountNo: "ELEC-GUW-00987" },
  "1234567890": { name: "Arjun Sharma", address: "7, Dispur Colony, Guwahati, Assam 781005", currentLoad: "2", category: "Domestic", accountNo: "ELEC-GUW-00134" },
};

const loadReasons = [
  "Added new heavy appliances (AC, Geyser, etc.)",
  "Business expansion requiring more power",
  "Home renovation with new electrical load",
  "Agricultural/irrigation equipment",
  "EV Charging Setup",
  "Other (specify in remarks)",
];

const LoadChangeRequestPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [identifier, setIdentifier] = useState("");
  const [identifierError, setIdentifierError] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [consumer, setConsumer] = useState<typeof mockConsumers[string] | null>(null);
  const [newLoad, setNewLoad] = useState("");
  const [loadReason, setLoadReason] = useState(loadReasons[0]);
  const [remarks, setRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceId, setReferenceId] = useState("");

  // Step 1: Identifier validation
  const handleIdentifierChange = (val: string) => {
    const clean = val.replace(/\D/g, "").slice(0, 10);
    setIdentifier(clean);
    if (clean.length > 0 && clean.length < 10) {
      setIdentifierError("Must be exactly 10 digits");
    } else {
      setIdentifierError("");
    }
  };

  const handleFetchConsumer = () => {
    if (identifier.length !== 10) {
      setIdentifierError("Enter a valid 10-digit Consumer ID or Mobile Number");
      return;
    }
    setIsFetching(true);
    setTimeout(() => {
      const found = mockConsumers[identifier];
      setIsFetching(false);
      if (found) {
        setConsumer(found);
        setStep(2);
      } else {
        // Default mock profile for unrecognised numbers
        setConsumer({
          name: "Citizen User",
          address: "House No 5, Paltan Bazaar, Guwahati 781008",
          currentLoad: "2",
          category: "Domestic",
          accountNo: `ELEC-GUW-${Math.floor(Math.random() * 90000 + 10000)}`
        });
        setStep(2);
      }
    }, 1800);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const id = db.addApplication({
      category: "Electricity Utility Services",
      service: "Load Change Request",
      name: consumer!.name,
      aadhaar: "—",
      phone: identifier,
      city: "Guwahati",
      pincode: "781001",
      status: "Submitted",
      date: new Date().toLocaleDateString(),
    } as any);
    setTimeout(() => {
      setReferenceId(id);
      setIsSubmitting(false);
      setStep(4);
    }, 2000);
  };

  // Step 4: Receipt
  if (step === 4) {
    return (
      <div className="min-h-screen bg-[#0f172a]/95 flex items-center justify-center p-6">
        <Receipt
          transactionId={referenceId}
          type="Load Change Request"
          date={new Date().toLocaleDateString()}
          userName={consumer!.name}
          details={[
            { label: "Account No", value: consumer!.accountNo },
            { label: "Mobile", value: identifier },
            { label: "Current Load", value: `${consumer!.currentLoad} kW` },
            { label: "Requested Load", value: `${newLoad} kW` },
            { label: "Category", value: consumer!.category },
            { label: "Reason", value: loadReason },
            { label: "Status", value: "Under Review" },
          ]}
          onClose={() => navigate("/")}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] pb-20">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#1e2e50] py-10">
        <div className="container flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="rounded-2xl bg-white/10 p-4 text-white hover:bg-white/20 transition-all">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div className="rounded-3xl bg-white/10 p-5 backdrop-blur-md border border-white/20">
            <PlugZap className="h-10 w-10 text-amber-400" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Load Change Request</h1>
            <p className="text-white/60 font-medium">Electricity Utility Services</p>
          </div>
        </div>
      </div>

      <div className="container max-w-3xl py-12">
        {/* Stepper */}
        <div className="flex items-center justify-between mb-14 px-4">
          {[
            { num: 1, icon: Search, label: "Verify" },
            { num: 2, icon: User, label: "Profile" },
            { num: 3, icon: FileText, label: "Request" },
          ].map(({ num, icon: Icon, label }) => (
            <div key={num} className="flex flex-col items-center gap-3 flex-1 relative">
              {num < 3 && (
                <div className={`absolute left-1/2 right-[-50%] top-6 h-1 -z-10 ${step > num ? "bg-amber-500" : "bg-white/10"}`} />
              )}
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black transition-all duration-500 shadow-xl border-4 border-[#0f172a]
                ${step >= num ? "bg-amber-500 text-white scale-110 shadow-amber-500/40" : "bg-white/5 text-white/40 border-white/5"}`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className={`text-xs font-bold uppercase tracking-widest ${step >= num ? "text-white" : "text-white/30"}`}>{label}</span>
            </div>
          ))}
        </div>

        <div className="bg-[#1e2e50]/40 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl p-8 md:p-12">

          {/* STEP 1: Verification */}
          {step === 1 && (
            <div className="animate-in slide-in-from-right fade-in duration-500">
              <h2 className="text-2xl font-black text-white flex items-center gap-3 mb-2">
                <div className="w-1.5 h-8 bg-amber-500 rounded-full" /> Consumer Verification
              </h2>
              <p className="text-white/50 mb-10">Enter your 10-digit Consumer ID or Registered Mobile Number to fetch your current load profile.</p>

              <div className="space-y-3">
                <label className="text-sm font-bold text-white/70 ml-1">Consumer ID / Mobile Number</label>
                <div className="relative">
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => handleIdentifierChange(e.target.value)}
                    className={`w-full bg-white/5 border rounded-2xl px-6 py-5 text-white text-2xl font-mono tracking-widest focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none
                      ${identifierError ? "border-rose-500" : "border-white/10"}`}
                    placeholder="1234567890"
                    maxLength={10}
                    autoFocus
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2">
                    {identifier.length === 10
                      ? <CheckCircle2 className="h-6 w-6 text-green-400" />
                      : <Search className="h-6 w-6 text-white/30" />}
                  </div>
                </div>
                {identifierError && (
                  <p className="text-rose-400 text-sm font-bold ml-1">{identifierError}</p>
                )}
                <p className="text-white/30 text-xs ml-1">Only numeric digits allowed — exactly 10 digits required</p>
              </div>

              <div className="mt-10 flex justify-end">
                <button
                  onClick={handleFetchConsumer}
                  disabled={identifier.length !== 10 || isFetching}
                  className="bg-amber-500 text-slate-900 px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-3 shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isFetching ? <Loader2 className="h-6 w-6 animate-spin" /> : <>Fetch Profile <ChevronRight className="h-6 w-6" /></>}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Current Load Profile */}
          {step === 2 && consumer && (
            <div className="animate-in slide-in-from-right fade-in duration-500">
              <h2 className="text-2xl font-black text-white flex items-center gap-3 mb-8">
                <div className="w-1.5 h-8 bg-amber-500 rounded-full" /> Your Current Load Profile
              </h2>

              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-3xl p-8 mb-8 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-amber-500/20 flex items-center justify-center">
                    <User className="h-7 w-7 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-white/50 text-xs font-bold uppercase tracking-widest">Account Holder</p>
                    <p className="text-white font-black text-xl">{consumer.name}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-2xl p-4">
                    <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">Account No</p>
                    <p className="text-white font-bold font-mono">{consumer.accountNo}</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4">
                    <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">Category</p>
                    <p className="text-white font-bold">{consumer.category}</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 md:col-span-2">
                    <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">Registered Address</p>
                    <p className="text-white font-medium text-sm">{consumer.address}</p>
                  </div>
                  <div className="bg-amber-500/20 border border-amber-500/30 rounded-2xl p-4 md:col-span-2 flex items-center gap-4">
                    <Zap className="h-8 w-8 text-amber-400 shrink-0" />
                    <div>
                      <p className="text-amber-300 text-xs font-bold uppercase tracking-wider">Current Sanctioned Load</p>
                      <p className="text-white font-black text-2xl">{consumer.currentLoad} kW</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(1)} className="text-white/50 hover:text-white font-bold px-4 transition-all">Back</button>
                <button
                  onClick={() => setStep(3)}
                  className="bg-amber-500 text-slate-900 px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-3 shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all"
                >
                  Request Change <ChevronRight className="h-6 w-6" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Enhancement Inputs + Documents */}
          {step === 3 && consumer && (
            <div className="animate-in slide-in-from-right fade-in duration-500 space-y-8">
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <div className="w-1.5 h-8 bg-amber-500 rounded-full" /> Load Enhancement Details
              </h2>

              {/* New Load Input */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/70 ml-1">Current Load (kW)</label>
                  <input
                    type="text"
                    disabled
                    value={`${consumer.currentLoad} kW`}
                    className="w-full bg-white/5 border border-white/5 opacity-50 rounded-2xl px-6 py-4 text-white outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/70 ml-1">New Required Load (kW) *</label>
                  <input
                    type="text"
                    value={newLoad}
                    onChange={(e) => setNewLoad(e.target.value.replace(/[^0-9.]/g, ""))}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none"
                    placeholder="e.g. 7"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-white/70 ml-1">Reason for Load Change *</label>
                  <select
                    value={loadReason}
                    onChange={(e) => setLoadReason(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-4 focus:ring-amber-500/20 outline-none"
                  >
                    {loadReasons.map((r) => (
                      <option key={r} className="bg-slate-900">{r}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-white/70 ml-1">Additional Remarks (Optional)</label>
                  <textarea
                    rows={2}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none resize-none"
                    placeholder="Any additional information..."
                  />
                </div>
              </div>

              {/* QR Document Upload */}
              <div>
                <p className="text-sm font-bold text-white/70 mb-4">Supporting Documents (via Mobile Upload)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="border-2 border-dashed border-white/10 rounded-[2rem] p-7 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition-all cursor-pointer relative overflow-hidden group text-center">
                    <div className="absolute inset-0 bg-amber-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <QrCode className="h-12 w-12 text-white/30 mb-3 group-hover:text-amber-400 transition-colors" />
                    <p className="text-white font-bold relative z-10">Load Test Declaration</p>
                    <p className="text-white/40 text-xs mt-2 relative z-10 leading-relaxed">Electrician Certificate / Load Test Report<br />(Secure Mobile Upload)</p>
                    <button className="mt-4 bg-white/10 px-5 py-2 rounded-xl text-xs font-bold text-white hover:bg-amber-500 transition-colors shadow-sm relative z-10">Show QR Code</button>
                  </div>
                  <div className="border-2 border-dashed border-white/10 rounded-[2rem] p-7 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition-all cursor-pointer relative overflow-hidden group text-center">
                    <div className="absolute inset-0 bg-amber-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <QrCode className="h-12 w-12 text-white/30 mb-3 group-hover:text-amber-400 transition-colors" />
                    <p className="text-white font-bold relative z-10">Premises Declaration</p>
                    <p className="text-white/40 text-xs mt-2 relative z-10 leading-relaxed">Self-declaration / Property Proof<br />(Secure Mobile Upload)</p>
                    <button className="mt-4 bg-white/10 px-5 py-2 rounded-xl text-xs font-bold text-white hover:bg-amber-500 transition-colors shadow-sm relative z-10">Show QR Code</button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <button onClick={() => setStep(2)} className="text-white/50 hover:text-white font-bold px-4 transition-all">Back</button>
                <button
                  onClick={handleSubmit}
                  disabled={!newLoad || isSubmitting}
                  className="bg-amber-500 text-slate-900 px-12 py-5 rounded-2xl font-black text-xl flex items-center gap-3 shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : "Submit Request"}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default LoadChangeRequestPage;
