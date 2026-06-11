const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'htapp-dark': '#0f0f1e',
        'htapp-light': '#f5f5f5',
        'htapp-purple': '#9d4edd',
        'htapp-pink': '#e0aaff',
      },
      fontFamily: {
        sans: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}
