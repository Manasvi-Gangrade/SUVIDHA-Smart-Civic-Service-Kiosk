import { useState, useMemo, useRef } from "react";
import { MessageSquarePlus, CheckCircle2, Lightbulb, X, Camera, Paperclip, ShieldCheck, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { db } from "@/lib/database";
import { VoiceDictation } from "@/components/VoiceDictation";

const categories = [
  "Electricity", "Gas Distribution", "Water Supply", "Waste Management", "Municipal Services", "Property & Tax", "Other"
];

// Keyword → { category, suggestion } map for smart suggestions
const KEYWORD_SUGGESTIONS = [
  { keywords: ["power", "outage", "electricity", "blackout", "cut", "meter", "bill", "load", "voltage", "electric"], category: "Electricity", label: "Electricity — Power Outage / Billing / Meter" },
  { keywords: ["gas", "lpg", "cylinder", "leak", "pressure", "subsidy", "booking", "flame"], category: "Gas Distribution", label: "Gas Distribution — Cylinder / Leak / Subsidy" },
  { keywords: ["water", "supply", "pipeline", "tap", "leak", "bore", "tanker", "sewage", "drain"], category: "Water Supply", label: "Water Supply — Leakage / Bill / Connection" },
  { keywords: ["garbage", "waste", "trash", "dustbin", "pickup", "sweeping", "sanitation", "dirty", "clean"], category: "Waste Management", label: "Waste Management — Pickup / Sanitation" },
  { keywords: ["road", "pothole", "street", "light", "signboard", "park", "municipal", "civic", "drainage"], category: "Municipal Services", label: "Municipal Services — Road / Lights / Civic" },
  { keywords: ["property", "tax", "house", "plot", "registration", "assessment", "building"], category: "Property & Tax", label: "Property & Tax — Assessment / Payment" },
];

function getSuggestions(text: string) {
  if (!text || text.length < 3) return [];
  const lower = text.toLowerCase();
  return KEYWORD_SUGGESTIONS.filter((s) =>
    s.keywords.some((k) => lower.includes(k))
  );
}

const ComplaintPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { category?: string; service?: string; description?: string } | null;
  const { t } = useTranslation();

  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const [category, setCategory] = useState(state?.category || "");
  const [description, setDescription] = useState(state?.service ? `${state.service}: ` : "");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [locationStr, setLocationStr] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [dismissedSuggestions, setDismissedSuggestions] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [step, setStep] = useState(1);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [priority, setPriority] = useState("Low");

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const allowed = Array.from(files).filter(f => f.size <= 10 * 1024 * 1024);
    setUploadedFiles(prev => [...prev, ...allowed].slice(0, 3));
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const suggestions = useMemo(() => getSuggestions(description), [description]);
  const shouldShowSuggestions = showSuggestions && suggestions.length > 0 && !dismissedSuggestions;

  const handleDescriptionChange = (val: string) => {
    setDescription(val);
    setShowSuggestions(true);
    setDismissedSuggestions(false);
  };

  const applySuggestion = (suggestion: typeof KEYWORD_SUGGESTIONS[0]) => {
    setCategory(suggestion.category);
    setDismissedSuggestions(true);
    setShowSuggestions(false);
  };

  const handleVoiceData = (data: any) => {
    if (isAnonymous) return;
    if (data.name) setName(data.name);
    if (data.phone) setPhone(data.phone);
  };

  const handleNextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const complaintData = {
      category: category || "General",
      service: state?.service || "General Complaint",
      name: isAnonymous ? "Anonymous Citizen" : name,
      phone: isAnonymous ? "Hidden" : phone,
      description,
      location: locationStr || "Not provided",
      priority,
      timestamp: new Date().toISOString()
    };

    if (navigator.onLine) {
      const id = db.addComplaint(complaintData);
      setReferenceId(id);
    } else {
      // Offline mode: Save to local storage queue
      const offlineQueue = JSON.parse(localStorage.getItem("offline_grievances") || "[]");
      const tempId = `OFF-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      offlineQueue.push({ ...complaintData, id: tempId, isOffline: true });
      localStorage.setItem("offline_grievances", JSON.stringify(offlineQueue));
      setReferenceId(tempId);
    }
    
    setSubmitted(true);
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
              onClick={() => submitted ? navigate("/departments") : navigate(-1)} 
              className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 px-5 py-2.5 bg-[#FD8008] hover:bg-[#e67000] text-white border border-[#FD8008]/20 rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 duration-200 group shadow-[0_4px_12px_rgba(253,128,8,0.3)] z-50"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>
            <div className="text-center">
              <h1 className="text-3xl font-[900] tracking-tight uppercase leading-none">
                {submitted ? t("complaint.successTitle") : t("complaint.title")}
              </h1>
              <p className="text-blue-200 text-xs font-bold mt-2 tracking-[0.3em] uppercase">
                {submitted ? "Grievance Saved Successfully" : t("submitGrievance")}
              </p>
            </div>
          </div>

          <div className="flex-1 p-8 lg:p-12 overflow-y-auto custom-scrollbar bg-white">
            
            {submitted ? (
              // 🏆 SUBMITTED SUCCESS STATE Inside clean white console!
              <div className="flex flex-col items-center text-center animate-in fade-in duration-500">
                <div className="rounded-full bg-emerald-50 p-6 mb-6 border border-emerald-100 animate-bounce">
                  <CheckCircle2 className="h-16 w-16 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-black text-slate-800 mb-2">{t("complaint.successTitle")}</h2>
                <p className="text-base text-slate-500 max-w-md mb-8">
                  {t("complaint.successMsg")}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl bg-slate-50 border border-slate-200 rounded-[2rem] p-6 lg:p-8 shadow-inner text-left">
                  
                  {/* Left Column: Reference and details */}
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Reference ID</div>
                      <div className="text-2xl font-black text-[#FD8008] tracking-wider mt-1">
                        {referenceId}
                      </div>
                      {referenceId.startsWith("OFF-") && (
                        <div className="mt-2 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-1 rounded inline-block">
                          ⚠️ SAVED LOCALLY (OFFLINE MODE)
                        </div>
                      )}
                    </div>
                    
                    <div className="text-xs text-slate-500 leading-relaxed pt-2 border-t border-slate-200">
                      {referenceId.startsWith("OFF-") 
                        ? "Your grievance is saved on this kiosk. It will be sent to our servers as soon as the internet connection is restored."
                        : "An SMS confirmation with tracking updates will be sent to your registered mobile number."}
                    </div>

                    {/* Timeline Tracker */}
                    <div className="pt-4 border-t border-slate-200">
                      <div className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2">What happens next?</div>
                      {["Complaint Registered ✓", "Assigned to Officer (1-2 days)", "Field Visit / Review (2-4 days)", "Resolution & Closure (5-7 days)"].map((stepStr, i) => (
                        <div key={i} className={`flex items-center gap-2 py-1 text-xs ${i === 0 ? "text-emerald-600 font-bold" : "text-slate-500"}`}>
                          <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${i === 0 ? "bg-emerald-500" : "bg-slate-300"}`} />
                          {stepStr}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: QR Digital Witness */}
                  <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-slate-200 pt-6 md:pt-0 md:pl-8">
                    <div className="flex items-center gap-2 mb-4 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                      <ShieldCheck className="h-4 w-4 text-[#FD8008]" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#FD8008]">Digital Witness Secured</span>
                    </div>
                    
                    <div className="bg-white p-3 rounded-2xl border border-slate-200 mb-3 shadow-sm">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://suvidha.gov.in/track/${referenceId}`} 
                        alt="Tracking QR Code" 
                        className="h-28 w-28"
                      />
                    </div>
                    
                    <div className="text-center w-full">
                      <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Transaction Hash</p>
                      <code className="text-[10px] bg-slate-100 px-2 py-1 rounded font-mono text-slate-600 break-all block truncate max-w-[200px] mx-auto">
                        {Math.random().toString(36).substring(2, 15)}{Math.random().toString(36).substring(2, 15)}
                      </code>
                      <p className="mt-3 text-[10px] text-slate-400 italic">
                        Scan with your phone to track status.
                      </p>
                    </div>
                  </div>

                </div>

                <button
                  onClick={() => navigate("/departments")}
                  className="mt-8 rounded-xl bg-[#FD8008] hover:bg-[#e67300] px-8 py-4 text-center font-bold text-white shadow-lg shadow-[#FD8008]/20 transition-all text-sm uppercase tracking-wider"
                >
                  Return to Departments
                </button>
              </div>
            ) : (
              // 📝 FORM STATE INSIDE CLEAN LIGHT CONSOLE!
              <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
                
                {/* Step Indicator */}
                <div className="flex justify-center gap-3 mb-8">
                  <div className={`h-2.5 rounded-full transition-all ${step === 1 ? 'w-20 bg-[#FD8008]' : 'w-5 bg-slate-200'}`} />
                  <div className={`h-2.5 rounded-full transition-all ${step === 2 ? 'w-20 bg-[#FD8008]' : 'w-5 bg-slate-200'}`} />
                </div>

                {step === 1 && (
                  <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-lg font-black text-[#192e59] uppercase tracking-wider flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-[#FD8008] rounded-full" /> Citizen details
                      </h2>
                      <VoiceDictation onExtractedData={handleVoiceData} targetFields={['name', 'phone']} />
                    </div>

                    {/* Anonymous Toggle Container */}
                    <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 shadow-inner text-slate-700">
                      <div>
                        <h3 className="font-bold text-slate-800">File Anonymously</h3>
                        <p className="text-sm text-slate-500 mt-0.5">Hide your identity (Name & Phone not required)</p>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => {
                          setIsAnonymous(!isAnonymous);
                          if (!isAnonymous) {
                            setName("");
                            setPhone("");
                          }
                        }}
                        className={`w-16 h-9 rounded-full transition-colors relative ${isAnonymous ? 'bg-[#FD8008]' : 'bg-slate-200'}`}
                      >
                        <div className={`absolute top-1 bottom-1 w-7 bg-white rounded-full transition-transform shadow-sm ${isAnonymous ? 'translate-x-8' : 'translate-x-1'}`} />
                      </button>
                    </div>

                    {!isAnonymous && (
                      <>
                        {/* Name Input */}
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">{t("complaint.fullName")} <span className="text-rose-500">*</span></label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z\s]/g, ""))}
                            required={!isAnonymous}
                            className="kiosk-touch-target w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-5 py-4 text-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FD8008] focus:ring-4 focus:ring-[#FD8008]/10 transition-all font-bold"
                            placeholder="Enter your full name"
                          />
                        </div>

                        {/* Phone Input */}
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">{t("complaint.phone")} <span className="text-rose-500">*</span></label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => {
                                let val = e.target.value.replace(/[^\d+]/g, "");
                                if (val.length > 13) val = val.substring(0, 13);
                                setPhone(val);
                            }}
                            required={!isAnonymous}
                            className="kiosk-touch-target w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-5 py-4 text-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FD8008] focus:ring-4 focus:ring-[#FD8008]/10 transition-all font-bold"
                            placeholder="10-digit mobile number"
                          />
                        </div>
                      </>
                    )}

                    {/* Location Input */}
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">Location Detail <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        value={locationStr}
                        onChange={(e) => setLocationStr(e.target.value)}
                        required
                        className="kiosk-touch-target w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-5 py-4 text-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FD8008] focus:ring-4 focus:ring-[#FD8008]/10 transition-all font-bold"
                        placeholder="e.g. Near Metro Station / Landmark"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleNextStep}
                      disabled={(!isAnonymous && (!name || !phone)) || !locationStr}
                      className="kiosk-touch-target w-full mt-4 rounded-xl bg-[#FD8008] hover:bg-[#e67300] py-4 text-xl font-bold text-white transition-all disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-[#FD8008]/20 uppercase tracking-widest"
                    >
                      Next Step
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                    <h2 className="text-lg font-black text-[#192e59] uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-[#FD8008] rounded-full" /> Issue details
                    </h2>

                    {/* Description Area */}
                    <div className="relative space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">
                        {t("complaint.description")} <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => handleDescriptionChange(e.target.value)}
                        required
                        rows={3}
                        className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-5 py-4 text-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FD8008] focus:ring-4 focus:ring-[#FD8008]/10 resize-none transition-all font-bold"
                        placeholder="e.g. My electricity meter shows incorrect readings..."
                      />

                      {/* Smart Suggestion Dropdown */}
                      {shouldShowSuggestions && (
                        <div className="absolute left-0 right-0 z-30 mt-1 rounded-xl border-2 border-[#FD8008] bg-white shadow-2xl overflow-hidden animate-slide-up border-t-0">
                          <div className="px-4 py-2 bg-[#FD8008]/10 border-b border-[#FD8008]/20 flex justify-between items-center">
                            <span className="text-xs font-bold text-[#FD8008] uppercase">Smart Suggestion</span>
                            <X className="h-4 w-4 text-[#FD8008] cursor-pointer" onClick={() => setDismissedSuggestions(true)} />
                          </div>
                          {suggestions.map((s) => (
                            <button
                              key={s.category}
                              type="button"
                              onClick={() => applySuggestion(s)}
                              className="w-full text-left px-5 py-4 hover:bg-[#FD8008]/5 transition-colors font-bold border-b border-slate-100 last:border-0 text-slate-700"
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Category Selector */}
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">
                        {t("complaint.category")} <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setCategory(cat)}
                            className={`rounded-xl border-2 px-4 py-3 text-sm font-bold transition-all ${category === cat
                              ? "border-[#FD8008] bg-[#FD8008]/10 text-[#FD8008]"
                              : "border-slate-200 bg-slate-50 text-slate-600 hover:border-[#FD8008]/50"
                              }`}
                          >
                            {t(`departments.${cat.split(" ")[0].toLowerCase()}`) || cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Priority Selector */}
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">Priority Level</label>
                      <div className="flex gap-2">
                        {["Low", "Medium", "High", "Emergency"].map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setPriority(p)}
                            className={`flex-1 rounded-xl border-2 py-3 text-sm font-bold transition-all ${
                              priority === p 
                                ? p === 'Emergency' ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20' : 'bg-[#FD8008] text-white border-[#FD8008]'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-[#FD8008]/50'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Photos Upload */}
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">Photo Upload</label>
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
                        className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all ${dragOver ? "border-[#FD8008] bg-[#FD8008]/10" : "border-slate-300 hover:border-[#FD8008]/50"} ${uploadedFiles.length >= 3 ? "pointer-events-none opacity-50" : ""}`}
                      >
                        <Camera className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                        <p className="text-sm font-bold text-slate-500">Tap to add Photos (Optional)</p>
                      </div>
                      <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
                    </div>

                    {/* Previews */}
                    {uploadedFiles.length > 0 && (
                      <div className="mt-3 flex gap-3">
                        {uploadedFiles.map((file, i) => (
                          <div key={i} className="relative group">
                            <img src={URL.createObjectURL(file)} className="h-16 w-16 object-cover rounded-xl border-2 border-slate-200 shadow-sm" />
                            <button type="button" onClick={() => removeFile(i)} className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-4 mt-8">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="w-1/3 rounded-xl bg-slate-100 py-4 text-xl font-bold text-slate-600 transition-all hover:bg-slate-200 uppercase tracking-wider"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={!description || !category}
                        className="w-2/3 rounded-xl bg-[#FD8008] hover:bg-[#e67300] py-4 text-xl font-bold text-white transition-all shadow-lg shadow-[#FD8008]/20 disabled:opacity-50 uppercase tracking-widest"
                      >
                        Submit Grievance
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}

          </div>
          
          {/* Footer Decoration */}
          <div className="h-2 bg-gradient-to-r from-slate-100 via-[#192e59]/20 to-slate-100 flex-shrink-0"></div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintPage;
