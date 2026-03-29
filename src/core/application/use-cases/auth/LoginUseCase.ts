import { AuthRepository } from '../../../domain/repositories/AuthRepository';
import { User } from '../../../domain/models/User';

export class LoginUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(email: string, password: string): Promise<User> {
    return this.authRepository.signInWithEmail(email, password);
  }
}
