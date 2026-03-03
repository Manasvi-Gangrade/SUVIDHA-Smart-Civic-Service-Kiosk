import { useState } from "react";
import { Receipt, CheckCircle2, ChevronRight, CreditCard, Building2, ScanLine } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ScannerOverlay from "../components/ScannerOverlay";
import ReceiptPrinter from "../components/ReceiptPrinter";

const mockBills: Record<string, any> = {
    electricity: { amount: "₹ 1,240.50", dueDate: "15 Mar 2026", name: "Ramesh Kumar" },
    water: { amount: "₹ 450.00", dueDate: "22 Mar 2026", name: "Rita Sharma" },
    property: { amount: "₹ 5,600.00", dueDate: "31 Mar 2026", name: "Suresh Patel" }
};

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const state = location.state as { category?: string; service?: string } | null;
    const categoryStr = (state?.category || "Utility").toLowerCase();

    // Determine bill type
    let billType = "electricity";
    if (categoryStr.includes("water")) billType = "water";
    if (categoryStr.includes("property") || categoryStr.includes("municipal")) billType = "property";

    const [step, setStep] = useState(1);
    const [accountNumber, setAccountNumber] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [billDetails, setBillDetails] = useState<any>(null);
    const [showScanner, setShowScanner] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);

    const handleFetchBill = (e: React.FormEvent) => {
        e.preventDefault();
        if (!accountNumber) return;
        setIsLoading(true);
        setTimeout(() => {
            setBillDetails(mockBills[billType]);
            setStep(2);
            setIsLoading(false);
        }, 1500);
    };

    const handlePay = () => {
        setIsLoading(true);
        setTimeout(() => {
            setStep(3);
            setIsLoading(false);
        }, 2000);
    };

    if (step === 3) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
                <div className="rounded-full bg-kiosk-green/20 p-6 mb-6">
                    <CheckCircle2 className="h-20 w-20 text-kiosk-green" />
                </div>
                <h1 className="text-4xl font-black text-foreground mb-4">{t("payment.success")}</h1>
                <p className="text-lg text-muted-foreground mb-8">
                    {t("payment.successDesc")}
                </p>
                <div className="rounded-2xl bg-card border border-border p-6 max-w-sm w-full shadow-lg">
                    <div className="flex justify-between text-sm mb-3">
                        <span className="text-muted-foreground">{t("payment.txnId")}</span>
                        <span className="font-mono font-bold">TXN-98442{Math.floor(Math.random() * 100)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-3">
                        <span className="text-muted-foreground">{t("payment.accountNo")}</span>
                        <span className="font-mono">{accountNumber}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-3 border-t border-border">
                        <span className="font-semibold">{t("payment.totalPaid")}</span>
                        <span className="font-black text-kiosk-green">{billDetails.amount}</span>
                    </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                    <button
                        onClick={() => setShowReceipt(true)}
                        className="flex-1 rounded-xl bg-kiosk-green px-6 py-4 font-bold text-white shadow-xl shadow-kiosk-green/20 hover:scale-[1.02] transition-transform animate-pulse"
                    >
                        Print Receipt
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="flex-1 rounded-xl bg-secondary px-6 py-4 font-bold text-secondary-foreground shadow-xl shadow-secondary/20 hover:scale-[1.02] transition-transform"
                    >
                        {t("payment.returnHome")}
                    </button>
                </div>

                {showReceipt && (
                    <ReceiptPrinter
                        onClose={() => setShowReceipt(false)}
                        receiptData={{
                            id: `TXN-98442${Math.floor(Math.random() * 100)}`,
                            title: "BILL PAYMENT",
                            date: new Date().toLocaleDateString(),
                            department: state?.category || "Utility Services",
                            amount: billDetails?.amount,
                            items: [
                                { label: "ACCOUNT", value: accountNumber },
                                { label: "CONSUMER", value: billDetails?.name || "" }
                            ]
                        }}
                    />
                )}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="border-b border-border bg-primary py-8">
                <div className="container flex items-center gap-4">
                    <div className="rounded-2xl bg-secondary p-4">
                        <Receipt className="h-8 w-8 text-secondary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-primary-foreground">{state?.service || t("payment.title")}</h1>
                        <p className="text-primary-foreground/70">{state?.category || "Utility Services"}</p>
                    </div>
                </div>
            </div>

            <div className="container max-w-xl py-12">
                {/* Progress Tracker */}
                <div className="flex items-center justify-center mb-10">
                    <div className={`flex items-center gap-2 ${step >= 1 ? "text-secondary" : "text-muted-foreground"}`}>
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? "bg-secondary text-secondary-foreground" : "bg-muted"}`}>1</div>
                        <span className="text-sm font-semibold">Enter Details</span>
                    </div>
                    <div className={`w-12 h-1 mx-2 rounded-full ${step >= 2 ? "bg-secondary" : "bg-border"}`} />
                    <div className={`flex items-center gap-2 ${step >= 2 ? "text-secondary" : "text-muted-foreground"}`}>
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? "bg-secondary text-secondary-foreground" : "bg-muted"}`}>2</div>
                        <span className="text-sm font-semibold">Confirm & Pay</span>
                    </div>
                </div>

                {step === 1 && (
                    <form onSubmit={handleFetchBill} className="animate-in slide-in-from-right fade-in">
                        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-semibold text-foreground">
                                    {t("payment.enterAccount")}
                                </label>
                                <button type="button" onClick={() => setShowScanner(true)} className="text-xs font-bold text-secondary flex items-center gap-1 hover:underline px-2 py-1 rounded-md hover:bg-secondary/10 transition-colors">
                                    <ScanLine className="h-4 w-4" /> Scan QR Bill
                                </button>
                            </div>
                            <div className="relative mb-6">
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    className="w-full rounded-xl border border-input bg-background pl-12 pr-4 py-4 text-lg font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary transition-shadow"
                                    placeholder="e.g. 1000293844"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading || !accountNumber}
                                className="w-full rounded-xl bg-primary py-4 font-bold text-primary-foreground flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
                            >
                                {isLoading ? (
                                    <span className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                ) : (
                                    <>{t("payment.fetchBill")} <ChevronRight className="h-5 w-5" /></>
                                )}
                            </button>
                        </div>
                    </form>
                )}

                {step === 2 && billDetails && (
                    <div className="animate-in slide-in-from-right fade-in">
                        <div className="rounded-2xl border border-secondary/30 bg-secondary/5 p-6 shadow-sm mb-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Receipt className="h-32 w-32" />
                            </div>
                            <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-6">{t("payment.billSummary")}</h3>

                            <div className="space-y-4 relative z-10">
                                <div>
                                    <div className="text-sm text-muted-foreground">{t("payment.consumerName")}</div>
                                    <div className="text-lg font-bold text-foreground">{billDetails.name}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm text-muted-foreground">{t("payment.dueDate")}</div>
                                        <div className="font-semibold text-destructive">{billDetails.dueDate}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">{t("payment.accountNo")}</div>
                                        <div className="font-mono font-semibold">{accountNumber}</div>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-secondary/20 mt-4">
                                    <div className="text-sm text-muted-foreground mb-1">{t("payment.totalDue")}</div>
                                    <div className="text-4xl font-black text-foreground drop-shadow-sm">{billDetails.amount}</div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handlePay}
                            disabled={isLoading}
                            className="w-full rounded-xl bg-kiosk-green py-4 text-lg font-bold text-white flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] disabled:opacity-70 shadow-lg shadow-kiosk-green/20"
                        >
                            {isLoading ? (
                                <span className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <><CreditCard className="h-6 w-6" /> {t("payment.proceedPay")}</>
                            )}
                        </button>
                        <button
                            onClick={() => setStep(1)}
                            className="w-full mt-4 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {t("payment.cancel")}
                        </button>
                    </div>
                )}
            </div>

            {showScanner && (
                <ScannerOverlay
                    scanType="qr"
                    onClose={() => setShowScanner(false)}
                    onSuccess={(data) => {
                        setAccountNumber(data.accountNo);
                        // Optional: you could auto-submit here by calling handleFetchBill directly
                    }}
                />
            )}
        </div>
    );
};

export default PaymentPage;
