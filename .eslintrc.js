module.exports = {
  parser: 'babel-eslint',
  plugins: ['flowtype'],
  extends: ['airbnb', 'prettier', 'prettier/flowtype', 'prettier/react'],
  env: {
    browser: true,
  },
  rules: {
    'flowtype/boolean-style': [2, 'boolean'],
    'flowtype/define-flow-type': 1,
    'flowtype/no-primitive-constructor-types': 2,
    'flowtype/no-types-missing-file-annotation': 2,
    'flowtype/no-weak-types': 2,
    'flowtype/require-parameter-type': [2, { excludeArrowFunctions: true }],
    'flowtype/require-valid-file-annotation': 2,
    'flowtype/type-id-match': [2, '^[A-Z]+.*$'],
    'flowtype/use-flow-type': 1,
    'flowtype/valid-syntax': 1,
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
  },
  settings: {
    flowtype: {
      onlyFilesWithFlowAnnotation: false,
    },
  },
};
