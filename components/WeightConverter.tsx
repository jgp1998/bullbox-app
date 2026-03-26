import React, { useState } from 'react';
import { kgToLbs, lbsToKg } from '../utils/formatters';
import { useI18n } from '../context/i18n';
import { User } from '../types';
import PlateBreakdown from './PlateBreakdown';

interface WeightConverterProps {
    user: User;
}

const WeightConverter: React.FC<WeightConverterProps> = ({ user }) => {
    const { t } = useI18n();
    const [kg, setKg] = useState<string>('');
    const [lbs, setLbs] = useState<string>('');

    const handleKgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const kgValue = e.target.value;
        setKg(kgValue);
        if (kgValue === '') {
            setLbs('');
        } else {
            const numValue = parseFloat(kgValue);
            if (!isNaN(numValue)) {
              setLbs(kgToLbs(numValue).toFixed(2));
            }
        }
    };

    const handleLbsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const lbsValue = e.target.value;
        setLbs(lbsValue);
        if (lbsValue === '') {
            setKg('');
        } else {
            const numValue = parseFloat(lbsValue);
            if (!isNaN(numValue)) {
              setKg(lbsToKg(numValue).toFixed(2));
            }
        }
    };

    const kgNum = parseFloat(kg);
    const lbsNum = parseFloat(lbs);

    return (
        <div className="bg-[var(--card)] p-6 rounded-lg shadow-lg space-y-6">
            <h3 className="text-lg font-bold text-[var(--secondary)] mb-2">{t('weightConverter.title')}</h3>
            <div className="flex items-center space-x-2">
                <div className="flex-1">
                    <label className="block text-xs font-medium text-[var(--muted-text)] mb-1 uppercase tracking-wider">KG</label>
                    <input
                        type="number"
                        value={kg}
                        onChange={handleKgChange}
                        placeholder="kg"
                        className="w-full bg-[var(--input)] text-[var(--text)] p-2 rounded-md border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition"
                    />
                </div>
                <span className="text-[var(--muted-text)] mt-5">=</span>
                <div className="flex-1">
                    <label className="block text-xs font-medium text-[var(--muted-text)] mb-1 uppercase tracking-wider">LBS</label>
                    <input
                        type="number"
                        value={lbs}
                        onChange={handleLbsChange}
                        placeholder="lbs"
                        className="w-full bg-[var(--input)] text-[var(--text)] p-2 rounded-md border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition"
                    />
                </div>
            </div>

            {(!isNaN(kgNum) && kgNum > 0) && (
                <div className="space-y-6 pt-4 border-t border-[var(--border)] animate-fade-in">
                    <PlateBreakdown totalWeight={kgNum} unit="kg" user={user} />
                    <hr className="border-[var(--border)] opacity-30" />
                    <PlateBreakdown totalWeight={lbsNum} unit="lbs" user={user} />
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

export default WeightConverter;
