export interface ExerciseDetails {
  description: string;
  bestPractices: string[];
  commonMistakes: string[];
}

export interface ExerciseRepository {
  getExerciseDetails(exerciseName: string, language?: string): Promise<ExerciseDetails>;
}
