import { scheduleRepository } from '../../../infrastructure';
import { SubscribeScheduleUseCase } from './SubscribeScheduleUseCase';
import { AddSessionUseCase } from './AddSessionUseCase';
import { UpdateSessionUseCase } from './UpdateSessionUseCase';
import { DeleteSessionUseCase } from './DeleteSessionUseCase';

export const subscribeScheduleUseCase = new SubscribeScheduleUseCase(scheduleRepository);
export const addSessionUseCase = new AddSessionUseCase(scheduleRepository);
export const updateSessionUseCase = new UpdateSessionUseCase(scheduleRepository);
export const deleteSessionUseCase = new DeleteSessionUseCase(scheduleRepository);
