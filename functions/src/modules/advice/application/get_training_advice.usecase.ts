import { AdviceRepository, TrainingRecord, TrainingAdvice } from "../domain/advice.repository.js";

/**
 * Use case to get training advice based on records.
 */
export class GetTrainingAdviceUseCase {
  /**
   * Creates an instance of GetTrainingAdviceUseCase.
   * @param {AdviceRepository} adviceRepository - The repository for fetching advice.
   */
  constructor(private adviceRepository: AdviceRepository) {}

  /**
   * Executes the use case.
   * @param {TrainingRecord} record - The current training record.
   * @param {TrainingRecord[]} history - Relevant history records.
   * @param {string} [language] - Optional language code.
   * @return {Promise<TrainingAdvice>} The training advice result.
   */
  async execute(record: TrainingRecord, history: TrainingRecord[], language?: string): Promise<TrainingAdvice> {
    // Business validation or logic can go here
    if (!record || !history) {
      throw new Error("Record and history are required for training advice.");
    }

    return this.adviceRepository.getAdvice(record, history, language);
  }
}

