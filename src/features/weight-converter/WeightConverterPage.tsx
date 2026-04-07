import React, { Suspense } from "react";
import { useAuthStore } from "@/features/auth";
import { useI18n } from "@/shared/context/i18n";
import { WeightConverter } from "@/features/weight-converter";

const WeightConverterPage = () => {
    const { user } = useAuthStore();
    const { t } = useI18n();
    
    return (
        <div className="max-w-xl mx-auto space-y-4 sm:space-y-6">
            <h1 className="text-2xl font-bold text-(--foreground) mb-4">{t('weightConverter.title')}</h1>
            <Suspense fallback={<div className="h-48 bg-(--card) rounded-3xl animate-pulse border border-(--border)" />}>
                <WeightConverter user={user!} />
            </Suspense>
        </div>
    );
};

export default WeightConverterPage;
