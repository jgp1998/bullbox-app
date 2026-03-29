import React, { useState } from 'react';
import { MailIcon } from '@/src/shared/components/ui/Icons';
import { useI18n } from '@/context/i18n';
import Modal from '@/src/shared/components/ui/Modal';
import Input from '@/src/shared/components/ui/Input';
import Button from '@/src/shared/components/ui/Button';
import { authService } from '../services/auth.service';

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PasswordResetModal: React.FC<PasswordResetModalProps> = ({ isOpen, onClose }) => {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
        await authService.resetUserPassword(email);
        setIsSubmitted(true);
        setTimeout(() => {
            onClose();
            setTimeout(() => {
                setIsSubmitted(false);
                setEmail('');
            }, 300);
        }, 3000);
    } catch (err: any) {
        console.error("Reset password error:", err);
        setError(t('login.errors.generic'));
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleClose = () => {
    onClose();
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
        {isSubmitted ? (
            <div className="text-center py-8">
                <p className="text-[var(--text)]">{t('modals.resetSubmitted')}</p>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
                <p className="text-sm text-center text-[var(--muted-text)]">
                    {t('modals.resetPasswordPrompt')}
                </p>
                <div className="relative">
                    <Input
                        id="reset-email"
                        type="email"
                        label={t('login.email')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder={t('modals.emailPlaceholder')}
                        className="pl-10"
                    />
                    <MailIcon className="w-5 h-5 text-[var(--muted-text)] absolute left-3 bottom-3.5 pointer-events-none" />
                </div>
                {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                <Button
                    type="submit"
                    className="w-full"
                    variant="primary"
                    size="lg"
                    disabled={isLoading}
                >
                    {isLoading ? '...' : t('modals.sendResetLink')}
                </Button>
            </form>
        )}
    </Modal>
  );
};

export default PasswordResetModal;

