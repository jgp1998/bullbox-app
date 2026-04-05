import { ExerciseRepository, ExerciseDetails } from "../domain/exercise.repository.js";

export class GetExerciseDetailsUseCase {
  constructor(private exerciseRepository: ExerciseRepository) {}

  async execute(exerciseName: string, language?: string): Promise<ExerciseDetails> {
    if (!exerciseName) {
      throw new Error("Exercise name is required for getting exercise details.");
    }

    return this.exerciseRepository.getExerciseDetails(exerciseName, language);
  }
}
