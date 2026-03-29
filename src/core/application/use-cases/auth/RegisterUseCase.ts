import { AuthRepository } from '../../../domain/repositories/AuthRepository';
import { User } from '../../../domain/models/User';

export class RegisterUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(userData: Omit<User, 'uid'> & { password?: string }): Promise<User> {
    return this.authRepository.signUpWithEmail(userData);
  }
}
