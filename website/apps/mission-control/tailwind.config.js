/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        green: {
          950: '#0a0f0a',
        }
      },
      fontFamily: {
        mono: ['Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}