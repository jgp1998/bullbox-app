import React from 'react';
import { useI18n } from '@/context/i18n';
import type { PlateStack, WeightUnit } from '@/src/shared/utils/calculator';

interface PlateDisplayProps {
  stack: PlateStack[];
  unit: WeightUnit;
}

const PlateDisplay: React.FC<PlateDisplayProps> = ({ stack, unit }) => {
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

export default PlateDisplay;
