import { ArrowUpRight, Instagram, MapPin, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage, type Language } from '../lib/i18n';
import { developerLegalIdentity, restaurantLegalIdentity } from '../lib/legal';
import { shouldPlayHomeIntro } from '../lib/homeIntro';

const footerCopy: Record<Language, { line: string; visit: string; explore: string; reserve: string; rights: string; faq: string; manage: string; navigation: string; home: string; privacy: string; legal: string; cookies: string; developedBy: string; since: string }> = {
  en: { line: 'Venetian cooking, warm hospitality and a hidden garden near Rialto.', visit: 'Visit', explore: 'Explore', reserve: 'Reserve your table', rights: 'All rights reserved', faq: 'FAQ', manage: 'My bookings', navigation: 'Footer navigation', home: 'Al Gobbo di Rialto, back to the home page', privacy: 'Privacy', legal: 'Legal notice', cookies: 'Cookie choices', developedBy: 'Website by', since: 'Venice · Since 1955' },
  it: { line: 'Cucina veneziana, ospitalità sincera e un giardino nascosto vicino a Rialto.', visit: 'Vieni a trovarci', explore: 'Esplora', reserve: 'Prenota il tuo tavolo', rights: 'Tutti i diritti riservati', faq: 'Domande frequenti', manage: 'Le mie prenotazioni', navigation: 'Navigazione a piè di pagina', home: 'Al Gobbo di Rialto, torna alla pagina iniziale', privacy: 'Privacy', legal: 'Note legali', cookies: 'Scelte cookie', developedBy: 'Sito realizzato da', since: 'Venezia · Dal 1955' },
  fr: { line: 'Cuisine vénitienne, accueil chaleureux et jardin caché près du Rialto.', visit: 'Nous trouver', explore: 'Explorer', reserve: 'Réserver une table', rights: 'Tous droits réservés', faq: 'Questions fréquentes', manage: 'Mes réservations', navigation: 'Navigation de pied de page', home: 'Al Gobbo di Rialto, retour à l’accueil', privacy: 'Confidentialité', legal: 'Mentions légales', cookies: 'Choix des cookies', developedBy: 'Site réalisé par', since: 'Venise · Depuis 1955' },
  de: { line: 'Venezianische Küche, herzliche Gastfreundschaft und ein versteckter Garten am Rialto.', visit: 'Besuchen', explore: 'Entdecken', reserve: 'Tisch reservieren', rights: 'Alle Rechte vorbehalten', faq: 'Häufige Fragen', manage: 'Meine Reservierungen', navigation: 'Fußnavigation', home: 'Al Gobbo di Rialto, zurück zur Startseite', privacy: 'Datenschutz', legal: 'Impressum', cookies: 'Cookie-Auswahl', developedBy: 'Website von', since: 'Venedig · Seit 1955' },
  es: { line: 'Cocina veneciana, cálida hospitalidad y un jardín escondido cerca de Rialto.', visit: 'Visítanos', explore: 'Explorar', reserve: 'Reservar mesa', rights: 'Todos los derechos reservados', faq: 'Preguntas frecuentes', manage: 'Mis reservas', navigation: 'Navegación del pie de página', home: 'Al Gobbo di Rialto, volver al inicio', privacy: 'Privacidad', legal: 'Aviso legal', cookies: 'Preferencias de cookies', developedBy: 'Sitio realizado por', since: 'Venecia · Desde 1955' },
};

export function SiteFooter() {
  const { pathname } = useLocation();
  const { language, t } = useLanguage();
  const copy = footerCopy[language];
  const [isHomeIntroActive, setIsHomeIntroActive] = useState(() => (
    typeof window !== 'undefined' && window.location.pathname === '/' && shouldPlayHomeIntro()
  ));

  useEffect(() => {
    const syncIntroVisibility = () => {
      const publishedState = document.documentElement.dataset.homeIntroActive;
      const isActive = pathname === '/'
        && (publishedState !== undefined ? publishedState === 'true' : shouldPlayHomeIntro());
      setIsHomeIntroActive(isActive);
    };
    const syncFrame = window.requestAnimationFrame(syncIntroVisibility);
    const handleIntroVisibility = (event: Event) => {
      const customEvent = event as CustomEvent<{ active: boolean }>;
      setIsHomeIntroActive(pathname === '/' && customEvent.detail.active);
    };
    window.addEventListener('al-gobbo:intro-visibility', handleIntroVisibility);
    return () => {
      window.cancelAnimationFrame(syncFrame);
      window.removeEventListener('al-gobbo:intro-visibility', handleIntroVisibility);
    };
  }, [pathname]);

  if ((pathname === '/' && isHomeIntroActive) || pathname.startsWith('/cancella/') || pathname.startsWith('/admin') || pathname === '/messages') return null;

  return (
    <footer className="overflow-hidden border-t border-white/10 bg-venetian-brown text-white">
      <div className="mx-auto max-w-[2000px] px-5 pb-7 pt-16 sm:px-8 sm:pb-8 sm:pt-24 lg:px-10">
        <Link to={pathname === '/' ? '/#home-standard-landing' : '/'} className="group block border-b border-white/15 pb-10" aria-label={copy.home}>
          <p className="font-mono text-[0.64rem] font-medium uppercase tracking-[0.18em] text-venetian-gold">{copy.since}</p>
          <p className="mt-7 font-serif text-[clamp(4.1rem,13.2vw,14rem)] font-black uppercase leading-[0.68] tracking-[-0.065em] text-venetian-sandstone transition-colors group-hover:text-white">Al Gobbo<br />di Rialto</p>
        </Link>

        <div className="grid gap-12 border-b border-white/15 py-12 md:grid-cols-[1.25fr_0.75fr_0.75fr] lg:py-16">
          <div>
            <p className="max-w-xl font-serif text-3xl font-black uppercase leading-[0.9] text-venetian-sandstone sm:text-4xl">{copy.line}</p>
            <Link to="/book" className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-venetian-sandstone px-6 font-mono text-[0.66rem] font-medium uppercase tracking-[0.12em] text-venetian-brown transition-colors hover:bg-venetian-gold">{copy.reserve}<ArrowUpRight className="h-4 w-4" /></Link>
          </div>
          <div>
            <h2 className="font-mono text-[0.62rem] font-medium uppercase tracking-[0.16em] text-white/45">{copy.explore}</h2>
            <nav className="mt-6 grid gap-3 font-serif text-2xl font-black uppercase leading-none text-white/75" aria-label={copy.navigation}><Link to="/menu" className="hover:text-venetian-gold">{t('nav.menu')}</Link><Link to="/our-story" className="hover:text-venetian-gold">{t('nav.about')}</Link><Link to="/gallery" className="hover:text-venetian-gold">{t('nav.gallery')}</Link><Link to="/contact" className="hover:text-venetian-gold">{t('nav.contact')}</Link><Link to="/faq" className="hover:text-venetian-gold">{copy.faq}</Link></nav>
          </div>
          <div>
            <h2 className="font-mono text-[0.62rem] font-medium uppercase tracking-[0.16em] text-white/45">{copy.visit}</h2>
            <div className="mt-6 grid gap-4 text-sm text-white/70"><a href="https://www.google.com/maps/dir/?api=1&destination=Al+Gobbo+di+Rialto,+San+Polo+649,+Venezia" target="_blank" rel="noopener noreferrer" className="flex min-h-11 gap-3 hover:text-white"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-venetian-gold" />San Polo 649<br />30125 Venezia</a><a href="tel:+390415204603" className="flex min-h-11 items-center gap-3 hover:text-white"><Phone className="h-4 w-4 text-venetian-gold" />+39 041 520 4603</a><a href="https://www.instagram.com/algobbodirialto/" target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-3 hover:text-white"><Instagram className="h-4 w-4 text-venetian-gold" />Instagram</a></div>
          </div>
        </div>

        <div className="flex flex-col gap-6 pt-6 font-mono text-[0.58rem] font-medium uppercase leading-5 tracking-[0.08em] text-white/45 lg:flex-row lg:items-end lg:justify-between">
          <div><p>© {new Date().getFullYear()} Al Gobbo di Rialto · {copy.rights}</p><p>{restaurantLegalIdentity.legalName} · P.IVA/C.F. IT{restaurantLegalIdentity.vatNumber} · {restaurantLegalIdentity.rea}</p><p>{copy.developedBy}{' '}<a href={developerLegalIdentity.website} target="_blank" rel="noopener noreferrer" className="text-white/70 underline decoration-white/30 underline-offset-4 hover:text-white">{developerLegalIdentity.brand} SRLS · P.IVA IT{developerLegalIdentity.vatNumber}</a></p></div>
          <div className="flex flex-wrap gap-x-5"><Link to="/privacy" className="min-h-11 py-3 hover:text-white">{copy.privacy}</Link><Link to="/legal" className="min-h-11 py-3 hover:text-white">{copy.legal}</Link><button type="button" onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))} className="min-h-11 py-3 text-left hover:text-white">{copy.cookies}</button><Link to="/my-reservations" className="min-h-11 py-3 hover:text-white">{copy.manage}</Link></div>
        </div>
      </div>
    </footer>
  );
}
