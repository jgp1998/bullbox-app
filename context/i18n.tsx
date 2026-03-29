import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Removed direct imports of JSON files to avoid module resolution issues.

type Language = 'en' | 'es';

interface I18nContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: string, options?: { [key: string]: string | number }) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('es');
    const [translations, setTranslations] = useState<{ [key: string]: any }>({ en: {}, es: {} });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedLang = localStorage.getItem('bullboxLanguage') as Language;
        if (savedLang && ['en', 'es'].includes(savedLang)) {
            setLanguage(savedLang);
        }
    }, []);
    
    useEffect(() => {
        const loadTranslations = async () => {
            setIsLoading(true);
            try {
                const enRes = await fetch('/locales/en.json');
                if (!enRes.ok) throw new Error(`${enRes.status} ${enRes.statusText}`);
                const enData = await enRes.json();

                const esRes = await fetch('/locales/es.json');
                if (!esRes.ok) throw new Error(`${esRes.status} ${esRes.statusText}`);
                const esData = await esRes.json();
                
                setTranslations({ en: enData, es: esData });
            } catch (error) {
                console.error("Failed to load translations:", error);
            } finally {
                setIsLoading(false);
            }

        };
        loadTranslations();
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('bullboxLanguage', lang);
    };

    const t = (key: string, options?: { [key: string]: string | number }): string => {
        const currentTranslations = translations[language] || translations.en || {};
        const keys = key.split('.');
        
        let result = keys.reduce((acc, currentKey) => acc?.[currentKey], currentTranslations);

        if (result === undefined) {
             // Fallback to Spanish
             const fallbackTranslations = translations.es || translations.en || {};
             result = keys.reduce((acc, currentKey) => acc?.[currentKey], fallbackTranslations);
        }

        if (result === undefined) {
            return key; // Return key if not found in any language
        }
        
        if (typeof result === 'string' && options) {
            return Object.entries(options).reduce((str, [key, value]) => {
                return str.replace(`{${key}}`, String(value));
            }, result);
        }

        return result || key;
    };

    if (isLoading) {
        // Render nothing or a loading spinner while translations are being fetched.
        // This prevents a flash of untranslated content.
        return null;
    }

    return (
        <I18nContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </I18nContext.Provider>
    );
};

export const useI18n = (): I18nContextType => {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
};
