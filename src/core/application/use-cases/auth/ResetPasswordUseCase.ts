import { AuthRepository } from '../../../domain/repositories/AuthRepository';

export class ResetPasswordUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(email: string): Promise<void> {
    return this.authRepository.resetUserPassword(email);
  }
}
