import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type TextSize = 'normal' | 'large' | 'xlarge';

interface AccessibilityContextType {
    highContrast: boolean;
    toggleHighContrast: () => void;
    dyslexiaFont: boolean;
    toggleDyslexiaFont: () => void;
    privacyMode: boolean;
    togglePrivacyMode: () => void;
    screenReader: boolean;
    toggleScreenReader: () => void;
    textSize: TextSize;
    setTextSize: (size: TextSize) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider = ({ children }: { children: ReactNode }) => {
    const [highContrast, setHighContrast] = useState(false);
    const [dyslexiaFont, setDyslexiaFont] = useState(false);
    const [privacyMode, setPrivacyMode] = useState(false);
    const [screenReader, setScreenReader] = useState(false);
    const [textSize, setTextSize] = useState<TextSize>('normal');

    // Load from local storage on mount
    useEffect(() => {
        const savedContrast = localStorage.getItem('kiosk_highContrast') === 'true';
        const savedDyslexia = localStorage.getItem('kiosk_dyslexiaFont') === 'true';
        const savedPrivacy = localStorage.getItem('kiosk_privacyMode') === 'true';
        const savedScreenReader = localStorage.getItem('kiosk_screenReader') === 'true';
        const savedSize = (localStorage.getItem('kiosk_textSize') as TextSize) || 'normal';
        setHighContrast(savedContrast);
        setDyslexiaFont(savedDyslexia);
        setPrivacyMode(savedPrivacy);
        setScreenReader(savedScreenReader);
        setTextSize(savedSize);
    }, []);

    // Apply High Contrast Class to HTML body
    useEffect(() => {
        localStorage.setItem('kiosk_highContrast', String(highContrast));
        if (highContrast) {
            document.body.classList.add('high-contrast-mode');
        } else {
            document.body.classList.remove('high-contrast-mode');
        }
    }, [highContrast]);

    // Apply Dyslexia Font Class to HTML body
    useEffect(() => {
        localStorage.setItem('kiosk_dyslexiaFont', String(dyslexiaFont));
        if (dyslexiaFont) {
            document.body.classList.add('dyslexic-font');
        } else {
            document.body.classList.remove('dyslexic-font');
        }
    }, [dyslexiaFont]);

    // Apply Privacy Mode Class to HTML body
    useEffect(() => {
        localStorage.setItem('kiosk_privacyMode', String(privacyMode));
        if (privacyMode) {
            document.body.classList.add('privacy-mode');
        } else {
            document.body.classList.remove('privacy-mode');
        }
    }, [privacyMode]);

    // Save Screen Reader state
    useEffect(() => {
        localStorage.setItem('kiosk_screenReader', String(screenReader));
    }, [screenReader]);

    // Apply Font Size scaling directly to root for rem to cascade
    useEffect(() => {
        localStorage.setItem('kiosk_textSize', textSize);
        const root = document.documentElement;
        if (textSize === 'large') {
            root.style.fontSize = '18px'; // approx 112.5%
        } else if (textSize === 'xlarge') {
            root.style.fontSize = '20px'; // approx 125%
        } else {
            root.style.fontSize = '16px'; // default 100%
        }
    }, [textSize]);

    const toggleHighContrast = () => setHighContrast(prev => !prev);
    const toggleDyslexiaFont = () => setDyslexiaFont(prev => !prev);
    const togglePrivacyMode = () => setPrivacyMode(prev => !prev);
    const toggleScreenReader = () => setScreenReader(prev => !prev);

    return (
        <AccessibilityContext.Provider value={{
            highContrast, toggleHighContrast,
            dyslexiaFont, toggleDyslexiaFont,
            privacyMode, togglePrivacyMode,
            screenReader, toggleScreenReader,
            textSize, setTextSize
        }}>
            {children}
        </AccessibilityContext.Provider>
    );
};

export const useAccessibility = () => {
    const context = useContext(AccessibilityContext);
    if (context === undefined) {
        throw new Error('useAccessibility must be used within an AccessibilityProvider');
    }
    return context;
};
