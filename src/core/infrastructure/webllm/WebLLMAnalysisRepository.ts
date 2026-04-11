import { CreateWebWorkerMLCEngine, MLCEngineInterface } from "@mlc-ai/web-llm";
import { HistoryRecord, ExerciseDetail, HistoricalAnalysisResult, StructuredInsight } from '@/shared/types';
import { AnalysisRepository } from "../../domain/repositories/AnalysisRepository";
import { useAIStore } from "@/features/ai/store/useAIStore";

import { jsonrepair } from 'jsonrepair';

export class WebLLMAnalysisRepository implements AnalysisRepository {
    private engine: MLCEngineInterface | null = null;
    private initPromise: Promise<MLCEngineInterface> | null = null;
    private readonly modelId = "Llama-3.2-1B-Instruct-q4f16_1-MLC"; // Modelo recomendado para móvil/PWA
    private persistenceRequested = false;

    async initialize() {
        if (import.meta.env.VITE_ENABLE_WEBLLM !== 'true') {
            console.log("WebLLM is disabled by configuration (VITE_ENABLE_WEBLLM).");
            return;
        }
        try {
            await this.requestPersistence();
            await this.ensureEngine();
        } catch (error) {
            console.error("WebLLM initialization failed in background:", error);
        }
    }

    private async requestPersistence() {
        if (this.persistenceRequested) return;
        
        if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
            this.persistenceRequested = true;
            try {
                // Primero verificamos si ya es persistente
                const alreadyPersisted = await navigator.storage.persisted();
                if (alreadyPersisted) {
                    useAIStore.getState().setStoragePersisted(true);
                    return;
                }

                // Si no, solicitamos persistencia. 
                // Nota: En desktop/Chrome suele denegarse si no es una PWA instalada 
                // o no hay interacción suficiente, pero el Cache API sigue funcionando.
                const isPersisted = await navigator.storage.persist();
                useAIStore.getState().setStoragePersisted(isPersisted);
                console.log(`[Storage] Persistence ${isPersisted ? 'granted' : 'denied'}. (Note: Standard caching still works)`);
            } catch (error) {
                console.warn("[Storage] Persistence request failed:", error);
            }
        }
    }

    private async ensureEngine() {
        if (import.meta.env.VITE_ENABLE_WEBLLM !== 'true') {
            const errorMsg = "WebLLM is disabled (VITE_ENABLE_WEBLLM is not true)";
            useAIStore.getState().setError(errorMsg);
            throw new Error(errorMsg);
        }
        
        if (this.engine) return this.engine;
        if (this.initPromise) return this.initPromise;

        const store = useAIStore.getState();
        store.setEngineStatus('loading');

        this.initPromise = (async () => {
            try {
                console.log("Starting WebLLM Engine initialization...");
                const engine = await CreateWebWorkerMLCEngine(
                    new Worker(
                        new URL("../../../features/ai/worker/llm.worker.ts", import.meta.url),
                        { type: "module" }
                    ),
                    this.modelId,
                    {
                        initProgressCallback: (report) => {
                            console.log("WebLLM Init Progress:", report.text);
                            store.setProgress(report);
                        }
                    }
                );
                this.engine = engine;
                store.setEngineStatus('ready');
                console.log("WebLLM Engine ready.");
                return engine;
            } catch (error: any) {
                console.error("WebLLM Engine failed to initialize:", error);
                store.setError(error.message || "Failed to initialize WebLLM engine");
                store.setEngineStatus('error');
                this.initPromise = null; // Allow retry
                throw error;
            }
        })();

        return this.initPromise;
    }

    // Replaced by historicalSchema for structured coaching

    private readonly detailsSchema = {
        type: "object",
        properties: {
            description: { type: "string" },
            bestPractices: {
                type: "array",
                items: { type: "string" }
            },
            commonMistakes: {
                type: "array",
                items: { type: "string" }
            }
        },
        required: ["description", "bestPractices", "commonMistakes"]
    };

    async getTrainingAdvice(record: HistoryRecord, history: HistoryRecord[], language?: string): Promise<StructuredInsight[]> {
        const engine = await this.ensureEngine();
        
        // GROUND TRUTH CALCULATION (Don't trust the 1B LLM for math)
        const previousRecord = history.length > 0 ? history[history.length - 1] : null;
        const baselineValue = previousRecord ? (previousRecord.weight || 0) : 0;
        const currentValue = record.weight || 0;
        const changePercent = baselineValue > 0 ? ((currentValue - baselineValue) / baselineValue) * 100 : 0;

        const relevantHistory = history
            .filter(h => h.exercise === record.exercise)
            .slice(-5);
            
        const prompt = this.buildAdvicePrompt(record, relevantHistory, language);
        
        const response = await engine.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            response_format: { 
                type: "json_object",
                schema: JSON.stringify(this.historicalSchema)
            },
            temperature: 1.0,  // Allow some creativity for the reasoning
            max_tokens: 800,
        });
        
        const content = response.choices[0].message.content || "{}";
        try {
            const repairedContent = jsonrepair(content);
            const parsed = JSON.parse(repairedContent) as { insights: StructuredInsight[] };
            console.log("DEBUG: Parsed insights count:", parsed.insights?.length);
            
            // Apply Guardrails
            return (parsed.insights || []).map(insight => this.sanitizeInsight(
                insight, 
                record.exercise, 
                baselineValue, 
                currentValue, 
                changePercent
            ));
        } catch (e) {
            console.log("DEBUG: Error in getTrainingAdvice:", e);
            console.error("AI Training Advice Response parsing failed. Original content:", content);
            // Return a safe fallback if everything fails
            return [this.generateFallbackInsight(record.exercise, baselineValue, currentValue, changePercent)];
        }
    }

    private sanitizeInsight(
        insight: any, 
        exerciseName: string, 
        baseline: number, 
        current: number, 
        change: number
    ): StructuredInsight {
        console.log("DEBUG: Sanitizing insight for:", exerciseName);
        // 1. Force Exercise Name (LLM often uses placeholders)
        const name = exerciseName;

        // 2. Map Enums safely
        const validTypes = ['strength_progress', 'stagnation_detected', 'training_balance', 'fatigue_warning'];
        const type = validTypes.includes(insight.type) ? insight.type : (change > 0 ? 'strength_progress' : 'training_balance');

        const validPriorities = ['low', 'medium', 'high'];
        const priority = validPriorities.includes(insight.priority) ? insight.priority : 'medium';

        const validTrends = ['strength_up', 'volume_up', 'performance_down', 'plateau', 'consistency_up', 'overtraining_risk'];
        let trend = insight.diagnosis?.trend;
        if (!validTrends.includes(trend)) {
            if (change > 5) trend = 'strength_up';
            else if (change < -5) trend = 'performance_down';
            else trend = 'plateau';
        }

        const validActions = ['increase_reps', 'increase_load', 'reduce_volume', 'change_exercise', 'deload', 'add_cardio', 'increase_frequency'];
        const actionType = validActions.includes(insight.action?.type) ? insight.action.type : (change < 0 ? 'reduce_volume' : 'increase_load');

        // 3. Re-assemble with GROUND TRUTH for metrics
        return {
            type: type as any,
            priority: priority as any,
            priorityScore: typeof insight.priorityScore === 'number' ? insight.priorityScore : 0.5,
            confidence: typeof insight.confidence === 'number' ? insight.confidence : 0.7,
            metric: {
                name,
                type: 'weight',
                change_percent: Number(change.toFixed(1)),
                period_weeks: insight.metric?.period_weeks || 4,
                baseline_value: baseline,
                current_value: current,
                unit: 'kg'
            },
            diagnosis: {
                trend: trend as any,
                issue: insight.diagnosis?.issue || null
            },
            action: {
                exercise: name,
                type: actionType as any,
                amount: typeof insight.action?.amount === 'number' ? insight.action.amount : 2.5,
                unit: insight.action?.unit || 'kg',
                per: insight.action?.per || 'workout',
                duration_weeks: insight.action?.duration_weeks || 2,
                target_rpe: insight.action?.target_rpe || 8
            }
        };
    }

    private generateFallbackInsight(exercise: string, baseline: number, current: number, change: number): StructuredInsight {
        return {
            type: change >= 0 ? 'strength_progress' : 'stagnation_detected',
            priority: 'medium',
            priorityScore: 0.5,
            confidence: 0.5,
            metric: {
                name: exercise,
                type: 'weight',
                change_percent: Number(change.toFixed(1)),
                period_weeks: 4,
                baseline_value: baseline,
                current_value: current,
                unit: 'kg'
            },
            diagnosis: {
                trend: change >= 0 ? 'strength_up' : 'performance_down',
                issue: null
            },
            action: {
                exercise,
                type: change >= 0 ? 'increase_load' : 'reduce_volume',
                amount: 2.5,
                unit: 'kg',
                per: 'workout',
                duration_weeks: 2,
                target_rpe: 8
            }
        };
    }

    private readonly historicalSchema = {
        type: "object",
        properties: {
            insights: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        type: { type: "string", description: "Elegir entre: strength_progress, stagnation_detected, training_balance, fatigue_warning" },
                        priority: { type: "string", description: "Elegir entre: low, medium, high" },
                        priorityScore: { type: "number", minimum: 0, maximum: 1, description: "Nivel de urgencia 0.0 - 1.0" },
                        confidence: { type: "number", minimum: 0, maximum: 1, description: "Nivel de confianza probando datos 0.0 - 1.0" },
                        metric: {
                            type: "object",
                            properties: {
                                name: { type: "string", description: "Nombre exacto del ejercicio evaluado (ej. 'Back Squat')" },
                                type: { type: "string", description: "Siempre usar 'weight', 'reps' o 'volume'" },
                                change_percent: { type: "number", description: "Porcentaje exacto de mejora/empeoramiento. Extraer del valor 'trend'." },
                                period_weeks: { type: "number", description: "Número de semanas evaluado (usualmente 4)." },
                                baseline_value: { type: "number", description: "El número real del peso antiguo/inicial en kilogramos (ej: extraer de lastSessions)." },
                                current_value: { type: "number", description: "El número real del peso actual en kilogramos (ej: extraer de lastSessions)." },
                                unit: { type: "string", description: "Siempre usar 'kg' o 'reps'" }
                            },
                            required: ["name", "type", "change_percent", "period_weeks", "baseline_value", "current_value", "unit"]
                        },
                        diagnosis: {
                            type: "object",
                            properties: {
                                trend: { type: "string", description: "Elegir entre: strength_up, plateau, performance_down" },
                                issue: { type: "string", description: "Opcional. Elegir entre: low_rep_volume, lack_of_variety, high_fatigue. Usar 'null' si no hay." }
                            },
                            required: ["trend"]
                        },
                        action: {
                            type: "object",
                            properties: {
                                exercise: { type: "string", description: "Nombre exacto del ejercicio que requiere acción" },
                                type: { type: "string", description: "Elegir entre: increase_load, increase_reps, reduce_volume, deload" },
                                amount: { type: "number", description: "Cantidad real sugerida (ej. 2.5)" },
                                unit: { type: "string", description: "Elegir entre: kg, reps, RPE" },
                                per: { type: "string", description: "Elegir entre: set, workout, week" },
                                duration_weeks: { type: "number", description: "Semanas recomendadas (ej. 1 o 2)" },
                                target_rpe: { type: "number", description: "RPE objetivo (ej. 8)" }
                            },
                            required: ["exercise", "type", "amount", "unit", "per", "duration_weeks"]
                        }
                    },
                    required: ["type", "priority", "priorityScore", "confidence", "metric", "diagnosis", "action"]
                }
            }
        },
        required: ["insights"]
    };


    async getHistoricalAnalysis(data: any, language?: string): Promise<HistoricalAnalysisResult> {
        const engine = await this.ensureEngine();
        const prompt = this.buildHistoricalPrompt(data, language);

        const response = await engine.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            response_format: { 
                type: "json_object",
                schema: JSON.stringify(this.historicalSchema)
            },
            temperature: 0.8, // Slightly higher for more varied insights
            max_tokens: 1000,
        });

        const content = response.choices[0].message.content || "{}";
        try {
            const repairedContent = jsonrepair(content);
            const parsed = JSON.parse(repairedContent) as HistoricalAnalysisResult;
            
            // Apply Guardrails for each insight
            const sanitizedInsights = (parsed.insights || []).map((insight, index) => {
                const insightName = (insight.metric?.name || '').toLowerCase();
                
                // 1. Try exact name match
                let exerciseData = data.exercises?.find((e: any) => 
                    e.name.toLowerCase() === insightName
                );

                // 2. Try partial/keyword match if it's not a generic word like "name" or "ejercicio"
                if (!exerciseData && insightName.length > 3 && !['name', 'ejerc', 'ejercicio'].some(word => insightName.includes(word))) {
                    exerciseData = data.exercises?.find((e: any) => 
                        e.name.toLowerCase().includes(insightName) || insightName.includes(e.name.toLowerCase())
                    );
                }

                // 3. Last fallback: use the exercise at the same index in the input data
                // This handles cases where the LLM returns insights in order but uses generic names
                if (!exerciseData) {
                    exerciseData = data.exercises?.[index] || data.exercises?.[0];
                }

                if (!exerciseData) return insight;

                const baseline = exerciseData.baselineWeight || (exerciseData.lastSessions[exerciseData.lastSessions.length - 1]?.kilogramos || 0);
                const current = exerciseData.lastSessions[0]?.kilogramos || 0;
                const change = parseFloat(exerciseData.trend.replace('%', '')) || 0;

                return this.sanitizeInsight(insight, exerciseData.name, baseline, current, change);
            });

            return { insights: sanitizedInsights };
        } catch (e) {
            console.error("AI Historical Response parsing failed. Original content:", content);
            return { insights: [] };
        }
    }

    async getExerciseDetails(exerciseName: string, language?: string): Promise<ExerciseDetail> {
        const engine = await this.ensureEngine();
        const prompt = this.buildDetailsPrompt(exerciseName, language);

        const response = await engine.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            response_format: { 
                type: "json_object",
                schema: JSON.stringify(this.detailsSchema)
            }
        });

        const content = response.choices[0].message.content || "{}";
        return JSON.parse(content) as ExerciseDetail;
    }

    private buildAdvicePrompt(record: HistoryRecord, history: HistoryRecord[], language: string = 'en'): string {
        const isSpanish = language === 'es';
        
        const previousRecord = history.length > 0 ? history[history.length - 1] : null;
        const baselineValue = previousRecord ? (previousRecord.weight || 0) : 0;
        const currentValue = record.weight || 0;
        
        const dataForAI = {
            exercise_name: record.exercise,
            current_session_weight_kg: currentValue,
            current_session_reps: record.reps || 0,
            previous_session_weight_kg: baselineValue,
            history_of_exercise: this.summarizeHistory(history, isSpanish)
        };

        const constraints = isSpanish ? `
REGLAS PARA EL COACH (EJERCICIO ESPECÍFICO):
1. CERO TEXTO LIBRE O NÚMEROS FALSOS: Usa unicamente los datos proporcionados.
2. ASIGNACIÓN EXACTA DE DATOS: 
   - metric.name: Usa el nombre en 'exercise_name'.
   - metric.baseline_value: Copia EXACTAMENTE el valor de 'previous_session_weight_kg'.
   - metric.current_value: Copia EXACTAMENTE el valor de 'current_session_weight_kg'.
3. DIAGNÓSTICO: Basado en la diferencia entre current y previous.
` : `
COACH RULES (SPECIFIC EXERCISE):
1. ZERO FREE TEXT OR FAKE NUMBERS: Use only the provided input data.
2. EXACT DATA MAPPING:
   - metric.name: Use the name from 'exercise_name'.
   - metric.baseline_value: EXACTLY copy the value from 'previous_session_weight_kg'.
   - metric.current_value: EXACTLY copy the value from 'current_session_weight_kg'.
3. DIAGNOSIS: Based on the difference between current and previous.
`;

        return `Persona: Eres un Coach de Fuerza experto.
        
Tarea: Analiza el progreso del ejercicio "${record.exercise}" y genera hallazgos tácticos.

${constraints}

Datos Reales:
${JSON.stringify(dataForAI, null, 2)}

${this.getJsonStructureGuidance(isSpanish)}`;
    }

    private getJsonStructureGuidance(isSpanish: boolean): string {
        return `INSTRUCCIONES DE FORMATO DE SALIDA (ESTRICTO):
Debes retornar un JSON válido que contenga un objeto con la propiedad "insights" (un array). Cada elemento del array debe tener exactamente las siguientes propiedades calculadas a partir de los datos:
1. "type" (string)
2. "priority" (string)
3. "priorityScore" (número de 0 a 1)
4. "confidence" (número de 0 a 1)
5. "metric": Objeto con "name" (string), "type" (string), "change_percent" (número exacto), "period_weeks" (número), "baseline_value" (número real extraído), "current_value" (número real extraído), "unit" (string).
6. "diagnosis": Objeto con "trend" (string), "issue" (string o null).
7. "action": Objeto con "exercise" (string), "type" (string), "amount" (número real recomendado), "unit" (string), "per" (string), "duration_weeks" (número) y "target_rpe" (número).

REGLA DE ORO: Extrae los números de los datos de entrada, NO uses datos falsos ni ejemplos. NO dejes llaves sin cerrar.`;
    }

    private summarizeHistory(history: HistoryRecord[], isSpanish: boolean): string {
        if (history.length === 0) return isSpanish ? "Sin historial previo." : "No previous history.";

        return history.map(h => {
            const date = new Date(h.date).toLocaleDateString(isSpanish ? 'es-ES' : 'en-US');
            const metrics = [];
            if (h.weight) metrics.push(`${h.weight}${h.unit || 'kg'}`);
            if (h.reps) metrics.push(`x${h.reps} reps`);
            if (h.time) metrics.push(`${h.time}s`);
            
            const volume = (h.weight || 0) * (h.reps || 0);
            const volumeText = volume > 0 ? ` (Volumen: ${volume}kg)` : '';
            
            return `- ${date}: ${metrics.join(' ')}${volumeText}`;
        }).join('\n');
    }

    private buildDetailsPrompt(exerciseName: string, language: string = 'en'): string {
        const isSpanish = language === 'es';
        const role = isSpanish ? "un experto en anatomía y ejercicio" : "an anatomy and exercise expert";
        const langForce = isSpanish
            ? "IMPORTANTE: La descripción y los consejos DEBEN estar en ESPAÑOL."
            : "IMPORTANT: The description and tips MUST be in ENGLISH.";

        return `You are ${role}.
        Provide technical details for: ${exerciseName}.
        
        ${langForce}
        
        Expected JSON format: 
        { 
            "description": "Functional description in ${isSpanish ? 'Spanish' : 'English'}", 
            "bestPractices": ["Technical tips in ${isSpanish ? 'Spanish' : 'English'}"], 
            "commonMistakes": ["Avoidance tips in ${isSpanish ? 'Spanish' : 'English'}"] 
        }`;
    }

    private buildHistoricalPrompt(data: any, language: string = 'en'): string {
        const isSpanish = language === 'es';
        
        const constraints = isSpanish ? `
GOLDEN RULES:
1. DO NOT INVENT DATA: It is strictly forbidden to use generic words like "name" or "placeholder". 
2. EXACT DATA MAPPING:
   - 'metric.name': COPIA EL NOMBRE EXACTO del ejercicio del array 'exercises'.
    - 'metric.baseline_value': COPIA EL VALOR 'baselineWeight' de ese ejercicio.
    - 'metric.current_value': COPIA EL VALOR 'kilogramos' del primer elemento de 'lastSessions'.
    - 'metric.change_percent': EXTRAE el número del string 'trend' (ej. "+12.0%" -> 12.0).
3. EXHAUSTIVE ANALYSIS: Analiza cada uno de los ejercicios proporcionados.
4. JSON INTEGRITY: Produce a valid JSON and close all braces.
` : `
GOLDEN RULES:
1. DO NOT INVENT DATA: It is strictly forbidden to use generic words like "name" or "placeholder".
2. EXACT DATA MAPPING:
   - 'metric.name': COPY THE EXACT exercise name from the 'exercises' array.
    - 'metric.baseline_value': EXACTLY copy the 'baselineWeight' value.
    - 'metric.current_value': EXACTLY copy the 'kilogramos' value from the first element of 'lastSessions'.
    - 'metric.change_percent': EXTRACT the number from the 'trend' string. (e.g. "+12.0%" -> 12.0).
3. EXHAUSTIVE ANALYSIS: Analyze every exercise provided in the input.
4. JSON INTEGRITY: Produce a valid JSON and close all braces.
`;

        return `Persona: Eres un Analista de Rendimiento Deportivo de nivel mundial.
        
Tarea: Analiza los datos de entrenamiento y genera una lista de hallazgos tácticos de alto valor en formato estructurado JSON.
NO GENERES JSON INVÁLIDO. CIERRA TODAS LAS LLAVES.

${constraints}

Datos de Entrada Reales (DEDUCE LOS HALLAZGOS SOLO DE ESTOS DATOS):
${JSON.stringify(data, null, 2)}

${this.getJsonStructureGuidance(isSpanish)}
    
REGLA CRÍTICA: Tienes absolutamente prohibido inventar, simular o usar datos falsos. OBLIGATORIO: Utiliza únicamente los valores y nombres reales proporcionados en los Datos de Entrada. Si no hay datos, retorna {"insights": []}.`;
    }

}
