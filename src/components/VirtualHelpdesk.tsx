import { useState, useEffect, useRef } from "react";
import { Headset, PhoneMissed, Mic, MicOff, Video, VideoOff, Maximize2, Minimize2, Loader2, UserCircle2 } from "lucide-react";

const VirtualHelpdesk = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [callState, setCallState] = useState<"idle" | "connecting" | "connected">("idle");
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [callDuration, setCallDuration] = useState(0);

    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const startCall = () => {
        setIsOpen(true);
        setCallState("connecting");

        // Request camera
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(mediaStream => {
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            })
            .catch(err => {
                console.error("Failed to get local media", err);
            });

        // Simulate connection delay
        setTimeout(() => {
            setCallState("connected");
        }, 3500);
    };

    const endCall = () => {
        setCallState("idle");
        setIsOpen(false);
        setCallDuration(0);
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const toggleMute = () => {
        if (stream) {
            stream.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsMuted(!stream.getAudioTracks()[0]?.enabled);
        } else {
            setIsMuted(!isMuted);
        }
    };

    const toggleVideo = () => {
        if (stream) {
            stream.getVideoTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsVideoOff(!stream.getVideoTracks()[0]?.enabled);
        } else {
            setIsVideoOff(!isVideoOff);
        }
    };

    // Timer logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (callState === "connected") {
            interval = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [callState]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        <>
            {/* Floating Action Button */}
            {!isOpen && (
                <button
                    onClick={startCall}
                    className="group flex h-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-105 border-2 border-white/20 overflow-hidden px-3.5 hover:px-5"
                    aria-label="Live Agent Help"
                >
                    <Headset className="h-7 w-7 shrink-0 animate-pulse group-hover:animate-none" />
                    <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-3 font-bold text-sm">
                        Live Agent Help
                    </span>
                </button>
            )}

            {/* Video Call Modal */}
            {isOpen && (
                <div className={`fixed z-[100] transition-all duration-500 ease-in-out flex flex-col overflow-hidden bg-slate-900 shadow-2xl ${isFullscreen ? 'inset-0 rounded-none' : 'bottom-24 right-4 w-[380px] h-[550px] rounded-3xl border border-slate-700'}`}>
                    
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 backdrop-blur-md absolute top-0 left-0 right-0 z-20">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-white text-xs font-bold uppercase tracking-wider">
                                {callState === "connecting" ? "Connecting..." : formatTime(callDuration)}
                            </span>
                        </div>
                        <button onClick={() => setIsFullscreen(!isFullscreen)} className="text-white/70 hover:text-white transition-colors p-1">
                            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                        </button>
                    </div>

                    {/* Main Video Area (The Officer) */}
                    <div className="flex-1 relative bg-slate-800 flex items-center justify-center overflow-hidden">
                        {callState === "connecting" ? (
                            <div className="flex flex-col items-center text-indigo-400">
                                <Loader2 className="h-12 w-12 animate-spin mb-4" />
                                <p className="font-medium animate-pulse">Routing to available executive...</p>
                            </div>
                        ) : (
                            <>
                                {/* Mock Officer Representation */}
                                <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900 flex flex-col items-center justify-center">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-indigo-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDuration: '4s' }} />
                                        <div className="h-32 w-32 rounded-full bg-slate-700 border-4 border-slate-600 flex items-center justify-center shadow-2xl relative z-10">
                                            <UserCircle2 className="h-20 w-20 text-slate-400" />
                                        </div>
                                        {/* Mock visualizer */}
                                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-1 h-6 z-20">
                                            {[...Array(5)].map((_, i) => (
                                                <div key={i} className="w-1.5 bg-indigo-500 rounded-full animate-[bounce_1s_infinite]" style={{ height: `${Math.max(20, Math.random() * 100)}%`, animationDelay: `${i * 0.15}s` }} />
                                            ))}
                                        </div>
                                    </div>
                                    <h3 className="text-white text-xl font-bold mt-8">Officer Sharma</h3>
                                    <p className="text-indigo-300 text-sm">Civic Support Specialist</p>
                                </div>
                            </>
                        )}

                        {/* Picture-in-Picture (User Webcam) */}
                        <div className={`absolute bottom-20 right-4 w-28 h-40 bg-black rounded-xl border-2 border-slate-700 shadow-xl overflow-hidden transition-all z-20 ${isFullscreen ? 'w-48 h-64' : ''}`}>
                            <video 
                                ref={videoRef} 
                                autoPlay 
                                muted 
                                playsInline 
                                className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : 'block'} transform scale-x-[-1]`}
                            />
                            {isVideoOff && (
                                <div className="w-full h-full flex items-center justify-center bg-slate-800">
                                    <UserCircle2 className="h-10 w-10 text-slate-500" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Controls Footer */}
                    <div className="h-20 bg-slate-900 flex items-center justify-center gap-6 px-4 shrink-0 z-20 pb-2">
                        <button 
                            onClick={toggleMute}
                            className={`h-12 w-12 rounded-full flex items-center justify-center transition-colors ${isMuted ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                        >
                            {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                        </button>
                        
                        <button 
                            onClick={endCall}
                            className="h-14 w-14 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 shadow-lg shadow-red-900/50 hover:scale-105 transition-all"
                        >
                            <PhoneMissed className="h-6 w-6" />
                        </button>

                        <button 
                            onClick={toggleVideo}
                            className={`h-12 w-12 rounded-full flex items-center justify-center transition-colors ${isVideoOff ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                        >
                            {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                        </button>
                    </div>

                </div>
            )}
        </>
    );
};

export default VirtualHelpdesk;
