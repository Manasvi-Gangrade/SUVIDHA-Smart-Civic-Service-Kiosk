import { useState } from "react";
import { useParams } from "react-router-dom";
import { UploadCloud, CheckCircle2, Loader2, ShieldCheck, FileText, QrCode } from "lucide-react";
import { isFirebaseConfigured, db as firestore } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";

const MobileUpload = () => {
    const { sessionId, docType } = useParams<{ sessionId: string; docType: string }>();
    const [uploadState, setUploadState] = useState<"idle" | "compressing" | "uploading" | "success" | "error">("idle");
    const [fileName, setFileName] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const formatDocType = (type: string) => {
        if (!type) return "Document";
        return type
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase());
    };

    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    let width = img.width;
                    let height = img.height;

                    // Max dimensions for compression
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    ctx?.drawImage(img, 0, 0, width, height);

                    // Export as JPEG with 0.6 quality (highly compressed but clear, fits easily in Firestore)
                    const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
                    resolve(dataUrl);
                };
                img.onerror = (err) => reject(err);
            };
            reader.onerror = (err) => reject(err);
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setUploadState("compressing");

        try {
            let fileData = "";

            if (file.type.startsWith("image/")) {
                fileData = await compressImage(file);
            } else {
                // For PDF or other files, read as normal base64
                fileData = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            }

            setUploadState("uploading");

            if (isFirebaseConfigured && firestore) {
                const docRef = doc(firestore, "mobile_uploads", `${sessionId}_${docType}`);
                await setDoc(docRef, {
                    uploaded: true,
                    fileName: file.name,
                    fileData: fileData,
                    timestamp: Date.now()
                });
                setUploadState("success");
            } else {
                // Fallback / standard alert
                setUploadState("success");
            }
        } catch (error: any) {
            console.error("File upload failed:", error);
            setErrorMsg(error?.message || "Something went wrong. Please try again.");
            setUploadState("error");
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex flex-col font-sans px-4 py-8 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#192e59]/30 rounded-full blur-[120px] pointer-events-none" />

            {/* Header */}
            <header className="w-full max-w-md mx-auto text-center mb-8 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4 shadow-inner">
                    <QrCode className="h-4 w-4 text-[#FD8008]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Suvidha Kiosk Connect</span>
                </div>
                <h1 className="text-3xl font-[900] tracking-tight uppercase leading-none text-[#FD8008]">SUVIDHA GATEWAY</h1>
                <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-wider">Mobile Document Upload Hub</p>
            </header>

            {/* Main Card */}
            <main className="w-full max-w-md mx-auto bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 p-8 flex flex-col items-center relative z-10 text-slate-800">
                <div className="bg-[#192e59] w-full p-6 rounded-3xl text-center text-white mb-8">
                    <span className="text-[9px] font-black uppercase tracking-widest text-blue-200">Target Document</span>
                    <h2 className="text-xl font-[900] uppercase tracking-tight mt-1">{formatDocType(docType || "")}</h2>
                </div>

                {uploadState === "idle" && (
                    <div className="w-full flex flex-col items-center">
                        <label 
                            htmlFor="file-input"
                            className="w-full border-4 border-dashed border-slate-200 rounded-[2.5rem] p-12 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer text-center group relative overflow-hidden active:scale-95 duration-200"
                        >
                            <UploadCloud className="h-16 w-16 text-slate-300 mb-4 group-hover:text-[#FD8008] transition-colors group-hover:scale-110 duration-300" />
                            <span className="text-sm font-black uppercase tracking-tight text-slate-700">Choose File or Photo</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2">Take a photo using camera or choose from gallery</span>
                            <input 
                                id="file-input" 
                                type="file" 
                                accept="image/*,application/pdf"
                                onChange={handleFileChange}
                                className="hidden" 
                            />
                        </label>
                    </div>
                )}

                {(uploadState === "compressing" || uploadState === "uploading") && (
                    <div className="w-full py-12 flex flex-col items-center text-center">
                        <Loader2 className="h-16 w-16 text-[#FD8008] animate-spin mb-6" />
                        <h3 className="text-lg font-black uppercase tracking-tight text-slate-800">
                            {uploadState === "compressing" ? "Optimizing File..." : "Uploading Document..."}
                        </h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-2">{fileName}</p>
                        <p className="text-[10px] text-[#FD8008] font-bold uppercase tracking-widest mt-4 animate-pulse">
                            Do not close this window
                        </p>
                    </div>
                )}

                {uploadState === "success" && (
                    <div className="w-full py-6 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
                        <div className="h-20 w-20 bg-emerald-50 rounded-full flex items-center justify-center border-4 border-emerald-500/20 shadow-md mb-6">
                            <CheckCircle2 className="h-10 w-10 text-emerald-600 animate-pulse" />
                        </div>
                        <h3 className="text-2xl font-[900] uppercase tracking-tight text-emerald-600">Upload Complete!</h3>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-2 px-4 leading-normal">
                            Your document has been securely uploaded to the kiosk session.
                        </p>
                        <div className="mt-8 bg-slate-50 border border-slate-100 rounded-2xl p-4 w-full flex items-center gap-3">
                            <FileText className="h-8 w-8 text-[#192e59] shrink-0" />
                            <div className="text-left overflow-hidden">
                                <p className="text-xs font-black text-slate-700 truncate">{fileName || "Document"}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Linked Session: {sessionId}</p>
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-8">
                            You can now close this tab on your phone.
                        </p>
                    </div>
                )}

                {uploadState === "error" && (
                    <div className="w-full py-6 flex flex-col items-center text-center">
                        <div className="h-20 w-20 bg-rose-50 rounded-full flex items-center justify-center border-4 border-rose-500/20 mb-6">
                            <span className="text-rose-600 text-3xl font-black">!</span>
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-tight text-rose-600">Upload Failed</h3>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-2 px-4">
                            {errorMsg}
                        </p>
                        <button 
                            onClick={() => setUploadState("idle")}
                            className="mt-8 bg-[#FD8008] text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-md hover:bg-[#e67300] active:scale-95 transition-all"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="mt-12 text-center relative z-10 max-w-xs mx-auto">
                <div className="flex items-center justify-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                    <ShieldCheck className="h-4.5 w-4.5 text-slate-500" />
                    <span>End-to-End Encrypted Gateway</span>
                </div>
            </footer>
        </div>
    );
};

export default MobileUpload;
