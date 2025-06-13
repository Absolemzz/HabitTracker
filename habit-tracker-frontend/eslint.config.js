//ESlint config for TypeScript and React

import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],

    /* Tell the parser we’re in the browser and using modern JSX/TSX */
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: globals.browser,
    },

    /* Register plugins in flat-config style */
    plugins: {
      js: pluginJs,
      '@typescript-eslint': tseslint.plugin,
      react: pluginReact,
      'react-hooks': pluginReactHooks,
    },

    /* Merge recommended rules, then tweak what matters */
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...tseslint.configs.recommended[0].rules,
      ...tseslint.configs.recommended[1].rules,
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,

      // We use TypeScript, so prop-types aren’t needed
      'react/prop-types': 'off',

      // New JSX transform (React 17+) doesn’t require React in scope
      'react/react-in-jsx-scope': 'off',

      /* Allow unused variables/params that start with “_” (handy for TODOs) */
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },

    settings: {
      react: { version: 'detect' },
    },
  },

  /* Prettier disables stylistic rules that might conflict with formatting */
  prettier,
];

