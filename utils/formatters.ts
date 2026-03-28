import type { WorkoutRecord } from '../types';

const KG_TO_LBS = 2.20462;

export const lbsToKg = (lbs: number): number => lbs / KG_TO_LBS;
export const kgToLbs = (kg: number): number => kg * KG_TO_LBS;

/**
 * Calculates 1RM (One Rep Max) using Epley Formula: 1RM = weight * (1 + reps/30)
 * For 1 rep, it returns just the weight.
 */
export const calculate1RM = (weight?: number, reps?: number): number => {
    if (!weight) return 0;
    if (!reps || reps <= 1) return weight;
    return weight * (1 + (reps / 30));
};

export const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const formatWorkoutValue = (record: WorkoutRecord): string => {
    const parts: string[] = [];
    if (record.weight) parts.push(`${record.weight} ${record.unit || 'kg'}`);
    if (record.reps) parts.push(`${record.reps} reps`);
    if (record.time) parts.push(formatDuration(record.time));
    return parts.join(' @ ');
};