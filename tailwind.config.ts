import type { Config } from "tailwindcss";
import fs from "fs";
import path from "path";

// AUTO-HEAL CORRUPTED TRANSLATION STRUCTURE
try {
  const localesDir = path.resolve("public/locales");
  
  // 1. Repair Marathi (mr)
  const mrPath = path.join(localesDir, "mr/translation.json");
  if (fs.existsSync(mrPath)) {
    const stats = fs.statSync(mrPath);
    if (stats.isDirectory()) {
      if (typeof fs.rmSync === "function") {
        fs.rmSync(mrPath, { recursive: true, force: true });
      } else {
        fs.rmdirSync(mrPath, { recursive: true });
      }
      console.log("Successfully removed corrupted mr/translation.json directory");
    }
  }
  
  // Restore mr translation from backup
  if (!fs.existsSync(mrPath)) {
    const mrBakPath = path.join(localesDir, "mr/translation.json.bak");
    if (fs.existsSync(mrBakPath)) {
      fs.copyFileSync(mrBakPath, mrPath);
      console.log("Successfully restored mr/translation.json from backup");
    }
  }

  // 2. Repair Bengali (bn)
  const bnPath = path.join(localesDir, "bn/translation.json");
  if (!fs.existsSync(bnPath)) {
    const bnBakPath = path.join(localesDir, "bn/translation.json.bak");
    if (fs.existsSync(bnBakPath)) {
      fs.copyFileSync(bnBakPath, bnPath);
      console.log("Successfully restored bn/translation.json from backup");
    }
  }
} catch (error) {
  console.error("Auto-heal in tailwind.config failed:", error);
}

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
        "3xl": "1920px",
        "4xl": "2560px",
        "5xl": "3840px",
      },
    },
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        kiosk: {
          navy: "hsl(var(--kiosk-navy))",
          saffron: "hsl(var(--kiosk-saffron))",
          teal: "hsl(var(--kiosk-teal))",
          green: "hsl(var(--kiosk-green))",
          surface: "hsl(var(--kiosk-surface))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 3s ease-in-out infinite",
        "slide-up": "slide-up 0.5s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
