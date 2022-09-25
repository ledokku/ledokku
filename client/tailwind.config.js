const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.ts', './src/**/*.tsx'],
  darkMode: 'media',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        gray: colors.slate,
      },
      width: {
        156: '39rem',
      },
    },
  },
  variants: { extend: {} },
  plugins: [require('@tailwindcss/forms')],
};
