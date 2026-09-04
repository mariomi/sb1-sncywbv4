import {
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
import exteriorImage from '../Img/al-gobbo-2026/exterior-wide-1600.webp';
import roomImage from '../Img/al-gobbo-2026/entrance-portrait-900.webp';
import tableImage from '../Img/al-gobbo-2026/table-portrait-900.webp';
import wineImage from '../Img/al-gobbo-2026/wine-wall-portrait-900.webp';
import staffImage from '../Img/al-gobbo-2026/staff-wide-1600.webp';
import pastaImage from '../Img/al-gobbo-2026/pasta-wide-1600.webp';
import fishImage from '../Img/al-gobbo-2026/fish-wide-1600.webp';
import risottoImage from '../Img/al-gobbo-2026/risotto-wide-1600.webp';
import reservedTableImage from '../Img/al-gobbo-2026/reserved-table-wide-1600.webp';
import { useLanguage, type Language } from '../lib/i18n';

type LandingCopy = {
  imageAlt: string;
  heroKicker: string;
  since: string;
  place: string;
  statement: string;
  statementLeft: string;
  statementRight: string;
  menuKicker: string;
  menuTitle: string;
  menuBody: string;
  dishes: string[];
  storyKicker: string;
  storyTitle: string;
  storyBody: string;
  exploreEyebrow: string;
  exploreTitle: string;
  exploreBody: string;
  navigation: string;
  faq: string;
  bookings: string;
  reserveKicker: string;
  reserveTitle: string;
  reserveBody: string;
};

const landingCopy: Record<Language, LandingCopy> = {
  it: {
    imageAlt: 'La sala interna del Ristorante Al Gobbo di Rialto a Venezia', heroKicker: 'Cucina veneziana · San Polo', since: 'Dal 1955', place: 'Venezia, Italia',
    statement: 'Una tavola veneziana fatta di materia, luce e ospitalità. A due passi da Rialto, con un giardino che si lascia scoprire.', statementLeft: 'Cucina di laguna', statementRight: 'Ospitalità sincera',
    menuKicker: 'Dalla cucina', menuTitle: 'Venezia, servita senza scorciatoie.', menuBody: 'Pesce della laguna, paste, risotti e ricette di casa: ingredienti riconoscibili, cotture precise, memoria veneziana.', dishes: ['Pasta fatta in casa', 'Pesce della laguna', 'Risotti veneziani'],
    storyKicker: 'La nostra storia', storyTitle: 'Dal mercato di Rialto alla tavola, dal 1955.', storyBody: 'Un ristorante di famiglia nel cuore di San Polo. La sala, il banco, il giardino e le persone raccontano una Venezia quotidiana, autentica e generosa.',
    exploreEyebrow: 'Tutto a portata di mano', exploreTitle: 'Scegli dove andare.', exploreBody: 'Menu, storia, fotografie e informazioni utili: ogni parte del ristorante è raggiungibile in un solo clic.', navigation: 'Esplora il sito', faq: 'Domande frequenti', bookings: 'Le mie prenotazioni',
    reserveKicker: 'Il prossimo momento è tuo', reserveTitle: 'Il tuo tavolo, a Venezia.', reserveBody: 'Scegli il giorno e l’orario. Noi prepariamo il resto.',
  },
  en: {
    imageAlt: 'The dining room at Al Gobbo di Rialto restaurant in Venice', heroKicker: 'Venetian cuisine · San Polo', since: 'Since 1955', place: 'Venice, Italy',
    statement: 'A Venetian table shaped by materials, light and hospitality. Steps from Rialto, with a hidden garden waiting to be found.', statementLeft: 'Lagoon cuisine', statementRight: 'Warm hospitality',
    menuKicker: 'From the kitchen', menuTitle: 'Venice, served without shortcuts.', menuBody: 'Lagoon fish, handmade pasta, risotto and family recipes: honest ingredients, precise cooking, Venetian memory.', dishes: ['Handmade pasta', 'Fish from the lagoon', 'Venetian risotto'],
    storyKicker: 'Our story', storyTitle: 'From Rialto market to the table, since 1955.', storyBody: 'A family restaurant in the heart of San Polo. The dining room, counter, garden and people tell the story of an everyday Venice: authentic and generous.',
    exploreEyebrow: 'Everything within reach', exploreTitle: 'Choose where to go.', exploreBody: 'Menu, story, photographs and useful information: every part of the restaurant is just one click away.', navigation: 'Explore the website', faq: 'Frequently asked questions', bookings: 'My bookings',
    reserveKicker: 'The next moment is yours', reserveTitle: 'Your table, in Venice.', reserveBody: 'Choose a day and time. We will prepare the rest.',
  },
  fr: {
    imageAlt: 'La salle du restaurant Al Gobbo di Rialto à Venise', heroKicker: 'Cuisine vénitienne · San Polo', since: 'Depuis 1955', place: 'Venise, Italie',
    statement: 'Une table vénitienne faite de matière, de lumière et d’hospitalité. À deux pas du Rialto, avec un jardin caché à découvrir.', statementLeft: 'Cuisine de la lagune', statementRight: 'Accueil sincère',
    menuKicker: 'Depuis la cuisine', menuTitle: 'Venise, servie sans raccourcis.', menuBody: 'Poissons de la lagune, pâtes, risottos et recettes familiales : produits lisibles, cuissons précises, mémoire vénitienne.', dishes: ['Pâtes maison', 'Poissons de la lagune', 'Risottos vénitiens'],
    storyKicker: 'Notre histoire', storyTitle: 'Du marché du Rialto à la table, depuis 1955.', storyBody: 'Un restaurant familial au cœur de San Polo. La salle, le comptoir, le jardin et les personnes racontent une Venise quotidienne, authentique et généreuse.',
    exploreEyebrow: 'Tout à portée de main', exploreTitle: 'Choisissez où aller.', exploreBody: 'Menu, histoire, photographies et informations pratiques : tout le restaurant est accessible en un clic.', navigation: 'Explorer le site', faq: 'Questions fréquentes', bookings: 'Mes réservations',
    reserveKicker: 'Le prochain moment est à vous', reserveTitle: 'Votre table, à Venise.', reserveBody: 'Choisissez le jour et l’heure. Nous préparons le reste.',
  },
  de: {
    imageAlt: 'Der Gastraum des Restaurants Al Gobbo di Rialto in Venedig', heroKicker: 'Venezianische Küche · San Polo', since: 'Seit 1955', place: 'Venedig, Italien',
    statement: 'Ein venezianischer Tisch, geprägt von Material, Licht und Gastfreundschaft. Nahe Rialto, mit einem verborgenen Garten.', statementLeft: 'Lagunen-Küche', statementRight: 'Herzliche Gastlichkeit',
    menuKicker: 'Aus der Küche', menuTitle: 'Venedig, ohne Umwege serviert.', menuBody: 'Lagunenfisch, hausgemachte Pasta, Risotti und Familienrezepte: ehrliche Zutaten, präzise Küche, venezianische Erinnerung.', dishes: ['Hausgemachte Pasta', 'Fisch aus der Lagune', 'Venezianische Risotti'],
    storyKicker: 'Unsere Geschichte', storyTitle: 'Vom Rialto-Markt auf den Tisch, seit 1955.', storyBody: 'Ein Familienrestaurant im Herzen von San Polo. Gastraum, Theke, Garten und Menschen erzählen von einem authentischen, großzügigen Venedig.',
    exploreEyebrow: 'Alles direkt erreichbar', exploreTitle: 'Wählen Sie Ihr Ziel.', exploreBody: 'Speisekarte, Geschichte, Fotos und praktische Informationen: Alles ist nur einen Klick entfernt.', navigation: 'Website entdecken', faq: 'Häufige Fragen', bookings: 'Meine Reservierungen',
    reserveKicker: 'Der nächste Moment gehört Ihnen', reserveTitle: 'Ihr Tisch, in Venedig.', reserveBody: 'Wählen Sie Tag und Uhrzeit. Wir bereiten den Rest vor.',
  },
  es: {
    imageAlt: 'El comedor del restaurante Al Gobbo di Rialto en Venecia', heroKicker: 'Cocina veneciana · San Polo', since: 'Desde 1955', place: 'Venecia, Italia',
    statement: 'Una mesa veneciana hecha de materia, luz y hospitalidad. A un paso de Rialto, con un jardín escondido por descubrir.', statementLeft: 'Cocina de laguna', statementRight: 'Hospitalidad sincera',
    menuKicker: 'Desde la cocina', menuTitle: 'Venecia, servida sin atajos.', menuBody: 'Pescado de la laguna, pasta, risottos y recetas familiares: ingredientes honestos, cocción precisa, memoria veneciana.', dishes: ['Pasta casera', 'Pescado de la laguna', 'Risottos venecianos'],
    storyKicker: 'Nuestra historia', storyTitle: 'Del mercado de Rialto a la mesa, desde 1955.', storyBody: 'Un restaurante familiar en el corazón de San Polo. La sala, la barra, el jardín y las personas cuentan una Venecia cotidiana, auténtica y generosa.',
    exploreEyebrow: 'Todo al alcance', exploreTitle: 'Elige adónde ir.', exploreBody: 'Carta, historia, fotografías e información útil: cada rincón del restaurante está a un solo clic.', navigation: 'Explorar el sitio', faq: 'Preguntas frecuentes', bookings: 'Mis reservas',
    reserveKicker: 'El próximo momento es tuyo', reserveTitle: 'Tu mesa, en Venecia.', reserveBody: 'Elige el día y la hora. Nosotros preparamos el resto.',
  },
};

const dishImages = [pastaImage, fishImage, risottoImage];

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
    <div id="home-standard-landing" className="overflow-hidden bg-venetian-brown text-venetian-sandstone">
      <section className="relative min-h-[100svh] overflow-hidden" aria-labelledby={headingId}>
        <img src={heroImage} srcSet={heroSrcSet} sizes="100vw" alt={copy.imageAlt} className="absolute inset-0 h-full w-full object-cover" loading="eager" decoding="async" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,20,21,0.2),rgba(23,20,21,0.18)_42%,rgba(23,20,21,0.78))]" />
        <div className="relative z-10 flex min-h-[100svh] flex-col justify-between px-5 pb-7 pt-28 sm:px-8 sm:pb-8 lg:px-10 lg:pb-10 lg:pt-32">
          <div className="flex items-start justify-between gap-6 font-mono text-[0.62rem] font-medium uppercase tracking-[0.14em] text-white/80 sm:text-[0.7rem]">
            <p>{copy.heroKicker}</p>
            <Link to="/book" className="hidden items-center gap-2 border-b border-white/60 pb-1 transition-colors hover:border-venetian-gold hover:text-venetian-gold sm:inline-flex">{t('hero.reserveButton')}<ArrowUpRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="mx-auto w-full max-w-[1900px] text-center">
            <h1 id={headingId} className="font-serif text-[clamp(4.4rem,15.2vw,17rem)] font-black uppercase leading-[0.7] tracking-[-0.065em] text-[#e7e3d6] drop-shadow-[0_12px_45px_rgba(0,0,0,0.28)]">
              Al Gobbo<br />di Rialto
            </h1>
          </div>
          <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-4 border-t border-white/35 pt-5 font-mono text-[0.62rem] font-medium uppercase tracking-[0.14em] text-white/85 sm:text-[0.7rem]">
            <p>{copy.since}</p>
            <Link id={reservationLinkId} to="/book" className="inline-flex min-h-12 items-center gap-3 rounded-full bg-venetian-sandstone px-5 text-venetian-brown transition-colors hover:bg-venetian-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:hidden">{t('hero.reserveButton')}<ArrowRight className="h-4 w-4" /></Link>
            <p className="text-right">{copy.place}</p>
          </div>
        </div>
      </section>

      <section className="relative min-h-[155svh] bg-venetian-brown" aria-labelledby="home-statement-title">
        <div className="sticky top-0 flex min-h-[100svh] items-center justify-center px-5 py-24 text-center sm:px-10">
          <h2 id="home-statement-title" className="relative z-20 mx-auto max-w-[16ch] font-serif text-[clamp(2.8rem,7.4vw,8rem)] font-black uppercase leading-[0.82] tracking-[-0.045em] text-venetian-sandstone">{copy.statement}</h2>
          <img src={roomImage} alt="" className="absolute left-[4%] top-[15%] h-[23svh] w-[24vw] min-w-[110px] max-w-[280px] rounded-[0.3rem] object-cover shadow-2xl" loading="lazy" />
          <img src={tableImage} alt="" className="absolute right-[5%] top-[21%] h-[28svh] w-[21vw] min-w-[100px] max-w-[240px] rotate-2 rounded-[0.3rem] object-cover shadow-2xl" loading="lazy" />
          <img src={wineImage} alt="" className="absolute bottom-[9%] left-[14%] h-[27svh] w-[20vw] min-w-[100px] max-w-[230px] -rotate-2 rounded-[0.3rem] object-cover shadow-2xl" loading="lazy" />
          <img src={exteriorImage} alt="" className="absolute bottom-[7%] right-[9%] h-[20svh] w-[29vw] min-w-[140px] max-w-[360px] rounded-[0.3rem] object-cover shadow-2xl" loading="lazy" />
          <div className="absolute inset-x-5 bottom-5 z-30 flex justify-between font-mono text-[0.6rem] uppercase tracking-[0.14em] text-white/45 sm:inset-x-10"><span>{copy.statementLeft}</span><span>{copy.statementRight}</span></div>
        </div>
      </section>

      <section className="bg-venetian-sandstone px-5 py-20 text-venetian-brown sm:px-8 sm:py-28 lg:px-10" aria-labelledby="home-menu-title">
        <div className="mx-auto max-w-[1800px]">
          <div className="grid gap-8 border-b border-venetian-brown/25 pb-10 lg:grid-cols-[0.65fr_1.35fr] lg:items-end">
            <p className="font-mono text-[0.66rem] font-medium uppercase tracking-[0.18em] text-venetian-terracotta">{copy.menuKicker}</p>
            <div>
              <h2 id="home-menu-title" className="max-w-[12ch] font-serif text-[clamp(3.2rem,8.3vw,9rem)] font-black uppercase leading-[0.78] tracking-[-0.055em]">{copy.menuTitle}</h2>
              <p className="mt-7 max-w-2xl text-base leading-7 text-venetian-brown/70 sm:text-lg">{copy.menuBody}</p>
            </div>
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {copy.dishes.map((dish, index) => (
              <Link key={dish} to="/menu" className="group relative min-h-[52svh] overflow-hidden rounded-[0.35rem] bg-venetian-brown text-white">
                <img src={dishImages[index]} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/5 to-black/10" />
                <span className="absolute left-5 top-5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-white/70">0{index + 1}</span>
                <span className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-5 border-t border-white/35 pt-4 font-serif text-3xl font-black uppercase leading-[0.9] sm:text-4xl">{dish}<ArrowUpRight className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></span>
              </Link>
            ))}
          </div>
          <div className="mt-9 flex justify-end"><Link to="/menu" className="editorial-link">{t('hero.viewMenu')}<ArrowRight className="h-4 w-4" /></Link></div>
        </div>
      </section>

      <section className="grid min-h-[100svh] bg-[#615558] lg:grid-cols-2" aria-labelledby="home-story-title">
        <div className="relative min-h-[62svh] overflow-hidden lg:min-h-full"><img src={staffImage} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" /></div>
        <div className="flex items-center px-5 py-20 sm:px-10 lg:px-[6vw]">
          <div>
            <p className="font-mono text-[0.66rem] font-medium uppercase tracking-[0.18em] text-venetian-sandstone/60">{copy.storyKicker}</p>
            <h2 id="home-story-title" className="mt-7 max-w-[11ch] font-serif text-[clamp(3rem,7.3vw,7.7rem)] font-black uppercase leading-[0.8] tracking-[-0.05em]">{copy.storyTitle}</h2>
            <p className="mt-8 max-w-xl text-base leading-7 text-venetian-sandstone/75 sm:text-lg">{copy.storyBody}</p>
            <Link to="/our-story" className="mt-9 inline-flex min-h-12 items-center gap-3 rounded-full border border-venetian-sandstone/45 px-6 font-mono text-[0.68rem] font-medium uppercase tracking-[0.12em] transition-colors hover:bg-venetian-sandstone hover:text-venetian-brown">{t('nav.about')}<ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <section id="home-site-navigation" className="bg-venetian-brown px-5 py-20 text-white sm:px-8 sm:py-28 lg:px-10" aria-labelledby="home-navigation-title">
        <div className="mx-auto max-w-[1800px]">
          <div className="grid gap-8 border-b border-white/15 pb-10 lg:grid-cols-[0.65fr_1.35fr] lg:items-end">
            <p className="font-mono text-[0.66rem] font-medium uppercase tracking-[0.18em] text-venetian-gold">{copy.exploreEyebrow}</p>
            <div><h2 id="home-navigation-title" className="max-w-[13ch] font-serif text-[clamp(3rem,8vw,8.5rem)] font-black uppercase leading-[0.78] tracking-[-0.05em]">{copy.exploreTitle}</h2><p className="mt-6 max-w-2xl text-base leading-7 text-white/60">{copy.exploreBody}</p></div>
          </div>
          <nav className="mt-8 grid border-l border-t border-white/15 sm:grid-cols-2 xl:grid-cols-4" aria-label={copy.navigation}>
            {quickLinks.map(({ label, path, Icon }, index) => (
              <Link key={path} to={path} className="group flex min-h-36 flex-col justify-between border-b border-r border-white/15 p-5 transition-colors hover:bg-venetian-sandstone hover:text-venetian-brown focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-venetian-gold sm:min-h-44 sm:p-6">
                <span className="flex items-start justify-between"><Icon className="h-5 w-5 text-venetian-gold transition-colors group-hover:text-venetian-terracotta" /><span className="font-mono text-[0.58rem] tracking-[0.14em] text-white/35 group-hover:text-venetian-brown/50">{String(index + 1).padStart(2, '0')}</span></span>
                <span className="flex items-end justify-between gap-4 font-serif text-2xl font-black uppercase leading-[0.9] sm:text-3xl">{label}<ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></span>
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section className="relative flex min-h-[92svh] items-center justify-center overflow-hidden px-5 py-24 text-center" aria-labelledby="home-reserve-title">
        <img src={reservedTableImage} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-venetian-brown/70" />
        <div className="relative z-10 mx-auto max-w-6xl">
          <p className="font-mono text-[0.66rem] font-medium uppercase tracking-[0.2em] text-venetian-gold">{copy.reserveKicker}</p>
          <h2 id="home-reserve-title" className="mx-auto mt-7 max-w-[11ch] font-serif text-[clamp(3.8rem,12vw,12rem)] font-black uppercase leading-[0.72] tracking-[-0.06em]">{copy.reserveTitle}</h2>
          <p className="mx-auto mt-8 max-w-lg text-base leading-7 text-white/70">{copy.reserveBody}</p>
          <Link to="/book" className="mt-9 inline-flex min-h-14 items-center gap-4 rounded-full bg-venetian-sandstone px-7 font-mono text-[0.68rem] font-medium uppercase tracking-[0.12em] text-venetian-brown transition-colors hover:bg-venetian-gold">{t('hero.reserveButton')}<ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </div>
  );
}
