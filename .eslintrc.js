module.exports = {
  parser: 'babel-eslint',
  plugins: [ 'flowtype' ],

  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
    node: true
  },

  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },

  extends: [
    'plugin:flowtype/recommended',
    'standard'
  ]
};
