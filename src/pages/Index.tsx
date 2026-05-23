import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { InteractiveVideo } from "@/components/InteractiveVideo";
import { ChevronRight, MessageSquarePlus, Clock } from "lucide-react";

const galleryImages = [
  "/images/Screenshot 2026-04-30 121222.png",
  "/images/Screenshot 2026-04-30 121231.png",
  "/images/Screenshot 2026-04-30 121245.png",
  "/images/Screenshot 2026-04-30 121306.png",
  "/images/Screenshot 2026-04-30 121319.png",
  "/images/smart_city_2.png",
  "/images/urban_hub.png",
  "/images/digital_concept.png",
  "/images/electricity (2).png",
  "/images/gas.png",
  "/images/municipal.png",
  "/images/property.png",
  "/images/waste.png",
  "/images/water.png",
];

const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Multilingual Greetings Typewriter
  const greetings = ["Welcome", "नमस्ते", "स्वागत आहे", "સ્વાગત છે", "ਸਵਾਗਤ ਹੈ", "ಸ್ವಾಗತ"];
  const [currentText, setCurrentText] = useState("");
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Gallery Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Typewriter Timer
  useEffect(() => {
    const currentString = greetings[greetingIndex];
    let typingSpeed = isDeleting ? 75 : 150;

    if (!isDeleting && currentText === currentString) {
      typingSpeed = 2500; // Hold word for 2.5s
      const timeout = setTimeout(() => setIsDeleting(true), typingSpeed);
      return () => clearTimeout(timeout);
    } else if (isDeleting && currentText === "") {
      setIsDeleting(false);
      setGreetingIndex((prev) => (prev + 1) % greetings.length);
      typingSpeed = 500; // Pause before new word
    }

    const timer = setTimeout(() => {
      setCurrentText(currentString.substring(0, currentText.length + (isDeleting ? -1 : 1)));
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, greetingIndex]);

  return (
    <div className="relative h-[calc(100vh-64px)] flex bg-[#192e59] overflow-hidden font-sans">
      
      {/* BACKGROUND VIDEO */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-40"
        >
          <source src="/videos/14904045_3840_2160_30fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#192e59]/50 via-[#192e59]/20 to-[#192e59]/80" />
      </div>

      <div className="container relative z-10 mx-auto h-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 py-4 items-center max-w-[1600px]">
        
        {/* LEFT COLUMN: Typography & Actions (Shifted slightly upwards using relative top offset) */}
        <div className="flex flex-col justify-center space-y-4 pl-4 lg:pl-12 relative -top-8">
            
            {/* Dynamic Typewriter */}
            <div className="h-8 flex items-center justify-start" translate="no">
              <span className="text-xl md:text-2xl font-bold text-[#FD8008] tracking-widest uppercase flex items-center">
                <span key={currentText}>{currentText}</span>
                <span className="animate-pulse opacity-70 ml-1">|</span>
              </span>
            </div>

            <h1 className="flex flex-col text-[4rem] lg:text-[5.5rem] xl:text-[6.5rem] font-[900] leading-[1.15] tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-slate-400 drop-shadow-2xl uppercase">
                <span>SUVIDHA</span>
                <span className="text-[1.4rem] lg:text-[1.8rem] xl:text-[2.1rem] leading-[1.45] text-[#38bdf8] drop-shadow-lg tracking-normal font-bold mt-4">
                    Smart Urban Virtual Interactive<br />
                    Digital Helpdesk Assistant
                </span>
            </h1>
            
            <div className="flex flex-col gap-1 mb-2 mt-4">
                <span className="text-sm lg:text-base uppercase tracking-[0.15em] font-black text-[#FD8008] drop-shadow-sm">
                  Where civic services become smart solutions.
                </span>
            </div>
            
            {/* 6 Photo Moving Marquee (Replacing Paragraph) */}
            <style>{`
              @keyframes marqueeLeft {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
              }
              .animate-marquee-left {
                animation: marqueeLeft 20s linear infinite;
              }
            `}</style>
            
            <div className="w-[90%] max-w-2xl overflow-hidden relative flex mt-4 mb-2" translate="no">
                <div className="flex w-max animate-marquee-left">
                    {[...galleryImages.slice(5, 11), ...galleryImages.slice(5, 11)].map((img, idx) => (
                        <div key={`ml-${idx}`} className="w-[140px] xl:w-[160px] aspect-[4/3] rounded-xl overflow-hidden shadow-md border-2 border-white/20 bg-slate-100 flex-shrink-0 mr-4">
                            <img src={img} className="w-full h-full object-cover opacity-90" alt="Civic Thumbnail" />
                        </div>
                    ))}
                </div>
                {/* Fade overlays for the marquee to blend smoothly */}
                <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#192e59] to-transparent z-10 pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#192e59] to-transparent z-10 pointer-events-none"></div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
                <button onClick={() => navigate("/departments")} className="bg-[#FD8008] hover:bg-[#e67000] text-white px-8 py-3.5 rounded-xl font-bold text-lg shadow-[0_10px_30px_-10px_rgba(253,128,8,0.6)] transition-transform hover:-translate-y-1 flex items-center gap-2">
                    ENTER KIOSK <ChevronRight className="w-5 h-5" />
                </button>
                <button onClick={() => navigate("/track")} className="bg-white/10 backdrop-blur-md border-[2px] border-white/20 text-white px-6 py-3.5 rounded-xl font-bold text-lg hover:border-white/40 hover:bg-white/20 transition-colors flex items-center gap-2 shadow-sm">
                    <Clock className="w-5 h-5 text-[#38bdf8]" /> TRACK REQUEST
                </button>
                <button onClick={() => navigate("/complaint")} className="bg-white/10 backdrop-blur-md border-[2px] border-white/20 text-white px-6 py-3.5 rounded-xl font-bold text-lg hover:border-white/40 hover:bg-white/20 transition-colors flex items-center gap-2 shadow-sm">
                    <MessageSquarePlus className="w-5 h-5 text-[#38bdf8]" /> FILE COMPLAINT
                </button>
            </div>

        </div>

        {/* RIGHT COLUMN: Live Feeds */}
        <div className="flex flex-col h-full justify-center pr-4 lg:pr-12 pb-24 lg:pb-32 mt-[2rem]">
            {/* Main Video */}
            <div className="w-full aspect-video rounded-3xl overflow-hidden border-[6px] border-[#1e293b]/60 shadow-2xl relative bg-black mb-3">
                <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                    <source src="/videos/What_is_a_smart_city__(720p).mp4" type="video/mp4" />
                </video>
            </div>

            {/* Bottom 5 Photos Marquee */}
            <style>{`
              @keyframes marquee {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
              }
              .animate-marquee {
                animation: marquee 25s linear infinite;
              }
              .animate-marquee:hover {
                animation-play-state: paused;
              }
            `}</style>
            
            <div className="w-full overflow-hidden relative flex group">
                <div className="flex w-max animate-marquee">
                    {[...galleryImages.slice(0, 5), ...galleryImages.slice(0, 5)].map((img, idx) => (
                        <div key={`m-${idx}`} className="w-[300px] xl:w-[340px] aspect-video relative flex-shrink-0 mr-5 rounded-2xl overflow-hidden border-[4px] border-[#1e293b]/50 shadow-lg bg-black">
                            <img src={img} className="w-full h-full object-cover opacity-85 hover:opacity-100 transition-opacity" alt={`marquee feed ${idx}`} />
                        </div>
                    ))}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Index;
