module.exports = {
  root: true,
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    camelcase: 0,
    'linebreak-style': 0,
    'no-console': 0,
    'no-unused-vars': 0,
    'func-names': 0,
  },
};
