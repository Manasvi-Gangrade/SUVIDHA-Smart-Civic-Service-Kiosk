import React, { useRef } from "react";
import { Printer, Download, Mail, CheckCircle2 } from "lucide-react";

interface ReceiptProps {
  transactionId: string;
  type: string;
  date: string;
  details: { label: string; value: string }[];
  userName: string;
  onClose?: () => void;
}

const Receipt = ({ transactionId, type, date, details, userName, onClose }: ReceiptProps) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-border animate-in fade-in zoom-in duration-300">
      <div className="flex justify-center mb-6">
        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Transaction Successful</h2>
        <p className="text-slate-500 font-medium">Digital Receipt generated for your records</p>
      </div>

      {/* Printable Area */}
      <div 
        ref={receiptRef}
        className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 mb-8 text-left font-mono"
      >
        <div className="text-center mb-4 pb-4 border-b border-slate-200">
          <h3 className="font-bold text-lg text-slate-800">SUVIDHA KIOSK</h3>
          <p className="text-[10px] text-slate-500">Government of Assam Civic Services</p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">REF ID:</span>
            <span className="font-bold text-slate-800">{transactionId}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">DATE:</span>
            <span className="font-bold text-slate-800">{date}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">SERVICE:</span>
            <span className="font-bold text-slate-800">{type}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">USER:</span>
            <span className="font-bold text-slate-800">{userName}</span>
          </div>

          <div className="pt-3 border-t border-slate-200 space-y-2">
            {details.map((detail, index) => (
              <div key={index} className="flex justify-between text-[11px]">
                <span className="text-slate-500">{detail.label}:</span>
                <span className="font-bold text-slate-800 text-right">{detail.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 text-center">
          <p className="text-[10px] text-slate-400 italic">This is a system generated receipt and does not require signature.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all"
        >
          <Printer className="h-5 w-5" /> Print
        </button>
        <button
          className="flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-xl font-bold hover:brightness-110 transition-all"
        >
          <Mail className="h-5 w-5" /> Email
        </button>
      </div>

      <button
        onClick={onClose}
        className="w-full mt-4 py-3 text-slate-500 font-bold hover:text-slate-900 transition-colors"
      >
        Close & Finish
      </button>
    </div>
  );
};

export default Receipt;
