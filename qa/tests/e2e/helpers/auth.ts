import { test, Page, expect } from '@playwright/test';

export async function login(page: Page) {
  // Go to root
  await page.goto('/');

  // If we are already logged in (Home shown and settled), just return
  // We check for logout-button as a signal that authLoading is false
  if (await page.getByTestId('logout-button').isVisible()) {
    return;
  }

  // If not, we should see the login screen or loading state
  // We wait for the login field to be sure we are on the login screen
  const usernameField = page.getByTestId('login-username');
  
  // If login field is not visible, we might be in loading state
  if (!(await usernameField.isVisible())) {
    try {
      // Wait for either login field or logout button
      await Promise.race([
        page.waitForSelector('[data-testid="login-username"]', { timeout: 15000 }),
        page.waitForSelector('[data-testid="logout-button"]', { timeout: 15000 })
      ]);
      
      // If logout button appeared, we are already logged in
      if (await page.getByTestId('logout-button').isVisible()) {
        return;
      }
    } catch (e) {
      // If neither appeared, we might be stuck
      throw new Error('Neither login screen nor logout button appeared after 15s');
    }
  }

  // Use credentials from process.env (loaded in config)
  const email = process.env.TEST_USER_EMAIL!;
  const password = process.env.TEST_USER_PASSWORD!;

  if (!email || !password) {
    throw new Error('Test user credentials not found in env (TEST_USER_EMAIL or TEST_USER_PASSWORD)');
  }

  // Clear and fill
  await usernameField.fill(email);
  await page.getByTestId('login-password').fill(password);
  
  // Click login
  await page.getByTestId('login-submit').click();

  // Wait for login success AND app to be loaded (!authLoading)
  // logout-button is the best candidate because it only renders when !authLoading && user
  try {
    await expect(page.getByTestId('logout-button')).toBeVisible({ timeout: 30000 });
    
    // Also wait for the main content to be visible to ensure stability
    await expect(page.getByTestId('header-logo')).toBeVisible();
  } catch (e) {
    // Look for error message on screen
    const errorMsg = page.locator('p.text-red-500');
    if (await errorMsg.isVisible()) {
      const text = await errorMsg.innerText();
      throw new Error(`Login failed with error on screen: "${text}"`);
    }
    throw new Error(`Login timed out or failed. Could not find logout-button. Original error: ${e.message}`);
  }

  // Final wait for page to reach basic load state. 
  // We avoid 'networkidle' because Firebase persistent connections can cause timeouts.
  await page.waitForLoadState('load');
}
