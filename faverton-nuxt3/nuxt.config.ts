// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  devtools: { enabled: true },
  app: {
    pageTransition: { name: `page`, mode: `out-in` },
  },
  modules: [
    `@nuxt/eslint`,
    `@nuxt/ui`,
    `@nuxt/devtools`,
    `@nuxtjs/supabase`,
    `@tresjs/nuxt`,
  ],
  supabase: {
    redirectOptions: {
      login: `/`, // Désactive la redirection vers la page de connexion
      callback: `/confirm`, // Garde la redirection vers la page de callback
      include: undefined,
      exclude: [`/`, `/introduction`], // N'applique pas de redirection pour cette page
      cookieRedirect: false,
    },
  },
  tres: {
    glsl: true,
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },

  colorMode: {
    preference: `light`,
  },

  compatibilityDate: `2024-04-03`,
});
