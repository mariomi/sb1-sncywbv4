import { ArrowUpRight, Instagram, MapPin, Phone } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { useLanguage, type Language } from '../lib/i18n';
import { developerLegalIdentity, restaurantLegalIdentity } from '../lib/legal';

const footerCopy: Record<Language, { line: string; visit: string; explore: string; reserve: string; rights: string; faq: string; manage: string; navigation: string; home: string; privacy: string; legal: string; cookies: string; developedBy: string }> = {
  en: { line: 'Venetian cooking, warm hospitality and a hidden garden near Rialto.', visit: 'Visit', explore: 'Explore', reserve: 'Reserve your table', rights: 'All rights reserved', faq: 'FAQ', manage: 'My bookings', navigation: 'Footer navigation', home: 'Al Gobbo di Rialto, back to the home page', privacy: 'Privacy', legal: 'Legal notice', cookies: 'Cookie choices', developedBy: 'Website by' },
  it: { line: 'Cucina veneziana, ospitalità sincera e un giardino nascosto vicino a Rialto.', visit: 'Vieni a trovarci', explore: 'Esplora', reserve: 'Prenota il tuo tavolo', rights: 'Tutti i diritti riservati', faq: 'Domande frequenti', manage: 'Le mie prenotazioni', navigation: 'Navigazione a piè di pagina', home: 'Al Gobbo di Rialto, torna alla pagina iniziale', privacy: 'Privacy', legal: 'Note legali', cookies: 'Scelte cookie', developedBy: 'Sito realizzato da' },
  fr: { line: 'Cuisine vénitienne, accueil chaleureux et jardin caché près du Rialto.', visit: 'Nous trouver', explore: 'Explorer', reserve: 'Réserver une table', rights: 'Tous droits réservés', faq: 'Questions fréquentes', manage: 'Mes réservations', navigation: 'Navigation de pied de page', home: 'Al Gobbo di Rialto, retour à l’accueil', privacy: 'Confidentialité', legal: 'Mentions légales', cookies: 'Choix des cookies', developedBy: 'Site réalisé par' },
  de: { line: 'Venezianische Küche, herzliche Gastfreundschaft und ein versteckter Garten am Rialto.', visit: 'Besuchen', explore: 'Entdecken', reserve: 'Tisch reservieren', rights: 'Alle Rechte vorbehalten', faq: 'Häufige Fragen', manage: 'Meine Reservierungen', navigation: 'Fußnavigation', home: 'Al Gobbo di Rialto, zurück zur Startseite', privacy: 'Datenschutz', legal: 'Impressum', cookies: 'Cookie-Auswahl', developedBy: 'Website von' },
  es: { line: 'Cocina veneciana, cálida hospitalidad y un jardín escondido cerca de Rialto.', visit: 'Visítanos', explore: 'Explorar', reserve: 'Reservar mesa', rights: 'Todos los derechos reservados', faq: 'Preguntas frecuentes', manage: 'Mis reservas', navigation: 'Navegación del pie de página', home: 'Al Gobbo di Rialto, volver al inicio', privacy: 'Privacidad', legal: 'Aviso legal', cookies: 'Preferencias de cookies', developedBy: 'Sitio realizado por' },
};

export function SiteFooter() {
  const { pathname } = useLocation();
  const { language, t } = useLanguage();
  const copy = footerCopy[language];

  if (pathname === '/' || pathname.startsWith('/cancella/') || pathname.startsWith('/admin') || pathname === '/messages') return null;

  return (
    <footer className="border-t border-white/10 bg-[#11100e] text-white">
      <div className="mx-auto max-w-[1480px] px-4 py-14 sm:px-7 sm:py-20 lg:px-10">
        <div className="grid gap-12 border-b border-white/10 pb-12 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-3" aria-label={copy.home}><span className="grid h-11 w-11 place-items-center border border-venetian-gold/60"><Logo className="text-venetian-gold" size={25} /></span><span className="font-serif text-2xl font-semibold">Al Gobbo di Rialto</span></Link>
            <p className="mt-6 max-w-md text-sm leading-6 text-white/70">{copy.line}</p>
            <Link to="/book" className="mt-7 inline-flex min-h-11 items-center gap-3 text-xs font-bold uppercase tracking-[0.14em] text-venetian-gold hover:gap-5">{copy.reserve}<ArrowUpRight className="h-4 w-4" /></Link>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">{copy.explore}</h2>
            <nav className="mt-5 grid gap-3 text-sm text-white/75" aria-label={copy.navigation}><Link to="/menu" className="hover:text-white">{t('nav.menu')}</Link><Link to="/our-story" className="hover:text-white">{t('nav.about')}</Link><Link to="/gallery" className="hover:text-white">{t('nav.gallery')}</Link><Link to="/contact" className="hover:text-white">{t('nav.contact')}</Link><Link to="/faq" className="hover:text-white">{copy.faq}</Link></nav>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">{copy.visit}</h2>
            <div className="mt-5 grid gap-4 text-sm text-white/75"><a href="https://www.google.com/maps/dir/?api=1&destination=Al+Gobbo+di+Rialto,+San+Polo+649,+Venezia" target="_blank" rel="noopener noreferrer" className="flex min-h-11 gap-3 hover:text-white"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-venetian-gold" />San Polo 649<br />30125 Venezia</a><a href="tel:+390415204603" className="flex min-h-11 items-center gap-3 hover:text-white"><Phone className="h-4 w-4 text-venetian-gold" />+39 041 520 4603</a><a href="https://www.instagram.com/algobbodirialto/" target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-3 hover:text-white"><Instagram className="h-4 w-4 text-venetian-gold" />Instagram</a></div>
          </div>
        </div>
        <div className="flex flex-col gap-5 pt-6 text-xs text-white/60 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1 leading-5">
            <p className="font-semibold uppercase tracking-[0.12em]">© {new Date().getFullYear()} Al Gobbo di Rialto · {copy.rights}</p>
            <p>{restaurantLegalIdentity.legalName} · P.IVA/C.F. IT{restaurantLegalIdentity.vatNumber} · {restaurantLegalIdentity.rea}</p>
            <p>{copy.developedBy}{' '}<a href={developerLegalIdentity.website} target="_blank" rel="noopener noreferrer" className="font-semibold text-white/80 underline decoration-white/30 underline-offset-4 hover:text-white">{developerLegalIdentity.brand} SRLS · P.IVA IT{developerLegalIdentity.vatNumber}</a></p>
          </div>
          <div className="flex flex-wrap gap-x-5 font-semibold uppercase tracking-[0.1em]">
            <Link to="/privacy" className="min-h-11 py-3 hover:text-white">{copy.privacy}</Link>
            <Link to="/legal" className="min-h-11 py-3 hover:text-white">{copy.legal}</Link>
            <button type="button" onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))} className="min-h-11 py-3 text-left hover:text-white">{copy.cookies}</button>
            <Link to="/my-reservations" className="min-h-11 py-3 hover:text-white">{copy.manage}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
