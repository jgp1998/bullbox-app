import React, { useEffect } from 'react';
import { useUIStore } from '@/shared/store/useUIStore';
import { 
  ExerciseManagerModal, 
  ExerciseDetailModal, 
  useExercises, 
  useWorkouts 
} from '@/features/workout';
import { ScheduleModal, useSchedule } from '@/features/schedule';
import { useTrainingAnalysis } from '@/shared/hooks/useTrainingAnalysis';

export const GlobalModalContainer: React.FC = () => {
    const { 
        modals, 
        closeModal, 
        editingSession, 
        schedulingInitialDate, 
        currentExerciseDetail 
    } = useUIStore();
    
    // Feature state
    const { exercises, addExercise, deleteExercise } = useExercises();
    const { addRecord } = useWorkouts();
    const { 
        addScheduledSession, 
        updateScheduledSession, 
        isLoading: scheduleLoading 
    } = useSchedule();
    const { 
        exerciseDetail, 
        isLoading: analysisLoading, 
        error: analysisError, 
        getExerciseDetails 
    } = useTrainingAnalysis();

    // Effect to fetch exercise details when that modal opens
    useEffect(() => {
        if (modals.exerciseDetail && currentExerciseDetail) {
            getExerciseDetails(currentExerciseDetail);
        }
    }, [modals.exerciseDetail, currentExerciseDetail, getExerciseDetails]);

    return (
        <>
            <ExerciseManagerModal
                isOpen={modals.exerciseManager}
                onClose={() => closeModal("exerciseManager")}
                exercises={exercises}
                onAddExercise={addExercise}
                onDeleteExercise={deleteExercise}
            />

            <ExerciseDetailModal
                isOpen={modals.exerciseDetail}
                onClose={() => closeModal("exerciseDetail")}
                exerciseName={currentExerciseDetail || ''}
                details={exerciseDetail}
                isLoading={analysisLoading}
                error={analysisError}
            />

            <ScheduleModal
                isOpen={modals.schedule}
                onClose={() => closeModal("schedule")}
                onAddSession={addScheduledSession}
                onUpdateSession={updateScheduledSession}
                sessionToEdit={editingSession}
                initialDate={schedulingInitialDate}
            />
        </>
    );
};

export default GlobalModalContainer;
