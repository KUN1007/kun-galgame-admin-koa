module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2022: true,
  },
  extends: ['standard-with-typescript', 'prettier'],
  plugins: ['prettier'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    project: './tsconfig.json',
  },
  rules: {
    'prettier/prettier': 'error',
    'no-unused-vars': 'warn',
    'consistent-return': 'error',
    'no-async-promise-executor': 'error',
  },
}
