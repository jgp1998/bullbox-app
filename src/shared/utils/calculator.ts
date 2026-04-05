import { OLYMPIC_BARBELLS, PLATES_KG, PLATES_LBS } from '@/shared/constants';
import { lbsToKg, kgToLbs } from '@/shared/utils/formatters';

export type WeightUnit = 'kg' | 'lbs';

export interface Plate {
  weight: number;
  color: string;
}

export interface PlateStack extends Plate {
  count: number;
}

export const calculatePlates = (
    totalWeight: number, 
    weightUnit: WeightUnit, 
    plateUnit: WeightUnit, 
    gender: 'Male' | 'Female' | 'Other',
    customBarWeight?: number
): PlateStack[] => {
    const genderKey = gender === 'Female' ? 'female' : 'male';
    const defaultBarWeight = weightUnit === 'kg' ? OLYMPIC_BARBELLS[genderKey].kg : OLYMPIC_BARBELLS[genderKey].lbs;
    const barbellWeight = customBarWeight || defaultBarWeight;
    
    const plates = plateUnit === 'kg' ? PLATES_KG : PLATES_LBS;
    const stack: PlateStack[] = [];

    if (totalWeight <= barbellWeight) {
        return [];
    }

    let weightPerSideInPlateUnit = (totalWeight - barbellWeight) / 2;
    
    // If target unit and plate unit are different, convert to plateUnit
    if (weightUnit !== plateUnit) {
        weightPerSideInPlateUnit = plateUnit === 'lbs' ? kgToLbs(weightPerSideInPlateUnit) : lbsToKg(weightPerSideInPlateUnit);
    }

    let remaining = weightPerSideInPlateUnit;
    
    // Greedy approach that takes the plate that minimizes current error
    // until no further improvement is possible or we reach the target.
    while (remaining > 0.001) { // Use small epsilon for rounding errors
        let bestPlate: Plate | null = null;
        let minDiff = Math.abs(remaining);

        for (const plate of plates) {
            if (plate.weight > remaining + 0.001) continue; // Do not exceed weight
            const diff = remaining - plate.weight;
            if (diff < minDiff) {
                minDiff = diff;
                bestPlate = plate;
            } else if (Math.abs(diff - minDiff) < 0.001 && bestPlate && plate.weight > bestPlate.weight) {
                // If error is same, prefer larger plate (fewer plates on bar)
                bestPlate = plate;
            }
        }

        if (!bestPlate) break;

        const existing = stack.find(p => p.weight === bestPlate!.weight);
        if (existing) {
            existing.count++;
        } else {
            stack.push({ ...bestPlate, count: 1 });
        }
        
        remaining -= bestPlate.weight;
        
        // If we are already at or beyond target, we check if we should stop.
        // In this greedy "best match" version, we stop if we went over 
        // because adding any more plates will only increase the error.
        if (remaining <= 0) break;
    }

    // Sort stack by weight descending for consistent display
    return stack.sort((a, b) => b.weight - a.weight);
};

/**
 * Calculates 1RM (One Rep Max) using Epley Formula: 1RM = weight * (1 + reps/30)
 */
export const calculate1RM = (weight?: number, reps?: number): number => {
    if (!weight) return 0;
    if (!reps || reps <= 1) return weight;
    return weight * (1 + (reps / 30));
};

/**
 * Calculates the percentage of a given max weight.
 */
export const calculatePercentage = (max: number, percentage: number): number => {
    return (max * percentage) / 100;
};
