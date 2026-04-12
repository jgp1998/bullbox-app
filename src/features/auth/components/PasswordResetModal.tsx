import React, { useState } from 'react';
import { MailIcon, CheckCircleIcon, XCircleIcon } from '@/shared/components/ui/Icons';
import { useI18n } from '@/shared/context/i18n';
import Modal from '@/shared/components/ui/Modal';
import Input from '@/shared/components/ui/Input';
import Button from '@/shared/components/ui/Button';
import { useAuthStore } from '../store/useAuthStore';

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PasswordResetModal: React.FC<PasswordResetModalProps> = ({ isOpen, onClose }) => {
  const { resetPassword } = useAuthStore();
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError('');
    
    try {
        await resetPassword(email);
        setIsSubmitted(true);
    } catch (err: any) {
        console.error("Reset password error:", err);
        // Map Firebase error codes to translated messages
        const errorCode = err.code || '';
        if (errorCode === 'auth/user-not-found') {
            setError(t('login.errors.userNotFound'));
        } else if (errorCode === 'auth/invalid-email') {
            setError(t('login.errors.invalidEmail'));
        } else {
            setError(t('login.errors.generic'));
        }
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleClose = () => {
    onClose();
    // Delay resetting state to allow modal closing animation
    setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
        setError('');
    }, 300);
  };

  return (
    <Modal 
        isOpen={isOpen} 
        onClose={handleClose} 
        title={t('modals.resetPassword')}
        size="sm"
    >
        <div className="flex flex-col items-center">
            {isSubmitted ? (
                <div className="text-center py-6 animate-in">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                        <CheckCircleIcon className="w-12 h-12 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold text-(--text) mb-3">
                        {t('modals.resetPassword')}
                    </h3>
                    <p className="text-(--muted-text) mb-3 max-w-xs mx-auto">
                        {t('modals.resetSubmitted')}
                    </p>
                    <p className="text-sm text-(--muted-text) opacity-70 mb-8 max-w-xs mx-auto italic">
                        {t('modals.checkSpam')}
                    </p>
                    <Button
                        onClick={handleClose}
                        className="w-full"
                        variant="secondary"
                        size="lg"
                    >
                        {t('modals.close')}
                    </Button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="w-full space-y-6">
                    <div className="w-16 h-16 bg-linear-to-br from-(--primary) to-red-600 rounded-2xl flex items-center justify-center mb-2 mx-auto shadow-lg shadow-red-500/20 transform -rotate-3">
                        <MailIcon className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="text-center space-y-2">
                        <p className="text-sm text-(--muted-text) leading-relaxed">
                            {t('modals.resetPasswordPrompt')}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="relative">
                            <Input
                                id="reset-email"
                                type="email"
                                label={t('login.email')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder={t('modals.emailPlaceholder')}
                                className="pl-11"
                            />
                            <MailIcon className="w-5 h-5 text-(--muted-text) absolute left-3.5 bottom-3.5 pointer-events-none opacity-50" />
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm animate-slide-up">
                                <XCircleIcon className="w-5 h-5 shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}
                    </div>

                    <div className="pt-2">
                        <Button
                            type="submit"
                            className="w-full relative overflow-hidden group"
                            variant="primary"
                            size="lg"
                            disabled={isLoading}
                        >
                            <span className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity'}>
                                {t('modals.sendResetLink')}
                            </span>
                            {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                </div>
                            )}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    </Modal>
  );
};

export default PasswordResetModal;
