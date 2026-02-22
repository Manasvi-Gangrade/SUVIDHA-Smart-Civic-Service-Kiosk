import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DepartmentCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  path: string;
  serviceCount?: number;
  status?: "Online" | "High Load" | "Closed";
  color?: "navy" | "saffron" | "teal" | "green" | "default" | string;
}

const colorMap: Record<string, string> = {
  navy: "bg-[#1E2E50]",
  saffron: "bg-[#FD8008]",
  teal: "bg-[#40968F]",
  green: "bg-[#2D9B51]",
  default: "bg-primary",
};

const DepartmentCard = ({
  icon: Icon,
  title,
  description,
  path,
  color = "default",
}: DepartmentCardProps) => {
  const navigate = useNavigate();
  const iconBgClass = colorMap[color] || colorMap.default;

  return (
    <button
      onClick={() => navigate(path)}
      className="group flex flex-col items-center justify-start text-center h-full rounded-[1.25rem] bg-[#f0f5fa] border border-[#d0e1f0] p-8 w-full transition-all duration-300 hover:-translate-y-1 hover:bg-[#e6eff6] hover:border-[#b8cce0] hover:shadow-xl hover:shadow-[#e6eff6] focus:outline-none focus:ring-2 focus:ring-primary/40"
    >
      {/* Icon */}
      <div className={`flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-[1.25rem] text-white shadow-sm transition-transform duration-300 group-hover:scale-105 ${iconBgClass}`}>
        <Icon className="h-8 w-8" strokeWidth={1.5} />
      </div>

      {/* Text Content */}
      <div className="flex flex-col gap-2.5 mt-6 w-full px-2">
        <h3 className="font-bold text-[#1e293b] text-[1.15rem]">
          {title}
        </h3>
        {description && (
          <p className="text-[0.85rem] text-[#64748b] leading-relaxed font-medium">
            {description}
          </p>
        )}
      </div>
    </button>
  );
};

export default DepartmentCard;
