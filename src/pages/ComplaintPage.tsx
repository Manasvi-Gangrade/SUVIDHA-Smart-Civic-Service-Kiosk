import { useState } from "react";
import { MessageSquarePlus, CheckCircle2 } from "lucide-react";

import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const categories = [
  "Electricity", "Gas Distribution", "Water Supply", "Waste Management", "Municipal Services", "Property & Tax", "Other"
];

const ComplaintPage = () => {
  const location = useLocation();
  const state = location.state as { category?: string; service?: string; description?: string } | null;

  const { t } = useTranslation();

  const [submitted, setSubmitted] = useState(false);
  const [category, setCategory] = useState(state?.category || "");
  const [description, setDescription] = useState(state?.service ? `${state.service}: ` : "");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container flex flex-col items-center py-20 text-center">
          <div className="rounded-full bg-kiosk-green/10 p-6 mb-6">
            <CheckCircle2 className="h-16 w-16 text-kiosk-green" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">{t("complaint.successTitle")}</h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-md">
            {t("complaint.successMsg")}
          </p>
          <div className="mt-6 rounded-lg bg-card kiosk-card-shadow p-6 text-left w-full max-w-sm">
            <div className="text-sm text-muted-foreground">Reference ID</div>
            <div className="text-2xl font-bold text-secondary tracking-wider mt-1">SVD-2026-00{Math.floor(Math.random() * 900 + 100)}</div>
            <div className="mt-4 text-sm text-muted-foreground">An SMS confirmation will be sent to your registered mobile number.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-primary py-8">
        <div className="container flex items-center gap-4">
          <div className="rounded-2xl bg-secondary p-4">
            <MessageSquarePlus className="h-8 w-8 text-secondary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary-foreground">{t("complaint.title")}</h1>
            <p className="text-primary-foreground/70">{t("submitGrievance")}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="container max-w-xl py-10">
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">{t("complaint.fullName")}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="kiosk-touch-target w-full rounded-lg border border-input bg-card px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder={t("complaint.fullName")}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">{t("complaint.phone")}</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="kiosk-touch-target w-full rounded-lg border border-input bg-card px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="+91 XXXXX XXXXX"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">{t("complaint.category")}</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`kiosk-touch-target rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${category === cat
                    ? "border-secondary bg-secondary/10 text-secondary"
                    : "border-input bg-card text-muted-foreground hover:border-secondary/50"
                    }`}
                >
                  {t(`departments.${cat.split(' ')[0].toLowerCase()}`) || cat}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">{t("complaint.description")}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="w-full rounded-lg border border-input bg-card px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder={t("complaint.description")}
            />
          </div>
          <button
            type="submit"
            className="kiosk-touch-target w-full rounded-lg bg-secondary py-4 text-lg font-bold text-secondary-foreground transition-all hover:brightness-110 kiosk-glow"
          >
            {t("complaint.submit")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ComplaintPage;
