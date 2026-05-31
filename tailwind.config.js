/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    fontFamily: {
      sans: ['var(--font-noto-sans)', 'sans-serif'],
      serif: ['var(--font-tiro-devanagari)', 'serif'],
    },
    extend: {
      spacing: {
        page: '45rem'
      }
    }
  },
  plugins: []
}
