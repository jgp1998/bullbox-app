import React from 'react';
import { ExerciseDetail } from '../../types';
import { BookOpenIcon, CheckCircleIcon, XCircleIcon } from '../Icons';
import { useI18n } from '../../context/i18n';
import Modal from '../ui/Modal';
import Spinner from '../ui/Spinner';
import Alert from '../ui/Alert';

interface ExerciseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseName: string | null;
  details: ExerciseDetail | null;
  isLoading: boolean;
  error: string | null;
}

const DetailDisplay: React.FC<{ details: ExerciseDetail }> = ({ details }) => {
    const { t } = useI18n();
    return (
        <div className="space-y-8">
            <section>
                <h3 className="text-xl font-bold text-[var(--text)] mb-3">{t('modals.description')}</h3>
                <div className="bg-[var(--input)] p-4 rounded-xl border border-[var(--border)]">
                    <p className="text-base text-[var(--text)] leading-relaxed font-medium">{details.description}</p>
                </div>
            </section>

            <section>
                <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-green-500 bg-opacity-10 rounded-lg">
                        <CheckCircleIcon className="w-6 h-6 text-green-500"/>
                    </div>
                    <h3 className="text-xl font-bold text-[var(--text)]">{t('modals.bestPractices')}</h3>
                </div>
                <ul className="grid grid-cols-1 gap-3">
                    {details.bestPractices.map((tip, index) => (
                        <li key={index} className="flex items-center p-3 bg-[var(--input)] rounded-lg border border-[var(--border)] text-sm font-medium">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-3 shrink-0" />
                            {tip}
                        </li>
                    ))}
                </ul>
            </section>
            
            <section>
                <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-red-500 bg-opacity-10 rounded-lg">
                        <XCircleIcon className="w-6 h-6 text-red-500"/>
                    </div>
                    <h3 className="text-xl font-bold text-[var(--text)]">{t('modals.commonMistakes')}</h3>
                </div>
                <ul className="grid grid-cols-1 gap-3">
                    {details.commonMistakes.map((mistake, index) => (
                        <li key={index} className="flex items-center p-3 bg-[var(--input)] rounded-lg border border-[var(--border)] text-sm font-medium">
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-3 shrink-0" />
                            {mistake}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({ isOpen, onClose, exerciseName, details, isLoading, error }) => {
  const { t } = useI18n();

  return (
    <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        title={exerciseName || t('modals.exerciseDetails')}
        size="lg"
    >
        <div className="min-h-[300px] flex flex-col justify-center">
            {isLoading && (
                <Spinner size="xl" label={t('modals.loadingDetails')} />
            )}
            
            {error && (
                <Alert 
                    variant="error" 
                    title={t('modals.errorTitle')} 
                    message={error} 
                />
            )}
            
            {details && !isLoading && !error && (
                <DetailDisplay details={details} />
            )}
        </div>
    </Modal>
  );
};

export default ExerciseDetailModal;
