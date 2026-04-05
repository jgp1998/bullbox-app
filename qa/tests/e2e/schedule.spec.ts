import { test, expect } from '@playwright/test';

test.describe('Training Schedule', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should open schedule modal and add a session', async ({ page }) => {
    
    // Click on schedule button
    await page.getByTestId('schedule-add-button').click();
    
    // Modal should be visible
    await expect(page.getByTestId('schedule-title-input')).toBeVisible();
    
    // Fill out the session details
    await page.getByTestId('schedule-title-input').fill('Test Workout Session');
    // Date and time are usually pre-filled with today, but let's be explicit
    await page.getByTestId('schedule-notes-input').fill('Test notes for the session');
    
    // Submit
    await page.getByTestId('schedule-submit-button').click();
    
    // Check if the session appears in the agenda
    await expect(page.getByText('Test Workout Session')).toBeVisible();
  });
});
