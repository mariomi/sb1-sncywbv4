import { Menu, Phone, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { useLanguage, type Language } from '../lib/i18n';

const navbarCopy: Record<Language, {
  home: string;
  primaryNavigation: string;
  mobileNavigation: string;
  openMenu: string;
  closeMenu: string;
  call: string;
  faq: string;
  manage: string;
}> = {
  it: { home: 'Al Gobbo di Rialto, torna alla pagina iniziale', primaryNavigation: 'Navigazione principale', mobileNavigation: 'Navigazione mobile', openMenu: 'Apri il menu', closeMenu: 'Chiudi il menu', call: 'Chiamaci', faq: 'Domande frequenti', manage: 'Le mie prenotazioni' },
  en: { home: 'Al Gobbo di Rialto, back to the home page', primaryNavigation: 'Main navigation', mobileNavigation: 'Mobile navigation', openMenu: 'Open menu', closeMenu: 'Close menu', call: 'Call us', faq: 'Frequently asked questions', manage: 'My bookings' },
  fr: { home: 'Al Gobbo di Rialto, retour à l’accueil', primaryNavigation: 'Navigation principale', mobileNavigation: 'Navigation mobile', openMenu: 'Ouvrir le menu', closeMenu: 'Fermer le menu', call: 'Appelez-nous', faq: 'Questions fréquentes', manage: 'Mes réservations' },
  de: { home: 'Al Gobbo di Rialto, zurück zur Startseite', primaryNavigation: 'Hauptnavigation', mobileNavigation: 'Mobile Navigation', openMenu: 'Menü öffnen', closeMenu: 'Menü schließen', call: 'Anrufen', faq: 'Häufige Fragen', manage: 'Meine Reservierungen' },
  es: { home: 'Al Gobbo di Rialto, volver al inicio', primaryNavigation: 'Navegación principal', mobileNavigation: 'Navegación móvil', openMenu: 'Abrir el menú', closeMenu: 'Cerrar el menú', call: 'Llámanos', faq: 'Preguntas frecuentes', manage: 'Mis reservas' },
};

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isScrolledRef = useRef(false);
  const [isHomeIntroActive, setIsHomeIntroActive] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.location.pathname === '/';
  });
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);
  const mobileNavigationRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { t, language } = useLanguage();
  const copy = navbarCopy[language];

  useEffect(() => {
    const handleScroll = () => {
      const nextIsScrolled = window.scrollY > 24;
      if (isScrolledRef.current === nextIsScrolled) return;
      isScrolledRef.current = nextIsScrolled;
      setIsScrolled(nextIsScrolled);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [location.pathname]);

  useEffect(() => {
    setIsHomeIntroActive(location.pathname === '/');

    const syncIntroVisibility = () => {
      const publishedState = document.documentElement.dataset.homeIntroActive;
      if (publishedState !== undefined) {
        setIsHomeIntroActive(location.pathname === '/' && publishedState === 'true');
      }
    };
    const syncFrame = window.requestAnimationFrame(syncIntroVisibility);

    const handleIntroVisibility = (event: Event) => {
      const customEvent = event as CustomEvent<{ active: boolean }>;
      setIsHomeIntroActive(location.pathname === '/' && customEvent.detail.active);
    };
    window.addEventListener('al-gobbo:intro-visibility', handleIntroVisibility);
    return () => {
      window.cancelAnimationFrame(syncFrame);
      window.removeEventListener('al-gobbo:intro-visibility', handleIntroVisibility);
    };
  }, [location.pathname]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const mainContent = document.getElementById('main-content');
    document.body.style.overflow = 'hidden';
    if (mainContent) mainContent.inert = true;
    const focusTimer = window.setTimeout(() => firstMobileLinkRef.current?.focus(), 80);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        window.requestAnimationFrame(() => menuButtonRef.current?.focus());
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = Array.from(mobileNavigationRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ) ?? []);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (mainContent) mainContent.inert = false;
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    const closeAtDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setIsMenuOpen(false);
    };
    desktopQuery.addEventListener('change', closeAtDesktop);
    return () => desktopQuery.removeEventListener('change', closeAtDesktop);
  }, []);

  const primaryNavItems = [
    { name: t('nav.menu'), path: '/menu' },
    { name: t('nav.about'), path: '/our-story' },
    { name: t('nav.location'), path: '/location' },
  ];
  const mobileNavItems = [
    ...primaryNavItems,
    { name: t('nav.gallery'), path: '/gallery' },
    { name: t('nav.contact'), path: '/contact' },
    { name: copy.faq, path: '/faq' },
    { name: copy.manage, path: '/my-reservations' },
  ];

  const isHomeOverlay = location.pathname === '/' && !isScrolled && !isMenuOpen;

  if (isHomeIntroActive) return null;

  return (
    <header className={`fixed inset-x-0 top-0 z-50 border-b text-white transition-all duration-500 ${isHomeOverlay ? 'border-white/10 bg-transparent' : 'border-white/10 bg-venetian-brown/95 shadow-[0_12px_35px_rgba(18,15,12,0.18)] backdrop-blur-lg'}`}>
      <div className={`mx-auto flex max-w-[1480px] items-center justify-between px-4 transition-[height] duration-300 sm:px-7 lg:px-10 ${isScrolled ? 'h-[72px]' : 'h-[84px]'}`}>
        <Link to="/" className="group flex min-w-0 items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:gap-3" aria-label={copy.home}>
          <span className="grid h-10 w-10 shrink-0 place-items-center border border-venetian-gold/60 transition-colors group-hover:bg-venetian-gold group-hover:text-venetian-brown">
            <Logo className="text-venetian-gold group-hover:text-venetian-brown" size={24} />
          </span>
          <span className="min-w-0 leading-none">
            <span className="block truncate font-serif text-[1.08rem] font-semibold tracking-[0.01em] min-[360px]:text-[1.2rem] sm:text-[1.28rem]">Al Gobbo di Rialto</span>
            <span className="mt-1.5 hidden text-[0.57rem] font-bold uppercase tracking-[0.24em] text-venetian-sandstone/75 min-[360px]:block">Venezia · dal 1955</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-9 lg:flex" aria-label={copy.primaryNavigation}>
          {primaryNavItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                aria-current={active ? 'page' : undefined}
                className={`relative py-3 text-[0.7rem] font-bold uppercase tracking-[0.17em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-venetian-gold focus-visible:ring-offset-4 focus-visible:ring-offset-venetian-brown ${active ? 'text-venetian-gold' : 'text-white/80 hover:text-white'}`}
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
          <Link to="/book" className="ml-2 inline-flex min-h-11 items-center border border-venetian-gold bg-venetian-gold px-5 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-venetian-brown transition-colors hover:bg-transparent hover:text-venetian-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-venetian-brown">
            {t('nav.reserve')}
          </Link>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="grid h-11 w-11 shrink-0 place-items-center border border-white/25 text-white transition-colors hover:border-venetian-gold hover:text-venetian-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-venetian-gold focus-visible:ring-offset-4 focus-visible:ring-offset-venetian-brown lg:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={isMenuOpen ? copy.closeMenu : copy.openMenu}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen ? (
          <motion.div
            ref={mobileNavigationRef}
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label={copy.mobileNavigation}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden border-t border-white/10 bg-venetian-brown lg:hidden"
          >
            <nav className="scrollbar-hide mx-auto max-h-[calc(100dvh-72px)] max-w-[1480px] overflow-y-auto px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-4 sm:px-7" aria-label={copy.mobileNavigation}>
              <div className="divide-y divide-white/10 border-y border-white/10">
                {mobileNavItems.map((item, index) => {
                  const active = location.pathname === item.path;
                  return (
                    <motion.div key={item.path} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04 }}>
                      <Link
                        ref={index === 0 ? firstMobileLinkRef : undefined}
                        to={item.path}
                        aria-current={active ? 'page' : undefined}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex min-h-12 items-center justify-between py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-venetian-gold ${active ? 'text-venetian-gold' : 'text-white'}`}
                      >
                        {item.name}<span aria-hidden="true">↗</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <a href="tel:+390415204603" className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/25 px-2 text-xs font-bold uppercase tracking-[0.1em] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-venetian-gold"><Phone className="h-4 w-4" />{copy.call}</a>
                <Link to="/book" onClick={() => setIsMenuOpen(false)} className="inline-flex min-h-12 items-center justify-center bg-venetian-gold px-3 text-center text-xs font-bold uppercase tracking-[0.1em] text-venetian-brown focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">{t('nav.reserve')}</Link>
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
