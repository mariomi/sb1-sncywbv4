/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Host Grotesk', 'Manrope', 'sans-serif'],
        serif: ['Roslindale Variable', 'Cormorant Garamond', 'Georgia', 'serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        venetian: {
          brown: '#171415',
          gold: '#D1AC65',
          sandstone: '#E0DED1',
          green: '#66695A',
          terracotta: '#A44732',
          text: '#231F20',
        },
      },
    },
  },
  plugins: [],
};
