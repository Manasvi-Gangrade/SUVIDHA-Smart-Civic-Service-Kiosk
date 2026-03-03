import { useState, useMemo, useRef } from "react";
import { MessageSquarePlus, CheckCircle2, Lightbulb, X, Camera, Paperclip } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { db } from "@/lib/database";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = db.addComplaint({
      category: category || "General",
      service: state?.service || "General Complaint",
      name,
      phone,
      description,
      location: locationStr || "Not provided"
    });
    setReferenceId(id);
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
            <div className="mt-3 text-xs text-muted-foreground leading-relaxed">
              An SMS confirmation will be sent to your registered mobile number within 5 minutes.
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

      <form onSubmit={handleSubmit} className="container max-w-xl py-10">
        <div className="space-y-6">

          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">{t("complaint.fullName")}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="kiosk-touch-target w-full rounded-xl border border-input bg-card px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              placeholder={t("complaint.fullName")}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">{t("complaint.phone")}</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="kiosk-touch-target w-full rounded-xl border border-input bg-card px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              placeholder="+91 XXXXX XXXXX"
            />
          </div>

          {/* Location */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">Location Detail</label>
            <input
              type="text"
              value={locationStr}
              onChange={(e) => setLocationStr(e.target.value)}
              required
              className="kiosk-touch-target w-full rounded-xl border border-input bg-card px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              placeholder="e.g. Near Metro Station / Landmark"
            />
          </div>

          {/* Description (BEFORE category — for smart suggestions) */}
          <div className="relative">
            <label className="mb-2 block text-sm font-semibold text-foreground">
              {t("complaint.description")}
              <span className="ml-2 text-xs font-normal text-muted-foreground">— describe your issue and we'll suggest the right department</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              required
              rows={4}
              className="w-full rounded-xl border border-input bg-card px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-shadow"
              placeholder="e.g. My electricity meter shows incorrect readings..."
            />

            {/* Smart Suggestion Dropdown */}
            {shouldShowSuggestions && (
              <div className="absolute left-0 right-0 z-30 mt-1 rounded-xl border border-secondary/30 bg-card shadow-xl overflow-hidden animate-slide-up">
                <div className="flex items-center justify-between px-3 py-2 bg-secondary/5 border-b border-secondary/10">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-secondary">
                    <Lightbulb className="h-3.5 w-3.5" />
                    Smart Suggestion — Select a department
                  </div>
                  <button
                    type="button"
                    onClick={() => setDismissedSuggestions(true)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                {suggestions.map((s) => (
                  <button
                    key={s.category}
                    type="button"
                    onClick={() => applySuggestion(s)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-secondary/5 transition-colors border-b border-border/50 last:border-0"
                  >
                    <span className="h-2 w-2 rounded-full bg-secondary flex-shrink-0" />
                    <span className="font-medium text-foreground">{s.label}</span>
                    <span className="ml-auto text-xs text-secondary font-semibold">Select →</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">
              {t("complaint.category")}
              {category && (
                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-secondary/10 text-secondary text-xs px-2 py-0.5 font-normal">
                  ✓ {category}
                </span>
              )}
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`kiosk-touch-target rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${category === cat
                    ? "border-secondary bg-secondary/10 text-secondary shadow-sm"
                    : "border-input bg-card text-muted-foreground hover:border-secondary/50 hover:text-foreground"
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
              {[
                { label: "Low", color: "text-kiosk-green border-kiosk-green/50 bg-kiosk-green/5" },
                { label: "Medium", color: "text-secondary border-secondary/50 bg-secondary/5" },
                { label: "High", color: "text-destructive border-destructive/50 bg-destructive/5" },
                { label: "Emergency", color: "text-destructive border-destructive bg-destructive/10 font-bold" },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  className={`flex-1 rounded-xl border py-2 text-xs font-semibold transition-all hover:shadow-sm ${p.color}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">
              <span className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-muted-foreground" />
                Attach Photos / Videos
                <span className="text-xs font-normal text-muted-foreground">(optional, max 3 files, 10MB each)</span>
              </span>
            </label>

            {/* Drop zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
              className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all ${dragOver ? "border-secondary bg-secondary/5" : "border-input hover:border-secondary/50 hover:bg-muted/30"} ${uploadedFiles.length >= 3 ? "pointer-events-none opacity-50" : ""}`}
            >
              <Paperclip className="mx-auto h-7 w-7 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {uploadedFiles.length >= 3 ? "Maximum 3 files uploaded" : "Drag & drop or click to upload"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Supports JPG, PNG, MP4, PDF</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*,.pdf"
              multiple
              className="hidden"
              onChange={(e) => addFiles(e.target.files)}
            />

            {/* Previews */}
            {uploadedFiles.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {uploadedFiles.map((file, i) => (
                  <div key={i} className="relative group">
                    {file.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="h-16 w-16 object-cover rounded-xl border border-border"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-xl border border-border bg-muted flex items-center justify-center">
                        <Paperclip className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <p className="text-[9px] text-muted-foreground mt-0.5 text-center w-16 truncate">{file.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="kiosk-touch-target w-full rounded-xl bg-secondary py-4 text-lg font-bold text-secondary-foreground transition-all hover:brightness-110 hover:shadow-xl hover:shadow-secondary/20 kiosk-glow"
          >
            {t("complaint.submit")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ComplaintPage;
