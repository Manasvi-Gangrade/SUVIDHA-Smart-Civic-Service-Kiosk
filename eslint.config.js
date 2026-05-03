import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
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
  console.error("Auto-heal in eslint.config failed:", error);
}

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
);
