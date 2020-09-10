module.exports = {
    root: true,
    env: {
      browser: true,
      node: true
    },
    parserOptions: {
      parser: 'babel-eslint'
    },
    extends: [
        "plugin:vue/essential",
        "extends:airbnb-base",
    ],
    rules: {
      // Disabled as eslint can't understand ~/path syntax
      'import/no-unresolved': 0,
      // Disabled as it gets confused with paths that it can't resolve.
      'import/extensions': 0,
  
      // Change line length from 100 -> 120 to have consistency with PHP
      'max-len': ['error', 120],
  
      'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
      'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
    },
  };