import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

test.describe('Training Schedule', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    
    // Ensure agenda is visible before starting
    const agendaTitle = page.getByRole('heading', { name: /AGENDA/i });
    await expect(agendaTitle).toBeVisible({ timeout: 15000 });
  });

  test('should open schedule modal and add a session', async ({ page }) => {
    // Click on schedule button - Use force: true if the layout shifts due to loading other components
    const addBtn = page.getByTestId('schedule-add-button');
    await expect(addBtn).toBeVisible();
    await addBtn.click({ force: true });
    
    // Modal should be visible
    const titleInput = page.getByTestId('schedule-title-input');
    await expect(titleInput).toBeVisible();
    
    // Fill out the form
    const sessionTitle = 'Test Workout Session ' + Date.now();
    await page.getByTestId('schedule-title-input').fill(sessionTitle);
    await page.getByTestId('schedule-notes-input').fill('Test Session Notes');
    
    // Save session
    await page.getByTestId('schedule-submit-button').click();
    
    // 1. Wait for the modal to be removed from the DOM/hidden
    // This is more reliable than just waiting for the session to appear
    await expect(page.getByTestId('schedule-title-input')).toBeHidden({ timeout: 10000 });
    
    // 2. Ensure the agenda container is visible
    await expect(page.getByTestId('training-agenda-container')).toBeVisible();

    // 3. If there was a "No sessions" message, it should disappear
    await expect(page.getByTestId('no-sessions-message')).toBeHidden({ timeout: 15000 });

    // 4. Check if the session appears in the agenda
    // Use data-testid for the title to be exact
    await expect(page.getByTestId('session-title').filter({ hasText: sessionTitle }).first()).toBeVisible({ timeout: 15000 });
  });
});
