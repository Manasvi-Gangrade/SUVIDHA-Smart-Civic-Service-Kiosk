import { useState } from "react";
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
      setIdentifierError("Enter a valid 10-digit Consumer ID or Registered Mobile Number");
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

  // Step 4: Receipt View (Wrapped in beautiful custom layout)
  if (step === 4) {
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
              className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-xl font-bold text-xs uppercase tracking-widest backdrop-blur-md transition-all hover:scale-105 active:scale-95 duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>
            <div className="text-center">
              <h1 className="text-3xl font-[900] tracking-tight uppercase leading-none">Load Change Request</h1>
              <p className="text-blue-200 text-xs font-bold mt-2 tracking-[0.3em] uppercase">Electricity Utility Services</p>
            </div>
          </div>

          <div className="flex-1 p-8 lg:p-12 overflow-y-auto custom-scrollbar bg-white">
            
            {/* Stepper */}
            <div className="flex items-center justify-between mb-12 px-4">
              {[
                { num: 1, icon: Search, label: "Verify" },
                { num: 2, icon: User, label: "Profile" },
                { num: 3, icon: FileText, label: "Request" },
              ].map(({ num, icon: Icon, label }) => (
                <div key={num} className="flex flex-col items-center gap-3 flex-1 relative">
                  {num < 3 && (
                    <div className={`absolute left-1/2 right-[-50%] top-6 h-1 -z-10 ${step > num ? "bg-[#FD8008]" : "bg-slate-100"}`} />
                  )}
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black transition-all duration-500 shadow-xl border-4 border-white
                    ${step >= num ? "bg-[#FD8008] text-white scale-110 shadow-[#FD8008]/40" : "bg-slate-50 text-slate-400 border-slate-100"}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${step >= num ? "text-slate-700" : "text-slate-300"}`}>{label}</span>
                </div>
              ))}
            </div>

            {/* STEP 1: Verification */}
            {step === 1 && (
              <div className="animate-in slide-in-from-right fade-in duration-500 max-w-2xl mx-auto">
                <h2 className="text-xl font-black text-[#192e59] uppercase tracking-wider flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-6 bg-[#FD8008] rounded-full" /> Consumer Verification
                </h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-10 leading-relaxed">Enter your 10-digit Consumer ID or Registered Mobile Number to fetch your current load profile.</p>

                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Consumer ID / Mobile Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => handleIdentifierChange(e.target.value)}
                      className={`w-full bg-slate-50 border-2 rounded-2xl px-6 py-5 text-slate-800 text-2xl font-mono tracking-widest focus:ring-4 focus:ring-[#FD8008]/10 focus:border-[#FD8008] transition-all outline-none font-bold placeholder:text-slate-300
                        ${identifierError ? "border-rose-500" : "border-slate-200"}`}
                      placeholder="e.g. 9876543210"
                      maxLength={10}
                      autoFocus
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2">
                      {identifier.length === 10
                        ? <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                        : <Search className="h-6 w-6 text-slate-300" />}
                    </div>
                  </div>
                  {identifierError && (
                    <p className="text-rose-600 text-sm font-bold ml-1">{identifierError}</p>
                  )}
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider ml-1">Only numeric digits allowed — exactly 10 digits required</p>
                </div>

                <div className="mt-10 flex justify-end">
                  <button
                    onClick={handleFetchConsumer}
                    disabled={identifier.length !== 10 || isFetching}
                    className="bg-[#FD8008] hover:bg-[#e67300] text-white px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-3 shadow-xl shadow-[#FD8008]/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none uppercase tracking-wider"
                  >
                    {isFetching ? <Loader2 className="h-6 w-6 animate-spin text-white" /> : <>Fetch Profile <ChevronRight className="h-6 w-6 animate-pulse" /></>}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Current Load Profile */}
            {step === 2 && consumer && (
              <div className="animate-in slide-in-from-right fade-in duration-500 max-w-2xl mx-auto">
                <h2 className="text-xl font-black text-[#192e59] uppercase tracking-wider flex items-center gap-2 mb-8">
                  <span className="w-1.5 h-6 bg-[#FD8008] rounded-full" /> Your Current Load Profile
                </h2>

                <div className="bg-gradient-to-br from-[#FD8008]/5 to-slate-50 border border-slate-200 rounded-3xl p-8 mb-8 space-y-6 shadow-inner">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200">
                      <User className="h-7 w-7 text-[#FD8008]" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Account Holder</p>
                      <p className="text-[#192e59] font-black text-xl leading-none mt-1">{consumer.name}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Account No</p>
                      <p className="text-slate-700 font-black font-mono tracking-wider">{consumer.accountNo}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Category</p>
                      <p className="text-slate-700 font-black">{consumer.category}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm md:col-span-2">
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Registered Address</p>
                      <p className="text-slate-700 font-bold text-sm leading-relaxed">{consumer.address}</p>
                    </div>
                    <div className="bg-[#FD8008]/10 border border-[#FD8008]/20 rounded-2xl p-4 md:col-span-2 flex items-center gap-4 shadow-sm">
                      <Zap className="h-8 w-8 text-[#FD8008] shrink-0 animate-pulse" />
                      <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Current Sanctioned Load</p>
                        <p className="text-[#192e59] font-black text-2xl mt-0.5">{consumer.currentLoad} kW</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button onClick={() => setStep(1)} className="text-slate-400 hover:text-slate-800 font-black uppercase tracking-wider px-4 transition-all">Back</button>
                  <button
                    onClick={() => setStep(3)}
                    className="bg-[#FD8008] hover:bg-[#e67300] text-white px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-3 shadow-xl shadow-[#FD8008]/30 hover:scale-105 active:scale-95 transition-all uppercase tracking-wider"
                  >
                    Request Change <ChevronRight className="h-6 w-6 animate-pulse" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Enhancement Inputs + Documents */}
            {step === 3 && consumer && (
              <div className="animate-in slide-in-from-right fade-in duration-500 space-y-8 max-w-2xl mx-auto">
                <h2 className="text-xl font-black text-[#192e59] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-[#FD8008] rounded-full" /> Load Enhancement Details
                </h2>

                {/* New Load Input */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Current Load (kW)</label>
                    <input
                      type="text"
                      disabled
                      value={`${consumer.currentLoad} kW`}
                      className="w-full bg-slate-100 border border-slate-200 opacity-55 rounded-2xl px-6 py-4 text-slate-500 outline-none font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">New Required Load (kW) *</label>
                    <input
                      type="text"
                      value={newLoad}
                      onChange={(e) => setNewLoad(e.target.value.replace(/[^0-9.]/g, ""))}
                      className="w-full bg-slate-55 border-2 border-slate-200 rounded-xl px-5 py-4 text-slate-800 focus:ring-4 focus:ring-[#FD8008]/10 focus:border-[#FD8008] transition-all outline-none font-bold placeholder:text-slate-300"
                      placeholder="e.g. 7"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Reason for Load Change *</label>
                    <select
                      value={loadReason}
                      onChange={(e) => setLoadReason(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-4 text-slate-700 focus:ring-4 focus:ring-[#FD8008]/10 outline-none font-bold"
                    >
                      {loadReasons.map((r) => (
                        <option key={r} className="bg-white text-slate-700">{r}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Additional Remarks (Optional)</label>
                    <textarea
                      rows={2}
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full bg-slate-55 border-2 border-slate-200 rounded-xl px-5 py-4 text-slate-800 focus:ring-4 focus:ring-[#FD8008]/10 focus:border-[#FD8008] transition-all outline-none resize-none font-bold placeholder:text-slate-300"
                      placeholder="Any additional information..."
                    />
                  </div>
                </div>

                {/* QR Document Upload */}
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-4">Supporting Documents (via Mobile Upload)</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-7 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer relative overflow-hidden group text-center">
                      <div className="absolute inset-0 bg-[#FD8008]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                      <QrCode className="h-12 w-12 text-slate-300 mb-3 group-hover:text-[#FD8008] transition-colors group-hover:scale-110 duration-500" />
                      <p className="text-slate-700 font-black uppercase tracking-tight relative z-10 text-sm">Load Test Declaration</p>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-2 relative z-10 leading-relaxed">Electrician Certificate / Load Test Report<br />(Secure Mobile Upload)</p>
                      <button className="mt-4 bg-[#FD8008] hover:bg-[#e67300] px-5 py-2 rounded-xl text-[10px] font-black text-white hover:bg-primary transition-colors shadow-lg relative z-10 uppercase tracking-widest">Show QR Code</button>
                    </div>
                    <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-7 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer relative overflow-hidden group text-center">
                      <div className="absolute inset-0 bg-[#FD8008]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                      <QrCode className="h-12 w-12 text-slate-300 mb-3 group-hover:text-[#FD8008] transition-colors group-hover:scale-110 duration-500" />
                      <p className="text-slate-700 font-black uppercase tracking-tight relative z-10 text-sm">Premises Declaration</p>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-2 relative z-10 leading-relaxed">Self-declaration / Property Proof<br />(Secure Mobile Upload)</p>
                      <button className="mt-4 bg-[#FD8008] hover:bg-[#e67300] px-5 py-2 rounded-xl text-[10px] font-black text-white hover:bg-primary transition-colors shadow-lg relative z-10 uppercase tracking-widest">Show QR Code</button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button onClick={() => setStep(2)} className="text-slate-400 hover:text-slate-800 font-black uppercase tracking-wider px-4 transition-all">Back</button>
                  <button
                    onClick={handleSubmit}
                    disabled={!newLoad || isSubmitting}
                    className="bg-[#FD8008] hover:bg-[#e67300] text-white px-12 py-5 rounded-2xl font-black text-xl flex items-center gap-3 shadow-xl shadow-[#FD8008]/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none uppercase tracking-wider"
                  >
                    {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin text-white" /> : "Submit Request"}
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

export default LoadChangeRequestPage;
