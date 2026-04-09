import React, { useEffect } from 'react';
import { useAIStore } from '../store/useAIStore';
import { useI18n } from '@/shared/context/i18n';
import { CheckCircleIcon, XCircleIcon, DownloadIcon } from '@/shared/components/ui/Icons';
import Spinner from '@/shared/components/ui/Spinner';
import { webLLMAnalysisRepository } from '@/core/infrastructure';

const ModelStatusCard: React.FC = () => {
    const { t } = useI18n();
    const { 
        engineStatus, 
        progress, 
        progressText, 
        isWebGPUSupported, 
        isStoragePersisted,
        checkWebGPUSupport,
        error 
    } = useAIStore();

    useEffect(() => {
        checkWebGPUSupport();
    }, [checkWebGPUSupport]);

    if (isWebGPUSupported === false) {
        return (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start space-x-3">
                <XCircleIcon className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                    <p className="text-red-500 font-bold text-sm">{t('aiAssistant.webGpuNotSupported')}</p>
                    <p className="text-red-400/80 text-xs mt-1">{t('aiAssistant.webGpuRequirement')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${engineStatus === 'ready' ? 'bg-green-500/10' : 'bg-(--primary)/10'}`}>
                        {engineStatus === 'ready' ? (
                            <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        ) : engineStatus === 'loading' ? (
                            <Spinner size="sm" />
                        ) : (
                            <DownloadIcon className="w-5 h-5 text-(--primary)" />
                        )}
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-(--text)">
                            {t(`aiAssistant.status.${engineStatus}`)}
                        </h4>
                        <div className="flex items-center space-x-2">
                            <p className="text-xs text-(--muted-text)">
                                {isWebGPUSupported ? t('aiAssistant.webGpuSupported') : t('aiAssistant.verifyingHardware')}
                            </p>
                            {isStoragePersisted && (
                                <span className="flex items-center text-[9px] bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded-full border border-green-500/20">
                                    <CheckCircleIcon className="w-2.5 h-2.5 mr-1" />
                                    {t('aiAssistant.storagePersisted')}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {engineStatus === 'uninitialized' && (
                <div className="space-y-3">
                    <p className="text-xs text-(--muted-text) leading-relaxed italic">
                        {t('aiAssistant.download.preparing')}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-(--primary) animate-pulse">
                        <Spinner size="sm" />
                        <span>{t('aiAssistant.preparingModels')}</span>
                    </div>
                </div>
            )}

            {engineStatus === 'loading' && (
                <div className="space-y-2">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-(--muted-text) truncate pr-4">
                            {progressText?.includes('cache') 
                                ? t('aiAssistant.loadingFromCache') 
                                : progressText?.includes('Fetching')
                                    ? t('aiAssistant.downloadingFromNetwork')
                                    : progressText || t('aiAssistant.status.loading')}
                        </span>
                        <span className="text-(--primary) font-bold">{Math.round(progress * 100)}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                        <div 
                            className="bg-(--primary) h-full transition-all duration-300 ease-out"
                            style={{ width: `${progress * 100}%` }}
                        />
                    </div>
                    <p className="text-[10px] text-(--muted-text) text-center">{t('aiAssistant.firstTimeOnly')}</p>
                </div>
            )}

            {error && (
                <div className="flex items-center space-x-2 text-red-400 text-xs bg-red-500/5 p-2 rounded-lg">
                    <XCircleIcon className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
};

export default ModelStatusCard;
