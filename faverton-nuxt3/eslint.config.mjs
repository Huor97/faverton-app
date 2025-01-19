// @ts-check
// import withNuxt from './.nuxt/eslint.config.mjs';

// export default withNuxt(
//   {
//     rules: {
//       '@stylistic/semi': [`error`, `always`],
//       '@stylistic/quotes': [`error`, `backtick`],
//     },
//   },
// );

// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
  rules: {
    '@typescript-eslint/no-unused-vars': [`error`, { argsIgnorePattern: `^_` }],
    'import/no-unresolved': `off`,
    'import/named': `off`,
  },
  settings: {
    'import/resolver': {
      typescript: true,
      node: true,
    },
  },
});
