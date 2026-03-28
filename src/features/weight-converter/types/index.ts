import { User } from '@/src/features/auth/types';

export type WeightUnit = 'kg' | 'lbs';

export interface Plate {
  weight: number;
  color: string;
}

export interface PlateStack extends Plate {
  count: number;
}
