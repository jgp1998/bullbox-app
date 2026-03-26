import { GoogleGenAI, Type } from "@google/genai";
import { WorkoutRecord, AnalysisResult, ExerciseDetail } from '../types';

if (!process.env.API_KEY) {
  console.error("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        analysis: {
            type: Type.STRING,
            description: "A brief analysis of the user's progress for the specified exercise, based on their history."
        },
        trainingTips: {
            type: Type.ARRAY,
            description: "Two specific, actionable training tips to help the user improve.",
            items: { type: Type.STRING }
        },
        nutritionSuggestion: {
            type: Type.STRING,
            description: "One nutritional suggestion to support the user's training goals."
        }
    },
    required: ["analysis", "trainingTips", "nutritionSuggestion"]
};

const exerciseDetailSchema = {
    type: Type.OBJECT,
    properties: {
        description: {
            type: Type.STRING,
            description: "A concise description of the exercise, what it is, and what muscles it targets."
        },
        bestPractices: {
            type: Type.ARRAY,
            description: "A list of 3-4 key points or tips for performing the exercise correctly and safely.",
            items: { type: Type.STRING }
        },
        commonMistakes: {
            type: Type.ARRAY,
            description: "A list of 2-3 common mistakes to avoid when performing the exercise.",
            items: { type: Type.STRING }
        }
    },
    required: ["description", "bestPractices", "commonMistakes"]
};

const formatTimeUnit = (value: number) => {
    const minutes = Math.floor(value / 60);
    const seconds = value % 60;
    return `${minutes}m ${seconds}s`;
};

const formatRecord = (record: WorkoutRecord): string => {
    let valueStr: string;
    switch (record.type) {
        case 'Time':
            valueStr = formatTimeUnit(record.value);
            break;
        case 'Weight':
            valueStr = `${record.value} ${record.unit || 'kg'}`;
            break;
        case 'Reps':
            valueStr = `${record.value} reps`;
            break;
    }
    const formattedDate = new Date(record.date).toLocaleDateString();
    return `On ${formattedDate}, they recorded ${valueStr} for ${record.exercise}.`;
};

export const getTrainingAdvice = async (record: WorkoutRecord, history: WorkoutRecord[]): Promise<AnalysisResult> => {
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
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsedResult: AnalysisResult = JSON.parse(jsonText);
        return parsedResult;
    } catch (error) {
        console.error("Gemini API call failed:", error);
        throw new Error("Failed to generate advice from Gemini API.");
    }
};

export const getExerciseDetails = async (exerciseName: string): Promise<ExerciseDetail> => {
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
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: exerciseDetailSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsedResult: ExerciseDetail = JSON.parse(jsonText);
        return parsedResult;
    } catch (error) {
        console.error("Gemini API call for exercise details failed:", error);
        throw new Error("Failed to get exercise details from Gemini API.");
    }
};