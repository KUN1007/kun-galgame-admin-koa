module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2022: true
  },
  extends: ['standard-with-typescript'],
  overrides: [
    {
      env: {
        node: true
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    project: './tsconfig.json'
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/unbound-method': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/space-before-function-paren': 'off',
    '@typescript-eslint/naming-convention': 'off',
    // Unsafe TODO:
    '@typescript-eslint/no-unsafe-argument': 'off',
    'no-unused-vars': 'off',
    'consistent-return': 'off',
    'no-async-promise-executor': 'error'
  }
}
