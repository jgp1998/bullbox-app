import { 
    InsightType, 
    DiagnosisTrend, 
    DiagnosisIssue, 
    ActionCategory, 
    StructuredInsight 
} from '@/core/domain/models/Analysis';

export const formatInsightTitle = (type: InsightType, language: string = 'es'): string => {
    const isSpanish = language === 'es';
    
    const titles: Record<string, string> = {
        strength_progress: isSpanish ? 'Progreso de Fuerza' : 'Strength Progress',
        stagnation_detected: isSpanish ? 'Alerta de Estancamiento' : 'Plateau Detected',
        training_balance: isSpanish ? 'Balance de Entrenamiento' : 'Training Balance',
        fatigue_warning: isSpanish ? 'Aviso de Fatiga' : 'Fatigue Warning'
    };
    
    return titles[type] || (isSpanish ? 'Análisis de Entrenamiento' : 'Training Analysis');
};

export const formatInsightDiagnosis = (insight: StructuredInsight, language: string = 'es'): string => {
    const isSpanish = language === 'es';
    const { diagnosis, metric } = insight;
    const exerciseName = metric?.name || (isSpanish ? 'el ejercicio' : 'the exercise');
    
    const trends: Record<string, string> = {
        strength_up: isSpanish 
            ? `Tu ${exerciseName} subió de ${metric.baseline_value}${metric.unit} a ${metric.current_value}${metric.unit} (+${Math.abs(metric.change_percent)}%)`
            : `Your ${exerciseName} increased from ${metric.baseline_value}${metric.unit} to ${metric.current_value}${metric.unit} (+${Math.abs(metric.change_percent)}%)`,
        volume_up: isSpanish
            ? `Tu volumen total en ${exerciseName} subió de ${metric.baseline_value} a ${metric.current_value} (+${Math.abs(metric.change_percent)}%)`
            : `Total volume in ${exerciseName} increased from ${metric.baseline_value} to ${metric.current_value} (+${Math.abs(metric.change_percent)}%)`,
        performance_down: isSpanish
            ? `Rendimiento en ${exerciseName} cayó de ${metric.baseline_value}${metric.unit} a ${metric.current_value}${metric.unit} (-${Math.abs(metric.change_percent)}%)`
            : `Performance in ${exerciseName} dropped from ${metric.baseline_value}${metric.unit} to ${metric.current_value}${metric.unit} (-${Math.abs(metric.change_percent)}%)`,
        plateau: isSpanish
            ? `Estancamiento en ${exerciseName} mantenido en ${metric.current_value}${metric.unit}`
            : `Plateau in ${exerciseName} maintained at ${metric.current_value}${metric.unit}`,
        consistency_up: isSpanish
            ? `Tu frecuencia de entrenamiento subió a ${metric.current_value} sesiones (${metric.change_percent}%)`
            : `Your training frequency increased to ${metric.current_value} sessions (${metric.change_percent}%)`,
        overtraining_risk: isSpanish
            ? `Fatiga crítica detectada: caída de rendimiento sistemática en ${exerciseName}`
            : `Critical fatigue detected: systematic performance drop in ${exerciseName}`
    };

    const issues: Record<string, string> = {
        low_rep_volume: isSpanish ? 'con volumen de reps muy bajo para hipertrofia' : 'with rep volume too low for hypertrophy',
        lack_of_variety: isSpanish ? 'falta de variedad en el estímulo mecánico' : 'lack of variety in mechanical stimulus',
        insufficient_rest: isSpanish ? 'recuperación incompleta entre sesiones' : 'incomplete recovery between sessions',
        low_intensity: isSpanish ? 'la intensidad relativa (RPE) es insuficiente' : 'relative intensity (RPE) is insufficient',
        high_fatigue: isSpanish ? 'señales de fatiga acumulada del sistema nervioso' : 'signs of accumulated nervous system fatigue',
        imbalance_push_pull: isSpanish ? 'desbalance estructural entre empuje y tracción' : 'structural imbalance between push and pull'
    };

    let result = trends[diagnosis?.trend] || (isSpanish ? `Análisis para ${exerciseName}` : `Analysis for ${exerciseName}`);
    
    if (diagnosis?.issue && issues[diagnosis.issue]) {
        result += isSpanish ? `. Diagnóstico: ${issues[diagnosis.issue]}` : `. Diagnosis: ${issues[diagnosis.issue]}`;
    }
    
    return result;
};

export const formatInsightAction = (insight: StructuredInsight, language: string = 'es'): string => {
    const isSpanish = language === 'es';
    const { action } = insight;
    const exerciseName = action?.exercise || (isSpanish ? 'el ejercicio' : 'the exercise');
    
    const categories: Record<string, string> = {
        increase_reps: isSpanish ? 'Aumenta a' : 'Increase to',
        increase_load: isSpanish ? 'Sube a' : 'Increase to',
        reduce_volume: isSpanish ? 'Baja a' : 'Reduce to',
        change_exercise: isSpanish ? 'Cambia por' : 'Change for',
        deload: isSpanish ? 'Semana de descarga' : 'Deload week',
        add_cardio: isSpanish ? 'Añade' : 'Add',
        increase_frequency: isSpanish ? 'Entrena' : 'Train'
    };

    const units: Record<string, string> = {
        reps: isSpanish ? 'reps' : 'reps',
        kg: isSpanish ? 'kg' : 'kg',
        sets: isSpanish ? 'series' : 'sets',
        minutes: isSpanish ? 'minutos' : 'minutes',
        RPE: isSpanish ? 'RPE' : 'RPE'
    };

    const frequency: Record<string, string> = {
        set: isSpanish ? 'por serie' : 'per set',
        workout: isSpanish ? 'por sesión' : 'per session',
        week: isSpanish ? 'por semana' : 'per week'
    };

    const category = categories[action?.type] || (isSpanish ? 'Recomendación:' : 'Recommendation:');
    const unit = units[action?.unit] || '';
    const freq = frequency[action?.per] || '';

    let actionText = `${category} ${action?.amount || ''}${unit} ${freq} en ${exerciseName}`;
    
    if (action?.target_rpe) {
        actionText += isSpanish ? ` (Mantén RPE ${action.target_rpe})` : ` (Keep RPE ${action.target_rpe})`;
    }

    if (!isSpanish) {
        actionText = `${category} ${exerciseName} to ${action?.amount || ''}${unit} ${freq}`;
        if (action?.target_rpe) actionText += ` (at RPE ${action.target_rpe})`;
    }

    return actionText;
};
