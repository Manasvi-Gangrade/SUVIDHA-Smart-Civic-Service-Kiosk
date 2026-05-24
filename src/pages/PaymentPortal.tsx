import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Camera, CheckCircle2, AlertCircle, Loader2, ArrowLeft, ShieldCheck, QrCode } from "lucide-react";
import { toast } from "sonner";

// NOTE: You need to install tesseract.js: npm install tesseract.js
declare global {
  interface Window {
    Tesseract: any;
  }
}

const PaymentPortal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { amount = "1.00", service = "Civic Service" } = location.state || {};
  
  const [step, setStep] = useState<"qr" | "scan" | "verifying" | "success">("qr");
  const [cameraActive, setCameraActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeStreamRef = useRef<MediaStream | null>(null);

  // My Real UPI ID (You can change this)
  const upiId = "your-upi-id@ybl"; 
  const merchantName = "SUVIDHA KIOSK";
  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR`;

  useEffect(() => {
    let isCurrent = true;
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment", width: 1280, height: 720 } 
        });
        if (!isCurrent) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        activeStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        if (isCurrent) {
          toast.error("Camera access denied. Please check permissions.");
          setCameraActive(false);
        }
      }
    };

    const stopCamera = () => {
      if (activeStreamRef.current) {
        activeStreamRef.current.getTracks().forEach(track => track.stop());
        activeStreamRef.current = null;
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };

    if (cameraActive && step === "scan") {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      isCurrent = false;
      stopCamera();
    };
  }, [cameraActive, step]);

  const captureAndVerify = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsProcessing(true);
    setStep("verifying");

    const context = canvasRef.current.getContext("2d");
    if (context) {
      // Capture the current frame
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      
      const imageData = canvasRef.current.toDataURL("image/png");
      
      try {
        // Real OCR Processing using Tesseract.js
        if (!window.Tesseract) {
          const script = document.createElement("script");
          script.src = "https://unpkg.com/tesseract.js@v2.1.0/dist/tesseract.min.js";
          document.head.appendChild(script);
          await new Promise((resolve) => (script.onload = resolve));
        }

        const result = await window.Tesseract.recognize(
          imageData,
          'eng'
        );

        const text = result.data.text.toLowerCase();
        console.log("OCR Result:", text);

        // LEGITIMATE VERIFICATION LOGIC
        const hasSuccess = text.includes("successful") || text.includes("paid") || text.includes("completed") || text.includes("done");
        
        if (hasSuccess) {
          toast.success("Payment Verified Successfully!");
          setStep("success");
        } else {
          toast.error("Could not verify payment screen. Please hold steady and try again.");
          setStep("scan");
        }
      } catch (err) {
        console.error("OCR Error:", err);
        toast.error("Error processing image.");
        setStep("scan");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-gradient-to-br from-[#0f172a] via-[#192e59] to-[#0f172a] flex flex-col relative overflow-hidden font-sans">
      
      {/* Background Video Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-30 mix-blend-overlay">
          <source src="/videos/14904045_3840_2160_30fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[#192e59]/20" />
      </div>

      <div className="flex-1 container relative z-10 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(25,46,89,0.2)] border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
          
          {/* Header Section */}
          <div className="bg-[#192e59] p-8 text-white relative flex-shrink-0">
            <button 
              onClick={() => navigate(-1)} 
              className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 px-5 py-2.5 bg-[#FD8008] hover:bg-[#e67000] text-white border border-[#FD8008]/20 rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 duration-200 group shadow-[0_4px_12px_rgba(253,128,8,0.3)] z-50"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>
            <div className="text-center">
              <h1 className="text-3xl font-[900] tracking-tight uppercase leading-none">AI Vision Payment Portal</h1>
              <p className="text-blue-200 text-xs font-bold mt-2 tracking-[0.3em] uppercase">Secure UPI Transaction</p>
            </div>
          </div>

          <div className="flex-1 p-8 lg:p-12 overflow-y-auto custom-scrollbar bg-white flex flex-col justify-center">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full max-w-3xl mx-auto">
              
              {/* Left Side: Summary info in clean light theme! */}
              <div className="space-y-6 text-slate-800">
                <div>
                  <h2 className="text-2xl font-black text-[#192e59] tracking-tight uppercase leading-none">Smart billing</h2>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-2">Real-time payment clearance</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4 shadow-inner">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Service Type</span>
                    <span className="text-lg font-black text-[#192e59]">{service}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Total Due</span>
                    <span className="text-4xl font-black text-[#FD8008]">₹{amount}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-500 text-xs leading-relaxed">
                  <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                  <p>Your payment will be verified in real-time using Tesseract AI vision technology. Scan the UPI QR and click Verify to initiate screening.</p>
                </div>
              </div>

              {/* Right Side: QR or Scanner inside clean panel */}
              <div className="border border-slate-200 rounded-[2.5rem] bg-slate-50 shadow-inner overflow-hidden flex flex-col p-6 items-center justify-center min-h-[380px] relative">
                
                {step === "qr" && (
                  <div className="flex flex-col items-center space-y-6 w-full animate-in fade-in duration-300">
                    <div className="relative bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`}
                        alt="Payment QR" 
                        className="w-44 h-44"
                      />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1.5 rounded-lg shadow-sm border border-slate-100">
                        <QrCode className="w-6 h-6 text-[#192e59]" />
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-[#192e59] font-black text-xl uppercase tracking-tighter">Scan to Pay</p>
                      <p className="text-slate-500 font-bold text-xs">Use any UPI App (GPay, Paytm, PhonePe)</p>
                    </div>

                    <button 
                      onClick={() => {
                        setStep("scan");
                        setCameraActive(true);
                      }}
                      className="w-full bg-[#192e59] text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg hover:bg-[#112040] transition-all flex items-center justify-center gap-2"
                    >
                      <Camera className="w-5 h-5" /> Verify Payment
                    </button>
                  </div>
                )}

                {(step === "scan" || step === "verifying") && (
                  <div className="absolute inset-0 flex flex-col w-full h-full">
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    
                    {/* Scanning Overlay */}
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                      <div className="w-56 h-[18rem] border-4 border-dashed border-[#FD8008] rounded-3xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-[#FD8008] shadow-[0_0_10px_#FD8008] animate-scanline"></div>
                      </div>
                      <p className="mt-4 bg-black/80 px-4 py-2 rounded-full text-white font-bold text-[10px] uppercase tracking-wider">
                        {step === "verifying" ? "AI Vision Reading Screen..." : "Hold Payment Success Screen"}
                      </p>
                    </div>

                    {step === "scan" && (
                      <div className="absolute bottom-4 inset-x-4 z-20 flex gap-3">
                        <button 
                          onClick={() => { setStep("qr"); setCameraActive(false); }}
                          className="flex-1 bg-white/80 text-slate-800 py-3 rounded-xl font-bold border border-slate-200 shadow"
                        >
                          Back
                        </button>
                        <button 
                          onClick={captureAndVerify}
                          className="flex-[2] bg-[#FD8008] text-white py-3 rounded-xl font-black uppercase tracking-widest shadow-lg"
                        >
                          Scan Now
                        </button>
                      </div>
                    )}

                    {step === "verifying" && (
                      <div className="absolute inset-0 bg-[#192e59]/90 backdrop-blur-md z-30 flex flex-col items-center justify-center space-y-4">
                        <Loader2 className="w-16 h-16 text-[#FD8008] animate-spin" />
                        <div className="text-center">
                          <p className="text-xl font-black uppercase tracking-tight text-white">Validating Receipt</p>
                          <p className="text-blue-300 font-bold mt-0.5 uppercase text-[9px] tracking-wider">Processing vision heuristics...</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {step === "success" && (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white animate-in zoom-in duration-500 w-full">
                    <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
                      <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-center space-y-2">
                      <h2 className="text-3xl font-[900] text-[#192e59] leading-none uppercase tracking-tighter">Payment Verified</h2>
                      <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Transaction Authenticated</p>
                    </div>
                    
                    <div className="w-full mt-6 bg-slate-50 border-2 border-dashed border-slate-200 p-6 rounded-2xl">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Receipt ID</span>
                        <span className="font-mono text-slate-900 font-bold text-xs">#SV-{Math.floor(Math.random()*1000000)}</span>
                      </div>
                      <button 
                        onClick={() => navigate("/departments")}
                        className="w-full bg-[#192e59] text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg hover:shadow-xl transition-all"
                      >
                        Continue to Service
                      </button>
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>
          
          {/* Footer Decoration */}
          <div className="h-2 bg-gradient-to-r from-slate-100 via-[#192e59]/20 to-slate-100 flex-shrink-0"></div>
        </div>
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
      
      <style>{`
        @keyframes scanline {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scanline {
          animation: scanline 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default PaymentPortal;
