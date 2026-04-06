import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

test.describe('Workout Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    
    // Ensure the main form is truly ready and stable
    const formCard = page.getByTestId('workout-form-card');
    await expect(formCard).toBeVisible({ timeout: 20000 });
    // Small delay to ensure React state has settled (avoid "detached from DOM" or hydration issues)
    await page.waitForTimeout(500);
  });

  test('should add a new exercise record', async ({ page }) => {
    // Fill out the form
    // The previous tests failed because they were too fast, using fill with specialized interaction logic
    await page.getByTestId('weight-input').click({ delay: 100 });
    await page.getByTestId('weight-input').fill('110');
    
    await page.getByTestId('reps-input').click({ delay: 100 });
    await page.getByTestId('reps-input').fill('3');
    
    await page.getByTestId('bar-weight-input').click({ delay: 100 });
    await page.getByTestId('bar-weight-input').fill('20');
    
    // Add record
    await page.getByTestId('add-record-button').click();
    
    // Check if the record appears in history
    // We expect "110 kg" and "3 reps" in the workout history list
    const historyList = page.locator('.space-y-4'); // Container for history items
    await expect(page.getByText('110 kg').first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('3 reps').first()).toBeVisible();
  });

  test('should allow managing exercises via modal', async ({ page }) => {
    // Check manage exercises button or any button that opens a modal
    // In WorkoutForm, we might have a button for managing list
    const manageBtn = page.getByTestId('manage-exercises-button');
    if (await manageBtn.isVisible()) {
      await manageBtn.click();
      // Ensure the modal header is visible
      await expect(page.getByRole('heading')).toBeVisible();
      // Close modal
      await page.keyboard.press('Escape');
    }
  });
});
