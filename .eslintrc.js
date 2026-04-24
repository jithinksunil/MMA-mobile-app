/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.json',
  },
  env: {
    es2022: true,
    'react-native/react-native': true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'react-native',
    'sonarjs',
    'prettier',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime', // React 17+ JSX transform — no need to import React
    'plugin:react-hooks/recommended',
    'plugin:sonarjs/recommended-legacy',
    'plugin:prettier/recommended', // Must be last — disables conflicting rules & enables prettier/prettier
  ],
  rules: {
    // ── Prettier ──────────────────────────────────────────────────────────
    'prettier/prettier': 'error',

    // ── TypeScript ────────────────────────────────────────────────────────
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
    ],

    // ── React ─────────────────────────────────────────────────────────────
    'react/prop-types': 'off', // TypeScript handles this
    'react/display-name': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // ── React Native ──────────────────────────────────────────────────────
    'react-native/no-unused-styles': 'warn',
    'react-native/split-platform-components': 'warn',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-color-literals': 'warn',
    'react-native/no-raw-text': 'warn',

    // ── SonarJS ───────────────────────────────────────────────────────────
    'sonarjs/no-duplicate-string': 'warn',
    'sonarjs/no-identical-functions': 'warn',
    'sonarjs/cognitive-complexity': ['warn', 15],

    // ── General ───────────────────────────────────────────────────────────
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    eqeqeq: ['error', 'always'],
    'no-var': 'error',
    'prefer-const': 'error',
  },
  overrides: [
    {
      // Relax type-checked rules for plain JS/config files
      files: ['*.js', '*.cjs', '*.mjs'],
      extends: ['plugin:@typescript-eslint/disable-type-checked'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      // Test files
      files: ['**/__tests__/**/*', '**/*.test.*', '**/*.spec.*'],
      env: { jest: true },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'sonarjs/no-duplicate-string': 'off',
      },
    },
  ],
};
