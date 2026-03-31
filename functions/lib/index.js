import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { defineSecret } from "firebase-functions/params";
const GEMINI_API_KEY = defineSecret("GEMINI_API_KEY");
let genAiInstance = null;
const getGenAI = (apiKey) => {
    if (!genAiInstance) {
        genAiInstance = new GoogleGenerativeAI(apiKey);
    }
    return genAiInstance;
};
const analysisResponseSchema = {
    type: "object",
    properties: {
        analysis: {
            type: "string",
            description: "A brief analysis of the user's progress for the specified exercise, based on their history."
        },
        trainingTips: {
            type: "array",
            description: "Two specific, actionable training tips to help the user improve.",
            items: { type: "string" }
        },
        nutritionSuggestion: {
            type: "string",
            description: "One nutritional suggestion to support the user's training goals."
        }
    },
    required: ["analysis", "trainingTips", "nutritionSuggestion"]
};
const exerciseDetailSchema = {
    type: "object",
    properties: {
        description: {
            type: "string",
            description: "A concise description of the exercise, what it is, and what muscles it targets."
        },
        bestPractices: {
            type: "array",
            description: "A list of 3-4 key points or tips for performing the exercise correctly and safely.",
            items: { type: "string" }
        },
        commonMistakes: {
            type: "array",
            description: "A list of 2-3 common mistakes to avoid when performing the exercise.",
            items: { type: "string" }
        }
    },
    required: ["description", "bestPractices", "commonMistakes"]
};
const formatTimeUnit = (value) => {
    const minutes = Math.floor(value / 60);
    const seconds = value % 60;
    return `${minutes}m ${seconds}s`;
};
const formatRecord = (record) => {
    const parts = [];
    if (record.weight)
        parts.push(`${record.weight}${record.unit || 'kg'}`);
    if (record.reps)
        parts.push(`${record.reps} reps`);
    if (record.time)
        parts.push(formatTimeUnit(record.time));
    if (record.barWeight)
        parts.push(`(Bar: ${record.barWeight}kg)`);
    const valueStr = parts.join(' x ');
    const formattedDate = new Date(record.date).toLocaleDateString();
    return `On ${formattedDate}, they recorded ${valueStr} for ${record.exercise}.`;
};
export const getTrainingAdvice = onCall({ secrets: [GEMINI_API_KEY] }, async (request) => {
    if (!request.auth) {
        throw new HttpsError("unauthenticated", "The function must be called while authenticated.");
    }
    const { record, history } = request.data;
    if (!record || !history) {
        throw new HttpsError("invalid-argument", "The function must be called with 'record' and 'history'.");
    }
    const apiKey = GEMINI_API_KEY.value();
    const ai = getGenAI(apiKey);
    const historyString = history.map(formatRecord).join('\n');
    const prompt = `
    You are a world-class CrossFit and Olympic lifting coach named 'Coach Bull'.
    A user is asking for advice on their performance for the exercise: ${record.exercise}.
    
    Their most recent record is: ${formatRecord(record)}
    
    Here is their relevant workout history for this exercise:
    ${historyString}
    
    Based on this information, provide a concise and encouraging analysis. The user wants to improve.
    Your response must be in a JSON format.
    Provide:
    1. A brief 'analysis' of their progress.
    2. An array of two specific, actionable 'trainingTips' to improve.
    3. One 'nutritionSuggestion' to support their training.
    
    Keep the tone positive and motivational. Address the user directly.
  `;
    try {
        const model = ai.getGenerativeModel({
            model: "gemini-1.5-flash",
        });
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: analysisResponseSchema,
            },
        });
        const response = await result.response;
        const jsonText = response.text().trim();
        return JSON.parse(jsonText);
    }
    catch (error) {
        logger.error("Gemini API call for training advice failed:", error);
        throw new HttpsError("internal", "Failed to generate advice from Gemini API.");
    }
});
export const getExerciseDetails = onCall({ secrets: [GEMINI_API_KEY] }, async (request) => {
    if (!request.auth) {
        throw new HttpsError("unauthenticated", "The function must be called while authenticated.");
    }
    const { exerciseName } = request.data;
    if (!exerciseName) {
        throw new HttpsError("invalid-argument", "The function must be called with 'exerciseName'.");
    }
    const apiKey = GEMINI_API_KEY.value();
    const ai = getGenAI(apiKey);
    const prompt = `
    You are a knowledgeable fitness expert.
    Provide detailed information about the following CrossFit or Olympic lifting exercise: "${exerciseName}".
    
    Your response must be in a JSON format.
    Provide:
    1. A 'description' of the exercise.
    2. An array of 3-4 'bestPractices' for proper form and execution.
    3. An array of 2-3 'commonMistakes' to avoid.

    The information should be clear, concise, and easy for an athlete to understand and apply.
  `;
    try {
        const model = ai.getGenerativeModel({
            model: "gemini-1.5-flash",
        });
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: exerciseDetailSchema,
            },
        });
        const response = await result.response;
        const jsonText = response.text().trim();
        return JSON.parse(jsonText);
    }
    catch (error) {
        logger.error("Gemini API call for exercise details failed:", error);
        throw new HttpsError("internal", "Failed to get exercise details from Gemini API.");
    }
});
//# sourceMappingURL=index.js.map