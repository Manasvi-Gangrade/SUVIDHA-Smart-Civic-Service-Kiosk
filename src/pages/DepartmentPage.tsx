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
    primary: "#FFA500",
    gradientFrom: "from-[#FFA500]",
    gradientTo: "to-[#cc8400]",
    lightBg: "bg-amber-50/50",
    iconBg: "bg-[#FFA500]/10 text-[#FFA500]",
    borderFocus: "focus:border-[#FFA500] focus:ring-[#FFA500]/15",
    video: "/videos/electricity.mp4",
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
    video: "/videos/gas.mp4",
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
    video: "/videos/Municipal.mp4",
    marqueeImages: [
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80"
    ]
  },
  water: {
    primary: "#2196F3",
    gradientFrom: "from-[#2196F3]",
    gradientTo: "to-[#1976D2]",
    lightBg: "bg-blue-50/50",
    iconBg: "bg-[#2196F3]/10 text-[#2196F3]",
    borderFocus: "focus:border-[#2196F3] focus:ring-[#2196F3]/15",
    video: "/videos/Water.mp4",
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
    video: "/videos/Waste Management.mp4",
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
  "bg-[#FFA500] shadow-[#FFA500]/20 hover:shadow-[#FFA500]/40", // Electricity: Saffron Gold
  "bg-[#FF4500] shadow-[#FF4500]/20 hover:shadow-[#FF4500]/40", // Gas: Orange-Red
  "bg-[#4CAF50] shadow-[#4CAF50]/20 hover:shadow-[#4CAF50]/40", // Municipal: Eco Green
  "bg-[#2196F3] shadow-[#2196F3]/20 hover:shadow-[#2196F3]/40", // Water: Sky Blue
  "bg-[#2ECC71] shadow-[#2ECC71]/20 hover:shadow-[#2ECC71]/40", // Sanitation: Jade Green
  "bg-[#607D8B] shadow-[#607D8B]/20 hover:shadow-[#607D8B]/40", // Property: Teal-Gray
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
    <div className="h-full overflow-y-auto custom-scrollbar font-display relative flex flex-col justify-between bg-[#192e59] text-white pb-32">
      
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
        <div className="w-full px-[5%] pt-2 pb-0 flex justify-start shrink-0 relative z-50 max-w-none">
          <button
            onClick={() => navigate('/departments')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#FD8008] hover:bg-[#e67000] text-white border border-[#FD8008]/20 rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 duration-200 group shadow-[0_4px_12px_rgba(253,128,8,0.3)]"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Grid</span>
          </button>
        </div>

        {/* 🏛️ 2. CENTERED MAJESTIC DEPARTMENT BRAND HEADER */}
        <div className="flex flex-col items-center mt-6 mb-8 text-center px-4 animate-slide-up relative z-10">
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
        <div className="w-full px-[5%] mt-4 mb-8 max-w-none">
          
          {id === "waste" ? (
            /* 🌍 Split layout for Waste Management: Video on Left, Service Buttons on Right */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-6 max-w-6xl mx-auto">
              
              {/* Left Column: Video Placeholder */}
              <div className="lg:col-span-6 w-full flex flex-col items-center">
                <div className="w-full relative aspect-video bg-black rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/g2H249N5l38?autoplay=1&mute=1&loop=1&playlist=g2H249N5l38" 
                    title="Waste Segregation Guide" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  ></iframe>
                </div>
                <p className="text-[11px] text-green-400 font-black tracking-[0.2em] mt-4 uppercase animate-pulse">
                  🌱 WASTE SEGREGATION & RECYCLING GUIDE
                </p>
              </div>

              {/* Right Column: Service Cards as square boxes */}
              <div className="lg:col-span-6 w-full flex flex-wrap justify-center gap-6 py-4">
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
                      {/* Circle enclosing the thin crisp icon */}
                      <div className="mb-4 h-12 w-12 rounded-full border-2 border-[#192e59] flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shrink-0">
                        <service.icon className="h-6 w-6 text-[#192e59] stroke-[2.2]" />
                      </div>
                      
                      {/* Centered Bold Dark Blue Title inside the flat solid card */}
                      <h4 className="text-[12px] lg:text-[14px] font-[900] text-[#192e59] uppercase tracking-normal leading-snug line-clamp-3 px-1 relative z-10">
                        {t(`dept.${id}.s${index + 1}`)}
                      </h4>

                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </button>
                  );
                })}
              </div>

            </div>
          ) : (
            /* Centered horizontal flexbox of features for other departments */
            <div className="flex flex-wrap items-start justify-center gap-8 lg:gap-12 py-10">
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
                    <div className="mb-4 h-12 w-12 rounded-full border-2 border-[#192e59] flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shrink-0">
                      <service.icon className="h-6 w-6 text-[#192e59] stroke-[2.2]" />
                    </div>
                    
                    {/* Centered Bold Dark Blue Title inside the flat solid card */}
                    <h4 className="text-[12px] lg:text-[14px] font-[900] text-[#192e59] uppercase tracking-normal leading-snug line-clamp-3 px-1 relative z-10">
                      {t(`dept.${id}.s${index + 1}`)}
                    </h4>

                    {/* Subtle micro hover accent */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  </button>
                );
              })}
            </div>
          )}

        </div>

        {/* 🎬 4. CINEMATIC INFINITE-SCROLLING DYNAMIC IMAGE MARQUEE */}
        <div className="w-full px-[5%] mt-12 lg:mt-16 max-w-none">
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
      {["gas", "water", "property"].includes(id || "") && (
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
