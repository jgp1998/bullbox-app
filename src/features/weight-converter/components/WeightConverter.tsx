import React from 'react';
import { useI18n } from '@/shared/context/i18n';
import { User } from '@/features/auth/types';
import PlateBreakdown from '@/shared/components/calculators/PlateBreakdown';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';
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
                <div className="grow grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label htmlFor="converter-bar-weight" className="block text-xs font-black text-(--muted-text) uppercase tracking-widest">{t('workoutForm.barWeight')}</label>
                        <Input
                            id="converter-bar-weight"
                            type="number"
                            value={barWeight}
                            onChange={(e) => setBarWeight(e.target.value)}
                            placeholder="20"
                            className="font-bold border-(--primary)/20"
                            data-testid="converter-bar-weight"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <span className="block text-xs font-black text-(--muted-text) uppercase tracking-widest">{t('workoutForm.unit')}</span>
                        <div className="flex bg-(--card-bg) border border-(--border-color) rounded-xl overflow-hidden h-11">
                            {(['kg', 'lbs'] as const).map(u => (
                                <button
                                    key={u}
                                    type="button"
                                    onClick={() => setPlateUnit(u)}
                                    className={`flex-1 text-[10px] font-black uppercase transition-all ${
                                        plateUnit === u 
                                            ? 'bg-(--primary) text-white' 
                                            : 'text-(--muted-text) hover:bg-(--primary)/10'
                                    }`}
                                >
                                    {u}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:space-x-4 relative bg-(--background)/50 p-4 rounded-2xl border border-(--border)">
                    <div className="w-full sm:flex-1">
                        <label htmlFor="converter-kg-input" className="block text-xs font-black text-(--muted-text) uppercase tracking-widest text-center sm:text-left mb-1">KG</label>
                        <Input
                            id="converter-kg-input"
                            type="number"
                            value={kg}
                            onChange={(e) => handleKgChange(e.target.value)}
                            placeholder="0.0"
                            className="text-lg font-black text-center sm:text-left"
                            data-testid="converter-kg-input"
                        />
                    </div>
                    <div className="py-2 sm:pt-6 text-(--primary) font-black text-2xl select-none sm:rotate-0 rotate-90 opacity-50 sm:block hidden">
                       =
                    </div>
                    <div className="w-full sm:flex-1 mt-2 sm:mt-0">
                        <label htmlFor="converter-lbs-input" className="block text-xs font-black text-(--muted-text) uppercase tracking-widest text-center sm:text-left mb-1">LBS</label>
                        <Input
                            id="converter-lbs-input"
                            type="number"
                            value={lbs}
                            onChange={(e) => handleLbsChange(e.target.value)}
                            placeholder="0.0"
                            className="text-lg font-black text-center sm:text-left"
                            data-testid="converter-lbs-input"
                        />
                    </div>
                </div>

                {(!isNaN(kgNum) && kgNum > 0) && (
                    <div className="pt-6 border-t border-(--border) animate-in fade-in slide-in-from-top-4 duration-300">
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
