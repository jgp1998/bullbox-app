import React, { useState } from 'react';
import { ShareIcon, DownloadIcon } from './Icons';
import { useI18n } from '../context/i18n';

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
        <div className="bg-[var(--card)] p-6 rounded-lg shadow-lg space-y-4">
            <div>
                <h3 className="text-lg font-bold text-[var(--secondary)] mb-2">{t('shareAndInfo.shareTitle')}</h3>
                <button
                    onClick={handleShare}
                    className="w-full flex items-center justify-center space-x-2 bg-[var(--accent)] text-[var(--background)] py-2 px-4 rounded-md font-semibold hover:opacity-90 transition-all"
                >
                    <ShareIcon className="w-5 h-5" />
                    <span>{copied ? t('shareAndInfo.linkCopied') : t('shareAndInfo.shareApp')}</span>
                </button>
            </div>
            <div>
                <h3 className="text-lg font-bold text-[var(--secondary)] mb-2">{t('shareAndInfo.infoTitle')}</h3>
                <div className="flex items-start space-x-3 bg-[var(--input)] p-3 rounded-md">
                    <DownloadIcon className="w-6 h-6 text-[var(--muted-text)] mt-1 flex-shrink-0" />
                    <p className="text-sm text-[var(--muted-text)]">
                        {t('shareAndInfo.infoText')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ShareAndInfo;