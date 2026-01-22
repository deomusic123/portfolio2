import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  plugins: [addVariablesForColors],
};

// Plugin crítico para Aceternity UI
// Inyecta variables de color en :root para compatibilidad con componentes heredados
function addVariablesForColors({ addBase, theme }: any) {
  const { default: flattenColorPalette } = require("tailwindcss/lib/util/flattenColorPalette");
  
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}

export default config;
