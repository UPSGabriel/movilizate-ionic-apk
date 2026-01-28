/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Color vino exacto tomado de la foto de la tarjeta
        'movilizate-red': '#7b1214',
        // Un gris oscuro para textos, más elegante que el negro puro
        'movilizate-dark': '#2d2d2d',
        // Un gris claro para fondos
        'movilizate-light': '#f8f9fa',
      },
      boxShadow: {
        // Sombra estilo "tarjeta flotando"
        'card': '0 10px 30px -5px rgba(123, 18, 20, 0.15)',
      }
    },
  },
  plugins: [],
}
