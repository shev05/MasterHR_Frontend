import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import unusedImports from 'eslint-plugin-unused-imports';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import simpleSortImports from 'eslint-plugin-simple-import-sort';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'simple-import-sort': simpleSortImports,

      react: react,
      import: importPlugin,
      'unused-imports': unusedImports,
    },
    settings: {
      'import/resolver': {
        typescript: {
          // This loads your tsconfig.json to ESLint
          alwaysTryTypes: true, // (Optional) Improves resolution for types
        },
      },
    },
    rules: {
      // ========== Стиль кода ==========
      // Запрещает избыточное закрытие JSX-компонентов
      // Пример плохо: <Component></Component>
      // Пример хорошо: <Component />
      'react/self-closing-comp': 'error',

      // Запрещает console.log, но разрешает console.warn и console.error
      // Это помогает избежать случайных логов в продакшене
      'no-console': ['error', { allow: ['warn', 'error', 'debug'] }],

      // ========== Переменные ==========
      // Отключает стандартную проверку неиспользуемых переменных (для TypeScript)
      'no-unused-vars': ['off', {}],

      // TypeScript-версия проверки неиспользуемых переменных с тонкой настройкой:
      // - Проверяет все аргументы функций, кроме тех, что начинаются с _ (например, _unused)
      // - Игнорирует ошибки в catch, если они начинаются с _
      // - Игнорирует неиспользуемые элементы деструктуризации, если начинаются с _
      // - Игнорирует неиспользуемые переменные, если начинаются с _
      // - Игнорирует "лишние" свойства в rest-операторе
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'none',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      // ========== Импорты ==========
      // Запрещает относительные импорты через ../ (предпочитает абсолютные пути)
      // Это помогает избежать проблем с путями при перемещении файлов
      'no-restricted-imports': ['error', { patterns: ['../'] }],

      // Помечает неиспользуемые импорты как ошибки
      // Автоматически помогает чистить код от ненужных зависимостей
      'unused-imports/no-unused-imports': 'error',

      'import/no-unresolved': ['error'],

      // Строгие правила порядка импортов:
      // - Между группами импортов должны быть пустые строки
      // - Группы в порядке: встроенные модули, внешние зависимости, внутренние модули и т.д.
      // Это стандартизирует вид импортов в проекте
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['type'],
        },
      ],
      'react-refresh/only-export-components': ['off', {}],
      '@typescript-eslint/no-unused-expressions': ['off', {}],
    },
  },
]);
