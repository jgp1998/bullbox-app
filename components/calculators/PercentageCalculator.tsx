import React, { useState, useMemo } from 'react';
import { WorkoutRecord, User } from '../../types';
import { CalculatorIcon } from '../Icons';
import { kgToLbs, lbsToKg } from '../../utils/formatters';
import { useI18n } from '../../context/i18n';
import PlateBreakdown from './PlateBreakdown';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface PercentageCalculatorProps {
  records: WorkoutRecord[];
  user: User;
}

const PercentageCalculator: React.FC<PercentageCalculatorProps> = ({ records, user }) => {
    const { t } = useI18n();
    const [selectedExercise, setSelectedExercise] = useState('');
    const [percentage, setPercentage] = useState('80');
    const [result, setResult] = useState<{
        rm: WorkoutRecord,
        calculated: { kg: number, lbs: number }
    } | null>(null);

    const weightPBs = useMemo(() => {
        const pbs = records.filter(r => r.type === 'Weight');
        if (pbs.length > 0 && !selectedExercise) {
            setSelectedExercise(pbs[0].exercise);
        }
        return pbs;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [records]);

    const handleCalculate = (e: React.FormEvent) => {
        e.preventDefault();
        const pb = weightPBs.find(r => r.exercise === selectedExercise);
        const perc = parseFloat(percentage);

        if (!pb || isNaN(perc) || perc <= 0) {
            setResult(null);
            return;
        }

        const rmInKg = pb.unit === 'lbs' ? lbsToKg(pb.value) : pb.value;
        const calculatedKg = (rmInKg * perc) / 100;
        const calculatedLbs = kgToLbs(calculatedKg);

        setResult({
            rm: pb,
            calculated: { kg: calculatedKg, lbs: calculatedLbs }
        });
    };
    
    return (
        <Card 
            title={t('percentageCalculator.title')}
            icon={<CalculatorIcon className="w-5 h-5" />}
        >
            <form onSubmit={handleCalculate} className="space-y-4 sm:space-y-6">
                <Input
                    label={t('percentageCalculator.exerciseLabel')}
                    type="select"
                    value={selectedExercise}
                    onChange={e => {
                        setSelectedExercise(e.target.value);
                        setResult(null);
                    }}
                    options={weightPBs.map(pb => ({ value: pb.exercise, label: pb.exercise }))}
                    disabled={weightPBs.length === 0}
                />
                
                <div className="flex flex-col sm:flex-row items-end sm:space-x-3 gap-3">
                    <div className="w-full sm:flex-grow">
                        <Input
                            label={t('percentageCalculator.percentageLabel')}
                            type="number"
                            value={percentage}
                            onChange={e => {
                                setPercentage(e.target.value);
                                setResult(null);
                            }}
                            placeholder="e.g., 80"
                            required
                            min="1"
                            max="200"
                        />
                    </div>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={weightPBs.length === 0}
                        className="w-full sm:w-auto sm:mb-1 py-3"
                    >
                        {t('percentageCalculator.calculate')}
                    </Button>
                </div>
            </form>

            {result && (
                <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-[var(--border)] animate-in fade-in slide-in-from-top-4 duration-300">
                    <p className="text-[10px] text-center text-[var(--muted-text)] font-bold uppercase tracking-widest mb-4 leading-tight px-2">
                        {t('percentageCalculator.basedOn', { value: result.rm.value.toFixed(1), unit: result.rm.unit, exercise: result.rm.exercise })}
                    </p>
                    
                    <div className="text-center mb-6 sm:mb-8 px-4 py-6 sm:py-8 bg-[var(--primary)] bg-opacity-10 rounded-2xl border border-[var(--primary)] border-opacity-20 shadow-inner">
                        <p className="text-3xl sm:text-5xl font-black text-[var(--primary)] tracking-tight">
                            {result.calculated.kg.toFixed(1)} <span className="text-xs sm:text-sm font-bold opacity-70">kg</span>
                        </p>
                        <p className="text-lg sm:text-2xl font-bold text-[var(--accent)] mt-1 opacity-80">
                            ({result.calculated.lbs.toFixed(1)} <span className="text-xs">lbs</span>)
                        </p>
                    </div>
                    
                    <div className="space-y-8 px-1">
                        <PlateBreakdown totalWeight={result.calculated.kg} unit="kg" user={user} />
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-[var(--border)] opacity-30"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-[var(--card)] px-2 text-[10px] text-[var(--muted-text)] font-bold uppercase tracking-widest">{t('common.or')}</span>
                            </div>
                        </div>
                        <PlateBreakdown totalWeight={result.calculated.lbs} unit="lbs" user={user} />
                    </div>
                </div>
            )}
            
            {weightPBs.length === 0 && (
                <div className="mt-4 p-4 bg-yellow-500 bg-opacity-10 rounded-lg border border-yellow-500 border-opacity-20">
                    <p className="text-xs text-yellow-600 font-medium text-center">{t('percentageCalculator.noPBs')}</p>
                </div>
            )}
        </Card>
    );
};

export default PercentageCalculator;
