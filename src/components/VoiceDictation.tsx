import { useState, useEffect, useRef } from "react";
import { Mic, StopCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface VoiceDictationProps {
  onExtractedData: (data: any) => void;
  targetFields: string[]; // e.g., ['name', 'phone', 'aadhaar', 'pincode']
}

export const VoiceDictation = ({ onExtractedData, targetFields }: VoiceDictationProps) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-IN'; // Indian English for better local name parsing

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        extractEntities(transcript);
        setIsListening(false);
        toast.success(`Heard: "${transcript}"`);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech error", event);
        setIsListening(false);
        toast.error("Could not hear clearly. Please try again.");
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (!recognitionRef.current) {
        toast.error("Speech Recognition is not supported on this browser.");
        return;
      }
      
      // Play a tiny beep for accessibility feedback
      try {
          const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          osc.connect(ctx.destination);
          osc.frequency.value = 800;
          osc.start();
          osc.stop(ctx.currentTime + 0.1);
      } catch (e) {}

      recognitionRef.current.start();
      setIsListening(true);
      toast.info("Listening... Speak your details now.");
    }
  };

  const extractEntities = (text: string) => {
    const data: any = {};
    let foundAny = false;

    // Remove common spaces in numbers spoken by users (e.g. "9 8 7 6" -> "9876")
    const compressedText = text.replace(/(?<=\d)\s+(?=\d)/g, '');

    if (targetFields.includes('phone')) {
      const phoneMatch = compressedText.match(/\b\d{10}\b/);
      if (phoneMatch) { data.phone = phoneMatch[0]; foundAny = true; }
    }
    
    if (targetFields.includes('aadhaar')) {
      const aadhaarMatch = compressedText.match(/\b\d{12}\b/);
      if (aadhaarMatch) { data.aadhaar = aadhaarMatch[0]; foundAny = true; }
    }
    
    if (targetFields.includes('pincode')) {
      const pinMatch = compressedText.match(/\b[1-9][0-9]{5}\b/);
      if (pinMatch) { data.pincode = pinMatch[0]; foundAny = true; }
    }

    if (targetFields.includes('name')) {
        const namePatterns = [
            /my name is ([a-z\s]+?)(?=\s+and|\s+my|,|\.|$)/,
            /i am ([a-z\s]+?)(?=\s+and|\s+my|,|\.|$)/,
            /this is ([a-z\s]+?)(?=\s+and|\s+my|,|\.|$)/
        ];
        
        for (const pattern of namePatterns) {
            const match = text.match(pattern);
            if (match && match[1]) {
                // Capitalize first letters for formatting
                const formattedName = match[1].trim().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                data.name = formattedName;
                foundAny = true;
                break;
            }
        }
    }

    if (foundAny) {
      onExtractedData(data);
      toast.success("Details auto-filled successfully!", { icon: <Sparkles className="h-4 w-4 text-yellow-500" /> });
    } else {
      toast.warning("Could not find matching details. Try saying: 'My name is Rahul and my phone is 9876543210'.");
    }
  };

  return (
    <button
      type="button"
      onClick={toggleListen}
      className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold transition-all shadow-md border-2 ${
        isListening 
          ? "bg-red-500 border-red-400 text-white animate-pulse shadow-red-500/30" 
          : "bg-blue-50 border-blue-100 text-blue-700 hover:bg-blue-100 hover:border-blue-200"
      }`}
    >
      {isListening ? <StopCircle className="w-5 h-5" /> : <Mic className="w-5 h-5 text-blue-600" />}
      {isListening ? "Listening..." : "Auto-fill with Voice"}
    </button>
  );
};
