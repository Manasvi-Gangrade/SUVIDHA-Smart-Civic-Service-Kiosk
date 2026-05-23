import { useState } from "react";
import { Receipt, CheckCircle2, ChevronRight, CreditCard, Building2, ScanLine, SmartphoneNfc } from "lucide-react";
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
            <div className="min-h-screen bg-[#192e59] flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500 relative overflow-hidden text-white">
                
                {/* 🎥 BACKGROUND VIDEO */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover opacity-15 mix-blend-overlay"
                    >
                        <source src="/videos/14904045_3840_2160_30fps.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-b from-[#192e59]/80 via-[#192e59]/95 to-[#192e59]" />
                </div>

                <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
                    {/* Pure CSS Animated Checkmark */}
                    <div className="success-checkmark mb-6">
                        <div className="check-icon">
                            <span className="icon-line line-tip"></span>
                            <span className="icon-line line-long"></span>
                            <div className="icon-circle"></div>
                            <div className="icon-fix"></div>
                        </div>
                    </div>
                    
                    <h1 className="text-4xl font-black text-white mb-4">{t("payment.success")}</h1>
                    <p className="text-lg text-blue-200 mb-8">
                        {t("payment.successDesc")}
                    </p>
                    <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6 w-full shadow-lg text-white">
                        <div className="flex justify-between text-sm mb-3">
                            <span className="text-slate-300">{t("payment.txnId")}</span>
                            <span className="font-mono font-bold">TXN-98442{Math.floor(Math.random() * 100)}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-3">
                            <span className="text-slate-300">{t("payment.accountNo")}</span>
                            <span className="font-mono">{accountNumber}</span>
                        </div>
                        <div className="flex justify-between text-sm pt-3 border-t border-white/10">
                            <span className="font-semibold">Total Paid</span>
                            <span className="font-black text-emerald-400">{billDetails.amount}</span>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full">
                        <button
                            onClick={() => setShowReceipt(true)}
                            className="flex-1 rounded-xl bg-emerald-600 px-6 py-4 font-bold text-white shadow-xl shadow-emerald-600/20 hover:scale-[1.02] transition-transform animate-pulse"
                        >
                            Print Receipt
                        </button>
                        <button
                            onClick={() => navigate("/departments")}
                            className="flex-1 rounded-xl bg-[#FD8008] px-6 py-4 font-bold text-white shadow-xl shadow-[#FD8008]/20 hover:scale-[1.02] transition-transform"
                        >
                            Return Grid
                        </button>
                    </div>
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
        <div className="min-h-screen bg-[#192e59] relative overflow-hidden text-white">
            
            {/* 🎥 BACKGROUND VIDEO */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-15 mix-blend-overlay"
                >
                    <source src="/videos/14904045_3840_2160_30fps.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-b from-[#192e59]/80 via-[#192e59]/95 to-[#192e59]" />
            </div>

            <div className="relative z-10 w-full">
                <div className="border-b border-white/10 bg-[#122242] py-8">
                    <div className="container flex items-center gap-4">
                        <div className="rounded-2xl bg-[#FD8008] p-4 text-white shadow-lg shadow-[#FD8008]/20">
                            <Receipt className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">{state?.service || t("payment.title")}</h1>
                            <p className="text-blue-200">{state?.category || "Utility Services"}</p>
                        </div>
                    </div>
                </div>

                <div className="container max-w-xl py-12">
                    {/* Progress Tracker */}
                    <div className="flex items-center justify-center mb-10">
                        <div className={`flex items-center gap-2 ${step >= 1 ? "text-[#FD8008]" : "text-blue-300"}`}>
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? "bg-[#FD8008] text-white" : "bg-white/10 text-white"}`}>1</div>
                            <span className="text-sm font-semibold">Enter Details</span>
                        </div>
                        <div className={`w-12 h-1 mx-2 rounded-full ${step >= 2 ? "bg-[#FD8008]" : "bg-white/10"}`} />
                        <div className={`flex items-center gap-2 ${step >= 2 ? "text-[#FD8008]" : "text-blue-300"}`}>
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? "bg-[#FD8008] text-white" : "bg-white/10 text-white"}`}>2</div>
                            <span className="text-sm font-semibold">Confirm & Pay</span>
                        </div>
                    </div>

                    {step === 1 && (
                        <form onSubmit={handleFetchBill} className="animate-in slide-in-from-right fade-in">
                            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-sm text-white">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-semibold text-white">
                                        {t("payment.enterAccount")}
                                    </label>
                                    <button type="button" onClick={() => setShowScanner(true)} className="text-xs font-bold text-[#FD8008] flex items-center gap-1 hover:underline px-2 py-1 rounded-md hover:bg-[#FD8008]/10 transition-colors">
                                        <ScanLine className="h-4 w-4" /> Scan QR Bill
                                    </button>
                                </div>
                                <div className="relative mb-6">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                                    <input
                                        type="text"
                                        value={accountNumber}
                                        onChange={(e) => setAccountNumber(e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-white/10 pl-12 pr-4 py-4 text-lg font-mono placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FD8008] transition-shadow text-white"
                                        placeholder="e.g. 1000293844"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading || !accountNumber}
                                    className="w-full rounded-xl bg-[#FD8008] hover:bg-[#e67300] py-4 font-bold text-white flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 shadow-lg shadow-[#FD8008]/20"
                                >
                                    {isLoading ? (
                                        <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>{t("payment.fetchBill")} <ChevronRight className="h-5 w-5" /></>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 2 && billDetails && (
                        <div className="animate-in slide-in-from-right fade-in">
                            <div className="rounded-2xl border border-[#FD8008]/30 bg-[#FD8008]/5 p-6 shadow-sm mb-6 relative overflow-hidden text-white">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Receipt className="h-32 w-32" />
                                </div>
                                <h3 className="text-sm font-bold text-[#FD8008] uppercase tracking-wider mb-6">{t("payment.billSummary")}</h3>

                                <div className="space-y-4 relative z-10">
                                    <div>
                                        <div className="text-sm text-slate-300">{t("payment.consumerName")}</div>
                                        <div className="text-lg font-bold text-white">{billDetails.name}</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-sm text-slate-300">{t("payment.dueDate")}</div>
                                            <div className="font-semibold text-rose-400">{billDetails.dueDate}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-slate-300">{t("payment.accountNo")}</div>
                                            <div className="font-mono font-semibold">{accountNumber}</div>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-white/10 mt-4">
                                        <div className="text-sm text-slate-300 mb-1">{t("payment.totalDue")}</div>
                                        <div className="text-4xl font-black text-white drop-shadow-sm">{billDetails.amount}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Options Layer */}
                            <div className="pt-4 border-t border-white/10 mt-6">
                                <h4 className="text-sm font-bold text-white mb-4">Select Payment Method</h4>
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <button className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-[#FD8008] bg-white/10 text-white gap-2 transition-all shadow-sm">
                                        <SmartphoneNfc className="h-6 w-6 text-[#FD8008]" />
                                        <span className="text-xs font-bold">Tap & Pay (NFC)</span>
                                    </button>
                                    <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/10 bg-white/5 text-slate-300 gap-2 transition-all hover:bg-white/10">
                                        <CreditCard className="h-6 w-6" />
                                        <span className="text-xs font-bold">Credit/Debit Card</span>
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={() => setStep(2.5)}
                                disabled={isLoading}
                                className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 py-4 text-lg font-bold text-white flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] disabled:opacity-70 shadow-lg shadow-emerald-500/20"
                            >
                                <SmartphoneNfc className="h-6 w-6" /> Proceed to Tap
                            </button>
                            <button
                                onClick={() => setStep(1)}
                                className="w-full mt-4 py-3 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                            >
                                {t("payment.cancel")}
                            </button>
                        </div>
                    )}

                    {step === 2.5 && (
                        <div className="animate-in zoom-in fade-in duration-500 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden text-white">
                            <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-blue-500 to-[#FD8008]" />
                            
                            <h2 className="text-2xl font-black text-white mb-2">Ready for Payment</h2>
                            <p className="text-slate-300 text-sm mb-12">Total Amount: <span className="font-bold text-white text-lg">{billDetails?.amount}</span></p>

                            <div className="relative mx-auto w-48 h-48 mb-8 flex items-center justify-center group cursor-pointer" onClick={handlePay}>
                                <div className="absolute inset-0 rounded-full border-4 border-[#FD8008]/20 animate-[ping_2s_ease-out_infinite]" />
                                <div className="absolute inset-4 rounded-full border-4 border-[#FD8008]/40 animate-[ping_2s_ease-out_infinite] [animation-delay:0.5s]" />
                                <div className="absolute inset-8 rounded-full border-4 border-[#FD8008]/60 animate-[ping_2s_ease-out_infinite] [animation-delay:1s]" />
                                
                                <div className="relative z-10 w-24 h-24 bg-[#FD8008] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform shadow-[#FD8008]/50">
                                    <SmartphoneNfc className="h-10 w-10 text-white" />
                                </div>

                                {isLoading && (
                                    <div className="absolute inset-0 bg-[#192e59]/80 rounded-full flex items-center justify-center z-20 backdrop-blur-sm">
                                        <div className="h-12 w-12 border-4 border-[#FD8008] border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}
                            </div>

                            <p className="text-lg font-bold text-[#FD8008] animate-pulse">
                                {isLoading ? "Processing Payment..." : "Tap Smartphone or Card Here (Click to Simulate)"}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {showScanner && (
                <ScannerOverlay
                    scanType="qr"
                    onClose={() => setShowScanner(false)}
                    onSuccess={(data) => {
                        setAccountNumber(data.accountNo);
                    }}
                />
            )}
        </div>
    );
};

export default PaymentPage;
