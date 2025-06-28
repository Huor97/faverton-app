// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  {
    rules: {
      '@stylistic/semi': ['error', 'always'],
      // Utilisation de guillemets simples au lieu de backticks pour éviter les conflits avec defineModel
      '@stylistic/quotes': ['error', 'single'],
    },
  },
);
