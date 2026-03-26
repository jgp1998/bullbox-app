import React, { useState } from 'react';
import { MailIcon } from '../Icons';
import { useI18n } from '../../context/i18n';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PasswordResetModal: React.FC<PasswordResetModalProps> = ({ isOpen, onClose }) => {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Password reset requested for: ${email}`);
    setIsSubmitted(true);
    
    setTimeout(() => {
        onClose();
        setTimeout(() => {
            setIsSubmitted(false);
            setEmail('');
        }, 300);
    }, 3000);
  };
  
  const handleClose = () => {
    onClose();
    setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
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
                <Button
                    type="submit"
                    className="w-full"
                    variant="primary"
                    size="lg"
                >
                    {t('modals.sendResetLink')}
                </Button>
            </form>
        )}
    </Modal>
  );
};

export default PasswordResetModal;
