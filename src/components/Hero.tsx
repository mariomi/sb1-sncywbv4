import { ArrowDown, ArrowRight } from 'lucide-react';
import { motion, type MotionValue, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage, type Language } from '../lib/i18n';
import { developerLegalIdentity, restaurantLegalIdentity } from '../lib/legal';
import { markHomeIntroSeen, shouldPlayHomeIntro } from '../lib/homeIntro';
import { HomeLanding } from './HomeLanding';
import heroImage from '../Img/al-gobbo-2026/interior-hero-1600.webp';
import hero480 from '../Img/al-gobbo-2026/interior-hero-480.webp';
import hero900 from '../Img/al-gobbo-2026/interior-hero-900.webp';
import hero1200 from '../Img/al-gobbo-2026/interior-hero-1200.webp';
import exteriorImage from '../Img/al-gobbo-2026/exterior-wide-1600.webp';
import exterior480 from '../Img/al-gobbo-2026/exterior-wide-480.webp';
import exterior900 from '../Img/al-gobbo-2026/exterior-wide-900.webp';
import gardenImage from '../Img/al-gobbo-2026/bar-portrait-1200.webp';
import garden480 from '../Img/al-gobbo-2026/bar-portrait-480.webp';
import garden900 from '../Img/al-gobbo-2026/bar-portrait-900.webp';
import closingImage from '../Img/al-gobbo-2026/burrata-portrait-1200.webp';
import closing480 from '../Img/al-gobbo-2026/burrata-portrait-480.webp';
import closing900 from '../Img/al-gobbo-2026/burrata-portrait-900.webp';
import welcomeImage from '../Img/al-gobbo-2026/staff-wide-1600.webp';
import welcome480 from '../Img/al-gobbo-2026/staff-wide-480.webp';
import welcome900 from '../Img/al-gobbo-2026/staff-wide-900.webp';
import roomImage from '../Img/al-gobbo-2026/entrance-portrait-1200.webp';
import room480 from '../Img/al-gobbo-2026/entrance-portrait-480.webp';
import room900 from '../Img/al-gobbo-2026/entrance-portrait-900.webp';
import tableImage from '../Img/al-gobbo-2026/table-portrait-1200.webp';
import table480 from '../Img/al-gobbo-2026/table-portrait-480.webp';
import table900 from '../Img/al-gobbo-2026/table-portrait-900.webp';
import wineImage from '../Img/al-gobbo-2026/wine-wall-portrait-1200.webp';
import wine480 from '../Img/al-gobbo-2026/wine-wall-portrait-480.webp';
import wine900 from '../Img/al-gobbo-2026/wine-wall-portrait-900.webp';
import reservedTableImage from '../Img/al-gobbo-2026/reserved-table-wide-1600.webp';
import reservedTable480 from '../Img/al-gobbo-2026/reserved-table-wide-480.webp';
import reservedTable900 from '../Img/al-gobbo-2026/reserved-table-wide-900.webp';

const heroCopy: Record<Language, {
  scroll: string;
  skip: string;
  eyebrow: string;
  title: string;
  body: string;
  interludeOne: string;
  interludeTwo: string;
  portalKicker: string;
  portalTitle: string;
  portalHint: string;
  reserve: string;
  menu: string;
  place: string;
  privacy: string;
  legal: string;
  developedBy: string;
  imageAlt: string;
}> = {
  it: {
    scroll: 'Scorri', skip: 'Salta introduzione', eyebrow: 'San Polo 649 · a due passi da Rialto',
    title: 'Fuori, Rialto. Dentro, un’altra Venezia.',
    body: 'Una porta, il profumo della cucina, un giardino nascosto. Dal 1955 accogliamo Venezia a tavola.',
    interludeOne: 'Segui il profumo tra le calli.',
    interludeTwo: 'Un passo ancora.\nIl giardino si rivela.',
    portalKicker: 'Il prossimo momento è tuo', portalTitle: 'Il tuo tavolo, a Venezia.',
    portalHint: 'Scegli il giorno. Noi prepariamo il resto.',
    reserve: 'Prenota il tuo tavolo', menu: 'Scopri il menu', place: 'Venezia · San Polo', privacy: 'Privacy', legal: 'Note legali', developedBy: 'Sito di',
    imageAlt: 'La sala interna del Ristorante Al Gobbo di Rialto',
  },
  en: {
    scroll: 'Scroll', skip: 'Skip introduction', eyebrow: 'San Polo 649 · steps from Rialto',
    title: 'Outside, Rialto. Inside, another Venice.',
    body: 'A doorway, the aroma of the kitchen, a hidden garden. Since 1955, we have welcomed Venice to the table.',
    interludeOne: 'Follow the aroma through Venice’s calli.',
    interludeTwo: 'One step further.\nThe garden reveals itself.',
    portalKicker: 'The next moment is yours', portalTitle: 'Your table, in Venice.',
    portalHint: 'Choose the day. We will prepare the rest.',
    reserve: 'Reserve your table', menu: 'View the menu', place: 'Venice · San Polo', privacy: 'Privacy', legal: 'Legal notice', developedBy: 'Website by',
    imageAlt: 'The dining room at Al Gobbo di Rialto restaurant',
  },
  fr: {
    scroll: 'Faites défiler', skip: 'Passer l’introduction', eyebrow: 'San Polo 649 · à deux pas du Rialto',
    title: 'Dehors, le Rialto. Dedans, une autre Venise.',
    body: 'Une porte, les parfums de la cuisine, un jardin caché. Depuis 1955, nous accueillons Venise à table.',
    interludeOne: 'Suivez les parfums dans les calli de Venise.',
    interludeTwo: 'Encore un pas.\nLe jardin se dévoile.',
    portalKicker: 'Le prochain moment est à vous', portalTitle: 'Votre table, à Venise.',
    portalHint: 'Choisissez le jour. Nous préparons le reste.',
    reserve: 'Réserver votre table', menu: 'Voir le menu', place: 'Venise · San Polo', privacy: 'Confidentialité', legal: 'Mentions légales', developedBy: 'Site par',
    imageAlt: 'La salle du restaurant Al Gobbo di Rialto',
  },
  de: {
    scroll: 'Scrollen', skip: 'Einführung überspringen', eyebrow: 'San Polo 649 · wenige Schritte vom Rialto',
    title: 'Draußen Rialto. Drinnen ein anderes Venedig.',
    body: 'Eine Tür, der Duft aus der Küche, ein versteckter Garten. Seit 1955 heißen wir Venedig am Tisch willkommen.',
    interludeOne: 'Folgen Sie dem Duft durch Venedigs Calli.',
    interludeTwo: 'Noch ein Schritt.\nDer Garten zeigt sich.',
    portalKicker: 'Der nächste Moment gehört Ihnen', portalTitle: 'Ihr Tisch, in Venedig.',
    portalHint: 'Wählen Sie den Tag. Wir bereiten den Rest vor.',
    reserve: 'Tisch reservieren', menu: 'Menü ansehen', place: 'Venedig · San Polo', privacy: 'Datenschutz', legal: 'Impressum', developedBy: 'Website von',
    imageAlt: 'Der Gastraum des Restaurants Al Gobbo di Rialto',
  },
  es: {
    scroll: 'Desliza', skip: 'Saltar introducción', eyebrow: 'San Polo 649 · a un paso de Rialto',
    title: 'Fuera, Rialto. Dentro, otra Venecia.',
    body: 'Una puerta, el aroma de la cocina, un jardín escondido. Desde 1955 recibimos a Venecia en la mesa.',
    interludeOne: 'Sigue el aroma por las calli de Venecia.',
    interludeTwo: 'Un paso más.\nEl jardín se revela.',
    portalKicker: 'El próximo momento es tuyo', portalTitle: 'Tu mesa, en Venecia.',
    portalHint: 'Elige el día. Nosotros preparamos el resto.',
    reserve: 'Reserva tu mesa', menu: 'Ver el menú', place: 'Venecia · San Polo', privacy: 'Privacidad', legal: 'Aviso legal', developedBy: 'Sitio de',
    imageAlt: 'El comedor del restaurante Al Gobbo di Rialto',
  },
};

function responsiveSources(small: string, medium: string, large: string, largeWidth = 1500) {
  return `${small} 480w, ${medium} 900w, ${large} ${largeWidth}w`;
}

function ComposingWord({ word, index, progress }: { word: string; index: number; progress: MotionValue<number> }) {
  const enterStart = 0.835 + index * 0.007;
  const enterEnd = enterStart + 0.024;
  const exitStart = 0.9 + index * 0.003;
  const exitEnd = exitStart + 0.04;
  const direction = index % 2 === 0 ? -1 : 1;
  const opacity = useTransform(progress, [enterStart, enterEnd, exitStart, exitEnd], [0, 1, 1, 0]);
  const x = useTransform(progress, [enterStart, enterEnd, exitStart, exitEnd], [direction * 28, 0, 0, direction * -55]);
  const y = useTransform(progress, [enterStart, enterEnd, exitStart, exitEnd], [18, 0, 0, index % 3 === 0 ? -30 : 24]);
  const scale = useTransform(progress, [enterStart, enterEnd, exitStart, exitEnd], [0.94, 1, 1, 0.97]);
  const rotate = useTransform(progress, [enterStart, enterEnd, exitStart, exitEnd], [direction * 1.5, 0, 0, direction * -2]);

  return (
    <motion.span aria-hidden="true" style={{ opacity, x, y, scale, rotate }} className="inline-block will-change-[transform,opacity]">
      {word}
    </motion.span>
  );
}

type HeroPhase = 'prompt' | 'reveal' | 'narrative' | 'portal';

function phaseAt(progress: number): HeroPhase {
  return progress < 0.105 ? 'prompt' : progress < 0.805 ? 'reveal' : progress < 0.965 ? 'narrative' : 'portal';
}

function assetStageAt(progress: number) {
  return progress >= 0.55 ? 7 : progress >= 0.47 ? 6 : progress >= 0.36 ? 5 : progress >= 0.26 ? 4 : progress >= 0.15 ? 3 : progress >= 0.055 ? 2 : 1;
}

function sceneAt(progress: number) {
  return progress < 0.105 ? 0 : progress < 0.22 ? 1 : progress < 0.33 ? 2 : progress < 0.44 ? 3 : progress < 0.55 ? 4 : progress < 0.69 ? 5 : progress < 0.805 ? 6 : 7;
}

const mobileScrollSnapPoints = [0, 0.105, 0.21, 0.32, 0.43, 0.54, 0.64, 0.73, 0.855, 1] as const;

function CinematicHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<HeroPhase>('prompt');
  const [assetStage, setAssetStage] = useState(1);
  const [activeScene, setActiveScene] = useState(0);
  const phaseRef = useRef<HeroPhase>('prompt');
  const assetStageRef = useRef(1);
  const activeSceneRef = useRef(0);
  const prefersReducedMotion = useReducedMotion();
  const { language } = useLanguage();
  const copy = heroCopy[language];
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const followsTouchGesture = typeof window !== 'undefined'
    && window.matchMedia('(max-width: 1023px) and (any-pointer: coarse)').matches;
  const dormantScrollYProgress = useMotionValue(0);
  const smoothScrollYProgress = useSpring(followsTouchGesture ? dormantScrollYProgress : scrollYProgress, {
    stiffness: 190,
    damping: 30,
    mass: 0.45,
    restDelta: 0.0001,
    restSpeed: 0.001,
  });
  const visualScrollYProgress = followsTouchGesture ? scrollYProgress : smoothScrollYProgress;

  const promptOpacity = useTransform(visualScrollYProgress, [0, 0.035, 0.105], [1, 1, 0]);

  const exteriorOpacity = useTransform(visualScrollYProgress, [0.025, 0.06, 0.135, 0.19], [0, 1, 1, 0]);
  const exteriorY = useTransform(visualScrollYProgress, [0.025, 0.19], ['3vh', '-2vh']);
  const exteriorScale = useTransform(visualScrollYProgress, [0.025, 0.19], [0.94, 1.04]);

  const firstOpacity = useTransform(visualScrollYProgress, [0.13, 0.175, 0.24, 0.29], [0, 1, 1, 0]);
  const firstX = useTransform(visualScrollYProgress, [0.13, 0.19, 0.29], ['30vw', '2vw', '-12vw']);
  const firstScale = useTransform(visualScrollYProgress, [0.13, 0.29], [0.96, 1.035]);

  const secondOpacity = useTransform(visualScrollYProgress, [0.235, 0.28, 0.35, 0.4], [0, 1, 1, 0]);
  const secondX = useTransform(visualScrollYProgress, [0.235, 0.295, 0.4], ['-34vw', '-3vw', '10vw']);
  const secondY = useTransform(visualScrollYProgress, [0.235, 0.4], ['4vh', '-2vh']);

  const thirdOpacity = useTransform(visualScrollYProgress, [0.34, 0.39, 0.46, 0.51], [0, 1, 1, 0]);
  const thirdX = useTransform(visualScrollYProgress, [0.34, 0.4, 0.51], ['38vw', '4vw', '-8vw']);
  const thirdY = useTransform(visualScrollYProgress, [0.34, 0.51], ['-3vh', '2vh']);

  const wineOpacity = useTransform(visualScrollYProgress, [0.445, 0.495, 0.565, 0.615], [0, 1, 1, 0]);
  const wineX = useTransform(visualScrollYProgress, [0.445, 0.51, 0.615], ['-38vw', '-4vw', '9vw']);
  const wineY = useTransform(visualScrollYProgress, [0.445, 0.615], ['4vh', '-2vh']);
  const wineScale = useTransform(visualScrollYProgress, [0.445, 0.615], [0.96, 1.025]);

  const clusterOpacity = useTransform(visualScrollYProgress, [0.55, 0.595, 0.675, 0.72], [0, 1, 1, 0]);
  const reservedOpacity = useTransform(visualScrollYProgress, [0.55, 0.59, 0.68, 0.72], [0, 1, 1, 0]);
  const reservedScale = useTransform(visualScrollYProgress, [0.55, 0.72], [0.88, 1.04]);
  const burrataClusterOpacity = useTransform(visualScrollYProgress, [0.57, 0.61, 0.68, 0.72], [0, 1, 1, 0]);
  const burrataClusterX = useTransform(visualScrollYProgress, [0.57, 0.68], ['38vw', '28vw']);
  const staffClusterOpacity = useTransform(visualScrollYProgress, [0.585, 0.625, 0.68, 0.72], [0, 1, 1, 0]);
  const staffClusterX = useTransform(visualScrollYProgress, [0.585, 0.68], ['-38vw', '-24vw']);
  const staffClusterY = useTransform(visualScrollYProgress, [0.585, 0.68], ['20vh', '24vh']);

  const mainOpacity = useTransform(visualScrollYProgress, [0.675, 0.715, 0.93, 0.99], [0, 1, 1, 0.2]);
  const mainScale = useTransform(visualScrollYProgress, [0.675, 0.72, 0.79, 0.88], [0.46, 0.82, 1.04, 1]);
  const shadeOpacity = useTransform(visualScrollYProgress, [0.67, 0.715], [0, 1]);
  const interludeOneOpacity = useTransform(visualScrollYProgress, [0.69, 0.72, 0.75, 0.775], [0, 1, 1, 0]);
  const interludeOneY = useTransform(visualScrollYProgress, [0.69, 0.72, 0.75, 0.775], [18, 0, 0, -18]);
  const interludeTwoOpacity = useTransform(visualScrollYProgress, [0.765, 0.795, 0.825, 0.85], [0, 1, 1, 0]);
  const interludeTwoY = useTransform(visualScrollYProgress, [0.765, 0.795, 0.825, 0.85], [18, 0, 0, -18]);
  const narrativeOpacity = useTransform(visualScrollYProgress, [0.835, 0.855, 0.9, 0.948], [0, 1, 1, 0]);
  const portalBackdropOpacity = useTransform(visualScrollYProgress, [0.92, 0.97], [0, 1]);
  const portalOpacity = useTransform(visualScrollYProgress, [0.95, 0.985], [0, 1]);
  const portalY = useTransform(visualScrollYProgress, [0.95, 0.985], [32, 0]);
  const skipOpacity = useTransform(visualScrollYProgress, [0, 0.025, 0.075, 0.9, 0.97], [0, 0, 1, 1, 0]);

  useEffect(() => {
    const visualProgress = visualScrollYProgress.get();
    const nextPhase = phaseAt(visualProgress);
    const nextAssetStage = assetStageAt(scrollYProgress.get());
    const nextScene = sceneAt(visualProgress);
    phaseRef.current = nextPhase;
    assetStageRef.current = nextAssetStage;
    activeSceneRef.current = nextScene;
    setPhase(nextPhase);
    setAssetStage(nextAssetStage);
    setActiveScene(nextScene);
  }, [scrollYProgress, visualScrollYProgress]);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    const previousThemeColor = themeColor?.content;
    root.dataset.homeIntroActive = 'true';
    themeColor?.setAttribute('content', '#050505');
    window.dispatchEvent(new CustomEvent('al-gobbo:intro-visibility', {
      detail: { active: true },
    }));
    return () => {
      delete root.dataset.homeIntroActive;
      if (themeColor && previousThemeColor) themeColor.content = previousThemeColor;
      window.dispatchEvent(new CustomEvent('al-gobbo:intro-visibility', {
        detail: { active: false },
      }));
    };
  }, []);

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const nextAssetStage = assetStageAt(progress);
    if (nextAssetStage > assetStageRef.current) {
      assetStageRef.current = nextAssetStage;
      setAssetStage(nextAssetStage);
    }
  });

  useMotionValueEvent(visualScrollYProgress, 'change', (progress) => {
    const nextPhase = phaseAt(progress);
    if (phaseRef.current !== nextPhase) {
      phaseRef.current = nextPhase;
      setPhase(nextPhase);
      const introIsActive = nextPhase !== 'portal';
      document.documentElement.dataset.homeIntroActive = String(introIsActive);
      document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content', introIsActive ? '#050505' : '#191612');
      window.dispatchEvent(new CustomEvent('al-gobbo:intro-visibility', {
        detail: { active: introIsActive },
      }));
    }

    const nextScene = sceneAt(progress);
    if (activeSceneRef.current !== nextScene) {
      activeSceneRef.current = nextScene;
      setActiveScene(nextScene);
    }

  });

  const moveToReveal = () => {
    const section = sectionRef.current;
    if (!section) return;
    const trackHeight = Math.max(section.offsetHeight - window.innerHeight, 0);
    window.scrollTo({ top: section.offsetTop + trackHeight * 0.125, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };

  const skipIntro = () => {
    const landing = document.getElementById('home-standard-landing');
    if (!landing) return;
    landing.scrollIntoView({ block: 'start', behavior: 'auto' });
    window.requestAnimationFrame(() => {
      document.getElementById('home-standard-reservation-link')?.focus({ preventScroll: true });
    });
  };

  const heroSrcSet = `${hero480} 480w, ${hero900} 900w, ${hero1200} 1200w, ${heroImage} 1600w`;
  const exteriorSrcSet = responsiveSources(exterior480, exterior900, exteriorImage, 1600);
  const roomSrcSet = responsiveSources(room480, room900, roomImage, 1200);
  const tableSrcSet = responsiveSources(table480, table900, tableImage, 1200);
  const gardenSrcSet = responsiveSources(garden480, garden900, gardenImage, 1200);
  const closingSrcSet = responsiveSources(closing480, closing900, closingImage, 1200);
  const welcomeSrcSet = responsiveSources(welcome480, welcome900, welcomeImage, 1600);
  const wineSrcSet = responsiveSources(wine480, wine900, wineImage, 1200);
  const reservedTableSrcSet = responsiveSources(reservedTable480, reservedTable900, reservedTableImage, 1600);

  if (prefersReducedMotion) {
    return (
      <section ref={sectionRef} className="relative flex min-h-[100svh] items-end overflow-hidden bg-[#050505] px-5 pb-16 pt-28 text-white sm:px-8 lg:px-12" aria-labelledby="home-title">
        <img src={heroImage} srcSet={heroSrcSet} sizes="100vw" alt={copy.imageAlt} className="absolute inset-0 h-full w-full object-cover" loading="eager" decoding="async" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative mx-auto w-full max-w-[1480px]">
          <p id="home-intro-story" className="mb-7 max-w-xl font-serif text-xl italic leading-7 text-white/80 sm:text-2xl">
            <span className="block">{copy.interludeOne}</span>
            <span className="mt-2 block whitespace-pre-line">{copy.interludeTwo}</span>
          </p>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-venetian-gold">{copy.portalKicker}</p>
          <h1 id="home-title" className="mt-5 max-w-[11ch] font-serif text-[clamp(2.75rem,13vw,8.8rem)] font-semibold leading-[0.82] tracking-[-0.05em] sm:leading-[0.79]">{copy.portalTitle}</h1>
          <p className="mt-7 max-w-xl border-l border-white/50 pl-5 text-base leading-7 text-white/90 sm:text-lg">{copy.portalHint}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link id="home-reservation-link" to="/book" className="inline-flex min-h-[52px] items-center gap-3 bg-venetian-gold px-6 text-xs font-bold uppercase tracking-[0.14em] text-venetian-brown focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#050505]">{copy.reserve}<ArrowRight className="h-4 w-4" /></Link>
            <Link to="/menu" className="inline-flex min-h-11 items-center gap-2 border border-white/40 px-5 text-[0.66rem] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:border-venetian-gold hover:text-venetian-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#050505]">{copy.menu}<ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="mt-8 max-w-2xl text-[0.66rem] leading-5 text-white/55">
            <p>{restaurantLegalIdentity.legalName} · P.IVA/C.F. IT{restaurantLegalIdentity.vatNumber}</p>
            <p><Link to="/privacy" className="underline underline-offset-4 hover:text-white">{copy.privacy}</Link> · <Link to="/legal" className="underline underline-offset-4 hover:text-white">{copy.legal}</Link> · {copy.developedBy}{' '}<a href={developerLegalIdentity.website} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-white">{developerLegalIdentity.brand} SRLS · P.IVA IT{developerLegalIdentity.vatNumber}</a></p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="home-scroll-intro" className="relative h-[600svh] touch-pan-y bg-[#050505] sm:h-[625svh] lg:h-[655svh]" aria-labelledby="home-title">
      {mobileScrollSnapPoints.map((progress) => {
        const offset = progress * 100;
        return (
          <span
            key={progress}
            aria-hidden="true"
            className="home-scroll-snap-point pointer-events-none absolute left-0 h-px w-px"
            style={{ top: `calc(${offset}% - ${offset}dvh)` }}
          />
        );
      })}
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[#050505]">
        <h1 id="home-title" className="sr-only">{copy.title}</h1>
        <p id="home-intro-story" className="sr-only">{copy.interludeOne} {copy.interludeTwo}</p>
        <button type="button" onClick={skipIntro} tabIndex={phase === 'prompt' ? 0 : -1} className="sr-only z-50 bg-white px-4 py-3 text-sm font-semibold text-venetian-brown focus:not-sr-only focus:absolute focus:right-4 focus:top-4">{copy.skip}</button>
        <motion.button type="button" onClick={skipIntro} tabIndex={phase === 'reveal' || phase === 'narrative' ? 0 : -1} aria-hidden={phase === 'prompt' || phase === 'portal'} style={{ opacity: skipOpacity }} className={`absolute right-4 top-4 z-50 min-h-11 border border-white/25 bg-black/80 px-4 text-[0.66rem] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:border-venetian-gold hover:text-venetian-gold sm:right-6 sm:top-6 ${phase === 'reveal' || phase === 'narrative' ? 'pointer-events-auto' : 'pointer-events-none'}`}>{copy.skip}</motion.button>

        {phase === 'prompt' ? <motion.div style={{ opacity: promptOpacity }} className="pointer-events-none absolute inset-0 z-40 grid place-items-center" aria-hidden="false">
          <button type="button" onClick={moveToReveal} className="group pointer-events-auto flex min-h-24 min-w-24 flex-col items-center justify-center gap-4 text-white" aria-label={copy.scroll}>
            <span className="text-xs font-bold uppercase tracking-[0.28em]">{copy.scroll}</span>
            <motion.span animate={{ y: [0, 9, 0] }} transition={{ duration: 1.55, repeat: Infinity, ease: 'easeInOut' }} className="grid h-11 w-11 place-items-center rounded-full border border-white/25 transition-colors group-hover:border-venetian-gold group-hover:text-venetian-gold">
              <ArrowDown className="h-4 w-4" />
            </motion.span>
          </button>
        </motion.div> : null}

        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[9] bg-[radial-gradient(circle_at_50%_45%,rgba(207,164,89,0.13),transparent_48%)]" />

        {activeScene <= 1 ? <div aria-hidden="true" className="absolute left-1/2 top-1/2 z-10 h-[56svh] w-[92vw] -translate-x-1/2 -translate-y-1/2 sm:h-[66svh] sm:w-[78vw] lg:h-[70svh] lg:w-[68vw] lg:max-w-[1120px]">
          <motion.img src={exteriorImage} srcSet={exteriorSrcSet} sizes="(min-width: 1024px) 68vw, (min-width: 640px) 78vw, 92vw" alt="" style={{ opacity: exteriorOpacity, y: exteriorY, scale: exteriorScale }} className="h-full w-full border border-[#e0bf78]/30 bg-[#17130f] object-cover object-[50%_48%] shadow-[0_34px_120px_rgba(0,0,0,0.62)] saturate-[0.9] contrast-[1.04] will-change-[transform,opacity]" loading="eager" decoding="async" />
        </div> : null}

        {assetStage >= 2 && activeScene <= 2 ? <div aria-hidden="true" className="absolute left-1/2 top-1/2 z-[11] h-[66svh] w-[80vw] max-w-[560px] -translate-x-1/2 -translate-y-1/2 sm:h-[70svh] sm:w-[52vw] lg:w-[42vw] lg:max-w-[670px]">
          <motion.img src={roomImage} srcSet={roomSrcSet} sizes="(min-width: 1024px) 42vw, (min-width: 640px) 52vw, 80vw" alt="" style={{ opacity: firstOpacity, x: firstX, scale: firstScale }} className="h-full w-full border border-[#e0bf78]/25 bg-[#17130f] object-cover shadow-[0_32px_110px_rgba(0,0,0,0.6)] saturate-[0.9] contrast-[1.04] will-change-[transform,opacity]" loading="lazy" decoding="async" />
        </div> : null}

        {assetStage >= 3 && activeScene >= 1 && activeScene <= 3 ? (
          <div aria-hidden="true" className="absolute left-1/2 top-1/2 z-[12] h-[68svh] w-[82vw] max-w-[570px] -translate-x-1/2 -translate-y-1/2 sm:h-[70svh] sm:w-[50vw] lg:w-[40vw] lg:max-w-[650px]">
            <motion.img src={tableImage} srcSet={tableSrcSet} sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 82vw" alt="" style={{ opacity: secondOpacity, x: secondX, y: secondY }} className="h-full w-full border border-[#e0bf78]/25 bg-[#17130f] object-cover shadow-[0_32px_110px_rgba(0,0,0,0.6)] saturate-[0.9] contrast-[1.04] will-change-[transform,opacity]" loading="lazy" decoding="async" />
          </div>
        ) : null}

        {assetStage >= 4 && activeScene >= 2 && activeScene <= 4 ? (
          <div aria-hidden="true" className="absolute left-1/2 top-1/2 z-[13] h-[66svh] w-[82vw] max-w-[570px] -translate-x-1/2 -translate-y-1/2 sm:h-[70svh] sm:w-[52vw] lg:w-[42vw] lg:max-w-[680px]">
            <motion.img src={gardenImage} srcSet={gardenSrcSet} sizes="(min-width: 1024px) 42vw, (min-width: 640px) 52vw, 82vw" alt="" style={{ opacity: thirdOpacity, x: thirdX, y: thirdY }} className="h-full w-full border border-[#e0bf78]/25 bg-[#17130f] object-cover shadow-[0_32px_110px_rgba(0,0,0,0.6)] saturate-[0.9] contrast-[1.04] will-change-[transform,opacity]" loading="lazy" decoding="async" />
          </div>
        ) : null}

        {assetStage >= 5 && activeScene >= 3 && activeScene <= 5 ? (
          <div aria-hidden="true" className="absolute left-1/2 top-1/2 z-[14] h-[70svh] w-[82vw] max-w-[590px] -translate-x-1/2 -translate-y-1/2 sm:h-[74svh] sm:w-[48vw] lg:w-[38vw] lg:max-w-[610px]">
            <motion.img src={wineImage} srcSet={wineSrcSet} sizes="(min-width: 1024px) 38vw, (min-width: 640px) 48vw, 82vw" alt="" style={{ opacity: wineOpacity, x: wineX, y: wineY, scale: wineScale }} className="h-full w-full border border-[#e0bf78]/30 bg-[#17130f] object-cover shadow-[0_34px_120px_rgba(0,0,0,0.64)] saturate-[0.88] contrast-[1.05] will-change-[transform,opacity]" loading="lazy" decoding="async" />
          </div>
        ) : null}

        {assetStage >= 6 && activeScene >= 4 && activeScene <= 6 ? <motion.div aria-hidden="true" style={{ opacity: clusterOpacity }} className="absolute inset-0 z-[15] will-change-[opacity]">
          <div className="absolute left-1/2 top-[45%] h-[52svh] w-[92vw] -translate-x-1/2 -translate-y-1/2 sm:h-[60svh] sm:w-[72vw] lg:h-[64svh] lg:w-[58vw] lg:max-w-[960px]">
            <motion.img src={reservedTableImage} srcSet={reservedTableSrcSet} sizes="(min-width: 1024px) 58vw, (min-width: 640px) 72vw, 92vw" alt="" style={{ opacity: reservedOpacity, scale: reservedScale }} className="h-full w-full border border-[#e0bf78]/30 bg-[#17130f] object-cover shadow-[0_38px_130px_rgba(0,0,0,0.68)] saturate-[0.9] contrast-[1.05] will-change-[transform,opacity]" loading="lazy" decoding="async" />
          </div>
          <div className="absolute left-1/2 top-[47%] h-[50svh] w-[42vw] max-w-[330px] -translate-x-1/2 -translate-y-1/2 rotate-[1.5deg] sm:h-[56svh] sm:w-[29vw] lg:w-[21vw] lg:max-w-[350px]">
            <motion.img src={closingImage} srcSet={closingSrcSet} sizes="(min-width: 1024px) 21vw, (min-width: 640px) 29vw, 42vw" alt="" style={{ opacity: burrataClusterOpacity, x: burrataClusterX }} className="h-full w-full border border-[#e0bf78]/25 bg-[#17130f] object-cover shadow-[0_30px_100px_rgba(0,0,0,0.62)] saturate-[0.92] contrast-[1.04] will-change-[transform,opacity]" loading="lazy" decoding="async" />
          </div>
          <div className="absolute left-1/2 top-1/2 h-[25svh] w-[60vw] -translate-x-1/2 -translate-y-1/2 -rotate-[1.25deg] sm:h-[30svh] sm:w-[44vw] lg:h-[33svh] lg:w-[36vw] lg:max-w-[590px]">
            <motion.img src={welcomeImage} srcSet={welcomeSrcSet} sizes="(min-width: 1024px) 36vw, (min-width: 640px) 44vw, 60vw" alt="" style={{ opacity: staffClusterOpacity, x: staffClusterX, y: staffClusterY }} className="h-full w-full border border-[#e0bf78]/25 bg-[#17130f] object-cover object-[28%_center] shadow-[0_30px_100px_rgba(0,0,0,0.62)] saturate-[0.9] contrast-[1.04] will-change-[transform,opacity]" loading="lazy" decoding="async" />
          </div>
        </motion.div> : null}

        {assetStage >= 7 && activeScene >= 5 ? <motion.img
          src={heroImage}
          srcSet={heroSrcSet}
          sizes="100vw"
          alt={copy.imageAlt}
          style={{ opacity: mainOpacity, scale: mainScale }}
          className="absolute inset-0 z-20 h-full w-full object-cover will-change-[transform,opacity]"
          loading="lazy"
          decoding="async"
        /> : null}
        <motion.div style={{ opacity: shadeOpacity }} className="absolute inset-0 z-20 bg-[linear-gradient(0deg,rgba(16,14,12,0.88)_0%,rgba(16,14,12,0.52)_62%,rgba(16,14,12,0.22)_100%)] lg:bg-[linear-gradient(90deg,rgba(16,14,12,0.9)_0%,rgba(16,14,12,0.48)_50%,rgba(16,14,12,0.12)_100%),linear-gradient(0deg,rgba(16,14,12,0.64)_0%,transparent_50%)]" />

        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[29] flex items-center justify-center px-6 text-center">
          <motion.p style={{ opacity: interludeOneOpacity, y: interludeOneY }} className="max-w-[25ch] text-balance text-[clamp(0.82rem,2.4vw,1.35rem)] font-semibold uppercase leading-[1.55] tracking-[0.2em] text-white/90 will-change-[transform,opacity]">
            <span className="mx-auto mb-6 block h-px w-12 bg-venetian-gold/80" />
            {copy.interludeOne}
          </motion.p>
        </div>

        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[29] flex items-center justify-center px-6 text-center">
          <motion.p style={{ opacity: interludeTwoOpacity, y: interludeTwoY }} className="max-w-[17ch] whitespace-pre-line text-balance font-serif text-[clamp(2.6rem,11vw,7.25rem)] font-medium italic leading-[0.88] tracking-[-0.035em] text-white will-change-[transform,opacity]">
            {copy.interludeTwo}
          </motion.p>
        </div>

        <motion.div
          style={{ opacity: narrativeOpacity }}
          className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-5 sm:px-8 lg:px-12"
          aria-hidden={phase !== 'narrative'}
        >
          <div className="mx-auto w-full max-w-[1480px] text-center">
            <p className="mb-7 text-[0.66rem] font-bold uppercase tracking-[0.24em] text-venetian-gold sm:mb-10 sm:text-xs">{copy.eyebrow}</p>
            <h2 aria-label={copy.title} className="mx-auto flex max-w-[12ch] flex-wrap justify-center gap-x-[0.2em] gap-y-[0.05em] font-serif text-[clamp(3.3rem,15vw,9.5rem)] font-semibold leading-[0.82] tracking-[-0.055em] text-white sm:leading-[0.78]">
              {copy.title.split(' ').map((word, index) => (
                <ComposingWord key={`${word}-${index}`} word={word} index={index} progress={visualScrollYProgress} />
              ))}
            </h2>
          </div>
        </motion.div>

        <motion.div
          aria-hidden="true"
          style={{ opacity: portalBackdropOpacity }}
          className="absolute inset-0 z-[31] bg-[radial-gradient(circle_at_50%_42%,rgba(180,71,50,0.22),transparent_34%),linear-gradient(180deg,rgba(16,15,13,0.92),#100f0d)]"
        />

        <motion.div
          id="reservation-portal"
          style={{ opacity: portalOpacity, y: portalY }}
          className={`absolute inset-0 z-[32] flex items-center justify-center px-5 pb-[env(safe-area-inset-bottom)] text-center sm:px-8 ${phase === 'portal' ? '' : 'pointer-events-none'}`}
          aria-hidden={phase !== 'portal'}
        >
          <div className="mx-auto w-full max-w-5xl">
            <p className="text-[0.66rem] font-bold uppercase tracking-[0.26em] text-venetian-gold sm:text-xs">{copy.portalKicker}</p>
            <h2 className="mx-auto mt-7 max-w-[10ch] font-serif text-[clamp(3.7rem,17vw,9.8rem)] font-semibold leading-[0.8] tracking-[-0.06em] text-white">{copy.portalTitle}</h2>
            <p className="mx-auto mt-7 max-w-md text-sm leading-6 text-white/75 sm:text-base">{copy.portalHint}</p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                id="home-reservation-link"
                to="/book"
                tabIndex={phase === 'portal' ? 0 : -1}
                className="group inline-flex min-h-[58px] items-center justify-center gap-4 border border-venetian-gold bg-venetian-gold px-7 text-xs font-bold uppercase tracking-[0.16em] text-venetian-brown transition-colors hover:bg-transparent hover:text-venetian-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#100f0d] sm:min-h-16 sm:px-10"
              >
                {copy.reserve}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/menu"
                tabIndex={phase === 'portal' ? 0 : -1}
                className="group inline-flex min-h-11 items-center justify-center gap-2 border border-white/35 px-5 text-[0.66rem] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:border-venetian-gold hover:text-venetian-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#100f0d]"
              >
                {copy.menu}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <p className="mt-8 text-[0.64rem] font-bold uppercase tracking-[0.22em] text-white/50">{copy.place}</p>
            <div className="mx-auto mt-5 max-w-3xl text-[0.58rem] leading-4 text-white/40 sm:text-[0.64rem]">
              <p>{restaurantLegalIdentity.legalName} · P.IVA/C.F. IT{restaurantLegalIdentity.vatNumber}</p>
              <p className="mt-1"><Link to="/privacy" tabIndex={phase === 'portal' ? 0 : -1} className="underline underline-offset-4 hover:text-white">{copy.privacy}</Link> · <Link to="/legal" tabIndex={phase === 'portal' ? 0 : -1} className="underline underline-offset-4 hover:text-white">{copy.legal}</Link> · {copy.developedBy}{' '}<a href={developerLegalIdentity.website} target="_blank" rel="noopener noreferrer" tabIndex={phase === 'portal' ? 0 : -1} className="underline underline-offset-4 hover:text-white">{developerLegalIdentity.brand} SRLS · P.IVA IT{developerLegalIdentity.vatNumber}</a></p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function Hero() {
  const [showCinematicIntro] = useState(shouldPlayHomeIntro);

  useLayoutEffect(() => {
    markHomeIntroSeen();
  }, []);

  return showCinematicIntro ? (
    <>
      <CinematicHero />
      <HomeLanding headingId="home-standard-title" reservationLinkId="home-standard-reservation-link" />
    </>
  ) : <HomeLanding />;
}
