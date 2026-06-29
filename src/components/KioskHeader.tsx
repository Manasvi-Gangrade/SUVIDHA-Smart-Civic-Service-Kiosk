import { Volume2, VolumeX, Mic } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect, memo } from "react";
import { useTTS } from "@/hooks/useTTS";
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant";
import { toast } from "sonner";

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

const GoogleTranslateWidget = memo(() => {
  useEffect(() => {
    if (!document.getElementById("google-translate-script")) {
      window.googleTranslateElementInit = () => {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement(
            { pageLanguage: 'en', autoDisplay: false },
            'google_translate_element'
          );
        }
      };

      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return <div id="google_translate_element" className="flex items-center min-w-fit lg:min-w-[160px] [&>div]:m-0 overflow-visible transition-all"></div>;
});

const KioskHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const { speak, stop, supported: ttsSupported, ttsEnabled, setTtsEnabled } = useTTS();
  const { isListening, startListening, stopListening, supported: voiceSupported } = useVoiceAssistant();

  const [citizen, setCitizen] = useState<{ fullName: string; id?: string } | null>(null);

  useEffect(() => {
    const checkCitizen = () => {
      const stored = localStorage.getItem('smartcity_citizen');
      if (stored) {
        try {
          setCitizen(JSON.parse(stored));
        } catch (e) {
          setCitizen(null);
        }
      } else {
        setCitizen(null);
      }
    };

    checkCitizen();
    
    window.addEventListener("suvidha_login_change", checkCitizen);
    return () => {
      window.removeEventListener("suvidha_login_change", checkCitizen);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('smartcity_token');
    localStorage.removeItem('smartcity_citizen');
    setCitizen(null);
    toast.success("Logged out successfully");
    navigate('/');
  };

  const isHome = location.pathname === "/";

  const toggleTTS = () => {
    if (ttsEnabled) {
      setTtsEnabled(false);
      stop();
    } else {
      setTtsEnabled(true);
      const textToRead = document.body.innerText.substring(0, 200).replace(/\n/g, '. ');
      speak(textToRead);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-md transition-all duration-300 flex flex-col">
      
      {/* Top Row: Logos & Right Actions */}
      <div className="w-full px-4 lg:px-[5%] flex items-center justify-between h-20 max-w-none border-b border-slate-200">
        
        {/* Logos */}
        <div className="flex items-center gap-4 shrink-0">
          <img 
            src="/images/meitylogo.png" 
            alt="MeitY Logo" 
            className="h-10 lg:h-12 w-auto object-contain cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/')} 
          />
          <div className="w-[1px] h-8 lg:h-10 bg-slate-200"></div>
          <img 
            src="/images/cdaclogo.png" 
            alt="C-DAC Logo" 
            className="h-12 lg:h-14 w-auto object-contain cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/')} 
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 lg:gap-4">
          <div className="block">
            <GoogleTranslateWidget />
          </div>

          {ttsSupported && (
            <button
              onClick={toggleTTS}
              className={`flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full transition-colors shrink-0 ${ttsEnabled ? "text-[#192e59] animate-pulse bg-blue-50 border border-blue-200" : "text-slate-500 bg-slate-50 hover:bg-slate-100"}`}
            >
              {ttsEnabled ? <Volume2 className="h-5 w-5 lg:h-6 lg:w-6" /> : <VolumeX className="h-5 w-5 lg:h-6 lg:w-6" />}
            </button>
          )}
          
          {voiceSupported && (
            <button
              onClick={isListening ? stopListening : startListening}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 lg:px-4 lg:py-2 text-sm lg:text-base font-bold transition-all duration-300 ${isListening
                  ? "bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-pulse"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
            >
              <Mic className="h-5 w-5 lg:h-6 lg:w-6 text-slate-600" />
              {isListening && <span className="text-[10px] lg:text-xs font-black uppercase tracking-tighter text-white">Listening</span>}
            </button>
          )}

          {citizen ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-col text-right hidden md:flex">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Citizen</span>
                <span className="text-sm font-black text-[#192e59] leading-tight truncate max-w-[100px] lg:max-w-[150px]">{citizen.fullName}</span>
              </div>
              <button 
                onClick={handleLogout} 
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 lg:px-6 lg:py-2.5 rounded-full font-black text-[10px] lg:text-xs uppercase shadow-md transition-transform hover:-translate-y-0.5"
              >
                LOGOUT
              </button>
            </div>
          ) : (
            <button onClick={() => navigate("/admin/login")} className="bg-[#192e59] hover:bg-[#112040] text-white px-4 py-2 lg:px-6 lg:py-2.5 rounded-full font-black text-[10px] lg:text-xs uppercase shadow-md transition-transform hover:-translate-y-0.5">
              ADMIN
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default KioskHeader;
