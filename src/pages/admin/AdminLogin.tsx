import KioskHeader from "@/components/KioskHeader";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Lock, User } from "lucide-react";
import { toast } from "sonner";

const AdminLogin = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock validation
        if (username === "admin@gmail.com" && password === "12345") {
            navigate("/admin/dashboard");
            toast.success("Login Successful");
        } else {
            toast.error(t("admin.invalid"));
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <KioskHeader />
            <div className="container flex flex-col items-center justify-center py-20">
                <div className="w-full max-w-md space-y-8 rounded-xl bg-card p-8 shadow-lg border border-border">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-primary">{t("admin.loginTitle")}</h1>
                        <p className="mt-2 text-muted-foreground">Secure Staff Access</p>
                    </div>

                    <form onSubmit={handleLogin} className="mt-8 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">{t("admin.username")}</label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <User className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        className="block w-full rounded-lg border border-input bg-background p-3 pl-10 text-foreground placeholder-muted-foreground focus:border-primary focus:ring-primary"
                                        placeholder="Enter username"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">{t("admin.password")}</label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Lock className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="block w-full rounded-lg border border-input bg-background p-3 pl-10 text-foreground placeholder-muted-foreground focus:border-primary focus:ring-primary"
                                        placeholder="Enter password"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
                        >
                            {t("admin.loginButton")}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
