import React, { useState } from 'react';
import { User } from '../types';
import PasswordResetModal from './PasswordResetModal';
import { useI18n } from '../context/i18n';
import { useAuth } from '../hooks/useAuth';

interface LoginScreenProps {
    onLogin: (user: User) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const { t } = useI18n();
    const { register } = useAuth();
    
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isResetModalOpen, setResetModalOpen] = useState(false);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
    const [email, setEmail] = useState('');
    const [dob, setDob] = useState('');

    const clearForm = () => {
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setGender('Male');
        setEmail('');
        setDob('');
        setError('');
    };

    const handleToggleMode = () => {
        setIsRegistering(!isRegistering);
        clearForm();
        setSuccessMessage('');
    };

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        try {
            const storedUsers = localStorage.getItem('bullboxUsers');
            const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

            // Allow login with either username or email, case-insensitive
            const foundUser = users.find(u => 
                u.username.toLowerCase() === username.toLowerCase() || 
                u.email.toLowerCase() === username.toLowerCase()
            );

            if (foundUser && foundUser.password === password) {
                onLogin(foundUser);
            } else {
                setError(t('login.errors.invalidCredentials'));
            }
        } catch (err) {
            console.error("Failed to process login", err);
            setError(t('login.errors.generic'));
        }
    };
    
    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (password !== confirmPassword) {
            setError(t('login.errors.passwordMismatch'));
            return;
        }

        if (password.length < 6) {
            setError(t('login.errors.passwordTooShort') || 'Password must be at least 6 characters');
            return;
        }

        try {
            const storedUsers = localStorage.getItem('bullboxUsers');
            const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

            if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
                setError(t('login.errors.usernameTaken'));
                return;
            }

            if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
                setError(t('login.errors.emailTaken'));
                return;
            }

            const newUser: User = {
                username,
                email,
                dob,
                gender,
                password,
            };

            register(newUser);
            setSuccessMessage(t('login.registerSuccess'));

        } catch (err) {
            console.error("Failed to process registration", err);
            setError(t('login.errors.generic'));
        }
    };
    
    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
                <div className="w-full max-w-sm bg-[var(--card)] p-8 rounded-lg shadow-2xl">
                    <div className="flex flex-col items-center mb-6">
                        <h1 className="text-3xl font-bold text-[var(--primary)]">{t('header.title')}</h1>
                        <p className="text-[var(--muted-text)]">{isRegistering ? t('login.registerTagline') : t('login.tagline')}</p>
                    </div>

                    {isRegistering ? (
                        <form onSubmit={handleRegisterSubmit} className="space-y-4">
                             <div>
                                <label htmlFor="username" className="block text-sm font-medium text-[var(--muted-text)] mb-1">
                                    {t('login.username')}
                                </label>
                                <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-[var(--input)] text-[var(--text)] p-3 rounded-md border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition" required />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-[var(--muted-text)] mb-1">
                                    {t('login.email')}
                                </label>
                                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[var(--input)] text-[var(--text)] p-3 rounded-md border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition" required />
                            </div>
                            <div>
                                <label htmlFor="dob" className="block text-sm font-medium text-[var(--muted-text)] mb-1">
                                    {t('login.dob')}
                                </label>
                                <input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full bg-[var(--input)] text-[var(--text)] p-3 rounded-md border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition" required />
                            </div>
                            <div>
                                <label htmlFor="gender" className="block text-sm font-medium text-[var(--muted-text)] mb-1">
                                    {t('login.gender')}
                                </label>
                                 <select id="gender" value={gender} onChange={(e) => setGender(e.target.value as 'Male' | 'Female' | 'Other')} className="w-full bg-[var(--input)] text-[var(--text)] p-3 rounded-md border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition" required >
                                    <option value="Male">{t('login.male')}</option>
                                    <option value="Female">{t('login.female')}</option>
                                    <option value="Other">{t('login.other') || 'Other'}</option>
                                </select>
                            </div>
                             <div>
                                <label htmlFor="password"  className="block text-sm font-medium text-[var(--muted-text)] mb-1">
                                    {t('login.password')}
                                </label>
                                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[var(--input)] text-[var(--text)] p-3 rounded-md border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition" required />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword"  className="block text-sm font-medium text-[var(--muted-text)] mb-1">
                                    {t('login.confirmPassword')}
                                </label>
                                <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-[var(--input)] text-[var(--text)] p-3 rounded-md border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition" required />
                            </div>

                            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                            <button type="submit" className="w-full bg-[var(--primary)] text-white py-3 px-4 rounded-md font-bold text-lg hover:opacity-90 transition-opacity">
                                {t('login.registerButton')}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleLoginSubmit} className="space-y-6">
                            {successMessage && <p className="text-sm text-green-500 text-center">{successMessage}</p>}
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-[var(--muted-text)] mb-1">
                                    {t('login.username')}
                                </label>
                                <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-[var(--input)] text-[var(--text)] p-3 rounded-md border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition" required />
                            </div>
                            <div>
                                <label htmlFor="password"  className="block text-sm font-medium text-[var(--muted-text)] mb-1">
                                    {t('login.password')}
                                </label>
                                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[var(--input)] text-[var(--text)] p-3 rounded-md border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition" required />
                            </div>
                            
                            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                            
                             <button type="submit" className="w-full bg-[var(--primary)] text-white py-3 px-4 rounded-md font-bold text-lg hover:opacity-90 transition-opacity">
                                {t('login.loginButton')}
                            </button>
                            <div className="text-center">
                                <button type="button" onClick={() => setResetModalOpen(true)} className="text-sm text-[var(--muted-text)] hover:text-[var(--primary)] transition-colors underline">
                                    {t('login.forgotPassword')}
                                </button>
                            </div>
                        </form>
                    )}
                    
                    <div className="text-center mt-6">
                        <button type="button" onClick={handleToggleMode} className="text-sm text-[var(--muted-text)] hover:text-[var(--primary)] transition-colors">
                           {isRegistering ? t('login.switchToLogin') : t('login.switchToRegister')}
                        </button>
                    </div>
                </div>
            </div>
            <PasswordResetModal 
                isOpen={isResetModalOpen}
                onClose={() => setResetModalOpen(false)}
            />
        </>
    );
};

export default LoginScreen;