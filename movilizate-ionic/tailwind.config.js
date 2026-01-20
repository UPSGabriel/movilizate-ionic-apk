/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'movilizate-red': '#7b1214',
        'movilizate-dark': '#2d2d2d',
        'movilizate-light': '#f8f9fa',
      },
      boxShadow: {
        'card': '0 10px 30px -5px rgba(123, 18, 20, 0.15)',
      }
    },
  },
  plugins: [],
}
