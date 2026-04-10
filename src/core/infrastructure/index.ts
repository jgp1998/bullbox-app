import { FirebaseAuthRepository } from './firebase/FirebaseAuthRepository';
import { FirebaseRecordRepository } from './firebase/FirebaseRecordRepository';
import { FirebaseWorkoutRepository } from './firebase/FirebaseWorkoutRepository';
import { FirebaseScheduleRepository } from './firebase/FirebaseScheduleRepository';
import { WebLLMAnalysisRepository } from './webllm/WebLLMAnalysisRepository';

export const authRepository = new FirebaseAuthRepository();
export const recordRepository = new FirebaseRecordRepository();
export const workoutRepository = new FirebaseWorkoutRepository();
export const scheduleRepository = new FirebaseScheduleRepository();
export const webLLMAnalysisRepository = new WebLLMAnalysisRepository();
