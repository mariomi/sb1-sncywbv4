import { Instagram, Menu, Phone, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { useLanguage, type Language } from '../lib/i18n';
import { shouldPlayHomeIntro } from '../lib/homeIntro';
import homePreview from '../Img/al-gobbo-2026/interior-hero-900.webp';
import menuPreview from '../Img/al-gobbo-2026/pasta-wide-1600.webp';
import storyPreview from '../Img/al-gobbo-2026/staff-wide-900.webp';
import locationPreview from '../Img/al-gobbo-2026/exterior-wide-900.webp';
import galleryPreview from '../Img/al-gobbo-2026/wine-wall-portrait-900.webp';
import contactPreview from '../Img/al-gobbo-2026/bar-wide-1600.webp';
import bookingPreview from '../Img/al-gobbo-2026/reserved-table-wide-900.webp';

const navbarCopy: Record<Language, {
  home: string;
  primaryNavigation: string;
  completeNavigation: string;
  openMenu: string;
  closeMenu: string;
  menu: string;
  homeLabel: string;
  call: string;
  faq: string;
  manage: string;
  address: string;
}> = {
  it: { home: 'Al Gobbo di Rialto, torna alla pagina iniziale', primaryNavigation: 'Navigazione principale', completeNavigation: 'Navigazione completa', openMenu: 'Apri il menu', closeMenu: 'Chiudi il menu', menu: 'Menu', homeLabel: 'Home', call: 'Chiamaci', faq: 'Domande frequenti', manage: 'Le mie prenotazioni', address: 'San Polo 649 · Venezia' },
  en: { home: 'Al Gobbo di Rialto, back to the home page', primaryNavigation: 'Main navigation', completeNavigation: 'Complete navigation', openMenu: 'Open menu', closeMenu: 'Close menu', menu: 'Menu', homeLabel: 'Home', call: 'Call us', faq: 'Frequently asked questions', manage: 'My bookings', address: 'San Polo 649 · Venice' },
  fr: { home: 'Al Gobbo di Rialto, retour à l’accueil', primaryNavigation: 'Navigation principale', completeNavigation: 'Navigation complète', openMenu: 'Ouvrir le menu', closeMenu: 'Fermer le menu', menu: 'Menu', homeLabel: 'Accueil', call: 'Appelez-nous', faq: 'Questions fréquentes', manage: 'Mes réservations', address: 'San Polo 649 · Venise' },
  de: { home: 'Al Gobbo di Rialto, zurück zur Startseite', primaryNavigation: 'Hauptnavigation', completeNavigation: 'Vollständige Navigation', openMenu: 'Menü öffnen', closeMenu: 'Menü schließen', menu: 'Menü', homeLabel: 'Startseite', call: 'Anrufen', faq: 'Häufige Fragen', manage: 'Meine Reservierungen', address: 'San Polo 649 · Venedig' },
  es: { home: 'Al Gobbo di Rialto, volver al inicio', primaryNavigation: 'Navegación principal', completeNavigation: 'Navegación completa', openMenu: 'Abrir el menú', closeMenu: 'Cerrar el menú', menu: 'Menú', homeLabel: 'Inicio', call: 'Llámanos', faq: 'Preguntas frecuentes', manage: 'Mis reservas', address: 'San Polo 649 · Venecia' },
};

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [previewImage, setPreviewImage] = useState(homePreview);
  const isScrolledRef = useRef(false);
  const [isHomeIntroActive, setIsHomeIntroActive] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.location.pathname === '/' && shouldPlayHomeIntro();
  });
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);
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
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    const syncIntroVisibility = () => {
      const publishedState = document.documentElement.dataset.homeIntroActive;
      const isActive = location.pathname === '/'
        && (publishedState !== undefined ? publishedState === 'true' : shouldPlayHomeIntro());
      setIsHomeIntroActive(isActive);
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
    setPreviewImage(homePreview);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    const mainContent = document.getElementById('main-content');
    const footer = document.querySelector<HTMLElement>('footer');
    const mainWasInert = mainContent?.inert ?? false;
    const footerWasInert = footer?.inert ?? false;
    document.body.style.overflow = 'hidden';
    if (mainContent) mainContent.inert = true;
    if (footer) footer.inert = true;
    const focusTimer = window.setTimeout(() => firstMenuLinkRef.current?.focus(), 220);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        window.requestAnimationFrame(() => menuButtonRef.current?.focus());
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = Array.from(navigationRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? []);
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
      if (mainContent) mainContent.inert = mainWasInert;
      if (footer) footer.inert = footerWasInert;
    };
  }, [isMenuOpen]);

  const homePath = location.pathname === '/' ? '/#home-standard-landing' : '/';
  const primaryNavItems = [
    { name: t('nav.menu'), path: '/menu' },
    { name: t('nav.about'), path: '/our-story' },
    { name: t('nav.location'), path: '/location' },
  ];
  const completeNavItems = [
    { name: copy.homeLabel, path: homePath, image: homePreview },
    { name: t('nav.menu'), path: '/menu', image: menuPreview },
    { name: t('nav.about'), path: '/our-story', image: storyPreview },
    { name: t('nav.gallery'), path: '/gallery', image: galleryPreview },
    { name: t('nav.location'), path: '/location', image: locationPreview },
    { name: t('nav.contact'), path: '/contact', image: contactPreview },
    { name: copy.faq, path: '/faq', image: homePreview },
    { name: copy.manage, path: '/my-reservations', image: bookingPreview },
  ];

  if (isHomeIntroActive) return null;

  const transparentHomeHeader = location.pathname === '/' && !isScrolled && !isMenuOpen;

  return (
    <header className="fixed inset-x-0 top-0 z-50 text-white">
      <div className={`relative z-20 border-b transition-colors duration-500 ${transparentHomeHeader ? 'border-white/15 bg-transparent' : 'border-white/10 bg-venetian-brown/95 backdrop-blur-xl'}`}>
        <div className={`mx-auto flex max-w-[2000px] items-center justify-between px-4 transition-[height] duration-300 sm:px-7 lg:px-10 ${isScrolled ? 'h-[72px]' : 'h-[84px]'}`}>
          <Link to={homePath} className="group flex min-w-0 items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" aria-label={copy.home}>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/45 transition-colors group-hover:border-venetian-gold group-hover:bg-venetian-gold group-hover:text-venetian-brown"><Logo className="text-current" size={23} /></span>
            <span className="min-w-0 leading-none">
              <span className="block truncate font-serif text-[1.14rem] font-black uppercase tracking-[-0.02em] sm:text-[1.28rem]">Al Gobbo di Rialto</span>
              <span className="mt-1.5 hidden font-mono text-[0.54rem] font-medium uppercase tracking-[0.18em] text-white/65 min-[390px]:block">Venezia · dal 1955</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 2xl:flex" aria-label={copy.primaryNavigation}>
            {primaryNavItems.map((item) => {
              const active = location.pathname === item.path;
              return <Link key={item.path} to={item.path} aria-current={active ? 'page' : undefined} className={`relative py-3 font-mono text-[0.66rem] font-medium uppercase tracking-[0.14em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-venetian-gold ${active ? 'text-venetian-gold' : 'text-white/75 hover:text-white'}`}>{item.name}</Link>;
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/book" className="hidden min-h-11 items-center rounded-full bg-venetian-sandstone px-5 font-mono text-[0.63rem] font-medium uppercase tracking-[0.12em] text-venetian-brown transition-colors hover:bg-venetian-gold lg:inline-flex">{t('nav.reserve')}</Link>
            <button ref={menuButtonRef} type="button" onClick={() => setIsMenuOpen((open) => !open)} className="inline-flex h-11 items-center justify-center gap-2.5 rounded-full border border-white/35 bg-black/10 px-3 text-white backdrop-blur-sm transition-colors hover:border-venetian-gold hover:text-venetian-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-venetian-gold sm:px-4" aria-expanded={isMenuOpen} aria-controls="site-navigation" aria-label={isMenuOpen ? copy.closeMenu : copy.openMenu}>
              <span className="font-mono text-[0.62rem] font-medium uppercase tracking-[0.12em]">{isMenuOpen ? copy.closeMenu : copy.menu}</span>
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen ? (
          <motion.div ref={navigationRef} id="site-navigation" role="dialog" aria-modal="true" aria-label={copy.completeNavigation} initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.7, ease: [0.77, 0, 0.18, 1] }} className="fixed inset-0 z-10 overflow-y-auto bg-[#615558] pt-[84px]">
            <div className="grid min-h-[calc(100dvh-84px)] lg:grid-cols-[1.15fr_0.85fr]">
              <nav className="flex flex-col justify-between px-5 py-8 sm:px-8 lg:px-10 lg:py-10" aria-label={copy.completeNavigation}>
                <div>
                  {completeNavItems.map((item, index) => {
                    const active = location.pathname === item.path;
                    return (
                      <motion.div key={item.path} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + index * 0.045, duration: 0.45 }} className="border-b border-white/15">
                        <Link ref={index === 0 ? firstMenuLinkRef : undefined} to={item.path} aria-current={active ? 'page' : undefined} onMouseEnter={() => setPreviewImage(item.image)} onFocus={() => setPreviewImage(item.image)} onClick={() => setIsMenuOpen(false)} className={`group flex items-end justify-between gap-5 py-3 font-serif text-[clamp(2.35rem,6.5vw,6.5rem)] font-black uppercase leading-[0.78] tracking-[-0.045em] transition-colors sm:py-4 ${active ? 'text-venetian-gold' : 'text-white hover:text-venetian-sandstone/65'}`}>
                          <span><span className="mr-3 align-top font-mono text-[0.55rem] font-medium tracking-[0.12em] text-white/35 sm:text-[0.62rem]">{String(index + 1).padStart(2, '0')}</span>{item.name}</span>
                          <span aria-hidden="true" className="mb-1 font-sans text-xl font-normal transition-transform group-hover:-translate-y-1 group-hover:translate-x-1">↗</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="mt-8 flex flex-wrap items-center justify-between gap-5 border-t border-white/15 pt-5 font-mono text-[0.62rem] font-medium uppercase tracking-[0.12em] text-white/65">
                  <span>{copy.address}</span>
                  <div className="flex items-center gap-4"><a href="tel:+390415204603" className="inline-flex min-h-11 items-center gap-2 hover:text-white"><Phone className="h-3.5 w-3.5" />{copy.call}</a><a href="https://www.instagram.com/algobbodirialto/" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 hover:text-white"><Instagram className="h-3.5 w-3.5" />Instagram</a></div>
                </div>
              </nav>

              <div className="relative hidden overflow-hidden border-l border-white/15 p-5 lg:block">
                <AnimatePresence mode="wait">
                  <motion.img key={previewImage} src={previewImage} alt="" initial={{ opacity: 0, scale: 1.08, rotate: 1.5 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.45 }} className="h-full min-h-[calc(100dvh-124px)] w-full rounded-[0.35rem] object-cover" />
                </AnimatePresence>
                <div className="absolute inset-x-10 bottom-10 flex items-center justify-between border-t border-white/45 pt-4 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-white/75"><span>Al Gobbo di Rialto</span><span>Venezia</span></div>
              </div>
            </div>

            <div className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full bg-venetian-brown/80 p-1.5 backdrop-blur sm:bottom-7 sm:right-7"><LanguageSwitcher /><ThemeToggle /></div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
