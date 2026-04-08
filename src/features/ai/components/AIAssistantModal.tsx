import React from 'react';
import Spinner from '@/shared/components/ui/Spinner';
import { StructuredInsight } from '@/core/domain/models/Analysis';
import { XIcon, BrainCircuitIcon } from '@/shared/components/ui/Icons';
import { useI18n } from '@/shared/context/i18n';
import { useHistoryAnalysisStore } from '@/features/history/store/useHistoryAnalysisStore';
import { useAIStore } from '../store/useAIStore';
import ModelStatusCard from './ModelStatusCard';
import StructuredInsightCard from '@/features/history/components/StructuredInsightCard';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: StructuredInsight[] | null;
  isLoading: boolean;
  error: string | null;
}

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => {
    const { t } = useI18n();
    return (
        <div className="text-center text-red-400">
            <p className="font-bold text-lg">{t('modals.errorTitle')}</p>
            <p className="text-sm">{message}</p>
        </div>
    );
};

const ResultDisplay: React.FC<{ insights: StructuredInsight[] }> = ({ insights }) => {
    const { t } = useI18n();
    
    if (insights.length === 0) {
        return (
            <div className="text-center py-8 text-(--muted-text)">
                <p>{t('history.noInsights') || 'No se detectaron hallazgos significativos para este periodo.'}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-2 px-1">
                <div className="p-2 bg-(--primary)/10 rounded-lg">
                    <BrainCircuitIcon className="w-5 h-5 text-(--primary)"/>
                </div>
                <div>
                   <h3 className="text-lg font-bold text-(--foreground)">{t('modals.coachInsights')}</h3>
                   <p className="text-[10px] text-(--muted-text) font-medium uppercase tracking-widest">{t('modals.basedOnHistory')}</p>
                </div>
            </div>

            <div className="grid gap-4">
                {insights.map((insight, index) => (
                    <StructuredInsightCard 
                        key={index} 
                        insight={insight} 
                        delay={`${index * 100}ms`}
                    />
                ))}
            </div>
        </div>
    );
};


const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose, result, isLoading, error }) => {
  const { t } = useI18n();
  const { mode, setMode } = useHistoryAnalysisStore();
    const { engineStatus, isOnline, progress } = useAIStore();

  if (!isOpen) return null;

  const isLocalReady = mode === 'local' && engineStatus === 'ready';
  const showLoading = isLoading || (mode === 'local' && engineStatus === 'loading');

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 transition-opacity duration-300">
      <div 
        className="bg-(--card) rounded-t-3xl sm:rounded-2xl shadow-2xl w-full max-w-lg relative transform transition-all duration-300 ease-out max-h-[90vh] flex flex-col animate-slide-up-mobile sm:animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile handle */}
        <div className="w-12 h-1.5 bg-(--border) rounded-full mx-auto mt-3 mb-1 sm:hidden" />
        
        <div className="px-6 pt-6 sm:px-8 sm:pt-8 flex justify-between items-center border-b border-white/5 pb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-(--primary)">{t('modals.aiPerformanceReview')}</h2>
            <button
                onClick={onClose}
                className="text-(--muted-text) hover:text-(--primary) transition-colors p-2 rounded-full hover:bg-white/5"
                aria-label={t('modals.close')}
            >
                <XIcon className="w-6 h-6" />
            </button>
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {/* Mode Selector */}
          <div className="mb-6 flex p-1 bg-white/5 rounded-xl border border-white/10">
              <button 
                onClick={() => isOnline && setMode('cloud')}
                disabled={!isOnline}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all relative ${mode === 'cloud' ? 'bg-(--primary) text-white shadow-lg' : 'text-(--muted-text) hover:text-white'} ${!isOnline ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
              >
                  {t('aiAssistant.cloudMode')}
                  {!isOnline && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                  )}
              </button>
              <button 
                onClick={() => setMode('local')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all ${mode === 'local' ? 'bg-(--primary) text-white shadow-lg' : 'text-(--muted-text) hover:text-white'}`}
              >
                  {t('aiAssistant.localMode')}
              </button>
          </div>

          {mode === 'local' && (
              <div className="mb-6 space-y-3">
                {!isOnline && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 flex items-center space-x-2">
                        <span className="flex h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></span>
                        <p className="text-yellow-500 text-[10px] font-bold uppercase tracking-wider">{t('aiAssistant.offlineModeActive')}</p>
                    </div>
                )}
                <ModelStatusCard />
              </div>
          )}
          
          <div className="min-h-[200px]">
              {showLoading && (
                <div className="py-12 flex flex-col items-center">
                  <Spinner size="xl" />
                  <p className="mt-4 text-(--muted-text) text-center animate-pulse">
                    {mode === 'local' && engineStatus === 'loading' 
                      ? t('aiAssistant.status.loading') 
                      : t('modals.loadingAnalysis')}
                  </p>
                  {mode === 'local' && engineStatus === 'loading' && (
                    <div className="mt-6 w-full max-w-xs">
                        <div className="flex justify-between text-[10px] mb-1 text-(--muted-text)">
                            <span>{t('aiAssistant.download.preparing')}</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-(--primary) transition-all duration-300"
                                style={{ width: `${Math.max(5, (progress || 0) * 100)}%` }}
                            />
                        </div>
                    </div>
                  )}
                </div>
              )}
              {error && (
                <div className="py-12">
                  <ErrorDisplay message={error} />
                  <div className="mt-6 flex justify-center">
                      <button 
                        onClick={() => useHistoryAnalysisStore.getState().setMode(mode)}
                        className="px-4 py-2 bg-(--primary) text-white rounded-xl text-sm font-bold shadow-lg hover:bg-(--primary-hover) transition-all"
                      >
                          {t('aiAssistant.retry')}
                      </button>
                  </div>
                </div>
              )}
              {result && !showLoading && <ResultDisplay insights={result} />}
              
              {!result && !showLoading && !error && (mode === 'cloud' || isLocalReady) && (
                  <div className="py-12 text-center text-(--muted-text)">
                      <p className="text-sm italic">
                          {mode === 'local' ? t('aiAssistant.localReady') : t('aiAssistant.requestingCloud')}
                      </p>
                  </div>
              )}
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

export default AIAssistantModal;
