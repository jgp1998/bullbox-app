import React, { Suspense } from "react";
import { useAuthStore } from "@/features/auth";
import { useWorkouts } from "@/features/workout";
import { PersonalBests } from "@/features/records";

const RecordsPage = () => {
    const { personalBests, isLoading: workoutsLoading } = useWorkouts();
    const { isLoading: authLoading } = useAuthStore();
    
    return (
        <div className="space-y-4 sm:space-y-6">
            <h1 className="text-2xl font-bold text-(--foreground) mb-4">Mejores Marcas Personales</h1>
            <Suspense fallback={<div className="h-64 bg-(--card) rounded-3xl animate-pulse border border-(--border)" />}>
                <PersonalBests
                    records={personalBests}
                    isLoading={workoutsLoading || authLoading}
                    showAiAnalysis={false}
                />
            </Suspense>
        </div>
    );
};

export default RecordsPage;
