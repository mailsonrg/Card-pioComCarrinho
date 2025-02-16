/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", '*.{html,js}'],
  theme: {
    fontFamily:{
      'sans': ['Poppins', 'sans-serif']

    },
    extend: {
      backgroundImage:{
        "home": "url('/assets/bg.png')"
      }
    },
  },
  plugins: [],
}

