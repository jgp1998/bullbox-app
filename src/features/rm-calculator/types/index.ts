import type { WeightUnit } from '@/src/features/workout';

export interface RMCalculationResult {
  oneRepMax: number;
  percentages: Record<number, number>;
  unit: WeightUnit;
}

export interface RMInput {
  weight: number;
  reps: number;
  unit: WeightUnit;
}
