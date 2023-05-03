/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    fontFamily: {
      sans: ['Noto Sans', 'sans-serif'],
      serif: ['Tiro Devanagari Hindi', 'serif'],
    },
    extend: {
      spacing: {
        page: '45rem'
      }
    }
  },
  plugins: []
}
