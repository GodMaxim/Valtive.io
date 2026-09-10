// @ts-check
import { defineConfig, devices } from '@playwright/test';
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  timeout: 120000,
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 0 : 0,
  workers: 1,
   maxFailures: undefined,
   reporter: [
    ['html'],
    [
      'playwright-qase-reporter',
      {
      mode: 'testops',
      testops: {
        project: 'VI',
        api: {},
      },
    },
    ],
  ],
  use: {
    headless: true,
    trace: 'off',
    screenshot: 'only-on-failure',
    video: 'off',
    locale: 'en-US',
    storageState: undefined,
    permissions: ['geolocation'],
    bypassCSP: true,
    launchOptions: {
        args: [
         '--disable-blink-features=AutomationControlled',
        '--disable-infobars',
        '--start-maximized',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security', 
        "--disable-translate",
        "--disable-features=Translate",
        "--no-default-browser-check",
        "--lang=en-US"
        ]
    },
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
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
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

