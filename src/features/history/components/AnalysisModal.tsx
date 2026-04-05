import React from 'react';
import { AnalysisResult } from '@/shared/types';
import { XIcon, LightBulbIcon, DumbbellIcon, AppleIcon } from '@/shared/components/ui/Icons';
import { useI18n } from '@/shared/context/i18n';

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
        <div className="space-y-8">
            <section className="animate-in">
                <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-[var(--accent)]/10 rounded-lg">
                        <LightBulbIcon className="w-5 h-5 text-[var(--accent)]"/>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-[var(--accent)] line-clamp-1">{t('modals.analysis')}</h3>
                </div>
                <div className="bg-white/5 rounded-xl p-4 sm:p-5">
                    <p className="text-sm sm:text-base leading-relaxed text-[var(--text)] whitespace-pre-line">{result.analysis}</p>
                </div>
            </section>

            <section className="animate-in" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-[var(--primary)]/10 rounded-lg">
                        <DumbbellIcon className="w-5 h-5 text-[var(--primary)]"/>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-[var(--primary)] line-clamp-1">{t('modals.trainingTips')}</h3>
                </div>
                <div className="space-y-3">
                    {result.trainingTips.map((tip, index) => (
                        <div key={index} className="flex items-start space-x-3 text-sm sm:text-base text-[var(--text)] bg-white/5 p-3 rounded-lg border border-white/5">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] flex items-center justify-center text-xs font-bold mt-0.5">
                                {index + 1}
                            </span>
                            <span className="leading-tight">{tip}</span>
                        </div>
                    ))}
                </div>
            </section>
            
            <section className="animate-in" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-[var(--accent)]/10 rounded-lg">
                        <AppleIcon className="w-5 h-5 text-[var(--accent)]"/>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-[var(--accent)] line-clamp-1">{t('modals.nutritionSuggestion')}</h3>
                </div>
                <div className="bg-white/5 rounded-xl p-4 sm:p-5 border-l-4 border-[var(--accent)]">
                    <p className="text-sm sm:text-base leading-relaxed text-[var(--text)]">{result.nutritionSuggestion}</p>
                </div>
            </section>
        </div>
    );
};


const AnalysisModal: React.FC<AnalysisModalProps> = ({ isOpen, onClose, result, isLoading, error }) => {
  const { t } = useI18n();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 transition-opacity duration-300">
      <div 
        className="bg-[var(--card)] rounded-t-3xl sm:rounded-2xl shadow-2xl w-full max-w-lg relative transform transition-all duration-300 ease-out max-h-[90vh] flex flex-col animate-slide-up-mobile sm:animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile handle */}
        <div className="w-12 h-1.5 bg-[var(--border)] rounded-full mx-auto mt-3 mb-1 sm:hidden" />
        
        <div className="p-6 sm:p-8 overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-[var(--muted-text)] hover:text-[var(--primary)] transition-colors p-2 rounded-full hover:bg-white/5"
            aria-label="Close"
          >
            <XIcon className="w-6 h-6" />
          </button>
          
          <h2 className="text-xl sm:text-2xl font-bold mb-6 pr-8 text-[var(--primary)]">{t('modals.aiPerformanceReview')}</h2>
          
          <div className="min-h-[200px]">
              {isLoading && (
                <div className="py-12">
                  <LoadingSpinner />
                </div>
              )}
              {error && (
                <div className="py-12">
                  <ErrorDisplay message={error} />
                </div>
              )}
              {result && !isLoading && <ResultDisplay result={result} />}
          </div>
        </div>
      </div>

      {/* Overlay background to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      <style>{`
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slide-up-mobile {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.3s forwards;
        }
        .animate-slide-up-mobile {
          @media (max-width: 639px) {
            animation: slide-up-mobile 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          @media (min-width: 640px) {
            animation: fade-in-scale 0.3s forwards;
          }
        }
      `}</style>
    </div>
  );
};

export default AnalysisModal;

