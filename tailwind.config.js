/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#000000',
          soft: '#0d0d0d',
          card: '#161616',
          elevated: '#1f1f1f',
        },
        brand: {
          pink: '#ff3d7a',
          lime: '#d6ff3a',
          mint: '#3affd3',
        },
      },
      fontFamily: {
        sans: ['Heebo', 'system-ui', 'sans-serif'],
        serif: ['"Frank Ruhl Libre"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
