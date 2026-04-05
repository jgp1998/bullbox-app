import React, { useState } from 'react';
import { PlusIcon, TrashIcon } from '@/shared/components/ui/Icons';
import { useI18n } from '@/shared/context/i18n';
import { useToast } from '@/shared/context/ToastContext';
import Modal from '@/shared/components/ui/Modal';
import Input from '@/shared/components/ui/Input';
import Button from '@/shared/components/ui/Button';

interface ExerciseManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercises: string[];
  onAddExercise: (exercise: string) => void;
  onDeleteExercise: (exercise: string) => void;
}

const ExerciseManagerModal: React.FC<ExerciseManagerModalProps> = ({ isOpen, onClose, exercises, onAddExercise, onDeleteExercise }) => {
  const { t } = useI18n();
  const { showSuccess } = useToast();
  const [newExercise, setNewExercise] = useState('');
  const [error, setError] = useState('');

  const handleAdd = () => {
    setError('');
    if (!newExercise.trim()) {
      setError(t('modals.errors.emptyExercise'));
      return;
    }
    if (exercises.find(ex => ex.toLowerCase() === newExercise.trim().toLowerCase())) {
        setError(t('modals.errors.exerciseExists'));
        return;
    }
    onAddExercise(newExercise.trim());
    showSuccess(t('workoutForm.exerciseAdded', { exercise: newExercise.trim() }));
    setNewExercise('');
  };

  return (
    <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        title={t('modals.manageExercises')}
        size="md"
    >
        <div className="space-y-6">
            <div className="flex items-end space-x-2">
                <div className="flex-grow">
                    <Input
                        label={t('workoutForm.exercise')} // Reusing label
                        type="text"
                        value={newExercise}
                        onChange={(e) => setNewExercise(e.target.value)}
                        placeholder={t('modals.addExercisePlaceholder')}
                    />
                </div>
                <Button
                    onClick={handleAdd}
                    size="icon"
                    aria-label={t('modals.addNewExercise')}
                    icon={<PlusIcon className="w-6 h-6" />}
                />
            </div>
            
            {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
            
            <div className="space-y-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {exercises.length > 0 ? (
                    exercises.map(ex => (
                        <div key={ex} className="flex items-center justify-between bg-[var(--input)] p-3 rounded-lg border border-transparent hover:border-[var(--border)] transition-all">
                            <span className="text-[var(--text)] font-medium">{ex}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onDeleteExercise(ex)}
                                title={t('modals.deleteExercise', { exercise: ex })}
                                icon={<TrashIcon className="w-5 h-5 text-red-500" />}
                                className="hover:text-red-500"
                            />
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <p className="text-[var(--muted-text)]">{t('modals.noExercises')}</p>
                    </div>
                )}
            </div>
        </div>
        
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
    </Modal>
  );
};

export default ExerciseManagerModal;

