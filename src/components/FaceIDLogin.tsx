import { useState, useEffect, useRef } from "react";
import { Camera, ShieldCheck, X, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface FaceIDLoginProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const FaceIDLogin = ({ onSuccess, onCancel }: FaceIDLoginProps) => {
  const [status, setStatus] = useState<"initializing" | "scanning" | "verifying" | "success" | "error">("initializing");
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setStream(mediaStream);
        setStatus("scanning");
      } catch (err) {
        console.error("Camera access failed", err);
        setStatus("error");
        toast.error("Camera access denied or not available.");
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (status === "scanning") {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setStatus("verifying");
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [status]);

  useEffect(() => {
    if (status === "verifying") {
      const timer = setTimeout(() => {
        setStatus("success");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [status]);

  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => {
        onSuccess();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [status, onSuccess]);

  return (
    <div className="space-y-6 text-center">
      <div className="relative">
        {/* Video Preview */}
        <div className="relative mx-auto w-64 h-64 rounded-full overflow-hidden border-4 border-primary/20 bg-slate-900 shadow-2xl">
          {status !== "error" ? (
            <video 
              ref={videoRef} 
              autoPlay 
              muted 
              playsInline 
              className={`w-full h-full object-cover transition-opacity duration-500 ${(status === 'verifying' || status === 'success') ? 'opacity-40 grayscale' : 'opacity-100'}`}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 p-4">
              <AlertCircle className="h-12 w-12 mb-2" />
              <p className="text-xs">Camera Error</p>
            </div>
          )}

          {/* Scanning Overlay */}
          {status === "scanning" && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Horizontal Scanning Line */}
              <div 
                className="absolute w-full h-0.5 bg-primary shadow-[0_0_15px_#10b981] animate-[scan_2s_ease-in-out_infinite]"
                style={{ top: `${progress}%` }}
              />
              {/* Corner Accents */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-primary rounded-tl-lg" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-primary rounded-tr-lg" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-primary rounded-bl-lg" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-primary rounded-br-lg" />
            </div>
          )}

          {/* Verification Overlay */}
          {(status === "verifying" || status === "success") && (
            <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
              {status === "verifying" ? (
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-xs font-bold text-primary uppercase tracking-widest">Matching Data...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center animate-in zoom-in duration-300">
                  <CheckCircle2 className="h-16 w-16 text-kiosk-green mb-2" />
                  <p className="text-xs font-bold text-kiosk-green uppercase tracking-widest">Verified</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Cancel Button */}
        <button 
          onClick={onCancel}
          className="absolute -top-2 -right-2 p-2 bg-card border border-border rounded-full hover:bg-muted transition-colors shadow-md"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div>
        <h2 className="text-xl font-bold text-foreground">
          {status === "initializing" && "Initializing Sensor..."}
          {status === "scanning" && "Scanning Face"}
          {status === "verifying" && "Security Check"}
          {status === "success" && "Identity Confirmed"}
          {status === "error" && "Identity Verification Failed"}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {status === "scanning" && `Progress: ${progress}%`}
          {status === "verifying" && "Biometric cross-referencing..."}
          {status === "success" && "Welcome back, Citizen!"}
          {status === "error" && "Please use Mobile OTP instead."}
        </p>
      </div>

      {status === "error" && (
        <button
          onClick={onCancel}
          className="w-full py-3 rounded-xl bg-primary text-white font-bold"
        >
          Try Phone Login
        </button>
      )}

      <style>{`
        @keyframes scan {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(220px); }
        }
      `}</style>
    </div>
  );
};

export default FaceIDLogin;
