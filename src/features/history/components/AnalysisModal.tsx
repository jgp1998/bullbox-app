import React from 'react';
import { AnalysisResult } from '../types';
import { XIcon, LightBulbIcon, DumbbellIcon, AppleIcon } from '@/src/shared/components/ui/Icons';
import { useI18n } from '@/context/i18n';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
}

const LoadingSpinner: React.FC = () => {
    const { t } = useI18n();
    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[var(--primary)]"></div>
            <p className="text-lg text-[var(--muted-text)] font-semibold">{t('modals.loadingAnalysis')}</p>
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

const ResultDisplay: React.FC<{ result: AnalysisResult }> = ({ result }) => {
    const { t } = useI18n();
    return (
        <div className="space-y-6">
            <div>
                <div className="flex items-center space-x-3 mb-2">
                    <LightBulbIcon className="w-6 h-6 text-[var(--accent)]"/>
                    <h3 className="text-xl font-bold text-[var(--accent)]">{t('modals.analysis')}</h3>
                </div>
                <p className="text-base text-[var(--text)]">{result.analysis}</p>
            </div>

            <div>
                <div className="flex items-center space-x-3 mb-2">
                    <DumbbellIcon className="w-6 h-6 text-[var(--accent)]"/>
                    <h3 className="text-xl font-bold text-[var(--accent)]">{t('modals.trainingTips')}</h3>
                </div>
                <ul className="list-disc list-inside space-y-2 text-base text-[var(--text)]">
                    {result.trainingTips.map((tip, index) => <li key={index}>{tip}</li>)}
                </ul>
            </div>
            
            <div>
                <div className="flex items-center space-x-3 mb-2">
                    <AppleIcon className="w-6 h-6 text-[var(--accent)]"/>
                    <h3 className="text-xl font-bold text-[var(--accent)]">{t('modals.nutritionSuggestion')}</h3>
                </div>
                <p className="text-base text-[var(--text)]">{result.nutritionSuggestion}</p>
            </div>
        </div>
    );
};


const AnalysisModal: React.FC<AnalysisModalProps> = ({ isOpen, onClose, result, isLoading, error }) => {
  const { t } = useI18n();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--card)] rounded-lg shadow-2xl w-full max-w-lg p-6 relative transform transition-all duration-300 ease-out scale-95 opacity-0 animate-fade-in-scale">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--muted-text)] hover:text-[var(--primary)] transition-colors"
        >
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-[var(--primary)]">{t('modals.aiPerformanceReview')}</h2>
        
        <div className="min-h-[200px] flex items-center justify-center">
            {isLoading && <LoadingSpinner />}
            {error && <ErrorDisplay message={error} />}
            {result && !isLoading && <ResultDisplay result={result} />}
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

export default AnalysisModal;

