/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/*.handlebars",
    ".views/*.html"
  ],
  theme: {
    screens: {
      'sm': {'min': '320px', 'max': '640px'},
      'md': {'min': '768px', 'max': '1023px'},
      'lg': {'min': '1024px', 'max': '1279px'},
      'xl': {'min': '1280px', 'max': '1535px'},
      '2xl': {'min': '1536px'},
    },
    extend: {
      fontFamily: {
        'babas': ['"Bebas Neue"', 'cursive'],
        'graduate': ['"Graduate"', 'cursive'],
        'righteous': ['"Righteous"', 'serif'],
      }
    },
  },
    container: {
      center: true,
      padding: "1rem"
    },
  daisyui:{
    themes: ["light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter"],
  },
  variants: {},
  plugins: [require("daisyui")],
}