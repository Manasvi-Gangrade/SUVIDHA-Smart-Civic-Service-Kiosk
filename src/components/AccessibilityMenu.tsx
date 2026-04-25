import { useState } from "react";
import { Accessibility, Type, Contrast, BookOpen, Volume2, X, ZoomIn } from "lucide-react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useTTS } from "@/hooks/useTTS";

const AccessibilityMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { highContrast, toggleHighContrast, dyslexiaFont, toggleDyslexiaFont, textSize, setTextSize, magnifierEnabled, toggleMagnifier } = useAccessibility();
    const { ttsEnabled, setTtsEnabled, speak, stop } = useTTS();

    const toggleScreenReader = () => {
        if (ttsEnabled) {
            setTtsEnabled(false);
            stop();
        } else {
            setTtsEnabled(true);
            speak("Screen reader enabled");
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="group flex h-14 items-center justify-center rounded-full bg-cyan-600 text-white shadow-lg shadow-cyan-600/30 transition-all duration-300 hover:scale-105 border-2 border-white/20 overflow-hidden px-3.5 hover:px-5"
                aria-label="Accessibility Menu"
            >
                <Accessibility className="h-7 w-7 shrink-0" />
                <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-3 font-bold text-sm">
                    Accessibility Features
                </span>
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-24 z-50 w-80 rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-200">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold border-b-2 border-blue-500 pb-1 flex items-center gap-2 text-foreground">
                            <Accessibility className="h-4 w-4 text-blue-500" /> Accessibility
                        </h3>
                        <button onClick={() => setIsOpen(false)} className="rounded-full p-1.5 hover:bg-muted transition-colors">
                            <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Text Zoom */}
                        <div>
                            <label className="text-sm font-semibold mb-3 flex items-center gap-2 text-foreground">
                                <Type className="h-4 w-4 text-muted-foreground" /> Text Size
                            </label>
                            <div className="flex rounded-lg overflow-hidden border border-border bg-muted/30">
                                <button
                                    onClick={() => setTextSize('normal')}
                                    className={`flex-1 py-2 text-sm font-medium transition-colors ${textSize === 'normal' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground'}`}
                                >
                                    Normal
                                </button>
                                <button
                                    onClick={() => setTextSize('large')}
                                    className={`flex-1 py-2 text-base font-semibold transition-colors border-l border-r border-border ${textSize === 'large' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground'}`}
                                >
                                    Large
                                </button>
                                <button
                                    onClick={() => setTextSize('xlarge')}
                                    className={`flex-1 py-2 text-lg font-bold transition-colors ${textSize === 'xlarge' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground'}`}
                                >
                                    X-Large
                                </button>
                            </div>
                        </div>

                        {/* High Contrast */}
                        <div className="pt-4 border-t border-border">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <label className="text-sm font-semibold flex items-center gap-2 text-foreground">
                                        <Contrast className="h-4 w-4 text-muted-foreground" /> High Contrast
                                    </label>
                                    <p className="text-xs text-muted-foreground mt-0.5">Increase visibility and focus</p>
                                </div>
                                <button
                                    onClick={toggleHighContrast}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${highContrast ? 'bg-blue-600' : 'bg-muted-foreground/30'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${highContrast ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-semibold flex items-center gap-2 text-foreground">
                                        <BookOpen className="h-4 w-4 text-muted-foreground" /> Dyslexia Font
                                    </label>
                                    <p className="text-xs text-muted-foreground mt-0.5">Use dyslexic-friendly typeface</p>
                                </div>
                                <button
                                    onClick={toggleDyslexiaFont}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${dyslexiaFont ? 'bg-blue-600' : 'bg-muted-foreground/30'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${dyslexiaFont ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <div>
                                    <label className="text-sm font-semibold flex items-center gap-2 text-foreground">
                                        <Volume2 className="h-4 w-4 text-muted-foreground" /> Screen Reader
                                    </label>
                                    <p className="text-xs text-muted-foreground mt-0.5">Reads text aloud when hovered</p>
                                </div>
                                <button
                                    onClick={toggleScreenReader}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${ttsEnabled ? 'bg-blue-600' : 'bg-muted-foreground/30'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${ttsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <div>
                                    <label className="text-sm font-semibold flex items-center gap-2 text-foreground">
                                        <ZoomIn className="h-4 w-4 text-muted-foreground" /> Screen Magnifier
                                    </label>
                                    <p className="text-xs text-muted-foreground mt-0.5">Zooms and follows your touch</p>
                                </div>
                                <button
                                    onClick={toggleMagnifier}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${magnifierEnabled ? 'bg-blue-600' : 'bg-muted-foreground/30'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${magnifierEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AccessibilityMenu;
