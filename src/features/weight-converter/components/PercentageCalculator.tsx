import React, { useState, useMemo } from 'react';
import type { User } from '@/src/features/auth/types';
import type { WorkoutRecord } from '@/types';
import { CalculatorIcon } from '@/components/Icons';
import { calculate1RM } from '@/src/features/rm-calculator/utils/calculations';
import { kgToLbs, lbsToKg } from '@/utils/formatters';
import { useI18n } from '@/context/i18n';
import PlateBreakdown from './PlateBreakdown';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface PercentageCalculatorProps {
  records: WorkoutRecord[];
  user: User;
}

const PercentageCalculator: React.FC<PercentageCalculatorProps> = ({ records, user }) => {
    const { t } = useI18n();
    const [selectedExercise, setSelectedExercise] = useState('');
    const [percentage, setPercentage] = useState('80');
    const [barWeight, setBarWeight] = useState('20');
    const [plateUnit, setPlateUnit] = useState<'kg' | 'lbs'>('kg');
    const [result, setResult] = useState<{
        rm: number,
        unit: string,
        exercise: string,
        calculated: { kg: number, lbs: number }
    } | null>(null);

    const weightPBs = useMemo(() => {
        const pbs = records.filter(r => r.weight);
        if (pbs.length > 0 && !selectedExercise) {
            setSelectedExercise(pbs[0].exercise);
        }
        return pbs;
    }, [records, selectedExercise]);

    const handleCalculate = (e: React.FormEvent) => {
        e.preventDefault();
        const pb = weightPBs.find(r => r.exercise === selectedExercise);
        const perc = parseFloat(percentage);

        if (!pb || isNaN(perc) || perc <= 0) {
            setResult(null);
            return;
        }

        const rmValue = calculate1RM(pb.weight, pb.reps);
        const rmInKg = pb.unit === 'lbs' ? lbsToKg(rmValue) : rmValue;
        
        const calculatedKg = (rmInKg * perc) / 100;
        const calculatedLbs = kgToLbs(calculatedKg);

        setResult({
            rm: rmValue,
            unit: pb.unit || 'kg',
            exercise: pb.exercise,
            calculated: { kg: calculatedKg, lbs: calculatedLbs }
        });
    };
    
    const barNum = parseFloat(barWeight) || 0;

    return (
        <Card 
            title={t('percentageCalculator.title')}
            icon={<CalculatorIcon className="w-5 h-5" />}
        >
            <form onSubmit={handleCalculate} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <Input
                        label={t('workoutForm.barWeight')}
                        type="number"
                        value={barWeight}
                        onChange={(e) => setBarWeight(e.target.value)}
                        placeholder="20"
                        className="font-bold border-[var(--primary)]/20"
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
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
                    <div className="space-y-1.5">
                        <label className="block text-xs font-black text-[var(--muted-text)] uppercase tracking-widest">{t('workoutForm.unit')}</label>
                        <div className="flex bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl overflow-hidden h-11">
                            {(['kg', 'lbs'] as const).map(u => (
                                <button
                                    key={u}
                                    type="button"
                                    onClick={() => setPlateUnit(u)}
                                    className={`flex-1 text-[10px] font-black uppercase transition-all ${
                                        plateUnit === u 
                                            ? 'bg-[var(--primary)] text-white' 
                                            : 'text-[var(--muted-text)] hover:bg-[var(--primary)]/10'
                                    }`}
                                >
                                    {u}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    disabled={weightPBs.length === 0}
                    className="w-full py-4 text-lg font-black uppercase italic tracking-widest"
                >
                    {t('percentageCalculator.calculate')}
                </Button>
            </form>

            {result && (
                <div className="mt-8 pt-8 border-t border-[var(--border)] animate-in fade-in slide-in-from-top-4 duration-300">
                    <p className="text-[10px] text-center text-[var(--muted-text)] font-black uppercase tracking-widest mb-6 leading-tight px-4">
                        {t('percentageCalculator.basedOn', { value: result.rm.toFixed(1), unit: result.unit, exercise: result.exercise })}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="text-center p-6 bg-[var(--primary)] bg-opacity-10 rounded-2xl border border-[var(--primary)] border-opacity-20">
                            <p className="text-3xl font-black text-[var(--primary)] tracking-tight">
                                {result.calculated.kg.toFixed(1)} <span className="text-xs font-bold opacity-70">kg</span>
                            </p>
                        </div>
                        <div className="text-center p-6 bg-[var(--accent)] bg-opacity-10 rounded-2xl border border-[var(--accent)] border-opacity-20">
                            <p className="text-3xl font-black text-[var(--accent)] tracking-tight">
                                {result.calculated.lbs.toFixed(1)} <span className="text-xs font-bold opacity-70">lbs</span>
                            </p>
                        </div>
                    </div>
                    
                    <div className="pt-2 px-1">
                        <PlateBreakdown 
                            totalWeight={result.calculated.kg} 
                            weightUnit="kg" 
                            plateUnit={plateUnit}
                            user={user}
                            barWeight={barNum}
                        />
                    </div>
                </div>
            )}
            
            {weightPBs.length === 0 && (
                <div className="mt-4 p-5 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
                    <p className="text-xs text-yellow-600 font-bold uppercase text-center tracking-tight">{t('percentageCalculator.noPBs')}</p>
                </div>
            )}
        </Card>
    );
};

export default PercentageCalculator;
