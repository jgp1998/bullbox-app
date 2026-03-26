import React from 'react';
import { User } from '../../types';
import { OLYMPIC_BARBELLS, PLATES_KG, PLATES_LBS } from '../../constants';
import { useI18n } from '../../context/i18n';

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

const PlateBreakdown: React.FC<PlateBreakdownProps> = ({ totalWeight, unit, user }) => {
    const { t } = useI18n();
    const genderKey = user.gender === 'Female' ? 'female' : 'male';
    const barbellWeight = unit === 'kg' ? OLYMPIC_BARBELLS[genderKey].kg : OLYMPIC_BARBELLS[genderKey].lbs;
    const stack = calculatePlates(totalWeight, unit, user.gender);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-[var(--muted-text)] uppercase tracking-wider">
                    {t('percentageCalculator.plateBreakdown', { weight: totalWeight.toFixed(1), unit })}
                </h4>
                <p className="text-[10px] font-medium text-[var(--primary)] bg-[var(--primary)] bg-opacity-10 px-2 py-0.5 rounded-full">
                    {t('percentageCalculator.assumesBarbell', { weight: barbellWeight, unit })}
                </p>
            </div>
            
            <PlateDisplay stack={stack} unit={unit} />
            
            {stack.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2">
                    {stack.map((plate, idx) => (
                        <div key={idx} className="flex items-center space-x-2 px-3 py-1.5 bg-[var(--card)] rounded-lg border border-[var(--border)] shadow-sm">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: plate.color }} />
                            <span className="text-xs font-bold text-[var(--text)]">
                                {plate.count}x {plate.weight}{unit}
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
