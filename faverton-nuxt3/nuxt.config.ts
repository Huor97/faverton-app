// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    `@nuxt/eslint`,
    `@nuxt/ui`,
    `@nuxt/devtools`,
    `@nuxtjs/supabase`,
    `@tresjs/nuxt`,
    `@nuxtjs/leaflet`,
    `@hebilicious/vue-query-nuxt`,
    `vuetify-nuxt-module`,
    `@pinia/nuxt`,
  ],
  devtools: { enabled: true },
  app: {
    pageTransition: { name: `page`, mode: `out-in` },
  },

  colorMode: {
    preference: `light`,
  },
  future: { compatibilityVersion: 4 },

  compatibilityDate: `2024-04-03`,
  eslint: {
    config: {
      stylistic: true,
    },
  },
  leaflet: {
    heat: true,
  },
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
});
