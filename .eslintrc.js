module.exports = {
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/interface-name-prefix': ['error', 'always'],
  },
};
