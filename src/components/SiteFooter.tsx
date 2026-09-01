import { ArrowUpRight, Instagram, MapPin, Phone } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { useLanguage, type Language } from '../lib/i18n';

const footerCopy: Record<Language, { line: string; visit: string; explore: string; reserve: string; rights: string }> = {
  en: { line: 'Venetian cooking, warm hospitality and a hidden garden near Rialto.', visit: 'Visit', explore: 'Explore', reserve: 'Reserve your table', rights: 'All rights reserved' },
  it: { line: 'Cucina veneziana, ospitalità sincera e un giardino nascosto vicino a Rialto.', visit: 'Vieni a trovarci', explore: 'Esplora', reserve: 'Prenota il tuo tavolo', rights: 'Tutti i diritti riservati' },
  fr: { line: 'Cuisine vénitienne, accueil chaleureux et jardin caché près du Rialto.', visit: 'Nous trouver', explore: 'Explorer', reserve: 'Réserver une table', rights: 'Tous droits réservés' },
  de: { line: 'Venezianische Küche, herzliche Gastfreundschaft und ein versteckter Garten am Rialto.', visit: 'Besuchen', explore: 'Entdecken', reserve: 'Tisch reservieren', rights: 'Alle Rechte vorbehalten' },
  es: { line: 'Cocina veneciana, cálida hospitalidad y un jardín escondido cerca de Rialto.', visit: 'Visítanos', explore: 'Explorar', reserve: 'Reservar mesa', rights: 'Todos los derechos reservados' },
};

export function SiteFooter() {
  const { pathname } = useLocation();
  const { language, t } = useLanguage();
  const copy = footerCopy[language];

  if (pathname.startsWith('/admin') || pathname === '/messages') return null;

  return (
    <footer className="border-t border-white/10 bg-[#11100e] text-white">
      <div className="mx-auto max-w-[1480px] px-4 py-14 sm:px-7 sm:py-20 lg:px-10">
        <div className="grid gap-12 border-b border-white/12 pb-12 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-3" aria-label="Al Gobbo di Rialto home"><span className="grid h-11 w-11 place-items-center border border-venetian-gold/55"><Logo className="text-venetian-gold" size={25} /></span><span className="font-serif text-2xl font-semibold">Al Gobbo di Rialto</span></Link>
            <p className="mt-6 max-w-md text-sm leading-6 text-white/52">{copy.line}</p>
            <Link to="/book" className="mt-7 inline-flex items-center gap-3 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-venetian-gold hover:gap-5">{copy.reserve}<ArrowUpRight className="h-4 w-4" /></Link>
          </div>
          <div>
            <h2 className="text-[0.64rem] font-bold uppercase tracking-[0.2em] text-white/38">{copy.explore}</h2>
            <nav className="mt-5 grid gap-3 text-sm text-white/70" aria-label="Footer navigation"><Link to="/menu" className="hover:text-white">{t('nav.menu')}</Link><Link to="/our-story" className="hover:text-white">{t('nav.about')}</Link><Link to="/gallery" className="hover:text-white">{t('nav.gallery')}</Link><Link to="/faq" className="hover:text-white">FAQ</Link></nav>
          </div>
          <div>
            <h2 className="text-[0.64rem] font-bold uppercase tracking-[0.2em] text-white/38">{copy.visit}</h2>
            <div className="mt-5 grid gap-4 text-sm text-white/70"><a href="https://www.google.com/maps/dir/?api=1&destination=Al+Gobbo+di+Rialto,+San+Polo+649,+Venezia" target="_blank" rel="noopener noreferrer" className="flex gap-3 hover:text-white"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-venetian-gold" />San Polo 649<br />30125 Venezia</a><a href="tel:+390415204603" className="flex items-center gap-3 hover:text-white"><Phone className="h-4 w-4 text-venetian-gold" />+39 041 520 4603</a><a href="https://www.instagram.com/algobbodirialto/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white"><Instagram className="h-4 w-4 text-venetian-gold" />Instagram</a></div>
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-6 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-white/32 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} Al Gobbo di Rialto · {copy.rights}</p><div className="flex gap-5"><Link to="/privacy" className="hover:text-white">Privacy</Link><Link to="/my-reservations" className="hover:text-white">Booking</Link></div></div>
      </div>
    </footer>
  );
}
