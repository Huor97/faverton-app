// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  {
    rules: {
      '@typescript-eslint/consistent-type-imports': [`error`, { prefer: `type-imports` }],
      '@stylistic/semi': [`error`, `always`],
      '@stylistic/quotes': [`error`, `backtick`],
      'import/no-unresolved': `off`,
      'import/named': `off`,
    },
  },
  {
    files: [`**/*.spec.ts`],
    rules: {
      '@typescript-eslint/ban-ts-comment': `off`,
      '@typescript-eslint/no-explicit-any': `off`,
    },
  },
);
