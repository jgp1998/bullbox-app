import { OLYMPIC_BARBELLS, PLATES_KG, PLATES_LBS } from '@/constants';
import { lbsToKg, kgToLbs } from '@/utils/formatters';
import { PlateStack, WeightUnit } from '../types';

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

    let weightPerSide = (totalWeight - barbellWeight) / 2;
    
    // If target unit and plate unit are different, convert weightPerSide to plateUnit
    if (weightUnit !== plateUnit) {
        weightPerSide = plateUnit === 'lbs' ? kgToLbs(weightPerSide) : lbsToKg(weightPerSide);
    }

    for (const plate of plates) {
        const count = Math.floor(weightPerSide / plate.weight);
        if (count > 0) {
            stack.push({ ...plate, count });
            weightPerSide -= count * plate.weight;
        }
    }

    return stack;
};
