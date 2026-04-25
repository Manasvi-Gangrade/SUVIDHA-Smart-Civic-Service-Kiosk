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

    const [profile, setProfile] = useState({
        name: "Manasvi Gangrade",
        email: "manasvi@example.com",
        phone: "+91 98765 43210",
        address: "Plot 42, Sector 15, Guwahati",
        aadhaar: "XXXX-XXXX-1234"
    });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setIsVerified(true);
            toast.success("Profile updated successfully!");
            setTimeout(() => navigate("/"), 2000);
        }, 2000);
    };

    if (isVerified) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-500">
                <div className="rounded-full bg-green-500/20 p-8 mb-8 border border-green-500/30">
                    <CheckCircle2 className="h-24 w-24 text-green-500" />
                </div>
                <h1 className="text-4xl font-black text-white mb-4">Updates Saved Successfully!</h1>
                <p className="text-xl text-white/50 mb-10 max-w-md">
                    Your consumer profile has been updated in the master registry. A confirmation SMS has been sent to your registered mobile number.
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="rounded-2xl bg-primary px-12 py-5 font-black text-xl text-primary-foreground shadow-2xl shadow-primary/30 hover:scale-105 transition-all"
                >
                    Return to Home
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-white pb-20">
            {/* Header */}
            <div className="border-b border-white/10 bg-[#1e2e50] py-12">
                <div className="container flex items-center gap-6">
                    <button onClick={() => navigate(-1)} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                        <ArrowLeft className="h-8 w-8 text-white" />
                    </button>
                    <div>
                        <h1 className="text-4xl font-black tracking-tight">Edit Consumer Profile</h1>
                        <p className="text-white/60 font-medium mt-1">Manage your personal and contact information securely</p>
                    </div>
                </div>
            </div>

            <div className="container max-w-3xl py-12">
                <form onSubmit={handleSave} className="bg-[#1e2e50]/40 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden p-8 md:p-12">
                    <div className="flex items-center gap-4 mb-10 pb-10 border-b border-white/5">
                        <div className="h-20 w-20 bg-primary/20 rounded-3xl flex items-center justify-center border border-primary/30">
                           <User className="h-10 w-10 text-primary" />
                        </div>
                        <div>
                           <h3 className="text-2xl font-black tracking-tight">{profile.name}</h3>
                           <div className="flex items-center gap-2 mt-1 text-primary font-bold">
                              <ShieldCheck className="h-4 w-4" /> Verified Citizen
                           </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-white/70 ml-1 flex items-center gap-2">
                                    <User className="h-4 w-4" /> Full Name
                                </label>
                                <input 
                                    type="text" 
                                    value={profile.name}
                                    disabled
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white/50 cursor-not-allowed"
                                />
                                <p className="text-[10px] text-white/30 ml-2 italic">Name cannot be changed via Kiosk. Visit Municipal Office for corrections.</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-white/70 ml-1 flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4" /> Aadhaar ID
                                </label>
                                <input 
                                    type="text" 
                                    value={profile.aadhaar}
                                    disabled
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white/50 cursor-not-allowed font-mono"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-white/70 ml-1 flex items-center gap-2">
                                <Phone className="h-4 w-4" /> Mobile Number
                            </label>
                            <input 
                                type="tel" 
                                value={profile.phone}
                                onChange={(e) => setProfile({...profile, phone: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                placeholder="+91 XXXXX XXXXX"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-white/70 ml-1 flex items-center gap-2">
                                <Mail className="h-4 w-4" /> Email Address
                            </label>
                            <input 
                                type="email" 
                                value={profile.email}
                                onChange={(e) => setProfile({...profile, email: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                placeholder="name@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-white/70 ml-1 flex items-center gap-2">
                                <MapPin className="h-4 w-4" /> Residential Address
                            </label>
                            <textarea 
                                rows={3}
                                value={profile.address}
                                onChange={(e) => setProfile({...profile, address: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                                placeholder="Enter updated address"
                            />
                        </div>
                    </div>

                    <div className="mt-12 pt-10 border-t border-white/5 flex justify-end">
                        <button 
                            type="submit"
                            disabled={isSaving}
                            className="bg-primary text-primary-foreground px-12 py-5 rounded-2xl font-black text-xl flex items-center gap-3 shadow-xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="h-6 w-6 animate-spin" /> : <><Save className="h-6 w-6" /> Save Changes</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
