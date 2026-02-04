import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
  test: {
    environment: `nuxt`,
    exclude: [`tests/e2e/**/*`],
    globals: true,
    environmentOptions: {
      nuxt: {
        mock: {
          intersectionObserver: true,
          indexedDb: true,
        },
      },
    },
  },
  resolve: {
    alias: {
      '~/': new URL(`./app/`, import.meta.url).pathname,
      '@/': new URL(`./app/`, import.meta.url).pathname,
    },
  },
});