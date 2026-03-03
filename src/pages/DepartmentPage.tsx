import ServiceItem from "@/components/ServiceItem";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import QueueToken from "@/components/QueueToken";
import { Zap, Flame, Building2, Droplets, Trash2, FileText, PlusCircle, Receipt, AlertTriangle, Gauge, PlugZap, ShieldAlert, Truck, Phone } from "lucide-react";

const departmentData: Record<string, {
  title: string;
  icon: any;
  description: string;
  services: { icon: any; title: string; description: string }[];
}> = {
  electricity: {
    title: "Electricity Utility Services",
    icon: Zap,
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
    icon: Flame,
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
    icon: Building2,
    description: "Property tax, civic grievances, and local governance services",
    services: [
      { icon: FileText, title: "Property Tax Information", description: "View property tax details and payment status" },
      { icon: AlertTriangle, title: "Local Grievance Submission", description: "Submit complaints about civic issues" },
      { icon: Phone, title: "Contact Municipal Office", description: "Get helpline numbers and office addresses" },
    ],
  },
  water: {
    title: "Water Supply Services",
    icon: Droplets,
    description: "Water connections, billing, and leakage complaints",
    services: [
      { icon: PlusCircle, title: "New Water Connection", description: "Apply for a new water supply connection" },
      { icon: Receipt, title: "Water Bill Enquiry", description: "View and pay your water supply bills" },
      { icon: AlertTriangle, title: "Leakage Complaint", description: "Report water pipeline leaks and issues" },
    ],
  },
  waste: {
    title: "Waste Management Services",
    icon: Trash2,
    description: "Garbage collection, sanitation, and cleanliness services",
    services: [
      { icon: Truck, title: "Garbage Collection Issues", description: "Report irregular garbage collection" },
      { icon: AlertTriangle, title: "Missed Pickup Reporting", description: "Report missed waste pickup from your area" },
      { icon: ShieldAlert, title: "Sanitation Complaints", description: "Report sanitation and hygiene issues" },
    ],
  },
  property: {
    title: "Property & Tax Services",
    icon: FileText,
    description: "Property assessment, tax payments, and related services",
    services: [
      { icon: Receipt, title: "Property Tax Payment", description: "Pay your property tax online" },
      { icon: FileText, title: "Assessment Details", description: "View your property assessment information" },
      { icon: PlusCircle, title: "New Property Registration", description: "Register a new property with municipal records" },
    ],
  },
};

const DepartmentPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [token, setToken] = useState<string | null>(null);

  // Helper to safely get translation
  const getTrans = (key: string, defaultVal?: string) => {
    const val = t(key);
    return val === key ? defaultVal || key : val;
  };

  const deptData = departmentData[id || ""];

  if (!deptData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-20 text-center">
          <h2 className="text-2xl font-bold text-foreground">Department not found</h2>
        </div>
      </div>
    );
  }

  const Icon = deptData.icon;
  const titleKey = `dept.${id}.title`;
  const descKey = `dept.${id}.desc`;

  const handleGetToken = () => {
    // Generate an ID based on department name
    const deptPrefix = t(titleKey).substring(0, 1).toUpperCase() || id?.substring(0, 1).toUpperCase();
    const newToken = `${deptPrefix}-${Math.floor(Math.random() * 900 + 100)}`;
    setToken(newToken);

    // Auto navigate to the virtual waiting room after a brief delay
    setTimeout(() => {
      navigate(`/queue?token=${newToken}&dept=${encodeURIComponent(t(titleKey))}`);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background pb-20">

      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden border-b border-border bg-primary py-12 md:py-16">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <div className="container relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="rounded-3xl bg-secondary/10 p-6 backdrop-blur-sm border border-secondary/20">
              <Icon className="h-12 w-12 text-secondary" />
            </div>
            <div className="text-center md:text-left">
              <div className="inline-flex items-center rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs font-medium text-primary-foreground/80 mb-3">
                {t("dept.onlineKiosk")}
              </div>
              <h1 className="text-3xl font-bold text-primary-foreground md:text-5xl tracking-tight">{t(titleKey)}</h1>
              <p className="mt-2 text-lg text-primary-foreground/70 max-w-2xl">{t(descKey)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-10">
        <div className="grid gap-10 lg:grid-cols-3">

          {/* Left Column: Services */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-6">
                <span className="h-8 w-1 bg-secondary rounded-full" />
                {t('quickActions')}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {deptData.services.map((service, index) => {
                  const titleStr = t(`dept.${id}.s${index + 1}`).toLowerCase();
                  let route = "/complaint";
                  if (titleStr.includes("pay") || titleStr.includes("bill") || titleStr.includes("tax") || titleStr.includes("subsidy")) {
                    route = "/payment";
                  } else if (titleStr.includes("new") || titleStr.includes("connection") || titleStr.includes("registration")) {
                    route = "/application";
                  }

                  return (
                    <ServiceItem
                      key={index}
                      icon={service.icon}
                      title={t(`dept.${id}.s${index + 1}`)}
                      description={t(`dept.${id}.d${index + 1}`)}
                      onClick={() => navigate(route, {
                        state: {
                          category: t(titleKey),
                          service: t(`dept.${id}.s${index + 1}`),
                          description: t(`dept.${id}.s${index + 1}`)
                        }
                      })}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Walk-in / Queue */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="font-semibold text-foreground mb-4">{t("dept.walkIn")}</h3>
              <p className="text-sm text-muted-foreground mb-6">
                {t("dept.walkInDesc")}
              </p>
              {!token ? (
                <button
                  onClick={handleGetToken}
                  className="w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  {t("dept.getToken")}
                </button>
              ) : (
                <QueueToken token={token} waitTime="10-15 mins" />
              )}
            </div>

            <div className="rounded-xl bg-muted/50 p-6">
              <h4 className="font-medium text-foreground mb-2">{t("dept.needHelp")}</h4>
              <p className="text-sm text-muted-foreground">
                {t("dept.helplineDesc")}
              </p>
              <div className="mt-4 flex items-center gap-2 text-primary font-bold">
                <Phone className="h-5 w-5" />
                <span>1800-200-1234</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentPage;
