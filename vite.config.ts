import { defineConfig, lazyPlugins } from 'vite-plus';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  // Use relative asset URLs so the build works both as an extension popup and as a static website
  // served from any path.
  base: './',
  fmt: { singleQuote: true, ignorePatterns: ['**/*.md'] },
  lint: {
    plugins: ['react', 'typescript', 'oxc'],
    rules: {
      'react/rules-of-hooks': 'error',
      'react/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
        },
      ],
      'vite-plus/prefer-vite-plus-imports': 'error',
    },
    options: {
      typeAware: true,
      typeCheck: true,
    },
    jsPlugins: [
      {
        name: 'vite-plus',
        specifier: 'vite-plus/oxlint-plugin',
      },
    ],
  },
  plugins: lazyPlugins(() => [react()]),
});
