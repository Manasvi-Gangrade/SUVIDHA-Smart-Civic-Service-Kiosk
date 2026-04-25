import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Flame, Zap, ShieldAlert, AlertTriangle, Building2, PlayCircle, Droplets, Trash2, Home as HomeIcon } from 'lucide-react';

export const DepartmentExtras = ({ departmentId }: { departmentId: string }) => {
    if (departmentId === 'electricity') {
        const data = [
            { time: '6 AM', load: 400 },
            { time: '10 AM', load: 800 },
            { time: '2 PM', load: 1200 },
            { time: '6 PM', load: 1500 },
            { time: '10 PM', load: 900 },
        ];
        return (
            <div className="mt-8 bg-card border border-border rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                    <Zap className="text-orange-500 h-6 w-6" /> Live City Power Grid Load
                </h3>
                <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="time" axisLine={false} tickLine={false} fontSize={12} fill="#888" />
                            <YAxis axisLine={false} tickLine={false} fontSize={12} fill="#888" />
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
                            />
                            <Line type="monotone" dataKey="load" stroke="#f97316" strokeWidth={4} dot={{ r: 5, fill: '#f97316', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-6 flex gap-4">
                     <div className="bg-orange-500/10 p-4 rounded-xl flex-1 border border-orange-500/20">
                         <div className="text-xs text-orange-600 dark:text-orange-400 font-bold tracking-wider mb-1">CURRENT LOAD</div>
                         <div className="text-2xl font-black text-foreground">1,500 MW</div>
                     </div>
                     <div className="bg-emerald-500/10 p-4 rounded-xl flex-1 border border-emerald-500/20">
                         <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold tracking-wider mb-1">GRID STATUS</div>
                         <div className="text-2xl font-black text-emerald-600 dark:text-emerald-500">STABLE</div>
                     </div>
                </div>
            </div>
        );
    }

    if (departmentId === 'gas') {
        return (
            <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Dynamic Price Ticker */}
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl -z-10" />
                    <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                        <Flame className="text-blue-500 h-6 w-6" /> Today's LPG Updates
                    </h3>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-muted/50 p-4 rounded-xl border border-border/50">
                            <div className="text-sm text-muted-foreground font-medium">Subsidized (14.2kg)</div>
                            <div className="text-3xl font-black text-foreground mt-1">₹803.00</div>
                            <div className="text-xs text-emerald-500 font-bold mt-1">↓ ₹10.00 from last month</div>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-xl border border-border/50">
                            <div className="text-sm text-muted-foreground font-medium">Commercial (19kg)</div>
                            <div className="text-3xl font-black text-foreground mt-1">₹1755.50</div>
                        </div>
                    </div>
                </div>

                {/* Safety Video / Info Block */}
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 flex flex-col md:flex-row gap-5 items-center">
                    <div className="relative w-full md:w-64 h-40 bg-black rounded-xl overflow-hidden shrink-0 border border-red-500/30 shadow-inner">
                        <iframe 
                            width="100%" 
                            height="100%" 
                            src="https://www.youtube.com/embed/ucvkMhhCUSY?autoplay=1&mute=1&loop=1&playlist=ucvkMhhCUSY" 
                            title="How to Detect a Gas Leak" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                            className="absolute inset-0"
                        ></iframe>
                    </div>
                    <div className="flex-1">
                        <div className="font-bold text-red-600 dark:text-red-400 text-lg flex items-center gap-2 mb-2">
                            <ShieldAlert className="h-5 w-5" /> Smell Gas? Act Fast!
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                            Do not switch on/off any electrical appliances or strike a match. Open all doors and windows immediately to ventilate the area. Watch the safety video for complete instructions.
                        </p>
                        <div className="mt-3 inline-block bg-red-500 text-white font-black px-4 py-1.5 rounded-lg text-sm tracking-wider shadow-sm">
                            CALL 1906 (TOLL FREE)
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (departmentId === 'municipal') {
        return (
            <div className="mt-8 bg-card border border-border rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                    <Building2 className="text-teal-500 h-6 w-6" /> Municipal Services Overview
                </h3>

                {/* Video Block */}
                <div className="relative w-full h-48 md:h-64 bg-black rounded-xl overflow-hidden mb-6 border border-border">
                    <iframe 
                        width="100%" 
                        height="100%" 
                        src="https://www.youtube.com/embed/5F_1wA1f2zQ?autoplay=1&mute=1&loop=1&playlist=5F_1wA1f2zQ" 
                        title="Smart City Municipal Services" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                        className="absolute inset-0"
                    ></iframe>
                </div>

                {/* 5-7 Image Gallery */}
                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">City Progress Gallery</h4>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
                    {[
                        "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=300&h=300&fit=crop",
                        "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=300&h=300&fit=crop",
                        "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=300&h=300&fit=crop",
                        "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=300&h=300&fit=crop",
                        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=300&fit=crop",
                        "https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?w=300&h=300&fit=crop"
                    ].map((src, idx) => (
                        <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-border shadow-sm hover:scale-105 transition-transform cursor-pointer">
                            <img src={src} alt="Municipal progress" className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>

                <div className="space-y-4">
                    <div className="flex gap-4 items-start p-4 rounded-xl border border-border/50 bg-muted/30 hover:bg-muted/70 transition-colors">
                        <div className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-lg text-xs tracking-wider shrink-0 mt-0.5">NEW</div>
                        <div>
                            <div className="font-bold text-foreground">Property Tax Rebate Extended</div>
                            <div className="text-sm text-muted-foreground mt-1">Get 5% off on advance property tax payment. Valid till June 30th.</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (departmentId === 'water') {
        return (
            <div className="mt-8 bg-card border border-border rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                    <Droplets className="text-blue-500 h-6 w-6" /> Water Conservation & Safety
                </h3>
                <div className="relative w-full h-48 md:h-64 bg-black rounded-xl overflow-hidden shadow-md border border-border">
                    <iframe 
                        width="100%" 
                        height="100%" 
                        src="https://www.youtube.com/embed/61kN3AaH4XY?autoplay=1&mute=1&loop=1&playlist=61kN3AaH4XY" 
                        title="Rainwater Harvesting Guide" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                        className="absolute inset-0"
                    ></iframe>
                </div>
            </div>
        );
    }

    if (departmentId === 'waste') {
        return (
            <div className="mt-8 bg-card border border-border rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                    <Trash2 className="text-green-500 h-6 w-6" /> Dry vs Wet Waste Segregation
                </h3>
                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[160px] text-center cursor-pointer hover:bg-green-500/20 transition-colors border-dashed">
                    <PlayCircle className="h-12 w-12 text-green-500/50 mb-3" />
                    <p className="font-bold text-green-700">Waste Segregation Animation Placeholder</p>
                    <p className="text-xs text-green-600/70 mt-1">(Send video link to replace this block)</p>
                </div>
            </div>
        );
    }

    if (departmentId === 'property') {
        return (
            <div className="mt-8 bg-card border border-border rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                    <HomeIcon className="text-indigo-500 h-6 w-6" /> How Tax Builds The City
                </h3>
                <div className="relative w-full h-48 md:h-64 bg-black rounded-xl overflow-hidden shadow-md border border-border">
                    <iframe 
                        width="100%" 
                        height="100%" 
                        src="https://www.youtube.com/embed/ck1hntzKjpY?autoplay=1&mute=1&loop=1&playlist=ck1hntzKjpY" 
                        title="Property Tax Guide" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                        className="absolute inset-0"
                    ></iframe>
                </div>
            </div>
        );
    }

    return null;
}
