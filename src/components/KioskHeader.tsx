import { ArrowLeft, Volume2, VolumeX, Sun, Mic, MapPin, Play } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect, memo } from "react";
import { useTTS } from "@/hooks/useTTS";
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant";
import { Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, SunDim, Clock } from "lucide-react";
import { useLocationTracker } from "@/context/LocationContext";
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

  return <div id="google_translate_element" className="flex items-center min-w-[140px] [&>div]:m-0 overflow-visible transition-all"></div>;
});

const KioskHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { coords, address } = useLocationTracker();

  const { speak, stop, supported: ttsSupported, ttsEnabled, setTtsEnabled } = useTTS();
  const { isListening, startListening, stopListening, supported: voiceSupported } = useVoiceAssistant();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [weatherResponse, setWeatherResponse] = useState<{ temp: number; code: number } | null>(null);
  const [currentLang, setCurrentLang] = useState("en");
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

  useEffect(() => {
    const updateLang = () => {
      const htmlLang = document.documentElement.lang;
      if (htmlLang && htmlLang.toLowerCase() !== "en") {
        const base = htmlLang.split("-")[0].toLowerCase();
        setCurrentLang(base);
        return;
      }

      const googCookie = document.cookie.match(/(^|;)\s*googtrans=([^;]+)/);
      if (googCookie) {
        const parts = googCookie[2].split('/');
        const lang = parts[parts.length - 1];
        if (lang) {
          setCurrentLang(lang.toLowerCase());
          return;
        }
      }
      setCurrentLang("en");
    };

    updateLang();

    const observer = new MutationObserver(() => {
      updateLang();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "lang"] });

    const interval = setInterval(updateLang, 1000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const lat = coords?.latitude || 28.6139; // Default to New Delhi coordinates
    const lon = coords?.longitude || 77.2090;
    
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`)
      .then(res => res.json())
      .then(data => {
        if (data && data.current) {
          setWeatherResponse({ temp: Math.round(data.current.temperature_2m), code: data.current.weather_code });
        }
      })
      .catch(err => console.error("Weather fetch failed", err));
  }, [coords]);

  const localeCode = currentLang === 'hi' || currentLang === 'mr' ? 'hi-IN' : currentLang === 'bn' ? 'bn-IN' : 'en-IN';
  
  const timeString = currentTime.toLocaleTimeString(localeCode, { hour: '2-digit', minute: '2-digit' });
  const dateString = currentTime.toLocaleDateString(localeCode, { weekday: 'short', day: 'numeric', month: 'short' });

  const formatTemperature = (temp: number) => {
    const numStr = new Intl.NumberFormat(localeCode).format(temp);
    let unit = '°C';
    if (currentLang === 'hi' || currentLang === 'mr') unit = '°से';
    else if (currentLang === 'bn') unit = '°সে';
    return `${numStr}${unit}`;
  };

  const getWeatherIcon = (code: number) => {
    if (code === 0 || code === 1) return <Sun className="h-4 w-4 text-orange-500" />;
    if (code === 2) return <SunDim className="h-4 w-4 text-orange-400" />;
    if (code === 3) return <Cloud className="h-4 w-4 text-slate-400" />;
    if (code >= 45 && code <= 48) return <Cloud className="h-4 w-4 text-slate-300" />;
    if (code >= 51 && code <= 57) return <CloudDrizzle className="h-4 w-4 text-blue-300" />;
    if (code >= 61 && code <= 67) return <CloudRain className="h-4 w-4 text-blue-500" />;
    if (code >= 71 && code <= 77) return <CloudSnow className="h-4 w-4 text-sky-200" />;
    if (code >= 80 && code <= 82) return <CloudRain className="h-4 w-4 text-blue-600" />;
    if (code >= 95 && code <= 99) return <CloudLightning className="h-4 w-4 text-yellow-500" />;
    return <Sun className="h-4 w-4 text-orange-500" />;
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
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-md transition-all duration-300">
      <div className="w-full px-[5%] flex h-24 items-center justify-between max-w-none">
        <div className="flex items-center gap-6">

          <img 
            src="/images/cdaclogo.png" 
            alt="C-DAC Logo" 
            className="h-14 w-auto object-contain cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/')} 
          />

          <div className="w-[1px] h-10 bg-slate-200 hidden lg:block"></div>
          
          <div className="hidden lg:flex items-center gap-8 text-lg font-bold text-slate-600">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-[#192e59]" />
              <span className="font-extrabold text-slate-800 text-xl xl:text-2xl">{timeString}</span>
            </div>
            <div className="w-[1px] h-8 bg-slate-200"></div>
            <span className="text-slate-600 font-extrabold text-lg xl:text-xl">{dateString}</span>
            <div className="w-[1px] h-8 bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-red-500" />
              <span className="font-extrabold text-slate-800 text-xl xl:text-2xl">{address?.city || address?.suburb || "New Delhi"}</span>
            </div>
            <div className="w-[1px] h-8 bg-slate-200"></div>
            {weatherResponse && (
              <div className="flex items-center gap-3">
                {getWeatherIcon(weatherResponse.code)}
                <span className="font-extrabold text-slate-800 text-xl xl:text-2xl">{formatTemperature(weatherResponse.temp)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <GoogleTranslateWidget />

          {ttsSupported && (
            <button
              onClick={toggleTTS}
              className={`kiosk-touch-target flex items-center justify-center w-14 h-14 rounded-full transition-colors ${ttsEnabled ? "text-[#192e59] animate-pulse bg-blue-50 border border-blue-200" : "text-slate-500 bg-slate-50 hover:bg-slate-100"}`}
            >
              {ttsEnabled ? <Volume2 className="h-7 w-7" /> : <VolumeX className="h-7 w-7" />}
            </button>
          )}
          {voiceSupported && (
            <button
              onClick={isListening ? stopListening : startListening}
              className={`kiosk-touch-target flex items-center gap-2.5 rounded-xl px-5 py-3 text-lg font-bold transition-all duration-300 ${isListening
                  ? "bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-pulse"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
            >
              <Mic className="h-6 w-6 text-slate-600" />
              {isListening && <span className="text-sm font-black uppercase tracking-tighter text-white">Listening</span>}
            </button>
          )}

          {citizen && (
            <div className="flex items-center gap-4">
              <div className="flex flex-col text-right hidden sm:flex">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Citizen Session</span>
                <span className="text-base font-black text-[#192e59] leading-tight truncate max-w-[150px]">{citizen.fullName}</span>
              </div>
              <button 
                onClick={handleLogout} 
                className="bg-red-500 hover:bg-red-600 text-white px-7 py-3.5 rounded-full font-black text-sm uppercase shadow-md transition-transform hover:-translate-y-0.5"
              >
                LOGOUT
              </button>
            </div>
          )}

          <button onClick={() => navigate("/admin/login")} className="bg-[#192e59] hover:bg-[#112040] text-white px-8 py-3 rounded-full font-black text-sm uppercase shadow-md transition-transform hover:-translate-y-0.5">
            ADMIN LOGIN
          </button>

        </div>
      </div>
    </header>
  );
};

export default KioskHeader;
