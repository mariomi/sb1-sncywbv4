/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Veneziana', 'Playfair Display', 'serif'],
      },
      colors: {
        venetian: {
          brown: '#5C4033',
          gold: '#D4AF37',
          sandstone: '#E6D5B8',
          green: '#708D81',
          terracotta: '#9E4638',
          text: '#2D1B14',
        },
      },
    },
  },
  plugins: [],
};