import { useState } from 'react';
import { kgToLbs, lbsToKg } from '@/shared/utils/formatters';
import { WeightUnit } from '@/shared/types';

export const useWeightConverter = () => {
    const [kg, setKg] = useState<string>('');
    const [lbs, setLbs] = useState<string>('');
    const [barWeight, setBarWeight] = useState<string>('20');
    const [plateUnit, setPlateUnit] = useState<WeightUnit>('kg');

    const handleKgChange = (value: string) => {
        setKg(value);
        if (value === '') {
            setLbs('');
        } else {
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
                setLbs(kgToLbs(numValue).toFixed(2));
            }
        }
    };

    const handleLbsChange = (value: string) => {
        setLbs(value);
        if (value === '') {
            setKg('');
        } else {
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
                setKg(lbsToKg(numValue).toFixed(2));
            }
        }
    };

    return {
        kg,
        lbs,
        barWeight,
        plateUnit,
        setBarWeight,
        setPlateUnit,
        handleKgChange,
        handleLbsChange,
        kgNum: parseFloat(kg),
        lbsNum: parseFloat(lbs),
        barNum: parseFloat(barWeight) || 0
    };
};
