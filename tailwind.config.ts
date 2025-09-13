/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  prefix: "",
  content: [
    "./src/**/*.{astro,html,js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
  }
}