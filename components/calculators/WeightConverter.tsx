import React, { useState } from 'react';
import { kgToLbs, lbsToKg } from '../../utils/formatters';
import { useI18n } from '../../context/i18n';
import { User } from '../../types';
import PlateBreakdown from './PlateBreakdown';
import Card from '../ui/Card';
import Input from '../ui/Input';

interface WeightConverterProps {
    user: User;
}

const WeightConverter: React.FC<WeightConverterProps> = ({ user }) => {
    const { t } = useI18n();
    const [kg, setKg] = useState<string>('');
    const [lbs, setLbs] = useState<string>('');

    const handleKgChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const kgValue = (e.target as HTMLInputElement).value;
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

    const handleLbsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const lbsValue = (e.target as HTMLInputElement).value;
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
        <Card title={t('weightConverter.title')} className="h-full">
            <div className="flex flex-col sm:flex-row items-center sm:space-x-4 mb-6 relative">
                <div className="w-full sm:flex-1">
                    <Input
                        label="KG"
                        type="number"
                        value={kg}
                        onChange={handleKgChange}
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
                        onChange={handleLbsChange}
                        placeholder="0.0"
                        className="text-lg font-black text-center sm:text-left"
                    />
                </div>
            </div>

            {(!isNaN(kgNum) && kgNum > 0) && (
                <div className="space-y-8 pt-6 border-t border-[var(--border)] animate-in fade-in slide-in-from-top-4 duration-300">
                    <PlateBreakdown totalWeight={kgNum} unit="kg" user={user} />
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-[var(--border)] opacity-30"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-[var(--card)] px-2 text-[10px] text-[var(--muted-text)] font-bold uppercase tracking-widest">{t('common.or')}</span>
                        </div>
                    </div>
                    <PlateBreakdown totalWeight={lbsNum} unit="lbs" user={user} />
                </div>
            )}
        </Card>
    );
};

export default WeightConverter;
