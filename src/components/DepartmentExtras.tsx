import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Flame, Zap, ShieldAlert, AlertTriangle, Building2, PlayCircle, Droplets, Trash2, Home as HomeIcon } from 'lucide-react';

export const DepartmentExtras = ({ departmentId }: { departmentId: string }) => {
    if (departmentId === 'electricity') {
        return null;
    }

    if (departmentId === 'gas') {
        return (
            <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
        return null;
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
