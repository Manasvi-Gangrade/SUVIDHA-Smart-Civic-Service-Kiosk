import ServiceItem from "@/components/ServiceItem";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import QueueToken from "@/components/QueueToken";
import { 
  Zap, Flame, Building2, Droplets, Trash2, FileText, 
  PlusCircle, Receipt, AlertTriangle, Gauge, PlugZap, 
  ShieldAlert, Truck, Phone, CloudSun, Lock, Volume2, 
  ChevronDown, Globe, Search, User, Activity 
} from "lucide-react";
import { DepartmentExtras } from "@/components/DepartmentExtras";

const departmentData: Record<string, {
  title: string;
  icon: any;
  description: string;
  services: { icon: any; title: string; description: string }[];
}> = {
  electricity: {
    title: "Electricity Utility Services",
    icon: Zap,
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
    icon: Flame,
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
    icon: Building2,
    description: "Property tax, civic grievances, and local governance services",
    services: [
      { icon: FileText, title: "Property Tax Information", description: "View property tax details and payment status" },
      { icon: AlertTriangle, title: "Local Grievance Submission", description: "Submit complaints about civic issues" },
      { icon: Phone, title: "Contact Municipal Office", description: "Get helpline numbers and office addresses" },
    ],
  },
  water: {
    title: "Water Supply Services",
    icon: Droplets,
    description: "Water connections, billing, and leakage complaints",
    services: [
      { icon: PlusCircle, title: "New Water Connection", description: "Apply for a new water supply connection" },
      { icon: Receipt, title: "Water Bill Enquiry", description: "View and pay your water supply bills" },
      { icon: AlertTriangle, title: "Leakage Complaint", description: "Report water pipeline leaks and issues" },
    ],
  },
  waste: {
    title: "Waste Management Services",
    icon: Trash2,
    description: "Garbage collection, sanitation, and cleanliness services",
    services: [
      { icon: Truck, title: "Garbage Collection Issues", description: "Report irregular garbage collection" },
      { icon: AlertTriangle, title: "Missed Pickup Reporting", description: "Report missed waste pickup from your area" },
      { icon: ShieldAlert, title: "Sanitation Complaints", description: "Report sanitation and hygiene issues" },
    ],
  },
  property: {
    title: "Property & Tax Services",
    icon: FileText,
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
      <div className="min-h-screen bg-slate-50">
        <div className="container py-20 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Department not found</h2>
        </div>
      </div>
    );
  }

  const Icon = deptData.icon;
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
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      {/* Premium Navigation Header */}
      <header className="bg-[#192e59] text-white py-3 px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center font-black text-indigo-900 shadow-lg">S</div>
          <div>
            <h2 className="text-sm font-black tracking-tight leading-none">SUVIDHA</h2>
            <p className="text-[8px] font-bold text-white/50 uppercase tracking-[0.2em] mt-0.5">Citizen Connect Hub</p>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <div className="hidden md:flex items-center gap-3 pr-6 border-r border-white/10">
            <span className="text-sm font-black">{time}</span>
            <span className="text-[10px] font-bold text-white/50">Thu 30 Apr</span>
            <div className="flex items-center gap-2 ml-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
               <CloudSun className="h-4 w-4 text-orange-400" />
               <span className="text-xs font-bold">32°C</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="bg-white/5 px-4 py-1.5 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest">New Delhi, IN</div>
             <div className="flex items-center gap-3 bg-white/5 px-4 py-1.5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                <Globe className="h-3.5 w-3.5 text-white/60" />
                <span className="text-xs font-black">Select Language</span>
                <ChevronDown className="h-3.5 w-3.5 text-white/40" />
             </div>
             <div className="flex items-center gap-4 ml-2">
                <Volume2 className="h-5 w-5 text-white/60 cursor-pointer hover:text-white" />
                <Lock className="h-5 w-5 text-white/60 cursor-pointer hover:text-white" />
             </div>
          </div>
        </div>
      </header>

      {/* Hero Accent */}
      <div className="h-32 bg-[#192e59]" />

      <div className="container -mt-16 relative z-10">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column: Quick Actions */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-8">
               <span className="h-8 w-1.5 bg-orange-500 rounded-full" />
               <h2 className="text-2xl font-black text-slate-900 tracking-tight">Quick Actions</h2>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 mb-10">
              {deptData.services.map((service, index) => {
                const titleStr = t(`dept.${id}.s${index + 1}`).toLowerCase();
                let route = "/complaint";
                if (titleStr.includes("pay") || titleStr.includes("bill") || titleStr.includes("tax") || titleStr.includes("subsidy")) {
                  route = "/payment";
                } else if (titleStr.includes("new") || titleStr.includes("connection") || titleStr.includes("registration")) {
                  route = "/application";
                }

                return (
                  <div 
                    key={index}
                    onClick={() => {
                      if (service.title === "Load Change Request") {
                        navigate('/load-change');
                        return;
                      }
                      if (service.title === "Meter-Related Complaints") {
                        navigate('/meter-complaint');
                        return;
                      }
                      navigate(route, {
                        state: {
                          category: t(titleKey),
                          service: t(`dept.${id}.s${index + 1}`),
                          description: t(`dept.${id}.s${index + 1}`)
                        }
                      });
                    }}
                    className="flex items-center gap-5 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group hover:-translate-y-1"
                  >
                    <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <service.icon className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 leading-tight">{t(`dept.${id}.s${index + 1}`)}</h4>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{t(`dept.${id}.d${index + 1}`).substring(0, 40)}...</p>
                    </div>
                  </div>
                );
              })}

              <div 
                onClick={() => navigate('/track')}
                className="flex items-center gap-5 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group hover:-translate-y-1"
              >
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Activity className="h-6 w-6 text-indigo-500" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 leading-tight">Track Requests</h4>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">STATUS OF APPLICATIONS & COMPLAINTS</p>
                </div>
              </div>

              <div 
                onClick={() => navigate('/profile')}
                className="flex items-center gap-5 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group hover:-translate-y-1"
              >
                <div className="h-12 w-12 rounded-2xl bg-teal-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <User className="h-6 w-6 text-teal-500" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 leading-tight">Update Profile</h4>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">MANAGE PERSONAL DETAILS</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                <DepartmentExtras departmentId={id || ""} />
            </div>
          </div>

          {/* Right Column: Support Widgets */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight">Walk-in Services</h3>
              <p className="text-xs text-slate-400 mb-8 font-bold leading-relaxed">
                Visiting the office? Generate a digital token to skip the manual queue.
              </p>
              {!token ? (
                <button
                  onClick={handleGetToken}
                  className="w-full rounded-2xl bg-[#192e59] py-4 font-black text-white hover:bg-indigo-900 transition-all shadow-lg active:scale-95 uppercase tracking-widest text-sm"
                >
                  Get Digital Token
                </button>
              ) : (
                <QueueToken token={token} waitTime="10-15 mins" />
              )}
            </div>

            <div className="bg-[#f1f3f7] rounded-[2.5rem] p-8 border border-slate-100">
              <h4 className="text-base font-black text-slate-900 mb-2 uppercase tracking-tight">Need Help?</h4>
              <p className="text-xs text-slate-500 font-bold leading-relaxed">
                Call our helpline for immediate assistance with related issues.
              </p>
              <div className="mt-8 flex items-center gap-4 text-[#192e59] font-black text-xl">
                 <Phone className="h-6 w-6" />
                 <span className="tracking-tighter">1800-200-1234</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating SOS */}
      <button className="fixed bottom-8 left-8 bg-rose-500 text-white px-8 py-4 rounded-full font-black flex items-center gap-3 shadow-2xl hover:scale-105 active:scale-95 transition-all z-50">
         <AlertTriangle className="h-5 w-5" />
         SOS
      </button>

      {/* Accessibility Fab */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-50">
         <button className="h-14 w-14 bg-indigo-600 rounded-full flex items-center justify-center shadow-2xl text-white">
            <Search className="h-6 w-6" />
         </button>
      </div>
    </div>
  );
};

export default DepartmentPage;
