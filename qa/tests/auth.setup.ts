import { test as setup, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const authFile = path.resolve(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  await page.goto('/');
  
  // Fill in credentials
  await page.getByTestId('login-username').fill('jorgegp@live.cl');
  await page.getByTestId('login-password').fill('3209fousfjks');
  await page.getByTestId('login-submit').click();

  // If there's an error message, it will show up
  const errorLocator = page.locator('p.text-red-500');
  
  try {
    await expect(page.getByTestId('header-logo')).toBeVisible({ timeout: 25000 });
  } catch (e) {
    if (await errorLocator.isVisible()) {
        console.error('Login failed with error:', await errorLocator.innerText());
    } else {
        console.error('Login timed out without visible error message');
    }
    throw e;
  }
  await page.waitForLoadState('networkidle');

  // End of authentication steps.
  await page.context().storageState({ path: authFile });
});
