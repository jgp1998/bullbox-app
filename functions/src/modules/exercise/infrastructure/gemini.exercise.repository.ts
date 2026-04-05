import { GoogleGenerativeAI } from "@google/generative-ai";
import * as logger from "firebase-functions/logger";
import {
  ExerciseDetails,
  ExerciseRepository,
} from "../domain/exercise.repository.js";

export class GeminiExerciseRepository implements ExerciseRepository {
  private genAiInstance: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.genAiInstance = new GoogleGenerativeAI(apiKey);
  }

  private exerciseDetailSchema = {
    type: "object",
    properties: {
      description: {
        type: "string",
        description:
          "A concise description of the exercise, what it is, and what muscles it targets.",
      },
      bestPractices: {
        type: "array",
        description:
          "A list of 3-4 key points or tips for performing the exercise correctly and safely.",
        items: { type: "string" },
      },
      commonMistakes: {
        type: "array",
        description:
          "A list of 2-3 common mistakes to avoid when performing the exercise.",
        items: { type: "string" },
      },
    },
    required: ["description", "bestPractices", "commonMistakes"],
  } as any;

  async getExerciseDetails(
    exerciseName: string,
    language: string = "en",
  ): Promise<ExerciseDetails> {
    const prompt = `
      You are a knowledgeable fitness expert.
      Provide detailed information about the following CrossFit or Olympic lifting exercise: "${exerciseName}".
      
      IMPORTANT: You must provide all your responses (description, best practices, and common mistakes) in the ${language} language.

      Your response must be in a JSON format.
      Provide:
      1. A 'description' of the exercise in ${language}.
      2. An array of 3-4 'bestPractices' for proper form and execution in ${language}.
      3. An array of 2-3 'commonMistakes' to avoid in ${language}.

      The information should be clear, concise, and easy for an athlete to understand and apply.
    `;

    try {
      const model = this.genAiInstance.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: this.exerciseDetailSchema,
        },
      });

      const response = await result.response;
      const jsonText = response.text().trim();
      return JSON.parse(jsonText);
    } catch (error: any) {
      logger.error("Gemini API call for exercise details failed. Details:", {
        message: error.message,
        status: error.status,
      });
      throw new Error("Failed to get exercise details from Gemini API.");
    }
  }
}
