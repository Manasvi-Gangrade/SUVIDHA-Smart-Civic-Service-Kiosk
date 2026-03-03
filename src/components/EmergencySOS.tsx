import { useState } from "react";
import { AlertCircle, Phone, X, ShieldAlert, HeartPulse, Flame } from "lucide-react";

const EmergencySOS = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 left-6 z-50 flex h-14 items-center justify-center gap-2 rounded-full bg-red-600 px-5 font-bold text-white shadow-lg shadow-red-600/40 transition-transform hover:scale-105 animate-pulse select-none border-2 border-white/20"
                aria-label="Emergency SOS"
            >
                <AlertCircle className="h-6 w-6" />
                <span className="tracking-widest">SOS</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-red-950/90 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(2dc,38,38,0.4)_0%,transparent_70%)] animate-pulse" />

                    <div className="relative z-10 w-full max-w-4xl rounded-3xl border border-red-500/30 bg-card p-10 shadow-2xl animate-in zoom-in-95 duration-300">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute right-6 top-6 rounded-full bg-muted p-3 text-muted-foreground transition-colors hover:bg-foreground hover:text-background"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        <div className="text-center mb-10">
                            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                                <AlertCircle className="h-12 w-12 text-red-600" />
                            </div>
                            <h2 className="text-4xl font-black text-foreground uppercase tracking-tight">Emergency Assistance</h2>
                            <p className="mt-3 text-xl text-muted-foreground">Immediate help for citizens. Scan or dial the numbers below.</p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <EmergencyCard
                                icon={<ShieldAlert className="h-10 w-10 text-blue-500" />}
                                title="Police Control Room"
                                number="100"
                                bgColor="bg-blue-500/10"
                                borderColor="border-blue-500/20"
                            />
                            <EmergencyCard
                                icon={<HeartPulse className="h-10 w-10 text-red-500" />}
                                title="Ambulance / Medical"
                                number="108"
                                bgColor="bg-red-500/10"
                                borderColor="border-red-500/20"
                            />
                            <EmergencyCard
                                icon={<Flame className="h-10 w-10 text-orange-500" />}
                                title="Fire Brigade"
                                number="101"
                                bgColor="bg-orange-500/10"
                                borderColor="border-orange-500/20"
                            />
                            <EmergencyCard
                                icon={<Phone className="h-10 w-10 text-purple-500" />}
                                title="Women's Helpline"
                                number="1091"
                                bgColor="bg-purple-500/10"
                                borderColor="border-purple-500/20"
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const EmergencyCard = ({ icon, title, number, bgColor, borderColor }: any) => (
    <div className={`flex items-center gap-6 rounded-2xl border ${borderColor} ${bgColor} p-6 transition-transform hover:scale-[1.02]`}>
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-background shadow-sm">
            {icon}
        </div>
        <div className="flex flex-col">
            <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{title}</span>
            <span className="text-5xl font-black tracking-tighter text-foreground">{number}</span>
        </div>
    </div>
);

export default EmergencySOS;
