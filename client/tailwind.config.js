const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./src/**/*.ts', './src/**/*.tsx'],
  darkMode: false,
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        gray: colors.blueGray,
      },
      width: {
        156: '39rem',
      },
    },
  },
  variants: { extend: {} },
  plugins: [require('@tailwindcss/forms')],
};
