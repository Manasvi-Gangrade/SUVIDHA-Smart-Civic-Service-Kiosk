import { useState, useEffect } from "react";
import { Printer, X, Download } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ReceiptPrinterProps {
    receiptData: {
        id: string;
        title: string;
        amount?: string;
        date: string;
        department: string;
        items: { label: string; value: string }[];
    };
    onClose: () => void;
}

const ReceiptPrinter = ({ receiptData, onClose }: ReceiptPrinterProps) => {
    const { t } = useTranslation();
    const [isPrinting, setIsPrinting] = useState(true);

    useEffect(() => {
        // Simulate printing animation time
        const timer = setTimeout(() => {
            setIsPrinting(false);
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">

            {/* The Printer Hardware Mock */}
            <div className="relative w-full max-w-sm flex flex-col items-center">

                {/* Close Button */}
                {!isPrinting && (
                    <button
                        onClick={onClose}
                        className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white bg-white/10 rounded-full transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                )}

                {/* Printer Slot Top */}
                <div className="w-[85%] h-8 bg-slate-800 rounded-t-2xl border-t-2 border-x-2 border-slate-700 shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)] z-20 relative flex items-center justify-center">
                    <div className="w-1/2 h-1 bg-slate-900 rounded-full opacity-50"></div>
                </div>

                {/* The Paper Receipt - Animates sliding down out of the printer */}
                <div className="relative w-[75%] bg-white pb-6 pt-8 z-10 shadow-2xl drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)] overflow-hidden">

                    {/* Printing Animation Wrapper */}
                    <div className={isPrinting ? "animate-[slideDown_2.5s_ease-out_forwards]" : ""}>

                        {/* Jagged top edge */}
                        <div className="absolute top-0 left-0 right-0 h-3 bg-white" style={{ clipPath: 'polygon(0 0, 5% 100%, 10% 0, 15% 100%, 20% 0, 25% 100%, 30% 0, 35% 100%, 40% 0, 45% 100%, 50% 0, 55% 100%, 60% 0, 65% 100%, 70% 0, 75% 100%, 80% 0, 85% 100%, 90% 0, 95% 100%, 100% 0)' }}></div>

                        <div className="px-6 font-mono text-xs text-slate-800 space-y-4">
                            <div className="text-center pb-4 border-b-2 border-dashed border-slate-300">
                                <h2 className="text-lg font-black uppercase tracking-widest">{t("appTitle")}</h2>
                                <p className="text-[10px] mt-1 text-slate-500 uppercase">Gov Kiosk Terminal #42</p>
                                <p className="text-[10px] text-slate-500">{receiptData.date}</p>
                            </div>

                            <div className="text-center py-2">
                                <h3 className="font-bold text-sm uppercase bg-slate-100 py-1">{receiptData.title}</h3>
                                <p className="text-[10px] mt-1 uppercase text-slate-600">{receiptData.department}</p>
                            </div>

                            <div className="space-y-2 py-2">
                                {receiptData.items.map((item, i) => (
                                    <div key={i} className="flex justify-between items-end gap-2">
                                        <span className="text-slate-500 uppercase text-[10px]">{item.label}</span>
                                        <span className="border-b border-dotted border-slate-300 flex-grow mb-1"></span>
                                        <span className="font-bold text-right truncate max-w-[50%]">{item.value}</span>
                                    </div>
                                ))}
                            </div>

                            {receiptData.amount && (
                                <div className="flex justify-between items-center py-3 border-y-2 border-dashed border-slate-300 font-bold text-sm">
                                    <span>TOTAL PAID</span>
                                    <span className="text-base">₹{receiptData.amount}</span>
                                </div>
                            )}

                            <div className="pt-4 flex flex-col items-center gap-2">
                                <div className="w-24 h-24 bg-slate-900 rounded-sm p-1">
                                    {/* Mock QR Code Pattern */}
                                    <div className="w-full h-full bg-white p-2">
                                        <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIHg9IjQiIHk9IjQiIGZpbGw9IiMwMDAiPjwvcmVjdD4KPC9zdmc+')] mix-blend-multiply opacity-80" style={{ backgroundSize: '8px' }}></div>
                                    </div>
                                </div>
                                <p className="text-[9px] text-center text-slate-400">Scan to verify authenticity</p>
                                <p className="text-[10px] text-center font-bold font-sans tracking-widest mt-2">{receiptData.id}</p>
                            </div>

                            <div className="text-center pt-4 text-[10px] text-slate-500 italic">
                                Thank you for using Suvidha
                            </div>

                        </div>

                        {/* Jagged bottom edge */}
                        <div className="absolute -bottom-3 left-0 right-0 h-3 bg-white" style={{ clipPath: 'polygon(0 0, 5% 100%, 10% 0, 15% 100%, 20% 0, 25% 100%, 30% 0, 35% 100%, 40% 0, 45% 100%, 50% 0, 55% 100%, 60% 0, 65% 100%, 70% 0, 75% 100%, 80% 0, 85% 100%, 90% 0, 95% 100%, 100% 0)', transform: 'rotate(180deg)' }}></div>
                    </div>
                </div>

                {/* Printer Slot Bottom Shadow Wrapper */}
                <div className="w-full flex justify-center mt-[-10px] z-20">
                    <div className="w-[90%] h-6 bg-slate-700/80 rounded-b-xl backdrop-blur-sm border-b border-x border-slate-600/50 flex justify-center items-end pb-1 gap-2">
                        {isPrinting ? (
                            <div className="flex gap-1 items-center mb-1">
                                <Printer className="h-3 w-3 text-emerald-400 animate-pulse" />
                                <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest animate-pulse">Printing...</span>
                            </div>
                        ) : (
                            <div className="flex gap-1 items-center mb-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                                <span className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">Ready</span>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            <style>{`
        @keyframes slideDown {
          0% { transform: translateY(-100%); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
        </div>
    );
};

export default ReceiptPrinter;
