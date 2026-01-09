import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        // Brand colors are already available via Tailwind defaults
        // blue-600: #2563EB (Primary)
        // blue-700: #1D4ED8 (Primary Hover)
        // blue-100: #DBEAFE (Primary Light)
      },
    },
  },
  plugins: [],
};

export default config;
