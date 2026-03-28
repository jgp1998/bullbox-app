import { useEffect } from 'react';
import { useRecordsStore } from '../store/useRecordsStore';
import { RecordsService } from '../services/records.service';
import { WorkoutRecord } from '../types';

export const useRecords = () => {
  const { setRecords, setLoading, records, isLoading, getPersonalBests } = useRecordsStore();

  useEffect(() => {
    setLoading(true);
    const unsubscribe = RecordsService.subscribeToRecords((fetchedRecords) => {
      setRecords(fetchedRecords);
    });

    return () => unsubscribe();
  }, [setRecords, setLoading]);

  const addRecord = async (record: Omit<WorkoutRecord, 'id'>) => {
    try {
      await RecordsService.addRecord(record);
    } catch (error) {
      console.error('Error adding record:', error);
      throw error;
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      await RecordsService.deleteRecord(id);
    } catch (error) {
      console.error('Error deleting record:', error);
      throw error;
    }
  };

  return {
    records,
    isLoading,
    personalBests: getPersonalBests(),
    addRecord,
    deleteRecord
  };
};
