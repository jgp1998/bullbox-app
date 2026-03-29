import { FirebaseAuthRepository } from './firebase/FirebaseAuthRepository';
import { FirebaseRecordRepository } from './firebase/FirebaseRecordRepository';
import { FirebaseWorkoutRepository } from './firebase/FirebaseWorkoutRepository';
import { FirebaseScheduleRepository } from './firebase/FirebaseScheduleRepository';

export const authRepository = new FirebaseAuthRepository();
export const recordRepository = new FirebaseRecordRepository();
export const workoutRepository = new FirebaseWorkoutRepository();
export const scheduleRepository = new FirebaseScheduleRepository();
