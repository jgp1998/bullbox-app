export interface TrainingAdvice {
  analysis: string;
  trainingTips: string[];
  nutritionSuggestion: string;
}

export interface TrainingRecord {
  exercise: string;
  weight?: number;
  unit?: string;
  reps?: number;
  time?: number;
  barWeight?: number;
  date: string;
}

export interface AdviceRepository {
  getAdvice(record: TrainingRecord, history: TrainingRecord[], language?: string): Promise<TrainingAdvice>;
}
