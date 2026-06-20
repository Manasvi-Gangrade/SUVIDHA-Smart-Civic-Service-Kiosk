import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Crosshair, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLocationTracker } from "../context/LocationContext";

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

const center: [number, number] = [28.6139, 77.2090]; // Default New Delhi center

function MapUpdater({ centerPos }: { centerPos: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(centerPos, 14, { duration: 2 });
    }, [centerPos, map]);
    return null;
}

const CivicMapPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { coords, address } = useLocationTracker();

    const [activeCenter, setActiveCenter] = useState<[number, number]>(center);

    // Dynamic civic centers based on resolved user coordinates
    const userLat = coords?.latitude || center[0];
    const userLng = coords?.longitude || center[1];

    const mapNodes = [
        { id: 1, type: 'Electricity', label: `${address?.city || 'City'} Power Grid Board`, lat: userLat + 0.008, lng: userLng - 0.006, color: '#FFA500' },
        { id: 2, type: 'Water', label: `${address?.city || 'City'} Jal Board Office`, lat: userLat - 0.005, lng: userLng + 0.012, color: '#2196F3' },
        { id: 3, type: 'Municipal', label: 'Municipal Corporation Head Office', lat: userLat - 0.009, lng: userLng - 0.003, color: '#4CAF50' },
        { id: 4, type: 'Hospital', label: 'City Central Government Hospital', lat: userLat + 0.004, lng: userLng + 0.007, color: '#f87171' },
        { id: 5, type: 'Gas', label: 'Mahanagar PNG/LPG Supply Depot', lat: userLat - 0.012, lng: userLng + 0.004, color: '#FF4500' },
    ];

    useEffect(() => {
        if (coords) {
            setActiveCenter([coords.latitude, coords.longitude]);
        }
    }, [coords]);

    return (
        <div className="h-full bg-[#192e59] text-white flex flex-col font-sans overflow-hidden relative">
            
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

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-6 border-b border-white/10 bg-[#122242]/85 backdrop-blur-md shadow-xl">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#FD8008] hover:bg-[#e67000] text-white border border-[#FD8008]/20 rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 duration-200 group shadow-[0_4px_12px_rgba(253,128,8,0.3)] z-50"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Back</span>
                    </button>
                    <div>
                        <h1 className="text-2xl font-black tracking-widest text-[#FD8008] uppercase">SUVIDHA GIS RADAR</h1>
                        <p className="text-sm text-blue-200">Interactive geographic tracking of civic centers</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-[#FD8008]/10 text-[#FD8008] px-4 py-2 rounded-full border border-[#FD8008]/30 shadow-[0_0_15px_rgba(253,128,8,0.3)]">
                    <Crosshair className="w-4 h-4 animate-pulse" />
                    <span className="text-sm font-bold tracking-wider">SYSTEM ACTIVE</span>
                </div>
            </div>

            <div className="flex-1 flex p-6 gap-6 relative z-10 overflow-hidden">
                {/* Sidebar Controls */}
                <div className="w-80 flex flex-col h-full">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md shadow-xl flex flex-col max-h-full overflow-hidden">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 shrink-0"><MapPin className="h-5 w-5 text-[#FD8008]" /> Focus Target</h2>
                        <div className="space-y-3 overflow-y-auto custom-scrollbar pr-1 flex-1">
                            <button
                                onClick={() => setActiveCenter([userLat, userLng])}
                                className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 transition-colors text-sm font-semibold flex items-center justify-between"
                            >
                                Reset to My Location
                                <Crosshair className="h-4 w-4 text-[#FD8008]" />
                            </button>
                            {mapNodes.map(node => (
                                <button
                                    key={node.id}
                                    onClick={() => setActiveCenter([node.lat, node.lng])}
                                    className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 transition-colors text-sm relative overflow-hidden group"
                                >
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-opacity-80" style={{ backgroundColor: node.color }} />
                                    <div className="font-bold text-white">{node.type}</div>
                                    <div className="text-slate-300 text-xs mt-1 truncate">{node.label}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* The Leaflet Map Area */}
                <div className="flex-1 relative rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-sm overflow-hidden shadow-2xl z-0">
                    <MapContainer
                        center={[userLat, userLng]}
                        zoom={14}
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
                            position={[userLat, userLng]}
                            icon={L.divIcon({ className: 'custom-icon', html: customIconStr('#0066ff'), iconSize: [30, 30], iconAnchor: [15, 15] })}
                        >
                            <Popup className="custom-popup">
                                <div className="font-bold text-slate-900">Current Location</div>
                                <div className="text-xs text-slate-700">{address?.displayName || "You are here (Kiosk Terminal)"}</div>
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
                                    <div className="text-sm text-slate-700">{node.label}</div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>

                    {/* Decorative radar sweep overlay */}
                    <div className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden z-10 opacity-30 mix-blend-screen">
                        <div className="absolute top-1/2 left-1/2 w-[200%] h-[200%] origin-top-left -translate-x-1/2 -translate-y-1/2" style={{ background: 'conic-gradient(from 0deg, transparent 0deg, rgba(253,128,8,0.1) 60deg, rgba(253,128,8,0.4) 90deg, transparent 90deg)', animation: 'spin 4s linear infinite' }} />
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
