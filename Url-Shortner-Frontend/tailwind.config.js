/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0B1220", // Navy
        accent: "#4F46E5", // Indigo
        accentBlue: "#2563EB", // Blue
        bgColor: "#F8FAFC", // Light BG
        surface: "#FFFFFF",
        textMain: "#0F172A",
        textSecondary: "#64748B",
        borderColor: "#E2E8F0",
        success: "#16A34A",
        error: "#DC2626",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'card': '0 0 0 1px rgba(0,0,0,.05), 0 2px 4px rgba(0,0,0,.02)',
      }
    },
  },
  plugins: [],
};
