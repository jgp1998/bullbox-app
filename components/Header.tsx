import React from 'react';
import { themes } from '../constants';
import { useI18n } from '../context/i18n';
import { useUIStore } from '../store/useUIStore';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
    const { t, language, setLanguage } = useI18n();
    const { theme, setTheme } = useUIStore();
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <header className="bg-[var(--card)] shadow-md p-4 flex justify-between items-center">
            <div className="flex items-center">
                <h1 className="text-2xl font-bold text-[var(--primary)] tracking-tight">{t('header.title')}</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
                <span className="text-sm text-[var(--muted-text)] hidden sm:block">
                    {t('header.welcome')}, <span className="font-bold text-[var(--text)]">{user.username}</span>
                </span>
                <select 
                    id="language-select"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as 'en' | 'es')}
                    className="bg-[var(--input)] text-[var(--text)] rounded-md py-1 px-2 border border-[var(--border)] focus:ring-1 focus:ring-[var(--primary)] focus:outline-none text-sm"
                    aria-label={t('header.selectLanguage')}
                >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                </select>
                <select 
                    id="theme-select"
                    value={theme.name}
                    onChange={(e) => {
                        const newTheme = themes.find(t => t.name === e.target.value);
                        if (newTheme) setTheme(newTheme);
                    }}
                    className="bg-[var(--input)] text-[var(--text)] rounded-md py-1 px-2 border border-[var(--border)] focus:ring-1 focus:ring-[var(--primary)] focus:outline-none text-sm"
                    aria-label={t('header.selectTheme')}
                >
                    {themes.map(t => (
                        <option key={t.name} value={t.name}>{t.name}</option>
                    ))}
                </select>
                <button
                    onClick={logout}
                    className="bg-[var(--primary)] text-white text-sm font-semibold rounded-md py-1 px-3 hover:opacity-90 transition-opacity"
                >
                    {t('header.logout')}
                </button>
            </div>
        </header>
    );
};

export default Header;