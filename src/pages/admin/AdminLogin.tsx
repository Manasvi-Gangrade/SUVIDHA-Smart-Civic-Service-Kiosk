import KioskHeader from "@/components/KioskHeader";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Lock, User, ShieldCheck, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const AdminLogin = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Mock validation
        setTimeout(() => {
            if (username === "admin@gmail.com" && password === "12345") {
                navigate("/admin/dashboard");
                toast.success("Login Successful");
            } else {
                toast.error(t("admin.invalid") || "Invalid credentials");
                setIsLoading(false);
            }
        }, 1000);
    };

    return (
        <div className="h-screen bg-gradient-to-br from-[#0f172a] via-[#192e59] to-[#0f172a] flex flex-col relative overflow-hidden font-sans">
            {/* GORGEOUS STANDARDIZED BACK TO HOME BUTTON */}
            <button 
                onClick={() => navigate("/")} 
                className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-xl font-bold text-xs uppercase tracking-widest backdrop-blur-md transition-all hover:scale-105 active:scale-95 duration-200 group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Home</span>
            </button>

            <KioskHeader />
            
            {/* Background Video Overlay */}
            <div className="absolute inset-0 z-0">
                <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-30 mix-blend-overlay">
                    <source src="/videos/14904045_3840_2160_30fps.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-[#192e59]/20" />
            </div>

            <div className="flex-1 flex items-center justify-center p-4 relative z-10 overflow-hidden">
                <div className="w-full max-w-lg bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[85vh]">
                    
                    {/* Navy Header - Streamlined height */}
                    <div className="bg-[#192e59] p-6 text-white text-center relative overflow-hidden flex-shrink-0">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 blur-xl" />
                        <div className="absolute bottom-0 left-0 w-20 h-20 bg-[#FD8008]/10 rounded-full -ml-10 -mb-10 blur-xl" />
                        
                        <div className="relative z-10 flex flex-col items-center gap-2">
                            <div className="w-14 h-14 bg-white/10 rounded-2xl backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
                                <ShieldCheck className="w-8 h-8 text-[#FD8008]" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black uppercase tracking-tight">{t("admin.loginTitle") || "Admin Access"}</h1>
                                <p className="text-[#FD8008] font-black text-[9px] uppercase tracking-[0.3em] mt-1">Authority Management Terminal</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1 bg-white">
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t("admin.username") || "Username"}</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                                            <User className="h-5 w-5 text-slate-300 group-focus-within:text-[#192e59] transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                            className="block w-full rounded-xl border-2 border-slate-100 bg-slate-50 py-3.5 pl-12 pr-6 text-base font-bold text-[#192e59] placeholder:text-slate-300 outline-none focus:border-[#192e59] focus:bg-white focus:ring-4 focus:ring-[#192e59]/5 transition-all animate-none"
                                            placeholder="admin@gmail.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t("admin.password") || "Password"}</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                                            <Lock className="h-5 w-5 text-slate-300 group-focus-within:text-[#192e59] transition-colors" />
                                        </div>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="block w-full rounded-xl border-2 border-slate-100 bg-slate-50 py-3.5 pl-12 pr-6 text-base font-bold text-[#192e59] placeholder:text-slate-300 outline-none focus:border-[#192e59] focus:bg-white focus:ring-4 focus:ring-[#192e59]/5 transition-all animate-none"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative flex w-full items-center justify-center rounded-xl bg-[#192e59] py-4 text-lg font-black text-white transition-all hover:bg-[#112040] shadow-[0_12px_30px_-5px_rgba(25,46,89,0.3)] hover:-translate-y-1 active:translate-y-0 uppercase tracking-wider overflow-hidden disabled:opacity-70"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                {isLoading ? (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-3">
                                        {t("admin.loginButton") || "Login"} <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                                    </span>
                                )}
                              </button>
                        </form>

                        <div className="pt-4 text-center border-t border-slate-100">
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                Authorized Personnel Only • IP-Secured Tunnel
                             </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
