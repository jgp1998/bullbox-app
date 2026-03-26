import React, { useState, useMemo } from 'react';
import { WorkoutRecord, User } from '../types';
import { CalculatorIcon } from './Icons';
import { OLYMPIC_BARBELLS } from '../constants';
import { kgToLbs, lbsToKg } from '../utils/formatters';
import { useI18n } from '../context/i18n';
import PlateBreakdown from './PlateBreakdown';

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
        <div className="bg-[var(--card)] p-6 rounded-lg shadow-lg space-y-4">
            <h3 className="text-lg font-bold text-[var(--secondary)] mb-2 flex items-center">
                <CalculatorIcon className="w-5 h-5 mr-2" />
                {t('percentageCalculator.title')}
            </h3>
            <form onSubmit={handleCalculate} className="space-y-4">
                <div>
                    <label htmlFor="rm-exercise" className="block text-sm font-medium text-[var(--muted-text)] mb-1">{t('percentageCalculator.exerciseLabel')}</label>
                    <select
                        id="rm-exercise"
                        value={selectedExercise}
                        onChange={e => {
                            setSelectedExercise(e.target.value);
                            setResult(null);
                        }}
                        className="w-full bg-[var(--input)] text-[var(--text)] p-2 rounded-md border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition"
                        disabled={weightPBs.length === 0}
                    >
                        {weightPBs.map(pb => <option key={pb.id} value={pb.exercise}>{pb.exercise}</option>)}
                    </select>
                    {weightPBs.length === 0 && <p className="text-xs text-[var(--muted-text)] mt-1">{t('percentageCalculator.noPBs')}</p>}
                </div>
                <div className="flex items-end space-x-2">
                    <div className="flex-grow">
                        <label htmlFor="percentage" className="block text-sm font-medium text-[var(--muted-text)] mb-1">{t('percentageCalculator.percentageLabel')}</label>
                        <div className="relative">
                            <input
                                id="percentage"
                                type="number"
                                value={percentage}
                                onChange={e => {
                                    setPercentage(e.target.value);
                                    setResult(null);
                                }}
                                className="w-full bg-[var(--input)] text-[var(--text)] p-2 rounded-md border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition pr-6"
                                placeholder="e.g., 80"
                                required
                                min="1"
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--muted-text)]">%</span>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="bg-[var(--primary)] text-white font-semibold py-2 px-4 rounded-md hover:opacity-90 transition-opacity"
                        disabled={weightPBs.length === 0}
                    >
                        {t('percentageCalculator.calculate')}
                    </button>
                </div>
            </form>

            {result && (
                <div className="bg-[var(--input)] p-4 rounded-lg space-y-4 animate-fade-in">
                    <p className="text-sm text-center text-[var(--muted-text)]">
                        {t('percentageCalculator.basedOn', { value: result.rm.value.toFixed(1), unit: result.rm.unit, exercise: result.rm.exercise })}
                    </p>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-[var(--primary)]">{result.calculated.kg.toFixed(1)} kg</p>
                        <p className="text-lg text-[var(--accent)]">({result.calculated.lbs.toFixed(1)} lbs)</p>
                    </div>
                    
                    <div className="space-y-6 pt-2 border-t border-[var(--border)] opacity-50">
                        <PlateBreakdown totalWeight={result.calculated.kg} unit="kg" user={user} />
                        <hr className="border-[var(--border)] opacity-30" />
                        <PlateBreakdown totalWeight={result.calculated.lbs} unit="lbs" user={user} />
                    </div>
                </div>
            )}
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default PercentageCalculator;