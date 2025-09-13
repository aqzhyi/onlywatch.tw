import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'
import z from 'zod'
import { envPublicSchema } from '~/schemas/envPublicSchema'

dotenv.config({ path: './.env.local' })

const env = Object.freeze(
  z
    .object({
      CI: envPublicSchema.shape.CI,
      CI_CORES: envPublicSchema.shape.CI_CORES,
      NODE_ENV: z.string().default('test'),
    })
    .readonly()
    .parse(process.env),
)

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testMatch: ['**/*.e2e.ts', '**/*.e2e.tsx'],
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!env.CI,
  /* Retry on CI only */
  retries: env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: env.CI_CORES > 0 ? env.CI_CORES : 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['iPhone X'] },
    },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'pnpm run build && pnpm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !env.CI,
  },
})
