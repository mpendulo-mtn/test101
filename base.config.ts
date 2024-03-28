import { devices, PlaywrightTestConfig } from '@playwright/test';
const uiTestConfig: PlaywrightTestConfig = {
  retries: 0,
  timeout: 900000,
  testDir: 'setup/web/src/tests',
  workers: 5,
  reporter: [
    ['line'],
    ['html'],
    ['allure-playwright', { outputFolder: 'report/test-results/webui-allure-results' }],
  ],
  use: {
    headless: false,
    screenshot: 'on',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      testMatch: ['login-test.ts'],
      use: { ...devices['Desktop Chrome'], headless: false, screenshot: 'off' },
    },
    {
      name: 'firefox',
      testMatch: ['login-test.ts'],
      use: { ...devices['Desktop Firefox'], headless: true },
    },
    {
      name: 'webkit',
      testMatch: ['login-test.ts'],
      use: { ...devices['Desktop Safari'], headless: true },
    },
    {
      name: 'Mobile_Safari',
      testMatch: ['login-test.ts'],
      use: {
        ...devices['iPhone 12'],
        headless: true,
      },
    },
    {
      name: 'Mobile_Chrome',
      testMatch: ['login-test.ts'],
      use: {
        ...devices['Galaxy S9+'],
        headless: true,
      },
    },
  ],
};
export default uiTestConfig;
