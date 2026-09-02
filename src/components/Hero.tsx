import { ArrowDown, ArrowRight } from 'lucide-react';
import { motion, type MotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage, type Language } from '../lib/i18n';
import heroImage from '../Img/G1/IMG_2922.webp';
import hero480 from '../Img/G1/IMG_2922-480.webp';
import hero900 from '../Img/G1/IMG_2922-900.webp';
import hero1200 from '../Img/G1/IMG_2922-1200.webp';
import gardenImage from '../Img/G1/IMG_2934.webp';
import garden480 from '../Img/G1/IMG_2934-480.webp';
import garden900 from '../Img/G1/IMG_2934-900.webp';
import closingImage from '../Img/G1/IMG_2939.webp';
import closing480 from '../Img/G1/IMG_2939-480.webp';
import closing900 from '../Img/G1/IMG_2939-900.webp';
import welcomeImage from '../Img/G1/IMG_2944.webp';
import welcome480 from '../Img/G1/IMG_2944-480.webp';
import welcome900 from '../Img/G1/IMG_2944-900.webp';
import roomImage from '../Img/G1/IMG_2965.webp';
import room480 from '../Img/G1/IMG_2965-480.webp';
import room900 from '../Img/G1/IMG_2965-900.webp';
import tableImage from '../Img/G1/IMG_2995.webp';
import table480 from '../Img/G1/IMG_2995-480.webp';
import table900 from '../Img/G1/IMG_2995-900.webp';

const heroCopy: Record<Language, {
  scroll: string;
  skip: string;
  eyebrow: string;
  title: string;
  body: string;
  portalKicker: string;
  portalTitle: string;
  portalHint: string;
  reserve: string;
  place: string;
  imageAlt: string;
}> = {
  it: {
    scroll: 'Scorri', skip: 'Salta introduzione', eyebrow: 'San Polo 649 · a due passi da Rialto',
    title: 'Fuori, Rialto. Dentro, un’altra Venezia.',
    body: 'Una porta, il profumo della cucina, un giardino nascosto. Dal 1955 accogliamo Venezia a tavola.',
    portalKicker: 'Il prossimo momento è tuo', portalTitle: 'Il tuo tavolo, a Venezia.',
    portalHint: 'Scegli il giorno. Noi prepariamo il resto.',
    reserve: 'Prenota il tuo tavolo', place: 'Venezia · San Polo',
    imageAlt: 'Il giardino interno del Ristorante Al Gobbo di Rialto',
  },
  en: {
    scroll: 'Scroll', skip: 'Skip introduction', eyebrow: 'San Polo 649 · steps from Rialto',
    title: 'Outside, Rialto. Inside, another Venice.',
    body: 'A doorway, the aroma of the kitchen, a hidden garden. Since 1955, we have welcomed Venice to the table.',
    portalKicker: 'The next moment is yours', portalTitle: 'Your table, in Venice.',
    portalHint: 'Choose the day. We will prepare the rest.',
    reserve: 'Reserve your table', place: 'Venice · San Polo',
    imageAlt: 'The hidden garden at Al Gobbo di Rialto restaurant',
  },
  fr: {
    scroll: 'Faites défiler', skip: 'Passer l’introduction', eyebrow: 'San Polo 649 · à deux pas du Rialto',
    title: 'Dehors, le Rialto. Dedans, une autre Venise.',
    body: 'Une porte, les parfums de la cuisine, un jardin caché. Depuis 1955, nous accueillons Venise à table.',
    portalKicker: 'Le prochain moment est à vous', portalTitle: 'Votre table, à Venise.',
    portalHint: 'Choisissez le jour. Nous préparons le reste.',
    reserve: 'Réserver votre table', place: 'Venise · San Polo',
    imageAlt: 'Le jardin intérieur du restaurant Al Gobbo di Rialto',
  },
  de: {
    scroll: 'Scrollen', skip: 'Einführung überspringen', eyebrow: 'San Polo 649 · wenige Schritte vom Rialto',
    title: 'Draußen Rialto. Drinnen ein anderes Venedig.',
    body: 'Eine Tür, der Duft aus der Küche, ein versteckter Garten. Seit 1955 heißen wir Venedig am Tisch willkommen.',
    portalKicker: 'Der nächste Moment gehört Ihnen', portalTitle: 'Ihr Tisch, in Venedig.',
    portalHint: 'Wählen Sie den Tag. Wir bereiten den Rest vor.',
    reserve: 'Tisch reservieren', place: 'Venedig · San Polo',
    imageAlt: 'Der versteckte Garten des Restaurants Al Gobbo di Rialto',
  },
  es: {
    scroll: 'Desliza', skip: 'Saltar introducción', eyebrow: 'San Polo 649 · a un paso de Rialto',
    title: 'Fuera, Rialto. Dentro, otra Venecia.',
    body: 'Una puerta, el aroma de la cocina, un jardín escondido. Desde 1955 recibimos a Venecia en la mesa.',
    portalKicker: 'El próximo momento es tuyo', portalTitle: 'Tu mesa, en Venecia.',
    portalHint: 'Elige el día. Nosotros preparamos el resto.',
    reserve: 'Reserva tu mesa', place: 'Venecia · San Polo',
    imageAlt: 'El jardín interior del restaurante Al Gobbo di Rialto',
  },
};

function responsiveSources(small: string, medium: string, large: string, largeWidth = 1500) {
  return `${small} 480w, ${medium} 900w, ${large} ${largeWidth}w`;
}

function ComposingWord({ word, index, progress }: { word: string; index: number; progress: MotionValue<number> }) {
  const enterStart = 0.665 + index * 0.018;
  const enterEnd = enterStart + 0.034;
  const exitStart = 0.848 + index * 0.006;
  const exitEnd = exitStart + 0.05;
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
  return progress < 0.13 ? 'prompt' : progress < 0.64 ? 'reveal' : progress < 0.92 ? 'narrative' : 'portal';
}

function assetStageAt(progress: number) {
  return progress >= 0.48 ? 5 : progress >= 0.32 ? 4 : progress >= 0.18 ? 3 : 2;
}

function sceneAt(progress: number) {
  return progress < 0.13 ? 0 : progress < 0.28 ? 1 : progress < 0.4 ? 2 : progress < 0.53 ? 3 : progress < 0.65 ? 4 : 5;
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<HeroPhase>('prompt');
  const [assetStage, setAssetStage] = useState(2);
  const [activeScene, setActiveScene] = useState(0);
  const phaseRef = useRef<HeroPhase>('prompt');
  const assetStageRef = useRef(2);
  const activeSceneRef = useRef(0);
  const pendingPortalFocusRef = useRef(false);
  const portalFocusFrameRef = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const { language } = useLanguage();
  const copy = heroCopy[language];
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const smoothScrollYProgress = useSpring(scrollYProgress, {
    stiffness: 190,
    damping: 30,
    mass: 0.45,
    restDelta: 0.0001,
    restSpeed: 0.001,
  });

  const promptOpacity = useTransform(smoothScrollYProgress, [0, 0.055, 0.13], [1, 1, 0]);

  const firstOpacity = useTransform(smoothScrollYProgress, [0.05, 0.105, 0.21, 0.27], [0, 1, 1, 0]);
  const firstX = useTransform(smoothScrollYProgress, [0.07, 0.26], ['0vw', '-12vw']);
  const firstScale = useTransform(smoothScrollYProgress, [0.07, 0.26], [0.94, 1.03]);

  const secondOpacity = useTransform(smoothScrollYProgress, [0.18, 0.235, 0.31, 0.37], [0, 1, 1, 0]);
  const secondX = useTransform(smoothScrollYProgress, [0.18, 0.25, 0.36], ['38vw', '5vw', '-8vw']);
  const secondY = useTransform(smoothScrollYProgress, [0.18, 0.36], ['5vh', '-2vh']);

  const thirdOpacity = useTransform(smoothScrollYProgress, [0.29, 0.35, 0.43, 0.49], [0, 1, 1, 0]);
  const thirdX = useTransform(smoothScrollYProgress, [0.29, 0.37, 0.48], ['-40vw', '-5vw', '8vw']);
  const thirdY = useTransform(smoothScrollYProgress, [0.29, 0.48], ['-4vh', '3vh']);

  const clusterOpacity = useTransform(smoothScrollYProgress, [0.42, 0.48, 0.57, 0.63], [0, 1, 1, 0]);
  const clusterOneOpacity = useTransform(smoothScrollYProgress, [0.42, 0.465, 0.575, 0.625], [0, 1, 1, 0]);
  const clusterTwoOpacity = useTransform(smoothScrollYProgress, [0.45, 0.495, 0.58, 0.63], [0, 1, 1, 0]);
  const clusterThreeOpacity = useTransform(smoothScrollYProgress, [0.48, 0.525, 0.585, 0.635], [0, 1, 1, 0]);
  const clusterLeftX = useTransform(smoothScrollYProgress, [0.42, 0.56], ['-12vw', '-24vw']);
  const clusterRightX = useTransform(smoothScrollYProgress, [0.45, 0.57], ['13vw', '25vw']);
  const clusterBottomY = useTransform(smoothScrollYProgress, [0.48, 0.59], ['18vh', '25vh']);

  const mainOpacity = useTransform(smoothScrollYProgress, [0.54, 0.59, 0.9, 0.97], [0, 1, 1, 0.2]);
  const mainScale = useTransform(smoothScrollYProgress, [0.54, 0.6, 0.67, 0.82], [0.28, 0.58, 1.04, 1]);
  const shadeOpacity = useTransform(smoothScrollYProgress, [0.61, 0.69], [0, 1]);
  const narrativeOpacity = useTransform(smoothScrollYProgress, [0.64, 0.675, 0.88, 0.925], [0, 1, 1, 0]);
  const portalBackdropOpacity = useTransform(smoothScrollYProgress, [0.87, 0.95], [0, 1]);
  const portalOpacity = useTransform(smoothScrollYProgress, [0.91, 0.965], [0, 1]);
  const portalY = useTransform(smoothScrollYProgress, [0.91, 0.98], [32, 0]);
  const skipOpacity = useTransform(smoothScrollYProgress, [0, 0.04, 0.11, 0.86, 0.92], [0, 0, 1, 1, 0]);

  useEffect(() => {
    const visualProgress = smoothScrollYProgress.get();
    const nextPhase = phaseAt(visualProgress);
    const nextAssetStage = assetStageAt(scrollYProgress.get());
    const nextScene = sceneAt(visualProgress);
    phaseRef.current = nextPhase;
    assetStageRef.current = nextAssetStage;
    activeSceneRef.current = nextScene;
    setPhase(nextPhase);
    setAssetStage(nextAssetStage);
    setActiveScene(nextScene);
  }, [scrollYProgress, smoothScrollYProgress]);

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
      pendingPortalFocusRef.current = false;
      if (portalFocusFrameRef.current !== null) {
        window.cancelAnimationFrame(portalFocusFrameRef.current);
      }
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

  useMotionValueEvent(smoothScrollYProgress, 'change', (progress) => {
    const nextPhase = phaseAt(progress);
    if (phaseRef.current !== nextPhase) {
      phaseRef.current = nextPhase;
      setPhase(nextPhase);
    }

    const nextScene = sceneAt(progress);
    if (activeSceneRef.current !== nextScene) {
      activeSceneRef.current = nextScene;
      setActiveScene(nextScene);
    }

    if (nextPhase === 'portal' && pendingPortalFocusRef.current) {
      pendingPortalFocusRef.current = false;
      portalFocusFrameRef.current = window.requestAnimationFrame(() => {
        document.getElementById('home-reservation-link')?.focus({ preventScroll: true });
        portalFocusFrameRef.current = null;
      });
    }
  });

  const moveToReveal = () => {
    const top = sectionRef.current?.offsetTop ?? 0;
    window.scrollTo({ top: top + window.innerHeight * 0.38, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };

  const skipIntro = () => {
    const section = sectionRef.current;
    if (!section) return;
    const targetTop = section.offsetTop + section.offsetHeight - window.innerHeight;
    pendingPortalFocusRef.current = true;
    window.scrollTo({ top: targetTop, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };

  const heroSrcSet = `${hero480} 480w, ${hero900} 900w, ${hero1200} 1200w, ${heroImage} 1500w`;
  const roomSrcSet = responsiveSources(room480, room900, roomImage, 1125);
  const tableSrcSet = responsiveSources(table480, table900, tableImage);
  const gardenSrcSet = responsiveSources(garden480, garden900, gardenImage, 1125);
  const closingSrcSet = responsiveSources(closing480, closing900, closingImage, 1125);
  const welcomeSrcSet = responsiveSources(welcome480, welcome900, welcomeImage, 1125);

  if (prefersReducedMotion) {
    return (
      <section ref={sectionRef} className="relative flex min-h-[100svh] items-end overflow-hidden bg-[#050505] px-5 pb-16 pt-28 text-white sm:px-8 lg:px-12" aria-labelledby="home-title">
        <img src={heroImage} srcSet={heroSrcSet} sizes="100vw" alt={copy.imageAlt} className="absolute inset-0 h-full w-full object-cover" loading="eager" decoding="async" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative mx-auto w-full max-w-[1480px]">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-venetian-gold">{copy.portalKicker}</p>
          <h1 id="home-title" className="mt-5 max-w-[11ch] font-serif text-[clamp(2.75rem,13vw,8.8rem)] font-semibold leading-[0.82] tracking-[-0.05em] sm:leading-[0.79]">{copy.portalTitle}</h1>
          <p className="mt-7 max-w-xl border-l border-white/50 pl-5 text-base leading-7 text-white/90 sm:text-lg">{copy.portalHint}</p>
          <Link id="home-reservation-link" to="/book" className="mt-8 inline-flex min-h-[52px] items-center gap-3 bg-venetian-gold px-6 text-xs font-bold uppercase tracking-[0.14em] text-venetian-brown focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#050505]">{copy.reserve}<ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="home-scroll-intro" className="relative h-[455svh] touch-pan-y bg-[#050505] sm:h-[480svh] lg:h-[510svh]" aria-label={copy.title}>
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[#050505]">
        <h1 id="home-title" className="sr-only">{copy.title}</h1>
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

        {activeScene <= 1 ? <div aria-hidden="true" className="absolute left-1/2 top-1/2 z-10 h-[58svh] w-[70vw] max-w-[430px] -translate-x-1/2 -translate-y-1/2 sm:h-[62svh] sm:w-[38vw] sm:max-w-none">
          <motion.img src={roomImage} srcSet={roomSrcSet} sizes="(min-width: 640px) 38vw, 70vw" alt="" style={{ opacity: firstOpacity, x: firstX, scale: firstScale }} className="h-full w-full border border-white/10 object-cover will-change-[transform,opacity]" loading="eager" decoding="async" />
        </div> : null}

        {assetStage >= 2 && activeScene <= 2 ? (
          <div aria-hidden="true" className="absolute left-1/2 top-1/2 z-[11] h-[52svh] w-[64vw] max-w-[400px] -translate-x-1/2 -translate-y-1/2 sm:h-[59svh] sm:w-[34vw] sm:max-w-none">
            <motion.img src={tableImage} srcSet={tableSrcSet} sizes="(min-width: 640px) 34vw, 64vw" alt="" style={{ opacity: secondOpacity, x: secondX, y: secondY }} className="h-full w-full border border-white/10 object-cover will-change-[transform,opacity]" decoding="async" />
          </div>
        ) : null}

        {assetStage >= 3 && activeScene >= 1 && activeScene <= 3 ? (
          <div aria-hidden="true" className="absolute left-1/2 top-1/2 z-[12] h-[56svh] w-[66vw] max-w-[410px] -translate-x-1/2 -translate-y-1/2 sm:h-[61svh] sm:w-[36vw] sm:max-w-none">
            <motion.img src={gardenImage} srcSet={gardenSrcSet} sizes="(min-width: 640px) 36vw, 66vw" alt="" style={{ opacity: thirdOpacity, x: thirdX, y: thirdY }} className="h-full w-full border border-white/10 object-cover will-change-[transform,opacity]" decoding="async" />
          </div>
        ) : null}

        {assetStage >= 4 && activeScene >= 2 && activeScene <= 4 ? <motion.div aria-hidden="true" style={{ opacity: clusterOpacity }} className="absolute inset-0 z-[13] will-change-[opacity]">
          <div className="absolute left-1/2 top-[43%] h-[39svh] w-[42vw] -translate-x-1/2 -translate-y-1/2 sm:h-[47svh] sm:w-[25vw]">
            <motion.img src={closingImage} srcSet={closingSrcSet} sizes="(min-width: 640px) 25vw, 42vw" alt="" style={{ opacity: clusterOneOpacity, x: clusterLeftX, rotate: -3 }} className="h-full w-full border border-white/10 object-cover will-change-[transform,opacity]" decoding="async" />
          </div>
          <div className="absolute left-1/2 top-[43%] h-[42svh] w-[44vw] -translate-x-1/2 -translate-y-1/2 sm:h-[50svh] sm:w-[26vw]">
            <motion.img src={welcomeImage} srcSet={welcomeSrcSet} sizes="(min-width: 640px) 26vw, 44vw" alt="" style={{ opacity: clusterTwoOpacity, x: clusterRightX, rotate: 3 }} className="h-full w-full border border-white/10 object-cover will-change-[transform,opacity]" decoding="async" />
          </div>
          <div className="absolute left-1/2 top-1/2 h-[32svh] w-[50vw] -translate-x-1/2 -translate-y-1/2 sm:h-[38svh] sm:w-[28vw]">
            <motion.img src={tableImage} srcSet={tableSrcSet} sizes="(min-width: 640px) 28vw, 50vw" alt="" style={{ opacity: clusterThreeOpacity, y: clusterBottomY }} className="h-full w-full border border-white/10 object-cover will-change-[transform,opacity]" decoding="async" />
          </div>
        </motion.div> : null}

        {assetStage >= 5 && activeScene >= 3 ? <motion.img
          src={heroImage}
          srcSet={heroSrcSet}
          sizes="100vw"
          alt={copy.imageAlt}
          style={{ opacity: mainOpacity, scale: mainScale }}
          className="absolute inset-0 z-20 h-full w-full object-cover will-change-[transform,opacity]"
          loading="eager"
          decoding="async"
        /> : null}
        <motion.div style={{ opacity: shadeOpacity }} className="absolute inset-0 z-20 bg-[linear-gradient(0deg,rgba(16,14,12,0.88)_0%,rgba(16,14,12,0.52)_62%,rgba(16,14,12,0.22)_100%)] lg:bg-[linear-gradient(90deg,rgba(16,14,12,0.9)_0%,rgba(16,14,12,0.48)_50%,rgba(16,14,12,0.12)_100%),linear-gradient(0deg,rgba(16,14,12,0.64)_0%,transparent_50%)]" />

        <motion.div
          style={{ opacity: narrativeOpacity }}
          className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-5 sm:px-8 lg:px-12"
          aria-hidden={phase !== 'narrative'}
        >
          <div className="mx-auto w-full max-w-[1480px] text-center">
            <p className="mb-7 text-[0.66rem] font-bold uppercase tracking-[0.24em] text-venetian-gold sm:mb-10 sm:text-xs">{copy.eyebrow}</p>
            <h2 aria-label={copy.title} className="mx-auto flex max-w-[12ch] flex-wrap justify-center gap-x-[0.2em] gap-y-[0.05em] font-serif text-[clamp(3.3rem,15vw,9.5rem)] font-semibold leading-[0.82] tracking-[-0.055em] text-white sm:leading-[0.78]">
              {copy.title.split(' ').map((word, index) => (
                <ComposingWord key={`${word}-${index}`} word={word} index={index} progress={smoothScrollYProgress} />
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
            <Link
              id="home-reservation-link"
              to="/book"
              tabIndex={phase === 'portal' ? 0 : -1}
              className="group mx-auto mt-9 inline-flex min-h-[58px] items-center justify-center gap-4 border border-venetian-gold bg-venetian-gold px-7 text-xs font-bold uppercase tracking-[0.16em] text-venetian-brown transition-colors hover:bg-transparent hover:text-venetian-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#100f0d] sm:min-h-16 sm:px-10"
            >
              {copy.reserve}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <p className="mt-8 text-[0.64rem] font-bold uppercase tracking-[0.22em] text-white/50">{copy.place}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
