import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, ShieldCheck, ArrowRight, RefreshCw, CheckCircle2 } from "lucide-react";

// Simple in-memory OTP store (real app would use backend)
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

type Step = "phone" | "otp" | "success";

const LoginPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>("phone");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [generatedOTP, setGeneratedOTP] = useState("");
    const [error, setError] = useState("");
    const [resendCooldown, setResendCooldown] = useState(0);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleSendOTP = (e: React.FormEvent) => {
        e.preventDefault();
        if (phone.length < 10) { setError("Please enter a valid 10-digit mobile number."); return; }
        const newOTP = generateOTP();
        setGeneratedOTP(newOTP);
        console.info(`[DEV ONLY] OTP for ${phone}: ${newOTP}`); // In prod, SMS is sent
        setStep("otp");
        setError("");
        startCooldown();
    };

    const startCooldown = () => {
        setResendCooldown(30);
        const interval = setInterval(() => {
            setResendCooldown(prev => {
                if (prev <= 1) { clearInterval(interval); return 0; }
                return prev - 1;
            });
        }, 1000);
    };

    const handleOTPChange = (value: string, index: number) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        setError("");
        if (value && index < 5) otpRefs.current[index + 1]?.focus();
    };

    const handleOTPKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyOTP = (e: React.FormEvent) => {
        e.preventDefault();
        const enteredOTP = otp.join("");
        if (enteredOTP === generatedOTP) {
            setStep("success");
            setTimeout(() => navigate("/dashboard"), 2000);
        } else {
            setError("Incorrect OTP. Please check and try again.");
            setOtp(["", "", "", "", "", ""]);
            otpRefs.current[0]?.focus();
        }
    };

    const handleResend = () => {
        const newOTP = generateOTP();
        setGeneratedOTP(newOTP);
        console.info(`[DEV ONLY] Resent OTP for ${phone}: ${newOTP}`);
        setOtp(["", "", "", "", "", ""]);
        setError("");
        startCooldown();
        otpRefs.current[0]?.focus();
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-md">
                {/* Logo / Brand */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary text-primary-foreground text-2xl font-black mb-4 shadow-lg">
                        S
                    </div>
                    <h1 className="text-3xl font-black text-foreground">SUVIDHA</h1>
                    <p className="text-muted-foreground text-sm mt-1">Citizen Connect Hub</p>
                </div>

                <div className="rounded-2xl border border-border bg-card shadow-xl p-8">

                    {/* ── STEP 1: Phone ──────────────────────────────── */}
                    {step === "phone" && (
                        <form onSubmit={handleSendOTP} className="space-y-6">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                                    <Phone className="h-6 w-6 text-primary" />
                                </div>
                                <h2 className="text-xl font-bold text-foreground">Login with Mobile</h2>
                                <p className="text-sm text-muted-foreground mt-1">We'll send a 6-digit OTP to your number</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">Mobile Number</label>
                                <div className="flex items-center gap-2 rounded-xl border border-input bg-background px-4 focus-within:ring-2 focus-within:ring-ring transition-shadow">
                                    <span className="text-muted-foreground font-medium text-sm">+91</span>
                                    <div className="w-px h-5 bg-border" />
                                    <input
                                        type="tel"
                                        inputMode="numeric"
                                        maxLength={10}
                                        value={phone}
                                        onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "")); setError(""); }}
                                        required
                                        placeholder="XXXXX XXXXX"
                                        className="flex-1 bg-transparent py-3.5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
                                    />
                                </div>
                                {error && <p className="text-destructive text-xs mt-2">{error}</p>}
                            </div>

                            <button
                                type="submit"
                                className="kiosk-touch-target w-full rounded-xl bg-primary py-4 text-lg font-bold text-primary-foreground transition-all hover:brightness-110 hover:shadow-lg flex items-center justify-center gap-2"
                            >
                                Send OTP <ArrowRight className="h-5 w-5" />
                            </button>

                            <p className="text-center text-xs text-muted-foreground">
                                By continuing, you agree to our Terms of Service and Privacy Policy.
                            </p>
                        </form>
                    )}

                    {/* ── STEP 2: OTP ─────────────────────────────────── */}
                    {step === "otp" && (
                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-secondary/10 mb-4">
                                    <ShieldCheck className="h-6 w-6 text-secondary" />
                                </div>
                                <h2 className="text-xl font-bold text-foreground">Enter OTP</h2>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Sent to <span className="font-semibold text-foreground">+91 {phone}</span>
                                    <button type="button" onClick={() => setStep("phone")} className="ml-2 text-secondary text-xs underline">Change</button>
                                </p>
                                {/* DEV HINT */}
                                <div className="mt-2 rounded-lg bg-secondary/10 border border-secondary/20 px-3 py-1.5 text-xs text-secondary font-mono">
                                    Demo OTP: <span className="font-bold">{generatedOTP}</span>
                                </div>
                            </div>

                            {/* 6-box OTP input */}
                            <div className="flex gap-2 justify-center">
                                {otp.map((digit, i) => (
                                    <input
                                        key={i}
                                        ref={(el) => { otpRefs.current[i] = el; }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOTPChange(e.target.value, i)}
                                        onKeyDown={(e) => handleOTPKeyDown(e, i)}
                                        className={`h-12 w-10 rounded-xl border-2 text-center text-xl font-bold text-foreground bg-background focus:outline-none transition-all ${digit ? "border-secondary bg-secondary/5" : "border-input"} focus:border-secondary focus:bg-secondary/5`}
                                    />
                                ))}
                            </div>

                            {error && <p className="text-destructive text-xs text-center">{error}</p>}

                            <button
                                type="submit"
                                disabled={otp.join("").length < 6}
                                className="kiosk-touch-target w-full rounded-xl bg-secondary py-4 text-lg font-bold text-secondary-foreground transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <ShieldCheck className="h-5 w-5" /> Verify OTP
                            </button>

                            <div className="text-center">
                                {resendCooldown > 0 ? (
                                    <p className="text-xs text-muted-foreground">Resend OTP in <span className="font-semibold text-foreground">{resendCooldown}s</span></p>
                                ) : (
                                    <button type="button" onClick={handleResend} className="inline-flex items-center gap-1.5 text-xs text-secondary font-semibold hover:underline">
                                        <RefreshCw className="h-3 w-3" /> Resend OTP
                                    </button>
                                )}
                            </div>
                        </form>
                    )}

                    {/* ── STEP 3: Success ──────────────────────────────── */}
                    {step === "success" && (
                        <div className="text-center space-y-4 py-6">
                            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-kiosk-green/10 mb-2 animate-[bounce_0.6s_ease]">
                                <CheckCircle2 className="h-10 w-10 text-kiosk-green" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">Login Successful!</h2>
                            <p className="text-muted-foreground text-sm">Redirecting to your Dashboard...</p>
                            <div className="flex justify-center gap-1 mt-2">
                                {[0, 1, 2].map(i => (
                                    <span key={i} className="h-2 w-2 rounded-full bg-kiosk-green animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <p className="text-center text-xs text-muted-foreground mt-6">
                    Admin access? <a href="/admin/login" className="text-secondary font-semibold hover:underline">Staff Login →</a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
