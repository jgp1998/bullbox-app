import React, { useState } from 'react';
import { XIcon, MailIcon } from './Icons';
import { useI18n } from '../context/i18n';

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PasswordResetModal: React.FC<PasswordResetModalProps> = ({ isOpen, onClose }) => {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would trigger a backend service to send an email.
    console.log(`Password reset requested for: ${email}`);
    setIsSubmitted(true);
    setTimeout(() => {
        onClose();
        // Reset state for next time modal is opened
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
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--card)] rounded-lg shadow-2xl w-full max-w-sm p-6 relative transform transition-all duration-300 ease-out scale-95 opacity-0 animate-fade-in-scale">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-[var(--muted-text)] hover:text-[var(--primary)] transition-colors"
          aria-label={t('modals.close')}
        >
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-[var(--primary)]">{t('modals.resetPassword')}</h2>

        {isSubmitted ? (
            <div className="text-center min-h-[150px] flex items-center justify-center">
                <p className="text-[var(--text)]">{t('modals.resetSubmitted')}</p>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm text-center text-[var(--muted-text)]">{t('modals.resetPasswordPrompt')}</p>
                <div>
                    <label htmlFor="reset-email" className="sr-only">
                        Email Address
                    </label>
                    <div className="relative">
                        <MailIcon className="w-5 h-5 text-[var(--muted-text)] absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                        <input
                            id="reset-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[var(--input)] text-[var(--text)] p-3 pl-10 rounded-md border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition"
                            required
                            placeholder={t('modals.emailPlaceholder')}
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full bg-[var(--primary)] text-white py-3 px-4 rounded-md font-bold hover:opacity-90 transition-opacity"
                >
                    {t('modals.sendResetLink')}
                </button>
            </form>
        )}
      </div>
      <style>{`
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.3s forwards;
        }
      `}</style>
    </div>
  );
};

export default PasswordResetModal;