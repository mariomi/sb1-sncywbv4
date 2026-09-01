import { Menu, Phone, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { useLanguage } from '../lib/i18n';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: t('nav.menu'), path: '/menu' },
    { name: t('nav.about'), path: '/our-story' },
    { name: t('nav.location'), path: '/location' },
  ];

  const isHomeOverlay = location.pathname === '/' && !isScrolled && !isMenuOpen;

  return (
    <header className={`fixed inset-x-0 top-0 z-50 border-b text-white transition-all duration-500 ${isHomeOverlay ? 'border-white/14 bg-transparent' : 'border-white/10 bg-venetian-brown/96 shadow-[0_12px_35px_rgba(18,15,12,0.18)] backdrop-blur-lg'}`}>
      <div className={`mx-auto flex max-w-[1480px] items-center justify-between px-4 transition-[height] duration-300 sm:px-7 lg:px-10 ${isScrolled ? 'h-[72px]' : 'h-[84px]'}`}>
        <Link to="/" className="group flex items-center gap-3" aria-label="Al Gobbo di Rialto home">
          <span className="grid h-10 w-10 place-items-center border border-venetian-gold/60 transition-colors group-hover:bg-venetian-gold group-hover:text-venetian-brown">
            <Logo className="text-venetian-gold group-hover:text-venetian-brown" size={24} />
          </span>
          <span className="leading-none">
            <span className="block font-serif text-[1.28rem] font-semibold tracking-[0.01em]">Al Gobbo di Rialto</span>
            <span className="mt-1.5 block text-[0.57rem] font-bold uppercase tracking-[0.26em] text-venetian-sandstone/65">Venezia · dal 1955</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-9 lg:flex" aria-label="Main navigation">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative py-3 text-[0.66rem] font-bold uppercase tracking-[0.17em] transition-colors ${active ? 'text-venetian-gold' : 'text-white/76 hover:text-white'}`}
              >
                {item.name}
                <span className={`absolute inset-x-0 bottom-1 h-px origin-left bg-venetian-gold transition-transform ${active ? 'scale-x-100' : 'scale-x-0'}`} />
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <LanguageSwitcher />
          <Link to="/book" className="ml-2 inline-flex min-h-11 items-center border border-venetian-gold bg-venetian-gold px-5 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-venetian-brown transition-colors hover:bg-transparent hover:text-venetian-gold">
            {t('nav.reserve')}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="grid h-11 w-11 place-items-center border border-white/20 text-white transition-colors hover:border-venetian-gold hover:text-venetian-gold lg:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen ? (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden border-t border-white/10 bg-venetian-brown lg:hidden"
          >
            <nav className="mx-auto max-w-[1480px] px-4 pb-6 pt-4 sm:px-7" aria-label="Mobile navigation">
              <div className="divide-y divide-white/10 border-y border-white/10">
                {navItems.map((item, index) => (
                  <motion.div key={item.path} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04 }}>
                    <Link to={item.path} className={`flex min-h-12 items-center justify-between py-3 text-sm font-semibold ${location.pathname === item.path ? 'text-venetian-gold' : 'text-white'}`}>
                      {item.name}<span aria-hidden="true">↗</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <a href="tel:+390415204603" className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/20 text-xs font-bold uppercase tracking-[0.12em] text-white"><Phone className="h-4 w-4" />Chiamaci</a>
                <Link to="/book" className="inline-flex min-h-12 items-center justify-center bg-venetian-gold px-4 text-xs font-bold uppercase tracking-[0.12em] text-venetian-brown">{t('nav.reserve')}</Link>
              </div>
              <div className="mt-5 flex items-center justify-between">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
