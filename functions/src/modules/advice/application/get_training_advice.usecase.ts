import { AdviceRepository, TrainingRecord, TrainingAdvice } from "../domain/advice.repository.js";

export class GetTrainingAdviceUseCase {
  constructor(private adviceRepository: AdviceRepository) {}

  async execute(record: TrainingRecord, history: TrainingRecord[], language?: string): Promise<TrainingAdvice> {
    // Business validation or logic can go here
    if (!record || !history) {
      throw new Error("Record and history are required for training advice.");
    }

    return this.adviceRepository.getAdvice(record, history, language);
  }
}
