import React from 'react';
import { useI18n } from '@/context/i18n';
import { User } from '@/src/features/auth/types';
import PlateBreakdown from '@/src/shared/components/calculators/PlateBreakdown';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { useWeightConverter } from '../hooks/useWeightConverter';

interface WeightConverterProps {
    user: User;
}

const WeightConverter: React.FC<WeightConverterProps> = ({ user }) => {
    const { t } = useI18n();
    const {
        kg, lbs, barWeight, plateUnit,
        setBarWeight, setPlateUnit,
        handleKgChange, handleLbsChange,
        kgNum, barNum
    } = useWeightConverter();

    return (
        <Card title={t('weightConverter.title')} className="h-full">
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label={t('workoutForm.barWeight')}
                        type="number"
                        value={barWeight}
                        onChange={(e) => setBarWeight(e.target.value)}
                        placeholder="20"
                        className="font-bold border-[var(--primary)]/20"
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

                <div className="flex flex-col sm:flex-row items-center sm:space-x-4 relative bg-[var(--background)]/50 p-4 rounded-2xl border border-[var(--border)]">
                    <div className="w-full sm:flex-1">
                        <Input
                            label="KG"
                            type="number"
                            value={kg}
                            onChange={(e) => handleKgChange(e.target.value)}
                            placeholder="0.0"
                            className="text-lg font-black text-center sm:text-left"
                        />
                    </div>
                    <div className="py-2 sm:pt-6 text-[var(--primary)] font-black text-2xl select-none sm:rotate-0 rotate-90 opacity-50 sm:block hidden">
                       =
                    </div>
                    <div className="w-full sm:flex-1 mt-2 sm:mt-0">
                        <Input
                            label="LBS"
                            type="number"
                            value={lbs}
                            onChange={(e) => handleLbsChange(e.target.value)}
                            placeholder="0.0"
                            className="text-lg font-black text-center sm:text-left"
                        />
                    </div>
                </div>

                {(!isNaN(kgNum) && kgNum > 0) && (
                    <div className="pt-6 border-t border-[var(--border)] animate-in fade-in slide-in-from-top-4 duration-300">
                        <PlateBreakdown 
                            totalWeight={kgNum} 
                            weightUnit="kg" 
                            plateUnit={plateUnit}
                            user={user} 
                            barWeight={barNum}
                        />
                    </div>
                )}
            </div>
        </Card>
    );
};

export default WeightConverter;
