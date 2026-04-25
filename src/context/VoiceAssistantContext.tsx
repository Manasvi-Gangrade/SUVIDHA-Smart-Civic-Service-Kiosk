import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface VoiceAssistantContextType {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  supported: boolean;
}

const VoiceAssistantContext = createContext<VoiceAssistantContextType | undefined>(undefined);

export const VoiceAssistantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-IN"; // Supports English with Indian accent

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript("");
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const resultTranscript = event.results[current][0].transcript.toLowerCase();
        setTranscript(resultTranscript);
        processCommand(resultTranscript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        if (event.error === "not-allowed") {
          toast.error("Microphone access denied. Please enable it in browser settings.");
        }
      };

      recognitionRef.current = recognition;
    }
  }, [navigate]);

  const processCommand = useCallback((command: string) => {
    console.log("Processing voice command:", command);
    
    if (command.includes("complaint") || command.includes("shikayat") || command.includes("grievance")) {
      toast.success("Navigating to Complaints section...");
      navigate("/complaint");
    } else if (command.includes("bill") || command.includes("electricity") || command.includes("water") || command.includes("gas") || command.includes("payment")) {
      toast.success("Opening Bill Payment...");
      navigate("/payment");
    } else if (command.includes("track") || command.includes("status")) {
      toast.success("Checking your request status...");
      navigate("/track");
    } else if (command.includes("map") || command.includes("radar") || command.includes("location")) {
      toast.success("Opening Civic Map...");
      navigate("/map");
    } else if (command.includes("home") || command.includes("back") || command.includes("start")) {
      toast.success("Going back to home...");
      navigate("/");
    } else if (command.includes("queue") || command.includes("token")) {
      toast.success("Opening Virtual Queue...");
      navigate("/queue");
    } else if (command.includes("admin") || command.includes("staff")) {
      toast.info("Opening Staff Login...");
      navigate("/admin/login");
    } else {
      toast.info(`Heard: "${command}". Try saying 'Complaint', 'Bill', or 'Map'.`);
    }
  }, [navigate]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Failed to start speech recognition", e);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  return (
    <VoiceAssistantContext.Provider value={{ isListening, transcript, startListening, stopListening, supported }}>
      {children}
    </VoiceAssistantContext.Provider>
  );
};

export const useVoiceAssistant = () => {
  const context = useContext(VoiceAssistantContext);
  if (context === undefined) {
    throw new Error("useVoiceAssistant must be used within a VoiceAssistantProvider");
  }
  return context;
};
