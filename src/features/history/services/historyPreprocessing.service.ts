import { WorkoutRecord } from '@/core/domain/models/Record';

export interface AthleteSummary {
    uniqueDaysCount: number;
    totalVolumeKg: number;
    avgIntensity: number;
    movementBalancePercentages: Record<string, number>;
}

export interface ExerciseTrend {
    name: string;
    trend: string; // e.g. "+12%"
    baselineWeight: number;
    lastSessions: { kilogramos: number; repeticiones: number }[];
}

export interface Flag {
    type: string;
    description: string;
    severity: number; // 0.0 to 1.0
    metadata?: {
        exercise?: string;
        sessionsCount?: number;
        valueChange?: number;
    };
}

export interface PreprocessedData {
    athlete: {
        experienceLevel: string;
        bodyWeight: number;
        edad: number;
        genero: string;
    };
    summary: {
        last_30_days: AthleteSummary;
    };
    exercises: ExerciseTrend[];
    flags: Flag[];
}

const CATEGORIES = {
    push: ['bench press', 'overhead press', 'push press', 'jerk', 'shoulder press', 'dips', 'push ups', 'bench'],
    pull: ['pull up', 'row', 'muscle up', 'pull-up', 'chin up', 'lat pulldown'],
    squat: ['back squat', 'front squat', 'overhead squat', 'wall ball', 'goblet squat', 'squat', 'lunge'],
    hinge: ['deadlift', 'clean', 'snatch', 'kettlebell swing', 'good morning', 'swing'],
    cardio: ['run', 'rower', 'bike', 'ski', 'burpee', 'double under', 'jump rope']
};

import { User } from '@/shared/types';

export const preprocessHistory = (records: WorkoutRecord[], user?: User | null): PreprocessedData => {
    const age = user?.dob ? (new Date().getFullYear() - parseInt(user.dob.split('-')[0])) : 30;
    const gender = user?.gender || 'Not specified';

    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);
    
    const last30DaysRecords = records.filter(r => new Date(r.date) >= thirtyDaysAgo);
    
    // 1. Athlete Summary
    const totalVolumeKg = last30DaysRecords.reduce((acc, r) => acc + ((r.weight || 0) * (r.reps || 1)), 0);
    const uniqueDaysCount = new Set(last30DaysRecords.map(r => r.date.split('T')[0])).size;
    
    // Calculate Intensity using Brzycki formula approximation
    // Intensity = weight / (weight / (1.0278 - 0.0278 * reps)) => Intensity = 1.0278 - 0.0278 * reps
    // This is a simplification but gives a relative "effort" score
    const totalIntensity = last30DaysRecords.reduce((acc, r) => {
        if (!r.weight || !r.reps) return acc + 0.5; // Default for cardio/unweighted
        const reps = Math.min(r.reps, 15); // Formula breaks down at high reps
        const intensity = 1.0278 - (0.0278 * reps);
        return acc + intensity;
    }, 0);
    const avgIntensity = last30DaysRecords.length > 0 ? totalIntensity / last30DaysRecords.length : 0;

    // 2. Exercise Trends (Focus on top weight exercises)
    const exerciseGroups: Record<string, WorkoutRecord[]> = {};
    records.forEach(r => {
        if (!exerciseGroups[r.exercise]) exerciseGroups[r.exercise] = [];
        exerciseGroups[r.exercise].push(r);
    });

    const exercises: ExerciseTrend[] = Object.entries(exerciseGroups).map(([name, group]) => {
        const sorted = [...group].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const lastThree = sorted.slice(0, 3);
        
        // Calculate trend based on a more meaningful baseline
        const currentWeight = sorted[0]?.weight || 0;
        // Baseline: Find the most recent session BEFORE the last 30 days window, 
        // OR simply the session immediately before the current one.
        const baselineRecord = sorted.find(s => new Date(s.date) < thirtyDaysAgo) || sorted[1] || sorted[0];
        const baselineWeight = baselineRecord.weight || 0;
        
        const trendVal = baselineWeight > 0 ? ((currentWeight - baselineWeight) / baselineWeight) * 100 : 0;
        
        return {
            name,
            trend: `${trendVal > 0 ? '+' : ''}${trendVal.toFixed(1)}%`,
            baselineWeight,
            lastSessions: lastThree.map(s => ({ kilogramos: s.weight || 0, repeticiones: s.reps || 0 }))
        };
    }).filter(e => e.lastSessions.length > 0)
      .sort((a, b) => b.lastSessions.length - a.lastSessions.length) // Most frequent exercises first
      .slice(0, 10);

    // 3. Flags
    const flags: Flag[] = [];
    
    // Stagnation Check
    Object.entries(exerciseGroups).forEach(([name, group]) => {
        const sorted = [...group].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        if (sorted.length >= 4) { // More conservative stagnation
            const recent = sorted.slice(0, 4);
            const allSame = recent.every(r => r.weight === recent[0].weight && r.reps === recent[0].reps);
            if (allSame) {
                flags.push({
                    type: `stagnation_${name.toLowerCase().replace(/\s+/g, '_')}`,
                    description: `Mismo peso (${recent[0].weight}kg) y reps en 4 sesiones de ${name}.`,
                    severity: 0.7,
                    metadata: { exercise: name, sessionsCount: 4 }
                });
            }
        }
    });

    // Fatigue Check
    const fatigueExercises: string[] = [];
    Object.entries(exerciseGroups).forEach(([name, group]) => {
        const sorted = [...group].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        if (sorted.length < 5) return;
        
        const currentWeight = sorted[0].weight || 0;
        const prevAvg = sorted.slice(1, 4).reduce((acc, r) => acc + (r.weight || 0), 0) / 3;
        
        if (prevAvg > 0 && currentWeight < prevAvg * 0.85) { // 15% drop
            fatigueExercises.push(name);
        }
    });

    if (fatigueExercises.length >= 2) {
        flags.push({
            type: 'potential_fatigue',
            description: `Caída >15% en: ${fatigueExercises.join(', ')}.`,
            severity: 0.9,
            metadata: { valueChange: -15 }
        });
    }
    
    // Balance Check
    const categoryCounts = { push: 0, pull: 0, squat: 0, hinge: 0, cardio: 0 };
    last30DaysRecords.forEach(r => {
        const ex = r.exercise.toLowerCase();
        if (CATEGORIES.push.some(c => ex.includes(c))) categoryCounts.push++;
        if (CATEGORIES.pull.some(c => ex.includes(c))) categoryCounts.pull++;
        if (CATEGORIES.squat.some(c => ex.includes(c))) categoryCounts.squat++;
        if (CATEGORIES.hinge.some(c => ex.includes(c))) categoryCounts.hinge++;
        if (CATEGORIES.cardio.some(c => ex.includes(c))) categoryCounts.cardio++;
    });
    
    const totalCategorized = Object.values(categoryCounts).reduce((a, b) => a + b, 0);
    if (totalCategorized > 5) {
        if (categoryCounts.push / totalCategorized > 0.5) {
            flags.push({ 
                type: 'high_push_vol', 
                description: 'Volumen de empuje > 50%.',
                severity: 0.5
            });
        }
        if (categoryCounts.pull / totalCategorized < 0.2) {
            flags.push({
                type: 'low_pull_vol',
                description: 'Volumen de tirón < 20%.',
                severity: 0.6
            });
        }
        if (categoryCounts.cardio / totalCategorized < 0.1) {
            flags.push({
                type: 'low_cardio_vol',
                description: 'Escaso entrenamiento cardiovascular.',
                severity: 0.4
            });
        }
    }

    // Athlete Experience logic
    const totalSessionsAllTime = uniqueDaysCount; // Simple logic for now
    let experienceLevel = 'beginner';
    if (totalSessionsAllTime > 15) experienceLevel = 'intermediate';
    if (totalSessionsAllTime > 50) experienceLevel = 'advanced';

    return {
        athlete: {
            experienceLevel,
            bodyWeight: 80, // We could fetch this from a different place if available
            edad: age,
            genero: gender
        },
        summary: {
            last_30_days: {
                uniqueDaysCount,
                totalVolumeKg,
                avgIntensity,
                movementBalancePercentages: categoryCounts
            }
        },
        exercises,
        flags
    };
};
