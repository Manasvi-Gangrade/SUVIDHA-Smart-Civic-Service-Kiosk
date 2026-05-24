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
    <div className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-xl border border-slate-100 animate-in fade-in zoom-in duration-300 flex flex-col">
      <div className="flex justify-center mb-3 flex-shrink-0">
        <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
      </div>

      <div className="text-center mb-4 flex-shrink-0">
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Receipt Generated</h2>
        <p className="text-[10px] text-slate-500 font-medium">Digital transaction confirmation</p>
      </div>

      {/* Printable Area - Scrollable internally if too many details */}
      <div 
        ref={receiptRef}
        className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-4 mb-4 text-left font-mono overflow-y-auto max-h-[220px] custom-scrollbar"
      >
        <div className="text-center mb-3 pb-3 border-b border-slate-200">
          <h3 className="font-bold text-sm text-slate-800">SUVIDHA KIOSK</h3>
          <p className="text-[9px] text-slate-500">Government of Assam Civic Services</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-500">REF ID:</span>
            <span className="font-bold text-slate-800">{transactionId}</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-500">DATE:</span>
            <span className="font-bold text-slate-800">{date}</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-500">SERVICE:</span>
            <span className="font-bold text-slate-800 truncate max-w-[150px]" title={type}>{type}</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-500">USER:</span>
            <span className="font-bold text-slate-800 truncate max-w-[150px]">{userName}</span>
          </div>

          <div className="pt-2 border-t border-slate-200 space-y-1.5">
            {details.map((detail, index) => (
              <div key={index} className="flex justify-between text-[10px]">
                <span className="text-slate-500">{detail.label}:</span>
                <span className="font-bold text-slate-800 text-right truncate max-w-[150px]" title={detail.value}>{detail.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-200 text-center">
          <p className="text-[9px] text-slate-400 italic">System generated receipt. No signature required.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 flex-shrink-0">
        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-1.5 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all text-xs uppercase tracking-wider"
        >
          <Printer className="h-4 w-4" /> Print
        </button>
        <button
          className="flex items-center justify-center gap-1.5 bg-[#FD8008] text-white py-3 rounded-xl font-bold hover:bg-[#e67300] transition-all text-xs uppercase tracking-wider"
        >
          <Mail className="h-4 w-4" /> Email
        </button>
      </div>

      <button
        onClick={onClose}
        className="w-full mt-3 py-2 text-slate-400 font-bold hover:text-slate-600 transition-colors text-xs uppercase tracking-wider"
      >
        Close & Finish
      </button>
    </div>
  );
};

export default Receipt;
