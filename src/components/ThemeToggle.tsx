import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../lib/ThemeProvider';
import { useLanguage, type Language } from '../lib/i18n';

const themeCopy: Record<Language, { dark: string; light: string }> = {
  it: { dark: 'Attiva tema scuro', light: 'Attiva tema chiaro' },
  en: { dark: 'Switch to dark theme', light: 'Switch to light theme' },
  fr: { dark: 'Activer le thème sombre', light: 'Activer le thème clair' },
  de: { dark: 'Dunkles Design aktivieren', light: 'Helles Design aktivieren' },
  es: { dark: 'Activar tema oscuro', light: 'Activar tema claro' },
};

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { language } = useLanguage();

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      className="grid h-10 w-10 place-items-center border border-white/15 text-venetian-sandstone transition-colors hover:border-venetian-gold hover:text-white"
      whileTap={{ scale: 0.94 }}
      aria-label={theme === 'light' ? themeCopy[language].dark : themeCopy[language].light}
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </motion.button>
  );
}
