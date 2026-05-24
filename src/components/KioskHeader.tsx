import { ArrowLeft, Volume2, VolumeX, Sun, Mic, MapPin, Play } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect, memo } from "react";
import { useTTS } from "@/hooks/useTTS";
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant";
import { Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, SunDim, Clock } from "lucide-react";

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

  const { speak, stop, supported: ttsSupported, ttsEnabled, setTtsEnabled } = useTTS();
  const { isListening, startListening, stopListening, supported: voiceSupported } = useVoiceAssistant();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [weatherResponse, setWeatherResponse] = useState<{ temp: number; code: number } | null>(null);
  const [currentLang, setCurrentLang] = useState("en");

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
    fetch('https://api.open-meteo.com/v1/forecast?latitude=26.1445&longitude=91.7362&current=temperature_2m,weather_code&timezone=auto')
      .then(res => res.json())
      .then(data => {
        if (data && data.current) {
          setWeatherResponse({ temp: Math.round(data.current.temperature_2m), code: data.current.weather_code });
        }
      })
      .catch(err => console.error("Weather fetch failed", err));
  }, []);

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
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm shadow-sm transition-all duration-300">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          {!isHome && (
            <button
              onClick={() => navigate(-1)}
              className="kiosk-touch-target flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}



          <div className="hidden lg:flex items-center gap-5 ml-6 border-l border-slate-200 pl-6 text-sm font-medium text-slate-600">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0066FF]" />
              <span className="font-bold text-slate-800">{timeString}</span>
            </div>
            <div className="w-[1px] h-5 bg-slate-200"></div>
            <span>{dateString}</span>
            <div className="w-[1px] h-5 bg-slate-200"></div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-red-500" />
              <span className="font-bold text-slate-800">New Delhi</span>
            </div>
            <div className="w-[1px] h-5 bg-slate-200"></div>
            {weatherResponse && (
              <div className="flex items-center gap-2">
                {getWeatherIcon(weatherResponse.code)}
                <span className="font-bold text-slate-800">{formatTemperature(weatherResponse.temp)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <GoogleTranslateWidget />

          {ttsSupported && (
            <button
              onClick={toggleTTS}
              className={`kiosk-touch-target flex items-center justify-center w-10 h-10 rounded-full transition-colors ${ttsEnabled ? "text-[#0066FF] animate-pulse bg-blue-50 border border-blue-200" : "text-slate-500 bg-slate-50 hover:bg-slate-100"}`}
            >
              {ttsEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </button>
          )}
          {voiceSupported && (
            <button
              onClick={isListening ? stopListening : startListening}
              className={`kiosk-touch-target flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ${isListening
                  ? "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
            >
              <Mic className="h-4 w-4" />
              {isListening && <span className="text-[10px] font-bold uppercase tracking-tighter">Listening</span>}
            </button>
          )}

          <button onClick={() => navigate("/admin/login")} className="bg-[#192e59] hover:bg-[#112040] text-white px-8 py-2.5 rounded-full font-bold text-xs uppercase shadow-[0_4px_14px_0_rgba(25,46,89,0.39)] transition-transform hover:-translate-y-0.5">
            ADMIN LOGIN
          </button>
        </div>
      </div>
    </header>
  );
};

export default KioskHeader;
