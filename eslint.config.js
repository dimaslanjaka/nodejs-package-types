// eslint.config.js

const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const prettierPlugin = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');
const globals = require('globals');

const prettier = require('./.prettierrc.json');

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  {
    ignores: ['dist/**', 'node_modules/**']
  },

  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ['**/*.{js,ts,tsx}'],

    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.amd
      }
    },

    plugins: {
      '@typescript-eslint': tseslint.plugin,
      prettier: prettierPlugin
    },

    rules: {
      'prettier/prettier': ['error', prettier],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      // disable original eslint unused-vars
      'no-unused-vars': 'off',

      // enable typescript-eslint unused-vars
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],

      // allow any types
      '@typescript-eslint/no-explicit-any': 'off',

      // rules for this binding
      '@typescript-eslint/no-this-alias': [
        'error',
        {
          allowDestructuring: false,
          allowedNames: ['self']
        }
      ],

      // prettier compatibility
      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'off'
    }
  },

  {
    files: ['*.js'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off'
    }
  },

  // must be last
  prettierConfig
];
