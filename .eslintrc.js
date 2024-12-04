module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended', // Extend TypeScript rules
  ],
  rules: {
    // Disable unused variables and imports checks
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',

    // Allow the use of `any`
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
