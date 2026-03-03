import { useState, useEffect } from "react";
import { ScanFace, ScanLine, CheckCircle2, X, Camera } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";

interface ScannerOverlayProps {
    onClose: () => void;
    onSuccess: (scannedData: any) => void;
    scanType?: "aadhaar" | "qr";
}

const ScannerOverlay = ({ onClose, onSuccess, scanType = "qr" }: ScannerOverlayProps) => {
    const [scanState, setScanState] = useState<"initializing" | "scanning" | "success">("initializing");
    const [hasCamera, setHasCamera] = useState(true);

    useEffect(() => {
        let html5QrCode: Html5Qrcode;

        // Slight delay for animation before mounting camera UI
        const initTimer = setTimeout(() => {
            setScanState("scanning");

            const qrCodeId = "qr-reader";
            html5QrCode = new Html5Qrcode(qrCodeId);

            html5QrCode.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                (decodedText) => {
                    // Success Callback
                    setScanState("success");
                    html5QrCode.stop().then(() => {
                        html5QrCode.clear();
                    });

                    setTimeout(() => {
                        // If it's Aadhaar, mock parse the text, else treat as account details
                        onSuccess({
                            name: "Rajesh Kumar",
                            accountNo: decodedText.substring(0, 10) || "ELE-8829-4591",
                            aadhaar: decodedText.substring(0, 12) || "4921 xxxx xxxx",
                            address: "Block B, Sector 4, New Delhi",
                        });
                        onClose();
                    }, 1500);
                },
                () => {
                    // Error/Scanning progress callback (ignore to prevent log spam)
                }
            ).catch((err) => {
                console.error("Camera start failed", err);
                setHasCamera(false);
            });
        }, 800);

        return () => {
            clearTimeout(initTimer);
            if (html5QrCode && html5QrCode.isScanning) {
                html5QrCode.stop().then(() => html5QrCode.clear()).catch(console.error);
            }
        };
    }, [onClose, onSuccess]);

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <button
                onClick={onClose}
                className="absolute right-8 top-8 rounded-full bg-white/10 p-4 text-white hover:bg-white/20 transition-colors z-50"
            >
                <X className="h-6 w-6" />
            </button>

            <div className="flex flex-col items-center justify-center w-full max-w-lg">
                <h2 className="text-3xl font-black text-white tracking-widest uppercase mb-12">
                    {scanState === "success" ? "Verification Complete" : `Scan ${scanType === "aadhaar" ? "Aadhaar Card" : "QR Code"}`}
                </h2>

                {/* Scanner Viewport */}
                <div className="relative h-80 w-80 rounded-[40px] border-4 border-white/20 bg-black overflow-hidden shrink-0 shadow-[0_0_100px_rgba(34,197,94,0.1)]">

                    {!hasCamera && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-red-400 p-6 text-center z-20 bg-black/80">
                            <Camera className="h-12 w-12 mb-4 opacity-50" />
                            <p className="font-bold">Camera Access Denied or Not Found.</p>
                            <p className="text-sm mt-2 opacity-80">Please ensure you have given browser permissions to use the webcam.</p>
                        </div>
                    )}

                    {/* HTML5 QR Code Mount Point */}
                    <div id="qr-reader" className="w-full h-full object-cover absolute inset-0 [&>video]:w-full [&>video]:h-full [&>video]:object-cover" />

                    {/* Custom Scanner Styling overlay on top of video */}
                    <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]" />

                    {/* Scanning Line overlay */}
                    {scanState === "scanning" && hasCamera && (
                        <div className="absolute inset-x-0 h-1 bg-green-500 shadow-[0_0_20px_4px_rgba(34,197,94,0.6)] animate-[bounce_2s_infinite] z-20" style={{ top: '50%' }} />
                    )}

                    {/* Success Flash */}
                    {scanState === "success" && (
                        <div className="absolute inset-0 bg-green-500/20 animate-in fade-in duration-500 flex items-center justify-center z-30 backdrop-blur-sm">
                            <CheckCircle2 className="h-32 w-32 text-green-400 animate-in zoom-in spin-in-12 duration-500 shadow-xl rounded-full" />
                        </div>
                    )}

                    {/* Fallback Icon while initializing */}
                    {scanState === "initializing" && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-30 z-20">
                            {scanType === "aadhaar" ? (
                                <ScanFace className="h-40 w-40 text-white animate-pulse" />
                            ) : (
                                <ScanLine className="h-40 w-40 text-white animate-pulse" />
                            )}
                        </div>
                    )}

                    {/* The targeting corners */}
                    <div className="absolute top-6 left-6 w-12 h-12 border-t-4 border-l-4 border-white rounded-tl-xl z-20 pointer-events-none shadow-sm" />
                    <div className="absolute top-6 right-6 w-12 h-12 border-t-4 border-r-4 border-white rounded-tr-xl z-20 pointer-events-none shadow-sm" />
                    <div className="absolute bottom-6 left-6 w-12 h-12 border-b-4 border-l-4 border-white rounded-bl-xl z-20 pointer-events-none shadow-sm" />
                    <div className="absolute bottom-6 right-6 w-12 h-12 border-b-4 border-r-4 border-white rounded-br-xl z-20 pointer-events-none shadow-sm" />
                </div>

                {/* Status Text */}
                <div className="mt-12 text-center h-20">
                    {scanState === "initializing" && <p className="text-xl text-white/50 animate-pulse">Accessing Webcam...</p>}
                    {scanState === "scanning" && hasCamera && <p className="text-xl text-green-400 animate-pulse font-medium">Align QR code within the frame</p>}
                    {scanState === "success" && (
                        <div className="animate-in slide-in-from-bottom-5">
                            <p className="text-2xl text-green-400 font-bold">Successfully Verified</p>
                            <p className="text-white/70 mt-2">Auto-filling your details now...</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ScannerOverlay;
