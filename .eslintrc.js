module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],

  parserOptions: {
    parser: 'babel-eslint'
  },

  rules: {
    indent: 'off',
 'space-before-function-paren': 0,
    semi: ['error', 'always'],
    'eol-last': 0
  },

  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ]
}
