import { test, expect } from '@playwright/test';

test.describe('Tools (Calculators)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should calculate plate breakdown correctly', async ({ page }) => {
    
    const barWeight = page.getByTestId('converter-bar-weight');
    const kgInput = page.getByTestId('converter-kg-input');
    const lbsInput = page.getByTestId('converter-lbs-input');
    
    // Set bar weight to 20kg
    await barWeight.fill('20');
    
    // Set total weight to 60kg (should be 20kg plates per side)
    await kgInput.fill('60');
    
    // Check for plate breakdown
    const breakdown = page.getByTestId('plate-breakdown');
    await expect(breakdown).toBeVisible();
    
    // Check for 20kg plate (1 per side)
    // The text would be "1x 20 kg" or similar depending on localization
    await expect(page.getByTestId('plate-item').filter({ hasText: '20' })).toBeVisible();
  });

  test('should convert KG to LBS', async ({ page }) => {
    const kgInput = page.getByTestId('converter-kg-input');
    const lbsInput = page.getByTestId('converter-lbs-input');
    
    await kgInput.fill('100');
    
    // 100kg is approx 220.46 lbs
    const lbsValue = await lbsInput.inputValue();
    expect(parseFloat(lbsValue)).toBeCloseTo(220.46, 1);
  });
});
