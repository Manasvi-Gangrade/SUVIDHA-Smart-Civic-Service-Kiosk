import { Zap, Flame, Building2, Droplets, Trash2, FileText, Search, MessageSquarePlus, ClipboardList } from "lucide-react";
import DepartmentCard from "@/components/DepartmentCard";
import heroBanner from "@/assets/hero-banner.jpg";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import kioskImg from "../../images/image.png";
import img1 from "../../images/image copy.png";
import img2 from "../../images/image copy 2.png";
import img3 from "../../images/image copy 3.png";
import img4 from "../../images/image copy 4.png";
import img5 from "../../images/image copy 5.png";
import img6 from "../../images/image copy 6.png";

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

            {/* Right Column: Structured 3-1-3 Image Grid */}
            <div className="relative mt-12 lg:mt-0 w-full min-h-[600px] flex items-center justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="grid grid-cols-3 gap-4 sm:gap-8 items-center w-full max-w-[600px]">
                {/* Top Row: 3 Images */}
                <div className="aspect-square rounded-2xl overflow-hidden shadow-xl border-2 border-white/10 glass-card animate-float-slow hover:scale-110 transition-transform duration-500">
                  <img src={img1} alt="Civic 1" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden shadow-xl border-2 border-white/10 glass-card animate-float-slow hover:scale-110 transition-transform duration-500" style={{ animationDelay: "0.5s" }}>
                  <img src={img2} alt="Civic 2" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden shadow-xl border-2 border-white/10 glass-card animate-float-slow hover:scale-110 transition-transform duration-500" style={{ animationDelay: "1s" }}>
                  <img src={img3} alt="Civic 3" className="w-full h-full object-cover" />
                </div>

                {/* Middle Row: 1 Enlarged Focal Centerpiece */}
                <div /> {/* Spacer for 1st column */}
                <div className="z-30 scale-125 lg:scale-150 group">
                  <div className="relative overflow-hidden rounded-[2.5rem] border-4 border-white/20 shadow-2xl transition-all duration-700 group-hover:scale-105 group-hover:rotate-1 group-hover:border-secondary/40">
                    <img src={kioskImg} alt="Smart Kiosk" className="w-full h-auto" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="absolute -inset-6 rounded-[3rem] bg-secondary/15 blur-2xl animate-pulse -z-10" />
                </div>
                <div /> {/* Spacer for 3rd column */}

                {/* Bottom Row: 3 Images */}
                <div className="aspect-square rounded-2xl overflow-hidden shadow-xl border-2 border-white/10 glass-card animate-float-slow hover:scale-110 transition-transform duration-500" style={{ animationDelay: "1.5s" }}>
                  <img src={img4} alt="Civic 4" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden shadow-xl border-2 border-white/10 glass-card animate-float-slow hover:scale-110 transition-transform duration-500" style={{ animationDelay: "2s" }}>
                  <img src={img5} alt="Civic 5" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden shadow-xl border-2 border-white/10 glass-card animate-float-slow hover:scale-110 transition-transform duration-500" style={{ animationDelay: "2.5s" }}>
                  <img src={img6} alt="Civic 6" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Symmetrical Background Decor */}
              <div className="absolute inset-0 bg-radial-gradient from-secondary/5 to-transparent blur-[120px] -z-20 pointer-events-none animate-pulse" />
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
