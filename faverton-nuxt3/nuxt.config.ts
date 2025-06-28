// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    `@nuxt/eslint`,
    `@nuxt/ui`,
    `@nuxt/devtools`,
    `@nuxtjs/supabase`,
    `@tresjs/nuxt`,
    `@nuxtjs/leaflet`,
    `@pinia/nuxt`,
    `@nuxtjs/cloudinary`,
    `@nuxt/test-utils/module`,
    `@nuxt/image`,
    `@nuxtjs/device`,
  ],

  devtools: { enabled: true },
  app: {
    pageTransition: { name: `page`, mode: `out-in` },
  },

  css: [
    `~/assets/css/main.css`,
  ],

  colorMode: {
    preference: `light`,
  },

  ui: {
    global: true,
  },

  future: { compatibilityVersion: 4 },
  compatibilityDate: `2024-04-03`,
  eslint: {
    config: {
      stylistic: true,
    },
  },
  supabase: {
    url: process.env.NUXT_PUBLIC_SUPABASE_URL,
    key: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
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
