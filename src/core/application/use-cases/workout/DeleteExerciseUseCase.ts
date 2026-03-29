import { WorkoutRepository } from '../../../domain/repositories/WorkoutRepository';

export class DeleteExerciseUseCase {
  constructor(private workoutRepository: WorkoutRepository) {}

  async execute(uid: string | undefined, exercise: string): Promise<void> {
    if (!uid) throw new Error('User not authenticated');
    return this.workoutRepository.deleteExercise(uid, exercise);
  }
}
