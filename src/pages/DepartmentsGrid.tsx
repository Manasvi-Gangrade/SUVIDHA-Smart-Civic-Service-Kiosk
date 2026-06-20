import { useNavigate } from "react-router-dom";
import { ArrowLeft, Zap, Flame, Landmark, Droplet, Trash2, FileText } from "lucide-react";
import DepartmentCard from "@/components/DepartmentCard";

const allDepartments = [
  {
    icon: "/images/electricity (2).png",
    title: "Electricity Board",
    description: "Report power outages, pay bills, and request new connections.",
    path: "/department/electricity", // Reverted to /department/:id to show services first!
    color: "saffron" as const,
    serviceCount: 5,
    status: "Online" as const,
    features: ["Instant Bill Pay", "New Connection", "Outage Report", "Bill Calculator"],
  },
  {
    icon: "/images/gas.png",
    title: "Gas Distribution",
    description: "Book cylinders, report leakage, and check subsidies.",
    path: "/department/gas", // Reverted to /department/:id to show services first!
    color: "rose" as const,
    serviceCount: 4,
    status: "Online" as const,
    features: ["Cylinder Booking", "Leakage Report", "Gas Subsidies", "Distributor Find"],
  },
  {
    icon: "/images/municipal.png",
    title: "Municipal Corp.",
    description: "Civic grievances, contact officials, and local ward info.",
    path: "/department/municipal", // Reverted to /department/:id to show services first!
    color: "teal" as const,
    serviceCount: 3,
    status: "High Load" as const,
    features: ["Civic Grievance", "Birth & Death Cert", "Trade License", "Ward Directory"],
  },
  {
    icon: "/images/water.png",
    title: "Water Supply",
    description: "New connections, water tanker booking, and leakage reporting.",
    path: "/department/water", // Reverted to /department/:id to show services first!
    color: "blue" as const,
    serviceCount: 3,
    status: "Online" as const,
    features: ["New Pipeline", "Water Tanker Book", "Leakage Complaint", "Usage Billing"],
  },
  {
    icon: "/images/waste.png",
    title: "Waste Management",
    description: "Garbage pickup schedules, sanitation, and cleanliness tracking.",
    path: "/department/waste", // Reverted to /department/:id to show services first!
    color: "green" as const,
    serviceCount: 3,
    status: "Online" as const,
    features: ["Garbage Schedule", "Report Littering", "Sewage Request", "Recycle Portal"],
  },
  {
    icon: "/images/property.png",
    title: "Property & Tax",
    description: "Report property tax, registration, and secure payment.",
    path: "/department/property", // Reverted to /department/:id to show services first!
    color: "indigo" as const,
    serviceCount: 3,
    status: "Online" as const,
    features: ["Property Tax Pay", "Title Registration", "Deed Verification", "Tax Calculator"],
  },
];

const quickTabs = [
  {
    icon: Zap,
    label: "Electricity",
    path: "/department/electricity",
    colorClass: "bg-[#FF9933]",
    shadowClass: "shadow-[0_0_15px_rgba(255,153,51,0.3)] hover:shadow-[0_0_25px_rgba(255,153,51,0.55)]",
  },
  {
    icon: Flame,
    label: "Gas",
    path: "/department/gas",
    colorClass: "bg-[#E3000F]",
    shadowClass: "shadow-[0_0_15px_rgba(227,0,15,0.3)] hover:shadow-[0_0_25px_rgba(227,0,15,0.55)]",
  },
  {
    icon: Landmark,
    label: "Municipal",
    path: "/department/municipal",
    colorClass: "bg-[#008080]",
    shadowClass: "shadow-[0_0_15px_rgba(0,128,128,0.3)] hover:shadow-[0_0_25px_rgba(0,128,128,0.55)]",
  },
  {
    icon: Droplet,
    label: "Water",
    path: "/department/water",
    colorClass: "bg-[#0066FF]",
    shadowClass: "shadow-[0_0_15px_rgba(0,102,255,0.3)] hover:shadow-[0_0_25px_rgba(0,102,255,0.55)]",
  },
  {
    icon: Trash2,
    label: "Sanitation",
    path: "/department/waste",
    colorClass: "bg-[#138808]",
    shadowClass: "shadow-[0_0_15px_rgba(19,136,8,0.3)] hover:shadow-[0_0_25px_rgba(19,136,8,0.55)]",
  },
  {
    icon: FileText,
    label: "Property",
    path: "/department/property",
    colorClass: "bg-[#4F46E5]",
    shadowClass: "shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.55)]",
  },
];

const DepartmentsGrid = () => {
  const navigate = useNavigate();

  return (
    <div className="h-[calc(100vh-64px)] bg-[#192e59] flex flex-col p-4 lg:p-6 pb-28 lg:pb-32 justify-start gap-4 relative overflow-y-auto custom-scrollbar">
      
      {/* BACKGROUND VIDEO */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-20"
        >
          <source src="/videos/14904045_3840_2160_30fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#192e59]/45 via-[#192e59]/25 to-[#192e59]/75" />
      </div>

      {/* Header Section */}
      <div className="mb-1 mt-1 flex justify-center animate-slide-up relative z-10 w-full text-center shrink-0">
        <h1 className="text-[1.75rem] lg:text-[2rem] font-[900] tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-[#e2e8f0] to-[#94a3b8] drop-shadow-2xl uppercase">
          Select a department to proceed
        </h1>
      </div>

      {/* Floating Back Button */}
      <button
        onClick={() => navigate("/")}
        className="kiosk-touch-target absolute top-4 right-6 z-50 flex items-center gap-2 px-5 py-2.5 bg-[#FD8008] hover:bg-[#e67000] text-white border border-[#FD8008]/20 rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 duration-200 group shadow-[0_4px_12px_rgba(253,128,8,0.3)]"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>BACK HOME</span>
      </button>

      {/* 🚀 QUICK LAUNCH CATEGORY TABS */}
      <div className="mb-2 flex justify-center items-center gap-5 lg:gap-10 overflow-x-auto overflow-y-hidden py-2 px-4 z-10 w-full animate-slide-up no-scrollbar shrink-0">
        {quickTabs.map((tab, idx) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.label}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center gap-3 group focus:outline-none shrink-0"
              style={{ animationDelay: `${0.03 * idx}s` }}
            >
              {/* Circular Icon Plate */}
              <div className={`h-16 w-16 lg:h-[4.75rem] lg:w-[4.75rem] rounded-full flex items-center justify-center text-white border border-white/15 transition-all duration-300 group-hover:scale-110 group-active:scale-95 ${tab.colorClass} ${tab.shadowClass}`}>
                <TabIcon className="w-7 h-7 lg:w-9 lg:h-9 transition-transform duration-300 group-hover:rotate-12" strokeWidth={2.5} />
              </div>
              
              {/* Text Label */}
              <span className="text-[9px] lg:text-[10px] font-black text-slate-300 group-hover:text-white uppercase tracking-widest transition-colors">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* 📑 SLEEK GLOWING SUBHEADING */}
      <div className="mt-4 mb-1 flex justify-center items-center relative z-10 w-full text-center animate-slide-up shrink-0 select-none">
        <h2 className="text-[13px] lg:text-[15px] font-[900] tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-br from-white via-[#e2e8f0] to-[#94a3b8] drop-shadow-2xl uppercase">
          Department Features & Active Services
        </h2>
      </div>

      {/* 🎬 DYNAMIC INF-SCROLL CINEMATIC MARQUEE FOR SQUARE DEPT CARDS (LANDSCAPE ONLY) */}
      <div className="relative w-full overflow-hidden py-4 z-10 animate-slide-up shrink-0 pb-8 show-landscape items-center justify-center">
        {/* Soft edge blur masks for premium transitions */}
        <div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-[#192e59] via-[#192e59]/75 to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-[#192e59] via-[#192e59]/75 to-transparent z-20 pointer-events-none" />
        
        {/* Scrolling Marquee Container */}
        <div className="flex w-max animate-cards-marquee items-center relative -top-3">
          {[...allDepartments, ...allDepartments, ...allDepartments].map((dept, idx) => (
            <div 
              key={`${dept.title}-${idx}`} 
              className="w-[13.5rem] lg:w-[16.5rem] xl:w-[18.5rem] shrink-0 mr-6 lg:mr-8"
            >
              <DepartmentCard
                icon={dept.icon}
                title={dept.title}
                description={dept.description}
                path={dept.path}
                color={dept.color}
                serviceCount={dept.serviceCount}
                status={dept.status}
                features={dept.features}
              />
            </div>
          ))}
        </div>

        {/* CSS: Majestic 55s infinite repeat coordinates */}
        <style>{`
          @keyframes cardsMarquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.3333%); }
          }
          .animate-cards-marquee {
            animation: cardsMarquee 55s linear infinite;
          }
          .animate-cards-marquee:hover {
            animation-play-state: paused;
          }
        `}</style>
      </div>

      {/* 🏛️ PORTRAIT VIEWPORT: STATIC 2x3 GRID OF CARDS (Centered & Fully Tappable) */}
      <div className="grid-portrait grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-5xl px-6 z-10 animate-slide-up pb-24 justify-items-center mx-auto items-start mt-4">
        {allDepartments.map((dept, idx) => (
          <div key={`p-${dept.title}-${idx}`} className="w-full max-w-[340px] transition-transform duration-300 hover:scale-105">
            <DepartmentCard
              icon={dept.icon}
              title={dept.title}
              description={dept.description}
              path={dept.path}
              color={dept.color}
              serviceCount={dept.serviceCount}
              status={dept.status}
              features={dept.features}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentsGrid;
