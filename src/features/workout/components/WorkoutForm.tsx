import React, { useState, useEffect } from 'react';
import { WorkoutRecord, WeightUnit } from '../types';
import { WEIGHT_UNITS } from '../constants';
import { PlusIcon, EditIcon } from '@/src/shared/components/ui/Icons';
import { useI18n } from '@/context/i18n';
import { useToast } from '@/context/ToastContext';
import Card from '@/src/shared/components/ui/Card';
import Button from '@/src/shared/components/ui/Button';
import Input from '@/src/shared/components/ui/Input';

interface WorkoutFormProps {
  onAddRecord: (record: Omit<WorkoutRecord, 'id'>) => void;
  onManageExercises: () => void;
  exercises: string[];
}

const WorkoutForm: React.FC<WorkoutFormProps> = ({ onAddRecord, onManageExercises, exercises }) => {
  const { t } = useI18n();
  const { showSuccess, showError } = useToast();
  const [exercise, setExercise] = useState('');
  
  // Get local YYYY-MM-DD string
  const getLocalDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [date, setDate] = useState(getLocalDate());
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');
  const [reps, setReps] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [barWeight, setBarWeight] = useState(''); // Added bar weight field
  const [error, setError] = useState('');

  useEffect(() => {
    if (exercises.length > 0 && !exercise) {
      setExercise(exercises[0]);
    }
  }, [exercises, exercise]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!exercise) {
      setError(t('workoutForm.errors.selectExercise'));
      return;
    }

    const numWeight = parseFloat(weight);
    const numReps = parseInt(reps, 10);
    const mins = parseInt(minutes, 10) || 0;
    const secs = parseInt(seconds, 10) || 0;
    const numTime = (mins * 60) + secs;
    const numBarWeight = parseFloat(barWeight) || 0;

    // Validate that at least one metric is provided
    if (isNaN(numWeight) && isNaN(numReps) && numTime === 0) {
      setError(t('workoutForm.errors.atLeastOneMetric'));
      return;
    }

    const newRecord: Omit<WorkoutRecord, 'id'> = {
      date,
      exercise,
    };

    if (!isNaN(numWeight)) {
      newRecord.weight = numWeight;
      newRecord.unit = weightUnit;
    }

    if (!isNaN(numReps)) {
      newRecord.reps = numReps;
    }

    if (numTime > 0) {
      newRecord.time = numTime;
    }

    if (numBarWeight > 0) {
      newRecord.barWeight = numBarWeight;
    }

    try {
      await onAddRecord(newRecord);
      showSuccess(t('workoutForm.recordAdded', { exercise }));

      // Reset fields
      setWeight('');
      setReps('');
      setMinutes('');
      setSeconds('');
    } catch (err) {
      showError(t('workoutForm.errors.failedToAdd'));
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input 
            id="date"
            label={t('workoutForm.date')}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <div className="flex items-end space-x-2">
            <div className="flex-grow">
              <Input 
                id="exercise"
                label={t('workoutForm.exercise')}
                type="select"
                value={exercise}
                onChange={(e) => setExercise(e.target.value)}
                options={exercises.map(ex => ({ value: ex, label: ex }))}
                required
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={onManageExercises}
              title={t('workoutForm.manageExercises')}
              icon={<EditIcon className="w-5 h-5" />}
              className="mb-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="block text-xs font-black text-[var(--muted-text)] uppercase tracking-widest">{t('workoutForm.weight')}</label>
            <div className="flex gap-2">
              <Input
                type="number"
                step="any"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="0.00"
                className="flex-grow font-bold"
              />
              <div className="flex bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl overflow-hidden min-w-[100px]">
                {(WEIGHT_UNITS).map(unit => (
                  <button
                    key={unit}
                    type="button"
                    onClick={() => setWeightUnit(unit)}
                    className={`flex-1 py-1 text-[10px] font-black uppercase transition-all ${
                      weightUnit === unit 
                        ? 'bg-[var(--primary)] text-white' 
                        : 'text-[var(--muted-text)] hover:bg-[var(--primary)]/10'
                    }`}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-black text-[var(--muted-text)] uppercase tracking-widest">{t('workoutForm.reps')}</label>
            <Input
              type="number"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              placeholder="0"
              className="font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="block text-xs font-black text-[var(--muted-text)] uppercase tracking-widest">{t('workoutForm.time')}</label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="mm"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                min="0"
                className="text-center font-bold"
              />
              <span className="font-black text-[var(--primary)]">:</span>
              <Input
                type="number"
                placeholder="ss"
                value={seconds}
                onChange={(e) => setSeconds(e.target.value)}
                min="0"
                max="59"
                className="text-center font-bold"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-black text-[var(--muted-text)] uppercase tracking-widest">{t('workoutForm.barWeight')}</label>
            <Input
              type="number"
              step="any"
              value={barWeight}
              onChange={(e) => setBarWeight(e.target.value)}
              placeholder="20 (kg)"
              className="font-bold border-[var(--accent)]/30"
            />
          </div>
        </div>
        
        {error && (
          <div className="p-3 bg-red-500 bg-opacity-10 border border-red-500 border-opacity-20 rounded-xl animate-shake">
            <p className="text-xs text-red-500 font-bold text-center uppercase tracking-tight">{error}</p>
          </div>
        )}
        
        <Button
          type="submit"
          variant="primary"
          className="w-full py-4 text-lg font-black uppercase italic tracking-widest shadow-lg shadow-[var(--primary)]/20"
          icon={<PlusIcon className="w-6 h-6" />}
        >
          {t('workoutForm.addRecord')}
        </Button>
      </form>
      
      <style>{`
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-4px); }
            75% { transform: translateX(4px); }
        }
        .animate-shake {
            animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </Card>
  );
};

export default WorkoutForm;
