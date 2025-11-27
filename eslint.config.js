import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules', 'tests/**/*.ts']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Allow unused parameters with underscore prefix
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      // Allow require imports in specific contexts
      '@typescript-eslint/no-require-imports': 'off',
      // Allow lexical declarations in case blocks
      'no-case-declarations': 'off',
    },
  },
  {
    // Specific rules for AR foundation code
    files: ['src/core/**/*.ts', 'src/platform/**/*.ts', 'src/samples/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off', // Allow unused vars in foundation code
    },
  },
])
