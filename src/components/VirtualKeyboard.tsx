import React, { useState, useEffect, useRef } from "react";
import { Delete, ArrowBigUp, Space, CornerDownLeft, X, Keyboard } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_LAYOUT = [
  "1 2 3 4 5 6 7 8 9 0 - = {bksp}",
  "q w e r t y u i o p [ ] \\",
  "{lock} a s d f g h j k l ; ' {enter}",
  "{shift} z x c v b n m , . / {shift}",
  "{space}"
];

const SHIFT_LAYOUT = [
  "! @ # $ % ^ & * ( ) _ + {bksp}",
  "Q W E R T Y U I O P { } |",
  "{lock} A S D F G H J K L : \" {enter}",
  "{shift} Z X C V B N M < > ? {shift}",
  "{space}"
];

const VirtualKeyboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [layout, setLayout] = useState<"default" | "shift">("default");
  const [isCapsLocked, setIsCapsLocked] = useState(false);
  const activeInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (
        (target.tagName === "INPUT" && !["file", "checkbox", "radio", "submit", "button"].includes((target as HTMLInputElement).type)) ||
        target.tagName === "TEXTAREA"
      ) {
        activeInputRef.current = target as HTMLInputElement | HTMLTextAreaElement;
        setIsOpen(true);
      }
    };

    // We don't close on focusout immediately, because clicking outside to hide is handled by a close button
    // or if another non-input gets focus, we might close. Let's just keep it open until they close it manually
    // or focus shifts to a non-input element.
    const handleFocusOut = (e: FocusEvent) => {
      setTimeout(() => {
        if (!document.activeElement || (document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA")) {
          // If focus moved out of an input, and we are not interacting with keyboard (which prevents focus loss)
          // setIsOpen(false); // Let's keep it manual close or explicit focus change to non-input for now
        }
      }, 0);
    };

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);

    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  const triggerInputEvent = (element: HTMLInputElement | HTMLTextAreaElement, newValue: string) => {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    )?.set;
    const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      "value"
    )?.set;

    if (element instanceof HTMLTextAreaElement && nativeTextAreaValueSetter) {
      nativeTextAreaValueSetter.call(element, newValue);
    } else if (nativeInputValueSetter) {
      nativeInputValueSetter.call(element, newValue);
    }

    const event = new Event("input", { bubbles: true });
    element.dispatchEvent(event);
  };

  const handleKeyPress = (key: string) => {
    const element = activeInputRef.current;
    if (!element) return;

    const start = element.selectionStart || 0;
    const end = element.selectionEnd || 0;
    const currentVal = element.value;

    if (key === "{bksp}") {
      if (start === end && start > 0) {
        const newVal = currentVal.substring(0, start - 1) + currentVal.substring(end);
        triggerInputEvent(element, newVal);
        element.setSelectionRange(start - 1, start - 1);
      } else if (start !== end) {
        const newVal = currentVal.substring(0, start) + currentVal.substring(end);
        triggerInputEvent(element, newVal);
        element.setSelectionRange(start, start);
      }
    } else if (key === "{enter}") {
      if (element.tagName === "TEXTAREA") {
        const newVal = currentVal.substring(0, start) + "\n" + currentVal.substring(end);
        triggerInputEvent(element, newVal);
        element.setSelectionRange(start + 1, start + 1);
      } else {
        // Trigger a form submission or just lose focus if it's an input
        element.blur();
        setIsOpen(false);
      }
    } else if (key === "{space}") {
      const newVal = currentVal.substring(0, start) + " " + currentVal.substring(end);
      triggerInputEvent(element, newVal);
      element.setSelectionRange(start + 1, start + 1);
    } else if (key === "{shift}") {
      setLayout(prev => prev === "default" ? "shift" : "default");
    } else if (key === "{lock}") {
      setIsCapsLocked(prev => !prev);
      setLayout(prev => prev === "default" ? "shift" : "default");
    } else {
      // Normal character insertion
      const newVal = currentVal.substring(0, start) + key + currentVal.substring(end);
      triggerInputEvent(element, newVal);
      element.setSelectionRange(start + key.length, start + key.length);
      
      // If we are in shift mode but not caps locked, revert to default after typing a char
      if (layout === "shift" && !isCapsLocked) {
        setLayout("default");
      }
    }
    
    // Ensure element stays focused
    element.focus();
  };

  if (!isOpen) return null;

  const currentLayout = layout === "shift" ? SHIFT_LAYOUT : DEFAULT_LAYOUT;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t shadow-[0_-5px_20px_rgba(0,0,0,0.05)] p-2 z-[100] animate-in slide-in-from-bottom-full duration-300">
      <div className="max-w-4xl mx-auto flex flex-col gap-1.5 relative">
        {/* Header & Controls */}
        <div className="flex justify-between items-center mb-1 px-2">
          <div className="flex items-center text-muted-foreground font-medium text-sm">
            <Keyboard className="w-4 h-4 mr-2" />
            <span>Keyboard</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors"
            onPointerDown={(e) => e.preventDefault()}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Keyboard Keys */}
        <div className="flex flex-col gap-1.5 w-full">
          {currentLayout.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-2">
              {row.split(" ").map((key, keyIndex) => {
                let displayKey: React.ReactNode = key;
                let flexBasis = "basis-[8%]";
                let variantClass = "bg-background text-foreground hover:bg-muted active:bg-primary active:text-primary-foreground";

                if (key === "{bksp}") {
                  displayKey = <Delete className="w-5 h-5" />;
                  flexBasis = "basis-[12%]";
                  variantClass = "bg-muted text-foreground hover:bg-muted-foreground/20";
                } else if (key === "{enter}") {
                  displayKey = <CornerDownLeft className="w-5 h-5" />;
                  flexBasis = "basis-[15%]";
                  variantClass = "bg-primary text-primary-foreground hover:bg-primary/90";
                } else if (key === "{shift}") {
                  displayKey = <ArrowBigUp className={cn("w-6 h-6", layout === "shift" && !isCapsLocked && "fill-current")} />;
                  flexBasis = "basis-[15%]";
                  variantClass = layout === "shift" && !isCapsLocked 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-foreground hover:bg-muted-foreground/20";
                } else if (key === "{lock}") {
                  displayKey = "Caps Lock";
                  flexBasis = "basis-[15%]";
                  variantClass = isCapsLocked 
                    ? "bg-primary text-primary-foreground font-semibold" 
                    : "bg-muted text-foreground hover:bg-muted-foreground/20";
                } else if (key === "{space}") {
                  displayKey = <Space className="w-6 h-6 opacity-50" />;
                  flexBasis = "basis-[60%]";
                }

                return (
                  <button
                    key={`${rowIndex}-${keyIndex}`}
                    onPointerDown={(e) => {
                      e.preventDefault(); // crucial to prevent input losing focus
                      handleKeyPress(key);
                    }}
                    className={cn(
                      "h-10 sm:h-12 rounded-lg text-base shadow-sm transition-all flex items-center justify-center font-medium border border-border/40 select-none",
                      flexBasis,
                      variantClass
                    )}
                  >
                    {displayKey}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VirtualKeyboard;
