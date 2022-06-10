// // "next" extends recommended rule sets from various ESLint plugins: eslint-plugin-react, eslint-plugin-react-hooks, eslint-plugin-next
module.exports = {
  extends: ['next', 'plugin:jsx-a11y/recommended', 'next/core-web-vitals', 'prettier'],
  rules: {
    'prefer-const': 'error',
    'no-console': 'error',
    'no-unused-vars': 'error',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    '@next/next/no-img-element': 'off',
    'react/no-unescaped-entities': 'off', // disabling this allows us to use aprostrophes
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'no-unused-vars': 'off', // https://stackoverflow.com/a/55439681/2627434
    '@typescript-eslint/no-unused-vars': 'error', // linked to line above ^
    'jsx-a11y/no-autofocus': 'off', // used to allow autofocus on form elements
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'], // accessibilty fix for Next.js Link tag
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton'],
      },
    ],
  },
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['**/*.spec.{js,jsx,ts,tsx}', '**/*.test.{js,jsx,ts,tsx}'],
      env: {
        jest: true,
      },
    },
  ],
}
