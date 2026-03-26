import React, { useState, useMemo } from 'react';
import { WorkoutRecord, Theme } from '../types';
import ProgressChart from './ProgressChart';
import { LightBulbIcon, TrashIcon } from './Icons';
import { formatValue, getUnit } from '../utils/formatters';
import { useI18n } from '../context/i18n';

interface WorkoutHistoryProps {
    records: WorkoutRecord[];
    exercises: string[];
    theme: Theme;
    onGetAnalysis: (record: WorkoutRecord) => void;
    onDeleteRecord: (id: string) => void;
}

const WorkoutHistory: React.FC<WorkoutHistoryProps> = ({ records, exercises, theme, onGetAnalysis, onDeleteRecord }) => {
    const { t } = useI18n();
    const [selectedExercise, setSelectedExercise] = useState<string>('All');

    const filteredRecords = useMemo(() => {
        if (selectedExercise === 'All') {
            return records;
        }
        return records.filter(record => record.exercise === selectedExercise);
    }, [records, selectedExercise]);
    
    const uniqueExercisesWithRecords = useMemo(() => {
        const unique = new Set(records.map(r => r.exercise));
        const allWithRecords = ['All', ...Array.from(unique)].filter(ex => ex === 'All' || exercises.includes(ex));
        return allWithRecords;
    }, [records, exercises]);

    return (
        <div className="bg-[var(--card)] p-6 rounded-lg shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <h2 className="text-2xl font-bold text-[var(--primary)]">{t('workoutHistory.title')}</h2>
                <select
                    value={selectedExercise}
                    onChange={(e) => setSelectedExercise(e.target.value)}
                    className="w-full sm:w-auto bg-[var(--input)] text-[var(--text)] p-2 rounded-md border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition"
                >
                    {uniqueExercisesWithRecords.map(ex => (
                        <option key={ex} value={ex}>{ex === 'All' ? t('workoutHistory.allExercises') : ex}</option>
                    ))}
                </select>
            </div>
            
            {selectedExercise !== 'All' && filteredRecords.length > 0 && (
                 <div className="mb-6">
                    <ProgressChart records={records} exercise={selectedExercise} theme={theme} />
                </div>
            )}

            {filteredRecords.length > 0 ? (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {filteredRecords.map(record => (
                        <div key={record.id} className="bg-[var(--background)] p-4 rounded-lg flex items-center justify-between hover:bg-opacity-80 transition-colors">
                            <div>
                                <p className="font-bold text-lg text-[var(--text)]">{record.exercise}</p>
                                <p className="text-sm text-[var(--muted-text)]">{new Date(record.date).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center space-x-3 text-right">
                                <p className="text-lg font-semibold text-[var(--accent)]">
                                    {formatValue(record.value, record.type)}
                                    <span className="text-sm font-normal text-[var(--muted-text)] ml-1">
                                        {getUnit(record.type, record.unit)}
                                    </span>
                                </p>
                                <button
                                    onClick={() => onGetAnalysis(record)}
                                    className="p-2 rounded-full text-[var(--muted-text)] hover:text-[var(--primary)] hover:bg-[var(--input)] transition-colors"
                                    title={t('workoutHistory.getAiAnalysis')}
                                >
                                    <LightBulbIcon className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => onDeleteRecord(record.id)}
                                    className="p-2 rounded-full text-[var(--muted-text)] hover:text-red-500 hover:bg-[var(--input)] transition-colors"
                                    title={t('workoutHistory.deleteRecord')}
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-[var(--muted-text)] py-8">{t('workoutHistory.noRecords')}</p>
            )}
        </div>
    );
};

export default WorkoutHistory;