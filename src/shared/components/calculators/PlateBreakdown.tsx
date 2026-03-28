import React from 'react';
import { User } from '@/types';
import { OLYMPIC_BARBELLS, PLATES_KG, PLATES_LBS } from '@/constants';
import { useI18n } from '@/context/i18n';
import { kgToLbs, lbsToKg } from '@/utils/formatters';

interface PlateStack {
  weight: number;
  color: string;
  count: number;
}

interface PlateBreakdownProps {
  totalWeight: number;
  weightUnit: 'kg' | 'lbs';
  plateUnit: 'kg' | 'lbs';
  user: User;
  barWeight?: number;
}

export const calculatePlates = (
    totalWeight: number, 
    weightUnit: 'kg' | 'lbs', 
    plateUnit: 'kg' | 'lbs', 
    gender: 'Male' | 'Female' | 'Other',
    customBarWeight?: number
): PlateStack[] => {
    const genderKey = gender === 'Female' ? 'female' : 'male';
    const defaultBarWeight = weightUnit === 'kg' ? OLYMPIC_BARBELLS[genderKey].kg : OLYMPIC_BARBELLS[genderKey].lbs;
    const barbellWeight = customBarWeight || defaultBarWeight;
    
    const plates = plateUnit === 'kg' ? PLATES_KG : PLATES_LBS;
    const stack: PlateStack[] = [];

    if (totalWeight <= barbellWeight) {
        return [];
    }

    let weightPerSide = (totalWeight - barbellWeight) / 2;
    
    // If target unit and plate unit are different, convert weightPerSide to plateUnit
    if (weightUnit !== plateUnit) {
        weightPerSide = plateUnit === 'lbs' ? kgToLbs(weightPerSide) : lbsToKg(weightPerSide);
    }

    for (const plate of plates) {
        const count = Math.floor(weightPerSide / plate.weight);
        if (count > 0) {
            stack.push({ ...plate, count });
            weightPerSide -= count * plate.weight;
        }
    }

    return stack;
};

const PlateDisplay: React.FC<{ stack: PlateStack[], unit: 'kg' | 'lbs' }> = ({ stack, unit }) => {
    const { t } = useI18n();
    const totalPlates = stack.reduce((sum, plate) => sum + plate.count, 0);
    if (totalPlates === 0) {
        return (
            <div className="flex items-center justify-center p-4 bg-[var(--background)] rounded-lg text-sm text-[var(--muted-text)] border border-dashed border-[var(--border)]">
                {t('percentageCalculator.lessThanBarbell')}
            </div>
        );
    }

    const plateElements = stack.flatMap(plate =>
        Array.from({ length: plate.count }, (_, i) => ({
            weight: plate.weight,
            color: plate.color,
            key: `${plate.weight}-${i}`
        }))
    );

    return (
        <div className="flex items-center justify-center space-x-1 h-32 overflow-x-auto py-4 bg-[var(--background)] rounded-xl border border-[var(--border)] custom-scrollbar">
            <div className="w-2 h-10 bg-zinc-600 rounded-l-sm shrink-0 shadow-sm" title="Barbell Collar"></div>
            {plateElements.map((plate) => (
                <div 
                    key={plate.key}
                    className="relative flex items-center justify-center rounded-sm shrink-0 border border-black/20 shadow-lg transform transition-transform hover:scale-105"
                    style={{ 
                        backgroundColor: plate.color, 
                        width: `${Math.max(plate.weight * (unit === 'kg' ? 1.5 : 0.8), 12)}px`,
                        height: `${Math.min(Math.max(plate.weight * (unit === 'kg' ? 3.5 : 1.8), 45), 110)}px`,
                        color: ['#F1FAEE', '#DEE2E6', '#ADB5BD'].includes(plate.color.toUpperCase()) ? '#000' : '#fff'
                    }}
                    title={`${plate.weight} ${unit}`}
                >
                    <span className="text-[10px] font-black transform -rotate-90 whitespace-nowrap tracking-tighter">{plate.weight}</span>
                </div>
            ))}
            <div className="w-16 h-3 bg-zinc-500 rounded-r-sm shrink-0 opacity-80" title="Barbell Sleeve"></div>
        </div>
    );
};

const PlateBreakdown: React.FC<PlateBreakdownProps> = ({ totalWeight, weightUnit, plateUnit, user, barWeight }) => {
    const { t } = useI18n();
    const genderKey = user.gender === 'Female' ? 'female' : 'male';
    const defaultBarWeight = weightUnit === 'kg' ? OLYMPIC_BARBELLS[genderKey].kg : OLYMPIC_BARBELLS[genderKey].lbs;
    const finalBarWeight = barWeight || defaultBarWeight;
    const stack = calculatePlates(totalWeight, weightUnit, plateUnit, user.gender, barWeight);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-[var(--muted-text)] uppercase tracking-widest">
                    {t('percentageCalculator.plateBreakdown', { weight: totalWeight.toFixed(1), unit: weightUnit })}
                    <span className="ml-1 opacity-50 lowercase italic font-medium">({plateUnit} plates)</span>
                </h4>
                <p className="text-[10px] font-black text-[var(--primary)] bg-[var(--primary)]/10 px-3 py-1 rounded-full uppercase italic">
                    {t('percentageCalculator.assumesBarbell', { weight: finalBarWeight, unit: weightUnit })}
                </p>
            </div>
            
            <PlateDisplay stack={stack} unit={plateUnit} />
            
            {stack.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2">
                    {stack.map((plate, idx) => (
                        <div key={idx} className="flex items-center space-x-2 px-3 py-1.5 bg-[var(--card)] rounded-xl border border-[var(--border)] shadow-sm">
                            <div className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: plate.color }} />
                            <span className="text-xs font-black text-[var(--text)] tracking-tight">
                                {plate.count}x {plate.weight} {plateUnit}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            
            <style>{`
                 .custom-scrollbar::-webkit-scrollbar {
                    height: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: var(--border);
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};

export default PlateBreakdown;
