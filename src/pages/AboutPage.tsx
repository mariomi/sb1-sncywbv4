import { ChefHat, MapPin, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { SEOHead } from '../components/SEOHead';
import { SocialProof } from '../components/SocialProof';
import { useLanguage, type Language } from '../lib/i18n';
import roomImage from '../Img/al-gobbo-2026/interior-wide-1600.webp';
import tableImage from '../Img/al-gobbo-2026/table-portrait-1200.webp';
import dishImage from '../Img/al-gobbo-2026/pasta-wide-1600.webp';

type StoryCopy = {
  seoTitle: string;
  seoDescription: string;
  eyebrow: string;
  title: string;
  lead: string;
  heritageLabel: string;
  heritageTitle: string;
  paragraphs: string[];
  facts: { value: string; label: string }[];
  todayLabel: string;
  todayTitle: string;
  todayBody: string;
  ctaTitle: string;
  menu: string;
  book: string;
};

const storyCopy: Record<Language, StoryCopy> = {
  en: {
    seoTitle: 'Our Story Since 1955', seoDescription: 'Discover the story of Al Gobbo di Rialto: three generations of Venetian hospitality at San Polo 649, near Rialto in Venice.', eyebrow: 'Since 1955 · San Polo, Venice', title: 'A Venetian Story, Three Generations Long', lead: 'Al Gobbo di Rialto is rooted in San Polo and in the food traditions of Venice.', heritageLabel: 'Our heritage', heritageTitle: 'A Restaurant Shaped by Its Neighbourhood', paragraphs: ['The story begins in 1955 at San Polo 649, close to the Rialto bridge and market district. The restaurant’s name connects it to one of the most recognisable symbols of historic Rialto.', 'Across three generations, the purpose has remained clear: welcome people warmly and serve Venetian recipes alongside seafood, Italian classics and pizza.'], facts: [{ value: '1955', label: 'The story begins' }, { value: '3', label: 'Generations of hospitality' }, { value: 'San Polo 649', label: 'Our Venice address' }], todayLabel: 'Al Gobbo today', todayTitle: 'Tradition, Served for Today', todayBody: 'The menu keeps Venetian dishes at its centre while making mixed groups easy to welcome. Guests can explore the menu, check online availability and book directly.', ctaTitle: 'Experience the story at the table', menu: 'Explore the menu', book: 'Book a table',
  },
  it: {
    seoTitle: 'La Nostra Storia dal 1955', seoDescription: 'Scopri la storia di Al Gobbo di Rialto: tre generazioni di ospitalità veneziana a San Polo 649, vicino a Rialto.', eyebrow: 'Dal 1955 · San Polo, Venezia', title: 'Una Storia Veneziana Lunga Tre Generazioni', lead: 'Al Gobbo di Rialto affonda le sue radici a San Polo e nella tradizione gastronomica di Venezia.', heritageLabel: 'Il nostro patrimonio', heritageTitle: 'Un Ristorante Cresciuto nel Suo Quartiere', paragraphs: ['La storia inizia nel 1955 a San Polo 649, vicino al ponte e al mercato di Rialto. Il nome del ristorante richiama uno dei simboli più riconoscibili della Rialto storica.', 'In tre generazioni, l’obiettivo è rimasto lo stesso: accogliere con calore e servire ricette veneziane insieme a pesce, classici italiani e pizza.'], facts: [{ value: '1955', label: 'L’inizio della storia' }, { value: '3', label: 'Generazioni di ospitalità' }, { value: 'San Polo 649', label: 'Il nostro indirizzo' }], todayLabel: 'Al Gobbo oggi', todayTitle: 'La Tradizione, Oggi', todayBody: 'Il menu mantiene al centro i piatti veneziani e accoglie facilmente gruppi con gusti diversi. Gli ospiti possono esplorare il menu, verificare la disponibilità e prenotare direttamente.', ctaTitle: 'Vivi la storia a tavola', menu: 'Scopri il menu', book: 'Prenota un tavolo',
  },
  fr: {
    seoTitle: 'Notre Histoire Depuis 1955', seoDescription: 'Découvrez Al Gobbo di Rialto : trois générations d’hospitalité vénitienne à San Polo 649, près du Rialto.', eyebrow: 'Depuis 1955 · San Polo, Venise', title: 'Une Histoire Vénitienne sur Trois Générations', lead: 'Al Gobbo di Rialto est profondément lié à San Polo et aux traditions culinaires de Venise.', heritageLabel: 'Notre héritage', heritageTitle: 'Un Restaurant Façonné par Son Quartier', paragraphs: ['L’histoire commence en 1955 à San Polo 649, près du pont et du marché du Rialto. Le nom du restaurant rappelle l’un des symboles du Rialto historique.', 'Depuis trois générations, la même envie demeure : accueillir chaleureusement et servir des recettes vénitiennes, des produits de la mer, des classiques italiens et des pizzas.'], facts: [{ value: '1955', label: 'Le début de l’histoire' }, { value: '3', label: 'Générations d’hospitalité' }, { value: 'San Polo 649', label: 'Notre adresse à Venise' }], todayLabel: 'Al Gobbo aujourd’hui', todayTitle: 'La Tradition au Goût du Jour', todayBody: 'La carte place les plats vénitiens au premier plan et accueille facilement les groupes aux envies variées. Consultez la carte, les disponibilités et réservez directement.', ctaTitle: 'Vivez cette histoire à table', menu: 'Découvrir le menu', book: 'Réserver une table',
  },
  de: {
    seoTitle: 'Unsere Geschichte Seit 1955', seoDescription: 'Entdecken Sie Al Gobbo di Rialto: drei Generationen venezianischer Gastfreundschaft in San Polo 649 nahe dem Rialto.', eyebrow: 'Seit 1955 · San Polo, Venedig', title: 'Eine Venezianische Geschichte in Drei Generationen', lead: 'Al Gobbo di Rialto ist fest in San Polo und in Venedigs kulinarischer Tradition verwurzelt.', heritageLabel: 'Unser Erbe', heritageTitle: 'Ein Restaurant, Geprägt von Seinem Viertel', paragraphs: ['Die Geschichte beginnt 1955 in San Polo 649, nahe der Rialtobrücke und dem Markt. Der Name erinnert an eines der bekanntesten Symbole des historischen Rialto.', 'Über drei Generationen blieb das Ziel gleich: herzlicher Empfang und venezianische Rezepte neben Fischgerichten, italienischen Klassikern und Pizza.'], facts: [{ value: '1955', label: 'Der Beginn der Geschichte' }, { value: '3', label: 'Generationen Gastfreundschaft' }, { value: 'San Polo 649', label: 'Unsere Adresse' }], todayLabel: 'Al Gobbo heute', todayTitle: 'Tradition für die Gegenwart', todayBody: 'Venezianische Gerichte stehen im Mittelpunkt, zugleich findet jede Gruppe eine passende Auswahl. Entdecken Sie die Karte, prüfen Sie freie Zeiten und reservieren Sie direkt.', ctaTitle: 'Erleben Sie die Geschichte am Tisch', menu: 'Speisekarte ansehen', book: 'Tisch reservieren',
  },
  es: {
    seoTitle: 'Nuestra Historia Desde 1955', seoDescription: 'Descubre Al Gobbo di Rialto: tres generaciones de hospitalidad veneciana en San Polo 649, cerca de Rialto.', eyebrow: 'Desde 1955 · San Polo, Venecia', title: 'Una Historia Veneciana de Tres Generaciones', lead: 'Al Gobbo di Rialto está unido a San Polo y a la tradición gastronómica de Venecia.', heritageLabel: 'Nuestro legado', heritageTitle: 'Un Restaurante Marcado por Su Barrio', paragraphs: ['La historia comienza en 1955 en San Polo 649, cerca del puente y del mercado de Rialto. El nombre recuerda uno de los símbolos del Rialto histórico.', 'A lo largo de tres generaciones, el propósito sigue igual: recibir con calidez y servir recetas venecianas junto con marisco, clásicos italianos y pizza.'], facts: [{ value: '1955', label: 'El inicio de la historia' }, { value: '3', label: 'Generaciones de hospitalidad' }, { value: 'San Polo 649', label: 'Nuestra dirección' }], todayLabel: 'Al Gobbo hoy', todayTitle: 'Tradición para el Presente', todayBody: 'La carta mantiene los platos venecianos en el centro y ofrece opciones para grupos con gustos distintos. Consulta la carta, la disponibilidad y reserva directamente.', ctaTitle: 'Vive la historia en la mesa', menu: 'Ver la carta', book: 'Reservar una mesa',
  },
};

const factIcons = [ChefHat, Users, MapPin];

export function AboutPage() {
  const { language } = useLanguage();
  const copy = storyCopy[language];

  return (
    <PageTransition>
      <SEOHead title={copy.seoTitle} canonical="/our-story" description={copy.seoDescription} />
      <main className="min-h-screen bg-[#f7f3eb] pt-[84px] dark:bg-venetian-brown">
        <section className="mx-auto grid max-w-[1480px] border-x border-venetian-brown/15 lg:grid-cols-[0.92fr_1.08fr] dark:border-white/10">
          <div className="flex min-h-[520px] flex-col justify-end px-5 py-14 sm:px-10 lg:px-16 lg:py-20">
            <p className="editorial-kicker">{copy.eyebrow}</p>
            <h1 className="mt-6 max-w-[10ch] font-serif text-6xl font-semibold leading-[0.8] tracking-[-0.04em] text-venetian-brown sm:text-8xl dark:text-white">{copy.title}</h1>
            <p className="mt-7 max-w-xl border-l-2 border-venetian-terracotta pl-5 text-base leading-7 text-venetian-brown/65 sm:text-lg dark:text-white/60">{copy.lead}</p>
          </div>
          <div className="relative min-h-[440px] overflow-hidden lg:min-h-[680px]">
            <img src={roomImage} alt="Dining room at Al Gobbo di Rialto in Venice" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
            <p className="absolute bottom-0 left-0 bg-venetian-terracotta px-5 py-4 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white">Tre generazioni · Una tavola</p>
          </div>
        </section>

        <SocialProof />

        <section className="bg-[#f7f3eb] py-20 sm:py-28 dark:bg-venetian-brown">
          <div className="mx-auto grid max-w-[1480px] gap-12 px-4 sm:px-7 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-10">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="editorial-kicker">{copy.heritageLabel}</p>
              <h2 className="mt-5 font-serif text-5xl font-semibold leading-[0.88] text-venetian-brown sm:text-7xl dark:text-white">{copy.heritageTitle}</h2>
              <div className="mt-8 space-y-5 text-base leading-7 text-venetian-brown/65 dark:text-white/60">{copy.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
            </motion.div>
            <img src={tableImage} alt="Interior of Al Gobbo di Rialto at San Polo 649" loading="lazy" decoding="async" className="aspect-[4/5] w-full object-cover" />
          </div>
        </section>

        <section className="border-y border-white/10 bg-venetian-brown">
          <div className="mx-auto grid max-w-[1480px] sm:grid-cols-3">
            {copy.facts.map((fact, index) => {
              const Icon = factIcons[index];
              return <div key={fact.label} className="border-b border-white/10 p-8 text-white last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 lg:p-12"><Icon className="h-6 w-6 text-venetian-gold" /><p className="mt-8 font-serif text-4xl font-semibold leading-none">{fact.value}</p><p className="mt-2 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white/45">{fact.label}</p></div>;
            })}
          </div>
        </section>

        <section className="bg-[#efe6d6] py-20 sm:py-28 dark:bg-[#211d18]">
          <div className="mx-auto grid max-w-[1480px] gap-12 px-4 sm:px-7 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-10">
            <img src={dishImage} alt="Dish served at Al Gobbo di Rialto" loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover lg:order-1" />
            <div className="lg:order-2">
              <p className="editorial-kicker">{copy.todayLabel}</p>
              <h2 className="mt-5 font-serif text-5xl font-semibold leading-[0.88] text-venetian-brown sm:text-7xl dark:text-white">{copy.todayTitle}</h2>
              <p className="mt-7 text-base leading-7 text-venetian-brown/65 dark:text-white/60">{copy.todayBody}</p>
            </div>
          </div>
        </section>

        <section className="bg-venetian-terracotta py-20 text-center text-white sm:py-24">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="mb-8 font-serif text-5xl font-semibold leading-[0.88] sm:text-7xl">{copy.ctaTitle}</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link to="/menu" className="inline-flex min-h-12 items-center justify-center border border-white/35 px-7 text-xs font-bold uppercase tracking-[0.16em] text-white hover:border-white">{copy.menu}</Link>
              <Link to="/book" className="inline-flex min-h-12 items-center justify-center bg-white px-7 text-xs font-bold uppercase tracking-[0.16em] text-venetian-terracotta hover:bg-venetian-gold hover:text-venetian-brown">{copy.book}</Link>
            </div>
          </div>
        </section>
      </main>
    </PageTransition>
  );
}
