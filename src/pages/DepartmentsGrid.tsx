import { useNavigate } from "react-router-dom";
import { Zap, Flame, Building2, Droplets, Trash2, FileText, ArrowLeft } from "lucide-react";
import DepartmentCard from "@/components/DepartmentCard";

const allDepartments = [
  {
    icon: Zap,
    title: "Electricity Board",
    description: "Report power outages, pay bills, and request new connections.",
    path: "/auth/electricity",
    color: "saffron" as const,
    serviceCount: 5,
    status: "Online" as const,
  },
  {
    icon: Flame,
    title: "Gas Distribution",
    description: "Book cylinders, report leakage, and check subsidies.",
    path: "/auth/gas",
    color: "navy" as const,
    serviceCount: 4,
    status: "Online" as const,
  },
  {
    icon: Building2,
    title: "Municipal Corp.",
    description: "Civic grievances, contact officials, and local ward info.",
    path: "/auth/municipal",
    color: "teal" as const,
    serviceCount: 3,
    status: "High Load" as const,
  },
  {
    icon: Droplets,
    title: "Water Supply",
    description: "New connections, water tanker booking, and leakage reporting.",
    path: "/auth/water",
    color: "green" as const,
    serviceCount: 3,
    status: "Online" as const,
  },
  {
    icon: Trash2,
    title: "Waste Management",
    description: "Garbage pickup schedules, sanitation, and cleanliness tracking.",
    path: "/auth/waste",
    color: "saffron" as const,
    serviceCount: 3,
    status: "Online" as const,
  },
  {
    icon: FileText,
    title: "Property & Tax",
    description: "Property tax assessment, registration, and secure payment.",
    path: "/auth/property",
    color: "navy" as const,
    serviceCount: 3,
    status: "Online" as const,
  },
];



const DepartmentsGrid = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-10 relative overflow-hidden">
      {/* Header Section */}
      <div className="mb-12 animate-slide-up">
        <h1 className="text-4xl font-[1000] text-[#192e59] tracking-tighter uppercase mb-2">Service Directory</h1>
        <p className="text-slate-400 font-black text-xs uppercase tracking-[0.3em]">Select a department to proceed</p>
      </div>

      {/* Floating Back Button */}
      <button
        onClick={() => navigate("/")}
        className="kiosk-touch-target absolute top-10 right-10 z-50 flex items-center gap-2 bg-[#192e59] border border-white/10 hover:bg-indigo-900 px-6 py-3 rounded-2xl text-xs font-black text-white transition-all shadow-xl uppercase tracking-widest"
      >
        <ArrowLeft className="w-4 h-4" />
        BACK HOME
      </button>

      <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-8 mt-8 relative z-10">
        {allDepartments.map((dept, idx) => (
          <div key={dept.title} className="animate-slide-up" style={{ animationDelay: `${0.05 * idx}s` }}>
            <DepartmentCard
              icon={dept.icon}
              title={dept.title}
              description={dept.description}
              path={dept.path}
              color={dept.color}
              serviceCount={dept.serviceCount}
              status={dept.status}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentsGrid;
