import { LucideIcon } from "lucide-react";

interface ServiceItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick?: () => void;
}

const ServiceItem = ({ icon: Icon, title, description, onClick }: ServiceItemProps) => {
  return (
    <button
      onClick={onClick}
      className="group kiosk-touch-target flex flex-col items-center justify-start text-center h-full rounded-[2.5rem] bg-white border border-white/20 p-8 w-full transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(255,255,255,0.1)] focus:outline-none ring-offset-background"
    >
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-3">
        <Icon className="h-10 w-10" strokeWidth={1.5} />
      </div>
      <div className="flex flex-col gap-3 mt-8 w-full px-4">
        <h4 className="font-black text-slate-900 text-xl leading-tight tracking-tight uppercase group-hover:text-indigo-600 transition-colors">{title}</h4>
        <p className="text-sm text-slate-500 leading-relaxed font-bold tracking-wide">{description}</p>
      </div>
      <div className="mt-6 flex items-center justify-center text-[10px] font-black text-indigo-600/50 uppercase tracking-[0.3em] group-hover:text-indigo-600 transition-colors">
        Click to Start
      </div>
    </button>
  );
};

export default ServiceItem;
