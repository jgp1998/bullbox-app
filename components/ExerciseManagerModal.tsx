import React, { useState } from 'react';
import { XIcon, PlusIcon, TrashIcon } from './Icons';
import { useI18n } from '../context/i18n';

interface ExerciseManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercises: string[];
  onAddExercise: (exercise: string) => void;
  onDeleteExercise: (exercise: string) => void;
}

const ExerciseManagerModal: React.FC<ExerciseManagerModalProps> = ({ isOpen, onClose, exercises, onAddExercise, onDeleteExercise }) => {
  const { t } = useI18n();
  const [newExercise, setNewExercise] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

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
    setNewExercise('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--card)] rounded-lg shadow-2xl w-full max-w-md p-6 relative transform transition-all duration-300 ease-out scale-95 opacity-0 animate-fade-in-scale">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--muted-text)] hover:text-[var(--primary)] transition-colors"
          aria-label={t('modals.close')}
        >
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-[var(--primary)]">{t('modals.manageExercises')}</h2>
        
        <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <input
                    type="text"
                    value={newExercise}
                    onChange={(e) => setNewExercise(e.target.value)}
                    placeholder={t('modals.addExercisePlaceholder')}
                    className="flex-grow bg-[var(--input)] text-[var(--text)] p-3 rounded-md border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition"
                />
                <button
                    onClick={handleAdd}
                    className="p-3 rounded-md bg-[var(--primary)] text-white hover:opacity-90 transition-opacity"
                    aria-label={t('modals.addNewExercise')}
                >
                    <PlusIcon className="w-6 h-6" />
                </button>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            
            <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                {exercises.length > 0 ? (
                    exercises.map(ex => (
                        <div key={ex} className="flex items-center justify-between bg-[var(--background)] p-3 rounded-md">
                            <span className="text-[var(--text)]">{ex}</span>
                            <button
                                onClick={() => onDeleteExercise(ex)}
                                className="p-1.5 rounded-full text-[var(--muted-text)] hover:bg-[var(--input)] hover:text-red-500 transition-colors"
                                aria-label={t('modals.deleteExercise', { exercise: ex })}
                            >
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-[var(--muted-text)] py-4">{t('modals.noExercises')}</p>
                )}
            </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.3s forwards;
        }
      `}</style>
    </div>
  );
};

export default ExerciseManagerModal;