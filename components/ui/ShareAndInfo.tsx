import React, { useState } from 'react';
import { ShareIcon, DownloadIcon } from '../Icons';
import { useI18n } from '../../context/i18n';
import Card from './Card';
import Button from './Button';

const ShareAndInfo: React.FC = () => {
    const { t } = useI18n();
    const [copied, setCopied] = useState(false);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <Card title={t('shareAndInfo.shareTitle')}>
            <div className="space-y-6">
                <div>
                     <Button
                        onClick={handleShare}
                        variant="accent"
                        className="w-full py-4 text-lg"
                        icon={<ShareIcon className="w-6 h-6" />}
                    >
                        {copied ? t('shareAndInfo.linkCopied') : t('shareAndInfo.shareApp')}
                    </Button>
                </div>
                
                <div className="pt-4 border-t border-[var(--border)]">
                    <h4 className="text-sm font-bold text-[var(--muted-text)] uppercase tracking-wider mb-3">
                        {t('shareAndInfo.infoTitle')}
                    </h4>
                    <div className="flex items-start space-x-3 bg-[var(--input)] p-4 rounded-xl border border-[var(--border)]">
                        <DownloadIcon className="w-6 h-6 text-[var(--primary)] mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-[var(--text)] leading-relaxed font-medium">
                            {t('shareAndInfo.infoText')}
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ShareAndInfo;
