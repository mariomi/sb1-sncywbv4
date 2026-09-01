import { useLanguage } from '../lib/i18n';
import { useId } from 'react';

const options = [
  { value: 'en', label: 'EN' },
  { value: 'it', label: 'IT' },
  { value: 'fr', label: 'FR' },
  { value: 'de', label: 'DE' },
  { value: 'es', label: 'ES' },
] as const;

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const id = useId();

  return (
    <>
      <label className="sr-only" htmlFor={id}>Language</label>
      <select
        id={id}
        value={language}
        onChange={event => setLanguage(event.target.value as typeof language)}
        className="min-h-10 border border-white/20 bg-transparent px-2.5 text-[0.66rem] font-bold uppercase tracking-[0.12em] text-white focus:border-venetian-gold focus:outline-none"
        aria-label="Language"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </>
  );
}
