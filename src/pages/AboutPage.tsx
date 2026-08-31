import { ChefHat, MapPin, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { SEOHead } from '../components/SEOHead';
import { SocialProof } from '../components/SocialProof';
import { useLanguage, type Language } from '../lib/i18n';
import roomImage from '../Img/G1/IMG_2960.webp';
import tableImage from '../Img/G1/IMG_2962.webp';
import dishImage from '../Img/food/IMG_2985.webp';

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
      <main className="min-h-screen bg-venetian-sandstone/15 pt-20">
        <section className="relative min-h-[68vh] flex items-center overflow-hidden">
          <img src={roomImage} alt="Dining room at Al Gobbo di Rialto in Venice" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/25" />
          <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-24">
            <div className="max-w-3xl">
              <p className="text-venetian-gold uppercase tracking-[0.2em] text-sm font-semibold mb-5">{copy.eyebrow}</p>
              <h1 className="font-serif text-4xl sm:text-6xl text-white leading-tight mb-6">{copy.title}</h1>
              <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-2xl">{copy.lead}</p>
            </div>
          </div>
        </section>

        <SocialProof />

        <section className="py-20 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="text-venetian-gold uppercase tracking-[0.2em] text-sm font-semibold mb-4">{copy.heritageLabel}</p>
              <h2 className="font-serif text-3xl sm:text-5xl text-venetian-brown mb-6">{copy.heritageTitle}</h2>
              <div className="space-y-5 text-lg text-venetian-brown/80 leading-relaxed">{copy.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
            </motion.div>
            <img src={tableImage} alt="Interior of Al Gobbo di Rialto at San Polo 649" loading="lazy" decoding="async" className="w-full aspect-[4/3] object-cover rounded-2xl shadow-xl" />
          </div>
        </section>

        <section className="py-14 bg-venetian-brown">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 grid sm:grid-cols-3 gap-6">
            {copy.facts.map((fact, index) => {
              const Icon = factIcons[index];
              return <div key={fact.label} className="text-center text-white"><Icon className="w-7 h-7 text-venetian-gold mx-auto mb-3" /><p className="font-serif text-2xl mb-1">{fact.value}</p><p className="text-sm text-venetian-sandstone">{fact.label}</p></div>;
            })}
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
            <img src={dishImage} alt="Dish served at Al Gobbo di Rialto" loading="lazy" decoding="async" className="w-full aspect-[4/3] object-cover rounded-2xl shadow-xl lg:order-1" />
            <div className="lg:order-2">
              <p className="text-venetian-gold uppercase tracking-[0.2em] text-sm font-semibold mb-4">{copy.todayLabel}</p>
              <h2 className="font-serif text-3xl sm:text-5xl text-venetian-brown mb-6">{copy.todayTitle}</h2>
              <p className="text-lg text-venetian-brown/80 leading-relaxed">{copy.todayBody}</p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white text-center">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="font-serif text-3xl sm:text-5xl text-venetian-brown mb-8">{copy.ctaTitle}</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link to="/menu" className="rounded-xl border border-venetian-brown px-7 py-3.5 font-semibold text-venetian-brown hover:bg-venetian-brown/5">{copy.menu}</Link>
              <Link to="/book" className="rounded-xl bg-venetian-brown px-7 py-3.5 font-semibold text-white hover:bg-venetian-brown/90">{copy.book}</Link>
            </div>
          </div>
        </section>
      </main>
    </PageTransition>
  );
}
