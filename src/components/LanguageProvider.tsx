import React, { useCallback, useEffect, useState } from 'react';
import { LanguageContext, translations, type Language } from '../lib/i18n';
import { detectPreferredLanguage, isSupportedLanguage } from '../lib/languageDetection';

const languageStorageKey = 'al-gobbo-language';

function getQueryLanguage(): Language | null {
  if (typeof window === 'undefined') return null;
  const queryLanguage = new URLSearchParams(window.location.search).get('lang');
  return isSupportedLanguage(queryLanguage) ? queryLanguage : null;
}

function getSavedLanguage(): Language | null {
  if (typeof window === 'undefined') return null;
  try {
    const savedLanguage = window.localStorage.getItem(languageStorageKey);
    return isSupportedLanguage(savedLanguage) ? savedLanguage : null;
  } catch {
    return null;
  }
}

function saveLanguage(language: Language) {
  try {
    window.localStorage.setItem(languageStorageKey, language);
  } catch {
    // The page still works when browser storage is unavailable.
  }
}

function getBrowserLanguage(): Language {
  if (typeof navigator === 'undefined') return 'en';
  const languageTags = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  return detectPreferredLanguage(languageTags);
}

function getInitialLanguage(): Language {
  return getQueryLanguage() ?? getSavedLanguage() ?? getBrowserLanguage();
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    if (getQueryLanguage() === language) saveLanguage(language);
  }, [language]);

  useEffect(() => {
    const handleBrowserLanguageChange = () => {
      if (getQueryLanguage() || getSavedLanguage()) return;
      setLanguageState(getBrowserLanguage());
    };
    window.addEventListener('languagechange', handleBrowserLanguageChange);
    return () => window.removeEventListener('languagechange', handleBrowserLanguageChange);
  }, []);

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    saveLanguage(nextLanguage);
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
