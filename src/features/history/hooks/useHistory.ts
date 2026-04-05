import { useState, useMemo } from 'react';
import { HistoryRecord } from '@/shared/types';
import { useHistoryAnalysisStore } from '../store/useHistoryAnalysisStore';
import { useRecords } from '@/features/records';
import { useI18n } from '@/shared/context/i18n';

export const useHistory = () => {
    const { records, deleteRecord, isLoading: isRecordsLoading } = useRecords();
    const { analysisResult, isLoading, error, getAnalysis, reset } = useHistoryAnalysisStore();
    const { language } = useI18n();
    const [selectedExercise, setSelectedExercise] = useState<string>('All');

    const exercises = useMemo(() => {
        const unique = new Set(records.map(r => r.exercise));
        return Array.from(unique);
    }, [records]);

    const filteredRecords = useMemo(() => {
        if (selectedExercise === 'All') {
            return records;
        }
        return records.filter(record => record.exercise === selectedExercise);
    }, [records, selectedExercise]);

    const uniqueExercisesWithRecords = useMemo(() => {
        const allWithRecords = ['All', ...exercises];
        return allWithRecords;
    }, [exercises]);

    const handleGetAnalysis = async (record: HistoryRecord) => {
        await getAnalysis(record, records, language);
    };

    const handleDeleteRecord = (id: string) => {
        deleteRecord(id);
    };

    const handleCloseAnalysis = () => {
        reset();
    };

    return {
        records,
        filteredRecords,
        exercises,
        uniqueExercisesWithRecords,
        selectedExercise,
        setSelectedExercise,
        analysisResult,
        isLoading,
        isRecordsLoading,
        error,
        handleGetAnalysis,
        handleDeleteRecord,
        handleCloseAnalysis
    };
};
