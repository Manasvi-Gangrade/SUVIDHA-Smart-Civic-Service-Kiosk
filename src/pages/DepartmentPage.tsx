import ServiceItem from "@/components/ServiceItem";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { 
  PlusCircle, Receipt, AlertTriangle, Gauge, PlugZap, 
  ShieldAlert, Truck, Phone, ArrowLeft, Building2, ChevronRight, FileText
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

// 🏛️ DYNAMIC THEME PALETTE RESOLVER
const themeColors: Record<
  string,
  {
    primary: string;
    gradientFrom: string;
    gradientTo: string;
    lightBg: string;
    iconBg: string;
    borderFocus: string;
    video: string;
    marqueeImages: string[];
  }
> = {
  electricity: {
    primary: "#FF9933",
    gradientFrom: "from-[#FF9933]",
    gradientTo: "to-[#cc7a29]",
    lightBg: "bg-amber-50",
    iconBg: "bg-[#FF9933]/10 text-[#FF9933]",
    borderFocus: "focus:border-[#FF9933] focus:ring-[#FF9933]/15",
    video: "/videos/electricity.mp4",
    marqueeImages: [
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1548549303-7cfbbd5e7146?w=600&auto=format&fit=crop&q=80"
    ]
  },
  gas: {
    primary: "#E3000F",
    gradientFrom: "from-[#E3000F]",
    gradientTo: "to-[#b3000c]",
    lightBg: "bg-red-50",
    iconBg: "bg-[#E3000F]/10 text-[#E3000F]",
    borderFocus: "focus:border-[#E3000F] focus:ring-[#E3000F]/15",
    video: "/videos/gas.mp4",
    marqueeImages: [
      "https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1526253038957-bbe54e05968e?w=600&auto=format&fit=crop&q=80"
    ]
  },
  municipal: {
    primary: "#008080",
    gradientFrom: "from-[#008080]",
    gradientTo: "to-[#005c5c]",
    lightBg: "bg-teal-50",
    iconBg: "bg-[#008080]/10 text-[#008080]",
    borderFocus: "focus:border-[#008080] focus:ring-[#008080]/15",
    video: "/videos/Municipal.mp4",
    marqueeImages: [
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80"
    ]
  },
  water: {
    primary: "#0066FF",
    gradientFrom: "from-[#0066FF]",
    gradientTo: "to-[#0052cc]",
    lightBg: "bg-blue-50",
    iconBg: "bg-[#0066FF]/10 text-[#0066FF]",
    borderFocus: "focus:border-[#0066FF] focus:ring-[#0066FF]/15",
    video: "/videos/Water.mp4",
    marqueeImages: [
      "https://images.unsplash.com/photo-1581093588401-f3c22d75ba21?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1548826873-e82943e248b5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1488330890490-c408188e25da?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?w=600&auto=format&fit=crop&q=80"
    ]
  },
  waste: {
    primary: "#138808",
    gradientFrom: "from-[#138808]",
    gradientTo: "to-[#0f6c06]",
    lightBg: "bg-emerald-50",
    iconBg: "bg-[#138808]/10 text-[#138808]",
    borderFocus: "focus:border-[#138808] focus:ring-[#138808]/15",
    video: "/videos/Waste Management.mp4",
    marqueeImages: [
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1605600611283-cdeb34440c9c?w=600&auto=format&fit=crop&q=80"
    ]
  },
  property: {
    primary: "#4F46E5",
    gradientFrom: "from-[#4F46E5]",
    gradientTo: "to-[#3b32c4]",
    lightBg: "bg-indigo-50",
    iconBg: "bg-[#4F46E5]/10 text-[#4F46E5]",
    borderFocus: "focus:border-[#4F46E5] focus:ring-[#4F46E5]/15",
    video: "/videos/Property.mp4",
    marqueeImages: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80"
    ]
  },
};

// 🌈 MULTI-COLOR SOLID VIBRANT THEMES FOR EACH SQUARE ACCORDING TO REFERENCE LAYOUT!
const squareColors = [
  "bg-[#FF9933] shadow-[#FF9933]/20 hover:shadow-[#FF9933]/40", // saffron gold
  "bg-[#0066FF] shadow-[#0066FF]/20 hover:shadow-[#0066FF]/40", // royal blue
  "bg-[#138808] shadow-[#138808]/20 hover:shadow-[#138808]/40", // forest green
  "bg-[#E3000F] shadow-[#E3000F]/20 hover:shadow-[#E3000F]/40", // red
  "bg-[#8B5CF6] shadow-[#8B5CF6]/20 hover:shadow-[#8B5CF6]/40", // purple
  "bg-[#008080] shadow-[#008080]/20 hover:shadow-[#008080]/40", // teal
];

const DepartmentPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const deptData = departmentData[id || ""];

  if (!deptData) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <h2 className="text-2xl font-bold text-slate-800">Department not found</h2>
      </div>
    );
  }

  const theme = themeColors[id || ""] || themeColors.property;
  const titleKey = `dept.${id}.title`;

  return (
    <div className="h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar font-display relative flex flex-col justify-between bg-[#192e59] text-white pb-32">
      
      {/* 🎥 THE UNIFIED BACKGROUND BACKGROUND VIDEO FOR DEPARTMENT PAGE */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          key="/videos/14904045_3840_2160_30fps.mp4"
          src="/videos/14904045_3840_2160_30fps.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#192e59]/45 via-[#192e59]/25 to-[#192e59]/75" />
      </div>

      {/* Background Dotted Canvas Pattern */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }} />

      <div className="relative z-10 w-full">
        
        {/* 🏛️ FLOATING COMPACT TOP BACK ACTION DECK */}
        <div className="w-full px-[5%] pt-2 pb-0 flex justify-end shrink-0 relative z-50 max-w-none">
          <button
            onClick={() => navigate('/departments')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#FD8008] hover:bg-[#e67000] text-white border border-[#FD8008]/20 rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 duration-200 group shadow-[0_4px_12px_rgba(253,128,8,0.3)]"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Grid</span>
          </button>
        </div>

        {/* 🏛️ 2. CENTERED MAJESTIC DEPARTMENT BRAND HEADER */}
        <div className="flex flex-col items-center mt-0 mb-3 text-center px-4 animate-slide-up relative z-10">
          <div 
            className="px-8 py-3.5 rounded-[2rem] flex items-center justify-center inline-flex shadow-2xl transition-transform hover:scale-105 duration-300 bg-white"
            style={{ 
              boxShadow: '0 15px 35px -5px rgba(25, 46, 89, 0.4)' 
            }}
          >
            <span className="text-xl lg:text-2xl font-[900] uppercase tracking-[0.15em] text-[#192e59]">
              {t(titleKey)}
            </span>
          </div>
        </div>

        {/* 📑 3. BRAND NEW ROUNDED-SQUARE ICON SERVICE TABS GRID */}
        <div className="w-full px-[5%] mt-0 mb-1 max-w-none">
          
          {/* Centered horizontal flexbox of features floating directly on the page! */}
          <div className="flex flex-wrap items-start justify-center gap-6 lg:gap-10 py-6">
            {deptData.services.map((service, index) => {
              const englishTitle = service.title.toLowerCase();
              let route = "/complaint";
              if (englishTitle.includes("pay") || englishTitle.includes("bill") || englishTitle.includes("tax") || englishTitle.includes("subsidy")) {
                route = "/payment";
              } else if (englishTitle.includes("new") || englishTitle.includes("connection") || englishTitle.includes("registration")) {
                route = "/application";
              } else if (englishTitle.includes("load") || englishTitle.includes("change")) {
                route = "/load-change";
              } else if (englishTitle.includes("meter")) {
                route = "/meter-complaint";
              }

              // Dynamic vibrant colors matching the dynamic theme colors or individual palette
              const squareBg = squareColors[index % squareColors.length];

              return (
                <button 
                  key={index}
                  onClick={() => navigate(`/auth/${id}`, {
                    state: {
                      redirectTo: route,
                      serviceState: {
                        category: t(titleKey),
                        service: t(`dept.${id}.s${index + 1}`),
                        description: t(`dept.${id}.s${index + 1}`)
                      }
                    }
                  })}
                  className={`h-40 w-40 lg:h-48 lg:w-48 rounded-[2rem] flex flex-col items-center justify-center p-4 text-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg relative overflow-hidden group focus:outline-none ${squareBg}`}
                >
                  
                  {/* Circle enclosing the thin crisp icon matching the reference style exactly! */}
                  <div className="mb-4 h-12 w-12 rounded-full border-2 border-white flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shrink-0">
                    <service.icon className="h-6 w-6 text-white stroke-[2.2]" />
                  </div>
                  
                  {/* Centered Bold White Title inside the flat solid card */}
                  <h4 className="text-[12px] lg:text-[14px] font-[900] text-white uppercase tracking-normal leading-snug line-clamp-3 px-1 relative z-10">
                    {t(`dept.${id}.s${index + 1}`)}
                  </h4>

                  {/* Subtle micro hover accent */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                </button>
              );
            })}
          </div>

        </div>

        {/* 🎬 4. CINEMATIC INFINITE-SCROLLING DYNAMIC IMAGE MARQUEE */}
        <div className="w-full px-[5%] mt-2 max-w-none">
          <div className="overflow-hidden relative py-2">

            <div className="flex w-max animate-img-marquee gap-8">
              {[...theme.marqueeImages, ...theme.marqueeImages, ...theme.marqueeImages].map((imgUrl, idx) => (
                <div key={idx} className="h-36 w-48 lg:h-48 lg:w-60 shrink-0 relative overflow-hidden rounded-xl border border-white/10 shadow-2xl group bg-white/5 transition-transform duration-300 hover:scale-105">
                  <img 
                    src={imgUrl} 
                    alt="Department Activity" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-80" />
                </div>
              ))}
            </div>

            <style>{`
              @keyframes imgMarquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-33.3333%); }
              }
              .animate-img-marquee {
                animation: imgMarquee 75s linear infinite;
              }
              .animate-img-marquee:hover {
                animation-play-state: paused;
              }
            `}</style>
          </div>
        </div>

        </div>

      {/* 🏛️ Lower Extras Grid */}
      {["gas", "water", "waste", "property"].includes(id || "") && (
        <div className="w-full px-[5%] mt-8 relative z-10 shrink-0 max-w-none">
          <div className="w-full">
            <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/10 shadow-2xl h-full text-white [&>div]:mt-0 [&>div]:bg-transparent [&>div]:border-none [&>div]:p-0 [&>div]:shadow-none">
              <DepartmentExtras departmentId={id || ""} />
            </div>
          </div>
        </div>
      )}

      {/* 📞 FLOATING CORNER ACTIONS DECK (Bottom Left Corner, matching Accessibility docks!) */}
      <div className="fixed bottom-6 left-6 z-50 flex items-center gap-4 pointer-events-auto">
         {/* Department Helpline Capsule - Flat & Solid Slate-Midnight */}
         <div className="flex items-center gap-3 py-3 px-5 bg-[#0f172a] border border-white/20 rounded-full hover:bg-slate-800 active:scale-95 transition-all text-white shadow-2xl cursor-pointer group">
            <Phone className="h-4.5 w-4.5 text-[#FD8008] group-hover:animate-bounce shrink-0" />
            <span className="text-[12px] font-black uppercase tracking-wider text-slate-300">Support: <span className="text-white">1800-200-1234</span></span>
         </div>

         {/* Emergency SOS Capsule - Flat & Solid Vibrant Crimson */}
         <div className="flex items-center gap-3 py-3 px-5 bg-red-600 border border-red-500 rounded-full hover:bg-red-700 active:scale-95 transition-all text-white shadow-2xl shadow-red-600/30 cursor-pointer group">
            <AlertTriangle className="h-4.5 w-4.5 text-white animate-pulse shrink-0" />
            <span className="text-[12px] font-black uppercase tracking-widest text-white">Emergency SOS</span>
         </div>
      </div>

    </div>
  );
};

export default DepartmentPage;
