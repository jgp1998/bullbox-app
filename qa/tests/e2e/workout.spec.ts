import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

test.describe('Workout Management', () => {
  test.beforeEach(async ({ page }) => {
    // Force English language for predictable UI text assertions
    await page.addInitScript(() => {
      window.localStorage.setItem('bullboxLanguage', 'en');
    });
    
    await login(page);
    
    // Navigate to the workout registration page
    await page.goto('/entrenar');
    
    // Ensure the main form is ready
    await expect(page.getByTestId('workout-form-card')).toBeVisible({ timeout: 20000 });
  });

  test('should add a new exercise record', async ({ page }) => {
    // 1. Ensure at least one exercise exists
    const exerciseSelect = page.getByTestId('exercise-select');
    // Check if the select is empty or has no options beyond placeholder
    const optionsCount = await exerciseSelect.locator('option').count();
    
    if (optionsCount === 0) {
      // Add 'Back Squat' if no exercises exist
      await page.getByTestId('manage-exercises-button').click();
      const modal = page.getByRole('dialog');
      await modal.locator('input').fill('Back Squat');
      await modal.locator('button').filter({ hasText: '+' }).click();
      // Ensure it was added (list length increased or toast)
      await page.keyboard.press('Escape');
      // Wait for modal to be gone
      await expect(modal).not.toBeVisible();
      // Wait for the dropdown to update
      await expect(exerciseSelect.locator('option')).toHaveCount(1, { timeout: 5000 });
    }

    // 2. Fill out the form
    // Use a small delay before filling to ensure the focus is clear of any vanishing modals
    await page.waitForTimeout(300);
    await page.getByTestId('weight-input').fill('110');
    await page.getByTestId('reps-input').fill('3');
    
    // Toggle advanced options for bar weight
    await page.getByTestId('advanced-toggle').click();
    await page.getByTestId('bar-weight-input').fill('20');
    
    // 3. Add record
    await page.getByTestId('add-record-button').click();
    
    // Wait for success toast with regex matching to be language-resilient (English is forced)
    await expect(page.locator('text=/record added successfully/i')).toBeVisible({ timeout: 12000 });
    
    // 4. Navigate back to the dashboard to see the history
    await page.goto('/');
    
    // 5. Check if the record appears in history
    // Cloud Firestore might be slow, so we use a generous timeout and potentially a reload
    const recordValue = page.getByTestId('record-value').filter({ hasText: '110 kg' }).first();
    
    try {
      await expect(recordValue).toBeVisible({ timeout: 15000 });
    } catch (e) {
      // Retry with a reload if not visible (sometimes needed for real-time updates to catch up)
      await page.reload();
      await expect(recordValue).toBeVisible({ timeout: 10000 });
    }
    
    await expect(recordValue).toContainText('110 kg');
    await expect(recordValue).toContainText('3 reps');
  });

  test('should allow managing exercises via modal', async ({ page }) => {
    const manageBtn = page.getByTestId('manage-exercises-button');
    
    // Explicitly wait for the button and click it
    await expect(manageBtn).toBeVisible({ timeout: 10000 });
    await manageBtn.click();
    
    // Ensure the modal is visible
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    
    // Close modal using Escape key
    await page.keyboard.press('Escape');
    
    // Ensure the modal is gone
    await expect(modal).not.toBeVisible();
  });
});
