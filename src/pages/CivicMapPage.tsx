import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Crosshair, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix leaflet icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const customIconStr = (color: string) => `
  <div style="
    background-color: ${color}; 
    width: 30px; 
    height: 30px; 
    border-radius: 50%; 
    border: 3px solid white;
    box-shadow: 0 0 15px ${color};
    display: flex;
    align-items: center;
    justify-content: center;
  ">
    <div style="width: 10px; height: 10px; background: white; border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
  </div>
`;

const mapNodes = [
    { id: 1, type: 'Electricity', label: 'North Zone Power Board', lat: 28.6139 + 0.02, lng: 77.2090 - 0.03, color: '#facc15' },
    { id: 2, type: 'Water', label: 'Sector 4 Jal Board', lat: 28.6139 - 0.015, lng: 77.2090 + 0.04, color: '#60a5fa' },
    { id: 3, type: 'Municipal', label: 'Central Civic Body', lat: 28.6139 - 0.03, lng: 77.2090 - 0.01, color: '#34d399' },
    { id: 4, type: 'Hospital', label: 'City General Hospital', lat: 28.6139 + 0.01, lng: 77.2090 + 0.025, color: '#f87171' },
    { id: 5, type: 'Gas', label: 'Indraprastha Gas Depot', lat: 28.6139 - 0.04, lng: 77.2090 + 0.015, color: '#fb923c' },
];

const center: [number, number] = [28.6139, 77.2090]; // New Delhi center

function MapUpdater({ centerPos }: { centerPos: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(centerPos, 13, { duration: 2 });
    }, [centerPos, map]);
    return null;
}

const CivicMapPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [activeCenter, setActiveCenter] = useState<[number, number]>(center);

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans overflow-hidden relative">
            <div className="absolute inset-0 bg-[#0f172a] pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-6 border-b border-white/10 bg-black/40 backdrop-blur-md shadow-xl">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-3 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black tracking-widest text-emerald-400 uppercase">Live Map Radar</h1>
                        <p className="text-sm text-slate-400">Interactive geographic tracking of civic centers</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    <Crosshair className="w-4 h-4 animate-pulse" />
                    <span className="text-sm font-bold tracking-wider">SYSTEM ACTIVE</span>
                </div>
            </div>

            <div className="flex-1 flex p-6 gap-6 relative z-10">
                {/* Sidebar Controls */}
                <div className="w-80 flex flex-col gap-4">
                    <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-md shadow-xl">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><MapPin className="h-5 w-5 text-emerald-400" /> Focus Target</h2>
                        <div className="space-y-3">
                            <button
                                onClick={() => setActiveCenter(center)}
                                className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-semibold flex items-center justify-between"
                            >
                                Reset to Center
                                <Crosshair className="h-4 w-4 text-emerald-400" />
                            </button>
                            {mapNodes.map(node => (
                                <button
                                    key={node.id}
                                    onClick={() => setActiveCenter([node.lat, node.lng])}
                                    className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm relative overflow-hidden group"
                                >
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-opacity-80" style={{ backgroundColor: node.color }} />
                                    <div className="font-bold text-slate-200">{node.type}</div>
                                    <div className="text-slate-400 text-xs mt-1 truncate">{node.label}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* The Leaflet Map Area */}
                <div className="flex-1 relative rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-sm overflow-hidden shadow-2xl z-0">
                    <MapContainer
                        center={center}
                        zoom={13}
                        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                        className="z-0"
                        zoomControl={false}
                    >
                        {/* Dark mode carto map tiles */}
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        />

                        <MapUpdater centerPos={activeCenter} />

                        {/* User Location */}
                        <Marker
                            position={center}
                            icon={L.divIcon({ className: 'custom-icon', html: customIconStr('#10b981'), iconSize: [30, 30], iconAnchor: [15, 15] })}
                        >
                            <Popup className="custom-popup">
                                <div className="font-bold text-slate-900">Current Location</div>
                                <div className="text-xs">You are here (Kiosk Terminal)</div>
                            </Popup>
                        </Marker>

                        {/* Civic Centers */}
                        {mapNodes.map((node) => (
                            <Marker
                                key={node.id}
                                position={[node.lat, node.lng]}
                                icon={L.divIcon({ className: 'custom-icon', html: customIconStr(node.color), iconSize: [30, 30], iconAnchor: [15, 15] })}
                            >
                                <Popup className="custom-popup">
                                    <div className="font-bold text-slate-900">{node.type} Node</div>
                                    <div className="text-sm">{node.label}</div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>

                    {/* Decorative radar sweep overlay */}
                    <div className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden z-10 opacity-30 mix-blend-screen">
                        <div className="absolute top-1/2 left-1/2 w-[200%] h-[200%] origin-top-left -translate-x-1/2 -translate-y-1/2" style={{ background: 'conic-gradient(from 0deg, transparent 0deg, rgba(52,211,153,0.1) 60deg, rgba(52,211,153,0.4) 90deg, transparent 90deg)', animation: 'spin 4s linear infinite' }} />
                    </div>
                    <style>{`
            .custom-popup .leaflet-popup-content-wrapper { background: rgba(255,255,255,0.9); border-radius: 8px; }
            .custom-popup .leaflet-popup-tip { background: rgba(255,255,255,0.9); }
            @keyframes spin { 100% { transform: translate(-50%, -50%) rotate(360deg); } }
          `}</style>
                </div>
            </div>
        </div>
    );
};

export default CivicMapPage;
