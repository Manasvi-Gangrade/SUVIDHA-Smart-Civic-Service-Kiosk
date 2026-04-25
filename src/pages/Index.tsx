import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { InteractiveVideo } from "@/components/InteractiveVideo";
import { ChevronRight, MessageSquarePlus, Clock } from "lucide-react";

const galleryImages = [
  "/@fs/c:/Users/MANASVI/OneDrive/Desktop/Projects/SUVIDHA-Smart-Civic-Service-Kiosk/images/Screenshot 2026-04-30 121222.png",
  "/@fs/c:/Users/MANASVI/OneDrive/Desktop/Projects/SUVIDHA-Smart-Civic-Service-Kiosk/images/Screenshot 2026-04-30 121231.png",
  "/@fs/c:/Users/MANASVI/OneDrive/Desktop/Projects/SUVIDHA-Smart-Civic-Service-Kiosk/images/Screenshot 2026-04-30 121245.png",
  "/@fs/c:/Users/MANASVI/OneDrive/Desktop/Projects/SUVIDHA-Smart-Civic-Service-Kiosk/images/Screenshot 2026-04-30 121306.png",
  "/@fs/c:/Users/MANASVI/OneDrive/Desktop/Projects/SUVIDHA-Smart-Civic-Service-Kiosk/images/Screenshot 2026-04-30 121319.png",
  "/@fs/c:/Users/MANASVI/OneDrive/Desktop/Projects/SUVIDHA-Smart-Civic-Service-Kiosk/images/smart_city_2.png",
  "/@fs/c:/Users/MANASVI/OneDrive/Desktop/Projects/SUVIDHA-Smart-Civic-Service-Kiosk/images/urban_hub.png",
  "/@fs/c:/Users/MANASVI/OneDrive/Desktop/Projects/SUVIDHA-Smart-Civic-Service-Kiosk/images/digital_concept.png",
  "/@fs/c:/Users/MANASVI/OneDrive/Desktop/Projects/SUVIDHA-Smart-Civic-Service-Kiosk/images/electricity (2).png",
  "/@fs/c:/Users/MANASVI/OneDrive/Desktop/Projects/SUVIDHA-Smart-Civic-Service-Kiosk/images/gas.png",
  "/@fs/c:/Users/MANASVI/OneDrive/Desktop/Projects/SUVIDHA-Smart-Civic-Service-Kiosk/images/municipal.png",
  "/@fs/c:/Users/MANASVI/OneDrive/Desktop/Projects/SUVIDHA-Smart-Civic-Service-Kiosk/images/property.png",
  "/@fs/c:/Users/MANASVI/OneDrive/Desktop/Projects/SUVIDHA-Smart-Civic-Service-Kiosk/images/waste.png",
  "/@fs/c:/Users/MANASVI/OneDrive/Desktop/Projects/SUVIDHA-Smart-Civic-Service-Kiosk/images/water.png",
];

const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[calc(100vh-64px)] flex flex-col bg-[#192e59] overflow-hidden font-sans">
      {/* BACKGROUND VIDEO */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-20"
        >
          <source src="/@fs/c:/Users/MANASVI/OneDrive/Desktop/Projects/SUVIDHA-Smart-Civic-Service-Kiosk/videos/14904045_3840_2160_30fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#192e59]/60 via-transparent to-[#192e59]/90" />
      </div>

      <div className="container relative z-10 pt-8 pb-10 h-full flex flex-col items-center justify-start overflow-hidden">
        
        {/* CENTERED TYPOGRAPHY */}
        <div className="animate-slide-up flex flex-col items-center text-center mb-6 mt-0">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white leading-none drop-shadow-2xl">
            SUVIDHA
          </h1>
          <p className="text-[10px] md:text-xs font-bold text-white/80 tracking-[0.3em] uppercase mt-1.5">
            Smart Urban Virtual Interactive Digital Helpdesk
          </p>
          <div className="w-12 h-0.5 bg-white/30 mt-2 rounded-full" />
        </div>

        {/* DUAL PANEL */}
        <div className="grid grid-cols-2 gap-6 w-full flex-1 min-h-0">
          {/* LEFT: INTERACTIVE VIDEO */}
          <div className="animate-slide-up flex flex-col justify-start w-full">
            <div className="w-full aspect-video overflow-hidden rounded-2xl shadow-2xl border border-white/10 bg-black">
              <InteractiveVideo
                src="/@fs/c:/Users/MANASVI/OneDrive/Desktop/Projects/SUVIDHA-Smart-Civic-Service-Kiosk/videos/What_is_a_smart_city__(720p).mp4"
                title="How to make our own city smart? What is a smart city"
              />
            </div>
          </div>

          {/* RIGHT: FADING GALLERY */}
          <div className="animate-slide-up flex flex-col justify-start w-full" style={{ animationDelay: "0.15s" }}>
            <div className="w-full aspect-video overflow-hidden rounded-2xl shadow-2xl border border-white/10 relative bg-black">
              {galleryImages.map((img, index) => (
                <img
                  key={img}
                  src={img}
                  alt={`Smart City ${index + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? "opacity-100" : "opacity-0"
                    }`}
                />
              ))}
              {/* Dot indicators */}
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-10">
                {galleryImages.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-500 ${i === currentImageIndex ? "w-6 bg-white" : "w-1.5 bg-white/40"
                      }`}
                  />
                ))}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* BOTTOM: ACTION DOCK */}
        <div className="w-full flex flex-col items-center gap-8 mt-auto pt-10 pb-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex flex-wrap justify-center gap-6 w-full px-4">
            <button
              onClick={() => navigate("/complaint")}
              className="kiosk-touch-target flex-1 max-w-[220px] flex items-center justify-center gap-3 bg-white text-[#192e59] border-2 border-[#192e59] rounded-xl font-black text-xs tracking-widest transition-all hover:bg-slate-50 hover:scale-105 active:scale-95 shadow-xl"
            >
              <MessageSquarePlus className="w-4 h-4" />
              REGISTER COMPLAINT
            </button>

            <button
              onClick={() => navigate("/departments")}
              className="kiosk-touch-target animate-bounce-subtle flex-1 max-w-[280px] flex items-center justify-center gap-4 bg-[#3D5FAD] hover:bg-[#2D4A8A] text-white px-8 py-4 rounded-xl font-black text-xl tracking-tight transition-all hover:scale-105 active:scale-95 shadow-[0_10px_40px_-10px_rgba(61,95,173,0.5)] border-b-4 border-[#1e3a7a]"
            >
              ENTER KIOSK
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigate("/track")}
              className="kiosk-touch-target flex-1 max-w-[220px] flex items-center justify-center gap-3 bg-white text-[#192e59] border-2 border-[#192e59] rounded-xl font-black text-xs tracking-widest transition-all hover:bg-slate-50 hover:scale-105 active:scale-95 shadow-xl"
            >
              <Clock className="w-4 h-4" />
              TRACK REQUEST
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Index;
