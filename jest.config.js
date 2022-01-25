module.exports = {
  preset: 'ts-jest',
  roots: ['<rootDir>/src'],
  // See https://github.com/kulshekhar/ts-jest/issues/748 for why we've silenced the warning.
  globals: {
    'ts-jest': {
      diagnostics: {
        ignoreCodes: [151001],
      },
    },
  },
};
