// tailwind.config.ts
import animate from "tailwindcss-animate";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import aspectRatio from "@tailwindcss/aspect-ratio";
import { type Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./ui/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#A64CFF",
          foreground: "#F2E5FF",
          muted: "#D9B3FF",
        },
        warning: {
          DEFAULT: "#FFC34C",
          foreground: "#FFF2E5",
          muted: "#FFE6B3",
        },
        success: {
          DEFAULT: "#6CE0A6",
          foreground: "#EEFFEF", // correction probable
          muted: "#C0F2D9",
        },
        error: {
          DEFAULT: "#FF4C6A",
          foreground: "#FFE5EA",
          muted: "#FFB3BF",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)","Inter", "sans-serif"],
      },
      fontSize: {
        h1: ["32px", { lineHeight: "120%", fontWeight: "700" }],
        h2: ["24px", { lineHeight: "120%", fontWeight: "700" }],
        h3: ["16px", { lineHeight: "120%", fontWeight: "700", textTransform: "uppercase" }],
        main: ["14px", { lineHeight: "150%", fontWeight: "500" }],
        small: ["12px", { lineHeight: "120%", fontWeight: "500" }],
        caption: ["10px", { lineHeight: "120%", fontWeight: "700", textTransform: "uppercase" }],
      },
      spacing: {
        1: "8px",
        2: "16px",
        3: "24px",
        4: "32px",
        5: "40px",
        6: "48px",
        7: "56px",
        8: "64px",
        9: "80px",
        10: "120px",
      },
      borderRadius: {
        lg: "12px",
        xl: "16px",
        "2xl": "24px",
      },
    },
  },
  darkMode: false, // ou 'class' si tu changes d’avis
  plugins: [
    animate,
    forms,
    typography,
    aspectRatio,
  ],
};
export default config;
