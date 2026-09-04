import { ChevronDown, Globe2 } from 'lucide-react';
import { useId } from 'react';
import { useLanguage, type Language } from '../lib/i18n';

const options: ReadonlyArray<{ value: Language; label: string }> = [
  { value: 'it', label: 'Italiano' },
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'es', label: 'Español' },
] as const;

const selectorLabel: Record<Language, string> = {
  it: 'Scegli la lingua',
  en: 'Choose language',
  fr: 'Choisir la langue',
  de: 'Sprache wählen',
  es: 'Elegir idioma',
};

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const id = useId();
  const label = selectorLabel[language];

  return (
    <div className="group relative shrink-0">
      <label className="sr-only" htmlFor={id}>{label}</label>
      <Globe2 aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-venetian-gold" />
      <select
        id={id}
        value={language}
        onChange={(event) => setLanguage(event.target.value as Language)}
        className="min-h-11 w-[7.5rem] cursor-pointer appearance-none rounded-full border border-white/25 bg-white/[0.06] py-2 pl-9 pr-8 font-mono text-[0.64rem] font-medium uppercase tracking-[0.08em] text-white transition-colors hover:border-venetian-gold/80 hover:bg-white/[0.1] focus:border-venetian-gold focus:outline-none focus:ring-2 focus:ring-venetian-gold/35"
        aria-label={label}
        title={label}
      >
        {options.map(option => (
          <option key={option.value} value={option.value} className="bg-venetian-brown text-white">{option.label}</option>
        ))}
      </select>
      <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/65 transition-colors group-hover:text-venetian-gold" />
    </div>
  );
}
