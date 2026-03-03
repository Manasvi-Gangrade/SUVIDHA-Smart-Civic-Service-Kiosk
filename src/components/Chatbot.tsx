import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, PhoneCall, Mic, MicOff } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Message {
    id: string;
    text: string;
    sender: "bot" | "user";
    isBot?: boolean;
    time?: string;
}

const RESPONSES: Record<string, Record<string, string>> = {
    greeting: {
        en: "Hello! I am Sahayak, your virtual assistant. How can I help you today?",
        hi: "नमस्ते! मैं सहायक हूँ, आपका वर्चुअल असिस्टेंट। आज मैं आपकी कैसे मदद कर सकता हूँ?",
        mr: "नमस्कार! मी सहायक आहे, तुमचा व्हर्च्युअल असिस्टंट. आज मी तुमची कशी मदत करू?",
        ta: "வணக்கம்! நான் சகாயக், உங்கள் மெய்நிகர் உதவியாளர். இன்று நான் உங்களுக்கு எவ்வாறு உதவலாம்?",
        gu: "નમસ્તે! હું સહાયક છું, તમારો વર્ચ્યુઅલ આસિસ્ટન્ટ. આજે હું તમને કઈ રીતે મદદ કરી શકું?",
        bn: "নমস্কার! আমি সহায়ক, আপনার ভার্চুয়াল সহকারী। আজ আমি আপনাকে কিভাবে সাহায্য করতে পারি?",
    },
    thanks: {
        en: "You're very welcome! Let me know if you need help with anything else.",
        hi: "बहुत स्वागत है! यदि आपको और कुछ मदद चाहिए तो बताएं।",
        mr: "तुमचे खूप स्वागत आहे! इतर कशातही मदत लागली तर सांगा.",
        ta: "மிகவும் வரவேற்கிறோம்! வேறு ஏதாவது உதவி தேவைப்பட்டால் தெரியப்படுத்துங்கள்.",
        gu: "ખૂબ સ્વાગત છે! બીજી કોઈ મદદ જોઈએ તો જણાવો.",
        bn: "ખૂબ স্বাগতম! আর কোনো সাহায্যের দরকার হলে জানান।",
    },
    bill: {
        en: "To pay bills, go to 'Departments' on the Home page and select your utility (Electricity, Water, or Gas).",
        hi: "बिल भुगतान के लिए होम पेज पर 'विभाग' पर जाएं और संबंधित उपयोगिता (बिजली, पानी या गैस) चुनें।",
        mr: "बिल भरण्यासाठी, मुख्यपृष्ठावर 'विभाग' मध्ये जा आणि संबंधित सेवा निवडा (वीज, पाणी किंवा गॅस).",
        ta: "பில் செலுத்த, முகப்புப் பக்கத்தில் 'துறைகள்' என்பதற்குச் சென்று தொடர்புடைய சேவையை (மின்சாரம், தண்ணீர் அல்லது எரிவாயு) தேர்ந்தெடுக்கவும்.",
        gu: "બિલ ભરવા માટે, હોમ પેજ પર 'વિભાગ' માં જાઓ અને સંબંધિત સેવા (વીજળી, પાણી અથવા ગેસ) પસંદ કરો.",
        bn: "বিল পরিশোধের জন্য হোম পেজে 'বিভাগ' এ যান এবং সংশ্লিষ্ট পরিষেবা (বিদ্যুৎ, জল বা গ্যাস) নির্বাচন করুন।",
    },
    complaint: {
        en: "You can register a grievance by clicking 'Register Complaint' on the Home page. It takes less than 2 minutes!",
        hi: "आप होम पेज पर 'शिकायत दर्ज करें' पर क्लिक करके शिकायत दर्ज कर सकते हैं। इसमें 2 मिनट से भी कम समय लगता है!",
        mr: "मुख्यपृष्ठावर 'तक्रार नोंदवा' वर क्लिक करून तुम्ही तक्रार नोंदवू शकता. यास 2 मिनिटांपेक्षा कमी वेळ लागतो!",
        ta: "முகப்புப் பக்கத்தில் 'புகார் பதிவு' என்பதைக் கிளிக் செய்வதன் மூலம் புகாரை பதிவு செய்யலாம். இது 2 நிமிடத்திற்கும் குறைவான நேரம் எடுக்கும்!",
        gu: "હોમ પેજ પર 'ફરિયાદ નોંધો' પર ક્લિક કરીને ઓ ફરિયાદ નોંધાવી શકો. 2 મિનિટ કરતા ઓછો સમય લાગે!",
        bn: "হোમ পেজে 'অভিযোগ নিবন্ধন' এ ক্লিক করে অভিযোগ দাখিল করতে পারেন। মাত্র ২ মিনিট লাগে!",
    },
    track: {
        en: "To check your application status, use 'Track Request'. You'll need your Request ID (e.g., SVD-2026-XXXX).",
        hi: "अपने आवेदन की स्थिति जांचने के लिए 'अनुरोध ट्रैक करें' का उपयोग करें। आपको रिक्वेस्ट आईडी (जैसे SVD-2026-XXXX) की आवश्यकता होगी।",
        mr: "तुमच्या अर्जाची स्थिती तपासण्यासाठी 'विनंती ट्रॅक करा' वापरा. तुम्हाला Request ID (उदा. SVD-2026-XXXX) आवश्यक आहे.",
        ta: "உங்கள் விண்ணப்ப நிலையை சரிபார்க்க 'கோரிக்கையை கண்காணி' பயன்படுத்தவும். உங்களுக்கு Request ID (எ.கா. SVD-2026-XXXX) தேவைப்படும்.",
        gu: "અરજીની સ્થિતિ ચેક કરવા 'ટ્રૅક રિક્વેસ્ટ' ઉપયોગ કરો. Request ID (દા.ત. SVD-2026-XXXX) ની જરૂર પડશે.",
        bn: "আবেদনের অবস্থা দেখতে 'ট্র্যাক রিকোয়েস্ট' ব্যবহার করুন। আপনার Request ID (যেমন SVD-2026-XXXX) প্রয়োজন হবে।",
    },
    token: {
        en: "Skip the queue! Generate a digital token for walk-in services directly from any Department page.",
        hi: "लाइन छोड़ें! किसी भी विभाग पृष्ठ से सीधे वॉक-इन सेवाओं के लिए डिजिटल टोकन जेनरेट करें।",
        mr: "रांग सोडा! कोणत्याही विभाग पृष्ठावरून थेट walk-in सेवांसाठी डिजिटल टोकन तयार करा.",
        ta: "வரிசையைத் தவிர்க்கவும்! எந்த துறை பக்கத்திலிருந்தும் நேரடியாக walk-in சேவைகளுக்கான டிஜிட்டல் டோக்கனை உருவாக்குங்கள்.",
        gu: "લાઇન ન ઊભા! ડિપાર્ટ્મેન્ટ પેજ પ walk-in સેવા માટે ડિજiટ ટોકન બનાવો.",
        bn: "লাইনে দাঁড়াবেন না! যেকোনো বিভাগের পেজ থেকে walk-in সেবার ডিজিটাল টোকন তৈরি করুন।",
    },
    fallback: {
        en: "I'm not sure about that. I can help you Pay Bills, Track Requests, or Register Complaints. What would you like?",
        hi: "मुझे यकीन नहीं है। मैं आपको बिल भुगतान, अनुरोध ट्रैकिंग या शिकायत दर्ज करने में मदद कर सकता हूँ।",
        mr: "मला खात्री नाही. मी तुम्हाला बिल भरणे, विनंती ट्रॅक करणे किंवा तक्रार नोंदवणे यात मदत करू शकतो.",
        ta: "எனக்கு நிச்சயமில்லை. பில் செலுத்துதல், கோரிக்கை கண்காணிப்பு அல்லது புகார் பதிவு செய்ய உதவ முடியும்.",
        gu: "ખાતrી નથી. બil ભрванu, viનti ટreking, ywu rvad ફriyd nondawnwn mdad kri shkn.",
        bn: "নিশ্চিত না। বিল পরিশোধ, ট্র্যাকিং বা অভিযোগ নিবন্ধনে সাহায্য করতে পারি।",
    },
};

function getResponse(input: string, lang: string): string {
    const base = lang.split("-")[0]; // "hi-IN" → "hi"
    const l = RESPONSES.greeting[base] ? base : "en";
    const lower = input.toLowerCase();

    if (lower.match(/\b(hello|hi|namaste|hey|नमस्ते|हेलो)\b/)) return RESPONSES.greeting[l];
    if (lower.match(/\b(thank|thanks|धन्यवाद|shukriya|शुक्रिया)\b/)) return RESPONSES.thanks[l];
    if (lower.match(/\b(pay|bill|electricity|water|gas|बिल|पानी|बिजली|गैस)\b/)) return RESPONSES.bill[l];
    if (lower.match(/\b(complaint|grievance|report|issue|शिकायत|तक्रार)\b/)) return RESPONSES.complaint[l];
    if (lower.match(/\b(status|track|check|application|ट्रैक|स्थिति)\b/)) return RESPONSES.track[l];
    if (lower.match(/\b(token|queue|walk-in|टोकन|लाइन)\b/)) return RESPONSES.token[l];
    return RESPONSES.fallback[l];
}

const SPEECH_LANG_MAP: Record<string, string> = {
    hi: "hi-IN", mr: "mr-IN", ta: "ta-IN", te: "te-IN",
    gu: "gu-IN", bn: "bn-IN", en: "en-IN",
};

const Chatbot = () => {
    const { i18n } = useTranslation();
    const currentLang = i18n.language?.split("-")[0] || "en";

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: "1", text: "Namaste! I am Sahayak, your civic assistant. How can I help you today?", isBot: true, sender: "bot", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const langRef = useRef(currentLang);

    useEffect(() => {
        if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOpen]);

    useEffect(() => {
        const lang = i18n.language?.split("-")[0] || "en";
        if (lang === langRef.current) return;
        langRef.current = lang;
        const greetingLang = RESPONSES.greeting[lang] ? lang : "en";
        setMessages([{ id: Date.now().toString(), text: RESPONSES.greeting[greetingLang], sender: "bot", isBot: true }]);
    }, [i18n.language]);

    const speak = (text: string) => {
        if (!("speechSynthesis" in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const lang = i18n.language?.split("-")[0] || "en";
        const speechLang = SPEECH_LANG_MAP[lang] || "en-IN";
        utterance.lang = speechLang;

        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(v => v.lang === speechLang) ||
            voices.find(v => v.lang.startsWith(speechLang.split("-")[0])) ||
            voices.find(v => v.name.includes("India"));

        if (preferred) utterance.voice = preferred;
        window.speechSynthesis.speak(utterance);
    };

    const sendMessage = (text: string) => {
        if (!text.trim()) return;
        const userMsg: Message = { id: Date.now().toString(), text, sender: "user" };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        setTimeout(() => {
            const lang = i18n.language?.split("-")[0] || "en";
            const botText = getResponse(text, lang);
            setMessages(prev => [...prev, { id: Date.now().toString(), text: botText, sender: "bot", isBot: true }]);
            setIsTyping(false);
            speak(botText);
        }, 1500);
    };

    const toggleListening = () => {
        if (isListening) {
            setIsListening(false);
            return;
        }

        const SpeechRecogn = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecogn) {
            alert("Voice recognition is not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecogn();
        recognition.lang = SPEECH_LANG_MAP[currentLang] || "en-IN";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
            setIsListening(false);
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    return (
        <>
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110 animate-bounce select-none"
                    aria-label="Open Chatbot"
                >
                    <MessageSquare className="h-7 w-7" />
                </button>
            )}

            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-80 flex flex-col rounded-2xl border border-border bg-card shadow-2xl sm:w-96 h-[500px] overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 select-none">
                    <div className="flex items-center justify-between bg-primary p-4 text-primary-foreground">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                                <Bot className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg leading-none">Sahayak</h3>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                                    <span className="text-xs font-medium opacity-90">
                                        {SPEECH_LANG_MAP[currentLang] ? `${currentLang.toUpperCase()} Mode Active` : "Online Assistant"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="rounded-full p-2 hover:bg-white/20 transition-colors" aria-label="Close Chat">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30 relative">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                                {msg.sender === "bot" && (
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 mr-2 border border-primary/20">
                                        <Bot className="h-4 w-4 text-primary" />
                                    </div>
                                )}
                                <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm ${msg.sender === "user"
                                    ? "bg-primary text-primary-foreground rounded-br-none"
                                    : "bg-card border border-border text-foreground rounded-bl-none"}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex w-full justify-start animate-in fade-in slide-in-from-bottom-2">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 mr-2 border border-primary/20">
                                    <Bot className="h-4 w-4 text-primary animate-pulse" />
                                </div>
                                <div className="max-w-[75%] rounded-2xl bg-card border border-border px-4 py-3 shadow-sm rounded-bl-none flex flex-col gap-1 items-start justify-center">
                                    <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">
                                        Generating Response
                                    </div>
                                    <div className="flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="border-t border-border p-3 bg-card">
                        <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-2 relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={isListening ? "Listening..." : (currentLang === 'hi' ? "अपना संदेश टाइप करें..." : "Type your message...")}
                                className={`flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-shadow ${isListening ? 'border-red-300 bg-red-50 text-red-700 placeholder:text-red-400' : ''}`}
                            />

                            <button
                                type="button"
                                onClick={toggleListening}
                                className={`absolute right-14 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-gray-400 hover:text-primary hover:bg-gray-100'}`}
                            >
                                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                            </button>

                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className="rounded-full bg-primary p-3 text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary shadow-md shadow-primary/20"
                            >
                                <Send className="h-5 w-5 ml-0.5" />
                            </button>
                        </form>

                        {isListening && (
                            <p className="text-[10px] text-center text-red-500 font-medium mt-2 animate-pulse">
                                Listening... Speak now.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;
