import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import WorkoutForm from './components/WorkoutForm';
import WorkoutHistory from './components/WorkoutHistory';
import PersonalBests from './components/PersonalBests';
import ShareAndInfo from './components/ShareAndInfo';
import AnalysisModal from './components/AnalysisModal';
import ExerciseManagerModal from './components/ExerciseManagerModal';
import ExerciseDetailModal from './components/ExerciseDetailModal';
import LoginScreen from './components/LoginScreen';
import TrainingSchedule from './components/TrainingSchedule';
import ScheduleModal from './components/ScheduleModal';
import WeightConverter from './components/WeightConverter';
import PercentageCalculator from './components/PercentageCalculator';
import { themes } from './constants';
import { WorkoutRecord, Theme, ScheduledSession } from './types';
import { useAuth } from './hooks/useAuth';
import { useWorkouts } from './hooks/useWorkouts';
import { useExercises } from './hooks/useExercises';
import { useSchedule } from './hooks/useSchedule';
import { useTrainingAnalysis } from './hooks/useTrainingAnalysis';

import { useUIStore } from './store/useUIStore';

const App: React.FC = () => {
    // Shared state/hooks
    const { user, login: handleLogin, logout: handleLogout } = useAuth();
    const { records, addRecord, deleteRecord, personalBests } = useWorkouts();
    const { exercises, addExercise, deleteExercise } = useExercises();
    const { scheduledSessions, addScheduledSession, updateScheduledSession, deleteScheduledSession } = useSchedule();
    const { 
        analysisResult, exerciseDetail, isLoading, error, 
        getAnalysis, getExerciseDetails 
    } = useTrainingAnalysis();

    // UI Store
    const { 
        theme, setTheme, modals, openModal, closeModal, 
        editingSession, currentExerciseDetail, applyTheme 
    } = useUIStore();

    // Initial theme apply
    useEffect(() => {
        applyTheme();
    }, [applyTheme]);

    // Modal handlers
    const handleGetAnalysisInternal = async (record: WorkoutRecord) => {
        openModal('analysis');
        await getAnalysis(record, records);
    };
    
    const handleShowExerciseDetailsInternal = async (exerciseName: string) => {
        openModal('exerciseDetail', exerciseName);
        await getExerciseDetails(exerciseName);
    };

    if (!user) {
        return <LoginScreen onLogin={handleLogin} />;
    }

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--text)] font-sans">
            <Header user={user} onLogout={handleLogout} />
            <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-6">
                        <WorkoutForm 
                            onAddRecord={addRecord} 
                            onManageExercises={() => openModal('exerciseManager')}
                            exercises={exercises}
                        />
                         <WeightConverter user={user} />
                         <PercentageCalculator records={personalBests} user={user} />
                         <ShareAndInfo />
                    </div>
                    <div className="lg:col-span-2 space-y-6">
                        <PersonalBests records={personalBests} onShowDetails={handleShowExerciseDetailsInternal} />
                        <TrainingSchedule 
                            sessions={scheduledSessions}
                            onAddSession={() => openModal('schedule')}
                            onEditSession={(session) => openModal('schedule', session)}
                            onDeleteSession={deleteScheduledSession}
                        />
                        <WorkoutHistory 
                            records={records} 
                            exercises={exercises}
                            theme={theme} 
                            onGetAnalysis={handleGetAnalysisInternal}
                            onDeleteRecord={deleteRecord}
                        />
                    </div>
                </div>
            </main>
            
            <AnalysisModal 
                isOpen={modals.analysis}
                onClose={() => closeModal('analysis')}
                result={analysisResult}
                isLoading={isLoading}
                error={error}
            />

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
            />
        </div>
    );
};

export default App;