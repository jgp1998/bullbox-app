import { describe, it, expect } from 'vitest';
import { calculatePlates } from '@/shared/utils/calculator';
import { kgToLbs, lbsToKg } from '@/shared/utils/formatters';

describe('Weight Converter Logic', () => {
  it('KG to LBS conversion', () => {
    // 100 kg should be ~220.46 lbs
    expect(kgToLbs(100)).toBeCloseTo(220.462, 3);
    // 45.3592 kg should be ~100 lbs
    expect(lbsToKg(100)).toBeCloseTo(45.359, 2);
  });

  it('Plate breakdown parity for KG', () => {
    const totalWeight = 100; // 100kg
    const plates = calculatePlates(totalWeight, 'kg', 'kg', 'Male', 20); // 100kg total, 20kg bar, kg plates
    
    // (100 - 20) / 2 = 40kg per side
    // Standard plates are 25, 20, 15, 10, 5, 2.5, 1.25
    // Should be 20x2 or 25+15
    const sideWeight = plates.reduce((sum: number, p: any) => sum + p.weight * p.count, 0);
    expect(sideWeight).toBe(40);
    expect(sideWeight * 2 + 20).toBe(totalWeight);
  });

  it('Plate breakdown parity for LBS', () => {
    const totalWeight = 225; // 225lbs
    const plates = calculatePlates(totalWeight, 'lbs', 'lbs', 'Male', 45); // 225lbs total, 45lb bar, lbs plates
    
    // (225 - 45) / 2 = 90lbs per side
    // Standard plates are 45, 35, 25, 10, 5, 2.5
    // Should be 45x2
    const sideWeight = plates.reduce((sum: number, p: any) => sum + p.weight * p.count, 0);
    expect(sideWeight).toBe(90);
    expect(sideWeight * 2 + 45).toBe(totalWeight);
  });

  it('Invalid inputs handling', () => {
    // If weight is less than or equal to bar weight, stack should be empty
    const plates = calculatePlates(20, 'kg', 'kg', 'Male', 20);
    expect(plates).toHaveLength(0);

    const platesNegative = calculatePlates(-10, 'kg', 'kg', 'Male', 20);
    expect(platesNegative).toHaveLength(0);
  });
});
