import React from 'react';
import { User } from '../types';
import { OLYMPIC_BARBELLS, PLATES_KG, PLATES_LBS } from '../constants';
import { useI18n } from '../context/i18n';

interface PlateStack {
  weight: number;
  color: string;
  count: number;
}

interface PlateBreakdownProps {
  totalWeight: number;
  unit: 'kg' | 'lbs';
  user: User;
}

export const calculatePlates = (totalWeight: number, unit: 'kg' | 'lbs', gender: 'Male' | 'Female' | 'Other'): PlateStack[] => {
    // Default to male if Other for barbell weight
    const genderKey = gender === 'Female' ? 'female' : 'male';
    const barbellWeight = unit === 'kg' ? OLYMPIC_BARBELLS[genderKey].kg : OLYMPIC_BARBELLS[genderKey].lbs;
    const plates = unit === 'kg' ? PLATES_KG : PLATES_LBS;
    const stack: PlateStack[] = [];

    if (totalWeight <= barbellWeight) {
        return [];
    }

    let weightPerSide = (totalWeight - barbellWeight) / 2;

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
        return <p className="text-sm text-[var(--muted-text)] text-center">{t('percentageCalculator.lessThanBarbell')}</p>;
    }

    const plateElements = stack.flatMap(plate =>
        Array.from({ length: plate.count }, (_, i) => ({
            weight: plate.weight,
            color: plate.color,
            key: `${plate.weight}-${i}`
        }))
    );

    return (
        <div className="flex items-center justify-center space-x-1 h-28 overflow-x-auto py-2">
            <div className="w-2 h-6 bg-gray-400 rounded-l-sm shrink-0" title="Barbell Collar"></div>
            {plateElements.map((plate) => (
                <div 
                    key={plate.key}
                    className="relative flex items-center justify-center rounded-sm shrink-0 border border-black/10"
                    style={{ 
                        backgroundColor: plate.color, 
                        width: `${Math.max(plate.weight / (unit === 'kg' ? 1.2 : 2), 8)}px`,
                        height: `${Math.min(Math.max(plate.weight * (unit === 'kg' ? 3 : 1.5), 40), 100)}px`,
                        color: ['#F1FAEE', '#DEE2E6', '#ADB5BD'].includes(plate.color.toUpperCase()) ? '#000' : '#fff'
                    }}
                    title={`${plate.weight} ${unit}`}
                >
                    <span className="text-[10px] font-bold transform -rotate-90 whitespace-nowrap">{plate.weight}</span>
                </div>
            ))}
            <div className="w-16 h-2 bg-gray-300 rounded-r-sm shrink-0" title="Barbell Sleeve"></div>
        </div>
    );
};

const PlateBreakdown: React.FC<PlateBreakdownProps> = ({ totalWeight, unit, user }) => {
    const { t } = useI18n();
    const genderKey = user.gender === 'Female' ? 'female' : 'male';
    const barbellWeight = unit === 'kg' ? OLYMPIC_BARBELLS[genderKey].kg : OLYMPIC_BARBELLS[genderKey].lbs;
    const stack = calculatePlates(totalWeight, unit, user.gender);

    return (
        <div className="space-y-2">
            <h4 className="text-sm font-semibold text-center text-[var(--muted-text)]">
                {t('percentageCalculator.plateBreakdown', { weight: totalWeight.toFixed(1), unit })}
            </h4>
            <PlateDisplay stack={stack} unit={unit} />
            <p className="text-xs text-center text-[var(--muted-text)]">
                {t('percentageCalculator.assumesBarbell', { weight: barbellWeight, unit })}
            </p>
            {stack.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {stack.map((plate, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-1 bg-[var(--input)] rounded-full border border-[var(--border)]">
                            {plate.count}x {plate.weight}{unit}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PlateBreakdown;
