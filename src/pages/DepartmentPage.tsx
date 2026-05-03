import ServiceItem from "@/components/ServiceItem";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import QueueToken from "@/components/QueueToken";
import { 
  PlusCircle, Receipt, AlertTriangle, Gauge, PlugZap, 
  ShieldAlert, Truck, Phone, CloudSun, Lock, Globe, ChevronRight, Building2, FileText
} from "lucide-react";
import { DepartmentExtras } from "@/components/DepartmentExtras";

const departmentData: Record<string, {
  title: string;
  icon: string;
  description: string;
  services: { icon: any; title: string; description: string }[];
}> = {
  electricity: {
    title: "Electricity Utility Services",
    icon: "/images/electricity (2).png",
    description: "Manage your electricity connections, bills, and report issues",
    services: [
      { icon: PlusCircle, title: "New Electricity Connection", description: "Apply for a new domestic or commercial electricity connection" },
      { icon: Receipt, title: "Bill Viewing & Payment", description: "View your current bill and get payment redirection" },
      { icon: Gauge, title: "Meter-Related Complaints", description: "Report faulty meters, meter reading disputes" },
      { icon: AlertTriangle, title: "Power Outage Reporting", description: "Report power cuts and outages in your area" },
      { icon: PlugZap, title: "Load Change Request", description: "Request increase or decrease in sanctioned load" },
    ],
  },
  gas: {
    title: "Gas Distribution Services",
    icon: "/images/gas.png",
    description: "Gas connections, cylinder booking, and safety services",
    services: [
      { icon: PlusCircle, title: "New Gas Connection", description: "Apply for a new LPG gas connection" },
      { icon: Truck, title: "Cylinder Booking Assistance", description: "Book refill cylinders and track delivery" },
      { icon: ShieldAlert, title: "Leakage & Safety Complaints", description: "Report gas leaks and safety hazards" },
      { icon: Receipt, title: "Subsidy Status Enquiry", description: "Check your LPG subsidy credit status" },
    ],
  },
  municipal: {
    title: "Municipal Corporation Services",
    icon: "/images/municipal.png",
    description: "Property tax, civic grievances, and local governance services",
    services: [
      { icon: FileText, title: "Property Tax Information", description: "View property tax details and payment status" },
      { icon: AlertTriangle, title: "Local Grievance Submission", description: "Submit complaints about civic issues" },
      { icon: Phone, title: "Contact Municipal Office", description: "Get helpline numbers and office addresses" },
    ],
  },
  water: {
    title: "Water Supply Services",
    icon: "/images/water.png",
    description: "Water connections, billing, and leakage complaints",
    services: [
      { icon: PlusCircle, title: "New Water Connection", description: "Apply for a new water supply connection" },
      { icon: Receipt, title: "Water Bill Enquiry", description: "View and pay your water supply bills" },
      { icon: AlertTriangle, title: "Leakage Complaint", description: "Report water pipeline leaks and issues" },
    ],
  },
  waste: {
    title: "Waste Management Services",
    icon: "/images/waste.png",
    description: "Garbage collection, sanitation, and cleanliness services",
    services: [
      { icon: Truck, title: "Garbage Collection Issues", description: "Report irregular garbage collection" },
      { icon: AlertTriangle, title: "Missed Pickup Reporting", description: "Report missed waste pickup from your area" },
      { icon: ShieldAlert, title: "Sanitation Complaints", description: "Report sanitation and hygiene issues" },
    ],
  },
  property: {
    title: "Property & Tax Services",
    icon: "/images/property.png",
    description: "Property assessment, tax payments, and related services",
    services: [
      { icon: Receipt, title: "Property Tax Payment", description: "Pay your property tax online" },
      { icon: FileText, title: "Assessment Details", description: "View your property assessment information" },
      { icon: PlusCircle, title: "New Property Registration", description: "Register a new property with municipal records" },
    ],
  },
};

const DepartmentPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [token, setToken] = useState<string | null>(null);
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const deptData = departmentData[id || ""];

  if (!deptData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <h2 className="text-2xl font-bold text-slate-900">Department not found</h2>
      </div>
    );
  }

  // Determine theme color based on department
  const themeColor = id === 'electricity' ? 'amber' : 
                    id === 'water' ? 'blue' : 
                    id === 'gas' ? 'orange' : 
                    id === 'municipal' ? 'teal' : 
                    id === 'waste' ? 'emerald' : 'indigo';

  const titleKey = `dept.${id}.title`;

  const handleGetToken = () => {
    const deptPrefix = t(titleKey).substring(0, 1).toUpperCase() || id?.substring(0, 1).toUpperCase();
    const newToken = `${deptPrefix}-${Math.floor(Math.random() * 900 + 100)}`;
    setToken(newToken);
    setTimeout(() => {
      navigate(`/queue?token=${newToken}&dept=${encodeURIComponent(t(titleKey))}`);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 font-sans relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#192e59 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {/* Premium Navigation Header */}
      <header className="bg-[#192e59] text-white py-3 px-8 flex items-center justify-between sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
          <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center font-black text-[#192e59] shadow-md text-xs">S</div>
          <div>
            <h2 className="text-base font-black tracking-tighter leading-none">SUVIDHA</h2>
            <p className="text-[7px] font-bold text-white/40 uppercase tracking-[0.2em]">Smart City Kiosk</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-3 pr-6 border-r border-white/10">
            <span className="text-xs font-black">{time}</span>
            <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
              <CloudSun className="h-4 w-4 text-amber-400" />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-xl border border-white/10">
                <Globe className="h-3 w-3 text-white/60" />
                <span className="text-[10px] font-black uppercase tracking-wider">English</span>
             </div>
             <button onClick={() => navigate('/')} className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                <Lock className="h-4 w-4 text-white/80" />
             </button>
          </div>
        </div>
      </header>

      {/* Hero Banner Area - More Compact */}
      <div className={`h-40 bg-gradient-to-br from-[#192e59] to-[#243e75] relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <div className="container h-full flex flex-col justify-center">
             <div className="flex items-center gap-5 animate-in slide-in-from-left-4 duration-500">
                <div className={`h-16 w-16 rounded-2xl bg-white flex items-center justify-center shadow-xl`}>
                   <img src={deptData.icon} alt={deptData.title} className="h-10 w-10 object-contain" />
                </div>
                <div>
                   <h1 className="text-3xl font-black text-white tracking-tighter leading-none mb-1">
                      {t(titleKey)}
                   </h1>
                   <p className="text-white/50 font-bold text-[10px] max-w-lg uppercase tracking-widest">
                      {deptData.description}
                   </p>
                </div>
             </div>
          </div>
      </div>

      <div className="container -mt-8 relative z-10">
        <div className="grid gap-6 lg:grid-cols-4">
          
          {/* Main Services Area - 3/4 Width */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white shadow-xl shadow-slate-200/40">
              <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-6 bg-${themeColor}-500 rounded-full`} />
                    <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">Services</h2>
                 </div>
              </div>
              
              <div className="space-y-3">
                {deptData.services.map((service, index) => {
                  const titleStr = t(`dept.${id}.s${index + 1}`).toLowerCase();
                  let route = "/complaint";
                  if (titleStr.includes("pay") || titleStr.includes("bill") || titleStr.includes("tax") || titleStr.includes("subsidy")) {
                    route = "/payment";
                  } else if (titleStr.includes("new") || titleStr.includes("connection") || titleStr.includes("registration")) {
                    route = "/application";
                  }

                  return (
                    <button 
                      key={index}
                      onClick={() => navigate(route, {
                        state: {
                          category: t(titleKey),
                          service: t(`dept.${id}.s${index + 1}`),
                          description: t(`dept.${id}.s${index + 1}`)
                        }
                      })}
                      className="w-full flex items-center justify-between p-4 bg-white/60 hover:bg-white border border-slate-100 hover:border-indigo-300 rounded-2xl transition-all group shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <service.icon className={`h-5 w-5 text-${themeColor}-600`} />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors uppercase">
                            {t(`dept.${id}.s${index + 1}`)}
                          </h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                            Standard Service
                          </p>
                        </div>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1">
                         <ChevronRight className="h-4 w-4 text-indigo-600" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white shadow-xl shadow-slate-200/40">
                <DepartmentExtras departmentId={id || ""} />
            </div>
          </div>

          {/* Right Support Sidebar - 1/4 Width */}
          <div className="space-y-6">
            {/* Token Widget */}
            <div className="bg-white rounded-3xl border border-white p-6 shadow-xl shadow-slate-200/40 group">
              <h3 className="text-sm font-black text-slate-900 mb-2 tracking-tighter uppercase">Walk-in</h3>
              <p className="text-[9px] text-slate-400 mb-6 font-bold leading-relaxed uppercase tracking-wider">
                Generate token for office visits.
              </p>
              {!token ? (
                <button
                  onClick={handleGetToken}
                  className={`w-full rounded-xl bg-[#192e59] py-3 font-black text-white hover:bg-indigo-900 transition-all active:scale-95 uppercase tracking-widest text-[10px] shadow-lg`}
                >
                  Get Token
                </button>
              ) : (
                <QueueToken token={token} waitTime="10-15 mins" />
              )}
            </div>

            {/* Helpline Widget */}
            <div className="bg-[#192e59] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
               <div className="absolute bottom-0 right-0 opacity-5"><Building2 className="h-20 w-20" /></div>
               <h4 className="text-[9px] font-black uppercase tracking-[0.2em] mb-3 text-white/40">Helpline</h4>
               <div className="flex items-center gap-3 py-3 px-4 bg-white/5 rounded-xl border border-white/5 group cursor-pointer hover:bg-white/10">
                  <Phone className="h-4 w-4 text-amber-400" />
                  <span className="text-base font-black tracking-tighter">1800-200-1234</span>
               </div>
            </div>

            {/* Safety/Alert Widget */}
            <div className="bg-rose-50 rounded-3xl p-5 border border-rose-100 flex items-center gap-4">
                <div className="h-10 w-10 bg-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                   <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <div>
                   <h4 className="text-[10px] font-black text-rose-900 uppercase">Emergency</h4>
                   <p className="text-[8px] font-bold text-rose-500 uppercase tracking-widest">Call SOS</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentPage;
