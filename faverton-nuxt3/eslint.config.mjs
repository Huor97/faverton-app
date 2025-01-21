// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  {
    rules: {
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

// @ts-check
// import withNuxt from './.nuxt/eslint.config.mjs';

// export default withNuxt({
//   rules: {
//     '@stylistic/semi': [`error`, `always`],
//     // '@typescript-eslint/no-unused-vars': [`error`, { argsIgnorePattern: `^_` }],
//     'import/no-unresolved': `off`,
//     'import/named': `off`,
//   },
//   settings: {
//     'import/resolver': {
//       typescript: true,
//       node: true,
//     },
//   },
// });
