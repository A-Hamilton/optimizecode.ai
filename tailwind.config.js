/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#646cff",
          dark: "#535bf2",
          light: "#747bff",
        },
        background: {
          DEFAULT: "#242424",
          light: "#2d2d2d",
          card: "rgba(255, 255, 255, 0.05)",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "Avenir",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        mono: ["Monaco", "Menlo", "Ubuntu Mono", "monospace"],
      },
      animation: {
        "spin-slow": "spin 1s linear infinite",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
