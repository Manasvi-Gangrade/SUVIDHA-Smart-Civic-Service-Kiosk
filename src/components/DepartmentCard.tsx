import { useNavigate } from "react-router-dom";

interface DepartmentCardProps {
  icon: any; // Can be LucideIcon or string path
  title: string;
  description?: string;
  path: string;
  serviceCount?: number;
  status?: "Online" | "High Load" | "Closed";
  color?: "navy" | "saffron" | "teal" | "green" | "rose" | "purple" | "blue" | "indigo" | "default" | string;
  features?: string[];
}

const govColors: Record<
  string,
  {
    labelBg: string;
    bulletColor: string;
  }
> = {
  saffron: {
    labelBg: "bg-[#FF9933]",
    bulletColor: "bg-[#FF9933]",
  },
  rose: {
    labelBg: "bg-[#E3000F]",
    bulletColor: "bg-[#E3000F]",
  },
  teal: {
    labelBg: "bg-[#008080]",
    bulletColor: "bg-[#008080]",
  },
  blue: {
    labelBg: "bg-[#0066FF]",
    bulletColor: "bg-[#0066FF]",
  },
  green: {
    labelBg: "bg-[#138808]",
    bulletColor: "bg-[#138808]",
  },
  indigo: {
    labelBg: "bg-[#4F46E5]",
    bulletColor: "bg-[#4F46E5]",
  },
  default: {
    labelBg: "bg-slate-800",
    bulletColor: "bg-white",
  },
};

const videoPathMap: Record<string, string> = {
  saffron: "/videos/electricity.mp4",
  rose: "/videos/gas.mp4",
  teal: "/videos/Municipal.mp4",
  blue: "/videos/Water.mp4",
  green: "/videos/Waste Management.mp4",
  indigo: "/videos/Property.mp4",
  default: "/videos/14904045_3840_2160_30fps.mp4",
};

const DepartmentCard = ({
  title,
  path,
  color = "default",
  features = [],
}: DepartmentCardProps) => {
  const navigate = useNavigate();
  const gov = govColors[color] || govColors.default;
  const videoPath = videoPathMap[color] || videoPathMap.default;

  return (
    <button
      onClick={() => navigate(path)}
      className="group relative flex flex-col items-center justify-between aspect-square rounded-[2.5rem] bg-transparent border-[3px] border-white/20 p-5 lg:p-6 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:border-white/60 focus:outline-none focus:ring-2 focus:ring-white/20 w-full"
    >
      {/* 🎥 THE NATURAL VIVID VIDEO BACKGROUND */}
      <video
        ref={(el) => {
          if (el) {
            el.playbackRate = 1.6;
          }
        }}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-100 pointer-events-none z-0"
      >
        <source src={videoPath} type="video/mp4" />
      </video>

      {/* 🌫️ DEEP GRADIENT UNDERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/35 to-transparent pointer-events-none z-0" />

      {/* 📦 COMPACT CONTENT */}
      <div className="relative z-10 flex flex-col items-center justify-between w-full h-full pointer-events-none">
        
        {/* Department Name Header Capsule */}
        <div className={`w-full px-4 py-2.5 rounded-2xl ${gov.labelBg} text-white shadow-md border border-white/15 transition-transform duration-500 group-hover:scale-105 shrink-0`}>
          <h3 className="font-[950] text-[0.85rem] lg:text-[1rem] tracking-tight uppercase text-center drop-shadow-sm leading-none">
            {title}
          </h3>
        </div>
        
        {/* 📋 SOLID ROYAL SUVIDHA BLUE BACKPLATE (Made taller and larger using flex-1 & vertical centering to occupy massive visual presence inside the card!) */}
        {features.length > 0 && (
          <div className="w-full bg-[#192e59] rounded-2xl py-4 px-3.5 border border-white/15 mt-3 flex-1 flex flex-col justify-center transition-all duration-500 shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
            <ul className="text-left space-y-1.5 lg:space-y-2">
              {features.map((feat, fidx) => (
                <li 
                  key={fidx} 
                  className="text-[11px] lg:text-[12px] xl:text-[13px] font-[900] text-slate-100 uppercase tracking-wide flex items-center gap-2.5 leading-tight"
                >
                  {/* Color-themed bullet point */}
                  <span className={`h-1.5 w-1.5 lg:h-2 lg:w-2 rounded-full shrink-0 shadow-sm ${gov.bulletColor}`} />
                  <span className="truncate">{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </button>
  );
};

export default DepartmentCard;
