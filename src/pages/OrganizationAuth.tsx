import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ShieldCheck, ArrowRight, Loader2, Smartphone, Fingerprint, QrCode, RefreshCw, X, ArrowLeft } from "lucide-react";
import { AadhaarScanner } from "../components/AadhaarScanner";
import { toast } from "sonner";

export const OrganizationAuth = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [authMethod, setAuthMethod] = useState<"aadhaar" | "mobile" | "digilocker">("aadhaar");
  const [isLoading, setIsLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  
  // Form States
  const [aadhaarBlocks, setAadhaarBlocks] = useState(["", "", ""]);
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaText, setCaptchaText] = useState("X7B92");

  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const refreshCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 5; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    setCaptchaText(result);
  };

  const handleAadhaarChange = (index: number, value: string) => {
    const val = value.replace(/\D/g, "").slice(0, 4);
    const newBlocks = [...aadhaarBlocks];
    newBlocks[index] = val;
    setAadhaarBlocks(newBlocks);

    // Auto-focus next block
    if (val.length === 4 && index < 2) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (captchaInput.toUpperCase() !== captchaText.toUpperCase()) {
      toast.error("Invalid Captcha! Please try again.");
      refreshCaptcha();
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Authentication Successful");
      navigate(`/department/${id}`);
    }, 1500);
  };

  const getDeptName = () => {
    switch(id) {
      case 'electricity': return 'Electricity Board';
      case 'gas': return 'Gas Distribution Agency';
      case 'water': return 'Water Supply Board';
      case 'municipal': return 'Municipal Corporation';
      case 'waste': return 'Waste Management';
      case 'property': return 'Property & Tax Dept.';
      default: return 'Department Login';
    }
  }

  return (
    <div className="h-[calc(100vh-64px)] bg-gradient-to-br from-[#0f172a] via-[#192e59] to-[#0f172a] flex flex-col relative overflow-hidden font-sans">
      
      {/* Background Video Overlay */}
      <div className="absolute inset-0 z-0">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-30 mix-blend-overlay">
          <source src="/videos/14904045_3840_2160_30fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[#192e59]/20" />
      </div>

      {showScanner && (
        <AadhaarScanner 
          onSuccess={(data) => {
            const uidMatch = data.match(/\d{12}/);
            if (uidMatch) {
              const num = uidMatch[0];
              setAadhaarBlocks([num.slice(0,4), num.slice(4,8), num.slice(8,12)]);
            }
            setShowScanner(false);
            toast.success("Aadhaar Scanned!");
          }}
          onCancel={() => setShowScanner(false)}
        />
      )}

      <div className="flex-1 container relative z-10 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(25,46,89,0.2)] border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
          
          {/* Header Section */}
          <div className="bg-[#192e59] p-8 text-white relative">
            <button onClick={() => navigate(-1)} className="absolute left-6 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="text-center">
              <h1 className="text-3xl font-[900] tracking-tight uppercase leading-none">{getDeptName()}</h1>
              <p className="text-blue-200 text-xs font-bold mt-2 tracking-[0.3em] uppercase">Secure Citizen Authentication</p>
            </div>
          </div>

          <div className="flex-1 p-8 lg:p-12 overflow-y-auto custom-scrollbar">
            
            {/* Unified Tabs Container */}
            <div className="flex bg-slate-50 p-1.5 rounded-[1.5rem] border-2 border-slate-100 mb-12">
              <button 
                onClick={() => setAuthMethod("aadhaar")}
                className={`flex-1 py-4 rounded-[1.1rem] flex flex-col items-center gap-2 transition-all duration-500 ${authMethod === 'aadhaar' ? 'bg-[#192e59] text-white shadow-2xl' : 'text-slate-400 hover:text-[#192e59] hover:bg-white'}`}
              >
                <Fingerprint className="w-6 h-6" />
                <span className="font-black text-[10px] uppercase tracking-[0.2em]">Aadhaar Auth</span>
              </button>
              <button 
                onClick={() => setAuthMethod("mobile")}
                className={`flex-1 py-4 rounded-[1.1rem] flex flex-col items-center gap-2 transition-all duration-500 ${authMethod === 'mobile' ? 'bg-[#192e59] text-white shadow-2xl' : 'text-slate-400 hover:text-[#192e59] hover:bg-white'}`}
              >
                <Smartphone className="w-6 h-6" />
                <span className="font-black text-[10px] uppercase tracking-[0.2em]">Mobile Auth</span>
              </button>
              <button 
                onClick={() => setAuthMethod("digilocker")}
                className={`flex-1 py-4 rounded-[1.1rem] flex flex-col items-center gap-2 transition-all duration-500 ${authMethod === 'digilocker' ? 'bg-[#192e59] text-white shadow-2xl' : 'text-slate-400 hover:text-[#192e59] hover:bg-white'}`}
              >
                <ShieldCheck className="w-6 h-6" />
                <span className="font-black text-[10px] uppercase tracking-[0.2em]">DigiLocker</span>
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-8">
              
              {/* Identifier Input */}
              {authMethod === "aadhaar" ? (
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    Enter Aadhaar Number <span className="text-[#192e59]/20 font-normal">(12 Digits)</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 flex gap-2">
                      {[0, 1, 2].map((idx) => (
                        <input
                          key={idx}
                          ref={inputRefs[idx]}
                          type="text"
                          value={aadhaarBlocks[idx]}
                          onChange={(e) => handleAadhaarChange(idx, e.target.value)}
                          placeholder="XXXX"
                          className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-4 text-center font-mono text-2xl font-bold text-[#192e59] focus:border-[#FD8008] focus:ring-4 focus:ring-[#FD8008]/10 outline-none transition-all placeholder:text-slate-300"
                        />
                      ))}
                    </div>
                    <button 
                      type="button"
                      onClick={() => setShowScanner(true)}
                      className="bg-[#FD8008] hover:bg-[#e67300] text-white p-5 rounded-xl flex items-center justify-center shadow-lg shadow-[#FD8008]/20 transition-all group"
                      title="Scan Aadhaar QR"
                    >
                      <QrCode className="w-8 h-8 group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              ) : authMethod === "mobile" ? (
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Enter Mobile Number</label>
                  <div className="relative">
                    <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                    <input
                      type="text"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="98XXXXXX00"
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl pl-14 pr-6 py-4 font-mono text-2xl font-bold text-[#192e59] focus:border-[#FD8008] outline-none transition-all placeholder:text-slate-300"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                  <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center">
                    <img src="https://img.etimg.com/thumb/msid-70764789,width-1200,height-900,resizemode-4,imgsize-29367/digilocker.jpg" alt="DigiLocker" className="h-16 mx-auto mb-4 rounded-xl grayscale opacity-80" />
                    <h3 className="text-[#192e59] font-bold text-lg">Login with DigiLocker</h3>
                    <p className="text-slate-500 text-sm mb-6">Access your verified documents instantly</p>
                    <button type="button" className="bg-[#0066FF] hover:bg-[#0055DD] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 mx-auto transition-all shadow-lg shadow-[#0066FF]/20">
                      Sign In to DigiLocker <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {authMethod !== "digilocker" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* OTP Field */}
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Enter 6-Digit OTP</label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="XXXXXX"
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-6 py-4 font-mono text-2xl font-bold text-[#192e59] tracking-[0.5em] focus:border-[#192e59] outline-none transition-all placeholder:text-slate-300"
                      />
                      <button type="button" className="text-xs font-black text-[#FD8008] uppercase tracking-[0.15em] hover:underline flex items-center gap-1 mt-1">
                        Didn't receive code? <span className="underline">Resend OTP Now</span>
                      </button>
                    </div>

                    {/* Captcha Field */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-[900] text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        Security Captcha <span className="text-red-400">*</span>
                      </label>
                      <div className="flex gap-3">
                        <div className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-4 flex items-center justify-between overflow-hidden shadow-inner relative">
                          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                          <span className="font-mono text-2xl font-black italic tracking-[0.3em] text-red-600 select-none line-through decoration-slate-300 relative z-10">
                            {captchaText}
                          </span>
                          <button type="button" onClick={refreshCaptcha} className="text-[#192e59] hover:rotate-180 transition-transform duration-700 relative z-10 p-1 hover:bg-slate-100 rounded-lg">
                            <RefreshCw className="w-6 h-6" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={captchaInput}
                          onChange={(e) => setCaptchaInput(e.target.value)}
                          placeholder="CODE"
                          className="w-32 bg-white border-2 border-slate-200 rounded-xl px-4 py-4 text-center font-black text-2xl uppercase text-[#192e59] focus:border-[#FD8008] focus:ring-4 focus:ring-[#FD8008]/10 outline-none transition-all placeholder:text-slate-300"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#192e59] text-white py-5 rounded-2xl font-black text-xl uppercase tracking-widest shadow-[0_15px_40px_-10px_rgba(25,46,89,0.3)] hover:bg-[#112040] hover:-translate-y-1 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>Verify & Authenticate <ArrowRight className="w-6 h-6" /></>
                    )}
                  </button>
                </>
              )}
            </form>
          </div>
          
          {/* Footer Decoration */}
          <div className="h-2 bg-gradient-to-r from-slate-100 via-[#192e59]/20 to-slate-100"></div>
        </div>
      </div>
    </div>
  );
};

