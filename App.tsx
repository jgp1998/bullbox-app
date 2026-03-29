import React, { useState, useEffect } from 'react';
import Header from '@/src/shared/components/layout/Header';
import { UserTour } from '@/src/features/pwa';
import { 
    WorkoutForm, 
    WorkoutHistory, 
    PersonalBests, 
    ExerciseManagerModal,
    useWorkouts, 
    useExercises,
    WorkoutRecord,
    ExerciseDetailModal
} from '@/src/features/workout';
import { ShareAndInfo } from '@/src/features/share';
import { LoginScreen, useAuthStore } from '@/src/features/auth';
import { TrainingAgenda, ScheduleModal, useSchedule } from '@/src/features/schedule';
import { WeightConverter } from '@/src/features/weight-converter';
import { PercentageCalculator } from '@/src/features/rm-calculator';
import { themes } from './constants';
import { Theme, ScheduledSession } from './types';
import { useTrainingAnalysis } from './hooks/useTrainingAnalysis';

import { useUIStore } from './store/useUIStore';

const App: React.FC = () => {
    // Shared state/hooks
    const { 
        records, personalBests, addRecord, deleteRecord 
    } = useWorkouts();
    const { 
        user, isLoading: authLoading 
    } = useAuthStore();
    const { 
        exercises, addExercise, deleteExercise,
    } = useExercises(); 
    const { 
        scheduledSessions, addScheduledSession, updateScheduledSession, deleteScheduledSession,
    } = useSchedule();
    const { 
        analysisResult, exerciseDetail, isLoading, error, 
        getAnalysis, getExerciseDetails 
    } = useTrainingAnalysis();

    // UI Store
    const { 
        theme, setTheme, modals, openModal, closeModal, 
        editingSession, schedulingInitialDate, currentExerciseDetail, applyTheme 
    } = useUIStore();

    // Initial theme apply
    useEffect(() => {
        applyTheme();
    }, [applyTheme]);

    // Modal handlers
    const handleShowExerciseDetailsInternal = async (exerciseName: string) => {
        openModal('exerciseDetail', exerciseName);
        await getExerciseDetails(exerciseName);
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
            </div>
        );
    }

    if (!user) {
        return <LoginScreen onLogin={() => {}} />; // Callback no longer needed as LoginScreen uses useAuthStore directly
    }

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--text)] font-sans antialiased overflow-x-hidden">
            <Header />
            <main className="p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="md:col-span-2 lg:col-span-1 space-y-4 sm:space-y-6">
                        <WorkoutForm 
                            onAddRecord={addRecord} 
                            onManageExercises={() => openModal('exerciseManager')}
                            exercises={exercises}
                        />
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-6">
                            <WeightConverter user={user} />
                            <PercentageCalculator records={personalBests} user={user} />
                         </div>
                         <ShareAndInfo />
                    </div>
                    <div className="md:col-span-2 lg:col-span-2 space-y-4 sm:space-y-6">
                        <PersonalBests records={personalBests} onShowDetails={handleShowExerciseDetailsInternal} />
                        <TrainingAgenda 
                            sessions={scheduledSessions}
                            onAddSession={(date) => openModal('schedule', date)}
                            onEditSession={(session) => openModal('schedule', session)}
                            onDeleteSession={deleteScheduledSession}
                        />
                        <WorkoutHistory theme={theme} />
                    </div>
                </div>
            </main>
            
            <ExerciseManagerModal
                isOpen={modals.exerciseManager}
                onClose={() => closeModal('exerciseManager')}
                exercises={exercises}
                onAddExercise={addExercise}
                onDeleteExercise={deleteExercise}
            />

             <ExerciseDetailModal
                isOpen={modals.exerciseDetail}
                onClose={() => closeModal('exerciseDetail')}
                exerciseName={currentExerciseDetail}
                details={exerciseDetail}
                isLoading={isLoading}
                error={error}
            />

            <ScheduleModal
                isOpen={modals.schedule}
                onClose={() => closeModal('schedule')}
                onAddSession={addScheduledSession}
                onUpdateSession={updateScheduledSession}
                sessionToEdit={editingSession}
                initialDate={schedulingInitialDate}
            />
        </div>
    );
};

export default App;