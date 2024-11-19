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
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirectOptions: {
      login: `/login`,
      callback: `/confirm`,
      include: [`register`],
      exclude: [`/`, `/introduction`, `confirm`],
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
