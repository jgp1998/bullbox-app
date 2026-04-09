import React, { Suspense, useState } from "react";
import { WorkoutHistory } from "@/features/history";
import { useUIStore } from "@/shared/store/useUIStore";
import AnalysisDashboard from "./components/AnalysisDashboard";
import { useHistory } from "./hooks/useHistory";
import { List as ListIcon, BrainCircuit as BrainCircuitIcon } from "lucide-react";

const HistoryPage = () => {
    const { theme } = useUIStore();
    const [activeTab, setActiveTab] = useState<'list' | 'ai'>('list');
    const { records } = useHistory();
    
    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-(--foreground)">Historial</h1>
                
                <div className="flex p-1 bg-(--card) rounded-2xl border border-white/5 w-fit">
                    <button 
                        onClick={() => setActiveTab('list')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'list' ? 'bg-(--primary) text-white shadow-lg' : 'text-(--muted-text) hover:text-(--text)'}`}
                    >
                        <ListIcon className="w-4 h-4" />
                        Ejercicios
                    </button>
                    <button 
                        onClick={() => setActiveTab('ai')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'ai' ? 'bg-(--primary) text-white shadow-lg' : 'text-(--muted-text) hover:text-(--text)'}`}
                    >
                        <BrainCircuitIcon className="w-4 h-4" />
                        AI Coach
                    </button>
                </div>
            </div>

            <Suspense fallback={<div className="h-96 bg-(--card) rounded-3xl animate-pulse border border-(--border)" />}>
                {activeTab === 'list' ? (
                    <WorkoutHistory theme={theme} />
                ) : (
                    <AnalysisDashboard records={records} />
                )}
            </Suspense>
        </div>
    );
};

export default HistoryPage;
