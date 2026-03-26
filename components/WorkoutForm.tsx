import React, { useState, useEffect } from 'react';
import { WorkoutRecord, RecordType, WeightUnit } from '../types';
import { RECORD_TYPES, WEIGHT_UNITS } from '../constants';
import { PlusIcon, EditIcon } from './Icons';
import { useI18n } from '../context/i18n';

interface WorkoutFormProps {
  onAddRecord: (record: Omit<WorkoutRecord, 'id'>) => void;
  onManageExercises: () => void;
  exercises: string[];
}

const WorkoutForm: React.FC<WorkoutFormProps> = ({ onAddRecord, onManageExercises, exercises }) => {
  const { t } = useI18n();
  const [exercise, setExercise] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [recordType, setRecordType] = useState<RecordType>('Weight');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');
  const [value, setValue] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (exercises.length > 0 && !exercise) {
      setExercise(exercises[0]);
    }
  }, [exercises, exercise]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let numericValue: number;

    if (recordType === 'Time') {
      const mins = parseInt(minutes, 10) || 0;
      const secs = parseInt(seconds, 10) || 0;
      if (mins === 0 && secs === 0) {
        setError(t('workoutForm.errors.validTime'));
        return;
      }
      numericValue = (mins * 60) + secs;
    } else {
      numericValue = parseFloat(value);
      if (isNaN(numericValue) || numericValue <= 0) {
        setError(t('workoutForm.errors.positiveValue'));
        return;
      }
    }
    
    if (!exercise) {
        setError(t('workoutForm.errors.selectExercise'));
        return;
    }

    onAddRecord({
      date,
      exercise,
      type: recordType,
      value: numericValue,
      unit: recordType === 'Weight' ? weightUnit : undefined,
    });

    setValue('');
    setMinutes('');
    setSeconds('');
  };
  
  const getUnit = () => {
    switch (recordType) {
        case 'Weight': return weightUnit;
        case 'Reps': return 'reps';
        default: return '';
    }
  }

  return (
    <div className="bg-[var(--card)] p-6 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-2">
            <div className="flex-grow">
                 <label htmlFor="exercise" className="block text-sm font-medium text-[var(--muted-text)] mb-1">{t('workoutForm.exercise')}</label>
                <select
                    id="exercise"
                    value={exercise}
                    onChange={(e) => setExercise(e.target.value)}
                    className="w-full bg-[var(--input)] text-[var(--text)] p-3 rounded-md border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition"
                    required
                >
                    {exercises.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                </select>
            </div>
            <button
                type="button"
                onClick={onManageExercises}
                className="self-end p-3 rounded-md bg-[var(--input)] text-[var(--muted-text)] hover:text-[var(--primary)] border border-[var(--border)] hover:border-[var(--primary)] transition-colors"
                title={t('workoutForm.manageExercises')}
            >
                <EditIcon className="w-6 h-6" />
            </button>
        </div>

        <div>
            <label htmlFor="date" className="block text-sm font-medium text-[var(--muted-text)] mb-1">{t('workoutForm.date')}</label>
            <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[var(--input)] text-[var(--text)] p-3 rounded-md border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition"
                required
            />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[var(--muted-text)] mb-1">{t('workoutForm.recordType')}</label>
          <div className="grid grid-cols-3 gap-2">
            {RECORD_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setRecordType(type)}
                className={`p-3 rounded-md text-sm font-semibold transition ${
                  recordType === type
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-[var(--input)] text-[var(--text)] hover:bg-opacity-80'
                }`}
              >
                {t(`workoutForm.recordTypes.${type}`)}
              </button>
            ))}
          </div>
        </div>

        {recordType === 'Weight' && (
            <div>
                <label className="block text-sm font-medium text-[var(--muted-text)] mb-1">{t('workoutForm.unit')}</label>
                <div className="grid grid-cols-2 gap-2">
                    {WEIGHT_UNITS.map(unit => (
                        <button
                            key={unit}
                            type="button"
                            onClick={() => setWeightUnit(unit)}
                            className={`p-3 rounded-md text-sm font-semibold transition ${
                                weightUnit === unit
                                ? 'bg-[var(--accent)] text-[var(--background)]'
                                : 'bg-[var(--input)] text-[var(--text)] hover:bg-opacity-80'
                            }`}
                        >
                            {unit.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>
        )}
        
        <div>
          <label htmlFor="value" className="block text-sm font-medium text-[var(--muted-text)] mb-1">
            {recordType === 'Time' ? t('workoutForm.timeLabel') : t('workoutForm.valueLabel', { unit: getUnit() })}
          </label>
          {recordType === 'Time' ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="mm"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                className="w-full bg-[var(--input)] text-[var(--text)] p-3 rounded-md border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition"
                min="0"
              />
              <span className="text-xl font-bold text-[var(--muted-text)]">:</span>
              <input
                type="number"
                placeholder="ss"
                value={seconds}
                onChange={(e) => setSeconds(e.target.value)}
                className="w-full bg-[var(--input)] text-[var(--text)] p-3 rounded-md border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition"
                min="0"
                max="59"
              />
            </div>
          ) : (
            <input
              id="value"
              type="number"
              step="any"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full bg-[var(--input)] text-[var(--text)] p-3 rounded-md border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition"
              required
            />
          )}
        </div>
        
        {error && <p className="text-sm text-red-500">{error}</p>}
        
        <button
          type="submit"
          className="w-full flex items-center justify-center space-x-2 bg-[var(--primary)] text-white py-3 px-4 rounded-md font-bold text-lg hover:opacity-90 transition-opacity"
        >
          <PlusIcon className="w-6 h-6" />
          <span>{t('workoutForm.addRecord')}</span>
        </button>
      </form>
    </div>
  );
};

export default WorkoutForm;