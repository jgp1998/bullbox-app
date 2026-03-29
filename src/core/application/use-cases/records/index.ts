import { recordRepository } from '../../../infrastructure';
import { SubscribeRecordsUseCase } from './SubscribeRecordsUseCase';
import { AddRecordUseCase } from './AddRecordUseCase';
import { DeleteRecordUseCase } from './DeleteRecordUseCase';

export const subscribeRecordsUseCase = new SubscribeRecordsUseCase(recordRepository);
export const addRecordUseCase = new AddRecordUseCase(recordRepository);
export const deleteRecordUseCase = new DeleteRecordUseCase(recordRepository);
