import { useState, useEffect } from "react";
import { ArrowLeft, PlusCircle, FileText, CheckCircle2, ChevronRight, User, Home, UploadCloud, ScanFace, FileKey, ShieldCheck, Loader2, Gauge, MapPin, Zap, QrCode, Printer, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ScannerOverlay from "../components/ScannerOverlay";
import { db } from "@/lib/database";
import { VoiceDictation } from "@/components/VoiceDictation";
import Receipt from "@/components/Receipt";
import { isFirebaseConfigured, db as firestore } from "../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useLocationTracker } from "../context/LocationContext";

const ApplicationFormPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { address } = useLocationTracker();

    const state = location.state as { category?: string; service?: string } | null;
    const serviceType = state?.service?.toLowerCase() || "";
    const isElectricityService = state?.category?.toLowerCase().includes("electric") || serviceType.includes("connection") || serviceType.includes("load");

    const [localServiceType, setLocalServiceType] = useState(
        serviceType.includes("load") ? "load extension" : "new connection"
    );

    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
    const [referenceId, setReferenceId] = useState("");
    const [showScanner, setShowScanner] = useState(false);
    const [isDigilockerConnecting, setIsDigilockerConnecting] = useState(false);
    const [isDigilockerVerified, setIsDigilockerVerified] = useState(false);
    const [uploadedDocs, setUploadedDocs] = useState({
        identityProof: null as string | null,
        ownershipProof: null as string | null,
    });
    const [activeQrModal, setActiveQrModal] = useState<"identity" | "ownership" | null>(null);
    const [sessionId] = useState(() => "session_" + Math.floor(Math.random() * 900000 + 100000));
    const [kioskIp, setKioskIp] = useState(() => localStorage.getItem("suvidha_kiosk_ip") || window.location.hostname);

    const dataURLtoFile = (dataurl: string, filename: string) => {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
    };

    useEffect(() => {
        if (!isFirebaseConfigured || !firestore) return;

        const unsubscribeIdentity = onSnapshot(
            doc(firestore, "mobile_uploads", `${sessionId}_identity`),
            (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.uploaded && data.fileName) {
                        setUploadedDocs(prev => ({ ...prev, identityProof: data.fileName }));
                        if (data.fileData) {
                            try {
                                const file = dataURLtoFile(data.fileData, data.fileName);
                                setFormData(prev => ({ ...prev, identityFile: file }));
                            } catch (e) {
                                console.error("Error recreating file from base64", e);
                            }
                        }
                        setActiveQrModal(null);
                    }
                }
            }
        );

        const unsubscribeOwnership = onSnapshot(
            doc(firestore, "mobile_uploads", `${sessionId}_ownership`),
            (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.uploaded && data.fileName) {
                        setUploadedDocs(prev => ({ ...prev, ownershipProof: data.fileName }));
                        if (data.fileData) {
                            try {
                                const file = dataURLtoFile(data.fileData, data.fileName);
                                setFormData(prev => ({ ...prev, ownershipFile: file }));
                            } catch (e) {
                                console.error("Error recreating file from base64", e);
                            }
                        }
                        setActiveQrModal(null);
                    }
                }
            }
        );

        return () => {
            unsubscribeIdentity();
            unsubscribeOwnership();
        };
    }, [sessionId]);

    const [formData, setFormData] = useState({
        // Step 1: Personal
        firstName: "", lastName: "", fatherHusbandName: "", aadhaar: "", phone: "",
        // Step 2: Service Specific
        address: "", pincode: "", city: "Guwahati",
        occupancyType: "Owned",
        connectionCategory: "Domestic",
        requestedLoad: "",
        currentLoad: "2 kW",
        extensionReason: "",
        shiftingReason: "",
        // Step 3: Docs
        identityFile: null as File | null,
        ownershipFile: null as File | null
    });

    // Auto-fill city and pincode based on detected address
    useEffect(() => {
        if (address) {
            setFormData(prev => ({
                ...prev,
                city: address.city || prev.city,
                pincode: address.postcode || prev.pincode || ""
            }));
        }
    }, [address]);

    const mockAddresses = [
        "Zoo Road, Guwahati, Assam 781005",
        "Ganeshguri, Guwahati, Assam 781006",
        "Dispur, Guwahati, Assam 781005",
        "Paltan Bazaar, Guwahati, Assam 781008",
        "Chandmari, Guwahati, Assam 781003",
        "Uzan Bazaar, Guwahati, Assam 781001",
        "Six Mile, Guwahati, Assam 781022",
        "Maligaon, Guwahati, Assam 781011",
        "Jalukbari, Guwahati, Assam 781013",
        "Fancy Bazaar, Guwahati, Assam 781001",
        "Beltola, Guwahati, Assam 781028"
    ];

    const filteredAddresses = formData.address.length > 2
        ? mockAddresses.filter(addr => addr.toLowerCase().includes(formData.address.toLowerCase()))
        : [];

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleVoiceData = (data: any) => {
        setFormData(prev => ({
            ...prev,
            ...(data.name && { firstName: data.name.split(' ')[0] || '', lastName: data.name.split(' ').slice(1).join(' ') || '' }),
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
            setUploadedDocs({
                identityProof: "Aadhaar_Verified_DigiLocker.pdf",
                ownershipProof: "Property_Tax_Verified_DigiLocker.pdf"
            });
            setFormData(prev => ({
                ...prev,
                address: "House No 42, Zoo Road, Guwahati",
                pincode: "781003",
                city: "Guwahati",
                identityFile: new File(["mock content"], "Aadhaar_Verified_DigiLocker.pdf", { type: "application/pdf" }),
                ownershipFile: new File(["mock content"], "Property_Tax_Verified_DigiLocker.pdf", { type: "application/pdf" })
            }));
        }, 2000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const id = db.addApplication({
            category: state?.category || "General",
            service: state?.service || "Application",
            name: `${formData.firstName} ${formData.lastName}`.trim(),
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

    // Step 4: Success & Receipt View (Wrapped in beautiful custom layout)
    if (step === 4) {
        return (
            <div className="h-full bg-gradient-to-br from-[#0f172a] via-[#192e59] to-[#0f172a] flex flex-col relative overflow-hidden font-sans">
                {/* Background Video Overlay */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-30 mix-blend-overlay">
                        <source src="/videos/14904045_3840_2160_30fps.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-[#192e59]/20" />
                </div>

                <div className="flex-1 w-full px-[5%] max-w-none relative z-10 flex items-center justify-center p-6">
                    <div className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(25,46,89,0.2)] border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="bg-[#192e59] p-8 text-white relative flex-shrink-0 text-center">
                            <h1 className="text-3xl font-[900] tracking-tight uppercase leading-none">Application Submitted Successfully</h1>
                            <p className="text-blue-200 text-xs font-bold mt-2 tracking-[0.3em] uppercase">Your request is under review</p>
                        </div>
                        
                        {/* Content Grid */}
                        <div className="flex-1 p-8 lg:p-12 overflow-y-auto custom-scrollbar bg-white grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            {/* Left Column: Confirmation & Actions */}
                            <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left space-y-6">
                                <div className="h-20 w-20 bg-emerald-50 rounded-full flex items-center justify-center border-4 border-emerald-500/20 shadow-md">
                                    <CheckCircle2 className="h-10 w-10 text-emerald-600 animate-pulse" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-[900] text-slate-800 uppercase tracking-tight leading-tight">Thank You, {formData.firstName}!</h2>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-2 leading-relaxed">
                                        Your service application has been registered in our municipal database. A field agent will contact you shortly to schedule site verification.
                                    </p>
                                </div>
                                <div className="space-y-3 w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl">
                                    <div className="flex items-center gap-2.5 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                        Expected TAT: <span className="text-slate-800 font-black">7 Working Days</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                        <div className="w-2 h-2 bg-[#FD8008] rounded-full animate-ping" />
                                        Category: <span className="text-slate-800 font-black">{state?.category || "Electricity"}</span>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-4 w-full pt-4">
                                    <button 
                                        onClick={() => window.print()}
                                        className="flex-1 min-w-[140px] bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-slate-900/10 text-sm uppercase tracking-wider"
                                    >
                                        <Printer className="h-5 w-5" /> Print Copy
                                    </button>
                                    <button 
                                        onClick={() => navigate("/")}
                                        className="flex-1 min-w-[140px] bg-[#FD8008] hover:bg-[#e67300] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#FD8008]/20 text-sm uppercase tracking-wider"
                                    >
                                        Finish Flow
                                    </button>
                                </div>
                            </div>

                            {/* Right Column: Receipt View */}
                            <div className="flex items-center justify-center bg-slate-50 border border-slate-100 p-6 rounded-[2rem] shadow-inner">
                                <Receipt
                                    transactionId={referenceId}
                                    type={state?.service || "Service Application"}
                                    date={new Date().toLocaleDateString()}
                                    userName={`${formData.firstName} ${formData.lastName}`.trim()}
                                    details={[
                                        { label: "Category", value: state?.category || "Civic" },
                                        { label: "Phone", value: formData.phone },
                                        { label: "Address", value: formData.city },
                                        ...(formData.connectionCategory ? [{ label: "Connection Type", value: formData.connectionCategory }] : []),
                                        ...(formData.occupancyType ? [{ label: "Occupancy", value: formData.occupancyType }] : []),
                                        ...(formData.requestedLoad ? [{ label: "Sanctioned Load", value: `${formData.requestedLoad} kW` }] : []),
                                        { label: "Status", value: "Under Review" }
                                    ]}
                                    onClose={() => navigate("/")}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-gradient-to-br from-[#0f172a] via-[#192e59] to-[#0f172a] flex flex-col relative overflow-hidden font-sans">
            
            {/* Background Video Overlay */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-30 mix-blend-overlay">
                    <source src="/videos/14904045_3840_2160_30fps.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-[#192e59]/20" />
            </div>

            <div className="flex-1 w-full px-[5%] max-w-none relative z-10 flex items-center justify-center p-6">
                <div className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(25,46,89,0.2)] border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
                    
                    {/* Header Section */}
                    <div className="bg-[#192e59] p-8 text-white relative flex-shrink-0">
                        <button 
                            onClick={() => navigate(-1)} 
                            className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2 px-5 py-2.5 bg-[#FD8008] hover:bg-[#e67000] text-white border border-[#FD8008]/20 rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 duration-200 group shadow-[0_4px_12px_rgba(253,128,8,0.3)] z-50"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span>Back</span>
                        </button>
                        <div className="text-center">
                            <h1 className="text-3xl font-[900] tracking-tight uppercase leading-none">{state?.service || "New Application"}</h1>
                            <p className="text-blue-200 text-xs font-bold mt-2 tracking-[0.3em] uppercase">{state?.category || "Department Service"}</p>
                        </div>
                    </div>

                    <div className="flex-1 p-8 lg:p-12 overflow-y-auto custom-scrollbar bg-white">
                        
                        {/* 🚀 HYPER-PREMIUM STEP PROGRESS INDICATOR */}
                        <div className="w-full max-w-2xl mx-auto mb-14 mt-2 px-4 relative z-10">
                            <div className="relative flex items-center justify-between">
                                
                                {/* Background Progress Line */}
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 rounded-full z-0" />
                                
                                {/* Active Progress Line Overlay */}
                                <div 
                                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-[#FD8008] to-orange-400 rounded-full z-0 transition-all duration-500 ease-in-out" 
                                    style={{ width: `${((step - 1) / (3 - 1)) * 100}%` }}
                                />

                                {[
                                    { number: 1, label: "Personal Details", icon: User },
                                    { number: 2, label: "Service Details", icon: Zap },
                                    { number: 3, label: "Upload Documents", icon: UploadCloud }
                                ].map((s) => {
                                    const isCompleted = step > s.number;
                                    const isActive = step === s.number;
                                    const isRemaining = step < s.number;

                                    return (
                                        <div key={s.number} className="relative z-10 flex flex-col items-center flex-1">
                                            
                                            {/* Step Bubble */}
                                            <div 
                                                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 shadow-md relative
                                                    ${isCompleted 
                                                        ? "bg-[#FD8008] border-[#FD8008] text-white scale-115 shadow-lg shadow-[#FD8008]/20" 
                                                        : isActive 
                                                            ? "bg-white border-[#FD8008] text-[#FD8008] ring-4 ring-[#FD8008]/20 scale-115 shadow-md" 
                                                            : "bg-white border-slate-200 text-slate-400"
                                                    }`}
                                            >
                                                {isCompleted ? (
                                                    <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="3">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <s.icon className="h-5 w-5 stroke-[2.2]" />
                                                )}

                                                {/* Pulsing glow ring for active step */}
                                                {isActive && (
                                                    <span className="absolute inset-0 rounded-2xl bg-[#FD8008]/30 animate-ping opacity-75 pointer-events-none" style={{ animationDuration: '2s' }} />
                                                )}
                                            </div>

                                            {/* Step Text Label */}
                                            <span 
                                                className={`absolute top-14 whitespace-nowrap text-[10px] font-black uppercase tracking-widest transition-all duration-300
                                                    ${isActive ? "text-[#192e59]" : isCompleted ? "text-[#FD8008]" : "text-slate-400"}`}
                                            >
                                                {s.label}
                                            </span>

                                        </div>
                                    );
                                })}

                            </div>
                        </div>

                        {/* Step 1: Personal Details */}
                        {step === 1 && (
                            <div className="animate-in slide-in-from-right fade-in duration-500">
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
                                    <div>
                                        <h2 className="text-xl font-black text-[#192e59] uppercase tracking-wider flex items-center gap-2">
                                            <div className="w-1.5 h-6 bg-[#FD8008] rounded-full" /> Applicant Information
                                        </h2>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-2">Enter your identification details below.</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <VoiceDictation onExtractedData={handleVoiceData} targetFields={['name', 'phone', 'aadhaar', 'pincode']} />
                                        <button onClick={() => setShowScanner(true)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-2xl flex items-center gap-2 border border-slate-200 transition-all font-bold">
                                            <ScanFace className="h-5 w-5 text-[#FD8008]" /> AI Scan
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                                        <input
                                            type="text"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value.replace(/[^a-zA-Z\s]/g, '') })}
                                            className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-4 text-lg text-slate-800 placeholder:text-slate-300 focus:ring-4 focus:ring-[#FD8008]/10 focus:border-[#FD8008] transition-all outline-none font-bold"
                                            placeholder="Enter First Name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                                        <input
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value.replace(/[^a-zA-Z\s]/g, '') })}
                                            className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-4 text-lg text-slate-800 placeholder:text-slate-300 focus:ring-4 focus:ring-[#FD8008]/10 focus:border-[#FD8008] transition-all outline-none font-bold"
                                            placeholder="Enter Last Name"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Father / Husband Name</label>
                                        <input
                                            type="text"
                                            value={formData.fatherHusbandName}
                                            onChange={(e) => setFormData({ ...formData, fatherHusbandName: e.target.value.replace(/[^a-zA-Z\s]/g, '') })}
                                            className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-4 text-lg text-slate-800 placeholder:text-slate-300 focus:ring-4 focus:ring-[#FD8008]/10 focus:border-[#FD8008] transition-all outline-none font-bold"
                                            placeholder="Enter Father or Husband Name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Aadhaar Number (12 Digits)</label>
                                        <input
                                            type="text"
                                            value={formData.aadhaar}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                if (val.length <= 12) setFormData({ ...formData, aadhaar: val });
                                            }}
                                            maxLength={12}
                                            className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-4 text-slate-800 focus:ring-4 focus:ring-[#FD8008]/10 focus:border-[#FD8008] transition-all outline-none font-mono text-xl font-bold placeholder:text-slate-300 tracking-wider"
                                            placeholder="XXXX-XXXX-XXXX"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Number</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                if (val.length <= 10) setFormData({ ...formData, phone: val });
                                            }}
                                            maxLength={10}
                                            className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-4 text-slate-800 focus:ring-4 focus:ring-[#FD8008]/10 focus:border-[#FD8008] transition-all outline-none font-mono text-xl font-bold placeholder:text-slate-300 tracking-widest"
                                            placeholder="+91 XXXXX XXXXX"
                                        />
                                    </div>
                                </div>

                                <div className="mt-12 flex justify-end">
                                    <button
                                        onClick={handleNext}
                                        disabled={!formData.firstName || !formData.lastName || formData.aadhaar.length !== 12 || formData.phone.length !== 10}
                                        className="bg-[#FD8008] hover:bg-[#e67300] text-white px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-3 shadow-xl shadow-[#FD8008]/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none uppercase tracking-wider"
                                    >
                                        Proceed <ChevronRight className="h-6 w-6 animate-pulse" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Service Specific Details */}
                        {step === 2 && (
                            <div className="animate-in slide-in-from-right fade-in duration-500">
                                <h2 className="text-xl font-black text-[#192e59] uppercase tracking-wider flex items-center gap-2 mb-10">
                                    <div className="w-1.5 h-6 bg-[#FD8008] rounded-full" /> {state?.service} Details
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2 md:col-span-2 relative">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Service Location / Address</label>
                                        <textarea
                                            rows={3}
                                            value={formData.address}
                                            onChange={(e) => {
                                                setFormData({ ...formData, address: e.target.value });
                                                setShowAddressSuggestions(true);
                                            }}
                                            onFocus={() => setShowAddressSuggestions(true)}
                                            onBlur={() => setTimeout(() => setShowAddressSuggestions(false), 200)}
                                            className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-4 text-slate-800 focus:ring-4 focus:ring-[#FD8008]/10 focus:border-[#FD8008] transition-all outline-none resize-none font-bold"
                                            placeholder="House No, Street, Landmark..."
                                        />
                                        {showAddressSuggestions && filteredAddresses.length > 0 && (
                                            <div className="absolute top-full left-0 w-full mt-2 bg-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-2xl z-50 animate-slide-up">
                                                {filteredAddresses.map((addr, idx) => (
                                                    <div
                                                        key={idx}
                                                        onClick={() => {
                                                            setFormData({ ...formData, address: addr });
                                                            setShowAddressSuggestions(false);
                                                        }}
                                                        className="px-6 py-4 hover:bg-slate-50 cursor-pointer transition-all flex items-center gap-3 border-b border-slate-100 last:border-0"
                                                    >
                                                        <MapPin className="h-5 w-5 text-[#FD8008] shrink-0 animate-bounce" />
                                                        <span className="text-slate-700 text-sm font-bold">{addr}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* occupancy fields */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Type of Occupancy</label>
                                        <select
                                            className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-4 text-slate-700 focus:ring-4 focus:ring-[#FD8008]/10 outline-none font-bold"
                                            value={formData.occupancyType}
                                            onChange={(e) => setFormData({ ...formData, occupancyType: e.target.value })}
                                        >
                                            <option className="bg-white text-slate-700">Owned</option>
                                            <option className="bg-white text-slate-700">Rented</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Connection Category</label>
                                        <select
                                            className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-4 text-slate-700 focus:ring-4 focus:ring-[#FD8008]/10 outline-none font-bold"
                                            value={formData.connectionCategory}
                                            onChange={(e) => setFormData({ ...formData, connectionCategory: e.target.value })}
                                        >
                                            <option className="bg-white text-slate-700">Domestic</option>
                                            <option className="bg-white text-slate-700">Commercial</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Sanctioned Load Requirement (kW)</label>
                                        <input 
                                            type="text"
                                            value={formData.requestedLoad}
                                            onChange={(e) => setFormData({ ...formData, requestedLoad: e.target.value.replace(/[^0-9.]/g, '') })}
                                            className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-4 text-lg text-slate-800 focus:ring-4 focus:ring-[#FD8008]/10 focus:border-[#FD8008] transition-all outline-none font-bold"
                                            placeholder="Enter load in kW (e.g. 5)"
                                        />
                                    </div>
                                </div>

                                <div className="mt-12 flex justify-between">
                                    <button onClick={handleBack} className="text-slate-400 hover:text-slate-800 font-black uppercase tracking-wider px-4 transition-all">Back</button>
                                    <button
                                        onClick={handleNext}
                                        className="bg-[#FD8008] hover:bg-[#e67300] text-white px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-3 shadow-xl shadow-[#FD8008]/30 hover:scale-105 active:scale-95 transition-all uppercase tracking-wider"
                                    >
                                        Continue <ChevronRight className="h-6 w-6 animate-pulse" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Documents */}
                        {step === 3 && (
                            <div className="animate-in slide-in-from-right fade-in duration-500">
                                <h2 className="text-xl font-black text-[#192e59] uppercase tracking-wider flex items-center gap-2 mb-10">
                                    <div className="w-1.5 h-6 bg-[#FD8008] rounded-full" /> Document Verification
                                </h2>

                                <div className="space-y-8">
                                    <div className="p-8 rounded-[2rem] bg-gradient-to-br from-[#FD8008]/10 to-slate-50 border border-slate-100 flex flex-col md:flex-row gap-8 items-center">
                                        <div className="bg-slate-100 p-5 rounded-3xl border border-slate-200">
                                            <FileKey className="h-12 w-12 text-[#FD8008]" />
                                        </div>
                                        <div className="flex-1 text-center md:text-left">
                                            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Digital Document Locker</h3>
                                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-2">Connect your verified government locker to auto-import Identity and Address proof instantly.</p>
                                        </div>
                                        <button
                                            onClick={handleDigilockerConnect}
                                            disabled={isDigilockerVerified || isDigilockerConnecting}
                                            className={`px-8 py-4 rounded-2xl font-black transition-all shadow-xl uppercase tracking-wider
                                                ${isDigilockerVerified ? 'bg-emerald-600 text-white shadow-emerald-500/20' : 'bg-[#FD8008] hover:bg-[#e67300] text-white hover:scale-105 shadow-[#FD8008]/20'}`}
                                        >
                                            {isDigilockerConnecting ? "Linking..." : isDigilockerVerified ? "Verified ✅" : "Connect Locker"}
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer relative overflow-hidden group text-center">
                                            <div className="absolute inset-0 bg-[#FD8008]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                                            {uploadedDocs.identityProof ? (
                                                <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-4 scale-110 duration-500" />
                                            ) : (
                                                <QrCode className="h-12 w-12 text-slate-300 mb-4 group-hover:text-[#FD8008] transition-colors group-hover:scale-110 duration-500" />
                                            )}
                                            <p className="text-slate-700 font-black uppercase tracking-tight relative z-10 text-sm">Scan QR to Upload Identity Proof</p>
                                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-2 relative z-10 leading-relaxed">Aadhaar / PAN<br />(Secure Mobile Upload)</p>
                                            {uploadedDocs.identityProof ? (
                                                <div className="mt-6 flex flex-col items-center gap-2 relative z-10">
                                                    <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                                                        {uploadedDocs.identityProof}
                                                    </span>
                                                    <button 
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setUploadedDocs(prev => ({ ...prev, identityProof: null }));
                                                            setFormData(prev => ({ ...prev, identityFile: null }));
                                                        }}
                                                        className="text-rose-500 hover:text-rose-700 text-[10px] font-black uppercase tracking-widest hover:underline transition-all"
                                                    >
                                                        Remove & Re-upload
                                                    </button>
                                                </div>
                                            ) : (
                                                <button 
                                                    type="button"
                                                    onClick={() => setActiveQrModal("identity")} 
                                                    className="mt-6 bg-[#FD8008] hover:bg-[#e67300] px-6 py-2.5 rounded-xl text-[10px] font-black text-white hover:bg-[#e67300] transition-colors shadow-lg relative z-10 uppercase tracking-widest"
                                                >
                                                    Show QR Code
                                                </button>
                                            )}
                                        </div>
                                        <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer relative overflow-hidden group text-center">
                                            <div className="absolute inset-0 bg-[#FD8008]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                                            {uploadedDocs.ownershipProof ? (
                                                <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-4 scale-110 duration-500" />
                                            ) : (
                                                <QrCode className="h-12 w-12 text-slate-300 mb-4 group-hover:text-[#FD8008] transition-colors group-hover:scale-110 duration-500" />
                                            )}
                                            <p className="text-slate-700 font-black uppercase tracking-tight relative z-10 text-sm">Scan QR to Upload Ownership Proof</p>
                                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-2 relative z-10 leading-relaxed">Registry Papers / Tax Receipt<br />(Secure Mobile Upload)</p>
                                            {uploadedDocs.ownershipProof ? (
                                                <div className="mt-6 flex flex-col items-center gap-2 relative z-10">
                                                    <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                                                        {uploadedDocs.ownershipProof}
                                                    </span>
                                                    <button 
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setUploadedDocs(prev => ({ ...prev, ownershipProof: null }));
                                                            setFormData(prev => ({ ...prev, ownershipFile: null }));
                                                        }}
                                                        className="text-rose-500 hover:text-rose-700 text-[10px] font-black uppercase tracking-widest hover:underline transition-all"
                                                    >
                                                        Remove & Re-upload
                                                    </button>
                                                </div>
                                            ) : (
                                                <button 
                                                    type="button"
                                                    onClick={() => setActiveQrModal("ownership")} 
                                                    className="mt-6 bg-[#FD8008] hover:bg-[#e67300] px-6 py-2.5 rounded-xl text-[10px] font-black text-white hover:bg-[#e67300] transition-colors shadow-lg relative z-10 uppercase tracking-widest"
                                                >
                                                    Show QR Code
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 flex justify-between items-center">
                                    <button onClick={handleBack} className="text-slate-400 hover:text-slate-800 font-black uppercase tracking-wider px-4 transition-all">Back</button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="bg-[#FD8008] hover:bg-[#e67300] text-white px-12 py-5 rounded-2xl font-black text-xl flex items-center gap-3 shadow-xl shadow-[#FD8008]/40 hover:scale-105 active:scale-95 transition-all uppercase tracking-wider"
                                    >
                                        {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin text-white" /> : "Submit Application"}
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                    
                    {/* Footer Decoration */}
                    <div className="h-2 bg-gradient-to-r from-slate-100 via-[#192e59]/20 to-slate-100 flex-shrink-0"></div>
                </div>
            </div>

            {showScanner && (
                <ScannerOverlay
                    scanType="aadhaar"
                    onClose={() => setShowScanner(false)}
                    onSuccess={(data) => {
                        setFormData(prev => ({ 
                            ...prev, 
                            firstName: data.name?.split(' ')[0] || "", 
                            lastName: data.name?.split(' ').slice(1).join(' ') || "", 
                            aadhaar: data.aadhaar, 
                            address: data.address 
                        }));
                        setShowScanner(false);
                    }}
                />
            )}

            {activeQrModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-center relative flex flex-col items-center">
                        <button
                            type="button"
                            onClick={() => setActiveQrModal(null)}
                            className="absolute right-6 top-6 rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <h3 className="text-xl font-[900] text-[#192e59] uppercase tracking-tight mb-2">
                            {activeQrModal === "identity" ? "Upload Identity Proof" : "Upload Ownership Proof"}
                        </h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-6 leading-normal">
                            Scan with your mobile camera<br />to upload documents securely
                        </p>

                        <div className="relative bg-white p-3 rounded-2xl border border-slate-200 shadow-sm mb-4 flex justify-center items-center">
                            <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                                    `http://${kioskIp}:8000/mobile-upload/${sessionId}/${activeQrModal}`
                                )}`}
                                alt="Document Upload QR" 
                                className="w-48 h-48"
                            />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1.5 rounded-lg shadow-sm border border-slate-100">
                                <QrCode className="w-6 h-6 text-[#FD8008]" />
                            </div>
                        </div>

                        <div className="w-full bg-slate-50 border border-slate-150 rounded-2xl p-3.5 mb-5 text-left">
                            <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest mb-1.5">
                                Kiosk IP Address Configuration
                            </label>
                            <input 
                                type="text"
                                value={kioskIp}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setKioskIp(val);
                                    localStorage.setItem("suvidha_kiosk_ip", val);
                                }}
                                placeholder="e.g. 192.168.1.10"
                                className="w-full bg-white border border-slate-250 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#FD8008]"
                            />
                            <p className="text-[9px] text-slate-400 font-medium mt-1 leading-normal">
                                Ensure your phone is connected to the same Wi-Fi network. Update to your machine's local IP address if default hostname doesn't resolve on mobile.
                            </p>
                        </div>

                        <div className="w-full flex flex-col gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    const docName = activeQrModal === "identity" ? "Aadhaar_Mobile_Upload.pdf" : "Land_Receipt_Mobile_Upload.pdf";
                                    setUploadedDocs(prev => ({
                                        ...prev,
                                        [activeQrModal === "identity" ? "identityProof" : "ownershipProof"]: docName
                                    }));
                                    setFormData(prev => ({
                                        ...prev,
                                        [activeQrModal === "identity" ? "identityFile" : "ownershipFile"]: new File(["mock content"], docName, { type: "application/pdf" })
                                    }));
                                    setActiveQrModal(null);
                                }}
                                className="w-full bg-slate-100 text-slate-600 hover:bg-slate-200 py-3 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all"
                            >
                                Quick Simulate (Fallback)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicationFormPage;
