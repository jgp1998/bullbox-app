import type { WorkoutRecord } from '../types';

const KG_TO_LBS = 2.20462;

export const lbsToKg = (lbs: number): number => lbs / KG_TO_LBS;
export const kgToLbs = (kg: number): number => kg * KG_TO_LBS;

export const formatValue = (value: number, type: WorkoutRecord['type']) => {
  if (type === 'Time') {
    const minutes = Math.floor(value / 60);
    const seconds = value % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return value.toString();
};

export const getUnit = (type: WorkoutRecord['type'], unit?: WorkoutRecord['unit']) => {
  switch(type) {
    case 'Weight': return unit || 'kg';
    case 'Reps': return 'reps';
    case 'Time': return 'min';
    default: return '';
  }
};