import React from 'react';
import { AnalysisResult } from '../../types';
import { LightBulbIcon, DumbbellIcon, AppleIcon } from '../Icons';
import { useI18n } from '../../context/i18n';
import Modal from '../ui/Modal';
import Spinner from '../ui/Spinner';
import Alert from '../ui/Alert';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
}

const ResultDisplay: React.FC<{ result: AnalysisResult }> = ({ result }) => {
    const { t } = useI18n();
    return (
        <div className="space-y-8">
            <section>
                <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-[var(--primary)] bg-opacity-10 rounded-lg">
                        <LightBulbIcon className="w-6 h-6 text-[var(--primary)]"/>
                    </div>
                    <h3 className="text-xl font-bold text-[var(--text)]">{t('modals.analysis')}</h3>
                </div>
                <div className="bg-[var(--input)] p-4 rounded-xl border border-[var(--border)]">
                    <p className="text-base text-[var(--text)] leading-relaxed">{result.analysis}</p>
                </div>
            </section>

            <section>
                <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-blue-500 bg-opacity-10 rounded-lg">
                        <DumbbellIcon className="w-6 h-6 text-blue-500"/>
                    </div>
                    <h3 className="text-xl font-bold text-[var(--text)]">{t('modals.trainingTips')}</h3>
                </div>
                <ul className="grid grid-cols-1 gap-3">
                    {result.trainingTips.map((tip, index) => (
                        <li key={index} className="flex items-center p-3 bg-[var(--input)] rounded-lg border border-[var(--border)] text-sm font-medium">
                            <span className="w-2 h-2 bg-[var(--primary)] rounded-full mr-3 shrink-0" />
                            {tip}
                        </li>
                    ))}
                </ul>
            </section>
            
            <section>
                <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-green-500 bg-opacity-10 rounded-lg">
                        <AppleIcon className="w-6 h-6 text-green-500"/>
                    </div>
                    <h3 className="text-xl font-bold text-[var(--text)]">{t('modals.nutritionSuggestion')}</h3>
                </div>
                <div className="bg-[var(--input)] p-4 rounded-xl border border-[var(--border)]">
                    <p className="text-base text-[var(--text)] leading-relaxed">{result.nutritionSuggestion}</p>
                </div>
            </section>
        </div>
    );
};

const AnalysisModal: React.FC<AnalysisModalProps> = ({ isOpen, onClose, result, isLoading, error }) => {
  const { t } = useI18n();

  return (
    <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        title={t('modals.aiPerformanceReview')}
        size="lg"
    >
        <div className="min-h-[300px] flex flex-col justify-center">
            {isLoading && (
                <Spinner size="xl" label={t('modals.loadingAnalysis')} />
            )}
            
            {error && (
                <Alert 
                    variant="error" 
                    title={t('modals.errorTitle')} 
                    message={error} 
                />
            )}
            
            {result && !isLoading && !error && (
                <ResultDisplay result={result} />
            )}
        </div>
    </Modal>
  );
};

export default AnalysisModal;
