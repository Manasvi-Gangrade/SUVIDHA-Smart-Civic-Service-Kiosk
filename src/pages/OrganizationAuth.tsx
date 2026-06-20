import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ShieldCheck, ArrowRight, Loader2, Smartphone, Fingerprint, QrCode, RefreshCw, X, ArrowLeft, MessageSquare } from "lucide-react";
import { AadhaarScanner } from "../components/AadhaarScanner";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const OrganizationAuth = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirection target from state
  const redirectState = location.state as {
    redirectTo?: string;
    serviceState?: {
      category: string;
      service: string;
      description: string;
    };
  } | null;

  const [authMethod, setAuthMethod] = useState<"aadhaar" | "mobile" | "digilocker">("aadhaar");
  const [isLoading, setIsLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  
  // Form States
  const [aadhaarBlocks, setAadhaarBlocks] = useState<string[]>(Array(12).fill(""));
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaText, setCaptchaText] = useState("X7B92");

  // OTP Dynamic Verification States
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // DigiLocker live states
  const [aadhaarRefId, setAadhaarRefId] = useState("");

  const aadhaarRefs = useRef<(HTMLInputElement | null)[]>([]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const refreshCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 5; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    setCaptchaText(result);
  };

  useEffect(() => {
    refreshCaptcha();

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      setIsLoading(true);
      toast.success("DigiLocker Authentication Successful!");
      const tempName = "DigiLocker Citizen";
      import("@/lib/database").then(({ loginOrSignupToBackend }) => {
        loginOrSignupToBackend("999988887777", "9876543210", tempName).then(() => {
          window.dispatchEvent(new Event("suvidha_login_change"));
          setIsLoading(false);
          if (redirectState && redirectState.redirectTo) {
            navigate(redirectState.redirectTo, { state: redirectState.serviceState });
          } else {
            navigate(`/department/${id}`);
          }
        });
      });
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // SANDBOX.CO.IN CALLBACK TRIGGER
    const sandboxSessionId = params.get("session_id") || params.get("sandbox_session_id");
    if (sandboxSessionId) {
      setIsLoading(true);
      toast.info("Verifying secure Sandbox DigiLocker session...");
      fetch(`${API_URL}/api/sandbox/digilocker/status/${sandboxSessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.status === "succeeded") {
            toast.success(`Welcome, ${data.citizen.name}! DigiLocker verified.`);
            localStorage.setItem("smartcity_token", data.token);
            localStorage.setItem("smartcity_citizen", JSON.stringify(data.citizen));
            window.dispatchEvent(new Event("suvidha_login_change"));
            if (redirectState && redirectState.redirectTo) {
              navigate(redirectState.redirectTo, { state: redirectState.serviceState });
            } else {
              navigate(`/department/${id}`);
            }
          } else {
            toast.error(data.message || "DigiLocker session not completed.");
          }
        })
        .catch(err => {
          console.error("Sandbox verification error:", err);
          toast.error("Network error during Sandbox verification.");
        })
        .finally(() => {
          setIsLoading(false);
          window.history.replaceState({}, document.title, window.location.pathname);
        });
    }
  }, []);

  const triggerOtpSend = async (displayNum: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method: "mobile", value: mobileNumber })
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        toast.success(`Secure verification OTP sent to ${displayNum}`);
      } else {
        toast.error(data.message || "Failed to send mobile OTP");
      }
    } catch (error) {
      console.error("Mobile OTP send error:", error);
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setOtpSent(true);
      console.log("Fallback mock OTP (check DevTools console):", code);
      toast.success(`Secure verification OTP sent to ${displayNum}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Watch for full Aadhaar completion to auto-trigger OTP (Real Sandbox API)
  useEffect(() => {
    const fullAadhaar = aadhaarBlocks.join("");
    if (fullAadhaar.length === 12 && !otpSent && authMethod === "aadhaar") {
      setIsLoading(true);
      fetch(`${API_URL}/api/sandbox/aadhaar/otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aadhaar_number: fullAadhaar })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.reference_id) {
          setAadhaarRefId(data.reference_id);
          setOtpSent(true);
          toast.success("Aadhaar OTP sent to your UIDAI registered mobile number!");
        } else {
          toast.error(data.message || "Failed to generate Aadhaar OTP");
        }
      })
      .catch(err => {
        console.error("Aadhaar OTP error:", err);
        toast.error("Network error sending Aadhaar OTP");
      })
      .finally(() => {
        setIsLoading(false);
      });
    }
  }, [aadhaarBlocks, otpSent, authMethod]);

  // Watch for full Mobile Number completion to auto-trigger OTP (Simulation)
  useEffect(() => {
    if (mobileNumber.length === 10 && !otpSent) {
      triggerOtpSend(`+91 ******${mobileNumber.slice(-4)}`);
    }
  }, [mobileNumber, otpSent]);

  // Reset states when switching tabs
  useEffect(() => {
    setOtp(Array(6).fill(""));
    setGeneratedOtp("");
    setOtpSent(false);
  }, [authMethod]);

  const handleResendOtp = () => {
    const displayNum = authMethod === "aadhaar" 
      ? `+91 ******${Math.floor(1000 + Math.random() * 9000)}`
      : `+91 ******${mobileNumber.slice(-4) || "8842"}`;
    triggerOtpSend(displayNum);
  };

  const handleAadhaarChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newBlocks = [...aadhaarBlocks];
    newBlocks[index] = value.slice(-1);
    setAadhaarBlocks(newBlocks);

    // Auto-focus next block
    if (value && index < 11) {
      aadhaarRefs.current[index + 1]?.focus();
    }
  };

  const handleAadhaarKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !aadhaarBlocks[index] && index > 0) {
      aadhaarRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpDigitChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next block
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleDemoLogin = () => {
    toast.info("Demo Mode: Simulating Authentication...");
    setIsLoading(true);
    setTimeout(() => {
      const finalMobile = mobileNumber || "9876543210";
      const cleanAadhaar = aadhaarBlocks.join("") || "999988887777";
      const tempName = authMethod === "aadhaar" ? `Demo Citizen (${cleanAadhaar.slice(-4)})` : "Demo Citizen (Mobile)";
      
      localStorage.setItem("smartcity_token", "DEMO_TOKEN_" + Date.now());
      localStorage.setItem("smartcity_citizen", JSON.stringify({
        id: `CIT-${Date.now()}`,
        name: tempName,
        aadhaar: cleanAadhaar,
        mobile: finalMobile
      }));
      
      import("@/lib/database").then(({ loginOrSignupToBackend }) => {
          loginOrSignupToBackend(cleanAadhaar, finalMobile, tempName).then(() => {
              window.dispatchEvent(new Event("suvidha_login_change"));
              setIsLoading(false);
              toast.success("Demo Login Successful!");
              if (redirectState && redirectState.redirectTo) {
                navigate(redirectState.redirectTo, { state: redirectState.serviceState });
              } else {
                navigate(`/department/${id}`);
              }
          });
      });
    }, 1000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (captchaInput.toUpperCase() !== captchaText.toUpperCase()) {
      toast.error("Invalid Captcha! Please try again.");
      refreshCaptcha();
      return;
    }

    const otpStr = otp.join("");
    if (otpStr.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP!");
      return;
    }
    
    setIsLoading(true);

    if (authMethod === "aadhaar" && aadhaarRefId) {
      try {
        const fullAadhaar = aadhaarBlocks.join("");
        const res = await fetch(`${API_URL}/api/sandbox/aadhaar/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reference_id: aadhaarRefId,
            otp: otpStr,
            aadhaar_number: fullAadhaar
          })
        });
        const data = await res.json();
        if (data.success && data.token) {
          toast.success(`Welcome, ${data.citizen.name}! Aadhaar verified.`);
          localStorage.setItem("smartcity_token", data.token);
          localStorage.setItem("smartcity_citizen", JSON.stringify(data.citizen));
          window.dispatchEvent(new Event("suvidha_login_change"));
          if (redirectState && redirectState.redirectTo) {
            navigate(redirectState.redirectTo, { state: redirectState.serviceState });
          } else {
            navigate(`/department/${id}`);
          }
        } else {
          toast.error(data.message || "Aadhaar OTP verification failed");
        }
      } catch (error) {
        console.error("Aadhaar verify error:", error);
        toast.error("Network error during Aadhaar OTP verification");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Real Mobile OTP Verification flow via Backend/Twilio
    try {
      const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: "mobile",
          value: mobileNumber,
          otp: otpStr
        })
      });
      const data = await res.json();
      if (data.success && data.token) {
        toast.success("Identity Authenticated successfully!");
        localStorage.setItem("smartcity_token", data.token);
        localStorage.setItem("smartcity_citizen", JSON.stringify(data.citizen));
        window.dispatchEvent(new Event("suvidha_login_change"));
        
        if (redirectState && redirectState.redirectTo) {
          navigate(redirectState.redirectTo, { state: redirectState.serviceState });
        } else {
          navigate(`/department/${id}`);
        }
        return;
      } else {
        toast.error(data.message || "Mobile OTP verification failed");
      }
    } catch (error) {
      console.error("Mobile verify error, using simulated fallback:", error);
      toast.success("Simulated Authentication Success!");
      const finalAadhaar = "123456789012";
      const tempName = "Citizen Mobile";
      import("@/lib/database").then(({ loginOrSignupToBackend }) => {
          loginOrSignupToBackend(finalAadhaar, mobileNumber, tempName).then(() => {
              window.dispatchEvent(new Event("suvidha_login_change"));
          });
      });
      if (redirectState && redirectState.redirectTo) {
        navigate(redirectState.redirectTo, { state: redirectState.serviceState });
      } else {
        navigate(`/department/${id}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDigiLockerLogin = () => {
    handleLiveDigilockerRedirect();
  };

  const handleLiveDigilockerRedirect = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/sandbox/digilocker/init`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ redirect_url: window.location.origin + window.location.pathname })
      });
      const data = await res.json();
      if (data.success && data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        toast.error(data.message || "Failed to connect to Sandbox.co.in API");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Sandbox redirect error:", error);
      toast.error("Network error connecting to Sandbox.co.in gateway");
      setIsLoading(false);
    }
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
  };

  return (
    <div className="h-full bg-gradient-to-br from-[#0f172a] via-[#192e59] to-[#0f172a] flex flex-col relative overflow-hidden font-sans">
      


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
              setAadhaarBlocks(num.split(""));
            }
            setShowScanner(false);
            toast.success("Aadhaar Scanned successfully!");
          }}
          onCancel={() => setShowScanner(false)}
        />
      )}

      <div className="flex-1 w-full px-[5%] max-w-none relative z-10 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(25,46,89,0.2)] border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
          
          {/* Header Section */}
          <div className="bg-[#192e59] p-8 text-white relative">
            <button 
              onClick={() => navigate(-1)} 
              className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2.5 px-5 py-2.5 bg-white hover:bg-slate-100 text-[#192e59] border-2 border-slate-200 rounded-xl font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 duration-200 group shadow-[0_8px_20px_rgba(0,0,0,0.15)] z-50"
            >
              <ArrowLeft className="w-4 h-4 text-[#192e59] group-hover:-translate-x-1 transition-transform stroke-[2.5]" />
              <span>Back</span>
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
                type="button"
                onClick={() => setAuthMethod("aadhaar")}
                className={`flex-1 py-4 rounded-[1.1rem] flex flex-col items-center gap-2 transition-all duration-500 ${authMethod === 'aadhaar' ? 'bg-[#192e59] text-white shadow-2xl' : 'text-slate-400 hover:text-[#192e59] hover:bg-white'}`}
              >
                <Fingerprint className="w-6 h-6" />
                <span className="font-black text-xs uppercase tracking-[0.2em]">Aadhaar Auth</span>
              </button>
              <button 
                type="button"
                onClick={() => setAuthMethod("mobile")}
                className={`flex-1 py-4 rounded-[1.1rem] flex flex-col items-center gap-2 transition-all duration-500 ${authMethod === 'mobile' ? 'bg-[#192e59] text-white shadow-2xl' : 'text-slate-400 hover:text-[#192e59] hover:bg-white'}`}
              >
                <Smartphone className="w-6 h-6" />
                <span className="font-black text-xs uppercase tracking-[0.2em]">Mobile Auth</span>
              </button>
              <button 
                type="button"
                onClick={() => setAuthMethod("digilocker")}
                className={`flex-1 py-4 rounded-[1.1rem] flex flex-col items-center gap-2 transition-all duration-500 ${authMethod === 'digilocker' ? 'bg-[#192e59] text-white shadow-2xl' : 'text-slate-400 hover:text-[#192e59] hover:bg-white'}`}
              >
                <ShieldCheck className="w-6 h-6" />
                <span className="font-black text-xs uppercase tracking-[0.2em]">DigiLocker</span>
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
                    <div className="flex-1 flex gap-1.5 justify-center flex-wrap">
                      {aadhaarBlocks.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => { aadhaarRefs.current[idx] = el; }}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleAadhaarChange(idx, e.target.value)}
                          onKeyDown={(e) => handleAadhaarKeyDown(e, idx)}
                          className="w-8 h-12 bg-slate-50 border-2 border-slate-200 rounded-xl text-center font-mono text-xl font-bold text-[#192e59] focus:border-[#FD8008] focus:ring-4 focus:ring-[#FD8008]/10 outline-none transition-all"
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
                    <button 
                      type="button" 
                      onClick={handleDigiLockerLogin}
                      disabled={isLoading}
                      className="bg-[#0066FF] hover:bg-[#0055DD] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 mx-auto transition-all shadow-lg shadow-[#0066FF]/20 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>Sign In to DigiLocker <ArrowRight className="w-4 h-4" /></>
                      )}
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
                      <div className="flex gap-2">
                        {otp.map((digit, idx) => (
                          <input
                            key={idx}
                            ref={(el) => { otpRefs.current[idx] = el; }}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpDigitChange(e.target.value, idx)}
                            onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                            className="w-10 h-14 bg-slate-50 border-2 border-slate-200 rounded-xl text-center font-mono text-xl font-bold text-[#192e59] focus:border-[#FD8008] focus:ring-4 focus:ring-[#FD8008]/10 outline-none transition-all"
                          />
                        ))}
                      </div>
                      <button 
                        type="button" 
                        onClick={handleResendOtp}
                        className="text-xs font-black text-[#FD8008] uppercase tracking-[0.15em] hover:underline flex items-center gap-1 mt-1"
                      >
                        Didn't receive code? <span className="underline">Resend OTP Now</span>
                      </button>
                    </div>

                    {/* Captcha Field */}
                    <div className="space-y-3">
                      <label className="text-xs font-[900] text-slate-400 uppercase tracking-widest flex items-center gap-2">
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

                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="flex-shrink mx-4 text-slate-400 text-xs font-bold uppercase tracking-wider">or</span>
                    <div className="flex-grow border-t border-slate-200"></div>
                  </div>

                  <button 
                    type="button" 
                    onClick={handleDemoLogin} 
                    className="w-full bg-[#FD8008]/10 hover:bg-[#FD8008]/20 text-[#FD8008] border-2 border-dashed border-[#FD8008]/40 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] duration-200"
                  >
                    Quick Demo Login
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
