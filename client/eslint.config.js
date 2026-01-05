// eslint.config.js
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('@angular-eslint/eslint-plugin');

module.exports = tseslint.config(
  // Global ignores (optional but recommended)
  {
    ignores: ['**/*.spec.ts', 'projects/**/*', 'node_modules/**/*'],
  },

  // TypeScript files
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: true,                  // Enables full TS parsing + decorators
        tsconfigRootDir: __dirname,     // Critical for resolving tsconfig.json
      },
    },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      angular.configs.tsRecommended, // ← This one is an OBJECT, do NOT spread
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],
    },
  },

  // HTML template files
  {
    files: ['**/*.html'],
    extends: [
      angular.configs.templateRecommended,
      angular.configs.templateAccessibility,
    ],
    rules: {},
  }
);