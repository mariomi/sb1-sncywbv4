import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../lib/ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      className="grid h-10 w-10 place-items-center border border-white/15 text-venetian-sandstone transition-colors hover:border-venetian-gold hover:text-white"
      whileTap={{ scale: 0.94 }}
      aria-label={theme === 'light' ? 'Attiva tema scuro' : 'Attiva tema chiaro'}
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </motion.button>
  );
}
