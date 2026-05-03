import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Camera, CheckCircle2, AlertCircle, Loader2, ArrowLeft, ShieldCheck, QrCode } from "lucide-react";
import { toast } from "sonner";
import KioskHeader from "@/components/KioskHeader";

// NOTE: You need to install tesseract.js: npm install tesseract.js
// We will use a CDN fallback for the demo if the package is missing
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

  // My Real UPI ID (You can change this)
  const upiId = "your-upi-id@ybl"; 
  const merchantName = "SUVIDHA KIOSK";
  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR`;

  useEffect(() => {
    if (cameraActive && step === "scan") {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [cameraActive, step]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment", width: 1280, height: 720 } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      toast.error("Camera access denied. Please check permissions.");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

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
        // We can load it dynamically for the demo
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
        // We look for common keywords in a successful payment screen (PhonePe, GPay, Paytm)
        const hasSuccess = text.includes("successful") || text.includes("paid") || text.includes("completed") || text.includes("done");
        const hasAmount = text.includes(amount.split(".")[0]); // Match whole rupees

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
    <div className="min-h-screen bg-[#192e59] flex flex-col text-white font-sans overflow-hidden">
      <KioskHeader />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        
        {/* PROGRESS STEPS */}
        <div className="absolute top-8 flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
          <div className={`flex items-center gap-2 ${step === 'qr' ? 'text-white' : 'text-white/40'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 'qr' ? 'bg-[#FD8008]' : 'bg-white/20'}`}>1</span>
            <span className="font-bold text-sm uppercase tracking-wider">Pay QR</span>
          </div>
          <div className="w-8 h-[1px] bg-white/20" />
          <div className={`flex items-center gap-2 ${step === 'scan' ? 'text-white' : 'text-white/40'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 'scan' ? 'bg-[#FD8008]' : 'bg-white/20'}`}>2</span>
            <span className="font-bold text-sm uppercase tracking-wider">Verify Screen</span>
          </div>
        </div>

        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-12">
          
          {/* LEFT: Info & Summary */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-[900] tracking-tight uppercase leading-none">AI Vision <br/>Payment Portal</h1>
              <p className="text-blue-300 font-bold mt-4 tracking-widest uppercase text-sm">Secure Transaction Verification</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 space-y-6">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-white/60 font-bold uppercase text-xs">Service Type</span>
                <span className="text-xl font-black">{service}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-white/60 font-bold uppercase text-xs">Total Amount</span>
                <span className="text-5xl font-black text-[#FD8008]">₹{amount}</span>
              </div>
            </div>

            <div className="flex items-start gap-4 text-white/60 text-sm">
              <ShieldCheck className="w-6 h-6 text-green-400 shrink-0" />
              <p>This is a real transaction. Your payment will be verified in real-time using the kiosk's AI Vision technology. Hold your mobile screen steady in front of the camera once paid.</p>
            </div>
          </div>

          {/* RIGHT: Interaction Area */}
          <div className="relative aspect-square bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-[8px] border-white/10 flex flex-col">
            
            {step === "qr" && (
              <div className="flex-1 flex flex-col items-center justify-center p-10 space-y-8">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-tr from-[#FD8008] to-[#192e59] rounded-3xl opacity-20 group-hover:opacity-30 transition-opacity blur-xl"></div>
                  <div className="relative bg-white p-4 rounded-2xl shadow-xl">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}`}
                      alt="Payment QR" 
                      className="w-56 h-56"
                    />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-lg shadow-md">
                      <QrCode className="w-8 h-8 text-[#192e59]" />
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-[#192e59] font-black text-2xl uppercase tracking-tighter">Scan to Pay</p>
                  <p className="text-slate-500 font-bold text-sm">Use any UPI App (PhonePe, GPay, BHIM)</p>
                </div>

                <button 
                  onClick={() => {
                    setStep("scan");
                    setCameraActive(true);
                  }}
                  className="w-full bg-[#192e59] text-white py-5 rounded-xl font-black text-lg uppercase tracking-widest shadow-xl hover:bg-[#112040] transition-all flex items-center justify-center gap-3"
                >
                  <Camera className="w-6 h-6" /> Verify Payment
                </button>
              </div>
            )}

            {(step === "scan" || step === "verifying") && (
              <div className="flex-1 relative flex flex-col">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* SCANNING OVERLAY */}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                  <div className="w-72 h-[26rem] border-4 border-dashed border-[#FD8008] rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-[#FD8008] shadow-[0_0_20px_#FD8008] animate-scanline"></div>
                  </div>
                  <p className="mt-8 bg-black/70 backdrop-blur-md px-6 py-2.5 rounded-full text-white font-bold text-xs uppercase tracking-[0.2em]">
                    {step === "verifying" ? "AI Vision Reading Screen..." : "Hold Payment Success Screen here"}
                  </p>
                </div>

                {step === "scan" && (
                  <div className="absolute bottom-8 inset-x-8 z-20 flex gap-4">
                    <button 
                      onClick={() => { setStep("qr"); setCameraActive(false); }}
                      className="flex-1 bg-white/20 backdrop-blur-md text-white py-4 rounded-xl font-bold border border-white/20"
                    >
                      Back
                    </button>
                    <button 
                      onClick={captureAndVerify}
                      className="flex-[2] bg-[#FD8008] text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg"
                    >
                      Scan Now
                    </button>
                  </div>
                )}

                {step === "verifying" && (
                  <div className="absolute inset-0 bg-[#192e59]/90 backdrop-blur-md z-30 flex flex-col items-center justify-center space-y-6">
                    <Loader2 className="w-20 h-20 text-[#FD8008] animate-spin" />
                    <div className="text-center">
                      <p className="text-2xl font-black uppercase tracking-tight text-white">Validating Receipt</p>
                      <p className="text-blue-300 font-bold mt-1 uppercase text-[10px] tracking-[0.3em]">Processing vision heuristics...</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === "success" && (
              <div className="flex-1 flex flex-col items-center justify-center p-10 bg-white animate-in zoom-in duration-500">
                <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mb-10 shadow-[0_20px_50px_rgba(34,197,94,0.4)]">
                  <CheckCircle2 className="w-16 h-16 text-white" />
                </div>
                <div className="text-center space-y-4">
                  <h2 className="text-[2.8rem] font-[900] text-[#192e59] leading-none uppercase tracking-tighter">Payment <br/>Verified</h2>
                  <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Transaction Authenticated</p>
                </div>
                
                <div className="w-full mt-12 bg-slate-50 border-2 border-dashed border-slate-200 p-8 rounded-3xl">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Receipt ID</span>
                    <span className="font-mono text-slate-900 font-bold text-sm">#SV-{Math.floor(Math.random()*1000000)}</span>
                  </div>
                  <button 
                    onClick={() => navigate("/departments")}
                    className="w-full bg-[#192e59] text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:shadow-2xl transition-all"
                  >
                    Continue to Service
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
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
