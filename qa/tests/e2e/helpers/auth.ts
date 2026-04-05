import { Page, expect } from '@playwright/test';

export async function login(page: Page) {
  // Go to root
  await page.goto('/');

  // If we are already logged in (Home shown), just return
  if (await page.getByTestId('header-logo').isVisible()) {
    return;
  }

  // If not, we should see the login screen
  await expect(page.getByTestId('login-username')).toBeVisible({ timeout: 15000 });

  // Use credentials from process.env (loaded in config)
  const email = process.env.TEST_USER_EMAIL!;
  const password = process.env.TEST_USER_PASSWORD!;

  if (!email || !password) {
    throw new Error('Test user credentials not found in env');
  }

  await page.getByTestId('login-username').fill(email);
  await page.getByTestId('login-password').fill(password);
  await page.getByTestId('login-submit').click();

  // Wait for login success
  await expect(page.getByTestId('header-logo')).toBeVisible({ timeout: 20000 });
}
