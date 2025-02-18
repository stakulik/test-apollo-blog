const TS_CONFIG_JSON_PATH = './tsconfig.eslint.json';

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    tsconfigRootDir: __dirname,
    project: [TS_CONFIG_JSON_PATH],
  },
  plugins: [
    '@typescript-eslint',
    'import',
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: [TS_CONFIG_JSON_PATH],
      },
    },
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  env: {
    node: true,
  },
  // Places where you can see the definitions of rules
  // https://eslint.org/docs/rules/
  // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin
  // https://github.com/lo1tuma/eslint-plugin-mocha/tree/6f2c6287cdb841f73bd440aeed2a2ca375185d9c/docs/rules
  // https://github.com/ihordiachenko/eslint-plugin-chai-friendly
  // https://github.com/import-js/eslint-plugin-import
  rules: {
    'import/no-unresolved': 'error', // turn on errors for missing imports
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',

    '@typescript-eslint/lines-between-class-members': ['error', 'always', {
      exceptAfterOverload: true,
      exceptAfterSingleLine: true,
    }],
    '@typescript-eslint/no-empty-interface': ['error', {
      allowSingleExtends: true,
    }],
    '@typescript-eslint/naming-convention': ['error', {
      selector: [],
      format: ['PascalCase', 'camelCase', 'UPPER_CASE', 'snake_case'],
    },{
      selector: ['interface'],
      format: ['PascalCase'],
    }
    ],
    '@typescript-eslint/require-await': 'off',
    "@typescript-eslint/ban-ts-comment": 'off',
    // for 'any' type
    '@typescript-eslint/no-unsafe-call': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-unsafe-return': 'warn',
    '@typescript-eslint/no-unsafe-argument': 'warn',
    '@typescript-eslint/unbound-method': 'off',

    'no-constant-condition': ['error', {
      checkLoops: false,
    }],
    'arrow-parens': 'off',
    'class-methods-use-this': 'off',
    'no-await-in-loop': 'off',
    'no-restricted-syntax': ['error', 'ForInStatement'],
    'no-else-return': ['error', { allowElseIf: true }],
    'no-underscore-dangle': ['off'],
    'func-names': 'off',
    'require-await': 'off',
    'consistent-return': 'off',
    'max-len': ['error', { 'code': 120 }],
  },
}
