import KioskHeader from "@/components/KioskHeader";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Lock, User, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
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
                toast.error(t("admin.invalid"));
                setIsLoading(false);
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#192e59] to-[#0f172a] flex flex-col relative overflow-hidden font-sans">
            <KioskHeader />
            
            {/* Background Video Overlay */}
            <div className="absolute inset-0 z-0">
                <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-30 mix-blend-overlay">
                    <source src="/videos/14904045_3840_2160_30fps.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-[#192e59]/20" />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative z-10">
                <div className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-[0_40px_100px_-15px_rgba(0,0,0,0.5)] border border-slate-200 overflow-hidden flex flex-col transition-all duration-500 my-auto">
                    
                    {/* Premium Navy Header */}
                    <div className="bg-[#192e59] p-10 text-white text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#FD8008]/10 rounded-full -ml-12 -mb-12 blur-xl" />
                        
                        <div className="relative z-10 flex flex-col items-center gap-4">
                            <div className="w-20 h-20 bg-white/10 rounded-3xl backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl">
                                <ShieldCheck className="w-12 h-12 text-[#FD8008]" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black uppercase tracking-tighter">{t("admin.loginTitle")}</h1>
                                <p className="text-[#FD8008] font-black text-xs uppercase tracking-[0.4em] mt-2">Authority Management Terminal</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-12 space-y-10">
                        <form onSubmit={handleLogin} className="space-y-8">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t("admin.username")}</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-6">
                                            <User className="h-7 w-7 text-slate-300 group-focus-within:text-[#192e59] transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                            className="block w-full rounded-2xl border-2 border-slate-100 bg-slate-50 py-6 pl-16 pr-8 text-2xl font-bold text-[#192e59] placeholder:text-slate-300 outline-none focus:border-[#192e59] focus:bg-white focus:ring-8 focus:ring-[#192e59]/5 transition-all"
                                            placeholder="admin@gmail.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t("admin.password")}</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-6">
                                            <Lock className="h-7 w-7 text-slate-300 group-focus-within:text-[#192e59] transition-colors" />
                                        </div>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="block w-full rounded-2xl border-2 border-slate-100 bg-slate-50 py-6 pl-16 pr-8 text-2xl font-bold text-[#192e59] placeholder:text-slate-300 outline-none focus:border-[#192e59] focus:bg-white focus:ring-8 focus:ring-[#192e59]/5 transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative flex w-full items-center justify-center rounded-[2rem] bg-[#192e59] py-6 text-2xl font-black text-white transition-all hover:bg-[#112040] shadow-[0_20px_50px_-10px_rgba(25,46,89,0.5)] hover:-translate-y-2 active:translate-y-0 uppercase tracking-widest overflow-hidden disabled:opacity-70"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                {isLoading ? (
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-4">
                                        {t("admin.loginButton")} <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
                                    </span>
                                )}
                            </button>
                        </form>

                        <div className="pt-6 text-center border-t border-slate-100">
                             <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
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
