import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: `./app/tests/e2e`,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    [`html`, { outputFolder: `playwright-report` }],
    [`json`, { outputFile: `test-results/results.json` }],
    [`github`], // Pour l'intégration GitHub
  ],

  use: {
    baseURL: `http://localhost:3000`,
    trace: `retain-on-failure`,
    screenshot: `only-on-failure`,
    video: `retain-on-failure`,

    // Variables pour les mocks
    extraHTTPHeaders: {
      'X-Test-Mode': `true`,
    },
  },

  projects: [
    {
      name: `chromium`,
      use: { ...devices[`Desktop Chrome`] },
    },
  ],

  webServer: {
    command: `pnpm preview`,
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      NODE_ENV: `test`,
    },
  },
});
