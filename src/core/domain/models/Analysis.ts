export interface AnalysisResult {
    analysis: string;
    trainingTips: string[];
    nutritionSuggestion: string;
}

export type InsightType = 'strength_progress' | 'stagnation_detected' | 'training_balance' | 'fatigue_warning';
export type InsightPriority = 'low' | 'medium' | 'high';

export type DiagnosisTrend = 
    | 'strength_up' 
    | 'volume_up' 
    | 'performance_down' 
    | 'plateau' 
    | 'consistency_up' 
    | 'overtraining_risk';

export type DiagnosisIssue = 
    | 'low_rep_volume' 
    | 'lack_of_variety' 
    | 'insufficient_rest' 
    | 'low_intensity' 
    | 'high_fatigue' 
    | 'imbalance_push_pull';

export type ActionCategory = 
    | 'increase_reps' 
    | 'increase_load' 
    | 'reduce_volume' 
    | 'change_exercise' 
    | 'deload' 
    | 'add_cardio' 
    | 'increase_frequency';

export type ActionPer = 'set' | 'workout' | 'week';

export interface StructuredInsight {
    type: InsightType;
    priority: InsightPriority;
    priorityScore: number; // 0.0 - 1.0 for sorting
    confidence: number; // 0.0 - 1.0
    
    metric: {
        name: string;
        type: 'weight' | 'reps' | 'volume' | 'sessions' | 'estimated_1rm';
        change_percent: number;
        period_weeks: number;
        baseline_value: number;
        current_value: number;
        unit: string;
    };
    
    diagnosis: {
        trend: DiagnosisTrend;
        issue?: DiagnosisIssue | null;
    };
    
    action: {
        exercise: string;
        type: ActionCategory;
        amount: number;
        unit: 'reps' | 'kg' | 'sets' | 'minutes' | 'RPE';
        per: ActionPer;
        duration_weeks: number;
        target_rpe?: number | null;
    };
}

export interface HistoricalAnalysisResult {
    insights: StructuredInsight[];
}

