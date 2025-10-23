import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // This section adds our custom fonts
      fontFamily: {
        caladea: ['var(--font-caladea)'],
        lato: ['var(--font-lato)'],
        bebas: ['var(--font-bebas-neue)'],
      },
    },
  },
  plugins: [],
};
export default config;