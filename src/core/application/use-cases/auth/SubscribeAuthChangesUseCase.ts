import { AuthRepository } from '../../../domain/repositories/AuthRepository';
import { User } from '../../../domain/models/User';

export class SubscribeAuthChangesUseCase {
  constructor(private authRepository: AuthRepository) {}

  execute(callback: (user: User | null) => void): () => void {
    return this.authRepository.subscribeToAuthChanges(callback);
  }
}
