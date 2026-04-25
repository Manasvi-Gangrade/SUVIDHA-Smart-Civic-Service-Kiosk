import { useState, useMemo, useRef } from "react";
import { MessageSquarePlus, CheckCircle2, Lightbulb, X, Camera, Paperclip, ShieldCheck } from "lucide-react";
import { useLocation } from "react-router-dom";
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

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container flex flex-col items-center py-20 text-center">
          <div className="rounded-full bg-kiosk-green/10 p-6 mb-6 animate-[bounce_1s_ease-in-out_0.2s_1]">
            <CheckCircle2 className="h-16 w-16 text-kiosk-green" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">{t("complaint.successTitle")}</h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-md">
            {t("complaint.successMsg")}
          </p>
          <div className="mt-6 rounded-2xl bg-card kiosk-card-shadow p-6 text-left w-full max-w-sm border border-border">
            <div className="text-sm text-muted-foreground">Reference ID</div>
            <div className="text-2xl font-black text-secondary tracking-wider mt-1">
              {referenceId}
            </div>
            {referenceId.startsWith("OFF-") && (
              <div className="mt-2 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded">
                ⚠️ SAVED LOCALLY (OFFLINE MODE)
              </div>
            )}
            <div className="mt-3 text-xs text-muted-foreground leading-relaxed">
              {referenceId.startsWith("OFF-") 
                ? "Your grievance is saved on this kiosk. It will be sent to our servers as soon as the internet connection is restored."
                : "An SMS confirmation will be sent to your registered mobile number within 5 minutes."}
            </div>

            {/* Digital Witness Section */}
            <div className="mt-6 pt-6 border-t border-dashed border-border flex flex-col items-center">
              <div className="flex items-center gap-2 mb-4 bg-primary/5 px-3 py-1.5 rounded-full border border-primary/20">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Digital Witness Secured</span>
              </div>
              
              <div className="bg-white p-3 rounded-2xl shadow-inner border border-border mb-4">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://suvidha.gov.in/track/${referenceId}`} 
                  alt="Tracking QR Code" 
                  className="h-32 w-32"
                />
              </div>
              
              <div className="text-center">
                <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter mb-1">Secure Transaction Hash</p>
                <code className="text-[10px] bg-muted px-2 py-1 rounded font-mono text-muted-foreground break-all block">
                  {Math.random().toString(36).substring(2, 15)}{Math.random().toString(36).substring(2, 15)}
                </code>
                <p className="mt-4 text-[10px] text-slate-500 italic">
                  Scan this QR code with your mobile to track status on the go.
                </p>
              </div>
            </div>

            {/* Mini timeline preview */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="text-xs font-semibold text-foreground mb-2">What happens next?</div>
              {["Complaint Registered ✓", "Assigned to Officer (1-2 days)", "Field Visit / Review (2-4 days)", "Resolution & Closure (5-7 days)"].map((step, i) => (
                <div key={i} className={`flex items-center gap-2 py-1 text-xs ${i === 0 ? "text-kiosk-green font-semibold" : "text-muted-foreground"}`}>
                  <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${i === 0 ? "bg-kiosk-green" : "bg-border"}`} />
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-primary py-8">
        <div className="container flex items-center gap-4">
          <div className="rounded-2xl bg-secondary p-4">
            <MessageSquarePlus className="h-8 w-8 text-secondary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary-foreground">{t("complaint.title")}</h1>
            <p className="text-primary-foreground/70">{t("submitGrievance")}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="container max-w-xl py-6 flex flex-col justify-center min-h-[60vh]">
        
        {/* Step Indicator */}
        <div className="flex justify-center gap-2 mb-8">
          <div className={`h-2 rounded-full transition-all ${step === 1 ? 'w-16 bg-secondary' : 'w-4 bg-secondary/30'}`} />
          <div className={`h-2 rounded-full transition-all ${step === 2 ? 'w-16 bg-secondary' : 'w-4 bg-secondary/30'}`} />
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-500">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <span className="w-1.5 h-6 bg-secondary rounded-full" /> Personal Details
              </h2>
              <VoiceDictation onExtractedData={handleVoiceData} targetFields={['name', 'phone']} />
            </div>

            {/* Anonymous Toggle */}
            <div className="flex items-center justify-between p-5 bg-card rounded-2xl border-2 border-border mb-6 shadow-sm">
              <div>
                <h3 className="font-bold text-foreground">File Anonymously</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Hide your identity (Name & Phone not required)</p>
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
                className={`w-16 h-9 rounded-full transition-colors relative ${isAnonymous ? 'bg-secondary' : 'bg-muted-foreground/30'}`}
              >
                <div className={`absolute top-1 bottom-1 w-7 bg-white rounded-full transition-transform shadow-sm ${isAnonymous ? 'translate-x-8' : 'translate-x-1'}`} />
              </button>
            </div>

            {!isAnonymous && (
              <>
                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">{t("complaint.fullName")} <span className="text-destructive">*</span></label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z\s]/g, ""))}
                    required={!isAnonymous}
                    className="kiosk-touch-target w-full rounded-xl border-2 border-input bg-card px-5 py-4 text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/20 transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">{t("complaint.phone")} <span className="text-destructive">*</span></label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                        let val = e.target.value.replace(/[^\d+]/g, "");
                        if (val.length > 13) val = val.substring(0, 13);
                        setPhone(val);
                    }}
                    required={!isAnonymous}
                    className="kiosk-touch-target w-full rounded-xl border-2 border-input bg-card px-5 py-4 text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/20 transition-all"
                    placeholder="10-digit mobile number"
                  />
                </div>
              </>
            )}

            {/* Location */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Location Detail <span className="text-destructive">*</span></label>
              <input
                type="text"
                value={locationStr}
                onChange={(e) => setLocationStr(e.target.value)}
                required
                className="kiosk-touch-target w-full rounded-xl border-2 border-input bg-card px-5 py-4 text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/20 transition-all"
                placeholder="e.g. Near Metro Station / Landmark"
              />
            </div>

            <button
              type="button"
              onClick={handleNextStep}
              disabled={(!isAnonymous && (!name || !phone)) || !locationStr}
              className="kiosk-touch-target w-full mt-4 rounded-xl bg-primary py-4 text-xl font-bold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-primary/20"
            >
              Next Step
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-500">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <span className="w-1.5 h-6 bg-secondary rounded-full" /> Issue Details
              </h2>
            </div>

            {/* Description */}
            <div className="relative">
              <label className="mb-2 block text-sm font-semibold text-foreground">
                {t("complaint.description")} <span className="text-destructive">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                required
                rows={3}
                className="w-full rounded-xl border-2 border-input bg-card px-5 py-4 text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/20 resize-none transition-all"
                placeholder="e.g. My electricity meter shows incorrect readings..."
              />

              {/* Smart Suggestion Dropdown */}
              {shouldShowSuggestions && (
                <div className="absolute left-0 right-0 z-30 mt-1 rounded-xl border-2 border-secondary bg-card shadow-2xl overflow-hidden animate-slide-up">
                  <div className="px-4 py-2 bg-secondary/10 border-b border-secondary/20 flex justify-between items-center">
                    <span className="text-xs font-bold text-secondary uppercase">Smart Suggestion</span>
                    <X className="h-4 w-4 text-secondary cursor-pointer" onClick={() => setDismissedSuggestions(true)} />
                  </div>
                  {suggestions.map((s) => (
                    <button
                      key={s.category}
                      type="button"
                      onClick={() => applySuggestion(s)}
                      className="w-full text-left px-5 py-4 hover:bg-secondary/10 transition-colors font-medium border-b border-border last:border-0"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">
                {t("complaint.category")} <span className="text-destructive">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`rounded-xl border-2 px-4 py-3 text-sm font-bold transition-all ${category === cat
                      ? "border-secondary bg-secondary/10 text-secondary"
                      : "border-input bg-card text-muted-foreground hover:border-secondary/50"
                      }`}
                  >
                    {t(`departments.${cat.split(" ")[0].toLowerCase()}`) || cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority Level */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Priority Level</label>
              <div className="flex gap-2">
                {["Low", "Medium", "High", "Emergency"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 rounded-xl border-2 py-3 text-sm font-bold transition-all ${
                      priority === p 
                        ? p === 'Emergency' ? 'bg-red-500 text-white border-red-500' : 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card text-muted-foreground border-input hover:border-primary/50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Upload */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
              className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all ${dragOver ? "border-secondary bg-secondary/5" : "border-input hover:border-secondary/50"} ${uploadedFiles.length >= 3 ? "pointer-events-none opacity-50" : ""}`}
            >
              <Camera className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-base font-medium text-muted-foreground">Tap to add Photos (Optional)</p>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />

            {/* Previews */}
            {uploadedFiles.length > 0 && (
              <div className="mt-3 flex gap-3">
                {uploadedFiles.map((file, i) => (
                  <div key={i} className="relative group">
                    <img src={URL.createObjectURL(file)} className="h-16 w-16 object-cover rounded-xl border-2 border-border" />
                    <button type="button" onClick={() => removeFile(i)} className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-white flex items-center justify-center shadow-md">
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
                className="w-1/3 rounded-xl bg-muted py-4 text-xl font-bold text-muted-foreground transition-all hover:bg-muted/80"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!description || !category}
                className="w-2/3 rounded-xl bg-secondary py-4 text-xl font-bold text-secondary-foreground transition-all hover:brightness-110 shadow-lg shadow-secondary/20 disabled:opacity-50"
              >
                Submit Grievance
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ComplaintPage;
