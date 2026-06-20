import { useState, useEffect } from "react";
import { ArrowLeft, Bell, Users, Clock, AlertTriangle, Printer } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import ReceiptPrinter from "../components/ReceiptPrinter";

const VirtualQueuePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    // Get token info from URL or mock it
    const tokenNumber = searchParams.get("token") || "A-102";
    const deptName = searchParams.get("dept") || "General Services";

    const [peopleAhead, setPeopleAhead] = useState(12);
    const [estimatedWaitMins, setEstimatedWaitMins] = useState(15);
    const [isMyTurn, setIsMyTurn] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);

    // Simulate queue movement
    useEffect(() => {
        if (peopleAhead <= 0) {
            setIsMyTurn(true);
            // Play a native "ding" sound
            try {
                const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                const oscillator = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(800, audioCtx.currentTime); // High pitched beep
                oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
                gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
                oscillator.start(audioCtx.currentTime);
                oscillator.stop(audioCtx.currentTime + 0.5);
            } catch (e) {
                console.error("Audio block", e);
            }
            return;
        }

        // Every 5-10 seconds, someone leaves the queue
        const timer = setInterval(() => {
            setPeopleAhead(prev => {
                const next = Math.max(0, prev - 1);
                // Estimate 1.25 mins per person roughly
                setEstimatedWaitMins(Math.ceil(next * 1.25));
                return next;
            });
        }, Math.random() * 5000 + 4000); // Between 4s and 9s per tick 

        return () => clearInterval(timer);
    }, [peopleAhead]);

    return (
        <div className="flex min-h-screen flex-col bg-[#192e59] relative overflow-hidden text-white">
            
            {/* 🎥 THE DYNAMIC BACKGROUND VIDEO */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-15 mix-blend-overlay"
                >
                    <source src="/videos/14904045_3840_2160_30fps.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-b from-[#192e59]/80 via-[#192e59]/95 to-[#192e59]" />
            </div>

            <header className="sticky top-0 z-50 border-b border-white/10 bg-[#122242]/85 backdrop-blur-md px-6 py-4 shadow-sm flex items-center gap-6 relative z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#FD8008] hover:bg-[#e67000] text-white border border-[#FD8008]/20 rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 duration-200 group shadow-[0_4px_12px_rgba(253,128,8,0.3)] z-50"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Back</span>
                </button>
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-white">Virtual Waiting Room</h1>
                    <p className="text-sm text-blue-200 font-medium">{deptName} Department</p>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 z-10 relative">

                {isMyTurn ? (
                    // TURN ACTIVE UI
                    <div className="w-full max-w-md bg-white/5 backdrop-blur-md rounded-[3rem] p-10 shadow-2xl border-4 border-emerald-500 text-center animate-in zoom-in duration-500 text-white">
                        <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse border border-emerald-500/30">
                            <Bell className="h-12 w-12 text-emerald-400 animate-bounce" />
                        </div>
                        <h2 className="text-4xl font-black text-white mb-2">It's Your Turn!</h2>
                        <p className="text-xl text-slate-300 mb-8">Please proceed to Counter <span className="font-bold text-emerald-400">#4</span></p>

                        <div className="bg-[#122242]/50 rounded-2xl p-6 border border-white/10 mb-8">
                            <p className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-1">Your Token</p>
                            <p className="text-6xl font-black text-[#FD8008] tracking-tighter">{tokenNumber}</p>
                        </div>

                        <button
                            onClick={() => navigate('/')}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-full text-lg shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
                        >
                            Acknowledge & Finish
                        </button>
                    </div>
                ) : (
                    // WAITING UI
                    <div className="w-full max-w-sm">
                        <div className="bg-white/5 backdrop-blur-md rounded-[3rem] p-10 shadow-xl border border-white/10 text-center mb-6 relative overflow-hidden text-white">
                            {/* Progress bar at top */}
                            <div className="absolute top-0 left-0 right-0 h-2 bg-white/10">
                                <div
                                    className="h-full bg-[#FD8008] transition-all duration-1000 ease-in-out"
                                    style={{ width: `${Math.max(5, 100 - (peopleAhead / 12) * 100)}%` }}
                                />
                            </div>

                            <div className="mb-8 mt-4">
                                <p className="text-sm font-bold text-blue-200 uppercase tracking-widest mb-2">Your Token Number</p>
                                <h2 className="text-6xl font-black text-white tracking-tighter">{tokenNumber}</h2>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#FD8008]/10 rounded-3xl p-5 flex flex-col items-center justify-center border border-[#FD8008]/20">
                                    <Users className="h-6 w-6 text-[#FD8008] mb-2" />
                                    <p className="text-3xl font-black text-white">{peopleAhead}</p>
                                    <p className="text-xs font-semibold text-slate-300 uppercase text-center mt-1 leading-tight">People Ahead</p>
                                </div>

                                <div className="bg-[#FD8008]/10 rounded-3xl p-5 flex flex-col items-center justify-center border border-[#FD8008]/20">
                                    <Clock className="h-6 w-6 text-[#FD8008] mb-2" />
                                    <p className="text-3xl font-black text-white">{estimatedWaitMins}<span className="text-lg font-bold">m</span></p>
                                    <p className="text-xs font-semibold text-slate-300 uppercase text-center mt-1 leading-tight">Est. Wait</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-amber-500/10 rounded-2xl p-4 flex gap-4 items-start border border-amber-500/20 text-amber-200">
                            <AlertTriangle className="h-6 w-6 text-amber-400 shrink-0" />
                            <p className="text-sm font-medium">Please stay on this page or nearby the kiosk. A sound will play when it is your turn.</p>
                        </div>

                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={() => setShowReceipt(true)}
                                className="flex-1 bg-[#FD8008] hover:bg-[#e67300] text-white font-bold py-4 rounded-full text-sm transition-all shadow-lg shadow-[#FD8008]/20 flex items-center justify-center gap-2"
                            >
                                <Printer className="h-4 w-4" /> Print Token
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold py-4 rounded-full text-sm border border-red-500/30 transition-colors"
                            >
                                Cancel Walk-in
                            </button>
                        </div>
                    </div>
                )}

            </main>

            {showReceipt && (
                <ReceiptPrinter
                    onClose={() => setShowReceipt(false)}
                    receiptData={{
                        id: tokenNumber || "A-102",
                        title: "WALK-IN TOKEN",
                        date: new Date().toLocaleDateString(),
                        department: deptName || "Service Dept",
                        items: [
                            { label: "QUEUED BEHIND", value: `${peopleAhead} Citizens` },
                            { label: "EST. WAIT TIME", value: `${estimatedWaitMins} Mins` }
                        ]
                    }}
                />
            )}
        </div>
    );
};

export default VirtualQueuePage;
