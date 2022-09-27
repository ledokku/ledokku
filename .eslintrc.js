export default {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jest', 'prettier'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/no-explicit-any': ['off'],
    "@typescript-eslint/explicit-function-return-type": ["error"],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    "unused-imports/no-unused-imports": "error",
    semi: ['error', 'always'],
    'prettier/prettier': [
      'warn',
      {
        singleQuote: true,
        arrowParens: "avoid"
      }
  ],
  },
};
