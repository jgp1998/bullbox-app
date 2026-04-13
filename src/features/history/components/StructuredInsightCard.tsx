import React from 'react';
import { 
    TrendingUp, 
    AlertTriangle, 
    Activity, 
    Zap,
    Target,
    BrainCircuit,
    Info
} from 'lucide-react';
import { StructuredInsight } from '@/core/domain/models/Analysis';
import { 
    formatInsightTitle, 
    formatInsightDiagnosis, 
    formatInsightAction 
} from '../utils/insightTemplates';

const INSIGHT_CONFIG = {
    strength_progress: { icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    stagnation_detected: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
    training_balance: { icon: Activity, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    fatigue_warning: { icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
};

const PRIORITY_BADGES = {
    low: { label: 'Baja', icon: Info, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    medium: { label: 'Media', icon: Activity, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    high: { label: 'Alta', icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-500/10' },
};

interface StructuredInsightCardProps {
    insight: StructuredInsight;
    delay?: string;
}

const StructuredInsightCard: React.FC<StructuredInsightCardProps> = ({ insight, delay = '0ms' }) => {
    const config = INSIGHT_CONFIG[insight?.type as keyof typeof INSIGHT_CONFIG] || INSIGHT_CONFIG['training_balance'];
    const priority = PRIORITY_BADGES[insight?.priority as keyof typeof PRIORITY_BADGES] || PRIORITY_BADGES['medium'];
    const Icon = config.icon;
    const PriorityIcon = priority.icon;

    const metric = insight?.metric || { name: 'Dato', type: 'weight' as const, change_percent: 0, period_weeks: 0, baseline_value: 0, current_value: 0, unit: '' };
    const diagnosis = insight?.diagnosis || { trend: 'plateau' as const };
    const action = insight?.action || { 
        exercise: '', 
        type: 'increase_load' as const, 
        amount: 0, 
        unit: 'reps' as const, 
        per: 'workout' as const, 
        duration_weeks: 0,
        target_rpe: undefined
    };

    const title = formatInsightTitle(insight?.type as any) || 'Análisis';
    const diagnosisText = formatInsightDiagnosis({ ...insight, diagnosis });
    const actionText = formatInsightAction({ ...insight, action });

    return (
        <div 
            className="bg-(--card) border border-white/5 rounded-2xl p-5 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both overflow-hidden relative group"
            style={{ animationDelay: delay }}
        >
            {/* Priority Indicator Line */}
            <div 
                className={`absolute top-0 right-0 h-1 transition-opacity ${priority.color.replace('text', 'bg')}`} 
                style={{ width: `${(insight?.priorityScore || 0) * 100}%` }}
            />

            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${config.bg}`}>
                        <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${config.color}`}>
                                {title}
                            </span>
                            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${priority.bg} ${priority.color}`}>
                                <PriorityIcon className="w-2.5 h-2.5" />
                                {priority.label}
                            </div>
                        </div>
                        <h4 className="font-bold text-sm text-(--foreground)">{metric.name}</h4>
                    </div>
                </div>
                
                {(insight?.confidence || 0) < 0.8 && (
                    <span className="text-[8px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-(--muted-text) font-medium">
                        Confianza: {Math.round((insight?.confidence || 0) * 100)}%
                    </span>
                )}
            </div>

            <div className="space-y-4 mb-5">
                {/* DATO / PROGRESO */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-(--muted-text) uppercase tracking-tighter">
                        <TrendingUp className="w-3 h-3" />
                        Dato Clave
                    </div>
                    <div className="flex items-end gap-3">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-(--muted-text) font-medium uppercase tracking-tighter">Hito Anterior</span>
                            <span className="text-sm font-bold text-(--foreground)">{metric.baseline_value}{metric.unit}</span>
                        </div>
                        <div className="h-6 w-px bg-white/10 mb-1" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-(--primary) font-black uppercase tracking-tighter">Actual</span>
                            <span className="text-xl font-black text-(--foreground) leading-none">
                                {metric.current_value}{metric.unit}
                            </span>
                        </div>
                        <div className={`ml-auto self-center px-2 py-1 rounded-lg text-[10px] font-black ${metric.change_percent >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                            {metric.change_percent >= 0 ? '↑' : '↓'} {Math.abs(metric.change_percent)}%
                        </div>
                    </div>
                    <p className="text-[9px] text-(--muted-text) italic">
                        Calculado en un periodo de {metric.period_weeks} semanas
                    </p>
                </div>

                {/* DIAGNÓSTICO */}
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-(--muted-text) uppercase tracking-tighter">
                        <BrainCircuit className="w-3 h-3" />
                        Diagnóstico del Coach
                    </div>
                    <p className="text-[11px] text-(--text) leading-relaxed italic opacity-90 border-l-2 border-(--primary)/30 pl-3 py-1">
                        "{diagnosisText}"
                    </p>
                </div>
            </div>

            {/* ACCIÓN ESPECÍFICA Area */}
            <div className="mt-auto pt-4 border-t border-white/5 bg-white/2 -mx-5 px-5 -mb-5 pb-5">
                <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-(--primary)/10 shrink-0">
                        <Target className="w-4 h-4 text-(--primary)" />
                    </div>
                    <div className="space-y-1.5 w-full">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-(--primary) uppercase tracking-widest block">Acción Inmediata</span>
                            {action.target_rpe && (
                                <span className="bg-orange-500/20 text-orange-400 text-[9px] font-black px-1.5 py-0.5 rounded border border-orange-500/20">
                                    ESFUERZO RPE {action.target_rpe}
                                </span>
                            )}
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs font-black text-(--foreground) leading-snug uppercase tracking-tight">
                                {actionText}
                            </p>
                            
                            <div className="flex flex-wrap gap-2">
                                <span className="bg-(--primary) text-(--primary-foreground) text-[10px] font-black px-2 py-0.5 rounded-md shadow-lg shadow-(--primary)/20">
                                    {action.amount} {action.unit} {action.per}
                                </span>
                                <span className="bg-white/5 text-(--foreground) text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/10">
                                    {action.duration_weeks} semanas
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StructuredInsightCard;
