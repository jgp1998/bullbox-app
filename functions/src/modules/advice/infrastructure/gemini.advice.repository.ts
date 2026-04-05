import { GoogleGenerativeAI } from "@google/generative-ai";
import * as logger from "firebase-functions/logger";
import {
  TrainingRecord,
  TrainingAdvice,
  AdviceRepository,
} from "../domain/advice.repository.js";

export class GeminiAdviceRepository implements AdviceRepository {
  private genAiInstance: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.genAiInstance = new GoogleGenerativeAI(apiKey);
  }

  private analysisResponseSchema = {
    type: "object",
    properties: {
      analysis: {
        type: "string",
        description:
          "A brief analysis of the user's progress for the specified exercise, based on their history.",
      },
      trainingTips: {
        type: "array",
        description:
          "Two specific, actionable training tips to help the user improve.",
        items: { type: "string" },
      },
      nutritionSuggestion: {
        type: "string",
        description:
          "One nutritional suggestion to support the user's training goals.",
      },
    },
    required: ["analysis", "trainingTips", "nutritionSuggestion"],
  } as any;

  private formatTimeUnit(value: number): string {
    const minutes = Math.floor(value / 60);
    const seconds = value % 60;
    return `${minutes}m ${seconds}s`;
  }

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
    } catch (error: any) {
      logger.error("Gemini API call for training advice failed. Details:", {
        message: error.message,
        stack: error.stack,
        status: error.status,
      });

      if (error.status === 404) {
        throw new Error(
          `Gemini Model not found. Ensure Generative Language API is enabled.`,
        );
      }

      throw new Error("Failed to generate advice from Gemini API.");
    }
  }
}
