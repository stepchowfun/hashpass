const path = require('node:path');

const { includeIgnoreFile, fixupConfigRules } = require('@eslint/compat');
const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');

const legacyConfig = require('./.eslintrc.js');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = [
  includeIgnoreFile(
    path.join(__dirname, '.gitignore'),
    'Imported .gitignore patterns',
  ),
  ...fixupConfigRules(compat.config(legacyConfig)),
];
