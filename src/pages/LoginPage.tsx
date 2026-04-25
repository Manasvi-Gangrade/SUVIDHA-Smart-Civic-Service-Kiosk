import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, ShieldCheck, ArrowRight, RefreshCw, CheckCircle2, User, Search, Fingerprint, Loader2, Camera, QrCode, Building2, Zap, Droplets, Landmark } from "lucide-react";
import FaceIDLogin from "../components/FaceIDLogin";
import { AadhaarScanner } from "../components/AadhaarScanner";
import { toast } from "sonner";

type Step = "selection" | "aadhaar" | "consumer" | "otp" | "success" | "face" | "scan" | "department";

const departments = [
    { id: "electricity", name: "Electricity Department", icon: Zap, color: "bg-amber-500", desc: "New connections, billing, meter issues" },
    { id: "water", name: "Water Supply Board", icon: Droplets, color: "bg-blue-500", desc: "Pipeline leaks, bill payments, new lines" },
    { id: "municipality", name: "Municipal Corporation", icon: Landmark, color: "bg-teal-500", desc: "Property tax, trade license, birth/death" },
    { id: "other", name: "Other Civic Services", icon: Building2, color: "bg-indigo-500", desc: "Miscellaneous government requests" },
];

const LoginPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>("selection");
    const [idValue, setIdValue] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [selectedDept, setSelectedDept] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState("");
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleInitialSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (idValue.length < 8) {
            setError("Please enter a valid ID");
            return;
        }
        setIsVerifying(true);
        setTimeout(() => {
            setIsVerifying(false);
            setStep("department");
            toast.success("Identity Verified. Select your department.");
        }, 1500);
    };

    const handleDeptSelect = (deptId: string) => {
        setSelectedDept(deptId);
        setStep("otp");
    };

    const handleOTPChange = (value: string, index: number) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        if (value && index < 5) otpRefs.current[index + 1]?.focus();
    };

    const handleVerifyOTP = (e: React.FormEvent) => {
        e.preventDefault();
        setIsVerifying(true);
        setTimeout(() => {
            setIsVerifying(false);
            setStep("success");
            toast.success("Authenticated Successfully");
            setTimeout(() => {
                // Navigate to the specific department or general dashboard
                navigate("/dashboard", { state: { dept: selectedDept } });
            }, 2000);
        }, 2000);
    };

    const handleAadhaarScanned = (data: string) => {
        setStep("department");
        const uidMatch = data.match(/\d{12}/);
        if (uidMatch) {
            setIdValue(uidMatch[0]);
            toast.success("Aadhaar QR Scanned Successfully!");
        } else {
            setIdValue("Scanned ID");
            toast.info("Aadhaar Data Received");
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-2xl">
                {/* Branding */}
                <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="inline-flex items-center justify-center h-20 w-20 rounded-[2.5rem] bg-primary text-white text-3xl font-black mb-6 shadow-2xl shadow-primary/30">
                        S
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter">SUVIDHA AUTH</h1>
                    <p className="text-slate-500 font-bold mt-2 uppercase tracking-[0.2em] text-xs">Secure Citizen Gateway</p>
                </div>

                <div className="bg-white rounded-[3.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.08)] border border-slate-100 p-10 md:p-16 transition-all duration-500 relative overflow-hidden">
                    
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />

                    {/* STEP 1: Method Selection */}
                    {step === "selection" && (
                        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                            <div className="text-center mb-12">
                                <h2 className="text-2xl font-black text-slate-900">How would you like to login?</h2>
                                <p className="text-slate-500 font-medium">Choose a secure method to access services</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <button 
                                    onClick={() => setStep("scan")}
                                    className="group p-10 rounded-[2.5rem] border-2 border-slate-50 bg-slate-50 hover:border-primary hover:bg-white transition-all text-left shadow-sm hover:shadow-xl"
                                >
                                    <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all">
                                        <QrCode className="h-8 w-8" />
                                    </div>
                                    <h3 className="font-black text-slate-900 text-xl leading-tight">Scan<br />Aadhaar</h3>
                                    <p className="text-sm text-slate-400 mt-2 font-bold uppercase tracking-wider">Fast & Secure</p>
                                </button>

                                <button 
                                    onClick={() => setStep("consumer")}
                                    className="group p-10 rounded-[2.5rem] border-2 border-slate-50 bg-slate-50 hover:border-orange-500 hover:bg-white transition-all text-left shadow-sm hover:shadow-xl"
                                >
                                    <div className="h-14 w-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-orange-500 group-hover:text-white transition-all">
                                        <Search className="h-8 w-8" />
                                    </div>
                                    <h3 className="font-black text-slate-900 text-xl leading-tight">Consumer<br />Account</h3>
                                    <p className="text-sm text-slate-400 mt-2 font-bold uppercase tracking-wider">Manual ID</p>
                                </button>
                            </div>
                            
                            <div className="flex flex-col gap-4 mt-8">
                                <button 
                                    onClick={() => setStep("face")}
                                    className="w-full p-6 rounded-[2rem] border-2 border-indigo-100 bg-indigo-50/30 text-indigo-600 font-black flex items-center justify-center gap-4 hover:bg-indigo-50 transition-all shadow-sm"
                                >
                                    <Fingerprint className="h-6 w-6" />
                                    LOGIN WITH BIOMETRICS
                                </button>
                                <button 
                                    onClick={() => setStep("aadhaar")}
                                    className="text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-900 transition-colors"
                                >
                                    Manual Aadhaar Entry
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP: SCANNER */}
                    {step === "scan" && (
                        <AadhaarScanner 
                            onSuccess={handleAadhaarScanned}
                            onCancel={() => setStep("selection")}
                        />
                    )}

                    {/* STEP 2: Input ID */}
                    {(step === "aadhaar" || step === "consumer") && (
                        <form onSubmit={handleInitialSubmit} className="space-y-10 animate-in slide-in-from-right-8 duration-500">
                             <div className="flex items-center gap-6 mb-12">
                                <button onClick={() => setStep("selection")} className="h-12 w-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
                                   <ArrowRight className="h-5 w-5 rotate-180" />
                                </button>
                                <h2 className="text-3xl font-black text-slate-900">
                                    {step === "aadhaar" ? "Verify Aadhaar" : "Verify Account"}
                                </h2>
                             </div>

                             <div className="space-y-6">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] ml-2">
                                    {step === "aadhaar" ? "Enter 12-Digit UID" : "Enter Account Number"}
                                </label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={idValue}
                                        onChange={(e) => setIdValue(e.target.value.replace(/\D/g, ""))}
                                        className="w-full bg-slate-50 border-4 border-slate-50 rounded-[2.5rem] px-10 py-8 text-3xl font-black tracking-[0.25em] focus:border-primary focus:bg-white outline-none transition-all shadow-inner"
                                        placeholder={step === "aadhaar" ? "XXXX XXXX XXXX" : "C-XXXXXXXX"}
                                        maxLength={step === "aadhaar" ? 12 : 10}
                                        autoFocus
                                    />
                                    <div className="absolute right-8 top-1/2 -translate-y-1/2 h-14 w-14 bg-white rounded-2xl flex items-center justify-center shadow-md">
                                        {step === "aadhaar" ? <ShieldCheck className="h-8 w-8 text-primary" /> : <User className="h-8 w-8 text-orange-500" />}
                                    </div>
                                </div>
                             </div>

                             <button 
                                type="submit"
                                disabled={isVerifying}
                                className="w-full bg-primary text-white py-8 rounded-[2.5rem] text-2xl font-black shadow-2xl shadow-primary/30 flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all"
                             >
                                {isVerifying ? <Loader2 className="h-8 w-8 animate-spin" /> : <>NEXT STEP <ArrowRight className="h-8 w-8" /></>}
                             </button>
                        </form>
                    )}

                    {/* NEW STEP: Department Selection */}
                    {step === "department" && (
                        <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
                            <div className="text-center">
                                <h2 className="text-3xl font-black text-slate-900">Select Department</h2>
                                <p className="text-slate-500 font-medium">Which service area are you visiting today?</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {departments.map((dept) => (
                                    <button 
                                        key={dept.id}
                                        onClick={() => handleDeptSelect(dept.id)}
                                        className="group p-6 rounded-[2rem] border-2 border-slate-50 bg-slate-50 hover:border-primary hover:bg-white transition-all text-left flex items-center gap-6"
                                    >
                                        <div className={`h-14 w-14 ${dept.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                            <dept.icon className="h-7 w-7" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-black text-slate-900 uppercase tracking-tight">{dept.name}</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">{dept.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 3: OTP */}
                    {step === "otp" && (
                        <form onSubmit={handleVerifyOTP} className="space-y-12 animate-in slide-in-from-right-8 duration-500">
                            <div className="text-center">
                                <h2 className="text-3xl font-black text-slate-900 mb-2">Secure OTP</h2>
                                <p className="text-slate-500 font-medium">Verify your mobile <span className="font-black text-slate-900">**42</span> for {selectedDept.toUpperCase()}</p>
                            </div>

                            <div className="flex gap-4 justify-center">
                                {otp.map((digit, i) => (
                                    <input
                                        key={i}
                                        ref={(el) => { otpRefs.current[i] = el; }}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOTPChange(e.target.value, i)}
                                        className="h-24 w-16 rounded-[1.5rem] border-4 border-slate-50 bg-slate-50 text-center text-4xl font-black focus:border-primary focus:bg-white outline-none transition-all shadow-inner"
                                    />
                                ))}
                            </div>

                            <button 
                                type="submit"
                                disabled={isVerifying}
                                className="w-full bg-slate-900 text-white py-8 rounded-[2.5rem] text-2xl font-black shadow-2xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all"
                             >
                                {isVerifying ? <Loader2 className="h-8 w-8 animate-spin" /> : "COMPLETE LOGIN"}
                            </button>

                            <div className="text-center">
                                <button type="button" className="text-primary font-black hover:underline flex items-center gap-2 mx-auto uppercase text-xs tracking-widest">
                                    <RefreshCw className="h-4 w-4" /> Resend Security Code
                                </button>
                            </div>
                        </form>
                    )}

                    {/* SUCCESS */}
                    {step === "success" && (
                         <div className="text-center py-16 animate-in zoom-in duration-700">
                            <div className="h-32 w-32 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(34,197,94,0.4)]">
                                <CheckCircle2 className="h-16 w-16 text-white" />
                            </div>
                            <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Welcome!</h2>
                            <p className="text-slate-500 font-bold mt-4 uppercase tracking-[0.2em]">Redirecting to {selectedDept} Portal</p>
                            
                            <div className="mt-10 flex justify-center gap-2">
                                {[1,2,3].map(i => (
                                    <div key={i} className="h-2 w-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: `${i*0.2}s` }} />
                                ))}
                            </div>
                         </div>
                    )}

                    {/* FACE ID */}
                    {step === "face" && (
                         <FaceIDLogin 
                            onSuccess={() => {
                                setStep("department");
                                toast.success("Biometrics Verified!");
                            }}
                            onCancel={() => setStep("selection")}
                         />
                    )}

                </div>

                {/* Privacy Badge */}
                <div className="mt-12 flex items-center justify-center gap-4 text-slate-400">
                    <ShieldCheck className="h-5 w-5" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Government Secure Module v4.5</span>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
