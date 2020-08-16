const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: ['./src/**/*.ts', './src/**/*.tsx'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
    minWidth: {
      '0': '0',
      '7': '7rem',
      full: '100%',
    },
  },
  variants: {},
  plugins: [require('@tailwindcss/ui')],
};
