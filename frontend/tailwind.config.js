export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0d9488",
        "primary-light": "#ccfbf1",
        "primary-dark": "#0f766e",
        secondary: "#f0fdfa",
        accent: "#f59e0b",
        border: "#e5e7eb",
      },
      boxShadow: {
        card:
          "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
      },
    },
  },
  plugins: [],
};