import { onCall, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";

// Advice Module Imports
import { GeminiAdviceRepository } from "./modules/advice/infrastructure/gemini.advice.repository.js";
import { GetTrainingAdviceUseCase } from "./modules/advice/application/get_training_advice.usecase.js";

// Exercise Module Imports
import { GeminiExerciseRepository } from "./modules/exercise/infrastructure/gemini.exercise.repository.js";
import { GetExerciseDetailsUseCase } from "./modules/exercise/application/get_exercise_details.usecase.js";

// RBAC Middleware

// Define the secret for the Gemini API Key
const GEMINI_API_KEY = defineSecret("GEMINI_API_KEY");

/**
 * Callable function to get training advice from Gemini.
 * Orchestrates the GetTrainingAdviceUseCase.
 */
export const getTrainingAdvice = onCall(
  { secrets: [GEMINI_API_KEY] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "The function must be called while authenticated.",
      );
    }

    const { record, history, language } = request.data;
    const apiKey = GEMINI_API_KEY.value();

    try {
      const repository = new GeminiAdviceRepository(apiKey);
      const useCase = new GetTrainingAdviceUseCase(repository);

      return await useCase.execute(record, history, language);
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred.";
      throw new HttpsError("internal", message);
    }
  },
);

/**
 * Callable function to get exercise details from Gemini.
 * Orchestrates the GetExerciseDetailsUseCase.
 */
export const getExerciseDetails = onCall(
  { secrets: [GEMINI_API_KEY] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "The function must be called while authenticated.",
      );
    }

    const { exerciseName, language } = request.data;
    const apiKey = GEMINI_API_KEY.value();

    try {
      const repository = new GeminiExerciseRepository(apiKey);
      const useCase = new GetExerciseDetailsUseCase(repository);

      return await useCase.execute(exerciseName, language);
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred.";
      throw new HttpsError("internal", message);
    }
  },
);
