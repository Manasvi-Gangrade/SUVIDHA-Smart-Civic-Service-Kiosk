import { useState } from "react";
import { PlusCircle, FileText, CheckCircle2, ChevronRight, User, Home, UploadCloud, ScanFace, FileKey, ShieldCheck, Loader2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ScannerOverlay from "../components/ScannerOverlay";
import { db } from "@/lib/database";

const ApplicationFormPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const state = location.state as { category?: string; service?: string } | null;

    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [referenceId, setReferenceId] = useState("");
    const [showScanner, setShowScanner] = useState(false);
    const [isDigilockerConnecting, setIsDigilockerConnecting] = useState(false);
    const [isDigilockerVerified, setIsDigilockerVerified] = useState(false);
    const [formData, setFormData] = useState({
        name: "", aadhaar: "", phone: "",
        address: "", pincode: "", city: "New Delhi",
        docFile: null as File | null
    });

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
    };

    const handleDigilockerConnect = () => {
        setIsDigilockerConnecting(true);
        // Simulate authentication delay
        setTimeout(() => {
            setIsDigilockerConnecting(false);
            setIsDigilockerVerified(true);
            setFormData(prev => ({
                ...prev,
                address: "Plot 42, Sector 15, New Delhi",
                pincode: "110015",
                city: "New Delhi",
                // Mock a File object for the UI
                docFile: new File(["mock content"], "Aadhaar_Verified_DigiLocker.pdf", { type: "application/pdf" })
            }));
        }, 3000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const id = db.addApplication({
            category: state?.category || "General",
            service: state?.service || "Application",
            name: formData.name,
            aadhaar: formData.aadhaar,
            phone: formData.phone,
            city: formData.city,
            pincode: formData.pincode
        });
        setTimeout(() => {
            setReferenceId(id);
            setStep(3);
            setIsSubmitting(false);
        }, 1500);
    };

    if (step === 3) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
                <div className="rounded-full bg-secondary/20 p-6 mb-6">
                    <CheckCircle2 className="h-20 w-20 text-secondary" />
                </div>
                <h1 className="text-4xl font-black text-foreground mb-4">{t("application.success")}</h1>
                <p className="text-lg text-muted-foreground mb-2 max-w-md">
                    {t("application.successDesc")}
                </p>

                <div className="mt-8 rounded-2xl bg-card border border-border p-8 max-w-sm w-full shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-full -z-10" />
                    <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mb-2">{t("application.trackingId")}</div>
                    <div className="text-3xl font-black text-primary tracking-widest bg-muted/50 py-3 rounded-lg border border-border">
                        {referenceId}
                    </div>
                    <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                        {t("application.saveIdInfo")}
                    </p>
                </div>

                <button
                    onClick={() => navigate("/")}
                    className="mt-10 rounded-xl bg-primary px-8 py-4 font-bold text-primary-foreground shadow-lg hover:brightness-110 transition-all"
                >
                    {t("complaint.returnHome")}
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="border-b border-border bg-primary py-8">
                <div className="container flex items-center gap-4">
                    <div className="rounded-2xl bg-secondary p-4">
                        <PlusCircle className="h-8 w-8 text-secondary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-primary-foreground">{state?.service || t("application.title")}</h1>
                        <p className="text-primary-foreground/70">{state?.category || "Civic Services"}</p>
                    </div>
                </div>
            </div>

            <div className="container max-w-2xl py-10">
                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-12 relative">
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-border -z-10" />
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-secondary transition-all duration-500 -z-10" style={{ width: step === 1 ? "0%" : "100%" }} />

                    <div className="flex flex-col items-center gap-2 bg-background px-2">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold border-4 border-background ${step >= 1 ? "bg-secondary text-secondary-foreground shadow-lg shadow-secondary/30" : "bg-muted text-muted-foreground"}`}>
                            <User className="h-4 w-4" />
                        </div>
                        <span className={`text-xs font-bold ${step >= 1 ? "text-foreground" : "text-muted-foreground"}`}>{t("application.step1")}</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 bg-background px-2">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold border-4 border-background ${step >= 2 ? "bg-secondary text-secondary-foreground shadow-lg shadow-secondary/30" : "bg-muted text-muted-foreground"}`}>
                            <Home className="h-4 w-4" />
                        </div>
                        <span className={`text-xs font-bold ${step >= 2 ? "text-foreground" : "text-muted-foreground"}`}>{t("application.step2")}</span>
                    </div>
                </div>

                <div className="bg-card rounded-2xl border border-border shadow-md overflow-hidden">
                    {step === 1 && (
                        <form onSubmit={handleNext} className="p-6 sm:p-8 animate-in slide-in-from-right fade-in">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-secondary rounded-full" /> {t("application.applicantDetails")}
                                </h2>
                                <button type="button" onClick={() => setShowScanner(true)} className="text-xs font-bold bg-primary/10 text-primary px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-primary/20 transition-colors shadow-sm">
                                    <ScanFace className="h-4 w-4" /> Scan Aadhaar
                                </button>
                            </div>
                            <div className="space-y-5">
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-foreground">{t("application.fullName")}</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-secondary focus:outline-none transition-shadow"
                                        placeholder="As per Government ID"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-semibold text-foreground">{t("application.aadhaar")}</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.aadhaar}
                                            onChange={(e) => setFormData({ ...formData, aadhaar: e.target.value })}
                                            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-secondary focus:outline-none transition-shadow uppercase font-mono"
                                            placeholder="XXXX-XXXX-XXXX"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-semibold text-foreground">{t("application.mobile")}</label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-secondary focus:outline-none transition-shadow"
                                            placeholder="+91"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end">
                                <button type="submit" className="rounded-xl bg-primary px-8 py-3.5 font-bold text-primary-foreground flex items-center gap-2 hover:brightness-110 transition-all">
                                    {t("application.next")} <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleSubmit} className="p-6 sm:p-8 animate-in slide-in-from-right fade-in">
                            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-secondary rounded-full" /> {t("application.locationDocs")}
                            </h2>
                            <div className="space-y-5">
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-foreground">{t("application.serviceAddress")}</label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-secondary focus:outline-none transition-shadow resize-none"
                                        placeholder="House No, Street, Landmark..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-semibold text-foreground">{t("application.city")}</label>
                                        <input
                                            type="text"
                                            disabled
                                            value={formData.city}
                                            className="w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm text-muted-foreground"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-semibold text-foreground">{t("application.pincode")}</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.pincode}
                                            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-secondary focus:outline-none transition-shadow font-mono"
                                            placeholder="e.g. 110001"
                                        />
                                    </div>
                                </div>

                                {/* DigiLocker Integration Block */}
                                <div className="p-5 mt-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-white p-2.5 rounded-xl shadow-sm border border-blue-100 shrink-0">
                                            {isDigilockerVerified ? (
                                                <ShieldCheck className="h-8 w-8 text-green-500" />
                                            ) : (
                                                <FileKey className="h-8 w-8 text-blue-600" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 my-0.5">Civic Document Locker</h3>
                                            <p className="text-sm text-gray-600 leading-tight">Securely import your verified ID, Address Proof, and Certificates.</p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleDigilockerConnect}
                                        disabled={isDigilockerVerified || isDigilockerConnecting}
                                        className={`shrink-0 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-sm
                                            ${isDigilockerVerified
                                                ? 'bg-green-100 text-green-700 border border-green-200 cursor-not-allowed'
                                                : isDigilockerConnecting
                                                    ? 'bg-blue-100 text-blue-600 border border-blue-200 cursor-wait'
                                                    : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 hover:shadow-md'
                                            }`}
                                    >
                                        {isDigilockerConnecting && <Loader2 className="h-4 w-4 animate-spin" />}
                                        {isDigilockerVerified ? "Verified via Locker" : isDigilockerConnecting ? "Authenticating..." : "Connect Locker"}
                                    </button>
                                </div>

                                <div className="pt-4 border-t border-border mt-2">
                                    <label className="mb-2 block text-sm font-semibold text-foreground flex justify-between items-center">
                                        {t("application.uploadProof")}
                                        {isDigilockerVerified && <span className="text-xs text-green-600 font-bold bg-green-100 px-2 py-0.5 rounded-full">Auto-Verified</span>}
                                    </label>
                                    <div className="border-2 border-dashed border-input rounded-xl p-6 flex flex-col items-center justify-center bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => document.getElementById('doc-upload')?.click()}>
                                        <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
                                        <span className="text-sm font-medium text-foreground">{t("application.tapUpload")}</span>
                                        <span className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG up to 5MB</span>
                                        <input type="file" id="doc-upload" className="hidden" onChange={(e) => {
                                            if (e.target.files?.[0]) {
                                                setFormData({ ...formData, docFile: e.target.files[0] });
                                            }
                                        }} />
                                    </div>
                                    {formData.docFile && (
                                        <div className="mt-3 flex items-center gap-2 p-3 bg-secondary/10 text-secondary rounded-lg text-sm font-medium">
                                            <FileText className="h-4 w-4" /> {formData.docFile.name}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8 flex items-center justify-between">
                                <button type="button" onClick={() => setStep(1)} className="px-6 py-3.5 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
                                    {t("application.back")}
                                </button>
                                <button type="submit" disabled={isSubmitting} className="rounded-xl bg-secondary px-8 py-3.5 font-bold text-secondary-foreground flex items-center gap-2 shadow-lg shadow-secondary/20 hover:brightness-110 transition-all disabled:opacity-70">
                                    {isSubmitting ? (
                                        <><span className="h-4 w-4 border-2 border-secondary-foreground/30 border-t-secondary-foreground rounded-full animate-spin" /> {t("application.submitting")}</>
                                    ) : (
                                        <><CheckCircle2 className="h-4 w-4" /> {t("application.submit")}</>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {showScanner && (
                <ScannerOverlay
                    scanType="aadhaar"
                    onClose={() => setShowScanner(false)}
                    onSuccess={(data) => {
                        setFormData(prev => ({
                            ...prev,
                            name: data.name,
                            aadhaar: data.aadhaar,
                            address: data.address
                        }));
                    }}
                />
            )}
        </div>
    );
};

export default ApplicationFormPage;
