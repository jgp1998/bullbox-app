import type { WorkoutRecord } from '../types';

const KG_TO_LBS = 2.20462;

export const lbsToKg = (lbs: number): number => lbs / KG_TO_LBS;
export const kgToLbs = (kg: number): number => kg * KG_TO_LBS;


export const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const formatValue = (value: number, type: string): string => {
    if (type === 'Time') return formatDuration(value);
    return value.toFixed(1);
};

export const getUnit = (type: string): string => {
    switch (type) {
        case 'Weight': return 'kg';
        case 'Reps': return 'reps';
        case 'Time': return '';
        default: return '';
    }
};

export const formatWorkoutValue = (record: WorkoutRecord): string => {
    const parts: string[] = [];
    if (record.weight) parts.push(`${record.weight} ${record.unit || 'kg'}`);
    if (record.reps) parts.push(`${record.reps} reps`);
    if (record.time) parts.push(formatDuration(record.time));
    return parts.join(' @ ');
};