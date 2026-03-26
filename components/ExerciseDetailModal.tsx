import React from 'react';
import { ExerciseDetail } from '../types';
import { XIcon, BookOpenIcon, CheckCircleIcon, XCircleIcon } from './Icons';
import { useI18n } from '../context/i18n';

interface ExerciseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseName: string | null;
  details: ExerciseDetail | null;
  isLoading: boolean;
  error: string | null;
}

const LoadingSpinner: React.FC = () => {
    const { t } = useI18n();
    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[var(--primary)]"></div>
            <p className="text-lg text-[var(--muted-text)] font-semibold">{t('modals.loadingDetails')}</p>
        </div>
    );
};

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => {
    const { t } = useI18n();
    return (
        <div className="text-center text-red-400">
            <p className="font-bold text-lg">{t('modals.errorTitle')}</p>
            <p className="text-sm">{message}</p>
        </div>
    );
};

const DetailDisplay: React.FC<{ details: ExerciseDetail }> = ({ details }) => {
    const { t } = useI18n();
    return (
        <div className="space-y-6 text-left">
            <div>
                <h3 className="text-xl font-bold text-[var(--accent)] mb-2">{t('modals.description')}</h3>
                <p className="text-base text-[var(--text)]">{details.description}</p>
            </div>

            <div>
                <div className="flex items-center space-x-3 mb-2">
                    <CheckCircleIcon className="w-6 h-6 text-green-400"/>
                    <h3 className="text-xl font-bold text-[var(--accent)]">{t('modals.bestPractices')}</h3>
                </div>
                <ul className="space-y-2 text-base text-[var(--text)] pl-4">
                    {details.bestPractices.map((tip, index) => <li key={index} className="flex items-start"><span className="mr-2 mt-1">•</span><span>{tip}</span></li>)}
                </ul>
            </div>
            
            <div>
                <div className="flex items-center space-x-3 mb-2">
                    <XCircleIcon className="w-6 h-6 text-red-400"/>
                    <h3 className="text-xl font-bold text-[var(--accent)]">{t('modals.commonMistakes')}</h3>
                </div>
                <ul className="space-y-2 text-base text-[var(--text)] pl-4">
                    {details.commonMistakes.map((mistake, index) => <li key={index} className="flex items-start"><span className="mr-2 mt-1">•</span><span>{mistake}</span></li>)}
                </ul>
            </div>
        </div>
    );
};


const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({ isOpen, onClose, exerciseName, details, isLoading, error }) => {
  const { t } = useI18n();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--card)] rounded-lg shadow-2xl w-full max-w-lg p-6 relative transform transition-all duration-300 ease-out scale-95 opacity-0 animate-fade-in-scale">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--muted-text)] hover:text-[var(--primary)] transition-colors"
          aria-label={t('modals.close')}
        >
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-[var(--primary)] flex items-center justify-center space-x-3">
            <BookOpenIcon className="w-6 h-6" />
            <span>{exerciseName || t('modals.exerciseDetails')}</span>
        </h2>
        
        <div className="min-h-[250px] flex items-center justify-center">
            {isLoading && <LoadingSpinner />}
            {error && <ErrorDisplay message={error} />}
            {details && !isLoading && <DetailDisplay details={details} />}
        </div>
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

export default ExerciseDetailModal;