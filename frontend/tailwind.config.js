/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        celo: {
          gold: '#FBCC5C',
          green: '#35D07F',
          dark: '#111214',
        }
      }
    },
  },
  plugins: [],
}
