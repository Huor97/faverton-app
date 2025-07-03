// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/devtools',
    '@nuxtjs/supabase',
    '@tresjs/nuxt',
    '@nuxtjs/leaflet',
    '@pinia/nuxt',
    '@nuxtjs/cloudinary',
    '@nuxt/test-utils/module',
    '@nuxt/image',
    '@nuxtjs/device',
    '@nuxtjs/google-fonts',
  ],

  devtools: { enabled: true },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: {
        lang: 'fr',
      },
    },
  },

  colorMode: {
    preference: 'light',
  },

  future: { compatibilityVersion: 4 },
  compatibilityDate: '2024-04-03',
  eslint: {
    config: {
      stylistic: true,
    },
  },

  googleFonts: {
    families: {
      'Roboto': true,
      'Inter': '200..700',
      'Josefin+Sans': true,
      'Lato': [100, 300],
      'Raleway': {
        wght: [100, 400],
        ital: [100],
      },
      'Crimson Pro': {
        wght: '200..900',
        ital: '200..700',
      },
    },
  },
  supabase: {
    url: process.env.NUXT_PUBLIC_SUPABASE_URL,
    key: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      include: ['register'],
      exclude: ['/', '/introduction', 'confirm'],
      cookieRedirect: false,
    },
  },
  tres: {
    glsl: true,
  },
});
