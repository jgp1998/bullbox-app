import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import { useI18n } from '@/shared/context/i18n';
import { useAuthStore } from '@/features/auth';
import { feedbackRepository } from '@/core/infrastructure';
import { FeedbackCategory } from '@/core/domain/models/Feedback';

interface FeedbackFormProps {
  onSuccess?: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSuccess }) => {
  const { t } = useI18n();
  const { user } = useAuthStore();
  const [category, setCategory] = useState<FeedbackCategory>('improvement');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    if (!user) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await feedbackRepository.save({
        userId: user.uid,
        username: user.username || 'Anonymous',
        email: user.email,
        message: message.trim(),
        category
      });
      
      setIsSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (err) {
      setError(t('feedback.errorSending') || 'No se pudo enviar el feedback. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center space-y-4 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold tracking-tight text-(--text)">
            {t('feedback.successTitle') || '¡Gracias!'}
          </h3>
          <p className="text-(--muted-text) max-w-[250px]">
            {t('feedback.successMessage') || 'Tu sugerencia ha sido recibida por el Coach Bull.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-(--muted-text) ml-1">
            {t('feedback.category') || 'Categoría'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['improvement', 'bug', 'compliment', 'other'] as FeedbackCategory[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all duration-200 ${
                  category === cat
                    ? 'bg-(--primary) border-(--primary) text-white shadow-lg shadow-(--primary)/20'
                    : 'bg-(--input) border-(--border) text-(--muted-text) hover:border-(--primary)/50'
                }`}
              >
                {t(`feedback.categories.${cat}`) || cat}
              </button>
            ))}
          </div>
        </div>

        <Input
          id="feedback-message"
          type="textarea"
          label={t('feedback.messageLabel') || 'Tu propuesta o reporte'}
          placeholder={t('feedback.placeholder') || 'Escribe aquí qué te gustaría mejorar...'}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className="resize-none"
          required
        />
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-red-400 bg-red-400/10 p-3 rounded-xl border border-red-400/20 animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p className="text-xs font-medium">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        className="w-full flex items-center justify-center py-4 rounded-2xl font-black uppercase tracking-tighter italic"
        isLoading={isSubmitting}
        disabled={!message.trim()}
      >
        <Send className="w-4 h-4 mr-2" />
        {t('feedback.submit') || 'Enviar al Coach'}
      </Button>
    </form>
  );
};

export default FeedbackForm;
