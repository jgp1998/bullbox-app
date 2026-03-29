import { authRepository } from '../../../infrastructure';
import { LoginUseCase } from './LoginUseCase';
import { LogoutUseCase } from './LogoutUseCase';
import { RegisterUseCase } from './RegisterUseCase';
import { ResetPasswordUseCase } from './ResetPasswordUseCase';
import { GetUserDataUseCase } from './GetUserDataUseCase';
import { SubscribeAuthChangesUseCase } from './SubscribeAuthChangesUseCase';

export const loginUseCase = new LoginUseCase(authRepository);
export const logoutUseCase = new LogoutUseCase(authRepository);
export const registerUseCase = new RegisterUseCase(authRepository);
export const resetPasswordUseCase = new ResetPasswordUseCase(authRepository);
export const getUserDataUseCase = new GetUserDataUseCase(authRepository);
export const subscribeAuthChangesUseCase = new SubscribeAuthChangesUseCase(authRepository);
