import { useState } from "react";
import { Zap, Flame, Building2, Droplets, Trash2, FileText, Search, MessageSquarePlus, ClipboardList, MapPin } from "lucide-react";
import DepartmentCard from "@/components/DepartmentCard";
import heroBanner from "@/assets/hero-banner.jpg";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import kioskImg from "../../images/image.png";
import img1 from "../../images/image copy.png";
import img2 from "../../images/smart_city_2.png";
import img3 from "../../images/image copy 3.png";
import img4 from "../../images/digital_concept.png";
import img5 from "../../images/image copy 5.png";
import img6 from "../../images/urban_hub.png";

const FILTER_TABS = ["All", "Utility", "Civic", "Property"];

const allDepartments = [
  {
    icon: Zap,
    titleKey: "departments.electricity",
    descKey: "departmentDesc.electricity",
    path: "/department/electricity",
    color: "saffron" as const,
    serviceCount: 5,
    status: "Online" as const,
    category: "Utility",
    searchTerms: "electricity power outage bill meter connection",
  },
  {
    icon: Flame,
    titleKey: "departments.gas",
    descKey: "departmentDesc.gas",
    path: "/department/gas",
    color: "navy" as const,
    serviceCount: 4,
    status: "Online" as const,
    category: "Utility",
    searchTerms: "gas lpg cylinder booking leakage subsidy",
  },
  {
    icon: Building2,
    titleKey: "departments.municipal",
    descKey: "departmentDesc.municipal",
    path: "/department/municipal",
    color: "teal" as const,
    serviceCount: 3,
    status: "High Load" as const,
    category: "Civic",
    searchTerms: "municipal corporation grievance contact office civic",
  },
  {
    icon: Droplets,
    titleKey: "departments.water",
    descKey: "departmentDesc.water",
    path: "/department/water",
    color: "green" as const,
    serviceCount: 3,
    status: "Online" as const,
    category: "Utility",
    searchTerms: "water supply connection bill leakage pipeline",
  },
  {
    icon: Trash2,
    titleKey: "departments.waste",
    descKey: "departmentDesc.waste",
    path: "/department/waste",
    color: "saffron" as const,
    serviceCount: 3,
    status: "Online" as const,
    category: "Civic",
    searchTerms: "waste garbage pickup sanitation cleanliness truck",
  },
  {
    icon: FileText,
    titleKey: "departments.property",
    descKey: "departmentDesc.property",
    path: "/department/property",
    color: "navy" as const,
    serviceCount: 3,
    status: "Online" as const,
    category: "Property",
    searchTerms: "property tax assessment registration payment",
  },
];

const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDepts = allDepartments.filter((dept) => {
    const matchesFilter = activeFilter === "All" || dept.category === activeFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      t(dept.titleKey).toLowerCase().includes(query) ||
      dept.searchTerms.includes(query);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary min-h-[600px] flex items-center">
        <div className="absolute inset-0">
          <img src={heroBanner} alt="Smart city services" className="h-full w-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-transparent" />
        </div>

        <div className="container relative py-12 md:py-20">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            {/* Left Column: Content */}
            <div className="max-w-xl animate-slide-up">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary/20 px-4 py-1.5 text-sm font-medium text-secondary backdrop-blur-md border border-secondary/30">
                <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                {t("appSubtitle")}
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-primary-foreground md:text-5xl lg:text-7xl leading-[1.1]">
                {t("heroTitle")}
              </h1>
              <p className="mt-6 text-xl text-primary-foreground/80 leading-relaxed font-light">
                {t("heroSubtitle")}
              </p>

              <div className="mt-8 space-y-3 border-l-2 border-secondary/50 pl-4 py-1">
                <p className="text-lg font-semibold text-secondary italic tracking-wide">
                  {t("tagline1")}
                </p>
                <p className="text-base text-primary-foreground/70 italic font-light">
                  {t("tagline2")}
                </p>
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/track")}
                  className="kiosk-touch-target inline-flex items-center gap-3 rounded-xl bg-secondary px-8 py-4 text-lg font-bold text-secondary-foreground transition-all hover:scale-105 hover:brightness-110 shadow-xl shadow-secondary/20 group"
                >
                  <Search className="h-6 w-6 transition-transform group-hover:rotate-12" />
                  {t("trackRequest")}
                </button>
                <button
                  onClick={() => navigate("/complaint")}
                  className="kiosk-touch-target inline-flex items-center gap-3 rounded-xl border-2 border-primary-foreground/30 px-8 py-4 text-lg font-bold text-primary-foreground transition-all hover:bg-primary-foreground/10 backdrop-blur-sm"
                >
                  <MessageSquarePlus className="h-6 w-6" />
                  {t("registerComplaint")}
                </button>
              </div>
            </div>

            {/* Right Column: 2-3-2 Image Grid */}
            <div className="relative mt-12 lg:mt-0 w-full min-h-[600px] flex items-center justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="flex flex-col gap-4 sm:gap-6 items-center w-full max-w-[650px]">
                {/* Row 1: 2 Images */}
                <div className="grid grid-cols-2 gap-4 sm:gap-8 w-full px-12 sm:px-20">
                  <div className="group transition-all duration-500 hover:z-40">
                    <div className="relative overflow-hidden rounded-2xl border-2 border-white/10 shadow-lg glass-card animate-float-slow">
                      <img src={img1} alt="Civic 1" className="w-full h-full object-cover aspect-square" />
                    </div>
                  </div>
                  <div className="group transition-all duration-500 hover:z-40">
                    <div className="relative overflow-hidden rounded-2xl border-2 border-white/10 shadow-lg glass-card animate-float-slow" style={{ animationDelay: "0.5s" }}>
                      <img src={img2} alt="Civic 2" className="w-full h-full object-cover aspect-square" />
                    </div>
                  </div>
                </div>

                {/* Row 2: 3 Images */}
                <div className="grid grid-cols-3 gap-3 sm:gap-6 items-center w-full">
                  <div className="group transition-all duration-500 hover:z-40">
                    <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border-2 border-white/10 shadow-lg glass-card animate-float-slow" style={{ animationDelay: "1s" }}>
                      <img src={img3} alt="Civic 3" className="w-full h-full object-cover aspect-square" />
                    </div>
                  </div>
                  <div className="z-30 scale-150 lg:scale-[1.75] group px-1 sm:px-2">
                    <div className="relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border-4 border-white/20 shadow-2xl transition-all duration-700 group-hover:scale-105 group-hover:rotate-1 group-hover:border-secondary/40">
                      <img src={kioskImg} alt="Smart Kiosk" className="w-full h-auto" />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="absolute -inset-6 rounded-[3rem] bg-secondary/15 blur-2xl animate-pulse -z-10" />
                  </div>
                  <div className="group transition-all duration-500 hover:z-40">
                    <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border-2 border-white/10 shadow-lg glass-card animate-float-slow" style={{ animationDelay: "1.5s" }}>
                      <img src={img4} alt="Civic 4" className="w-full h-full object-cover aspect-square" />
                    </div>
                  </div>
                </div>

                {/* Row 3: 2 Images */}
                <div className="grid grid-cols-2 gap-4 sm:gap-8 w-full px-12 sm:px-20">
                  <div className="group transition-all duration-500 hover:z-40">
                    <div className="relative overflow-hidden rounded-2xl border-2 border-white/10 shadow-lg glass-card animate-float-slow" style={{ animationDelay: "2s" }}>
                      <img src={img5} alt="Civic 5" className="w-full h-full object-cover aspect-square" />
                    </div>
                  </div>
                  <div className="group transition-all duration-500 hover:z-40">
                    <div className="relative overflow-hidden rounded-2xl border-2 border-white/10 shadow-lg glass-card animate-float-slow" style={{ animationDelay: "2.5s" }}>
                      <img src={img6} alt="Civic 6" className="w-full h-full object-cover aspect-square" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <div className="bg-primary/5 border-y border-border py-4">
        <div className="container flex flex-wrap gap-6 justify-center sm:justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-kiosk-green animate-pulse" />
            <span className="font-semibold text-foreground">1,247</span>
            <span className="text-muted-foreground">Complaints Resolved Today</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
            <span className="font-semibold text-foreground">38</span>
            <span className="text-muted-foreground">In Progress Right Now</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="font-semibold text-foreground">6 Departments</span>
            <span className="text-muted-foreground">Active & Available</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-kiosk-teal animate-pulse" />
            <span className="font-semibold text-foreground">Avg 2.4 days</span>
            <span className="text-muted-foreground">Resolution Time</span>
          </div>
        </div>
      </div>

      {/* Departments Section */}
      <section className="container py-16">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground">{t("selectDepartment")}</h2>
              <p className="mt-1 text-muted-foreground">{t("selectDepartmentDesc")}</p>
            </div>
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search departments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-input bg-card pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 flex-wrap">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-200 ${activeFilter === tab
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {filteredDepts.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <Search className="mx-auto h-10 w-10 mb-3 opacity-30" />
            <p className="text-lg font-medium">No departments found for "{searchQuery}"</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDepts.map((dept) => (
              <DepartmentCard
                key={dept.titleKey}
                icon={dept.icon}
                title={t(dept.titleKey)}
                description={t(dept.descKey)}
                path={dept.path}
                color={dept.color}
                serviceCount={dept.serviceCount}
                status={dept.status}
              />
            ))}
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section className="border-t border-border bg-card py-12">
        <div className="container">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button
              onClick={() => navigate("/complaint")}
              className="kiosk-touch-target flex items-center gap-4 rounded-xl bg-muted p-5 transition-all hover:bg-muted/70 hover:-translate-y-0.5 hover:shadow-md"
            >
              <MessageSquarePlus className="h-8 w-8 text-secondary" />
              <div className="text-left">
                <div className="font-semibold text-foreground">{t("registerComplaint")}</div>
                <div className="text-sm text-muted-foreground">{t("submitGrievance")}</div>
              </div>
            </button>
            <button
              onClick={() => navigate("/track")}
              className="kiosk-touch-target flex items-center gap-4 rounded-xl bg-muted p-5 transition-all hover:bg-muted/70 hover:-translate-y-0.5 hover:shadow-md"
            >
              <Search className="h-8 w-8 text-kiosk-teal" />
              <div className="text-left">
                <div className="font-semibold text-foreground">{t("trackRequest")}</div>
                <div className="text-sm text-muted-foreground">{t("trackStatusDesc")}</div>
              </div>
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="kiosk-touch-target flex items-center gap-4 rounded-xl bg-muted p-5 transition-all hover:bg-muted/70 hover:-translate-y-0.5 hover:shadow-md"
            >
              <ClipboardList className="h-8 w-8 text-kiosk-green" />
              <div className="text-left">
                <div className="font-semibold text-foreground">{t("myDashboard")}</div>
                <div className="text-sm text-muted-foreground">{t("dashboardDesc")}</div>
              </div>
            </button>
            <button
              onClick={() => navigate("/map")}
              className="kiosk-touch-target flex items-center gap-4 rounded-xl bg-muted p-5 transition-all hover:bg-muted/70 hover:-translate-y-0.5 hover:shadow-md"
            >
              <MapPin className="h-8 w-8 text-blue-500" />
              <div className="text-left">
                <div className="font-semibold text-foreground">Service Map</div>
                <div className="text-sm text-muted-foreground">Find nearest locations</div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container text-center text-sm text-muted-foreground">
          <p>{t("footerText")}</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
