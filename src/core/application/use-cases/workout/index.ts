import { workoutRepository } from '../../../infrastructure';
import { SubscribeExercisesUseCase } from './SubscribeExercisesUseCase';
import { AddExerciseUseCase } from './AddExerciseUseCase';
import { DeleteExerciseUseCase } from './DeleteExerciseUseCase';

export const subscribeExercisesUseCase = new SubscribeExercisesUseCase(workoutRepository);
export const addExerciseUseCase = new AddExerciseUseCase(workoutRepository);
export const deleteExerciseUseCase = new DeleteExerciseUseCase(workoutRepository);
