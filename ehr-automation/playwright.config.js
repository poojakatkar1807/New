require('dotenv').config();
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({

  testDir: './tests',

  globalSetup:    './config/globalSetup.js',
  globalTeardown: './config/globalTeardown.js',

  timeout: 60000,

  expect: {
    timeout: 10000
  },

  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 2 : 4,

  reporter: [
    ['html', { outputFolder: 'reports/html-report', open: 'never' }],
    ['json', { outputFile: 'reports/results.json' }],
    ['list']
  ],

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }
  ],

  // Start the EHR app before running tests
  webServer: {
    command: 'node ../ehr-application/server.js',
    port: 3000,
    reuseExistingServer: true,
    timeout: 10000
  },

  outputDir: 'reports/test-artifacts'
});
