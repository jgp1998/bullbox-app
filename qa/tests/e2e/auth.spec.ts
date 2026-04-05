import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  // Use a fresh context for login tests to avoid being already logged in
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show login screen when not authenticated', async ({ page }) => {
    // Check for BULLBOX logo in login screen
    await expect(page.getByRole('heading', { name: /BULLBOX/i })).toBeVisible();
    await expect(page.getByTestId('login-username')).toBeVisible();
    await expect(page.getByTestId('login-password')).toBeVisible();
    await expect(page.getByTestId('login-submit')).toBeVisible();
  });

  // Note: For real login tests, you'd typically use credentials or mock Firebase interaction
  // Here we'll just check if the form elements exist
  test('should allow entering credentials', async ({ page }) => {
    await page.getByTestId('login-username').fill('testuser');
    await page.getByTestId('login-password').fill('password123');
    
    await expect(page.getByTestId('login-username')).toHaveValue('testuser');
    await expect(page.getByTestId('login-password')).toHaveValue('password123');
  });
});
