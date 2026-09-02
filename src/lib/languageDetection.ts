import type { Language } from './i18n';

const supportedLanguages = new Set<Language>(['en', 'it', 'fr', 'de', 'es']);

export function isSupportedLanguage(value: string | null): value is Language {
  return Boolean(value && supportedLanguages.has(value as Language));
}

function normalizeLanguageTag(value: string): Language | null {
  const primaryLanguage = value.trim().toLowerCase().replace('_', '-').split('-')[0];
  return isSupportedLanguage(primaryLanguage) ? primaryLanguage : null;
}

export function detectPreferredLanguage(languageTags: readonly string[]): Language {
  for (const languageTag of languageTags) {
    const language = normalizeLanguageTag(languageTag);
    if (language) return language;
  }
  return 'en';
}
