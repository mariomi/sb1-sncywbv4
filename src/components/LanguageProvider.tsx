import React, { useCallback, useEffect, useState } from 'react';
import { LanguageContext, Language, translations } from '../lib/i18n';

const supportedLanguages = new Set<Language>(['en', 'it', 'fr', 'de', 'es']);

function isLanguage(value: string | null): value is Language {
  return Boolean(value && supportedLanguages.has(value as Language));
}

function getInitialLanguage(): Language {
  const queryLanguage = new URLSearchParams(window.location.search).get('lang');
  if (isLanguage(queryLanguage)) return queryLanguage;

  const savedLanguage = localStorage.getItem('al-gobbo-language');
  if (isLanguage(savedLanguage)) return savedLanguage;

  const browserLanguage = navigator.language.split('-')[0];
  return isLanguage(browserLanguage) ? browserLanguage : 'en';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    localStorage.setItem('al-gobbo-language', nextLanguage);
    document.documentElement.lang = nextLanguage;

    const url = new URL(window.location.href);
    if (nextLanguage === 'en') url.searchParams.delete('lang');
    else url.searchParams.set('lang', nextLanguage);
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  }, []);

  const t = (key: string) => {
    const keys = key.split('.');
    let value: unknown = translations[language];
    
    for (const k of keys) {
      if (!value || typeof value !== 'object') return key;
      value = (value as Record<string, unknown>)[k];
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
