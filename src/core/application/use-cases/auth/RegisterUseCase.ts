import { AuthRepository } from '../../../domain/repositories/AuthRepository';
import { User } from '../../../domain/models/User';

export class RegisterUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(userData: Omit<User, 'uid' | 'role'> & { password?: string }): Promise<User> {
    return this.authRepository.signUpWithEmail({ 
      ...userData, 
      role: 'athlete' 
    });
  }
}
