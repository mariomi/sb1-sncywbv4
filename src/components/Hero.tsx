import { ArrowDown, ArrowUpRight, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage, type Language } from '../lib/i18n';
import heroImage from '../Img/G1/IMG_2922.webp';

const heroCopy: Record<Language, {
  eyebrow: string;
  title: string;
  body: string;
  enter: string;
  reserve: string;
  place: string;
  hours: string;
  cuisine: string;
}> = {
  it: {
    eyebrow: 'San Polo 649 · a due passi da Rialto',
    title: 'Fuori, Rialto. Dentro, un’altra Venezia.',
    body: 'Una porta, il profumo della cucina, un giardino nascosto. Dal 1955 accogliamo Venezia a tavola.',
    enter: 'Entra nella storia',
    reserve: 'Prenota il tuo tavolo',
    place: 'Venezia · San Polo',
    hours: 'Pranzo e cena',
    cuisine: 'Laguna · terra · pizza',
  },
  en: {
    eyebrow: 'San Polo 649 · steps from Rialto',
    title: 'Outside, Rialto. Inside, another Venice.',
    body: 'A doorway, the aroma of the kitchen, a hidden garden. Since 1955, we have welcomed Venice to the table.',
    enter: 'Step inside',
    reserve: 'Reserve your table',
    place: 'Venice · San Polo',
    hours: 'Lunch and dinner',
    cuisine: 'Lagoon · land · pizza',
  },
  fr: {
    eyebrow: 'San Polo 649 · à deux pas du Rialto',
    title: 'Dehors, le Rialto. Dedans, une autre Venise.',
    body: 'Une porte, les parfums de la cuisine, un jardin caché. Depuis 1955, nous accueillons Venise à table.',
    enter: 'Entrez dans l’histoire',
    reserve: 'Réserver votre table',
    place: 'Venise · San Polo',
    hours: 'Déjeuner et dîner',
    cuisine: 'Lagune · terre · pizza',
  },
  de: {
    eyebrow: 'San Polo 649 · wenige Schritte vom Rialto',
    title: 'Draußen Rialto. Drinnen ein anderes Venedig.',
    body: 'Eine Tür, der Duft aus der Küche, ein versteckter Garten. Seit 1955 heißen wir Venedig am Tisch willkommen.',
    enter: 'Treten Sie ein',
    reserve: 'Tisch reservieren',
    place: 'Venedig · San Polo',
    hours: 'Mittag- und Abendessen',
    cuisine: 'Lagune · Land · Pizza',
  },
  es: {
    eyebrow: 'San Polo 649 · a un paso de Rialto',
    title: 'Fuera, Rialto. Dentro, otra Venecia.',
    body: 'Una puerta, el aroma de la cocina, un jardín escondido. Desde 1955 recibimos a Venecia en la mesa.',
    enter: 'Entra en la historia',
    reserve: 'Reserva tu mesa',
    place: 'Venecia · San Polo',
    hours: 'Almuerzo y cena',
    cuisine: 'Laguna · tierra · pizza',
  },
};

export function Hero() {
  const { language } = useLanguage();
  const copy = heroCopy[language];
  const enterStory = () => document.getElementById('story-section')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-venetian-brown text-white" aria-labelledby="home-title">
      <motion.img
        src={heroImage}
        alt="Il giardino interno del Ristorante Al Gobbo di Rialto"
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.2, ease: 'easeOut' }}
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,14,12,0.88)_0%,rgba(16,14,12,0.56)_44%,rgba(16,14,12,0.12)_76%),linear-gradient(0deg,rgba(16,14,12,0.74)_0%,transparent_48%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_26%,transparent_0%,rgba(16,14,12,0.22)_58%,rgba(16,14,12,0.48)_100%)]" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1480px] flex-col justify-end px-5 pb-32 pt-32 sm:px-8 sm:pb-36 lg:px-12 xl:px-16">
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.15, ease: 'easeOut' }} className="max-w-5xl">
          <p className="mb-6 text-[0.65rem] font-bold uppercase tracking-[0.24em] text-venetian-gold sm:mb-8">{copy.eyebrow}</p>
          <h1 id="home-title" className="max-w-[12ch] font-serif text-[clamp(3.8rem,8.8vw,8.8rem)] font-semibold leading-[0.78] tracking-[-0.05em] text-white">{copy.title}</h1>
          <div className="mt-8 flex max-w-3xl flex-col gap-7 border-l border-white/35 pl-5 sm:mt-10 sm:pl-7 lg:flex-row lg:items-end lg:justify-between">
            <p className="max-w-xl text-base leading-7 text-white/72 sm:text-lg">{copy.body}</p>
            <Link to="/book" className="inline-flex min-h-12 shrink-0 items-center gap-3 self-start border-b border-venetian-gold pb-2 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-white transition-colors hover:text-venetian-gold lg:self-auto">{copy.reserve}<ArrowUpRight className="h-4 w-4" /></Link>
          </div>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 border-t border-white/18 bg-black/20 backdrop-blur-md">
          <div className="mx-auto grid max-w-[1480px] grid-cols-[1fr_auto] items-stretch px-5 sm:px-8 lg:grid-cols-[1fr_1fr_1fr_auto] lg:px-12 xl:px-16">
            <span className="flex min-h-20 items-center gap-3 border-r border-white/15 pr-5 text-[0.6rem] font-bold uppercase tracking-[0.15em] text-white/72"><MapPin className="h-4 w-4 text-venetian-gold" />{copy.place}</span>
            <span className="hidden min-h-20 items-center border-r border-white/15 px-7 text-[0.6rem] font-bold uppercase tracking-[0.15em] text-white/72 lg:flex">{copy.hours}</span>
            <span className="hidden min-h-20 items-center px-7 text-[0.6rem] font-bold uppercase tracking-[0.15em] text-white/72 lg:flex">{copy.cuisine}</span>
            <button type="button" onClick={enterStory} className="group flex min-h-20 items-center gap-3 pl-5 text-[0.6rem] font-bold uppercase tracking-[0.15em] text-white" aria-label={copy.enter}>{copy.enter}<span className="grid h-10 w-10 place-items-center bg-venetian-gold text-venetian-brown transition-transform group-hover:translate-y-1"><ArrowDown className="h-4 w-4" /></span></button>
          </div>
        </div>
      </div>

      <span className="pointer-events-none absolute right-5 top-1/2 hidden -translate-y-1/2 [writing-mode:vertical-rl] text-[0.58rem] font-bold uppercase tracking-[0.28em] text-white/46 lg:block">Al Gobbo di Rialto · dal 1955</span>
    </section>
  );
}
