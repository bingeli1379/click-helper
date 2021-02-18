module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/recommended',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'linebreak-style': 'off',
    'max-len': ['error', { code: 200 }],
    'vue/max-attributes-per-line': ['error', {
      singleline: 7,
      multiline: {
        max: 1,
        allowFirstLine: false
      }
    }],
    'no-unused-expressions': 'off',
    camelcase: 'off'
  }
}
