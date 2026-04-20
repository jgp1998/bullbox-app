import { describe, it, expect } from 'vitest';
import { preprocessHistory } from './historyPreprocessing.service';
import { WorkoutRecord } from '@/shared/types';

describe('historyPreprocessing.service', () => {
    const mockRecords: WorkoutRecord[] = [
        { id: '1', exercise: 'Back Squat', weight: 100, reps: 5, date: new Date().toISOString(), userId: 'u1', boxId: 'b1' },
        { id: '2', exercise: 'Back Squat', weight: 105, reps: 5, date: new Date(Date.now() - 86400000).toISOString(), userId: 'u1', boxId: 'b1' },
        { id: '3', exercise: 'Back Squat', weight: 110, reps: 5, date: new Date(Date.now() - 172800000).toISOString(), userId: 'u1', boxId: 'b1' },
        { id: '4', exercise: 'Bench Press', weight: 60, reps: 10, date: new Date().toISOString(), userId: 'u1', boxId: 'b1' },
    ];

    it('calculates aggregate summary correctly', () => {
        const result = preprocessHistory(mockRecords);
        expect(result.summary.last_30_days.uniqueDaysCount).toBe(3); 
        expect(result.summary.last_30_days.totalVolumeKg).toBeGreaterThan(0);
        expect(result.summary.last_30_days.movementBalancePercentages).toBeDefined();
        expect(result.summary.last_30_days.avgIntensity).toBeGreaterThan(0.7);
        expect(result.summary.last_30_days.avgIntensity).toBeLessThan(0.9);
    });

    it('detects exercise trends and categories correctly', () => {
        const result = preprocessHistory(mockRecords);
        const squat = result.exercises.find(e => e.name === 'Back Squat');
        expect(squat).toBeDefined();
        expect(squat?.lastSessions[0].kilogramos).toBe(100);
    });

    it('detects stagnation', () => {
        const stagnationRecords: WorkoutRecord[] = [
            { id: '1', date: '2026-10-01T10:00:00Z', exercise: 'Deadlift', weight: 100, reps: 5, userId: 'u1', boxId: 'b1' },
            { id: '2', date: '2026-10-02T10:00:00Z', exercise: 'Deadlift', weight: 100, reps: 5, userId: 'u1', boxId: 'b1' },
            { id: '3', date: '2026-10-03T10:00:00Z', exercise: 'Deadlift', weight: 100, reps: 5, userId: 'u1', boxId: 'b1' },
            { id: '4', date: '2026-10-04T10:00:00Z', exercise: 'Deadlift', weight: 100, reps: 5, userId: 'u1', boxId: 'b1' },
        ];
        const result = preprocessHistory(stagnationRecords);
        const flag = result.flags.find(f => f.type === 'stagnation_deadlift');
        expect(flag).toBeDefined();
        expect(flag?.severity).toBe(0.7);
        expect(flag?.metadata?.exercise).toBe('Deadlift');
    });

    it('identifies fatigue indicators', () => {
        const fatigueRecords: WorkoutRecord[] = [
            { id: 'a1', date: '2026-10-05T10:00:00Z', exercise: 'Squat', weight: 50, reps: 5, userId: 'u1', boxId: 'b1' },
            { id: 'a2', date: '2026-10-04T10:00:00Z', exercise: 'Squat', weight: 100, reps: 5, userId: 'u1', boxId: 'b1' },
            { id: 'a3', date: '2026-10-03T10:00:00Z', exercise: 'Squat', weight: 100, reps: 5, userId: 'u1', boxId: 'b1' },
            { id: 'a4', date: '2026-10-02T10:00:00Z', exercise: 'Squat', weight: 100, reps: 5, userId: 'u1', boxId: 'b1' },
            { id: 'a5', date: '2026-10-01T10:00:00Z', exercise: 'Squat', weight: 100, reps: 5, userId: 'u1', boxId: 'b1' },
            { id: 'b1', date: '2026-10-05T11:00:00Z', exercise: 'Press', weight: 30, reps: 5, userId: 'u1', boxId: 'b1' },
            { id: 'b2', date: '2026-10-04T11:00:00Z', exercise: 'Press', weight: 60, reps: 5, userId: 'u1', boxId: 'b1' },
            { id: 'b3', date: '2026-10-03T11:00:00Z', exercise: 'Press', weight: 60, reps: 5, userId: 'u1', boxId: 'b1' },
            { id: 'b4', date: '2026-10-02T11:00:00Z', exercise: 'Press', weight: 60, reps: 5, userId: 'u1', boxId: 'b1' },
            { id: 'b5', date: '2026-10-01T11:00:00Z', exercise: 'Press', weight: 60, reps: 5, userId: 'u1', boxId: 'b1' },
        ];
        const result = preprocessHistory(fatigueRecords);
        expect(result.flags.some(f => f.type === 'potential_fatigue')).toBe(true);
        expect(result.flags.find(f => f.type === 'potential_fatigue')?.severity).toBe(0.9);
    });

    it('should calculate age and gender correctly from user data', () => {
        const mockUser = {
            uid: '123',
            username: 'test',
            email: 'test@test.com',
            gender: 'Male' as const,
            dob: '1990-01-01',
            role: 'athlete' as const
        };
        const result = preprocessHistory([], mockUser);
        const expectedAge = new Date().getFullYear() - 1990;
        expect(result.athlete.edad).toBe(expectedAge);
    });
});
