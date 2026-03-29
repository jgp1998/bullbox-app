import { useEffect } from 'react';
import { useRecordsStore } from '../store/useRecordsStore';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { 
  subscribeRecordsUseCase, 
  addRecordUseCase, 
  deleteRecordUseCase 
} from '@/src/core/application/use-cases/records';
import { WorkoutRecord } from '../types';

export const useRecords = () => {
  const { setRecords, setLoading, records, isLoading, getPersonalBests } = useRecordsStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;
    
    setLoading(true);
    const unsubscribe = subscribeRecordsUseCase.execute(user.uid, (fetchedRecords) => {
      setRecords(fetchedRecords);
    });

    return () => unsubscribe();
  }, [user, setRecords, setLoading]);

  const addRecord = async (record: Omit<WorkoutRecord, 'id'>) => {
    try {
      await addRecordUseCase.execute(user?.uid, record);
    } catch (error) {
      console.error('Error adding record:', error);
      throw error;
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      await deleteRecordUseCase.execute(user?.uid, id);
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
