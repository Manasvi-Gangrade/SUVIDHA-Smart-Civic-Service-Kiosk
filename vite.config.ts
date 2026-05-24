import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs";

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
  console.error("Auto-heal failed:", error);
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8000,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve("src"),
    },
  },
}));
