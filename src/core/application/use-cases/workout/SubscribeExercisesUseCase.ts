import { WorkoutRepository } from '../../../domain/repositories/WorkoutRepository';

export class SubscribeExercisesUseCase {
  constructor(private workoutRepository: WorkoutRepository) {}

  execute(uid: string | undefined, callback: (exercises: string[]) => void): () => void {
    if (!uid) return () => {};
    return this.workoutRepository.subscribeToExercises(uid, callback);
  }
}
