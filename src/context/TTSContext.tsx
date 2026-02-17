import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
    const [ttsEnabled, setTtsEnabled] = useState(false);
    const { i18n } = useTranslation();
    const location = useLocation();
    const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

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

    const speak = useCallback((text: string, manualLang?: string) => {
        if (!supported) return;

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = voicesRef.current.length > 0 ? voicesRef.current : window.speechSynthesis.getVoices();

        // Detect current language from Google Translate if possible
        let lang = manualLang;
        if (!lang) {
            const googCookie = document.cookie.match(/(^|;)\s*googtrans=([^;]+)/);
            if (googCookie) {
                lang = googCookie[2].split('/')[2]; // e.g. "/en/es" -> "es"
            } else {
                lang = i18n.language || "en";
            }
        }

        // Handle specific regional dialects or Google's language mappings
        const langMap: Record<string, string> = {
            'zh-CN': 'zh-CN',
            'zh-TW': 'zh-TW',
            'es': 'es', // Spanish
            'fr': 'fr', // French
            'ja': 'ja', // Japanese
            'ar': 'ar', // Arabic
            'de': 'de', // German
            'hi': 'hi', 'mr': 'mr', 'ta': 'ta', 'te': 'te', 'gu': 'gu', 'bn': 'bn' // Indian Languages
        };

        const targetLangPrefix = langMap[lang] || lang;
        let preferredVoice = null;

        if (lang === "hi" || lang === "mr" || lang === "bn" || lang === "ta" || lang === "te" || lang === "gu") {
            // Priority 1: Google Indian voices (Hindi, etc)
            preferredVoice = voices.find(v => v.lang.startsWith(targetLangPrefix) || v.name.includes("Google हिन्दी") || v.name.includes("Lekha"));
            // Priority 2: Any generic IN voice
            if (!preferredVoice) preferredVoice = voices.find(v => v.lang.includes("IN") || v.name.includes("India"));
        } else if (targetLangPrefix !== "en") {
            // General Priority 1: Google branded voices for that language
            preferredVoice = voices.find(v => v.lang.startsWith(targetLangPrefix) && v.name.includes("Google"));
            // General Priority 2: Any voice matching that language prefix (e.g., 'fr-FR', 'es-ES')
            if (!preferredVoice) preferredVoice = voices.find(v => v.lang.startsWith(targetLangPrefix) || v.lang.startsWith(targetLangPrefix.toLowerCase()));
        }

        // Final Fallback for all cases including English
        if (!preferredVoice) {
            preferredVoice = voices.find(v => v.lang.startsWith("en-US") || v.name.includes("Google US"));
        }

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = () => setSpeaking(false);

        window.speechSynthesis.speak(utterance);
    }, [supported, i18n.language]);

    const stop = useCallback(() => {
        if (!supported) return;
        window.speechSynthesis.cancel();
        setSpeaking(false);
    }, [supported]);

    // Auto-read on navigation if enabled
    useEffect(() => {
        if (ttsEnabled && supported) {
            const timeoutId = setTimeout(() => {
                // Focus on reading actual UI text, ignoring the invisible Google Translate banner
                const interactables = Array.from(document.querySelectorAll('h1, h2, h3, p.text-muted-foreground')).map(el => (el as HTMLElement).innerText).join('. ');
                const textToRead = interactables.substring(0, 300).replace(/\n/g, ". ");
                speak(textToRead);
            }, 1000);
            return () => clearTimeout(timeoutId);
        } else {
            stop();
        }
    }, [location.pathname, ttsEnabled, supported, speak, stop]);

    // Global Hover Listener for TTS
    useEffect(() => {
        if (!ttsEnabled || !supported) return;

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Target interactive elements and text blocks
            const interactable = target.closest('button, a, h1, h2, h3, h4, p, li, span');

            if (interactable) {
                // Prioritize aria-label, then alt (for imgs), then text content
                const text = interactable.getAttribute('aria-label') ||
                    interactable.getAttribute('alt') ||
                    (interactable as HTMLElement).innerText;

                if (text && text.trim().length > 0) {
                    // Optimization: Don't read if overly long container
                    if (text.length < 200 && text.trim() !== "S") {
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
    if (context === undefined) {
        throw new Error("useTTS must be used within a TTSProvider");
    }
    return context;
};
