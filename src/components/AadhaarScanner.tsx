import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { ShieldCheck, X, Camera, Loader2 } from "lucide-react";

interface AadhaarScannerProps {
    onSuccess: (data: string) => void;
    onCancel: () => void;
}

export const AadhaarScanner = ({ onSuccess, onCancel }: AadhaarScannerProps) => {
    const [isScanning, setIsScanning] = useState(false);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false
        );

        scanner.render(
            (decodedText) => {
                // Aadhaar QR usually contains XML or large string
                console.log("Aadhaar Data:", decodedText);
                scanner.clear();
                onSuccess(decodedText);
            },
            (error) => {
                // Silently handle scan errors
            }
        );

        scannerRef.current = scanner;

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(e => console.warn("Scanner cleanup failed", e));
            }
        };
    }, [onSuccess]);

    return (
        <div className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-10">
            <div className="w-full max-w-2xl bg-white rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
                
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center text-white">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">Aadhaar QR Scanner</h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hold your Aadhaar card QR to the camera</p>
                        </div>
                    </div>
                    <button onClick={onCancel} className="p-3 hover:bg-slate-200 rounded-full transition-colors">
                        <X className="h-6 w-6 text-slate-500" />
                    </button>
                </div>

                <div className="p-10">
                    <div id="reader" className="w-full rounded-3xl overflow-hidden border-4 border-slate-100 bg-slate-900 aspect-square shadow-inner relative">
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                            <div className="w-64 h-64 border-2 border-primary/50 rounded-3xl animate-pulse flex items-center justify-center">
                                <div className="w-full h-0.5 bg-primary animate-[scan_2s_infinite]" />
                            </div>
                            <p className="mt-8 text-white/40 font-bold text-sm tracking-widest animate-pulse">DETECTING QR CODE...</p>
                        </div>
                    </div>
                    
                    <div className="mt-10 flex items-center gap-6 p-6 bg-primary/5 rounded-3xl border border-primary/10">
                        <Camera className="h-10 w-10 text-primary" />
                        <p className="text-sm font-bold text-slate-600 leading-relaxed">
                            Your Aadhaar data is processed locally on this kiosk. No data is stored or shared without your explicit consent.
                        </p>
                    </div>
                </div>

                <div className="p-8 bg-slate-50 text-center">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Official Government Authentication Module v4.2</p>
                </div>
            </div>

            <style>{`
                @keyframes scan {
                    0% { transform: translateY(-120px); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateY(120px); opacity: 0; }
                }
                #reader__scan_region video {
                    object-fit: cover !important;
                    width: 100% !important;
                    height: 100% !important;
                    border-radius: 1.5rem;
                }
                #reader__dashboard {
                    display: none !important;
                }
                #reader {
                    border: none !important;
                }
            `}</style>
        </div>
    );
};
