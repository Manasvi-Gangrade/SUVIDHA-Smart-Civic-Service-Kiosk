import React, { createContext, useContext, useEffect, useState, useCallback, useRef, memo } from "react";

// --- GLOBAL TYPES FOR GOOGLE TRANSLATE ---
declare global {
    interface Window {
        googleTranslateElementInit: () => void;
        google: any;
    }
}

// --- PART 1: TEXT-TO-SPEECH (TTS) ON HOVER CONTEXT ---
interface TTSContextType {
    speak: (text: string, lang?: string) => void;
    stop: () => void;
    speaking: boolean;
    supported: boolean;
    ttsEnabled: boolean;
    setTtsEnabled: (enabled: boolean) => void;
}

const TTSContext = createContext<TTSContextType | undefined>(undefined);

export const TTSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [speaking, setSpeaking] = useState(false);
    const [supported, setSupported] = useState(false);

    // Auto-enable Voice on hover by default
    const [ttsEnabled, setTtsEnabled] = useState(true);
    const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

    // Initialize speech synthesis and load voices
    useEffect(() => {
        if ("speechSynthesis" in window) {
            setSupported(true);
            const updateVoices = () => {
                voicesRef.current = window.speechSynthesis.getVoices();
            };
            window.speechSynthesis.onvoiceschanged = updateVoices;
            updateVoices();
        }
    }, []);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Speak Function that auto-detects current Google Translate language
    const speak = useCallback((text: string, manualLang?: string) => {
        if (!supported) return;

        window.speechSynthesis.cancel();
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        setSpeaking(false);

        const voices = voicesRef.current.length > 0 ? voicesRef.current : window.speechSynthesis.getVoices();

        // Detect current language from Google Translate Cookie
        let lang = manualLang;
        if (!lang) {
            const googCookie = document.cookie.match(/(^|;)\s*googtrans=([^;]+)/);
            if (googCookie) {
                const parts = googCookie[2].split('/');
                lang = parts[parts.length - 1]; // e.g. "/en/hi" -> "hi"
            } else {
                lang = "en"; // Default fallback
            }
        }
        if (!lang) lang = "en";

        const targetPrefix = lang.toLowerCase();
        let preferredVoice = null;

        // General Priority 1: Google branded voices for that language
        preferredVoice = voices.find(v => v.lang.toLowerCase().startsWith(targetPrefix) && v.name.includes("Google"));
        
        // General Priority 2: Any voice matching that language prefix
        if (!preferredVoice) {
            preferredVoice = voices.find(v => v.lang.toLowerCase().startsWith(targetPrefix));
        }

        // Special case for Indian languages
        if (!preferredVoice && ["hi", "mr", "ta", "te", "gu", "bn"].includes(targetPrefix)) {
            preferredVoice = voices.find(v => v.lang.includes("IN") || v.name.includes("India"));
        }

        const textChunks = text.substring(0, 150);

        if (preferredVoice) {
            const utterance = new SpeechSynthesisUtterance(textChunks);
            utterance.voice = preferredVoice;
            utterance.lang = preferredVoice.lang;
            utterance.onstart = () => setSpeaking(true);
            utterance.onend = () => setSpeaking(false);
            utterance.onerror = () => setSpeaking(false);
            window.speechSynthesis.speak(utterance);
        } else {
            // Fallback to Google Translate TTS Audio (Works on all devices even if voices not installed)
            try {
                const url = `https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl=${lang}&q=${encodeURIComponent(textChunks)}`;
                const audio = new Audio(url);
                audioRef.current = audio;
                
                audio.onplay = () => setSpeaking(true);
                audio.onended = () => setSpeaking(false);
                audio.onerror = () => setSpeaking(false);
                audio.play().catch(e => {
                    console.error("Audio fallback blocked", e);
                    setSpeaking(false);
                });
            } catch (err) {
                console.error("TTS Fallback failed", err);
                setSpeaking(false);
            }
        }
    }, [supported]);

    const stop = useCallback(() => {
        if (!supported) return;
        window.speechSynthesis.cancel();
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        setSpeaking(false);
    }, [supported]);

    // Global Hover Listener to trigger speech
    useEffect(() => {
        if (!ttsEnabled || !supported) return;

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Target elements that usually contain readable text
            const interactable = target.closest('button, a, h1, h2, h3, h4, h5, h6, p, li, span, label');

            if (interactable) {
                // First look for screen-reader text, then alt text, then visible text
                const text = interactable.getAttribute('aria-label') ||
                    interactable.getAttribute('alt') ||
                    (interactable as HTMLElement).innerText;

                if (text && text.trim().length > 0) {
                    // Prevent reading extremely long chunks of text accidentally
                    if (text.length < 300) {
                        speak(text);
                    }
                }
            }
        };

        const handleMouseOut = () => {
            stop();
        };

        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseout', handleMouseOut);

        return () => {
            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseout', handleMouseOut);
            stop();
        };
    }, [ttsEnabled, supported, speak, stop]);

    return (
        <TTSContext.Provider value={{ speak, stop, speaking, supported, ttsEnabled, setTtsEnabled }}>
            {children}
        </TTSContext.Provider>
    );
};

export const useTTS = () => {
    const context = useContext(TTSContext);
    if (!context) throw new Error("useTTS must be used within a TTSProvider");
    return context;
};

// --- PART 2: GOOGLE TRANSLATE WIDGET COMPONENT ---
export const GoogleTranslateWidget = memo(() => {
    useEffect(() => {
        // Check if the script is already added
        if (!document.getElementById("google-translate-script")) {
            // Define the global callback function that Google script will trigger
            window.googleTranslateElementInit = () => {
                if (window.google && window.google.translate) {
                    new window.google.translate.TranslateElement(
                        {
                            pageLanguage: 'en', // Base language of your app
                            autoDisplay: false
                        },
                        'google_translate_element'
                    );
                }
            };

            // Injects the Google Translate Script
            const script = document.createElement("script");
            script.id = "google-translate-script";
            script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    return (
        <div
            id="google_translate_element"
            style={{ display: "flex", alignItems: "center", minWidth: "140px" }}
        >
            {/* The Google Translate dropdown will be injected here automatically */}
        </div>
    );
});

/* --- PART 3: REQUIRED CSS REUSABLE SNIPPET ---

Put this in your global CSS (like App.css or index.css)
to hide Google's forced branding, top banner, and annoying tooltips.

.goog-te-banner-frame.skiptranslate,
.goog-te-banner-frame,
#goog-gt-tt,
.goog-te-balloon-frame,
.goog-te-gadget-icon {
  display: none !important;
}

.goog-tooltip,
.goog-tooltip:hover {
  display: none !important;
}

.goog-text-highlight {
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

.goog-te-gadget {
  font-size: 0px !important;
  color: transparent !important;
  display: flex !important;
  align-items: center;
}

.goog-te-gadget select {
  font-size: 14px !important;
  color: black !important;
  padding: 4px;
  border-radius: 4px;
}

.goog-te-gadget span,
.goog-te-gadget a,
.goog-te-gadget img,
.goog-logo-link {
  display: none !important;
}

*/
