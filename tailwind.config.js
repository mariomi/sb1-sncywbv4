/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      colors: {
        venetian: {
          brown: '#191612',
          gold: '#C59A52',
          sandstone: '#F1E8D8',
          green: '#68705A',
          terracotta: '#B44732',
          text: '#211D18',
        },
      },
    },
  },
  plugins: [],
};
