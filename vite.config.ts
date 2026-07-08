import { defineConfig, lazyPlugins } from 'vite-plus';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Use relative asset URLs so the build works both as an extension popup and as a static website
  // served from any path.
  base: './',
  fmt: {
    ignorePatterns: ['**/*.md'],
    singleQuote: true,
  },
  lint: {
    categories: {
      correctness: 'deny',
      perf: 'deny',
      restriction: 'deny',
      suspicious: 'deny',
    },
    jsPlugins: [
      {
        name: 'vite-plus',
        specifier: 'vite-plus/oxlint-plugin',
      },
    ],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    plugins: ['oxc', 'react', 'typescript', 'unicorn'],
    rules: {
      'no-undefined': 'allow',
      'oxc/no-async-await': 'allow',
      'react/jsx-filename-extension': 'allow',
      'react/jsx-no-literals': 'allow',
      'react/react-in-jsx-scope': 'allow',
      'react/rules-of-hooks': 'deny',
      'unicorn/require-post-message-target-origin': 'allow',
      'vite-plus/prefer-vite-plus-imports': 'deny',
    },
  },
  plugins: lazyPlugins(() => [react()]),
});
