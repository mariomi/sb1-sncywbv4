import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Clock3, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { PageTransition } from '../components/PageTransition';
import { SEOHead } from '../components/SEOHead';
import { useLanguage, type Language } from '../lib/i18n';
import gardenDetail from '../Img/G1/IMG_2934.webp';
import welcomeImage from '../Img/G1/IMG_2944.webp';
import diningRoom from '../Img/G1/IMG_2965.webp';
import closingImage from '../Img/G1/IMG_2939.webp';
import dishOne from '../Img/food/IMG_2980.webp';
import dishTwo from '../Img/food/IMG_2984.webp';
import dishThree from '../Img/G1/IMG_2995.webp';

type ExperienceCopy = {
  arrival: { number: string; kicker: string; title: string; body: string; accent: string; link: string };
  kitchen: { number: string; kicker: string; title: string; body: string; link: string; dishes: [string, string, string] };
  welcome: { number: string; kicker: string; title: string; body: string; link: string };
  memory: { title: string; body: string; sources: string };
  closing: { kicker: string; title: string; body: string; reserve: string; directions: string; call: string; address: string; hours: string };
};

const experienceCopy: Record<Language, ExperienceCopy> = {
  it: {
    arrival: { number: '01', kicker: 'Appena oltre la porta', title: 'Il rumore di Rialto resta fuori.', body: 'Dentro, i mattoni, le luci calde e il giardino cambiano il ritmo. Si entra per mangiare; si rimane perché qui Venezia sembra ancora capace di sorprendere.', accent: 'Dal 1955, tre generazioni e un modo semplice di stare a tavola.', link: 'La nostra storia' },
    kitchen: { number: '02', kicker: 'Poi arriva la cucina', title: 'La laguna, senza effetti speciali.', body: 'Pesce, pasta, ricette veneziane e ingredienti riconoscibili. Piatti diretti, fatti per essere condivisi e ricordati, non solo fotografati.', link: 'Scopri il menu', dishes: ['Mare e laguna', 'Venezia nel piatto', 'Il tempo di un calice'] },
    welcome: { number: '03', kicker: 'Il gesto che conta', title: 'Essere accolti, prima ancora di ordinare.', body: 'Al Gobbo non è soltanto quello che arriva a tavola. È una persona che ti riconosce, un consiglio dato bene, il tempo lasciato alla conversazione.', link: 'Conosci Al Gobbo' },
    memory: { title: 'Un posto non si misura in stelle. Si misura nella voglia di tornare.', body: 'Da Rialto arrivano viaggiatori, famiglie e veneziani. Ognuno porta via un ricordo diverso dello stesso tavolo.', sources: 'Le esperienze degli ospiti · Google · TheFork · Tripadvisor' },
    closing: { kicker: 'Il quarto momento è il tuo', title: 'Il tavolo è l’inizio.', body: 'Scegli il giorno e l’ora. Al resto — l’accoglienza, la cucina e un angolo di Venezia — pensiamo noi.', reserve: 'Prenota il tavolo', directions: 'Apri la strada', call: 'Chiamaci', address: 'San Polo 649 · Venezia', hours: 'Pranzo e cena · chiuso martedì' },
  },
  en: {
    arrival: { number: '01', kicker: 'Just beyond the door', title: 'The noise of Rialto stays outside.', body: 'Inside, brick walls, warm lights and the garden change the pace. You arrive for dinner and stay because Venice still knows how to surprise you here.', accent: 'Since 1955, three generations and a simple way of sharing the table.', link: 'Our story' },
    kitchen: { number: '02', kicker: 'Then comes the kitchen', title: 'The lagoon, without special effects.', body: 'Seafood, pasta, Venetian recipes and ingredients you recognise. Honest dishes made to be shared and remembered, not only photographed.', link: 'Discover the menu', dishes: ['Sea and lagoon', 'Venice on the plate', 'Time for a glass'] },
    welcome: { number: '03', kicker: 'The gesture that matters', title: 'Feeling welcome before you even order.', body: 'Al Gobbo is more than what reaches the table. It is someone who notices you, a recommendation made with care and time left for conversation.', link: 'Meet Al Gobbo' },
    memory: { title: 'A place is not measured in stars. It is measured by the wish to return.', body: 'Travellers, families and Venetians arrive from Rialto. Each leaves with a different memory of the same table.', sources: 'Guest experiences · Google · TheFork · Tripadvisor' },
    closing: { kicker: 'The fourth moment is yours', title: 'The table is the beginning.', body: 'Choose the day and time. We will take care of the welcome, the kitchen and your own corner of Venice.', reserve: 'Reserve your table', directions: 'Open directions', call: 'Call us', address: 'San Polo 649 · Venice', hours: 'Lunch and dinner · closed Tuesday' },
  },
  fr: {
    arrival: { number: '01', kicker: 'Juste derrière la porte', title: 'Le bruit du Rialto reste dehors.', body: 'À l’intérieur, les briques, les lumières chaudes et le jardin changent le rythme. On vient dîner, on reste parce qu’ici Venise surprend encore.', accent: 'Depuis 1955, trois générations et une façon simple de partager la table.', link: 'Notre histoire' },
    kitchen: { number: '02', kicker: 'Puis vient la cuisine', title: 'La lagune, sans artifices.', body: 'Poissons, pâtes, recettes vénitiennes et ingrédients reconnaissables. Des plats sincères à partager et à garder en mémoire.', link: 'Découvrir la carte', dishes: ['Mer et lagune', 'Venise dans l’assiette', 'Le temps d’un verre'] },
    welcome: { number: '03', kicker: 'Le geste qui compte', title: 'Être accueilli avant même de commander.', body: 'Al Gobbo, ce n’est pas seulement ce qui arrive à table. C’est une personne attentive, un conseil juste et du temps pour la conversation.', link: 'Découvrir Al Gobbo' },
    memory: { title: 'Un lieu ne se mesure pas en étoiles, mais à l’envie d’y revenir.', body: 'Voyageurs, familles et Vénitiens arrivent du Rialto. Chacun repart avec un souvenir différent de la même table.', sources: 'Expériences des clients · Google · TheFork · Tripadvisor' },
    closing: { kicker: 'Le quatrième moment est le vôtre', title: 'La table est le début.', body: 'Choisissez le jour et l’heure. Nous nous occupons de l’accueil, de la cuisine et de votre coin de Venise.', reserve: 'Réserver la table', directions: 'Ouvrir l’itinéraire', call: 'Nous appeler', address: 'San Polo 649 · Venise', hours: 'Déjeuner et dîner · fermé mardi' },
  },
  de: {
    arrival: { number: '01', kicker: 'Gleich hinter der Tür', title: 'Der Lärm von Rialto bleibt draußen.', body: 'Drinnen verändern Ziegel, warmes Licht und der Garten das Tempo. Man kommt zum Essen und bleibt, weil Venedig hier noch überrascht.', accent: 'Seit 1955, drei Generationen und eine einfache Art, den Tisch zu teilen.', link: 'Unsere Geschichte' },
    kitchen: { number: '02', kicker: 'Dann kommt die Küche', title: 'Die Lagune, ganz ohne Effekte.', body: 'Fisch, Pasta, venezianische Rezepte und erkennbare Zutaten. Ehrliche Gerichte zum Teilen und Erinnern.', link: 'Speisekarte entdecken', dishes: ['Meer und Lagune', 'Venedig auf dem Teller', 'Zeit für ein Glas'] },
    welcome: { number: '03', kicker: 'Die Geste, die zählt', title: 'Willkommen sein, noch bevor man bestellt.', body: 'Al Gobbo ist mehr als das Essen auf dem Tisch. Es ist ein aufmerksamer Mensch, eine gute Empfehlung und Zeit für Gespräche.', link: 'Al Gobbo kennenlernen' },
    memory: { title: 'Ein Ort misst sich nicht in Sternen, sondern am Wunsch zurückzukehren.', body: 'Reisende, Familien und Venezianer kommen vom Rialto. Jeder nimmt eine andere Erinnerung vom selben Tisch mit.', sources: 'Erlebnisse unserer Gäste · Google · TheFork · Tripadvisor' },
    closing: { kicker: 'Der vierte Moment gehört Ihnen', title: 'Der Tisch ist der Anfang.', body: 'Wählen Sie Tag und Uhrzeit. Wir kümmern uns um den Empfang, die Küche und Ihr Stück Venedig.', reserve: 'Tisch reservieren', directions: 'Route öffnen', call: 'Anrufen', address: 'San Polo 649 · Venedig', hours: 'Mittag- und Abendessen · Dienstag geschlossen' },
  },
  es: {
    arrival: { number: '01', kicker: 'Justo al cruzar la puerta', title: 'El ruido de Rialto se queda fuera.', body: 'Dentro, el ladrillo, las luces cálidas y el jardín cambian el ritmo. Vienes a cenar y te quedas porque aquí Venecia aún sorprende.', accent: 'Desde 1955, tres generaciones y una forma sencilla de compartir la mesa.', link: 'Nuestra historia' },
    kitchen: { number: '02', kicker: 'Después llega la cocina', title: 'La laguna, sin efectos especiales.', body: 'Pescado, pasta, recetas venecianas e ingredientes reconocibles. Platos sinceros para compartir y recordar.', link: 'Descubre el menú', dishes: ['Mar y laguna', 'Venecia en el plato', 'El tiempo de una copa'] },
    welcome: { number: '03', kicker: 'El gesto que importa', title: 'Sentirse bienvenido antes de pedir.', body: 'Al Gobbo es más que lo que llega a la mesa. Es una persona atenta, un buen consejo y tiempo para conversar.', link: 'Conoce Al Gobbo' },
    memory: { title: 'Un lugar no se mide en estrellas. Se mide en las ganas de volver.', body: 'Viajeros, familias y venecianos llegan desde Rialto. Cada uno se lleva un recuerdo distinto de la misma mesa.', sources: 'Experiencias de clientes · Google · TheFork · Tripadvisor' },
    closing: { kicker: 'El cuarto momento es tuyo', title: 'La mesa es el comienzo.', body: 'Elige el día y la hora. Nosotros cuidamos la bienvenida, la cocina y tu rincón de Venecia.', reserve: 'Reserva tu mesa', directions: 'Abrir indicaciones', call: 'Llámanos', address: 'San Polo 649 · Venecia', hours: 'Almuerzo y cena · cerrado martes' },
  },
};

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.65, ease: 'easeOut' as const },
};

export function Home() {
  const { language } = useLanguage();
  const copy = experienceCopy[language];

  return (
    <PageTransition>
      <SEOHead canonical="/" description="Ristorante storico a Venezia dal 1955. Cucina veneziana, pesce, pasta e pizza a San Polo 649, vicino a Rialto. Prenota online." />
      <main className="overflow-hidden bg-[#f5efe5] dark:bg-venetian-brown">
        <Hero />

        <section id="story-section" className="relative py-24 sm:py-32 lg:py-40">
          <span className="absolute right-0 top-10 select-none font-serif text-[10rem] font-semibold leading-none text-venetian-brown/[0.035] sm:text-[18rem] lg:text-[24rem] dark:text-white/[0.025]">{copy.arrival.number}</span>
          <div className="relative mx-auto grid max-w-[1480px] gap-16 px-5 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-24 lg:px-12 xl:px-16">
            <motion.div {...reveal} className="lg:sticky lg:top-32 lg:self-start">
              <p className="text-[0.64rem] font-bold uppercase tracking-[0.22em] text-venetian-terracotta">{copy.arrival.kicker}</p>
              <h2 className="mt-6 max-w-[10ch] font-serif text-6xl font-semibold leading-[0.82] tracking-[-0.04em] text-venetian-brown sm:text-8xl dark:text-white">{copy.arrival.title}</h2>
              <p className="mt-8 max-w-xl text-base leading-7 text-venetian-brown/65 sm:text-lg dark:text-white/62">{copy.arrival.body}</p>
              <Link to="/our-story" className="mt-9 inline-flex items-center gap-3 border-b border-venetian-brown/30 pb-2 text-[0.66rem] font-bold uppercase tracking-[0.16em] text-venetian-brown hover:border-venetian-terracotta hover:text-venetian-terracotta dark:border-white/30 dark:text-white">{copy.arrival.link}<ArrowRight className="h-4 w-4" /></Link>
            </motion.div>

            <div className="relative pb-20 sm:pb-28">
              <motion.img {...reveal} src={diningRoom} alt="La sala in mattoni di Al Gobbo di Rialto" className="ml-auto aspect-[3/4] w-[86%] object-cover sm:w-[78%]" loading="lazy" decoding="async" />
              <motion.img initial={{ opacity: 0, x: -18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} src={gardenDetail} alt="Dettaglio del giardino di Al Gobbo di Rialto" className="absolute bottom-0 left-0 aspect-[3/4] w-[42%] border-[10px] border-[#f5efe5] object-cover shadow-2xl sm:w-[36%] dark:border-venetian-brown" loading="lazy" decoding="async" />
              <p className="absolute bottom-1 right-0 max-w-[16rem] border-t border-venetian-brown/30 pt-4 text-sm italic leading-6 text-venetian-brown/62 dark:border-white/25 dark:text-white/55">{copy.arrival.accent}</p>
            </div>
          </div>
        </section>

        <section className="bg-[#151310] py-24 text-white sm:py-32 lg:py-40">
          <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12 xl:px-16">
            <motion.div {...reveal} className="grid gap-8 lg:grid-cols-[0.42fr_1.2fr_0.7fr] lg:items-end">
              <p className="font-serif text-8xl leading-none text-venetian-gold/35 sm:text-9xl">{copy.kitchen.number}</p>
              <div><p className="text-[0.64rem] font-bold uppercase tracking-[0.22em] text-venetian-gold">{copy.kitchen.kicker}</p><h2 className="mt-5 max-w-[11ch] font-serif text-6xl font-semibold leading-[0.82] tracking-[-0.04em] sm:text-8xl">{copy.kitchen.title}</h2></div>
              <div><p className="text-base leading-7 text-white/58">{copy.kitchen.body}</p><Link to="/menu" className="mt-7 inline-flex items-center gap-3 border-b border-venetian-gold/55 pb-2 text-[0.66rem] font-bold uppercase tracking-[0.16em] text-white hover:text-venetian-gold">{copy.kitchen.link}<ArrowUpRight className="h-4 w-4" /></Link></div>
            </motion.div>

            <div className="mt-16 grid items-start gap-3 sm:mt-24 md:grid-cols-[1.15fr_0.75fr_1fr]">
              {[dishOne, dishTwo, dishThree].map((image, index) => (
                <motion.figure key={image} {...reveal} className={index === 1 ? 'md:mt-28' : index === 2 ? 'md:mt-10' : ''}>
                  <div className="overflow-hidden"><img src={image} alt={copy.kitchen.dishes[index]} className="aspect-[3/4] w-full object-cover transition-transform duration-[1200ms] hover:scale-[1.035]" loading="lazy" decoding="async" /></div>
                  <figcaption className="mt-4 flex items-center gap-3 text-[0.6rem] font-bold uppercase tracking-[0.17em] text-white/55"><span className="h-px w-7 bg-venetian-gold" />{copy.kitchen.dishes[index]}</figcaption>
                </motion.figure>
              ))}
            </div>
          </div>
        </section>

        <section className="grid min-h-[88svh] bg-venetian-terracotta text-white lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative min-h-[62svh] overflow-hidden lg:min-h-full">
            <img src={welcomeImage} alt="L’accoglienza al banco di Al Gobbo di Rialto" className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/52 via-transparent to-transparent" />
            <span className="absolute bottom-7 left-7 font-serif text-8xl font-semibold leading-none text-white/48 sm:bottom-10 sm:left-10 sm:text-9xl">{copy.welcome.number}</span>
          </motion.div>
          <motion.div {...reveal} className="flex flex-col justify-center px-6 py-20 sm:px-12 lg:px-16 xl:px-24">
            <p className="text-[0.64rem] font-bold uppercase tracking-[0.22em] text-white/58">{copy.welcome.kicker}</p>
            <h2 className="mt-6 max-w-[10ch] font-serif text-6xl font-semibold leading-[0.82] tracking-[-0.04em] sm:text-8xl">{copy.welcome.title}</h2>
            <p className="mt-8 max-w-xl border-l border-white/32 pl-6 text-base leading-7 text-white/72 sm:text-lg">{copy.welcome.body}</p>
            <Link to="/our-story" className="mt-9 inline-flex w-fit items-center gap-3 border-b border-white/45 pb-2 text-[0.66rem] font-bold uppercase tracking-[0.16em] text-white hover:border-white">{copy.welcome.link}<ArrowRight className="h-4 w-4" /></Link>
          </motion.div>
        </section>

        <section className="bg-[#f5efe5] py-24 sm:py-36 dark:bg-venetian-brown">
          <motion.div {...reveal} className="mx-auto max-w-6xl px-5 text-center sm:px-8">
            <span className="mx-auto block h-16 w-px bg-venetian-terracotta" />
            <h2 className="mx-auto mt-10 max-w-[19ch] font-serif text-5xl font-semibold leading-[0.9] tracking-[-0.035em] text-venetian-brown sm:text-7xl dark:text-white">“{copy.memory.title}”</h2>
            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-venetian-brown/62 dark:text-white/58">{copy.memory.body}</p>
            <p className="mt-8 text-[0.58rem] font-bold uppercase tracking-[0.19em] text-venetian-brown/42 dark:text-white/38">{copy.memory.sources}</p>
          </motion.div>
        </section>

        <section className="relative min-h-[92svh] overflow-hidden bg-venetian-brown text-white">
          <img src={closingImage} alt="Un tavolo apparecchiato da Al Gobbo di Rialto" className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,15,13,0.92)_0%,rgba(17,15,13,0.74)_44%,rgba(17,15,13,0.18)_100%)]" />
          <div className="relative mx-auto flex min-h-[92svh] max-w-[1480px] items-center px-5 py-24 sm:px-8 lg:px-12 xl:px-16">
            <motion.div {...reveal} className="max-w-3xl">
              <p className="text-[0.64rem] font-bold uppercase tracking-[0.22em] text-venetian-gold">{copy.closing.kicker}</p>
              <h2 className="mt-6 max-w-[9ch] font-serif text-7xl font-semibold leading-[0.8] tracking-[-0.05em] sm:text-9xl">{copy.closing.title}</h2>
              <p className="mt-8 max-w-xl border-l border-white/35 pl-6 text-base leading-7 text-white/70 sm:text-lg">{copy.closing.body}</p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link to="/book" className="inline-flex min-h-[54px] items-center justify-center gap-3 bg-venetian-gold px-7 text-[0.67rem] font-bold uppercase tracking-[0.16em] text-venetian-brown hover:bg-white">{copy.closing.reserve}<ArrowRight className="h-4 w-4" /></Link>
                <a href="https://www.google.com/maps/dir/?api=1&destination=Al+Gobbo+di+Rialto,+San+Polo+649,+Venezia" target="_blank" rel="noopener noreferrer" data-track="click_directions" className="inline-flex min-h-[54px] items-center justify-center gap-3 border border-white/35 px-7 text-[0.67rem] font-bold uppercase tracking-[0.16em] text-white hover:border-white"><MapPin className="h-4 w-4" />{copy.closing.directions}</a>
              </div>
              <div className="mt-12 flex flex-col gap-4 border-t border-white/20 pt-6 text-[0.6rem] font-bold uppercase tracking-[0.15em] text-white/60 sm:flex-row sm:gap-8">
                <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-venetian-gold" />{copy.closing.address}</span>
                <span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-venetian-gold" />{copy.closing.hours}</span>
                <a href="tel:+390415204603" className="flex items-center gap-2 hover:text-white"><Phone className="h-4 w-4 text-venetian-gold" />{copy.closing.call}</a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </PageTransition>
  );
}
