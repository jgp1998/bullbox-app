import React, { useState } from 'react';
import { ShareIcon, DownloadIcon } from '../Icons';
import { useI18n } from '../../context/i18n';
import Card from './Card';
import Button from './Button';

import { usePWA } from '../../hooks/usePWA';

const ShareAndInfo: React.FC = () => {
    const { t } = useI18n();
    const [copied, setCopied] = useState(false);
    const { isInstallable, installPWA } = usePWA();

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <Card title={t('shareAndInfo.shareTitle')}>
            <div className="space-y-6">
                <div className="flex flex-col gap-3">
                     <Button
                        onClick={handleShare}
                        variant="accent"
                        className="w-full py-4 text-xs font-black uppercase tracking-widest italic"
                        icon={<ShareIcon className="w-5 h-5" />}
                    >
                        {copied ? t('shareAndInfo.linkCopied') : t('shareAndInfo.shareApp')}
                    </Button>

                    {isInstallable && (
                        <Button
                            onClick={installPWA}
                            variant="primary"
                            className="w-full py-4 text-xs font-black uppercase tracking-widest italic"
                            icon={<DownloadIcon className="w-5 h-5" />}
                        >
                            {t('shareAndInfo.installApp') || 'Install BULLBOX App'}
                        </Button>
                    )}
                </div>
                
                <div className="pt-4 border-t border-[var(--border)]">
                    <h4 className="text-[10px] font-black text-[var(--muted-text)] uppercase tracking-widest mb-4">
                        {t('shareAndInfo.infoTitle')}
                    </h4>
                    <div className="flex items-start space-x-3 bg-[var(--input)]/50 p-4 rounded-2xl border border-[var(--border)]">
                        <DownloadIcon className="w-5 h-5 text-[var(--primary)] mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-[var(--text)] leading-relaxed font-bold italic opacity-80 uppercase tracking-tight">
                            {t('shareAndInfo.infoText')}
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ShareAndInfo;
