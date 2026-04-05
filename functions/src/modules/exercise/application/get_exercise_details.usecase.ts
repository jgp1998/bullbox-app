import { ExerciseRepository, ExerciseDetails } from "../domain/exercise.repository.js";

/**
 * Use case to get detailed exercise information.
 */
export class GetExerciseDetailsUseCase {
  /**
   * Creates an instance of GetExerciseDetailsUseCase.
   * @param {ExerciseRepository} exerciseRepository - The repository for fetching details.
   */
  constructor(private exerciseRepository: ExerciseRepository) {}

  /**
   * Executes the use case.
   * @param {string} exerciseName - Name of the exercise.
   * @param {string} [language] - Optional language code.
   * @return {Promise<ExerciseDetails>} The exercise details.
   */
  async execute(exerciseName: string, language?: string): Promise<ExerciseDetails> {
    if (!exerciseName) {
      throw new Error("Exercise name is required for getting exercise details.");
    }

    return this.exerciseRepository.getExerciseDetails(exerciseName, language);
  }
}

