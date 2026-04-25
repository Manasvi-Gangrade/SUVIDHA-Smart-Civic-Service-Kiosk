import { useState } from "react";
import { PlusCircle, FileText, CheckCircle2, ChevronRight, User, Home, UploadCloud, ScanFace, FileKey, ShieldCheck, Loader2, Gauge, MapPin, Zap } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ScannerOverlay from "../components/ScannerOverlay";
import { db } from "@/lib/database";
import { VoiceDictation } from "@/components/VoiceDictation";
import Receipt from "@/components/Receipt";

const ApplicationFormPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const state = location.state as { category?: string; service?: string } | null;
    const serviceType = state?.service?.toLowerCase() || "";

    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [referenceId, setReferenceId] = useState("");
    const [showScanner, setShowScanner] = useState(false);
    const [isDigilockerConnecting, setIsDigilockerConnecting] = useState(false);
    const [isDigilockerVerified, setIsDigilockerVerified] = useState(false);
    
    const [formData, setFormData] = useState({
        // Step 1: Personal
        name: "", aadhaar: "", phone: "",
        // Step 2: Service Specific
        address: "", pincode: "", city: "Guwahati",
        premisesType: "Domestic",
        requestedLoad: "2 kW",
        currentLoad: "2 kW",
        extensionReason: "",
        shiftingReason: "",
        // Step 3: Docs
        docFile: null as File | null
    });

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleVoiceData = (data: any) => {
        setFormData(prev => ({
            ...prev,
            ...(data.name && { name: data.name }),
            ...(data.phone && { phone: data.phone }),
            ...(data.aadhaar && { aadhaar: data.aadhaar }),
            ...(data.pincode && { pincode: data.pincode })
        }));
    };

    const handleDigilockerConnect = () => {
        setIsDigilockerConnecting(true);
        setTimeout(() => {
            setIsDigilockerConnecting(false);
            setIsDigilockerVerified(true);
            setFormData(prev => ({
                ...prev,
                address: "House No 42, Zoo Road, Guwahati",
                pincode: "781003",
                city: "Guwahati",
                docFile: new File(["mock content"], "Aadhaar_Verified_DigiLocker.pdf", { type: "application/pdf" })
            }));
        }, 2000);
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
            pincode: formData.pincode,
            status: "Submitted",
            date: new Date().toLocaleDateString()
        });

        setTimeout(() => {
            setReferenceId(id);
            setStep(4);
            setIsSubmitting(false);
        }, 2000);
    };

    // Step 4: Success & Receipt View
    if (step === 4) {
        return (
            <div className="min-h-screen bg-[#0f172a]/95 flex items-center justify-center p-6 backdrop-blur-sm">
                <Receipt 
                    transactionId={referenceId}
                    type={state?.service || "Service Application"}
                    date={new Date().toLocaleDateString()}
                    userName={formData.name}
                    details={[
                        { label: "Category", value: state?.category || "Civic" },
                        { label: "Phone", value: formData.phone },
                        { label: "Location", value: formData.city },
                        ...(serviceType.includes("load") ? [{ label: "New Load", value: formData.requestedLoad }] : []),
                        { label: "Status", value: "Awaiting Processing" }
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
                    <div className="rounded-3xl bg-white/10 p-5 backdrop-blur-md border border-white/20">
                        <PlusCircle className="h-10 w-10 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">{state?.service || "New Application"}</h1>
                        <p className="text-white/60 font-medium">{state?.category || "Department Service"}</p>
                    </div>
                </div>
            </div>

            <div className="container max-w-4xl py-12">
                {/* Stepper */}
                <div className="flex items-center justify-between mb-16 px-4">
                    {[1, 2, 3].map((num) => (
                        <div key={num} className="flex flex-col items-center gap-3 flex-1 relative">
                            {num < 3 && (
                                <div className={`absolute left-1/2 right-[-50%] top-6 h-1 -z-10 ${step > num ? 'bg-primary' : 'bg-white/10'}`} />
                            )}
                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black transition-all duration-500 shadow-xl border-4 border-[#0f172a]
                                ${step >= num ? "bg-primary text-primary-foreground scale-110 shadow-primary/40" : "bg-white/5 text-white/40 border-white/5"}`}>
                                {num === 1 && <User className="h-5 w-5" />}
                                {num === 2 && <Zap className="h-5 w-5" />}
                                {num === 3 && <UploadCloud className="h-5 w-5" />}
                            </div>
                            <span className={`text-xs font-bold uppercase tracking-widest ${step >= num ? "text-white" : "text-white/30"}`}>
                                {num === 1 ? "Personal" : num === 2 ? "Details" : "Documents"}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="bg-[#1e2e50]/40 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden p-8 md:p-12">
                    
                    {/* Step 1: Personal Details */}
                    {step === 1 && (
                        <div className="animate-in slide-in-from-right fade-in duration-500">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
                                <div>
                                    <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                                        <div className="w-1.5 h-8 bg-secondary rounded-full" /> Applicant Information
                                    </h2>
                                    <p className="text-white/50 font-medium mt-2">Enter your identification details below.</p>
                                </div>
                                <div className="flex gap-3">
                                    <VoiceDictation onExtractedData={handleVoiceData} targetFields={['name', 'phone', 'aadhaar', 'pincode']} />
                                    <button onClick={() => setShowScanner(true)} className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-2xl flex items-center gap-2 border border-white/10 transition-all font-bold">
                                        <ScanFace className="h-5 w-5" /> AI Scan
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-white/70 ml-1">Full Legal Name</label>
                                    <input 
                                        type="text" 
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                        placeholder="Enter name as on ID"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-white/70 ml-1">Aadhaar Number</label>
                                    <input 
                                        type="text" 
                                        value={formData.aadhaar}
                                        onChange={(e) => setFormData({...formData, aadhaar: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all outline-none font-mono"
                                        placeholder="XXXX-XXXX-XXXX"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-bold text-white/70 ml-1">Mobile Number</label>
                                    <input 
                                        type="tel" 
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                        placeholder="+91 XXXXX XXXXX"
                                    />
                                </div>
                            </div>

                            <div className="mt-12 flex justify-end">
                                <button 
                                    onClick={handleNext}
                                    disabled={!formData.name || !formData.aadhaar}
                                    className="bg-primary text-primary-foreground px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-3 shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
                                >
                                    Proceed <ChevronRight className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Service Specific Details */}
                    {step === 2 && (
                        <div className="animate-in slide-in-from-right fade-in duration-500">
                             <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3 mb-10">
                                <div className="w-1.5 h-8 bg-secondary rounded-full" /> {state?.service} Details
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-bold text-white/70 ml-1">Service Location / Address</label>
                                    <textarea 
                                        rows={3}
                                        value={formData.address}
                                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                                        placeholder="House No, Street, Landmark..."
                                    />
                                </div>

                                {serviceType.includes("new connection") && (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-white/70 ml-1">Premises Type</label>
                                            <select 
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-4 focus:ring-primary/20 outline-none"
                                                onChange={(e) => setFormData({...formData, premisesType: e.target.value})}
                                            >
                                                <option className="bg-slate-900">Domestic</option>
                                                <option className="bg-slate-900">Commercial</option>
                                                <option className="bg-slate-900">Industrial</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-white/70 ml-1">Requested Load</label>
                                            <select 
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-4 focus:ring-primary/20 outline-none"
                                                onChange={(e) => setFormData({...formData, requestedLoad: e.target.value})}
                                            >
                                                <option className="bg-slate-900">1 kW</option>
                                                <option className="bg-slate-900">2 kW</option>
                                                <option className="bg-slate-900">5 kW</option>
                                                <option className="bg-slate-900">10 kW+</option>
                                            </select>
                                        </div>
                                    </>
                                )}

                                {serviceType.includes("load") && (
                                     <>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-white/70 ml-1">Current Sanctioned Load</label>
                                            <input type="text" disabled value="2 kW" className="w-full bg-white/5 border border-white/5 opacity-50 rounded-2xl px-6 py-4 text-white" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-white/70 ml-1">Proposed New Load</label>
                                            <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none" placeholder="e.g. 5 kW" />
                                        </div>
                                     </>
                                )}
                            </div>

                            <div className="mt-12 flex justify-between">
                                <button onClick={handleBack} className="text-white/50 hover:text-white font-bold px-4 transition-all">Back</button>
                                <button 
                                    onClick={handleNext}
                                    className="bg-primary text-primary-foreground px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-3 shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
                                >
                                    Continue <ChevronRight className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Documents */}
                    {step === 3 && (
                        <div className="animate-in slide-in-from-right fade-in duration-500">
                             <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3 mb-10">
                                <div className="w-1.5 h-8 bg-secondary rounded-full" /> Document Verification
                            </h2>

                            <div className="space-y-8">
                                <div className="p-8 rounded-[2rem] bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10 flex flex-col md:flex-row gap-8 items-center">
                                    <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-md border border-white/20">
                                        <FileKey className="h-12 w-12 text-primary" />
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="text-xl font-bold text-white">Digital Document Locker</h3>
                                        <p className="text-white/50 mt-1">Connect your verified government locker to auto-import Identity and Address proof instantly.</p>
                                    </div>
                                    <button 
                                        onClick={handleDigilockerConnect}
                                        disabled={isDigilockerVerified || isDigilockerConnecting}
                                        className={`px-8 py-4 rounded-2xl font-black transition-all shadow-xl
                                            ${isDigilockerVerified ? 'bg-green-500 text-white' : 'bg-white text-slate-900 hover:scale-105'}`}
                                    >
                                        {isDigilockerConnecting ? "Linking..." : isDigilockerVerified ? "Verified ✅" : "Connect Locker"}
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="border-2 border-dashed border-white/10 rounded-[2rem] p-10 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                                        <UploadCloud className="h-10 w-10 text-white/30 mb-4" />
                                        <p className="text-white font-bold">Manual Upload</p>
                                        <p className="text-white/30 text-xs mt-1">PDF, JPG up to 10MB</p>
                                    </div>
                                    <div className="border-2 border-dashed border-white/10 rounded-[2rem] p-10 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                                        <ScanFace className="h-10 w-10 text-white/30 mb-4" />
                                        <p className="text-white font-bold">Physical Scan</p>
                                        <p className="text-white/30 text-xs mt-1">Use Kiosk Scanner Bed</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 flex justify-between items-center">
                                <button onClick={handleBack} className="text-white/50 hover:text-white font-bold px-4 transition-all">Back</button>
                                <button 
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="bg-secondary text-secondary-foreground px-12 py-5 rounded-2xl font-black text-xl flex items-center gap-3 shadow-xl shadow-secondary/40 hover:scale-105 active:scale-95 transition-all"
                                >
                                    {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : "Submit Application"}
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {showScanner && (
                <ScannerOverlay
                    scanType="aadhaar"
                    onClose={() => setShowScanner(false)}
                    onSuccess={(data) => {
                        setFormData(prev => ({ ...prev, name: data.name, aadhaar: data.aadhaar, address: data.address }));
                        setShowScanner(false);
                    }}
                />
            )}
        </div>
    );
};

export default ApplicationFormPage;
