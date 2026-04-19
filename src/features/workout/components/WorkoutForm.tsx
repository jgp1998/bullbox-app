import React, { useState, useEffect } from 'react';
import { WorkoutRecord, WeightUnit } from '@/shared/types';
import { WEIGHT_UNITS } from '@/shared/constants';
import { PlusIcon, EditIcon, ChevronDownIcon } from '@/shared/components/ui/Icons';
import { useI18n } from '@/shared/context/i18n';
import { useToast } from '@/shared/context/ToastContext';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import { useUIStore } from '@/shared/store/useUIStore';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useExercises } from '../hooks';

const WorkoutForm: React.FC<{ onAddRecord: (record: Omit<WorkoutRecord, 'id'>) => void }> = ({ onAddRecord }) => {
  const { openModal } = useUIStore();
  const { exercises } = useExercises();
  const { t } = useI18n();
  const { showSuccess, showError } = useToast();
  const { user, activeBoxId } = useAuthStore();
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
  const [barWeight, setBarWeight] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
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

    // 1. Date Validation (No future dates)
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate > today) {
      setError(t('workoutForm.errors.futureDate'));
      return;
    }

    // 2. Seconds Validation
    if (secs >= 60) {
      setError(t('workoutForm.errors.invalidSeconds'));
      return;
    }

    // 3. Max Time Validation
    if (mins > 999) {
      setError(t('workoutForm.errors.maxTimeReached'));
      return;
    }

    // 4. Positive Values Validation
    if ((!isNaN(numWeight) && numWeight < 0) || 
        (!isNaN(numReps) && numReps < 0) || 
        (numBarWeight < 0)) {
      setError(t('workoutForm.errors.positiveValue')); 
      return;
    }

    // 5. Metric Selection Validation
    if (isNaN(numWeight) && isNaN(numReps) && numTime === 0) {
      setError(t('workoutForm.errors.atLeastOneMetric'));
      return;
    }

    if (!user || !activeBoxId) {
      setError(t('workoutForm.errors.authRequired'));
      return;
    }

    const newRecord: Omit<WorkoutRecord, 'id'> = {
      date,
      exercise,
      userId: user.uid,
      boxId: activeBoxId,
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
      setBarWeight('');
    } catch (err) {
      showError(t('workoutForm.errors.failedToAdd'));
    }
  };

  return (
    <Card data-testid="workout-form-card">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="date" className="block text-xs font-black text-(--muted-text) uppercase tracking-widest">{t('workoutForm.date')}</label>
            <Input 
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              data-testid="date-input"
            />
          </div>
          <div className="flex items-end space-x-2">
            <div className="grow">
              <label htmlFor="exercise" className="block text-xs font-black text-(--muted-text) uppercase tracking-widest">{t('workoutForm.exercise')}</label>
              <Input 
                id="exercise"
                type="select"
                value={exercise}
                onChange={(e) => setExercise(e.target.value)}
                options={exercises.map(ex => ({ value: ex, label: ex }))}
                required
                data-testid="exercise-select"
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              data-testid="manage-exercises-button"
              onClick={() => openModal('exerciseManager')}
              title={t('workoutForm.manageExercises')}
              icon={<EditIcon className="w-5 h-5" />}
              className="mb-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
          <div className="space-y-3">
            <label htmlFor="weight-input" className="block text-xs font-black text-(--muted-text) uppercase tracking-widest">{t('workoutForm.weight')}</label>
            <div className="flex gap-2">
              <Input
                id="weight-input"
                type="number"
                step="any"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="0.00"
                className="grow font-bold text-lg"
                data-testid="weight-input"
                inputMode="decimal"
              />
              <div className="flex bg-(--card-bg) border border-(--border-color) rounded-xl overflow-hidden min-w-[120px]">
                {(WEIGHT_UNITS).map(unit => (
                  <button
                    key={unit}
                    type="button"
                    onClick={() => setWeightUnit(unit)}
                    className={`flex-1 py-3 text-xs font-black uppercase transition-all ${
                      weightUnit === unit 
                        ? 'bg-(--primary) text-white' 
                        : 'text-(--muted-text) hover:bg-(--primary)/10'
                    }`}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label htmlFor="reps-input" className="block text-xs font-black text-(--muted-text) uppercase tracking-widest">{t('workoutForm.reps')}</label>
            <Input
              id="reps-input"
              type="number"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              placeholder="0"
              className="font-bold text-lg"
              data-testid="reps-input"
              inputMode="numeric"
            />
          </div>
        </div>

        <button 
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          data-testid="advanced-toggle"
          className="flex items-center gap-2 text-xs font-black text-(--primary) uppercase tracking-widest hover:opacity-80 transition-opacity"
        >
          <span className={`transition-transform duration-300 ${showAdvanced ? 'rotate-180' : ''}`}>
            <ChevronDownIcon className="w-4 h-4" />
          </span>
          {showAdvanced ? t('workoutForm.hideAdvanced') : t('workoutForm.advancedOptions')}
        </button>

        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-3">
              <span id="time-label" className="block text-xs font-black text-(--muted-text) uppercase tracking-widest">{t('workoutForm.time')}</span>
              <div className="flex items-center gap-2" role="group" aria-labelledby="time-label">
                <Input
                  id="minutes-input"
                  aria-label="Minutes"
                  type="number"
                  placeholder="mm"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  min="0"
                  className="text-center font-bold"
                  inputMode="numeric"
                />
                <span className="font-black text-(--primary)" aria-hidden="true">:</span>
                <Input
                  id="seconds-input"
                  aria-label="Seconds"
                  type="number"
                  placeholder="ss"
                  value={seconds}
                  onChange={(e) => setSeconds(e.target.value)}
                  min="0"
                  max="59"
                  className="text-center font-bold"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="bar-weight-input" className="block text-xs font-black text-(--muted-text) uppercase tracking-widest">{t('workoutForm.barWeight')}</label>
              <Input
                id="bar-weight-input"
                type="number"
                step="any"
                value={barWeight}
                onChange={(e) => setBarWeight(e.target.value)}
                placeholder="20 (kg)"
                className="font-bold border-(--accent)/30"
                data-testid="bar-weight-input"
                inputMode="decimal"
              />
            </div>
          </div>
        )}
        
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl animate-shake">
            <p className="text-xs text-red-300 font-bold text-center uppercase tracking-tight">{error}</p>
          </div>
        )}
        
        <Button
          type="submit"
          variant="primary"
          className="w-full py-4 text-lg font-black uppercase italic tracking-widest shadow-lg shadow-(--primary)/20"
          icon={<PlusIcon className="w-6 h-6" />}
          data-testid="add-record-button"
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
