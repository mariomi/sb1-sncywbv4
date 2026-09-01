import { Clock, MapPin, Navigation, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { SEOHead } from '../components/SEOHead';
import { useLanguage, type Language } from '../lib/i18n';

const directionsUrl = 'https://www.google.com/maps/dir/?api=1&destination=Al+Gobbo+di+Rialto,+San+Polo+649,+Venezia';

const copy: Record<Language, {
  seoTitle: string;
  seoDescription: string;
  kicker: string;
  title: string;
  intro: string;
  address: string;
  opening: string;
  openingValue: string;
  phone: string;
  directions: string;
  reserve: string;
  mapTitle: string;
}> = {
  it: {
    seoTitle: 'Dove siamo vicino a Rialto', seoDescription: 'Trova Al Gobbo di Rialto a San Polo 649, vicino al Ponte e al mercato di Rialto a Venezia.',
    kicker: 'San Polo · Venezia', title: 'Vieni a trovarci', intro: 'Siamo a San Polo 649, nel cuore del quartiere di Rialto. Apri le indicazioni prima di partire: tra calli e campielli, Venezia sa sempre sorprendere.',
    address: 'Indirizzo', opening: 'Apertura', openingValue: 'Pranzo e cena\nChiuso il martedì', phone: 'Telefono', directions: 'Apri indicazioni', reserve: 'Prenota un tavolo', mapTitle: 'Mappa di Al Gobbo di Rialto a Venezia',
  },
  en: {
    seoTitle: 'Find us near Rialto', seoDescription: 'Find Al Gobbo di Rialto at San Polo 649, near the Rialto Bridge and market in Venice.',
    kicker: 'San Polo · Venice', title: 'Find us', intro: 'We are at San Polo 649, in the historic Rialto district. Open directions before you start walking: Venice rewards curiosity, but its calli can be wonderfully confusing.',
    address: 'Address', opening: 'Opening', openingValue: 'Lunch and dinner\nClosed on Tuesday', phone: 'Phone', directions: 'Get directions', reserve: 'Book a table', mapTitle: 'Map of Al Gobbo di Rialto in Venice',
  },
  fr: {
    seoTitle: 'Nous trouver près du Rialto', seoDescription: 'Retrouvez Al Gobbo di Rialto à San Polo 649, près du pont et du marché du Rialto à Venise.',
    kicker: 'San Polo · Venise', title: 'Nous trouver', intro: 'Nous sommes à San Polo 649, au cœur du quartier historique du Rialto. Ouvrez l’itinéraire avant de partir : les ruelles de Venise aiment surprendre.',
    address: 'Adresse', opening: 'Horaires', openingValue: 'Déjeuner et dîner\nFermé le mardi', phone: 'Téléphone', directions: 'Ouvrir l’itinéraire', reserve: 'Réserver une table', mapTitle: 'Plan d’Al Gobbo di Rialto à Venise',
  },
  de: {
    seoTitle: 'Anfahrt nahe Rialto', seoDescription: 'Finden Sie Al Gobbo di Rialto in San Polo 649, nahe Rialtobrücke und Rialtomarkt in Venedig.',
    kicker: 'San Polo · Venedig', title: 'So finden Sie uns', intro: 'Sie finden uns in San Polo 649, im historischen Rialtoviertel. Öffnen Sie die Route vor dem Losgehen – Venedigs Gassen sind wunderschön, aber manchmal verwirrend.',
    address: 'Adresse', opening: 'Öffnungszeiten', openingValue: 'Mittag- und Abendessen\nDienstags geschlossen', phone: 'Telefon', directions: 'Route öffnen', reserve: 'Tisch reservieren', mapTitle: 'Karte von Al Gobbo di Rialto in Venedig',
  },
  es: {
    seoTitle: 'Cómo llegar desde Rialto', seoDescription: 'Encuentra Al Gobbo di Rialto en San Polo 649, cerca del puente y el mercado de Rialto en Venecia.',
    kicker: 'San Polo · Venecia', title: 'Cómo llegar', intro: 'Estamos en San Polo 649, en pleno barrio histórico de Rialto. Abre las indicaciones antes de salir: las calles de Venecia son preciosas y pueden sorprenderte.',
    address: 'Dirección', opening: 'Horario', openingValue: 'Comida y cena\nCerrado los martes', phone: 'Teléfono', directions: 'Abrir indicaciones', reserve: 'Reservar una mesa', mapTitle: 'Mapa de Al Gobbo di Rialto en Venecia',
  },
};

export function LocationPage() {
  const { language } = useLanguage();
  const text = copy[language];

  const details = [
    { icon: MapPin, title: text.address, content: <>San Polo 649<br />30125 Venezia, Italia</> },
    { icon: Clock, title: text.opening, content: <span className="whitespace-pre-line">{text.openingValue}</span> },
    { icon: Phone, title: text.phone, content: <a href="tel:+390415204603" className="underline decoration-white/30 underline-offset-4 hover:text-venetian-gold">+39 041 520 4603</a> },
  ];

  return (
    <PageTransition>
      <SEOHead title={text.seoTitle} canonical="/location" description={text.seoDescription} />
      <main className="min-h-screen bg-[#f7f3eb] pb-16 pt-[84px] dark:bg-venetian-brown sm:pb-24">
        <div className="mx-auto max-w-[1480px] border-x border-venetian-brown/15 px-4 py-10 dark:border-white/10 sm:px-10 sm:py-20 lg:px-16">
          <header className="mb-9 grid gap-5 border-t border-venetian-brown pt-6 dark:border-white sm:mb-12 sm:pt-7 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="editorial-kicker">{text.kicker}</p>
              <h1 className="mt-4 max-w-[11ch] font-serif text-5xl font-semibold leading-[0.86] tracking-[-0.04em] text-venetian-brown dark:text-white sm:mt-5 sm:text-8xl">{text.title}</h1>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-venetian-brown/70 dark:text-white/70 sm:text-base sm:leading-7 lg:justify-self-end">{text.intro}</p>
          </header>

          <div className="grid lg:grid-cols-[1.35fr_0.65fr]">
            <div className="order-2 min-h-[340px] overflow-hidden border border-venetian-brown/15 bg-white dark:border-white/15 sm:min-h-[440px] lg:order-1 lg:min-h-[520px]">
              <iframe title={text.mapTitle} src="https://www.google.com/maps?q=Al+Gobbo+di+Rialto,+San+Polo+649,+Venezia&output=embed" width="100%" height="100%" style={{ border: 0, minHeight: 'inherit' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>

            <aside className="order-1 bg-venetian-brown p-6 text-white dark:bg-[#21140f] sm:p-9 lg:order-2 lg:p-10">
              <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1 lg:gap-7">
                {details.map((detail) => <div key={detail.title} className="flex gap-3 sm:block lg:flex"><detail.icon className="h-6 w-6 shrink-0 text-venetian-gold sm:mb-3 lg:mb-0" /><div><h2 className="mb-1 font-semibold">{detail.title}</h2><div className="text-sm leading-6 text-white/75">{detail.content}</div></div></div>)}
              </div>
              <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:mt-9 lg:grid-cols-1">
                <a href={directionsUrl} target="_blank" rel="noopener noreferrer" data-track="click_directions" className="flex min-h-12 items-center justify-center gap-2 bg-venetian-gold px-5 text-center text-xs font-bold uppercase tracking-[0.12em] text-venetian-brown hover:bg-white"><Navigation className="h-4 w-4" />{text.directions}</a>
                <Link to="/book" className="flex min-h-12 items-center justify-center border border-white/30 px-5 text-center text-xs font-bold uppercase tracking-[0.12em] text-white hover:border-white hover:bg-white/10">{text.reserve}</Link>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
