import { ArrowLeft, Volume2, VolumeX, Lock, Sun } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect, memo } from "react";
import { useTTS } from "@/hooks/useTTS";
import { Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, SunDim } from "lucide-react";

// Ensure window types are known
declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

// Dedicated component to ensure the div stays intact
const GoogleTranslateWidget = memo(() => {
  useEffect(() => {
    // Add Google Translate script dynamically so it fires after the div is mounted
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
  const { t, i18n } = useTranslation();
  const { speak, stop, speaking, supported, ttsEnabled, setTtsEnabled } = useTTS();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [weatherResponse, setWeatherResponse] = useState<{ temp: number; code: number } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // New Delhi Coordinates for weather
    fetch('https://api.open-meteo.com/v1/forecast?latitude=28.6139&longitude=77.2090&current=temperature_2m,weather_code&timezone=auto')
      .then(res => res.json())
      .then(data => {
        if (data && data.current) {
          setWeatherResponse({ temp: Math.round(data.current.temperature_2m), code: data.current.weather_code });
        }
      })
      .catch(err => console.error("Weather fetch failed", err));
  }, []);

  const timeString = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = currentTime.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });

  // Map WMO weather codes to Lucide icons
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
    return <Sun className="h-4 w-4 text-orange-500" />; // default
  };

  const isHome = location.pathname === "/";

  const toggleTTS = () => {
    if (ttsEnabled) {
      setTtsEnabled(false);
      stop();
    } else {
      setTtsEnabled(true);
      // Read the current page title or summary immediately
      const textToRead = document.body.innerText.substring(0, 200);
      speak(textToRead, i18n.language);
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

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 rounded-lg py-2 transition-colors hover:bg-muted"
          >
            <div className="hidden h-10 w-10 md:flex items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-md">
              <span className="text-xl font-bold text-primary-foreground">S</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-lg font-bold text-foreground tracking-tight leading-none">{t("appTitle")}</span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider hidden sm:block">Citizen Connect Hub</span>
            </div>
          </button>

          {/* New Header Feature: Live Info Widget */}
          <div className="hidden lg:flex items-center gap-4 ml-6 border-l border-border pl-6">
            <div className="flex flex-col items-start">
              <span className="text-xs font-bold text-foreground">{timeString}</span>
              <span className="text-[10px] text-muted-foreground">{dateString}</span>
            </div>
            {weatherResponse ? (
              <div className="flex items-center gap-2 bg-secondary/10 px-2 py-1 rounded-md transition-all hover:bg-secondary/20">
                {getWeatherIcon(weatherResponse.code)}
                <span className="text-xs font-medium text-foreground">{weatherResponse.temp}°C</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-secondary/10 px-2 py-1 rounded-md animate-pulse">
                <Sun className="h-4 w-4 text-muted-foreground/50" />
                <span className="text-xs font-medium text-muted-foreground/50">--°C</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 mr-2">
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">New Delhi, IN</span>
          </div>

          <GoogleTranslateWidget />

          {supported && (
            <button
              onClick={toggleTTS}
              className={`kiosk-touch-target flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground ${ttsEnabled ? "text-primary animate-pulse border border-primary/20 bg-primary/5" : "text-muted-foreground"}`}
            >
              {ttsEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
          )}

          <button
            onClick={() => navigate("/admin/login")}
            className="kiosk-touch-target flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Staff Login"
          >
            <Lock className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default KioskHeader;
