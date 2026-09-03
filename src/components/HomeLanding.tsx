import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Camera,
  HelpCircle,
  MapPin,
  MessageCircle,
  UtensilsCrossed,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '../Img/al-gobbo-2026/interior-hero-1600.webp';
import hero480 from '../Img/al-gobbo-2026/interior-hero-480.webp';
import hero900 from '../Img/al-gobbo-2026/interior-hero-900.webp';
import hero1200 from '../Img/al-gobbo-2026/interior-hero-1200.webp';
import { useLanguage, type Language } from '../lib/i18n';

const landingCopy: Record<Language, {
  imageAlt: string;
  exploreEyebrow: string;
  exploreTitle: string;
  exploreBody: string;
  navigation: string;
  faq: string;
  bookings: string;
}> = {
  it: {
    imageAlt: 'La sala interna del Ristorante Al Gobbo di Rialto a Venezia',
    exploreEyebrow: 'Tutto a portata di mano',
    exploreTitle: 'Scegli dove andare.',
    exploreBody: 'Menu, storia, fotografie e informazioni utili: ogni parte del ristorante è raggiungibile in un solo clic.',
    navigation: 'Esplora il sito',
    faq: 'Domande frequenti',
    bookings: 'Le mie prenotazioni',
  },
  en: {
    imageAlt: 'The dining room at Al Gobbo di Rialto restaurant in Venice',
    exploreEyebrow: 'Everything within reach',
    exploreTitle: 'Choose where to go.',
    exploreBody: 'Menu, story, photographs and useful information: every part of the restaurant is just one click away.',
    navigation: 'Explore the website',
    faq: 'Frequently asked questions',
    bookings: 'My bookings',
  },
  fr: {
    imageAlt: 'La salle du restaurant Al Gobbo di Rialto à Venise',
    exploreEyebrow: 'Tout à portée de main',
    exploreTitle: 'Choisissez où aller.',
    exploreBody: 'Menu, histoire, photographies et informations pratiques : tout le restaurant est accessible en un clic.',
    navigation: 'Explorer le site',
    faq: 'Questions fréquentes',
    bookings: 'Mes réservations',
  },
  de: {
    imageAlt: 'Der Gastraum des Restaurants Al Gobbo di Rialto in Venedig',
    exploreEyebrow: 'Alles direkt erreichbar',
    exploreTitle: 'Wählen Sie Ihr Ziel.',
    exploreBody: 'Speisekarte, Geschichte, Fotos und praktische Informationen: Alles ist nur einen Klick entfernt.',
    navigation: 'Website entdecken',
    faq: 'Häufige Fragen',
    bookings: 'Meine Reservierungen',
  },
  es: {
    imageAlt: 'El comedor del restaurante Al Gobbo di Rialto en Venecia',
    exploreEyebrow: 'Todo al alcance',
    exploreTitle: 'Elige adónde ir.',
    exploreBody: 'Carta, historia, fotografías e información útil: cada rincón del restaurante está a un solo clic.',
    navigation: 'Explorar el sitio',
    faq: 'Preguntas frecuentes',
    bookings: 'Mis reservas',
  },
};

export function HomeLanding({ headingId = 'home-title', reservationLinkId }: { headingId?: string; reservationLinkId?: string }) {
  const { language, t } = useLanguage();
  const copy = landingCopy[language];
  const heroSrcSet = `${hero480} 480w, ${hero900} 900w, ${hero1200} 1200w, ${heroImage} 1600w`;
  const quickLinks = [
    { label: t('nav.menu'), path: '/menu', Icon: UtensilsCrossed },
    { label: t('nav.about'), path: '/our-story', Icon: BookOpen },
    { label: t('nav.gallery'), path: '/gallery', Icon: Camera },
    { label: t('nav.location'), path: '/location', Icon: MapPin },
    { label: t('nav.contact'), path: '/contact', Icon: MessageCircle },
    { label: copy.faq, path: '/faq', Icon: HelpCircle },
    { label: copy.bookings, path: '/my-reservations', Icon: CalendarDays },
  ];

  return (
    <div id="home-standard-landing" className="bg-[#f6f1e8] text-venetian-brown dark:bg-[#17130f] dark:text-white">
      <section className="grid min-h-[100svh] scroll-mt-0 pt-[84px] lg:grid-cols-[0.94fr_1.06fr]" aria-labelledby={headingId}>
        <div className="flex items-center px-5 py-14 sm:px-9 sm:py-20 lg:px-12 xl:px-[7vw]">
          <div className="mx-auto w-full max-w-2xl lg:mx-0">
            <p className="text-[0.67rem] font-bold uppercase tracking-[0.24em] text-venetian-terracotta dark:text-venetian-gold sm:text-xs">
              {t('hero.tagline')}
            </p>
            <h1 id={headingId} className="mt-6 max-w-[10ch] whitespace-pre-line font-serif text-[clamp(3.2rem,11vw,7.8rem)] font-semibold leading-[0.82] tracking-[-0.055em] lg:text-[clamp(4.5rem,7.2vw,8rem)]">
              {t('hero.title')}
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-venetian-brown/75 dark:text-white/72 sm:text-lg sm:leading-8">
              {t('hero.subtitle')}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                id={reservationLinkId}
                to="/book"
                className="group inline-flex min-h-[56px] items-center gap-3 bg-venetian-terracotta px-6 text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-venetian-brown focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-venetian-terracotta focus-visible:ring-offset-4 focus-visible:ring-offset-[#f6f1e8] dark:bg-venetian-gold dark:text-venetian-brown dark:hover:bg-white dark:focus-visible:ring-venetian-gold dark:focus-visible:ring-offset-[#17130f]"
              >
                {t('hero.reserveButton')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/menu"
                className="group inline-flex min-h-11 items-center gap-2 border border-venetian-brown/30 px-4 text-[0.68rem] font-bold uppercase tracking-[0.14em] transition-colors hover:border-venetian-terracotta hover:text-venetian-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-venetian-terracotta focus-visible:ring-offset-4 focus-visible:ring-offset-[#f6f1e8] dark:border-white/35 dark:hover:border-venetian-gold dark:hover:text-venetian-gold dark:focus-visible:ring-venetian-gold dark:focus-visible:ring-offset-[#17130f]"
              >
                {t('hero.viewMenu')}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>

            <Link
              to="/our-story"
              className="mt-12 inline-flex min-h-11 items-center gap-3 text-[0.66rem] font-bold uppercase tracking-[0.18em] text-venetian-brown/60 transition-colors hover:text-venetian-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-venetian-terracotta dark:text-white/55 dark:hover:text-venetian-gold"
            >
              {t('hero.scrollHint')}
              <ArrowDownRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="relative min-h-[58svh] overflow-hidden lg:min-h-0">
          <img
            src={heroImage}
            srcSet={heroSrcSet}
            sizes="(min-width: 1024px) 53vw, 100vw"
            alt={copy.imageAlt}
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-black/15" />
          <div className="absolute inset-x-5 bottom-6 flex items-end justify-between border-t border-white/35 pt-4 text-white sm:inset-x-8 sm:bottom-8">
            <p className="text-[0.66rem] font-bold uppercase tracking-[0.2em]">San Polo 649</p>
            <p className="font-serif text-xl italic">Venezia</p>
          </div>
        </div>
      </section>

      <section id="home-site-navigation" className="bg-venetian-brown px-5 py-16 text-white sm:px-9 sm:py-24 lg:px-12" aria-labelledby="home-navigation-title">
        <div className="mx-auto max-w-[1480px]">
          <div className="grid gap-7 border-b border-white/15 pb-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <p className="text-[0.66rem] font-bold uppercase tracking-[0.24em] text-venetian-gold">{copy.exploreEyebrow}</p>
            <div>
              <h2 id="home-navigation-title" className="max-w-[13ch] font-serif text-[clamp(2.7rem,7vw,6.4rem)] font-semibold leading-[0.88] tracking-[-0.045em]">{copy.exploreTitle}</h2>
              <p className="mt-5 max-w-2xl text-sm leading-6 text-white/65 sm:text-base sm:leading-7">{copy.exploreBody}</p>
            </div>
          </div>

          <nav className="mt-8 grid border-l border-t border-white/15 sm:grid-cols-2 xl:grid-cols-4" aria-label={copy.navigation}>
            {quickLinks.map(({ label, path, Icon }, index) => (
              <Link
                key={path}
                to={path}
                className="group flex min-h-32 flex-col justify-between border-b border-r border-white/15 p-5 transition-colors hover:bg-white hover:text-venetian-brown focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-venetian-gold sm:min-h-40 sm:p-6"
              >
                <span className="flex items-start justify-between">
                  <Icon className="h-5 w-5 text-venetian-gold transition-colors group-hover:text-venetian-terracotta" />
                  <span className="text-[0.6rem] font-bold tracking-[0.18em] text-white/40 transition-colors group-hover:text-venetian-brown/50">{String(index + 1).padStart(2, '0')}</span>
                </span>
                <span className="flex items-end justify-between gap-4 font-serif text-2xl font-semibold leading-tight sm:text-3xl">
                  {label}
                  <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </div>
  );
}
