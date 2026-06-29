import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { InteractiveVideo } from "@/components/InteractiveVideo";
import { ChevronRight, MessageSquarePlus, Clock, Volume2, VolumeX, Smartphone } from "lucide-react";

const galleryImages = [
  "/images/main1.jpeg",
  "/images/main2.jpeg",
  "/images/main3.jpeg",
  "/images/main4.jpeg",
  "/images/main5.jpeg",
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
  const [isMuted, setIsMuted] = useState(true);

  // Multilingual Greetings Typewriter
  const greetings = ["Welcome", "नमस्ते", "स्वागत आहे", "સ્વાગત છે", "ਸਵਾਗत ਹੈ", "স্মাগাত"];
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
    <div className="relative min-h-full w-full flex bg-[#192e59] overflow-y-auto font-sans">
      
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

      <div className="w-full px-[5%] relative z-10 mx-auto min-h-full flex flex-col justify-start lg:justify-between py-10 gap-6 lg:gap-8 max-w-none">
        
        {/* TOP SECTION: GRID LAYOUT FOR LEFT & RIGHT COLUMNS */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-center">
        
        {/* LEFT COLUMN: Typography & Actions (Shifted downwards to avoid header overlap) */}
        <div className="flex flex-col justify-center space-y-4 lg:space-y-8 px-4 lg:pl-12 lg:pr-0 items-center lg:items-start text-center lg:text-left relative lg:top-4 h-full lg:col-span-6">
            
            {/* Dynamic Typewriter */}
            <div className="h-10 flex items-center justify-center lg:justify-start" translate="no">
              <span className="text-2xl md:text-3xl font-bold text-[#FD8008] tracking-widest uppercase flex items-center">
                <span key={currentText}>{currentText}</span>
                <span className="animate-pulse opacity-70 ml-1">|</span>
              </span>
            </div>

            <h1 className="flex flex-col text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] xl:text-[6.5rem] font-[900] leading-[1.15] tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-slate-400 drop-shadow-2xl uppercase">
                <span>SUVIDHA</span>
                <span className="text-[1.25rem] md:text-[1.85rem] lg:text-[2.25rem] xl:text-[2.6rem] leading-[1.4] text-[#38bdf8] drop-shadow-lg tracking-normal font-bold mt-2 lg:mt-4">
                    Smart Urban Virtual Interactive<br />
                    Digital Helpdesk Assistant
                </span>
            </h1>
            
            <div className="flex flex-col gap-1 mb-2 mt-4">
                <span className="text-lg lg:text-xl xl:text-2xl uppercase tracking-[0.15em] font-black text-[#FD8008] drop-shadow-sm">
                  Where civic services become smart solutions.
                </span>
            </div>
            


            {/* Download Mobile App section */}
            <div className="mt-8 text-center w-full flex flex-col items-center lg:items-start">
              <div className="flex gap-8 items-center justify-center lg:justify-start">
                {/* Android App QR */}
                <div className="flex flex-col items-center gap-2.5 group cursor-pointer">
                  <div className="p-2 md:p-4 bg-white rounded-xl md:rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] border border-white/25 hover:scale-105 transition-all duration-300 w-20 h-20 md:w-32 md:h-32 lg:w-44 lg:h-44 xl:w-48 xl:h-48 flex items-center justify-center">
                    <img 
                      src="/images/qr.png" 
                      alt="Android QR Code" 
                      className="w-16 h-16 md:w-22 md:h-22 lg:w-32 lg:h-32 xl:w-36 xl:h-36 object-contain" 
                    />
                  </div>
                  <span className="text-xs md:text-sm lg:text-base font-black text-slate-300 uppercase tracking-wider group-hover:text-white transition-colors">Android App</span>
                </div>

                {/* Mobile App Screen Mockup Preview */}
                <div className="flex flex-col items-center gap-2.5 group cursor-pointer">
                  <div className="p-2 md:p-4 bg-white rounded-xl md:rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] border border-white/25 hover:scale-105 transition-all duration-300 w-20 h-20 md:w-32 md:h-32 lg:w-44 lg:h-44 xl:w-48 xl:h-48 flex items-center justify-center">
                    <img 
                      src="/images/mobile.png" 
                      alt="SUVIDHA Mobile App Preview" 
                      className="w-16 h-16 md:w-22 md:h-22 lg:w-32 lg:h-32 xl:w-36 xl:h-36 object-contain" 
                    />
                  </div>
                  <span className="text-xs md:text-sm lg:text-base font-black uppercase tracking-wider opacity-0 select-none pointer-events-none">Spacer</span>
                </div>

                {/* iOS App QR */}
                <div className="flex flex-col items-center gap-2.5 group cursor-pointer">
                  <div className="p-2 md:p-4 bg-white rounded-xl md:rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] border border-white/25 hover:scale-105 transition-all duration-300 w-20 h-20 md:w-32 md:h-32 lg:w-44 lg:h-44 xl:w-48 xl:h-48 flex items-center justify-center">
                    <img 
                      src="/images/qr.png" 
                      alt="iOS QR Code" 
                      className="w-16 h-16 md:w-22 md:h-22 lg:w-32 lg:h-32 xl:w-36 xl:h-36 object-contain" 
                    />
                  </div>
                  <span className="text-xs md:text-sm lg:text-base font-black text-slate-300 uppercase tracking-wider group-hover:text-white transition-colors">iOS App</span>
                </div>
              </div>
            </div>

        </div>

        {/* RIGHT COLUMN: Live Feeds (Shifted downwards for better layout flow) */}
        <div className="flex flex-col justify-center px-4 lg:pr-12 lg:pb-12 mt-4 lg:mt-[2rem] w-full max-w-[600px] lg:max-w-none mx-auto pb-4 lg:pb-10 lg:col-span-6 relative lg:top-4">
            {/* Main Video */}
            <div className="w-full aspect-video rounded-3xl overflow-hidden border-[4px] lg:border-[6px] border-[#1e293b]/60 shadow-2xl relative lg:-top-6 bg-black mb-4 group/video">
                <video 
                  autoPlay 
                  loop 
                  muted={isMuted} 
                  playsInline 
                  className="w-full h-full object-cover"
                >
                    <source src="/videos/What_is_a_smart_city__(720p).mp4" type="video/mp4" />
                </video>
                {/* Floating Volume Action Button */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="absolute bottom-4 right-4 z-20 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full backdrop-blur-md border border-white/20 transition-all active:scale-90 shadow-lg pointer-events-auto"
                >
                  {isMuted ? (
                    <VolumeX className="w-6 h-6 text-white" />
                  ) : (
                    <Volume2 className="w-6 h-6 text-[#38bdf8] animate-pulse" />
                  )}
                </button>
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
            
            <div className="flex w-full overflow-hidden relative group mt-1">
                <div className="flex w-max animate-marquee">
                    {[...galleryImages.slice(0, 5), ...galleryImages.slice(0, 5)].map((img, idx) => (
                        <div key={`m-${idx}`} className="w-[18.75rem] xl:w-[21.25rem] aspect-video relative flex-shrink-0 mr-6 lg:mr-8 rounded-2xl overflow-hidden border-[4px] border-[#1e293b]/50 shadow-lg bg-black">
                            <img src={img} className="w-full h-full object-cover opacity-85 hover:opacity-100 transition-opacity" alt={`marquee feed ${idx}`} />
                        </div>
                    ))}
                </div>
            </div>
        </div>

        </div>

        {/* BOTTOM SECTION: Centered Action Buttons (Span Full Width below both columns) */}
        <div className="w-full flex flex-wrap items-center justify-center gap-4 lg:gap-8 py-4 lg:py-6 z-20 relative lg:-top-12 mt-2 lg:mt-0 pb-6 lg:pb-0">
            <button 
              onClick={() => navigate("/complaint")} 
              className="group bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border-2 border-white/20 text-white w-[290px] lg:w-[340px] h-[80px] lg:h-[90px] rounded-[2.5rem] font-black text-xl lg:text-2xl hover:border-[#38bdf8]/50 hover:bg-white/15 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-3.5 shadow-2xl whitespace-nowrap flex-shrink-0"
            >
                <MessageSquarePlus className="w-7 h-7 text-[#38bdf8] group-hover:scale-110 transition-transform duration-300" /> 
                <span>FILE COMPLAINT</span>
            </button>
            
            <button 
              onClick={() => navigate("/departments")} 
              className="group bg-gradient-to-r from-[#FD8008] to-[#f97316] text-white w-[290px] lg:w-[340px] h-[80px] lg:h-[90px] rounded-[2.5rem] font-black text-xl lg:text-2xl shadow-[0_15px_40px_rgba(253,128,8,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_50px_rgba(253,128,8,0.6)] flex items-center justify-center gap-3.5 active:scale-95 border-2 border-white/20 whitespace-nowrap flex-shrink-0"
            >
                <span>ENTER KIOSK</span> 
                <ChevronRight className="w-7 h-7 group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
            
            <button 
              onClick={() => navigate("/track")} 
              className="group bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border-2 border-white/20 text-white w-[290px] lg:w-[340px] h-[80px] lg:h-[90px] rounded-[2.5rem] font-black text-xl lg:text-2xl hover:border-[#38bdf8]/50 hover:bg-white/15 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-3.5 shadow-2xl whitespace-nowrap flex-shrink-0"
            >
                <Clock className="w-7 h-7 text-[#38bdf8] group-hover:rotate-12 transition-transform duration-300" /> 
                <span>TRACK REQUEST</span>
            </button>
        </div>

      </div>
    </div>
  );
};

export default Index;
