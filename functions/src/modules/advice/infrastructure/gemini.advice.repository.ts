import { GoogleGenerativeAI, SchemaType, Schema } from "@google/generative-ai";
import * as logger from "firebase-functions/logger";
import {
  TrainingRecord,
  TrainingAdvice,
  AdviceRepository,
} from "../domain/advice.repository.js";

/**
 * Interface for Gemini API errors.
 */
interface GeminiError extends Error {
  status?: number;
}

/**
 * Repository implementation for fetching advice via Gemini API.
 */
export class GeminiAdviceRepository implements AdviceRepository {
  private genAiInstance: GoogleGenerativeAI;

  /**
   * Initializes the repository with the Gemini API key.
   * @param {string} apiKey - The Gemini API key.
   */
  constructor(apiKey: string) {
    this.genAiInstance = new GoogleGenerativeAI(apiKey);
  }

  private analysisResponseSchema: Schema = {
    type: SchemaType.OBJECT,
    properties: {
      analysis: {
        type: SchemaType.STRING,
        description:
          "A brief analysis of the user's progress for the specified exercise, based on their history.",
      },
      trainingTips: {
        type: SchemaType.ARRAY,
        description:
          "Two specific, actionable training tips to help the user improve.",
        items: { type: SchemaType.STRING },
      },
      nutritionSuggestion: {
        type: SchemaType.STRING,
        description:
          "One nutritional suggestion to support the user's training goals.",
      },
    },
    required: ["analysis", "trainingTips", "nutritionSuggestion"],
  };

  /**
   * Formats a duration in seconds into a human-readable string.
   * @param {number} value - Duration in seconds.
   * @return {string} Formatted duration (e.g. 1m 30s).
   */
  private formatTimeUnit(value: number): string {
    const minutes = Math.floor(value / 60);
    const seconds = value % 60;
    return `${minutes}m ${seconds}s`;
  }

  /**
   * Formats a training record for the prompt.
   * @param {TrainingRecord} record - The record to format.
   * @return {string} A human-readable representation of the record.
   */
  private formatRecord(record: TrainingRecord): string {
    const parts: string[] = [];
    if (record.weight) parts.push(`${record.weight}${record.unit || "kg"}`);
    if (record.reps) parts.push(`${record.reps} reps`);
    if (record.time) parts.push(this.formatTimeUnit(record.time));
    if (record.barWeight) parts.push(`(Bar: ${record.barWeight}kg)`);

    const valueStr = parts.join(" x ");
    const formattedDate = new Date(record.date).toLocaleDateString();
    return `On ${formattedDate}, they recorded ${valueStr} for ${record.exercise}.`;
  }

  /**
   * Fetches training advice from Gemini.
   * @param {TrainingRecord} record - The current record.
   * @param {TrainingRecord[]} history - Historic records.
   * @param {string} [language="en"] - The response language.
   * @return {Promise<TrainingAdvice>} The advice generated.
   */
  async getAdvice(
    record: TrainingRecord,
    history: TrainingRecord[],
    language: string = "en",
  ): Promise<TrainingAdvice> {
    const historyString = history.map((r) => this.formatRecord(r)).join("\n");
    const prompt = `
      You are a world-class CrossFit and Olympic lifting coach named 'Coach Bull'.
      A user is asking for advice on their performance for the exercise: ${record.exercise}.
      
      Their most recent record is: ${this.formatRecord(record)}
      
      Here is their relevant workout history for this exercise:
      ${historyString}
      
      IMPORTANT: You must provide all your responses (analysis, tips, and suggestions) in the ${language} language.
      
      Based on this information, provide a concise and encouraging analysis. The user wants to improve.
      Your response must be in a JSON format.
      Provide:
      1. A brief 'analysis' of their progress in ${language}.
      2. An array of two specific, actionable 'trainingTips' to improve in ${language}.
      3. One 'nutritionSuggestion' to support their training in ${language}.
      
      Keep the tone positive and motivational. Address the user directly in ${language}.
    `;

    try {
      const model = this.genAiInstance.getGenerativeModel({
        model: "gemini-3-flash-preview",
      });

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: this.analysisResponseSchema,
        },
      });

      const response = await result.response;
      const jsonText = response.text().trim();
      return JSON.parse(jsonText);
    } catch (error) {
      const e = error as GeminiError;
      logger.error("Gemini API call for training advice failed. Details:", {
        message: e.message,
        stack: e.stack,
        status: e.status,
      });

      if (e.status === 404) {
        throw new Error(
          "Gemini Model not found. Ensure Generative Language API is enabled.",
        );
      }

      throw new Error("Failed to generate advice from Gemini API.");
    }
  }
}
