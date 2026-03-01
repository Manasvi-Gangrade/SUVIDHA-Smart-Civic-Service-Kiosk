import { Zap, Flame, Building2, Droplets, Trash2, FileText, Search, MessageSquarePlus, ClipboardList } from "lucide-react";
import DepartmentCard from "@/components/DepartmentCard";
import heroBanner from "@/assets/hero-banner.jpg";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import kioskImg from "../../images/image.png";
import smartImg from "../../images/image copy.png";
import mapImg from "../../images/image copy 3.png";
import govImg from "../../images/image copy 5.png";
import digitalImg from "../../images/image copy 6.png";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const departments = [
    { icon: Zap, title: t("departments.electricity"), description: t("departmentDesc.electricity"), path: "/department/electricity", color: "saffron" as const },
    { icon: Flame, title: t("departments.gas"), description: t("departmentDesc.gas"), path: "/department/gas", color: "navy" as const },
    { icon: Building2, title: t("departments.municipal"), description: t("departmentDesc.municipal"), path: "/department/municipal", color: "teal" as const },
    { icon: Droplets, title: t("departments.water"), description: t("departmentDesc.water"), path: "/department/water", color: "green" as const },
    { icon: Trash2, title: t("departments.waste"), description: t("departmentDesc.waste"), path: "/department/waste", color: "saffron" as const },
    { icon: FileText, title: t("departments.property"), description: t("departmentDesc.property"), path: "/department/property", color: "navy" as const },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary min-h-[500px] flex items-center">
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

              {/* Taglines with improved styling */}
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

            {/* Right Column: Premium Responsive Image Collage */}
            <div className="relative mt-12 lg:mt-0 h-[400px] sm:h-[500px] lg:h-[600px] w-full animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {/* Main Kiosk Image - Floating Centerpiece */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-[200px] sm:w-[240px] lg:w-[280px] group transition-all duration-500">
                <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] border-4 sm:border-8 border-white/10 shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:rotate-2 group-hover:border-secondary/30">
                  <img src={kioskImg} alt="Smart Kiosk" className="w-full h-auto" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {/* Visual Accent */}
                <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 h-16 w-16 sm:h-24 sm:w-24 rounded-full bg-secondary/20 blur-2xl animate-pulse" />
              </div>

              {/* Supporting Images - Responsive Staggered Layout */}

              {/* Top Right: Smart Cities */}
              <div className="absolute top-0 right-0 sm:top-10 sm:right-4 z-20 w-[140px] sm:w-[180px] lg:w-[220px] animate-float-slow opacity-90 hover:opacity-100 transition-opacity">
                <div className="rounded-xl sm:rounded-2xl border-2 sm:border-4 border-white/5 shadow-xl glass-card overflow-hidden">
                  <img src={smartImg} alt="Smart Cities" className="w-full h-auto object-cover" />
                </div>
              </div>

              {/* Bottom Left: Digital India Map */}
              <div className="absolute bottom-4 left-0 sm:bottom-10 sm:left-4 z-20 w-[160px] sm:w-[200px] lg:w-[240px] animate-float opacity-90 hover:opacity-100 transition-opacity" style={{ animationDelay: '1s' }}>
                <div className="rounded-xl sm:rounded-2xl border-2 sm:border-4 border-white/5 shadow-xl glass-card overflow-hidden">
                  <img src={mapImg} alt="Digital India Map" className="w-full h-auto" />
                </div>
              </div>

              {/* Top Left: Government Services (Smaller Accent) */}
              <div className="absolute top-10 left-4 sm:top-20 sm:left-10 z-10 w-[100px] sm:w-[140px] animate-float-slow opacity-60 hidden sm:block" style={{ animationDelay: '1.5s' }}>
                <div className="rounded-xl border-2 border-white/5 shadow-lg glass-card overflow-hidden rotate-[-12deg]">
                  <img src={govImg} alt="Government Services" className="w-full h-auto opacity-80" />
                </div>
              </div>

              {/* Bottom Right: Digital Connectivity */}
              <div className="absolute bottom-10 right-4 sm:bottom-20 sm:right-10 z-10 w-[120px] sm:w-[160px] animate-float opacity-60 hidden sm:block" style={{ animationDelay: '2.5s' }}>
                <div className="rounded-xl border-2 border-white/5 shadow-lg glass-card overflow-hidden rotate-[8deg]">
                  <img src={digitalImg} alt="Digital Connectivity" className="w-full h-auto opacity-80" />
                </div>
              </div>

              {/* Dynamic Background Effects */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px] rounded-full bg-secondary/10 blur-[80px] sm:blur-[120px] -z-10 animate-pulse" />

              {/* Decorative particles (Desktop only) */}
              <div className="absolute top-1/4 left-1/2 w-2 h-2 rounded-full bg-secondary/40 lg:block hidden animate-ping" />
              <div className="absolute bottom-1/4 right-1/3 w-3 h-3 rounded-full bg-white/20 lg:block hidden animate-bounce" style={{ animationDuration: '3s' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="container py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-foreground">{t("selectDepartment")}</h2>
          <p className="mt-2 text-muted-foreground">{t("selectDepartmentDesc")}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept) => (
            <DepartmentCard key={dept.title} {...dept} />
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="border-t border-border bg-card py-12">
        <div className="container">
          <div className="grid gap-4 sm:grid-cols-3">
            <button
              onClick={() => navigate("/complaint")}
              className="kiosk-touch-target flex items-center gap-4 rounded-lg bg-muted p-5 transition-colors hover:bg-muted/70"
            >
              <MessageSquarePlus className="h-8 w-8 text-secondary" />
              <div className="text-left">
                <div className="font-semibold text-foreground">{t("registerComplaint")}</div>
                <div className="text-sm text-muted-foreground">{t("submitGrievance")}</div>
              </div>
            </button>
            <button
              onClick={() => navigate("/track")}
              className="kiosk-touch-target flex items-center gap-4 rounded-lg bg-muted p-5 transition-colors hover:bg-muted/70"
            >
              <Search className="h-8 w-8 text-kiosk-teal" />
              <div className="text-left">
                <div className="font-semibold text-foreground">{t("trackRequest")}</div>
                <div className="text-sm text-muted-foreground">{t("trackStatusDesc")}</div>
              </div>
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="kiosk-touch-target flex items-center gap-4 rounded-lg bg-muted p-5 transition-colors hover:bg-muted/70"
            >
              <ClipboardList className="h-8 w-8 text-kiosk-green" />
              <div className="text-left">
                <div className="font-semibold text-foreground">{t("myDashboard")}</div>
                <div className="text-sm text-muted-foreground">{t("dashboardDesc")}</div>
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
