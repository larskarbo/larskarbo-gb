const colors = require('tailwindcss/colors');

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  // darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        serif:
          '"Merriweather", "Georgia", Cambria, "Times New Roman", Times, serif',
        sans: [
          "Montserrat",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
      colors: {
        gray: colors.stone,
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // ...
  ],
}
