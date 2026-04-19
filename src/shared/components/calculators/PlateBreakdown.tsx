import React from 'react';
import type { User } from '@/core/domain/models/User';
import { OLYMPIC_BARBELLS } from '@/shared/constants';
import { useI18n } from '@/shared/context/i18n';
import { calculatePlates, WeightUnit } from '@/shared/utils/calculator';
import PlateDisplay from './PlateDisplay';

interface PlateBreakdownProps {
  totalWeight: number;
  weightUnit: WeightUnit;
  plateUnit: WeightUnit;
  user: User;
  barWeight?: number;
}

const PlateBreakdown: React.FC<PlateBreakdownProps> = ({ totalWeight, weightUnit, plateUnit, user, barWeight }) => {
    const { t } = useI18n();
    const genderKey = user.gender === 'Female' ? 'female' : 'male';
    const defaultBarWeight = weightUnit === 'kg' ? OLYMPIC_BARBELLS[genderKey].kg : OLYMPIC_BARBELLS[genderKey].lbs;
    const finalBarWeight = barWeight || defaultBarWeight;
    const stack = calculatePlates(totalWeight, weightUnit, plateUnit, user.gender, barWeight);

    return (
        <div className="space-y-4" data-testid="plate-breakdown">
            <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-(--muted-text) uppercase tracking-widest">
                    {t('percentageCalculator.plateBreakdown', { weight: totalWeight.toFixed(1), unit: weightUnit })}
                    <span className="ml-1 opacity-50 lowercase italic font-medium">({plateUnit} {t('weightConverter.plates')})</span>
                </h4>
                <p className="text-[10px] font-black text-(--primary) bg-(--primary)/10 px-3 py-1 rounded-full uppercase italic">
                    {t('percentageCalculator.assumesBarbell', { weight: finalBarWeight, unit: weightUnit })}
                </p>
            </div>
            
            <PlateDisplay stack={stack} unit={plateUnit} />
            
            {stack.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2">
                    {stack.map((plate, idx) => (
                        <div key={idx} className="flex items-center space-x-2 px-3 py-1.5 bg-(--card) rounded-xl border border-(--border) shadow-sm" data-testid="plate-item">
                            <div className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: plate.color }} />
                            <span className="text-xs font-black text-(--text) tracking-tight">
                                {plate.count}x {plate.weight} {plateUnit}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PlateBreakdown;
