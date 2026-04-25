import { useState } from "react";
import { Settings, Monitor, Globe, Power, RefreshCw, Smartphone } from "lucide-react";
import { toast } from "sonner";

const SystemSettings = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    // Mock settings state
    const [brightness, setBrightness] = useState(80);
    const [volume, setVolume] = useState(70);
    const [autoSync, setAutoSync] = useState(true);

    const handleSystemRestart = () => {
        toast.loading("Initiating System Restart...");
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    };

    const handleClearCache = () => {
        toast.success("System Cache Cleared Successfully!");
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="group flex h-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white shadow-lg shadow-black/10 transition-all duration-300 hover:scale-105 hover:bg-white/30 border-2 border-white/20 overflow-hidden px-3.5 hover:px-5"
                aria-label="System Settings"
            >
                <Settings className="h-7 w-7 shrink-0" />
                <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-3 font-bold text-sm">
                    System Settings
                </span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-border animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                        
                        {/* Header */}
                        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
                            <div className="flex items-center gap-3">
                                <Settings className="h-6 w-6 text-slate-300" />
                                <h2 className="text-xl font-bold tracking-wide">System Settings</h2>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                            >
                                <Power className="h-5 w-5 text-red-400" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto flex-1 grid gap-8">
                            
                            {/* Display & Sound */}
                            <section>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                                    <Monitor className="h-4 w-4" /> Display & Audio
                                </h3>
                                <div className="space-y-6 bg-muted/30 p-5 rounded-xl border border-border">
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-sm font-medium">Screen Brightness</span>
                                            <span className="text-sm text-muted-foreground">{brightness}%</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="0" max="100" 
                                            value={brightness} 
                                            onChange={(e) => setBrightness(Number(e.target.value))}
                                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-sm font-medium">System Volume</span>
                                            <span className="text-sm text-muted-foreground">{volume}%</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="0" max="100" 
                                            value={volume} 
                                            onChange={(e) => setVolume(Number(e.target.value))}
                                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Connectivity */}
                            <section>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                                    <Globe className="h-4 w-4" /> Kiosk Network
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="bg-muted/30 p-4 rounded-xl border border-border flex items-center justify-between">
                                        <div>
                                            <div className="font-semibold text-sm">Background Sync</div>
                                            <div className="text-xs text-muted-foreground">Auto-sync offline data</div>
                                        </div>
                                        <button 
                                            onClick={() => setAutoSync(!autoSync)}
                                            className={`w-12 h-6 rounded-full transition-colors relative ${autoSync ? 'bg-green-500' : 'bg-slate-300'}`}
                                        >
                                            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${autoSync ? 'translate-x-6' : ''}`} />
                                        </button>
                                    </div>
                                    <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 flex flex-col justify-center">
                                        <div className="font-semibold text-sm text-emerald-600 flex items-center gap-2">
                                            <span className="relative flex h-2.5 w-2.5">
                                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                            </span>
                                            Connected (LAN)
                                        </div>
                                        <div className="text-xs text-emerald-600/70 mt-1">Ping: 12ms | Bandwidth: Good</div>
                                    </div>
                                </div>
                            </section>

                            {/* System Actions */}
                            <section>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                                    <RefreshCw className="h-4 w-4" /> Advanced Actions
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <button onClick={handleClearCache} className="p-4 rounded-xl border border-border bg-card hover:bg-muted transition-colors text-left flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Smartphone className="h-5 w-5" /></div>
                                        <div>
                                            <div className="font-bold text-sm">Clear Cache</div>
                                            <div className="text-xs text-muted-foreground">Free up kiosk memory</div>
                                        </div>
                                    </button>
                                    <button onClick={handleSystemRestart} className="p-4 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 transition-colors text-left flex items-center gap-3">
                                        <div className="p-2 bg-red-200 text-red-700 rounded-lg"><Power className="h-5 w-5" /></div>
                                        <div>
                                            <div className="font-bold text-sm text-red-700">Reboot System</div>
                                            <div className="text-xs text-red-600/70">Hard restart kiosk OS</div>
                                        </div>
                                    </button>
                                </div>
                            </section>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SystemSettings;
