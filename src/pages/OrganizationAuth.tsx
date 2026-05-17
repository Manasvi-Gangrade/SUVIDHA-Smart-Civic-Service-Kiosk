import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ShieldCheck, ArrowRight, Loader2, KeyRound } from "lucide-react";

export const OrganizationAuth = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [authMethod, setAuthMethod] = useState<"consumer" | "aadhaar" | "mobile">("consumer");
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API Auth verification and sending OTP
    setTimeout(() => {
      setIsLoading(false);
      setShowOtp(true);
    }, 1500);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      // Simulate JWT fetch and store
      localStorage.setItem("session_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_token");
      // Route to the actual department portal upon success
      navigate(`/department/${id}`);
    }, 1500);
  };

  const getDeptName = () => {
    switch(id) {
      case 'electricity': return 'Electricity Board';
      case 'gas': return 'Gas Distribution Agency';
      case 'water': return 'Water Supply Board';
      case 'municipal': return 'Municipal Corporation';
      default: return 'Department';
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Kiosk Background */}
      <div className="absolute inset-0 bg-primary/5 -z-10" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10" />

      <div className="flex-1 container flex items-center justify-center p-6 animate-in slide-in-from-bottom-8 fade-in duration-700">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 bg-card rounded-[2rem] shadow-2xl border border-border p-8 md:p-12 overflow-hidden relative">
          
          {/* Left Column: Form */}
          <div className="relative z-10 flex flex-col justify-center">
          
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center border-4 border-primary/20">
              <ShieldCheck className="h-10 w-10 text-primary" />
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-foreground tracking-tight">
              {getDeptName()} Login
            </h1>
            <p className="text-muted-foreground mt-2 font-medium">
              Please authenticate to access personalized {id} services
            </p>
          </div>

          <div className="flex bg-muted rounded-xl p-1 mb-8 gap-1">
            <button
              onClick={() => { setAuthMethod("consumer"); setShowOtp(false); setInputValue(""); }}
              className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${
                authMethod === "consumer" 
                  ? "bg-card text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Consumer ID
            </button>
            <button
              onClick={() => { setAuthMethod("mobile"); setShowOtp(false); setInputValue(""); }}
              className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${
                authMethod === "mobile" 
                  ? "bg-card text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Mobile No
            </button>
            <button
              onClick={() => { setAuthMethod("aadhaar"); setShowOtp(false); setInputValue(""); }}
              className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${
                authMethod === "aadhaar" 
                  ? "bg-card text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Aadhaar OTP
            </button>
          </div>

          {!showOtp ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                {authMethod === "consumer" ? "Enter 10-digit Consumer ID" : authMethod === "mobile" ? "Enter 10-digit Mobile Number" : "Enter 12-digit Aadhaar Number"}
              </label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value.replace(/\D/g, '').slice(0, authMethod === "aadhaar" ? 12 : 10))}
                  className="kiosk-touch-target w-full rounded-2xl border-2 border-input bg-background pl-14 pr-4 py-5 text-2xl tracking-[0.2em] font-mono focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all"
                  placeholder={authMethod === "aadhaar" ? "XXXX XXXX XXXX" : "1234567890"}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || inputValue.length < 10}
              className="kiosk-touch-target w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground py-5 rounded-2xl text-xl font-bold transition-all hover:brightness-110 disabled:opacity-50 disabled:pointer-events-none shadow-xl shadow-primary/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" /> Sending OTP...
                </>
              ) : (
                <>
                  Request OTP <ArrowRight className="h-6 w-6" />
                </>
              )}
            </button>
          </form>
          ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6 animate-in slide-in-from-right fade-in duration-500">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2 text-center">
                Enter 4 or 6-digit Secure OTP
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="kiosk-touch-target w-full rounded-2xl border-2 border-input bg-background px-4 py-5 text-4xl tracking-[0.5em] font-mono text-center focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all"
                  placeholder="------"
                  autoFocus
                  required
                />
              </div>
              <p className="text-center text-sm text-muted-foreground mt-4">
                OTP sent to {authMethod === "consumer" ? "your registered number" : authMethod === "mobile" ? "your mobile number" : "Aadhaar linked number"}
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.length < 4}
              className="kiosk-touch-target w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground py-5 rounded-2xl text-xl font-bold transition-all hover:brightness-110 disabled:opacity-50 disabled:pointer-events-none shadow-xl shadow-primary/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" /> Verifying...
                </>
              ) : (
                <>
                  Verify & Secure Login <ArrowRight className="h-6 w-6" />
                </>
              )}
            </button>
          </form>
          )}
          
          <div className="mt-8 text-center">
            <button 
              onClick={() => navigate('/home')}
              className="text-muted-foreground font-bold hover:text-foreground transition-colors"
            >
              ← Cancel & Return to Organizations
            </button>
          </div>

          </div>

          {/* Right Column: Information & Media */}
          <div className="hidden lg:flex flex-col gap-6 justify-center bg-muted/30 p-8 rounded-[1.5rem] border border-border/50 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
             
             <div>
               <h3 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                 <ShieldCheck className="h-6 w-6 text-primary" /> Why Aadhaar?
               </h3>
               <p className="text-muted-foreground text-sm">
                 Aadhaar linkage ensures transparent, secure, and fast tracking of civic services. Watch the video below to understand how your data is protected.
               </p>
             </div>

             {/* Why Aadhaar Video */}
             <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-border">
                <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/1DOe0eRzbJo?autoplay=1&mute=1&loop=1&playlist=1DOe0eRzbJo" 
                    title="Why Aadhaar?" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                ></iframe>
             </div>

             {/* Infographic / Person Image */}
             <div className="relative w-full h-40 bg-card rounded-xl overflow-hidden border border-border shadow-inner group">
                <img 
                  src="https://images.unsplash.com/photo-1573164574572-cb89e39749b4?w=800&q=80" 
                  alt="Citizen holding Aadhaar" 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                  <p className="text-white font-bold text-lg">Secure & Verified</p>
                  <p className="text-white/80 text-xs mt-1">Replace this image with 'aadhaar_person.png'</p>
                </div>
             </div>

          </div>

        </div>
      </div>
    </div>
  );
};
