import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f4f7ef",
          100: "#e6eedb",
          200: "#cddcaf",
          300: "#b1ca7f",
          400: "#96b85a",
          500: "#75973f",
          600: "#5a7830",
          700: "#455b26",
          800: "#33431d",
          900: "#222d14"
        },
        accent: "#d97706"
      }
    }
  },
  plugins: []
} satisfies Config;
