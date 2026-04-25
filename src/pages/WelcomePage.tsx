import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Globe, Search, ChevronRight, CheckCircle2 } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg"; // Using the existing banner

const PRIMARY_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া" },
];

// Mocking a few out of 230+ for the UI demonstration
const OTHER_LANGUAGES = [
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "ur", name: "Urdu", nativeName: "اردو" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "ko", name: "Korean", nativeName: "한국어" },
  { code: "zh", name: "Chinese", nativeName: "中文" },
];

const WelcomePage = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [showMore, setShowMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLang, setSelectedLang] = useState("");

  const handleLanguageSelect = (code: string) => {
    setSelectedLang(code);
    i18n.changeLanguage(code);
    
    // Add a tiny delay for visual feedback (Kiosk UX)
    setTimeout(() => {
      navigate("/home");
    }, 600);
  };

  const filteredLanguages = OTHER_LANGUAGES.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background relative flex flex-col items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img src={heroBanner} alt="Background" className="w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background to-background" />
      </div>

      <div className="z-10 w-full max-w-5xl px-6 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-10 duration-700">
        
        {/* Kiosk Identity / Logos */}
        <div className="mb-12 flex flex-col items-center">
          <div className="h-24 w-24 bg-primary rounded-3xl rotate-12 flex items-center justify-center shadow-2xl shadow-primary/40 mb-8 border-4 border-primary-foreground/20">
            <Globe className="h-12 w-12 text-primary-foreground -rotate-12" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tight mb-4">
            SUVIDHA <span className="text-primary">Kiosk</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium">
            Smart Civic Service Delivery Platform
          </p>
        </div>

        {/* Language Selection Box */}
        <div className="bg-card/80 backdrop-blur-xl border border-border/50 p-8 md:p-12 rounded-[3rem] shadow-2xl w-full max-w-4xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-primary via-secondary to-kiosk-green" />
          
          <h2 className="text-3xl font-bold text-foreground mb-8 flex flex-col gap-2">
            <span>Please select your preferred language</span>
            <span className="text-xl text-muted-foreground font-normal">
              कृपया अपनी पसंदीदा भाषा चुनें / অনুগ্ৰহ কৰি আপোনাৰ পছন্দৰ ভাষা বাছনি কৰক
            </span>
          </h2>

          {/* Primary Languages (Mandated 3) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {PRIMARY_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`kiosk-touch-target relative overflow-hidden group flex flex-col items-center justify-center gap-3 p-8 rounded-3xl border-2 transition-all duration-300 ${
                  selectedLang === lang.code 
                    ? "border-primary bg-primary/10 scale-105" 
                    : "border-border bg-background hover:border-primary/50 hover:bg-muted"
                }`}
              >
                {selectedLang === lang.code && (
                  <div className="absolute top-4 right-4 text-primary animate-in zoom-in">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                )}
                <span className="text-3xl font-bold text-foreground">{lang.nativeName}</span>
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">{lang.name}</span>
              </button>
            ))}
          </div>

          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink-0 mx-4 text-muted-foreground text-sm font-semibold uppercase tracking-wider">Or</span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          {/* 230+ Languages Wow Factor Button */}
          <button
            onClick={() => setShowMore(true)}
            className="kiosk-touch-target w-full flex items-center justify-between p-6 rounded-3xl border-2 border-secondary/30 bg-secondary/5 hover:bg-secondary/10 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                <Globe className="h-6 w-6" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold text-foreground">Explore 230+ Global Languages</div>
                <div className="text-sm text-muted-foreground">Powered by advanced AI translation</div>
              </div>
            </div>
            <ChevronRight className="h-8 w-8 text-secondary group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>

      {/* 230+ Languages Modal */}
      {showMore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-card border border-border shadow-2xl rounded-[3rem] w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            
            {/* Modal Header */}
            <div className="p-8 border-b border-border bg-muted/30">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
                  <Globe className="h-8 w-8 text-secondary" />
                  Select from 230+ Languages
                </h2>
                <button 
                  onClick={() => setShowMore(false)}
                  className="px-6 py-3 rounded-full bg-secondary/10 text-secondary font-bold hover:bg-secondary hover:text-secondary-foreground transition-colors"
                >
                  Close
                </button>
              </div>
              
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search your language... (e.g. French, தமிழ்)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value.replace(/[^a-zA-Z\u0900-\u097F\u0B80-\u0BFF\u0C00-\u0C7F\s]/g, ""))}
                  className="w-full rounded-2xl border-2 border-input bg-background pl-14 pr-6 py-5 text-xl focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/20 transition-all"
                />
              </div>
            </div>

            {/* Language Grid */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className="flex flex-col items-start p-5 rounded-2xl border border-border hover:border-secondary hover:bg-secondary/5 transition-colors text-left"
                  >
                    <span className="text-xl font-bold text-foreground mb-1">{lang.nativeName}</span>
                    <span className="text-sm text-muted-foreground">{lang.name}</span>
                  </button>
                ))}
              </div>
              
              {filteredLanguages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50 py-20">
                  <Globe className="h-16 w-16 mb-4" />
                  <p className="text-xl font-medium">No matching languages found.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default WelcomePage;
