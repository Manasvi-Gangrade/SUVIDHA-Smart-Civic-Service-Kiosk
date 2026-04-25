import { ArrowLeft, Lock, Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, SunDim } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

const KioskFooter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [weatherResponse, setWeatherResponse] = useState<{ temp: number; code: number } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Guwahati, Assam Coordinates for weather
    fetch('https://api.open-meteo.com/v1/forecast?latitude=26.1445&longitude=91.7362&current=temperature_2m,weather_code&timezone=auto')
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

  return (
    <footer className="sticky bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur-md shadow-[0_-4px_30px_rgba(0,0,0,0.1)] transition-all duration-300">
      <div className="container flex h-16 items-center justify-between">
        
        {/* Left Side: Navigation & Branding */}
        <div className="flex items-center gap-4">
          {!isHome && (
            <button
              onClick={() => navigate(-1)}
              className="kiosk-touch-target flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground border border-border"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 rounded-lg py-2 transition-colors hover:bg-muted px-2"
          >
            <div className="hidden h-10 w-10 md:flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg border border-white/20">
              <span className="text-xl font-black text-primary-foreground drop-shadow-md">S</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-lg font-bold text-foreground tracking-tight leading-none">{t("appTitle")}</span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider hidden sm:block">Citizen Connect Hub</span>
            </div>
          </button>
        </div>

        {/* Right Side: Info & Admin */}
        <div className="flex items-center gap-4">
          
          <div className="hidden md:flex items-center gap-2 mr-2">
            <span className="text-xs font-bold text-secondary bg-secondary/10 border border-secondary/20 px-2.5 py-1 rounded-md tracking-wide">
                Guwahati, AS
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-4 border-l border-border pl-6">
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

          <div className="border-l border-border pl-4 ml-2">
            <button
                onClick={() => navigate("/admin/login")}
                className="kiosk-touch-target flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Staff Login"
            >
                <Lock className="h-4 w-4" />
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default KioskFooter;
