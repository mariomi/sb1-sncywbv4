import { motion } from 'framer-motion';
import { useLanguage } from '../lib/i18n';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <motion.div
      className="flex space-x-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 rounded-lg text-sm font-medium transition-colors ${
          language === 'en'
            ? 'bg-venetian-gold/90 text-venetian-brown'
            : 'text-venetian-sandstone hover:text-white hover:bg-white/10'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('it')}
        className={`px-2 py-1 rounded-lg text-sm font-medium transition-colors ${
          language === 'it'
            ? 'bg-venetian-gold/90 text-venetian-brown'
            : 'text-venetian-sandstone hover:text-white hover:bg-white/10'
        }`}
      >
        IT
      </button>
    </motion.div>
  );
}