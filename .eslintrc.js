module.exports = {
  env: {
    node: true,
    // browser: true,
    commonjs: true,
    es2021: true
  },
  extends: ['airbnb-base', 'prettier'],
  parser: '@babel/eslint-parser',

  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    requireConfigFile: false
  },
  plugins: ['prettier'],
  ignorePatterns: ['assets/js/*.js', '*.spec.js', '*.test.js'],
  rules: {
    'no-await-in-loop': 'off',
    'no-console': 'off',
    'no-underscore-dangle': 'off',
    'no-use-before-define': ['error', { functions: false, classes: true }],
    'prettier/prettier': 'error'
  }
};
