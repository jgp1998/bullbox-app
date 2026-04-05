import React from 'react';
import { Theme } from '@/shared/types';
import ProgressChart from './ProgressChart';
import AnalysisModal from './AnalysisModal';
import HistoryItemSkeleton from './HistoryItemSkeleton';
import { LightBulbIcon, TrashIcon } from '@/shared/components/ui/Icons';
import { formatWorkoutValue, formatDate } from '@/shared/utils/formatters';
import { useI18n } from '@/shared/context/i18n';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import { useHistory } from '../hooks/useHistory';

interface WorkoutHistoryProps {
    theme: Theme;
}

const WorkoutHistory: React.FC<WorkoutHistoryProps> = ({ theme }) => {
    const { t } = useI18n();
    const {
        records,
        filteredRecords,
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
    } = useHistory();

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

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {isRecordsLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <HistoryItemSkeleton key={i} />
                    ))
                ) : filteredRecords.length > 0 ? (
                    filteredRecords.map(record => (
                        <div key={record.id} className="bg-[var(--input)] p-4 rounded-lg flex items-center justify-between hover:border-[var(--primary)] border border-transparent transition-all">
                            <div>
                                <p className="font-bold text-lg text-[var(--text)]">{record.exercise}</p>
                                <p className="text-sm text-[var(--muted-text)]">{formatDate(record.date)}</p>
                            </div>
                            <div className="flex items-center space-x-2 text-right">
                                <p className="text-sm font-black text-[var(--accent)] mr-2 tracking-tight">
                                    {formatWorkoutValue(record)}
                                </p>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleGetAnalysis(record)}
                                    title={t('workoutHistory.getAiAnalysis')}
                                    icon={<LightBulbIcon className="w-5 h-5 text-[var(--primary)]" />}
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteRecord(record.id)}
                                    title={t('workoutHistory.deleteRecord')}
                                    icon={<TrashIcon className="w-5 h-5 text-red-500" />}
                                    className="hover:text-red-500"
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <p className="text-[var(--muted-text)]">{t('workoutHistory.noRecords')}</p>
                    </div>
                )}
            </div>
            
            <AnalysisModal
                isOpen={!!analysisResult || isLoading || !!error}
                onClose={handleCloseAnalysis}
                result={analysisResult}
                isLoading={isLoading}
                error={error}
            />
            
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

