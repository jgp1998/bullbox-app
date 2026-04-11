import React, { Suspense } from "react";
import { WorkoutHistory } from "@/features/history";
import { useUIStore } from "@/shared/store/useUIStore";

const HistoryPage = () => {
    const { theme } = useUIStore();
    
    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-(--foreground)">Historial</h1>
            </div>

            <Suspense fallback={<div className="h-96 bg-(--card) rounded-3xl animate-pulse border border-(--border)" />}>
                <WorkoutHistory theme={theme} showAiAnalysis={false} />
            </Suspense>
        </div>
    );
};

export default HistoryPage;
