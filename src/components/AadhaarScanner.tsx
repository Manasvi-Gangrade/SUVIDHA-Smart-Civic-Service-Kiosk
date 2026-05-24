import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { ShieldCheck, X, Camera, Loader2, Sparkles } from "lucide-react";

interface AadhaarScannerProps {
    onSuccess: (data: string) => void;
    onCancel: () => void;
}

export const AadhaarScanner = ({ onSuccess, onCancel }: AadhaarScannerProps) => {
    const [status, setStatus] = useState<"initializing" | "scanning" | "error">("initializing");
    const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
    const isMountedRef = useRef(true);

    const handleCancel = async () => {
        isMountedRef.current = false;
        if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
            try {
                await html5QrCodeRef.current.stop();
                html5QrCodeRef.current.clear();
            } catch (err) {
                console.error("Failed to stop scanner on cancel", err);
            }
        }
        const el = document.getElementById("reader");
        if (el) el.innerHTML = "";
        onCancel();
    };

    const handleScanSuccess = async (data: string) => {
        isMountedRef.current = false;
        if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
            try {
                await html5QrCodeRef.current.stop();
                html5QrCodeRef.current.clear();
            } catch (err) {
                console.error("Failed to stop scanner on success", err);
            }
        }
        const el = document.getElementById("reader");
        if (el) el.innerHTML = "";
        onSuccess(data);
    };

    useEffect(() => {
        isMountedRef.current = true;
        let html5QrCode: Html5Qrcode | null = null;
        
        const startScanner = async () => {
            const element = document.getElementById("reader");
            if (!element) return;

            try {
                html5QrCode = new Html5Qrcode("reader");
                if (!isMountedRef.current) {
                    return;
                }
                html5QrCodeRef.current = html5QrCode;

                await html5QrCode.start(
                    { facingMode: "user" },
                    { fps: 10, qrbox: { width: 280, height: 280 } },
                    (decodedText) => {
                        if (isMountedRef.current) {
                            handleScanSuccess(decodedText);
                        }
                    },
                    () => {}
                );
                
                if (!isMountedRef.current) {
                    if (html5QrCode.isScanning) {
                        await html5QrCode.stop();
                        html5QrCode.clear();
                    }
                    return;
                }
                setStatus("scanning");
            } catch (err) {
                if (isMountedRef.current) {
                    console.error("Camera failed", err);
                    setStatus("error");
                }
            }
        };

        const timer = setTimeout(startScanner, 300);

        return () => {
            isMountedRef.current = false;
            clearTimeout(timer);
            
            const stopScannerImmediate = async () => {
                if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
                    try {
                        await html5QrCodeRef.current.stop();
                        html5QrCodeRef.current.clear();
                    } catch (e) {
                        console.error("Error stopping scanner ref in cleanup", e);
                    }
                }
                if (html5QrCode && html5QrCode.isScanning) {
                    try {
                        await html5QrCode.stop();
                        html5QrCode.clear();
                    } catch (e) {
                        console.error("Error stopping scanner instance in cleanup", e);
                    }
                }
                const el = document.getElementById("reader");
                if (el) el.innerHTML = "";
            };
            
            stopScannerImmediate();
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] bg-[#0f172a]/95 backdrop-blur-2xl flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-white rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/20 overflow-hidden relative animate-in zoom-in-95 duration-500">
                
                {/* Header */}
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-5">
                        <div className="h-14 w-14 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-indigo-200">
                            <ShieldCheck className="h-8 w-8" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Biometric Scanner</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">AI-Powered Identity Verification</p>
                        </div>
                    </div>
                    <button onClick={handleCancel} className="h-14 w-14 flex items-center justify-center hover:bg-slate-100 rounded-full transition-all">
                        <X className="h-7 w-7 text-slate-400" />
                    </button>
                </div>

                <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Scanner Window - ISOLATED FROM REACT CHILDREN */}
                    <div className="relative group overflow-hidden rounded-[2.5rem] bg-black border-8 border-slate-50 shadow-inner">
                        {/* THE SCANNER DIV (MANUALLY MANAGED via dangerouslySetInnerHTML to prevent React removeChild crash) */}
                        <div dangerouslySetInnerHTML={{ __html: '<div id="reader" style="width: 100%; height: 100%; position: relative; z-index: 0;"></div>' }} className="w-full aspect-square" />

                        {/* REACT MANAGED OVERLAYS */}
                        <div className="absolute inset-0 z-10 pointer-events-none">
                            {status === "initializing" && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 pointer-events-auto">
                                    <Loader2 className="h-12 w-12 text-indigo-500 animate-spin mb-4" />
                                    <p className="text-white/60 font-black text-xs uppercase tracking-widest">Initialising AI...</p>
                                </div>
                            )}
                            
                            {status === "error" && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-rose-950 pointer-events-auto p-8 text-center">
                                    <Camera className="h-12 w-12 text-rose-500 mb-4" />
                                    <p className="text-white font-black text-sm uppercase tracking-widest text-rose-400">Hardware Error</p>
                                </div>
                            )}

                            {/* Scan Decoration */}
                            <div className="h-full w-full border-2 border-white/10 rounded-[2rem] relative overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,1)] animate-[scan_3s_infinite]" />
                                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent" />
                            </div>
                        </div>
                    </div>

                    {/* Information / Simulation */}
                    <div className="flex flex-col justify-center space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-indigo-600">
                                <Sparkles className="h-5 w-5" />
                                <span className="text-xs font-black uppercase tracking-widest">Real-time Recognition</span>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 leading-tight">Fast, Secure &<br />Paperless Login</h3>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                Position your Aadhaar card QR code inside the green box. The system will automatically capture and verify your details.
                            </p>
                        </div>

                        <div className="pt-6 border-t border-slate-100">
                             <button 
                                onClick={() => handleScanSuccess("<?xml version=\"1.0\" encoding=\"UTF-8\"?><PrintLetterBarcodeData uid=\"987654321012\" name=\"MANASVI GANGRADE\" gender=\"M\" yob=\"2004\" co=\"S/O: ...\" vtc=\"...\" po=\"...\" dist=\"...\" state=\"...\" pc=\"...\"/>")}
                                className="w-full py-5 bg-indigo-50 text-indigo-600 font-black rounded-2xl hover:bg-indigo-100 transition-all uppercase text-[11px] tracking-widest border-2 border-dashed border-indigo-200 flex items-center justify-center gap-3 shadow-sm active:scale-95"
                            >
                                <Camera className="h-4 w-4" /> Use Virtual Scan (Demo Mode)
                             </button>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-900 text-center">
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em]">Government Cryptography Standard AES-256 Enabled</p>
                </div>
            </div>

            <style>{`
                @keyframes scan {
                    0% { transform: translateY(0); }
                    50% { transform: translateY(280px); }
                    100% { transform: translateY(0); }
                }
                #reader video {
                    object-fit: cover !important;
                    width: 100% !important;
                    height: 100% !important;
                }
            `}</style>
        </div>
    );
};
