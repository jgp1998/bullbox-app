import React, { useState, useEffect } from 'react';
import { WorkoutRecord, RecordType, WeightUnit } from '../../types';
import { RECORD_TYPES, WEIGHT_UNITS } from '../../constants';
import { PlusIcon, EditIcon } from '../Icons';
import { useI18n } from '../../context/i18n';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

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

        <div className="space-y-3">
          <label className="block text-xs font-black text-[var(--muted-text)] uppercase tracking-widest">{t('workoutForm.recordType')}</label>
          <div className="grid grid-cols-3 gap-2">
            {RECORD_TYPES.map((type) => (
              <Button
                key={type}
                type="button"
                onClick={() => setRecordType(type)}
                variant={recordType === type ? 'primary' : 'secondary'}
                className="w-full py-2 text-xs font-bold"
              >
                {t(`workoutForm.recordTypes.${type}`)}
              </Button>
            ))}
          </div>
        </div>

        {recordType === 'Weight' && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-xs font-black text-[var(--muted-text)] uppercase tracking-widest">{t('workoutForm.unit')}</label>
                <div className="grid grid-cols-2 gap-2">
                    {WEIGHT_UNITS.map(unit => (
                        <Button
                            key={unit}
                            type="button"
                            onClick={() => setWeightUnit(unit)}
                            variant={weightUnit === unit ? 'accent' : 'secondary'}
                            className="w-full py-2 text-xs font-bold"
                        >
                            {unit.toUpperCase()}
                        </Button>
                    ))}
                </div>
            </div>
        )}
        
        <div className="space-y-3">
          <label htmlFor="value" className="block text-xs font-black text-[var(--muted-text)] uppercase tracking-widest">
            {recordType === 'Time' ? t('workoutForm.timeLabel') : t('workoutForm.valueLabel', { unit: getUnit() })}
          </label>
          {recordType === 'Time' ? (
            <div className="flex items-center gap-3">
              <Input
                type="number"
                placeholder="mm"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                min="0"
                className="text-center font-bold text-lg"
              />
              <span className="text-2xl font-black text-[var(--primary)]">:</span>
              <Input
                type="number"
                placeholder="ss"
                value={seconds}
                onChange={(e) => setSeconds(e.target.value)}
                min="0"
                max="59"
                className="text-center font-bold text-lg"
              />
            </div>
          ) : (
            <Input
              id="value"
              type="number"
              step="any"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="0.00"
              required
              className="text-lg font-black"
            />
          )}
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
