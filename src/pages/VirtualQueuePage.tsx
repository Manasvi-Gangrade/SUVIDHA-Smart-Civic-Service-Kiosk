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
        <div className="flex min-h-screen flex-col bg-slate-50 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-100 rounded-full blur-[120px] opacity-70" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[100px] opacity-60" />

            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md px-6 py-4 shadow-sm flex items-center">
                <button
                    onClick={() => navigate(-1)}
                    className="mr-4 rounded-full p-2 hover:bg-gray-100 transition-colors"
                >
                    <ArrowLeft className="h-6 w-6 text-gray-700" />
                </button>
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-gray-900">Virtual Waiting Room</h1>
                    <p className="text-sm text-gray-500 font-medium">{deptName} Department</p>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 z-10">

                {isMyTurn ? (
                    // TURN ACTIVE UI
                    <div className="w-full max-w-md bg-white rounded-[3rem] p-10 shadow-2xl border-4 border-green-500 text-center animate-in zoom-in duration-500">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                            <Bell className="h-12 w-12 text-green-600 animate-bounce" />
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 mb-2">It's Your Turn!</h2>
                        <p className="text-xl text-gray-600 mb-8">Please proceed to Counter <span className="font-bold text-green-600">#4</span></p>

                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8">
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-1">Your Token</p>
                            <p className="text-6xl font-black text-blue-600 tracking-tighter">{tokenNumber}</p>
                        </div>

                        <button
                            onClick={() => navigate('/')}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-full text-lg shadow-lg shadow-green-600/30 transition-all hover:scale-[1.02]"
                        >
                            Acknowledge & Finish
                        </button>
                    </div>
                ) : (
                    // WAITING UI
                    <div className="w-full max-w-sm">
                        <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-gray-100 text-center mb-6 relative overflow-hidden">
                            {/* Progress bar at top */}
                            <div className="absolute top-0 left-0 right-0 h-2 bg-gray-100">
                                <div
                                    className="h-full bg-blue-600 transition-all duration-1000 ease-in-out"
                                    style={{ width: `${Math.max(5, 100 - (peopleAhead / 12) * 100)}%` }}
                                />
                            </div>

                            <div className="mb-8 mt-4">
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Your Token Number</p>
                                <h2 className="text-6xl font-black text-gray-900 tracking-tighter">{tokenNumber}</h2>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-50 rounded-3xl p-5 flex flex-col items-center justify-center border border-blue-100">
                                    <Users className="h-6 w-6 text-blue-500 mb-2" />
                                    <p className="text-3xl font-black text-blue-700">{peopleAhead}</p>
                                    <p className="text-xs font-semibold text-blue-600/70 uppercase text-center mt-1 leading-tight">People Ahead</p>
                                </div>

                                <div className="bg-orange-50 rounded-3xl p-5 flex flex-col items-center justify-center border border-orange-100">
                                    <Clock className="h-6 w-6 text-orange-500 mb-2" />
                                    <p className="text-3xl font-black text-orange-700">{estimatedWaitMins}<span className="text-lg font-bold">m</span></p>
                                    <p className="text-xs font-semibold text-orange-600/70 uppercase text-center mt-1 leading-tight">Est. Wait</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-amber-50 rounded-2xl p-4 flex gap-4 items-start border border-amber-200">
                            <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0" />
                            <p className="text-sm text-amber-800 font-medium">Please stay on this page or nearby the kiosk. A sound will play when it is your turn.</p>
                        </div>

                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={() => setShowReceipt(true)}
                                className="flex-1 bg-white hover:bg-gray-50 text-indigo-600 font-bold py-4 rounded-full text-sm border-2 border-indigo-100 transition-colors flex items-center justify-center gap-2"
                            >
                                <Printer className="h-4 w-4" /> Print Token
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="flex-1 bg-white hover:bg-gray-50 text-red-600 font-bold py-4 rounded-full text-sm border-2 border-red-100 transition-colors"
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
