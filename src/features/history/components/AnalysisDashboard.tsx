import React from 'react';
import {  
    Zap, 
    Target,
    RefreshCw,
    BrainCircuit
} from 'lucide-react';
import { useHistoricalAnalysisStore } from '../store/useHistoricalAnalysisStore';
import { useAIStore } from '@/features/ai/store/useAIStore';
import { useAuthStore } from '@/features/auth';
import BalanceChart from './BalanceChart';
import { WorkoutRecord } from '@/shared/types';
import Spinner from '@/shared/components/ui/Spinner';
import Button from '@/shared/components/ui/Button';
import StructuredInsightCard from './StructuredInsightCard';
import { 
    formatInsightTitle, 
    formatInsightAction 
} from '../utils/insightTemplates';

interface AnalysisDashboardProps {
    records: WorkoutRecord[];
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ records }) => {
    const { result, isLoading, error, runAnalysis } = useHistoricalAnalysisStore();
    const { engineStatus, progress, progressText } = useAIStore();
    const { user } = useAuthStore();

    const handleRunAnalysis = () => {
        const mode = engineStatus === 'ready' ? 'local' : 'cloud';
        runAnalysis(records, mode, 'es', user);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 bg-(--card)/50 rounded-3xl border border-white/5 backdrop-blur-sm">
                <Spinner size="xl" />
                <p className="mt-6 font-bold text-lg text-(--primary) animate-pulse text-center">
                    Analizando tu historial de entrenamiento...
                </p>
                {engineStatus === 'loading' && (
                    <div className="mt-8 w-full max-w-xs space-y-2">
                        <div className="flex justify-between text-[10px] text-(--muted-text) uppercase tracking-widest font-bold">
                            <span>Cargando Motor IA</span>
                            <span>{Math.round(progress * 100)}%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <div 
                                className="h-full bg-(--primary) transition-all duration-500 ease-out"
                                style={{ width: `${progress * 100}%` }}
                            />
                        </div>
                        <p className="text-[10px] text-(--muted-text) text-center italic">{progressText}</p>
                    </div>
                )}
            </div>
        );
    }

    if (!result) {
        return (
            <div className="text-center py-16 px-6 bg-(--card)/30 rounded-3xl border border-dashed border-white/10">
                <div className="mb-6 inline-flex p-4 bg-(--primary)/10 rounded-full">
                    <BrainCircuit className="w-10 h-10 text-(--primary)" />
                </div>
                <h3 className="text-2xl font-bold text-(--foreground) mb-3">Tu Coach IA está listo</h3>
                <p className="text-(--muted-text) mb-8 max-w-md mx-auto">
                    Analizaremos tu progresión de fuerza, detectaremos estancamientos y evaluaremos tu fatiga acumulada para darte recomendaciones accionables.
                </p>
                <Button 
                    onClick={handleRunAnalysis} 
                    className="rounded-2xl px-8 h-12 shadow-xl shadow-(--primary)/20"
                >
                    Generar Análisis Histórico
                </Button>
            </div>
        );
    }

    // Sort by priorityScore
    const sortedInsights = [...result.insights].sort((a, b) => b.priorityScore - a.priorityScore);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold text-(--foreground) flex items-center gap-2">
                    <Zap className="w-5 h-5 text-(--primary)" />
                    Insights del Coach
                </h3>
                <button 
                   onClick={handleRunAnalysis} 
                   className="text-xs font-bold text-(--primary) hover:underline flex items-center gap-1"
                >
                    <RefreshCw className="w-3 h-3" />
                    Actualizar
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-min">
                    {sortedInsights.map((insight, index) => (
                        <StructuredInsightCard 
                            key={`${insight.type}-${index}`} 
                            insight={insight} 
                            delay={`${index * 100}ms`}
                        />
                    ))}
                </div>
                
                <div className="flex flex-col gap-4">
                    <BalanceChart data={useHistoricalAnalysisStore.getState().preprocessedData?.summary.last_30_days.movementBalancePercentages || {}} />
                    
                    <div className="bg-(--card) border border-white/5 rounded-2xl p-5 shadow-xl">
                        <div className="flex items-center gap-2 mb-4 text-(--primary)">
                            <Target className="w-5 h-5" />
                            <h4 className="font-bold text-sm uppercase tracking-wider">Resumen Táctico</h4>
                        </div>
                        <ul className="space-y-3">
                            {sortedInsights.filter(i => i.priorityScore > 0.7).slice(0, 3).map((insight, i) => (
                                <li key={i} className="flex gap-3 items-start text-xs text-(--text)">
                                    <div className="mt-1 w-1 h-1 rounded-full bg-(--primary) shrink-0" />
                                    <div className="space-y-0.5">
                                        <span className="font-bold block text-(--foreground)">{formatInsightTitle(insight.type)}</span>
                                        <span className="text-(--muted-text)">{formatInsightAction(insight)}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="mt-4 bg-(--primary)/5 border border-(--primary)/10 rounded-2xl p-6">
                <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-(--primary)">
                    <Target className="w-5 h-5" />
                    Plan de Acción Sugerido
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sortedInsights.map((insight, i) => (
                        <div key={i} className="flex gap-4 items-start group bg-white/5 p-4 rounded-xl border border-white/5 hover:border-(--primary)/30 transition-colors">
                            <span className="shrink-0 w-8 h-8 rounded-xl bg-(--primary)/20 text-(--primary) flex items-center justify-center font-bold text-sm">
                                {i + 1}
                            </span>
                            <div>
                                <h5 className="font-bold text-sm text-(--foreground)">{formatInsightTitle(insight.type)}</h5>
                                <p className="text-[11px] text-(--muted-text) mt-1 leading-relaxed">
                                    {formatInsightAction(insight)}
                                </p>
                                <div className="mt-2 flex gap-2">
                                    <span className="text-[9px] font-bold text-(--primary) bg-(--primary)/10 px-1.5 py-0.5 rounded">
                                        {insight.action.amount} {insight.action.unit}
                                    </span>
                                    <span className="text-[9px] font-medium text-(--muted-text) bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                                        {insight.action.duration_weeks} sem
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


export default AnalysisDashboard;
