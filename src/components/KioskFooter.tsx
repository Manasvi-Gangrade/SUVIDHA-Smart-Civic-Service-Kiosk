import { useState, useEffect } from "react";
import { Clock, MapPin, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, SunDim, Sun } from "lucide-react";
import { useLocationTracker } from "@/context/LocationContext";

const KioskFooter = () => {
  const { coords, address } = useLocationTracker();

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
    const observer = new MutationObserver(() => updateLang());
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
    const lat = coords?.latitude || 28.6139;
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
    if (code === 0 || code === 1) return <Sun className="h-4 w-4 lg:w-5 lg:h-5 text-orange-500" />;
    if (code === 2) return <SunDim className="h-4 w-4 lg:w-5 lg:h-5 text-orange-400" />;
    if (code === 3) return <Cloud className="h-4 w-4 lg:w-5 lg:h-5 text-slate-400" />;
    if (code >= 45 && code <= 48) return <Cloud className="h-4 w-4 lg:w-5 lg:h-5 text-slate-300" />;
    if (code >= 51 && code <= 57) return <CloudDrizzle className="h-4 w-4 lg:w-5 lg:h-5 text-blue-300" />;
    if (code >= 61 && code <= 67) return <CloudRain className="h-4 w-4 lg:w-5 lg:h-5 text-blue-500" />;
    if (code >= 71 && code <= 77) return <CloudSnow className="h-4 w-4 lg:w-5 lg:h-5 text-sky-200" />;
    if (code >= 80 && code <= 82) return <CloudRain className="h-4 w-4 lg:w-5 lg:h-5 text-blue-600" />;
    if (code >= 95 && code <= 99) return <CloudLightning className="h-4 w-4 lg:w-5 lg:h-5 text-yellow-500" />;
    return <Sun className="h-4 w-4 lg:w-5 lg:h-5 text-orange-500" />;
  };

  return (
    <div className="w-full bg-white py-3 px-4 overflow-hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] border-t border-slate-200 z-50 shrink-0">
      <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-8 mx-auto text-xs lg:text-sm font-bold text-slate-600">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-[#FD8008]" />
          <span className="font-extrabold text-slate-800 text-sm lg:text-base">{timeString}</span>
        </div>
        <div className="w-[1px] h-4 lg:h-5 bg-slate-300"></div>
        <span className="font-extrabold text-xs lg:text-sm">{dateString}</span>
        <div className="w-[1px] h-4 lg:h-5 bg-slate-300"></div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 lg:w-5 lg:h-5 text-red-500" />
          <span className="font-extrabold text-slate-800 text-sm lg:text-base truncate max-w-[120px] lg:max-w-none">{address?.city || address?.suburb || "New Delhi"}</span>
        </div>
        {weatherResponse && (
          <>
            <div className="w-[1px] h-4 lg:h-5 bg-slate-300"></div>
            <div className="flex items-center gap-2">
              {getWeatherIcon(weatherResponse.code)}
              <span className="font-extrabold text-slate-800 text-sm lg:text-base">{formatTemperature(weatherResponse.temp)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default KioskFooter;
