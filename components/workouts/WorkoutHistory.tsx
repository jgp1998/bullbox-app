import React, { useState, useMemo } from 'react';
import { WorkoutRecord, Theme } from '../../types';
import ProgressChart from '../analysis/ProgressChart';
import { LightBulbIcon, TrashIcon } from '../Icons';
import { formatWorkoutValue } from '../../utils/formatters';
import { useI18n } from '../../context/i18n';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

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
        <Card title={t('workoutHistory.title')}>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div className="w-full sm:w-64">
                    <Input
                        type="select"
                        value={selectedExercise}
                        onChange={(e) => setSelectedExercise(e.target.value)}
                        options={uniqueExercisesWithRecords.map(ex => ({
                            value: ex,
                            label: ex === 'All' ? t('workoutHistory.allExercises') : ex
                        }))}
                    />
                </div>
            </div>
            
            {selectedExercise !== 'All' && filteredRecords.length > 0 && (
                 <div className="mb-8 p-4 bg-[var(--input)] rounded-xl border border-[var(--border)]">
                    <ProgressChart records={records} exercise={selectedExercise} theme={theme} />
                </div>
            )}

            {filteredRecords.length > 0 ? (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredRecords.map(record => (
                        <div key={record.id} className="bg-[var(--input)] p-4 rounded-lg flex items-center justify-between hover:border-[var(--primary)] border border-transparent transition-all">
                            <div>
                                <p className="font-bold text-lg text-[var(--text)]">{record.exercise}</p>
                                <p className="text-sm text-[var(--muted-text)]">{new Date(record.date).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center space-x-2 text-right">
                                <p className="text-sm font-black text-[var(--accent)] mr-2 tracking-tight">
                                    {formatWorkoutValue(record)}
                                </p>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onGetAnalysis(record)}
                                    title={t('workoutHistory.getAiAnalysis')}
                                    icon={<LightBulbIcon className="w-5 h-5 text-[var(--primary)]" />}
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onDeleteRecord(record.id)}
                                    title={t('workoutHistory.deleteRecord')}
                                    icon={<TrashIcon className="w-5 h-5 text-red-500" />}
                                    className="hover:text-red-500"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                     <p className="text-[var(--muted-text)]">{t('workoutHistory.noRecords')}</p>
                </div>
            )}
            
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: var(--border);
                    border-radius: 10px;
                }
            `}</style>
        </Card>
    );
};

export default WorkoutHistory;
