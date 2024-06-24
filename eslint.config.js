import antfu from '@antfu/eslint-config';

export default antfu(
  {
    markdown: false,
    yaml: false,
    ignores: [
      `*/storybook-static/*`,
    ],
  },
  {
    rules: {
      'style/semi': [`error`, `always`],
      'style/quotes': [`error`, `backtick`],
      'antfu/if-newline': `off`,
      // to support Vuetify DataTable items slot
      'vue/valid-v-slot': [`error`, { allowModifiers: true }],
      // activate later
      'test/consistent-test-it': `off`,
      'vue/custom-event-name-casing': [`error`, `camelCase`, { ignores: [`click:clear`] }],
      'vue/no-required-prop-with-default': [`error`],
    },
  },
  {
    files: [`**/*.stories.ts`],
    rules: {
      'style/quotes': [`error`, `single`],
      // Make it easy to override some TS thingy during story writing
      'ts/ban-ts-comment': 0,
    },
  },
  {
    files: [`**/*.spec.ts`],
    rules: {
      'no-irregular-whitespace': `off`,
      'vue/no-irregular-whitespace': `off`,
      // Make it easy to override some TS thingy during tests
      'ts/ban-ts-comment': `off`,
    },
  },
  {
    files: [`**/__mocks__/**/*.json`],
    rules: {
      'jsonc/no-useless-escape': `off`,
    },
  },
  {
    files: [`**/phrase-locales/*.json`],
    rules: {
      'style/eol-last': `off`,
      'no-irregular-whitespace': `off`,
      'vue/no-irregular-whitespace': `off`,
    },
  },
);
