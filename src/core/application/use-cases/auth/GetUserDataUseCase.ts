import { AuthRepository } from '../../../domain/repositories/AuthRepository';
import { User } from '../../../domain/models/User';

export class GetUserDataUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(uid: string): Promise<User | null> {
    return this.authRepository.getUserData(uid);
  }
}
