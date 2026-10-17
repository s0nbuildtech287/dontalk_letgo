/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif']
      },
      colors: {
        brand: {
          base: '#FAF7F2',
          coral: '#FF6B4A',
          coralHover: '#E85736',
          coralLight: '#FFEBE6',
          text: '#2B2B2B',
          muted: '#736E66',
          darkBg: '#141210',
          darkSurface: '#1F1C19'
        }
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px'
      }
    },
  },
  plugins: [],
}
