import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
  // any custom Vitest config you require
  test: {
    environment: `nuxt`,
    exclude: [`app/tests/e2e/**/*`],
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
