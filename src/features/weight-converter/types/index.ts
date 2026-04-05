export interface Plate {
  weight: number;
  color: string;
}

export interface PlateStack extends Plate {
  count: number;
}
