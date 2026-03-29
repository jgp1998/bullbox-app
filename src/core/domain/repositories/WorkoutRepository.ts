export interface WorkoutRepository {
  subscribeToExercises(uid: string, callback: (exercises: string[]) => void): () => void;
  addExercise(uid: string, exercise: string): Promise<void>;
  deleteExercise(uid: string, exercise: string): Promise<void>;
}
