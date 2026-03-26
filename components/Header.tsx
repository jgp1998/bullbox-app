import React from 'react';
import { themes } from '../constants';
import { useI18n } from '../context/i18n';
import { useUIStore } from '../store/useUIStore';
import { useAuth } from '../hooks/useAuth';
import Button from './ui/Button';
import Input from './ui/Input';

const Header: React.FC = () => {
    const { t, language, setLanguage } = useI18n();
    const { theme, setTheme } = useUIStore();
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <header className="bg-[var(--card)] shadow-lg p-3 sm:p-4 flex justify-between items-center border-b border-[var(--border)] sticky top-0 z-40 backdrop-blur-md bg-opacity-90">
            <div className="flex items-center">
                <h1 className="text-xl sm:text-2xl font-black text-[var(--primary)] tracking-tighter uppercase italic drop-shadow-sm select-none">
                    BULL<span className="text-[var(--text)]">BOX</span>
                </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="hidden lg:flex items-center bg-[var(--input)] px-3 py-1.5 rounded-full border border-[var(--border)]">
                    <span className="text-[10px] font-bold text-[var(--muted-text)] uppercase tracking-widest mr-2">
                        {t('header.welcome')}:
                    </span>
                    <span className="text-xs font-black text-[var(--text)]">{user.username}</span>
                </div>
                
                <div className="flex items-center space-x-1 sm:space-x-2">
                    <div className="w-14 sm:w-20">
                        <Input 
                            id="language-select"
                            type="select"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as 'en' | 'es')}
                            options={[
                                { value: 'en', label: 'EN' },
                                { value: 'es', label: 'ES' }
                            ]}
                            aria-label={t('header.selectLanguage')}
                            className="text-[10px] sm:text-xs py-1 sm:py-2 h-auto min-h-0"
                        />
                    </div>
                    <div className="w-24 sm:w-32">
                        <Input 
                            id="theme-select"
                            type="select"
                            value={theme.name}
                            onChange={(e) => {
                                const newTheme = themes.find(t => t.name === e.target.value);
                                if (newTheme) setTheme(newTheme);
                            }}
                            options={themes.map(t => ({ value: t.name, label: t.name.toUpperCase() }))}
                            aria-label={t('header.selectTheme')}
                            className="text-[10px] sm:text-xs py-1 sm:py-2 h-auto min-h-0"
                        />
                    </div>
                </div>

                <Button
                    onClick={logout}
                    variant="primary"
                    size="sm"
                    className="font-bold py-1.5 h-8 min-h-0 sm:py-2 sm:h-10 sm:min-h-[44px]"
                >
                    <span className="hidden sm:inline">{t('header.logout')}</span>
                    <span className="sm:hidden">→</span>
                </Button>
            </div>
        </header>
    );
};

export default Header;