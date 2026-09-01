import { ArrowDownRight, ArrowRight, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage, type Language } from '../lib/i18n';
import heroImage from '../Img/G1/IMG_2922.webp';

const heroDetails: Record<Language, { location: string; open: string; note: string }> = {
  en: { location: 'San Polo 649 · Rialto', open: 'Lunch & dinner', note: 'Venetian kitchen · seafood · pizza' },
  it: { location: 'San Polo 649 · Rialto', open: 'Pranzo e cena', note: 'Cucina veneziana · pesce · pizza' },
  fr: { location: 'San Polo 649 · Rialto', open: 'Déjeuner et dîner', note: 'Cuisine vénitienne · poisson · pizza' },
  de: { location: 'San Polo 649 · Rialto', open: 'Mittag- & Abendessen', note: 'Venezianische Küche · Fisch · Pizza' },
  es: { location: 'San Polo 649 · Rialto', open: 'Almuerzo y cena', note: 'Cocina veneciana · pescado · pizza' },
};

export function Hero() {
  const { language, t } = useLanguage();
  const details = heroDetails[language];

  return (
    <section className="relative overflow-hidden bg-[#f7f3eb] pt-[84px] dark:bg-venetian-brown" aria-labelledby="home-title">
      <div className="mx-auto grid min-h-[calc(100svh-84px)] max-w-[1480px] lg:grid-cols-[0.92fr_1.08fr]">
        <div className="relative flex items-center border-x border-venetian-brown/15 px-5 py-16 sm:px-10 lg:px-14 xl:px-20 dark:border-white/10">
          <div className="pointer-events-none absolute right-5 top-8 select-none font-serif text-[8rem] font-semibold leading-none text-venetian-brown/[0.035] sm:text-[12rem] lg:right-10 lg:top-12 dark:text-white/[0.035]">55</div>
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }} className="relative z-10 max-w-[680px]">
            <p className="editorial-kicker mb-7">{t('hero.tagline')}</p>
            <h1 id="home-title" className="max-w-[11ch] font-serif text-[clamp(3.8rem,8.4vw,8.2rem)] font-semibold leading-[0.77] tracking-[-0.045em] text-venetian-brown dark:text-white">
              {t('hero.title')}
            </h1>
            <p className="mt-8 max-w-lg border-l-2 border-venetian-terracotta pl-5 text-base leading-7 text-venetian-brown/70 sm:text-lg dark:text-venetian-sandstone/75">
              {t('hero.subtitle')}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/book" className="editorial-link">
                {t('hero.reserveButton')}<ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/menu" className="editorial-link-light dark:border-white/25 dark:text-white">
                {t('hero.viewMenu')}
              </Link>
            </div>
            <div className="mt-12 grid gap-4 border-t border-venetian-brown/15 pt-5 text-[0.67rem] font-bold uppercase tracking-[0.13em] text-venetian-brown/60 sm:grid-cols-2 dark:border-white/15 dark:text-white/55">
              <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-venetian-terracotta" />{details.location}</span>
              <span>{details.open}</span>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 1.025 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease: 'easeOut' }} className="relative min-h-[62svh] overflow-hidden lg:min-h-full">
          <img src={heroImage} alt="Il giardino interno del Ristorante Al Gobbo di Rialto" className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-t from-venetian-brown/55 via-transparent to-black/10" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white sm:p-8">
            <p className="max-w-xs text-[0.66rem] font-bold uppercase leading-5 tracking-[0.18em] text-white/75">{details.note}</p>
            <button type="button" onClick={() => document.getElementById('story-section')?.scrollIntoView({ behavior: 'smooth' })} className="grid h-14 w-14 shrink-0 place-items-center border border-white/45 bg-black/10 backdrop-blur-sm transition-colors hover:bg-white hover:text-venetian-brown" aria-label={t('hero.scrollHint')}>
              <ArrowDownRight className="h-5 w-5" />
            </button>
          </div>
          <div className="absolute left-0 top-0 bg-venetian-terracotta px-4 py-3 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-white sm:px-5">Venezia autentica</div>
        </motion.div>
      </div>
    </section>
  );
}
