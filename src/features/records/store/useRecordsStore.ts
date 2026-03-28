import { create } from 'zustand';
import { WorkoutRecord } from '../types';
import { calculate1RM } from '@/src/features/rm-calculator';
import { lbsToKg } from '@/utils/formatters';

interface RecordsState {
  records: WorkoutRecord[];
  isLoading: boolean;
  setRecords: (records: WorkoutRecord[]) => void;
  setLoading: (loading: boolean) => void;
  getPersonalBests: () => WorkoutRecord[];
}

export const useRecordsStore = create<RecordsState>((set, get) => ({
  records: [],
  isLoading: false,

  setRecords: (records) => set({ records, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),

  getPersonalBests: () => {
    const records = get().records;
    const bestsMap = new Map<string, WorkoutRecord>();

    records.forEach(record => {
      const exercise = record.exercise;
      const currentBest = bestsMap.get(exercise);

      if (!currentBest) {
        bestsMap.set(exercise, record);
        return;
      }

      // Time-based (lower is better, assuming they want faster times)
      if (record.time && !record.weight) {
        const recordTime = record.time;
        const currentBestTime = currentBest.time || Infinity;
        if (recordTime < currentBestTime) {
          bestsMap.set(exercise, record);
        }
        return;
      }

      // Weight-based (calc Epley 1RM)
      const getRM = (rec: WorkoutRecord) => {
        let w = rec.weight || 0;
        if (rec.unit === 'lbs') w = lbsToKg(w);
        return calculate1RM(w, rec.reps);
      };

      if (getRM(record) > getRM(currentBest)) {
        bestsMap.set(exercise, record);
      }
    });

    return Array.from(bestsMap.values());
  }
}));
