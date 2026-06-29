import { useState } from "react";
import { User, Mail, Phone, MapPin, Save, ShieldCheck, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const EditProfile = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isSaving, setIsSaving] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [showOtpPopup, setShowOtpPopup] = useState(false);
    const [otp, setOtp] = useState("");

    const [profile, setProfile] = useState({
        name: "Manasvi Gangrade",
        email: "manasvi@example.com",
        phone: "+91 98765 43210",
        address: "Plot 42, Sector 15, Guwahati",
        aadhaar: "XXXX-XXXX-1234"
    });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        // Trigger OTP Popup before actually saving
        setShowOtpPopup(true);
    };

    const handleVerifyOtp = () => {
        if (otp.length < 4) {
            toast.error("Please enter a valid OTP");
            return;
        }
        setShowOtpPopup(false);
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setIsVerified(true);
            toast.success("Profile updated successfully!");
            setTimeout(() => navigate("/"), 3000);
        }, 2000);
    };

    if (isVerified) {
        return (
            <div className="h-full font-display relative flex flex-col bg-[#192e59] text-white overflow-hidden items-center justify-center p-6 text-center animate-in zoom-in duration-500">
                <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                    <video
                        src="/videos/14904045_3840_2160_30fps.mp4"
                        autoPlay loop muted playsInline
                        className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#192e59]/45 via-[#192e59]/25 to-[#192e59]/75" />
                </div>
                <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }} />

                <div className="relative z-10 flex flex-col items-center">
                    <div className="rounded-full bg-green-500/20 p-8 mb-8 border border-green-500/30 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                        <CheckCircle2 className="h-24 w-24 text-green-400" />
                    </div>
                    <h1 className="text-4xl font-black text-white mb-4 drop-shadow-lg">Updates Saved Successfully!</h1>
                    <p className="text-xl text-white/80 mb-10 max-w-md">
                        Your consumer profile has been updated in the master registry. A confirmation SMS has been sent to your registered mobile number.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-gradient-to-br from-[#0f172a] via-[#192e59] to-[#0f172a] flex flex-col relative overflow-hidden font-sans">
            <div className="absolute inset-0 z-0 pointer-events-none">
                <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-30 mix-blend-overlay">
                    <source src="/videos/14904045_3840_2160_30fps.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-[#192e59]/20" />
            </div>

            <div className="flex-1 w-full px-[5%] max-w-none relative z-10 flex items-center justify-center p-6">
                <div className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(25,46,89,0.2)] border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
                    
                    {/* Header Section */}
                    <div className="bg-[#192e59] p-8 text-white relative flex-shrink-0">
                        <button 
                            onClick={() => navigate(-1)} 
                            className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2 px-5 py-2.5 bg-[#FD8008] hover:bg-[#e67000] text-white border border-[#FD8008]/20 rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 duration-200 group shadow-[0_4px_12px_rgba(253,128,8,0.3)] z-50"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span>Back</span>
                        </button>
                        <div className="text-center">
                            <h1 className="text-3xl font-[900] tracking-tight uppercase leading-none">Edit Profile</h1>
                            <p className="text-blue-200 text-xs font-bold mt-2 tracking-[0.3em] uppercase">Manage your credentials</p>
                        </div>
                    </div>

                    <div className="flex-1 p-8 lg:p-12 overflow-y-auto custom-scrollbar bg-white">
                        <form onSubmit={handleSave} className="relative">
                            <div className="flex items-center gap-4 mb-10 pb-10 border-b border-slate-200">
                                <div className="h-20 w-20 bg-blue-50 rounded-3xl flex items-center justify-center border-2 border-blue-100 shadow-sm">
                                   <User className="h-10 w-10 text-blue-500" />
                                </div>
                                <div>
                                   <h3 className="text-2xl font-[900] text-slate-800 tracking-tight uppercase">{profile.name}</h3>
                                   <div className="flex items-center gap-2 mt-1 text-emerald-600 font-bold text-xs tracking-widest uppercase">
                                      <ShieldCheck className="h-4 w-4" /> Verified Citizen
                                   </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <User className="h-4 w-4" /> Full Name
                                        </label>
                                        <input 
                                            type="text" 
                                            value={profile.name}
                                            disabled
                                            className="w-full bg-slate-100 border-2 border-slate-200 rounded-xl px-5 py-4 text-slate-500 cursor-not-allowed font-bold"
                                        />
                                        <p className="text-[10px] text-slate-400 ml-2 italic font-bold">Name cannot be changed via Kiosk.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <ShieldCheck className="h-4 w-4" /> Aadhaar ID
                                        </label>
                                        <input 
                                            type="text" 
                                            value={profile.aadhaar}
                                            disabled
                                            className="w-full bg-slate-100 border-2 border-slate-200 rounded-xl px-5 py-4 text-slate-500 cursor-not-allowed font-mono font-bold tracking-wider"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Phone className="h-4 w-4" /> Mobile Number
                                    </label>
                                    <input 
                                        type="tel" 
                                        value={profile.phone}
                                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-4 text-lg text-slate-800 placeholder:text-slate-300 focus:ring-4 focus:ring-[#FD8008]/10 focus:border-[#FD8008] transition-all outline-none font-bold"
                                        placeholder="+91 XXXXX XXXXX"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Mail className="h-4 w-4" /> Email Address
                                    </label>
                                    <input 
                                        type="email" 
                                        value={profile.email}
                                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-4 text-lg text-slate-800 placeholder:text-slate-300 focus:ring-4 focus:ring-[#FD8008]/10 focus:border-[#FD8008] transition-all outline-none font-bold"
                                        placeholder="name@example.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <MapPin className="h-4 w-4" /> Residential Address
                                    </label>
                                    <textarea 
                                        rows={3}
                                        value={profile.address}
                                        onChange={(e) => setProfile({...profile, address: e.target.value})}
                                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-4 text-lg text-slate-800 placeholder:text-slate-300 focus:ring-4 focus:ring-[#FD8008]/10 focus:border-[#FD8008] transition-all outline-none resize-none font-bold"
                                        placeholder="Enter updated address"
                                    />
                                </div>
                            </div>

                            <div className="mt-12 pt-10 border-t border-slate-200 flex justify-end">
                                <button 
                                    type="submit"
                                    disabled={isSaving}
                                    className="bg-[#FD8008] hover:bg-[#e67300] text-white px-12 py-5 rounded-2xl font-black text-xl flex items-center gap-3 shadow-xl shadow-[#FD8008]/40 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 uppercase tracking-wider"
                                >
                                    {isSaving ? <Loader2 className="h-6 w-6 animate-spin" /> : <><Save className="h-6 w-6" /> Save Changes</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* OTP VERIFICATION MODAL */}
            {showOtpPopup && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-[#1e2e50] border border-white/20 rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl flex flex-col items-center text-center">
                        <div className="h-20 w-20 bg-[#FD8008]/20 rounded-full flex items-center justify-center mb-6">
                            <ShieldCheck className="h-10 w-10 text-[#FD8008]" />
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2">Verify Changes</h2>
                        <p className="text-white/60 mb-8 text-sm">
                            Please enter the 4-digit OTP sent to your registered mobile number to confirm profile updates.
                        </p>
                        
                        <input 
                            type="text" 
                            maxLength={4}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            className="w-full bg-white/5 border border-white/20 rounded-2xl text-center text-3xl tracking-[1em] font-black py-4 text-white focus:ring-4 focus:ring-[#FD8008]/30 focus:border-[#FD8008] outline-none transition-all mb-8"
                            placeholder="••••"
                        />
                        
                        <div className="flex gap-4 w-full">
                            <button 
                                onClick={() => setShowOtpPopup(false)}
                                className="flex-1 py-4 rounded-xl border border-white/20 text-white font-bold hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleVerifyOtp}
                                disabled={otp.length !== 4}
                                className="flex-1 py-4 rounded-xl bg-[#FD8008] text-white font-black hover:bg-[#e67000] transition-colors disabled:opacity-50"
                            >
                                Verify & Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditProfile;
