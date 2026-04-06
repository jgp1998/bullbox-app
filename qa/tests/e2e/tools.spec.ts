import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

test.describe('Tools (Calculators)', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    
    // Ensure both tool components are visible
    await expect(page.getByTestId('converter-kg-input')).toBeVisible({ timeout: 15000 });
  });

  test('should calculate plate breakdown correctly in Weight Converter', async ({ page }) => {
    const barWeight = page.getByTestId('converter-bar-weight');
    const kgInput = page.getByTestId('converter-kg-input');
    
    // Set bar weight to 20kg
    await barWeight.fill('20');
    
    // Set total weight to 60kg (should be 20kg plates per side)
    await kgInput.fill('60');
    
    // Check for plate breakdown (it should render inside PlateBreakdown component)
    // We look for a 20kg plate
    await expect(page.getByText('20 kg').first()).toBeVisible();
  });

  test('should convert KG to LBS in Weight Converter', async ({ page }) => {
    const kgInput = page.getByTestId('converter-kg-input');
    const lbsInput = page.getByTestId('converter-lbs-input');
    
    await kgInput.fill('100');
    
    // 100kg is approx 220.46 lbs
    const lbsValue = await lbsInput.inputValue();
    expect(parseFloat(lbsValue)).toBeCloseTo(220.46, 1);
  });

  test('should calculate 1RM in Percentage Calculator', async ({ page }) => {
    const manualRMInput = page.getByTestId('percentage-manual-rm');
    
    // Ensure the calculator is visible (might need scroll)
    await manualRMInput.scrollIntoViewIfNeeded();
    await expect(manualRMInput).toBeVisible();

    // Fill and calculate
    await manualRMInput.fill('100');
    
    // Set percentage specifically
    await page.getByTestId('percentage-input').fill('100');
    
    // Set bar weight to 0 for simple total
    await page.getByTestId('percentage-bar-weight').fill('0');
    
    const calcButton = page.getByTestId('percentage-calculate-button');
    await expect(calcButton).toBeEnabled();
    await calcButton.click();
    
    // Check for results using specific test IDs
    await expect(page.getByTestId('percentage-result-kg')).toContainText('100.0');
    await expect(page.getByTestId('percentage-result-lbs')).toContainText('220.5');
  });
});
