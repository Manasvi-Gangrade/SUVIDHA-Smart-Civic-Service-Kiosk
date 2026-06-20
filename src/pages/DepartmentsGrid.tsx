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
    colorClass: "bg-[#FFA500]",
    shadowClass: "shadow-[0_0_15px_rgba(255,165,0,0.3)] hover:shadow-[0_0_25px_rgba(255,165,0,0.55)]",
  },
  {
    icon: Flame,
    label: "Gas",
    path: "/department/gas",
    colorClass: "bg-[#FF4500]",
    shadowClass: "shadow-[0_0_15px_rgba(255,69,0,0.3)] hover:shadow-[0_0_25px_rgba(255,69,0,0.55)]",
  },
  {
    icon: Landmark,
    label: "Municipal",
    path: "/department/municipal",
    colorClass: "bg-[#4CAF50]",
    shadowClass: "shadow-[0_0_15px_rgba(76,175,80,0.3)] hover:shadow-[0_0_25px_rgba(76,175,80,0.55)]",
  },
  {
    icon: Droplet,
    label: "Water",
    path: "/department/water",
    colorClass: "bg-[#2196F3]",
    shadowClass: "shadow-[0_0_15px_rgba(33,150,243,0.3)] hover:shadow-[0_0_25px_rgba(33,150,243,0.55)]",
  },
  {
    icon: Trash2,
    label: "Sanitation",
    path: "/department/waste",
    colorClass: "bg-[#2ECC71]",
    shadowClass: "shadow-[0_0_15px_rgba(46,204,113,0.3)] hover:shadow-[0_0_25px_rgba(46,204,113,0.55)]",
  },
  {
    icon: FileText,
    label: "Property",
    path: "/department/property",
    colorClass: "bg-[#607D8B]",
    shadowClass: "shadow-[0_0_15px_rgba(96,125,139,0.3)] hover:shadow-[0_0_25px_rgba(96,125,139,0.55)]",
  },
];

const DepartmentsGrid = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full bg-[#192e59] flex flex-col p-6 lg:p-10 pb-28 lg:pb-32 justify-between gap-8 relative overflow-y-auto custom-scrollbar">
      
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
      <div className="mb-2 mt-2 flex justify-center animate-slide-up relative z-10 w-full text-center shrink-0">
        <h1 className="text-[2.2rem] lg:text-[2.8rem] font-[900] tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-[#e2e8f0] to-[#94a3b8] drop-shadow-2xl uppercase">
          Select a department to proceed
        </h1>
      </div>

      {/* Floating Back Button */}
      <button
        onClick={() => navigate("/")}
        className="kiosk-touch-target absolute top-6 left-8 z-50 flex items-center gap-2 px-6 py-3.5 bg-[#FD8008] hover:bg-[#e67000] text-white border border-[#FD8008]/20 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95 duration-200 group shadow-[0_4px_12px_rgba(253,128,8,0.3)]"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span>BACK HOME</span>
      </button>

      {/* 🚀 QUICK LAUNCH CATEGORY TABS */}
      <div className="mb-4 flex justify-center items-center gap-8 lg:gap-14 overflow-x-auto overflow-y-hidden py-3 px-6 z-10 w-full animate-slide-up no-scrollbar shrink-0">
        {quickTabs.map((tab, idx) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.label}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center gap-4 group focus:outline-none shrink-0"
              style={{ animationDelay: `${0.03 * idx}s` }}
            >
              {/* Circular Icon Plate */}
              <div className={`h-20 w-20 lg:h-[5.5rem] lg:w-[5.5rem] rounded-full flex items-center justify-center text-white border border-white/15 transition-all duration-300 group-hover:scale-110 group-active:scale-95 ${tab.colorClass} ${tab.shadowClass}`}>
                <TabIcon className="w-9 h-9 lg:w-11 lg:h-11 transition-transform duration-300 group-hover:rotate-12" strokeWidth={2.5} />
              </div>
              
              {/* Text Label */}
              <span className="text-[11px] lg:text-[13px] font-black text-slate-200 group-hover:text-white uppercase tracking-widest transition-colors">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* 📑 SLEEK GLOWING SUBHEADING */}
      <div className="mt-6 mb-2 flex justify-center items-center relative z-10 w-full text-center animate-slide-up shrink-0 select-none">
        <h2 className="text-[16px] lg:text-[20px] font-[900] tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-br from-white via-[#e2e8f0] to-[#94a3b8] drop-shadow-2xl uppercase">
          Department Features & Active Services
        </h2>
      </div>

      {/* 🎬 DYNAMIC INF-SCROLL CINEMATIC MARQUEE FOR SQUARE DEPT CARDS (LANDSCAPE ONLY) */}
      <div className="relative w-full overflow-hidden py-6 z-10 animate-slide-up shrink-0 pb-10 show-landscape items-center justify-center">
        {/* Soft edge blur masks for premium transitions */}
        <div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-[#192e59] via-[#192e59]/75 to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-[#192e59] via-[#192e59]/75 to-transparent z-20 pointer-events-none" />
        
        {/* Scrolling Marquee Container */}
        <div className="flex w-max animate-cards-marquee items-center relative -top-3">
          {[...allDepartments, ...allDepartments, ...allDepartments].map((dept, idx) => (
            <div 
              key={`${dept.title}-${idx}`} 
              className="w-[18rem] lg:w-[22rem] xl:w-[26rem] shrink-0 mr-8 lg:mr-10"
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
