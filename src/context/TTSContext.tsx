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

    const audioRef = useRef<HTMLAudioElement | null>(null);

    const speak = useCallback((text: string, manualLang?: string) => {
        if (!supported) return;

        // Stop any currently playing audio or synthesis
        window.speechSynthesis.cancel();
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        setSpeaking(false);

        const voices = voicesRef.current.length > 0 ? voicesRef.current : window.speechSynthesis.getVoices();

        // 1. Detect language
        let lang = manualLang;
        if (!lang) {
            const googCookie = document.cookie.match(/(^|;)\s*googtrans=([^;]+)/);
            if (googCookie) {
                const parts = googCookie[2].split('/');
                lang = parts[parts.length - 1]; 
            } else {
                lang = i18n.language || "en";
            }
        }
        if (!lang) lang = "en";
        const targetPrefix = lang.toLowerCase();

        // 2. Try to find a GOOD native/browser voice for this exact language
        let preferredVoice = voices.find(v => v.lang.toLowerCase().startsWith(targetPrefix) && v.name.includes("Google"));
        if (!preferredVoice) {
            preferredVoice = voices.find(v => v.lang.toLowerCase().startsWith(targetPrefix));
        }
        if (!preferredVoice && ["hi", "mr", "ta", "te", "gu", "bn"].includes(targetPrefix)) {
            preferredVoice = voices.find(v => v.lang.includes("IN") || v.name.includes("India"));
        }

        // 3. Guaranteed Playback Strategy
        // If we found an EXACT matching voice in the OS, use Web Speech API.
        // If we DID NOT find a matching language voice, DO NOT fallback to English Zira to read Hindi.
        // Instead, use Google's free TTS Audio API which supports every language perfectly.
        
        const textChunks = text.substring(0, 150); // API limit is ~200 chars

        if (preferredVoice) {
            // Native Browser TTS
            const utterance = new SpeechSynthesisUtterance(textChunks);
            utterance.voice = preferredVoice;
            utterance.lang = preferredVoice.lang;
            utterance.onstart = () => setSpeaking(true);
            utterance.onend = () => setSpeaking(false);
            utterance.onerror = () => setSpeaking(false);
            window.speechSynthesis.speak(utterance);
        } else {
            // Cloud Audio Fallback (Guaranteed to work on all devices natively)
            try {
                const url = `https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl=${lang}&q=${encodeURIComponent(textChunks)}`;
                const audio = new Audio(url);
                audioRef.current = audio;
                
                audio.onplay = () => setSpeaking(true);
                audio.onended = () => setSpeaking(false);
                audio.onerror = () => {
                    setSpeaking(false);
                    console.error("Cloud TTS failed");
                };
                
                audio.play().catch(e => {
                    console.error("Audio playback prevented:", e);
                    setSpeaking(false);
                });
            } catch (err) {
                console.error("Fallback TTS error", err);
                setSpeaking(false);
            }
        }

    }, [supported, i18n.language]);

    const stop = useCallback(() => {
        if (!supported) return;
        window.speechSynthesis.cancel();
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
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
