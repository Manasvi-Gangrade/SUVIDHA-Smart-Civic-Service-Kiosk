import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { 
  PlusCircle, Receipt, AlertTriangle, Gauge, PlugZap, 
  ShieldAlert, Truck, Phone, ArrowLeft, Building2, ChevronRight, FileText, UserCog
} from "lucide-react";

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
      { icon: UserCog, title: "Edit Credentials", description: "Update your personal and contact details" },
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
      { icon: UserCog, title: "Edit Consumer Profile", description: "Update your profile details" },
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
      { icon: UserCog, title: "Update Profile", description: "Update your credentials" },
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
      { icon: UserCog, title: "Update Profile", description: "Update your credentials" },
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
      { icon: UserCog, title: "Edit Credentials", description: "Update your credentials" },
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
      { icon: UserCog, title: "Update Profile", description: "Update your credentials" },
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
    primary: "#FFA500",
    gradientFrom: "from-[#FFA500]",
    gradientTo: "to-[#cc8400]",
    lightBg: "bg-amber-50/50",
    iconBg: "bg-[#FFA500]/10 text-[#FFA500]",
    borderFocus: "focus:border-[#FFA500] focus:ring-[#FFA500]/15",
    video: "/videos/Electricity Video.mp4",
    marqueeImages: [
      "/images/elec1.jpeg",
      "/images/elec2.jpeg",
      "/images/elec3.jpeg",
      "/images/elec4.jpeg",
      "/images/elec5.jpeg",
      "/images/elec6.jpeg",
      "/images/elec7.jpeg"
    ]
  },
  gas: {
    primary: "#FF4500",
    gradientFrom: "from-[#FF4500]",
    gradientTo: "to-[#cc3700]",
    lightBg: "bg-red-50/50",
    iconBg: "bg-[#FF4500]/10 text-[#FF4500]",
    borderFocus: "focus:border-[#FF4500] focus:ring-[#FF4500]/15",
    video: "/videos/Gas Video.mp4",
    marqueeImages: [
      "https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1526253038957-bbe54e05968e?w=600&auto=format&fit=crop&q=80"
    ]
  },
  municipal: {
    primary: "#4CAF50",
    gradientFrom: "from-[#4CAF50]",
    gradientTo: "to-[#3d8b41]",
    lightBg: "bg-emerald-50/50",
    iconBg: "bg-[#4CAF50]/10 text-[#4CAF50]",
    borderFocus: "focus:border-[#4CAF50] focus:ring-[#4CAF50]/15",
    video: "/videos/Municipal Video.mp4",
    marqueeImages: [
      "/images/municipal1.jpeg",
      "/images/municipal2.jpeg",
      "/images/municipal3.jpeg",
      "/images/municipal4.jpeg"
    ]
  },
  water: {
    primary: "#2196F3",
    gradientFrom: "from-[#2196F3]",
    gradientTo: "to-[#1976D2]",
    lightBg: "bg-blue-50/50",
    iconBg: "bg-[#2196F3]/10 text-[#2196F3]",
    borderFocus: "focus:border-[#2196F3] focus:ring-[#2196F3]/15",
    video: "/videos/Water Video.mp4",
    marqueeImages: [
      "/images/water1.jpeg",
      "/images/water2.jpeg",
      "/images/water3.jpeg",
      "/images/water4.jpeg",
      "/images/water5.jpeg",
      "/images/water6.jpeg"
    ]
  },
  waste: {
    primary: "#2ECC71",
    gradientFrom: "from-[#2ECC71]",
    gradientTo: "to-[#27ae60]",
    lightBg: "bg-emerald-50/50",
    iconBg: "bg-[#2ECC71]/10 text-[#2ECC71]",
    borderFocus: "focus:border-[#2ECC71] focus:ring-[#2ECC71]/15",
    video: "/videos/Waste Video.mp4",
    marqueeImages: [
      "/images/sanitation1.jpeg",
      "/images/sanitation2.jpeg",
      "/images/sanitation3.jpeg",
      "/images/sanitation4.jpeg"
    ]
  },
  property: {
    primary: "#607D8B",
    gradientFrom: "from-[#607D8B]",
    gradientTo: "to-[#455A64]",
    lightBg: "bg-slate-50/50",
    iconBg: "bg-[#607D8B]/10 text-[#607D8B]",
    borderFocus: "focus:border-[#607D8B] focus:ring-[#607D8B]/15",
    video: "/videos/Property Video.mp4",
    marqueeImages: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80"
    ]
  },
};

// 🌈 PREMIUM VIBRANT GRADIENT THEMES: Colorful but with a premium elegant gradient finish
const squareColors = [
  "bg-gradient-to-br from-[#FFA726] to-[#F57C00] shadow-[#F57C00]/20 hover:shadow-[#F57C00]/40 border border-white/10", // Vibrant Orange
  "bg-gradient-to-br from-[#EF5350] to-[#D32F2F] shadow-[#D32F2F]/20 hover:shadow-[#D32F2F]/40 border border-white/10", // Vibrant Red
  "bg-gradient-to-br from-[#66BB6A] to-[#388E3C] shadow-[#388E3C]/20 hover:shadow-[#388E3C]/40 border border-white/10", // Vibrant Green
  "bg-gradient-to-br from-[#42A5F5] to-[#1976D2] shadow-[#1976D2]/20 hover:shadow-[#1976D2]/40 border border-white/10", // Vibrant Blue
  "bg-gradient-to-br from-[#26A69A] to-[#00796B] shadow-[#00796B]/20 hover:shadow-[#00796B]/40 border border-white/10", // Vibrant Teal
  "bg-gradient-to-br from-[#AB47BC] to-[#7B1FA2] shadow-[#7B1FA2]/20 hover:shadow-[#7B1FA2]/40 border border-white/10", // Vibrant Purple
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
    <div className="h-full overflow-y-auto custom-scrollbar font-display relative flex flex-col bg-[#192e59] text-white">
      
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

      <div className="relative z-10 w-full min-h-full flex flex-col pb-8">
        
        {/* 🏛️ FLOATING COMPACT TOP BACK ACTION DECK */}
        <div className="w-full px-[5%] pt-4 flex justify-start shrink-0 relative z-50 max-w-none">
          <button
            onClick={() => navigate('/departments')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#FD8008] hover:bg-[#e67000] text-white border border-[#FD8008]/20 rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 duration-200 group shadow-[0_4px_12px_rgba(253,128,8,0.3)]"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Grid</span>
          </button>
        </div>

        {/* MAIN CONTENT WRAPPER - Groups all elements and aligns them to the top */}
        <div className="flex-1 flex flex-col justify-start w-full px-[5%] max-w-none pt-2 lg:pt-6 pb-12 gap-8 lg:gap-10">

          {/* 🏛️ 2. CENTERED MAJESTIC DEPARTMENT BRAND HEADER */}
          <div className="flex flex-col items-center text-center px-4 animate-slide-up shrink-0">
            <h1 className="flex flex-col text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-[900] leading-[1.15] tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-slate-400 drop-shadow-2xl uppercase">
              <span>{t(titleKey)}</span>
            </h1>
          </div>
          
          {/* 🌍 Vertical layout: Service Buttons on Top, Video on Bottom */}
          <div className="flex flex-col gap-6 lg:gap-8 items-center max-w-6xl mx-auto w-full justify-center">
              
              {/* Top Section: Service Cards as square boxes */}
              <div className="w-full flex flex-wrap justify-center gap-6 py-4">
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
                  } else if (englishTitle.includes("profile") || englishTitle.includes("credential")) {
                    route = "/profile";
                  }

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
                      className={`aspect-square w-[42%] sm:w-36 md:w-40 lg:w-48 rounded-[2rem] flex flex-col items-center justify-center p-3 lg:p-4 text-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg relative overflow-hidden group focus:outline-none ${squareBg}`}
                    >
                      {/* Circle enclosing the thin crisp icon */}
                      <div className="mb-3 lg:mb-4 h-10 w-10 lg:h-12 lg:w-12 rounded-full border-2 border-white/50 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shrink-0 bg-white/5 group-hover:bg-white/10">
                        <service.icon className="h-5 w-5 lg:h-6 lg:w-6 text-white stroke-[2.2]" />
                      </div>
                      
                      {/* Centered Bold White Title inside the glass card */}
                      <h4 className="text-xs sm:text-sm font-[900] text-white uppercase tracking-normal leading-[1.2] line-clamp-3 px-1 relative z-10 drop-shadow-md">
                        {t(`dept.${id}.s${index + 1}`, service.title)}
                      </h4>

                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </button>
                  );
                })}
              </div>

              {/* Bottom Section: Video Placeholder */}
              <div className="w-full lg:w-[80%] flex flex-col items-center">
                <div className="w-full relative aspect-video bg-black rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
                  <video 
                    src={theme.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>

            </div>

          {/* 🎬 4. CINEMATIC INFINITE-SCROLLING DYNAMIC IMAGE MARQUEE */}
          <div className="w-full mt-4 max-w-none">
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

      </div>

    </div>
  );
};

export default DepartmentPage;
