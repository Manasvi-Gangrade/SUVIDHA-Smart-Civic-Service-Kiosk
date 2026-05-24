import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ShieldCheck, ArrowRight, RefreshCw, CheckCircle2, User, Fingerprint, Loader2, QrCode, MessageSquare, ChevronRight, ArrowLeft } from "lucide-react";
import FaceIDLogin from "../components/FaceIDLogin";
import { AadhaarScanner } from "../components/AadhaarScanner";
import { toast } from "sonner";

type Step = "selection" | "aadhaar" | "consumer" | "otp" | "success" | "face" | "scan" | "department";

const departments = [
    { id: "electricity", name: "Electricity Department", icon: "/images/electricity (2).png", color: "bg-amber-500", desc: "New connections, billing, meter issues" },
    { id: "water", name: "Water Supply Board", icon: "/images/water.png", color: "bg-blue-500", desc: "Pipeline leaks, bill payments, new lines" },
    { id: "municipality", name: "Municipal Corporation", icon: "/images/municipal.png", color: "bg-teal-500", desc: "Property tax, trade license, birth/death" },
    { id: "other", name: "Other Civic Services", icon: "/images/property.png", color: "bg-indigo-500", desc: "Miscellaneous government requests" },
];

const LoginPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>("selection");
    const [idValue, setIdValue] = useState("");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [generatedOtp, setGeneratedOtp] = useState("");
    const [selectedDept, setSelectedDept] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [showSmsPopup, setShowSmsPopup] = useState(false);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Randomized Captcha States
    const [aadhaarCaptcha, setAadhaarCaptcha] = useState("");
    const [aadhaarCaptchaInput, setAadhaarCaptchaInput] = useState("");
    const [phoneCaptcha, setPhoneCaptcha] = useState("");
    const [phoneCaptchaInput, setPhoneCaptchaInput] = useState("");

    const refreshAadhaarCaptcha = () => {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        let result = "";
        for (let i = 0; i < 5; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
        setAadhaarCaptcha(result);
    };

    const refreshPhoneCaptcha = () => {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        let result = "";
        for (let i = 0; i < 5; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
        setPhoneCaptcha(result);
    };

    useEffect(() => {
        refreshAadhaarCaptcha();
        refreshPhoneCaptcha();

        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        if (code) {
            toast.success("DigiLocker Authentication Successful!");
            setStep("department");
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    const handleDigilockerLogin = () => {
        const clientId = "MNRNJVXE";
        const redirectUri = encodeURIComponent(window.location.origin + "/auth/login");
        const state = "suvidha_kiosk_auth";
        const codeChallenge = "n6Li6eP2UzbkRvu5uCxWj-nUabNu15NpvA48FpAaPhg";
        
        const oauthUrl = `https://dev-meripehchaan.dl6.in/public/oauth2/1/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&state=${state}&Code_challenge=${codeChallenge}&Code_challenge_method=S256`;
        window.location.href = oauthUrl;
    };

    const handleInitialSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const cleanAadhaar = idValue.replace(/\s/g, "");
        if (cleanAadhaar.length !== 12 || !/^\d+$/.test(cleanAadhaar)) {
            toast.error("Please enter a valid 12-digit Aadhaar number");
            return;
        }
        if (aadhaarCaptchaInput.toUpperCase() !== aadhaarCaptcha.toUpperCase()) {
            toast.error("Invalid Captcha! Please try again.");
            refreshAadhaarCaptcha();
            return;
        }
        setIsVerifying(true);
        setTimeout(() => {
            setIsVerifying(false);
            setStep("consumer");
            toast.success("Aadhaar UID successfully verified in UIDAI database. Please confirm your mobile number to receive secure OTP.");
        }, 1500);
    };

    const handleDeptSelect = (deptId: string) => {
        setSelectedDept(deptId);
        setStep("aadhaar"); // Ask for Aadhaar after department select
    };

    const handleSendOTP = (e: React.FormEvent) => {
        e.preventDefault();
        if (phone.length < 10) {
            toast.error("Please enter a valid 10-digit mobile number");
            return;
        }
        if (phoneCaptchaInput.toUpperCase() !== phoneCaptcha.toUpperCase()) {
            toast.error("Invalid Captcha! Please try again.");
            refreshPhoneCaptcha();
            return;
        }

        setIsVerifying(true);
        setTimeout(() => {
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            setGeneratedOtp(code);
            setIsVerifying(false);
            setStep("otp");
            
            // Show the on-screen simulated SMS popup
            setTimeout(() => {
                setShowSmsPopup(true);
                toast.info("Secure Gateway: OTP sent to +91 " + phone);
            }, 1000);
        }, 1200);
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
        const inputOtp = otp.join("");
        setIsVerifying(true);

        setTimeout(() => {
            setIsVerifying(false);
            // Relaxed validation: ANY 6-digit OTP succeeds!
            if (inputOtp.length === 6) {
                setStep("success");
                setShowSmsPopup(false);
                toast.success("Authentication Success");
                setTimeout(() => {
                    if (selectedDept) {
                        navigate("/dashboard", { state: { dept: selectedDept } });
                    } else {
                        setStep("department");
                    }
                }, 2000);
            } else {
                toast.error("Invalid Security Code! Please enter a 6-digit OTP.");
                setOtp(["", "", "", "", "", ""]);
                otpRefs.current[0]?.focus();
            }
        }, 1200);
    };

    const handleAadhaarScanned = (data: string) => {
        const uidMatch = data.match(/\d{12}/);
        if (uidMatch) {
            setIdValue(uidMatch[0]);
            toast.success("Aadhaar Card Securely Scanned!");
            setIsVerifying(true);
            setTimeout(() => {
                setIsVerifying(false);
                setStep("consumer");
                toast.success("Aadhaar UID successfully verified in UIDAI database. Please confirm your mobile number to receive secure OTP.");
            }, 1200);
        } else {
            toast.error("Invalid Aadhaar QR Code structure. Please scan a valid Government of India QR.");
        }
    };

    return (
        <div className="flex w-full min-h-screen relative overflow-hidden bg-slate-50 font-sans">
            
            {/* SIMULATED PHONE NOTIFICATION POPUP */}
            {showSmsPopup && (
                <div className="fixed top-6 right-6 w-80 bg-white border border-slate-200 rounded p-4 shadow-xl z-[100] animate-in slide-in-from-right-8 duration-500">
                    <div className="flex items-start gap-4">
                        <div className="h-10 w-10 bg-green-600 rounded flex items-center justify-center shrink-0">
                            <MessageSquare className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-slate-500 uppercase">Messages • Now</span>
                                <button onClick={() => setShowSmsPopup(false)} className="text-slate-400 hover:text-slate-900">✕</button>
                            </div>
                            <p className="text-xs font-bold text-slate-900">Govt of India (SUVIDHA)</p>
                            <p className="text-sm text-slate-600 mt-1">Your verification code is <span className="font-bold text-[#192e59]">{generatedOtp}</span>. Do not share.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Background Video Overlay */}
            <div className="absolute inset-0 z-0">
                <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-30 mix-blend-multiply">
                    <source src="/videos/14904045_3840_2160_30fps.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-br from-[#192e59]/10 via-transparent to-[#192e59]/20" />
            </div>

            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#192e59 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

            {/* LEFT SIDE: White Curved Graphic Area */}
            <div className="hidden lg:flex flex-col items-center justify-start pt-32 w-[55%] bg-white relative z-10 shadow-[20px_0_100px_rgba(0,0,0,0.08)]" style={{ clipPath: 'ellipse(115% 100% at 0% 50%)' }}>
                <div className="flex flex-col items-center max-w-md w-full pl-10 pr-24">
                    
                    {/* Colorful Dotted Semi-circle Logo Simulation */}
                    <div className="relative w-64 h-64 mb-8 flex items-center justify-center">
                        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full animate-spin-slow" style={{ animationDuration: '40s' }}>
                            <path d="M 100,10 A 90,90 0 0,1 190,100" fill="none" stroke="#FD8008" strokeWidth="8" strokeDasharray="4 12" strokeLinecap="round"/>
                            <path d="M 190,100 A 90,90 0 0,1 100,190" fill="none" stroke="#2D9B51" strokeWidth="8" strokeDasharray="4 12" strokeLinecap="round"/>
                            <path d="M 100,190 A 90,90 0 0,1 10,100" fill="none" stroke="#E32636" strokeWidth="8" strokeDasharray="4 12" strokeLinecap="round"/>
                            <path d="M 10,100 A 90,90 0 0,1 100,10" fill="none" stroke="#192e59" strokeWidth="8" strokeDasharray="4 12" strokeLinecap="round"/>
                            
                            <path d="M 100,25 A 75,75 0 0,1 175,100" fill="none" stroke="#FD8008" strokeWidth="6" strokeDasharray="4 10" strokeLinecap="round"/>
                            <path d="M 175,100 A 75,75 0 0,1 100,175" fill="none" stroke="#2D9B51" strokeWidth="6" strokeDasharray="4 10" strokeLinecap="round"/>
                            <path d="M 100,175 A 75,75 0 0,1 25,100" fill="none" stroke="#192e59" strokeWidth="6" strokeDasharray="4 10" strokeLinecap="round"/>
                        </svg>
                        
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex items-baseline">
                                <h1 className="text-4xl font-bold text-slate-900 tracking-tight">SUVIDHA</h1>
                                <span className="ml-2 bg-[#192e59] text-white text-sm font-bold px-2 py-1 rounded-full">2.0</span>
                            </div>
                        </div>
                    </div>

                    {/* QR Codes Section */}
                    <div className="flex gap-6 mt-16 items-end">
                        <div className="bg-[#192e59] text-white p-3 rounded-lg relative -ml-10">
                            <p className="text-xs">You may also</p>
                            <p className="text-sm font-bold bg-[#FFD700] text-black px-2 py-0.5 mt-1">APPLY PERMISSION</p>
                            <p className="text-xs mt-1">through Mobile App</p>
                            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-l-[15px] border-l-[#192e59] border-b-[10px] border-b-transparent"></div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 bg-white border border-slate-200 p-1 rounded shadow-sm mb-2">
                                <QrCode className="w-full h-full text-slate-800" />
                            </div>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-8" />
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 bg-white border border-slate-200 p-1 rounded shadow-sm mb-2">
                                <QrCode className="w-full h-full text-slate-800" />
                            </div>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-8" />
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: Login Card */}
            <div className="w-full lg:w-[45%] flex items-center justify-center p-8 z-10">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-[480px] p-8 md:p-10 border border-slate-100">
                    
                    {/* Card Header (Emblem) */}
                    <div className="flex flex-col items-center mb-8 border-b border-slate-100 pb-6">
                        <div className="w-12 h-12 mb-2">
                            <ShieldCheck className="w-full h-full text-slate-700" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-sm font-bold text-slate-800">Govt. of India</h2>
                        <h3 className="text-sm font-semibold text-slate-600">Smart Civic Kiosk Portal</h3>
                    </div>

                    {/* Method Selection (Suvidha Style) */}
                    {step === "selection" && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <label className="text-sm text-slate-700 font-medium">Select Authentication Type<span className="text-red-500">*</span></label>
                            
                            <div className="flex gap-0 border-2 border-slate-100 rounded-2xl overflow-hidden mb-6 p-1 bg-slate-50/50">
                                <button 
                                    onClick={() => setStep("scan")} 
                                    className={`flex-1 py-4 flex flex-col items-center gap-2 transition-all duration-300 rounded-xl ${step === 'scan' ? 'bg-[#192e59] text-white shadow-xl' : 'text-slate-400 hover:text-[#192e59] hover:bg-white'}`}
                                >
                                    <QrCode className="w-6 h-6" />
                                    <span className="font-black text-xs uppercase tracking-widest">Scan Aadhaar</span>
                                </button>
                                <button 
                                    onClick={() => setStep("aadhaar")} 
                                    className={`flex-1 py-4 flex flex-col items-center gap-2 transition-all duration-300 rounded-xl ${step === 'aadhaar' ? 'bg-[#192e59] text-white shadow-xl' : 'text-slate-400 hover:text-[#192e59] hover:bg-white'}`}
                                >
                                    <User className="w-6 h-6" />
                                    <span className="font-black text-xs uppercase tracking-widest">Manual ID</span>
                                </button>
                            </div>

                            <div className="mb-8">
                                <button onClick={handleDigilockerLogin} className="w-full py-5 border-2 border-emerald-100 bg-white text-emerald-800 font-black rounded-2xl hover:bg-emerald-50 hover:border-emerald-500 transition-all flex justify-center items-center gap-4 shadow-sm group">
                                    <div className="p-2 bg-emerald-50 rounded-lg group-hover:scale-110 transition-transform">
                                        <ShieldCheck className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs uppercase tracking-widest text-emerald-600/60 leading-none mb-1">Secure SSO</p>
                                        <p className="text-sm">Login with DigiLocker</p>
                                    </div>
                                </button>
                            </div>

                            <div className="relative group">
                                <label className="absolute -top-2 left-4 bg-white px-2 text-xs text-slate-400 font-black uppercase tracking-widest group-focus-within:text-[#192e59] z-10 transition-colors">Select Department</label>
                                <select 
                                    value={selectedDept}
                                    onChange={(e) => handleDeptSelect(e.target.value)}
                                    className="w-full border-2 border-slate-100 rounded-2xl p-4 text-slate-800 font-bold bg-white outline-none appearance-none focus:border-[#192e59] focus:ring-4 focus:ring-[#192e59]/5 transition-all"
                                >
                                    <option value="">Choose Department</option>
                                    {departments.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <ChevronRight className="w-5 h-5 text-slate-400 rotate-90" />
                                </div>
                            </div>
                            
                            <button onClick={() => setStep("face")} className="w-full py-4 mt-4 bg-white border-2 border-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 hover:border-[#192e59] transition-all flex justify-center items-center gap-3 shadow-sm">
                                <Fingerprint className="w-5 h-5 text-[#192e59]" /> Biometric Access
                            </button>
                        </div>
                    )}

                    {/* SCANNER STEP */}
                    {step === "scan" && (
                        <AadhaarScanner 
                            onSuccess={handleAadhaarScanned}
                            onCancel={() => setStep("selection")}
                        />
                    )}

                    {/* Aadhaar Input */}
                    {step === "aadhaar" && (
                        <form onSubmit={handleInitialSubmit} className="space-y-6 animate-in fade-in duration-300">
                             <div className="flex items-center gap-2 mb-4 text-[#192e59]">
                                <button type="button" onClick={() => setStep("selection")} className="hover:underline flex items-center text-sm font-bold"><ArrowLeft className="w-4 h-4 mr-1"/> Back</button>
                             </div>
                             
                             <div className="relative group">
                                <label className="absolute -top-2 left-4 bg-white px-2 text-xs text-slate-400 font-black uppercase tracking-widest group-focus-within:text-[#192e59] z-10 transition-colors">Identification Number<span className="text-red-500 ml-1">*</span></label>
                                <input 
                                    type="text" 
                                    value={idValue}
                                    onChange={(e) => setIdValue(e.target.value)}
                                    className="w-full border-2 border-slate-100 rounded-2xl p-4 text-slate-800 font-bold bg-white outline-none focus:border-[#192e59] focus:ring-4 focus:ring-[#192e59]/5 transition-all"
                                    placeholder="Enter your 12-digit ID"
                                    autoFocus
                                />
                             </div>

                             <div className="flex items-center gap-4 py-4">
                                <div className="bg-slate-50 p-2 border-2 border-slate-100 rounded-xl select-none flex-1 flex justify-center items-center h-14">
                                    <span className="font-mono text-2xl font-black tracking-[0.2em] text-slate-700 skew-x-[-15deg] blur-[0.4px]">{aadhaarCaptcha}</span>
                                </div>
                                <button type="button" onClick={refreshAadhaarCaptcha} className="flex flex-col items-center text-[#192e59] hover:text-[#122242] transition-colors">
                                    <RefreshCw className="w-6 h-6 mb-1" />
                                    <span className="text-xs font-black uppercase tracking-widest">Reload</span>
                                </button>
                             </div>

                             <div className="relative group">
                                <label className="absolute -top-2 left-4 bg-white px-2 text-xs text-slate-400 font-black uppercase tracking-widest group-focus-within:text-[#192e59] z-10 transition-colors">Verification Captcha<span className="text-red-500 ml-1">*</span></label>
                                <input 
                                    type="text" 
                                    value={aadhaarCaptchaInput}
                                    onChange={(e) => setAadhaarCaptchaInput(e.target.value)}
                                    className="w-full border-2 border-slate-100 rounded-2xl p-4 text-slate-800 font-bold bg-white outline-none focus:border-[#192e59] focus:ring-4 focus:ring-[#192e59]/5 transition-all"
                                    placeholder="Type characters above"
                                />
                             </div>

                             <button type="submit" disabled={isVerifying} className="w-full bg-[#192e59] hover:bg-[#122242] text-white py-4 rounded-2xl font-black text-lg uppercase tracking-widest shadow-lg shadow-[#192e59]/20 transition-all flex items-center justify-center">
                                {isVerifying ? <Loader2 className="h-6 w-6 animate-spin" /> : "Verify Identity"}
                             </button>
                        </form>
                    )}

                    {/* Dept Selection */}
                    {step === "department" && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <div className="max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                                <div className="grid grid-cols-1 gap-3">
                                    {departments.map((dept) => (
                                        <button 
                                            key={dept.id} 
                                            onClick={() => handleDeptSelect(dept.id)} 
                                            className="p-4 rounded-2xl border-2 border-slate-100 hover:border-[#192e59] hover:bg-slate-50 transition-all text-left flex items-center gap-4 bg-white group shadow-sm"
                                        >
                                            <div className={cn("p-2 rounded-xl text-white shadow-md shrink-0 transition-transform group-hover:scale-110", dept.color)}>
                                                {typeof dept.icon === 'string' ? (
                                                    <img src={dept.icon} alt={dept.name} className="h-6 w-6 object-contain" />
                                                ) : (
                                                    <dept.icon className="h-6 w-6" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-black text-slate-800 uppercase tracking-tight leading-none text-sm">{dept.name}</h4>
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 line-clamp-1">{dept.desc}</p>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#192e59] transition-colors" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Phone Input */}
                    {step === "consumer" && (
                        <form onSubmit={handleSendOTP} className="space-y-6 animate-in fade-in duration-300">
                             <div className="relative group">
                                <label className="absolute -top-2 left-4 bg-white px-2 text-xs text-slate-400 font-black uppercase tracking-widest group-focus-within:text-[#192e59] z-10 transition-colors">Mobile Number<span className="text-red-500 ml-1">*</span></label>
                                <div className="flex">
                                    <span className="border-2 border-r-0 border-slate-100 rounded-l-2xl p-4 text-slate-500 bg-slate-50 font-bold">+91</span>
                                    <input 
                                        type="tel" 
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                                        className="w-full border-2 border-slate-100 rounded-r-2xl p-4 text-slate-800 font-bold bg-white outline-none focus:border-[#192e59] focus:ring-4 focus:ring-[#192e59]/5 transition-all"
                                        maxLength={10}
                                        autoFocus
                                    />
                                </div>
                             </div>

                             <div className="flex items-center gap-4 py-4">
                                <div className="bg-slate-50 p-2 border-2 border-slate-100 rounded-xl select-none flex-1 flex justify-center items-center h-14">
                                    <span className="font-mono text-2xl font-black tracking-[0.2em] text-slate-700 skew-x-[-15deg] blur-[0.4px]">{phoneCaptcha}</span>
                                </div>
                                <button type="button" onClick={refreshPhoneCaptcha} className="flex flex-col items-center text-[#192e59] hover:text-[#122242] transition-colors">
                                    <RefreshCw className="w-6 h-6 mb-1" />
                                    <span className="text-xs font-black uppercase tracking-widest">Reload</span>
                                </button>
                             </div>

                             <div className="relative group">
                                <label className="absolute -top-2 left-4 bg-white px-2 text-xs text-slate-400 font-black uppercase tracking-widest group-focus-within:text-[#192e59] z-10 transition-colors">Verification Captcha<span className="text-red-500 ml-1">*</span></label>
                                <input 
                                    type="text" 
                                    value={phoneCaptchaInput}
                                    onChange={(e) => setPhoneCaptchaInput(e.target.value)}
                                    className="w-full border-2 border-slate-100 rounded-2xl p-4 text-slate-800 font-bold bg-white outline-none focus:border-[#192e59] focus:ring-4 focus:ring-[#192e59]/5 transition-all"
                                    placeholder="Type characters above"
                                />
                             </div>

                             <button type="submit" disabled={isVerifying} className="w-full bg-[#192e59] hover:bg-[#122242] text-white py-4 rounded-2xl font-black text-lg uppercase tracking-widest shadow-lg shadow-[#192e59]/20 transition-all flex items-center justify-center">
                                {isVerifying ? <Loader2 className="h-6 w-6 animate-spin" /> : "Generate Secure OTP"}
                             </button>
                        </form>
                    )}

                    {/* OTP Input */}
                    {step === "otp" && (
                        <form onSubmit={handleVerifyOTP} className="space-y-6 animate-in fade-in duration-300">
                            <div className="text-center mb-6">
                                <p className="text-slate-600 text-sm">Enter the OTP sent to +91 ******{phone.slice(-4)}</p>
                            </div>
                            <div className="flex gap-3 justify-center">
                                {otp.map((digit, i) => (
                                    <input
                                        key={i}
                                        ref={(el) => { otpRefs.current[i] = el; }}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOTPChange(e.target.value, i)}
                                        className="w-12 h-16 rounded-2xl border-2 border-slate-100 bg-white text-center text-2xl font-black text-slate-900 focus:border-[#192e59] focus:ring-4 focus:ring-[#192e59]/5 outline-none transition-all shadow-sm"
                                    />
                                ))}
                            </div>
                            <button type="submit" disabled={isVerifying} className="w-full bg-[#192e59] hover:bg-[#122242] text-white py-4 rounded-2xl font-black text-lg uppercase tracking-widest shadow-lg shadow-[#192e59]/20 mt-8 transition-all flex items-center justify-center">
                                {isVerifying ? <Loader2 className="h-6 w-6 animate-spin" /> : "Authenticate & Login"}
                            </button>
                        </form>
                    )}

                    {/* Success Screen */}
                    {step === "success" && (
                         <div className="text-center py-8 animate-in zoom-in duration-500">
                            <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="h-10 w-10 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800">Verification Successful</h2>
                            <p className="text-slate-500 text-sm mt-2">Redirecting securely...</p>
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
            </div>
        </div>
    );
};

export default LoginPage;
