import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import prettier from 'eslint-plugin-prettier';
import pluginSecurity from 'eslint-plugin-security';
import pluginPromise from 'eslint-plugin-promise';
import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';
import importPlugin from 'eslint-plugin-import';
import oxlint from 'eslint-plugin-oxlint';

export default tseslint.config(
  eslint.configs.recommended,
  prettierConfig,
  ...tseslint.configs.recommended,
  pluginSecurity.configs.recommended,
  pluginPromise.configs['flat/recommended'],
  importPlugin.flatConfigs.recommended,
  ...oxlint.buildFromOxlintConfigFile('./.oxlintrc.json'),
  {
    plugins: {
      prettier: prettier,
      'unused-imports': unusedImports,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'prettier/prettier': 'error',
      'array-callback-return': 'error',
      'no-empty': [
        'error',
        {
          allowEmptyCatch: true,
        },
      ],
      'no-lonely-if': 'error',
      'no-var': 'error',
      'prefer-const': [
        'error',
        {
          destructuring: 'all',
          ignoreReadBeforeAssign: false,
        },
      ],
      'prefer-destructuring': [
        'error',
        {
          object: true,
          array: false,
        },
      ],
      'prefer-spread': 'error',
      radix: 'error',
      strict: 'error',
      quotes: ['error', 'single', { avoidEscape: true }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
    },
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
  },
  {
    files: ['{src,test}/*.{js,ts}', 'eslint.config.mjs', 'prettier.config.mjs', 'vite.config.ts'],
    languageOptions: {
      sourceType: 'module',
    },
  },
  {
    ignores: ['{src,test}/**/*.d.ts', '{src,test,dist}/**/*.js', '{src,test,dist}/*.js', 'node_modules/**/*.{js,mjs,cjs,ts}', 'vite.config.js'],
  }
);
