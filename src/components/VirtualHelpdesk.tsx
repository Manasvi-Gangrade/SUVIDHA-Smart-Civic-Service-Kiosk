import { useState, useEffect, useRef } from "react";
import { Headset, PhoneMissed, Maximize2, Minimize2, Loader2, QrCode, X, ExternalLink, HelpCircle } from "lucide-react";
import { toast } from "sonner";

const VirtualHelpdesk = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [callState, setCallState] = useState<"idle" | "connecting" | "connected">("idle");
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [roomName, setRoomName] = useState("");
    const [showQrOverlay, setShowQrOverlay] = useState(true);

    const startCall = async () => {
        const uniqueRoom = `SUVIDHA-Kiosk-Live-Help-${Math.floor(1000 + Math.random() * 9000)}`;
        setRoomName(uniqueRoom);
        setIsOpen(true);
        setCallState("connecting");
        setShowQrOverlay(true);

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

        try {
            const res = await fetch(`${API_URL}/api/auth/initiate-support-call`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ roomName: uniqueRoom })
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Support officer alerted via call & SMS!");
            } else {
                toast.error(data.message || "Failed to notify support officers");
            }
        } catch (err) {
            console.error("Error calling support service:", err);
            toast.error("Network error triggering officer notifications");
        }

        // Connection transition
        setTimeout(() => {
            setCallState("connected");
        }, 2500);
    };

    const endCall = () => {
        setCallState("idle");
        setIsOpen(false);
        setRoomName("");
        toast.info("Video Call Session Ended");
    };

    const jitsiUrl = roomName 
        ? `https://p2p.mirotalk.com/join?room=${roomName}&name=${encodeURIComponent("Kiosk Citizen")}&audio=1&video=1&chat=0&notify=0`
        : "";

    const agentJoinUrl = roomName 
        ? `https://p2p.mirotalk.com/join?room=${roomName}&name=${encodeURIComponent("Support Officer")}&audio=1&video=1&chat=0&notify=0`
        : "";
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(agentJoinUrl)}`;

    return (
        <>
            {/* Floating Action Button */}
            {!isOpen && (
                <button
                    onClick={startCall}
                    className="group flex h-14 items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-105 border-2 border-white/20 overflow-hidden px-4 hover:px-6"
                    aria-label="Live Agent Help"
                >
                    <Headset className="h-7 w-7 shrink-0 animate-pulse group-hover:animate-none" />
                    <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-3 font-black text-sm uppercase tracking-wider">
                        Live Video Support
                    </span>
                </button>
            )}

            {/* Video Call Modal */}
            {isOpen && (
                <div className={`fixed z-[100] transition-all duration-500 ease-in-out flex flex-col overflow-hidden bg-slate-950 shadow-2xl ${isFullscreen ? 'inset-0 rounded-none' : 'bottom-24 right-4 w-[550px] h-[720px] max-w-[90vw] max-h-[85vh] rounded-3xl border border-slate-800'}`}>
                    
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-950/90 backdrop-blur-md absolute top-0 left-0 right-0 z-50 border-b border-slate-900">
                        <div className="flex items-center gap-2">
                            <div className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-white text-xs font-black uppercase tracking-widest">
                                {callState === "connecting" ? "Routing Call..." : "Live Support Desk"}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            {callState === "connected" && (
                                <button 
                                    onClick={() => setShowQrOverlay(!showQrOverlay)} 
                                    className={`p-1.5 rounded-lg transition-colors ${showQrOverlay ? 'bg-[#FD8008]/20 text-[#FD8008]' : 'text-slate-400 hover:text-white'}`}
                                    title="Show QR Code to Join"
                                >
                                    <QrCode className="h-4.5 w-4.5" />
                                </button>
                            )}
                            <button onClick={() => setIsFullscreen(!isFullscreen)} className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg">
                                {isFullscreen ? <Minimize2 className="h-4.5 w-4.5" /> : <Maximize2 className="h-4.5 w-4.5" />}
                            </button>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 relative bg-slate-900 flex items-center justify-center overflow-hidden pt-12">
                        {callState === "connecting" ? (
                            <div className="flex flex-col items-center text-center px-6">
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 bg-emerald-500 rounded-full blur-2xl opacity-20 animate-pulse" />
                                    <Loader2 className="h-16 w-16 text-emerald-500 animate-spin relative z-10" />
                                </div>
                                <h4 className="text-white text-lg font-black uppercase tracking-wider mb-2">Connecting to Agent</h4>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest max-w-[250px] leading-relaxed">Please stand by. Routing your kiosk terminal to the next available support officer...</p>
                            </div>
                        ) : (
                            <div className="w-full h-full relative">
                                {/* Jitsi Meet WebRTC Video Call */}
                                <iframe
                                    src={jitsiUrl}
                                    allow="camera; microphone; fullscreen; display-capture; autoplay"
                                    className="w-full h-full border-0"
                                    title="WebRTC Video Conference"
                                />

                                {/* Floating QR Code Overlay */}
                                {showQrOverlay && (
                                    <div className="absolute top-4 left-4 right-4 bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-2xl z-40 animate-in slide-in-from-top-4 duration-300">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex gap-2">
                                                <QrCode className="w-5 h-5 text-[#FD8008] mt-0.5 shrink-0" />
                                                <div>
                                                    <h5 className="text-white text-xs font-black uppercase tracking-wider">Test the Call!</h5>
                                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Scan to join the call as the Support Agent</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => setShowQrOverlay(false)} 
                                                className="text-slate-500 hover:text-white p-0.5 rounded"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                        
                                        <div className="flex items-center gap-4 bg-slate-950 p-2.5 rounded-xl border border-slate-900">
                                            <div className="bg-white p-1 rounded-lg shrink-0">
                                                <img 
                                                    src={qrCodeUrl} 
                                                    alt="Agent Join QR" 
                                                    className="w-20 h-20"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Or open link on laptop:</p>
                                                <a 
                                                    href={agentJoinUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="text-[#FD8008] text-xs font-bold hover:underline flex items-center gap-1 mt-1 truncate"
                                                >
                                                    <span>Open Room Link</span>
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer Controls */}
                    <div className="h-20 bg-slate-950 flex items-center justify-between px-6 border-t border-slate-900 shrink-0 z-20">
                        <div className="flex items-center gap-2">
                            {callState === "connected" && !showQrOverlay && (
                                <button 
                                    onClick={() => setShowQrOverlay(true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white text-[10px] font-black uppercase tracking-wider transition-colors border border-slate-800"
                                >
                                    <HelpCircle className="w-3.5 h-3.5" />
                                    <span>How to Test</span>
                                </button>
                            )}
                        </div>

                        <button 
                            onClick={endCall}
                            className="h-12 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-red-950/50 hover:scale-105 transition-all flex items-center gap-2"
                        >
                            <PhoneMissed className="h-4.5 w-4.5" />
                            <span>End Call</span>
                        </button>
                    </div>

                </div>
            )}
        </>
    );
};

export default VirtualHelpdesk;
