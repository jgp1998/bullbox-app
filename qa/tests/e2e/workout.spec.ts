import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

test.describe('Workout Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should add a new exercise record', async ({ page }) => {
    // Ensure we are on the workout page
    await expect(page.getByTestId('workout-form-card')).toBeVisible();
    
    // Fill out the form
    await page.getByTestId('weight-input').fill('110');
    await page.getByTestId('reps-input').fill('3');
    await page.getByTestId('bar-weight-input').fill('20');
    
    // Add record
    await page.getByTestId('add-record-button').click();
    
    // Check if the record appears in the history list
    await expect(page.getByText('110 kg @ 3 reps').first()).toBeVisible({ timeout: 15000 });
  });

  test('should edit exercise list', async ({ page }) => {
    // Check manage exercises button
    const manageBtn = page.getByRole('button', { name: /gestionar ejercicios|manage exercises/i });
    await manageBtn.click();
    
    // Modal should appear - actual text is "Gestionar Ejercicios"
    await expect(page.getByRole('heading', { name: /gestionar ejercicios|manage exercises/i })).toBeVisible();
    
    // Close modal
    await page.keyboard.press('Escape');
  });
});
