import { motion } from 'framer-motion';
import { ArrowRight, Clock3, Fish, MapPin, Navigation, Phone, Star, UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Gallery } from '../components/Gallery';
import { Hero } from '../components/Hero';
import { PageTransition } from '../components/PageTransition';
import { SEOHead } from '../components/SEOHead';
import { SocialProof } from '../components/SocialProof';
import { translations, useLanguage, type Language } from '../lib/i18n';
import storyImage from '../Img/G1/IMG_2962.webp';
import dishOne from '../Img/food/IMG_2980.webp';
import dishTwo from '../Img/food/IMG_2984.webp';
import dishThree from '../Img/food/IMG_2986.webp';

const pageCopy: Record<Language, {
  menuKicker: string; menuTitle: string; menuBody: string; menuLink: string;
  dishes: [string, string, string];
  reviewsKicker: string; reviewsTitle: string; reviewsLink: string;
  reviews: [string, string];
  locationKicker: string; locationTitle: string; locationBody: string; locationLink: string; directions: string;
}> = {
  en: { menuKicker: 'From our kitchen', menuTitle: 'Venice, Served at the Table', menuBody: 'Seafood, handmade pasta, lagoon classics and pizza: a menu made for curious travellers and long, convivial dinners.', menuLink: 'Explore the complete menu', dishes: ['Lagoon & seafood', 'Venetian classics', 'Italian favourites'], reviewsKicker: 'Guest stories', reviewsTitle: 'A Place People Remember', reviewsLink: 'Read reviews on Tripadvisor', reviews: ['Fresh seafood, generous plates and unmistakably Venetian flavours are mentioned again and again.', 'Guests remember the warm welcome, attentive service and the quiet atmosphere of the garden.'], locationKicker: 'Find us', locationTitle: 'A Few Steps from Rialto', locationBody: 'San Polo 649, between the bridge and the market. Open the route before entering Venice’s maze of calli.', locationLink: 'Location details', directions: 'Open directions' },
  it: { menuKicker: 'Dalla nostra cucina', menuTitle: 'Venezia, Servita a Tavola', menuBody: 'Pesce, pasta, ricette di laguna e pizza: un menu pensato per chi vuole scoprire e per chi ama stare a tavola.', menuLink: 'Esplora il menu completo', dishes: ['Laguna e pesce', 'Classici veneziani', 'Favoriti italiani'], reviewsKicker: 'Le storie degli ospiti', reviewsTitle: 'Un Luogo che Resta', reviewsLink: 'Leggi le recensioni su Tripadvisor', reviews: ['Pesce fresco, piatti generosi e sapori autenticamente veneziani tornano spesso nei racconti degli ospiti.', 'L’accoglienza calorosa, il servizio attento e la tranquillità del giardino sono tra i ricordi più condivisi.'], locationKicker: 'Dove siamo', locationTitle: 'A Pochi Passi da Rialto', locationBody: 'San Polo 649, tra il ponte e il mercato. Apri il percorso prima di entrare nel labirinto delle calli.', locationLink: 'Dettagli e posizione', directions: 'Apri le indicazioni' },
  fr: { menuKicker: 'Depuis notre cuisine', menuTitle: 'Venise, Servie à Table', menuBody: 'Poissons, pâtes, recettes de la lagune et pizzas : une carte faite pour la découverte et les longues soirées.', menuLink: 'Voir toute la carte', dishes: ['Lagune et poissons', 'Classiques vénitiens', 'Favoris italiens'], reviewsKicker: 'Paroles de clients', reviewsTitle: 'Un Lieu que l’on Garde en Mémoire', reviewsLink: 'Lire les avis sur Tripadvisor', reviews: ['Poissons frais, assiettes généreuses et saveurs vénitiennes reviennent souvent dans les avis.', 'Les clients se souviennent de l’accueil, du service attentif et du calme du jardin.'], locationKicker: 'Nous trouver', locationTitle: 'À Quelques Pas du Rialto', locationBody: 'San Polo 649, entre le pont et le marché. Ouvrez l’itinéraire avant de parcourir les calli.', locationLink: 'Voir l’emplacement', directions: 'Ouvrir l’itinéraire' },
  de: { menuKicker: 'Aus unserer Küche', menuTitle: 'Venedig, Am Tisch Serviert', menuBody: 'Fisch, Pasta, Lagunenrezepte und Pizza: eine Karte zum Entdecken und für lange Abende.', menuLink: 'Die ganze Speisekarte', dishes: ['Lagune und Fisch', 'Venezianische Klassiker', 'Italienische Favoriten'], reviewsKicker: 'Stimmen der Gäste', reviewsTitle: 'Ein Ort, der in Erinnerung Bleibt', reviewsLink: 'Bewertungen auf Tripadvisor', reviews: ['Frischer Fisch, großzügige Teller und echte venezianische Aromen werden immer wieder gelobt.', 'Gäste erinnern sich an den herzlichen Empfang, aufmerksamen Service und den ruhigen Garten.'], locationKicker: 'Anfahrt', locationTitle: 'Nur Wenige Schritte vom Rialto', locationBody: 'San Polo 649, zwischen Brücke und Markt. Öffnen Sie die Route vor dem Labyrinth der Gassen.', locationLink: 'Standort ansehen', directions: 'Route öffnen' },
  es: { menuKicker: 'Desde nuestra cocina', menuTitle: 'Venecia, Servida en la Mesa', menuBody: 'Pescado, pasta, recetas de la laguna y pizza: una carta para descubrir y disfrutar sin prisa.', menuLink: 'Ver el menú completo', dishes: ['Laguna y pescado', 'Clásicos venecianos', 'Favoritos italianos'], reviewsKicker: 'Historias de clientes', reviewsTitle: 'Un Lugar que se Recuerda', reviewsLink: 'Leer opiniones en Tripadvisor', reviews: ['El pescado fresco, los platos generosos y los sabores venecianos aparecen una y otra vez en las opiniones.', 'Los clientes recuerdan la acogida, el servicio atento y la tranquilidad del jardín.'], locationKicker: 'Cómo llegar', locationTitle: 'A Pocos Pasos de Rialto', locationBody: 'San Polo 649, entre el puente y el mercado. Abre la ruta antes de entrar en el laberinto de calles.', locationLink: 'Ver ubicación', directions: 'Abrir indicaciones' },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (index = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: index * 0.06, ease: 'easeOut' } }),
};

export function Home() {
  const { language } = useLanguage();
  const copy = translations[language];
  const page = pageCopy[language];
  const reasons = [Fish, UtensilsCrossed, MapPin];
  const dishes = [dishOne, dishTwo, dishThree];

  return (
    <PageTransition>
      <SEOHead canonical="/" description="Ristorante storico a Venezia dal 1955. Cucina veneziana, pesce, pasta e pizza a San Polo 649, vicino a Rialto. Prenota online." />
      <Hero />
      <SocialProof />

      <section id="story-section" className="bg-[#f7f3eb] py-20 sm:py-28 dark:bg-venetian-brown">
        <div className="mx-auto grid max-w-[1480px] gap-12 px-4 sm:px-7 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeUp} className="flex flex-col justify-between">
            <div>
              <p className="editorial-kicker">{copy.story.badge}</p>
              <h2 className="mt-5 max-w-[11ch] font-serif text-5xl font-semibold leading-[0.86] tracking-[-0.03em] text-venetian-brown sm:text-7xl dark:text-white">{copy.story.title}</h2>
              <div className="mt-9 max-w-xl space-y-5 text-base leading-7 text-venetian-brown/65 dark:text-white/60"><p>{copy.story.body1}</p><p>{copy.story.body2}</p></div>
            </div>
            <Link to="/our-story" className="mt-9 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-venetian-terracotta hover:gap-5">{copy.story.cta}<ArrowRight className="h-4 w-4" /></Link>
          </motion.div>
          <motion.figure initial={{ opacity: 0, x: 18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative border-l border-venetian-brown/15 pl-4 sm:pl-7 dark:border-white/12">
            <img src={storyImage} alt="Sala di Al Gobbo di Rialto" className="aspect-[4/5] w-full object-cover" loading="lazy" decoding="async" />
            <figcaption className="absolute bottom-0 left-4 bg-venetian-gold p-5 text-venetian-brown sm:left-7 sm:p-7"><strong className="block font-serif text-4xl leading-none">1955</strong><span className="mt-1 block text-[0.6rem] font-bold uppercase tracking-[0.18em]">Venezia · San Polo</span></figcaption>
          </motion.figure>
        </div>
      </section>

      <section className="border-y border-venetian-brown/15 bg-[#efe6d6] dark:border-white/10 dark:bg-[#211d18]">
        <div className="mx-auto grid max-w-[1480px] md:grid-cols-3">
          {copy.whyUs.items.map((item, index) => {
            const Icon = reasons[index];
            return (
              <motion.article key={item.title} custom={index} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border-b border-venetian-brown/15 p-7 last:border-b-0 md:min-h-72 md:border-b-0 md:border-r md:last:border-r-0 lg:p-10 dark:border-white/10">
                <span className="text-[0.65rem] font-bold tracking-[0.18em] text-venetian-terracotta">0{index + 1}</span>
                <Icon className="mt-8 h-7 w-7 text-venetian-brown dark:text-venetian-gold" />
                <h3 className="mt-5 font-serif text-3xl font-semibold text-venetian-brown dark:text-white">{item.title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-venetian-brown/60 dark:text-white/55">{item.description}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="bg-[#f7f3eb] py-20 sm:py-28 dark:bg-venetian-brown">
        <div className="mx-auto max-w-[1480px] px-4 sm:px-7 lg:px-10">
          <div className="grid gap-7 border-t border-venetian-brown pt-7 lg:grid-cols-[0.85fr_1.15fr] lg:items-end dark:border-white">
            <div><p className="editorial-kicker">{page.menuKicker}</p><h2 className="mt-4 font-serif text-5xl font-semibold leading-[0.88] text-venetian-brown sm:text-7xl dark:text-white">{page.menuTitle}</h2></div>
            <div className="lg:justify-self-end"><p className="max-w-2xl text-base leading-7 text-venetian-brown/62 dark:text-white/58">{page.menuBody}</p><Link to="/menu" className="mt-6 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-venetian-terracotta hover:gap-5">{page.menuLink}<ArrowRight className="h-4 w-4" /></Link></div>
          </div>
          <div className="mt-10 grid gap-2 md:grid-cols-3">
            {dishes.map((image, index) => <Link key={image} to="/menu" className={`group relative overflow-hidden ${index === 1 ? 'md:mt-12' : ''}`}><img src={image} alt={page.dishes[index]} loading="lazy" decoding="async" className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" /><span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-16 font-serif text-2xl font-semibold text-white">{page.dishes[index]}</span></Link>)}
          </div>
        </div>
      </section>

      <Gallery />

      <section className="bg-venetian-terracotta py-20 text-white sm:py-28">
        <div className="mx-auto max-w-[1480px] px-4 sm:px-7 lg:px-10">
          <div className="grid gap-8 border-t border-white/25 pt-7 lg:grid-cols-[0.65fr_1.35fr]">
            <div><p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-white/62">{page.reviewsKicker}</p><h2 className="mt-4 max-w-[10ch] font-serif text-5xl font-semibold leading-[0.88] sm:text-7xl">{page.reviewsTitle}</h2></div>
            <div className="grid gap-7 sm:grid-cols-2">
              {page.reviews.map((review, index) => <motion.blockquote key={review} custom={index} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border-l border-white/30 pl-6"><div className="flex gap-1">{Array.from({ length: 5 }).map((_, star) => <Star key={star} className="h-4 w-4 fill-venetian-gold text-venetian-gold" />)}</div><p className="mt-6 font-serif text-2xl font-medium leading-8">“{review}”</p><footer className="mt-6 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-white/55">{index === 0 ? 'TheFork' : 'Google · Tripadvisor'}</footer></motion.blockquote>)}
            </div>
          </div>
          <a href="https://www.tripadvisor.it/Restaurant_Review-g187870-d20083361-Reviews-Ristorante_Pizzeria_Al_Gobbo_di_Rialto-Venice_Veneto.html" target="_blank" rel="noopener noreferrer" className="mt-10 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] hover:gap-5">{page.reviewsLink}<ArrowRight className="h-4 w-4" /></a>
        </div>
      </section>

      <section className="bg-[#f7f3eb] py-20 sm:py-28 dark:bg-venetian-brown">
        <div className="mx-auto grid max-w-[1480px] gap-10 px-4 sm:px-7 lg:grid-cols-[1fr_auto] lg:items-end lg:px-10">
          <div><p className="editorial-kicker">{page.locationKicker}</p><h2 className="mt-5 max-w-[12ch] font-serif text-5xl font-semibold leading-[0.88] text-venetian-brown sm:text-7xl dark:text-white">{page.locationTitle}</h2><p className="mt-6 max-w-2xl text-base leading-7 text-venetian-brown/62 dark:text-white/58">{page.locationBody}</p><div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-[0.65rem] font-bold uppercase tracking-[0.13em] text-venetian-brown/55 dark:text-white/55"><span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-venetian-terracotta" />San Polo 649</span><span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-venetian-terracotta" />Pranzo · Cena</span></div></div>
          <div className="flex min-w-64 flex-col gap-3"><Link to="/location" className="editorial-link">{page.locationLink}<ArrowRight className="h-4 w-4" /></Link><a href="https://www.google.com/maps/dir/?api=1&destination=Al+Gobbo+di+Rialto,+San+Polo+649,+Venezia" target="_blank" rel="noopener noreferrer" data-track="click_directions" className="editorial-link-light dark:border-white/25 dark:text-white"><Navigation className="h-4 w-4" />{page.directions}</a></div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-venetian-brown py-20 text-white sm:py-28">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-7"><p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-venetian-gold">San Polo · Rialto · Venezia</p><h2 className="mt-5 font-serif text-5xl font-semibold leading-[0.88] sm:text-7xl">{copy.ctaBanner.title}</h2><p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/58">{copy.ctaBanner.subtitle}</p><div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><Link to="/book" className="inline-flex min-h-[52px] items-center justify-center gap-2 bg-venetian-gold px-7 text-xs font-bold uppercase tracking-[0.16em] text-venetian-brown hover:bg-white">{copy.ctaBanner.reserve}<ArrowRight className="h-4 w-4" /></Link><a href="tel:+390415204603" className="inline-flex min-h-[52px] items-center justify-center gap-2 border border-white/25 px-7 text-xs font-bold uppercase tracking-[0.16em] text-white hover:border-white"><Phone className="h-4 w-4" />+39 041 520 4603</a></div></div>
      </section>
    </PageTransition>
  );
}
