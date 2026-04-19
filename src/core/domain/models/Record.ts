export type RecordType = 'Weight' | 'Reps' | 'Time';
export type WeightUnit = 'kg' | 'lbs';

export interface WorkoutRecord {
  id: string;
  date: string; // ISO string
  exercise: string;
  weight?: number;
  unit?: WeightUnit;
  reps?: number;
  time?: number; // total seconds
  barWeight?: number; // weight of the bar in kg
  userId: string;
  boxId: string;
  type?: string;
  volume?: number;
}
