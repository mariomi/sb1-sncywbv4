import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useLanguage } from '../lib/i18n';
import barDetail from '../Img/al-gobbo-2026/bar-detail-wide-1600.webp';
import barWide from '../Img/al-gobbo-2026/bar-wide-1600.webp';
import brandDetail from '../Img/al-gobbo-2026/brand-detail-wide-1600.webp';
import brandTable from '../Img/al-gobbo-2026/brand-table-wide-1600.webp';
import burrata from '../Img/al-gobbo-2026/burrata-wide-1600.webp';
import exterior from '../Img/al-gobbo-2026/exterior-wide-1600.webp';
import fish from '../Img/al-gobbo-2026/fish-wide-1600.webp';
import interiorBar from '../Img/al-gobbo-2026/interior-bar-wide-1600.webp';
import interiorHero from '../Img/al-gobbo-2026/interior-hero-1600.webp';
import interiorWide from '../Img/al-gobbo-2026/interior-wide-1600.webp';
import pasta from '../Img/al-gobbo-2026/pasta-wide-1600.webp';
import reservedTable from '../Img/al-gobbo-2026/reserved-table-wide-1600.webp';
import risotto from '../Img/al-gobbo-2026/risotto-wide-1600.webp';
import staff from '../Img/al-gobbo-2026/staff-wide-1600.webp';
import tableWide from '../Img/al-gobbo-2026/table-wide-1600.webp';
import wineWall from '../Img/al-gobbo-2026/wine-wall-portrait-1200.webp';

type GalleryGroup = {
  id: 'cuisine' | 'tables' | 'spaces' | 'hospitality';
  images: { url: string; alt: string }[];
};

const galleryGroups: GalleryGroup[] = [
  { id: 'cuisine', images: [{ url: burrata, alt: 'Burrata con pomodorini servita da Al Gobbo di Rialto' }, { url: pasta, alt: 'Pasta della cucina di Al Gobbo di Rialto' }, { url: risotto, alt: 'Risotto preparato nella cucina del ristorante' }, { url: fish, alt: 'Secondo piatto di pesce servito al tavolo' }] },
  { id: 'tables', images: [{ url: tableWide, alt: 'Tavolo apparecchiato nella sala' }, { url: brandTable, alt: 'Mise en place con il menu del ristorante' }, { url: brandDetail, alt: 'Dettaglio del marchio Al Gobbo di Rialto' }, { url: reservedTable, alt: 'Tavoli pronti per accogliere gli ospiti' }] },
  { id: 'spaces', images: [{ url: interiorHero, alt: 'La sala interna di Al Gobbo di Rialto' }, { url: interiorWide, alt: 'Interni veneziani del ristorante' }, { url: interiorBar, alt: 'Vista della sala verso il bar' }, { url: exterior, alt: 'L’ingresso di Al Gobbo di Rialto a San Polo' }] },
  { id: 'hospitality', images: [{ url: staff, alt: 'Lo staff di Al Gobbo di Rialto' }, { url: barWide, alt: 'Il bancone del ristorante' }, { url: barDetail, alt: 'Dettaglio del bar' }, { url: wineWall, alt: 'La selezione di vini del ristorante' }] },
];

function GalleryModal({ group, onClose }: { group: GalleryGroup; onClose: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = group.images[currentIndex];
  const previous = () => setCurrentIndex((index) => (index - 1 + group.images.length) % group.images.length);
  const next = () => setCurrentIndex((index) => (index + 1) % group.images.length);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') {
        setCurrentIndex((index) => (index - 1 + group.images.length) % group.images.length);
      }
      if (event.key === 'ArrowRight') {
        setCurrentIndex((index) => (index + 1) % group.images.length);
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [group.images.length, onClose]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] grid place-items-center bg-venetian-brown/95 p-4 backdrop-blur-md" onClick={onClose} role="dialog" aria-modal="true" aria-label="Photo gallery">
      <button type="button" onClick={onClose} className="absolute right-5 top-5 grid h-12 w-12 place-items-center border border-white/25 text-white hover:border-venetian-gold hover:text-venetian-gold" aria-label="Close gallery"><X className="h-5 w-5" /></button>
      <div className="w-full max-w-6xl" onClick={(event) => event.stopPropagation()}>
        <div className="relative aspect-[4/3] max-h-[76vh] overflow-hidden bg-black/20 sm:aspect-[16/10]">
          <AnimatePresence mode="wait">
            <motion.img key={current.url} src={current.url} alt={current.alt} className="absolute inset-0 h-full w-full object-contain" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} />
          </AnimatePresence>
          <button type="button" onClick={previous} className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center bg-white text-venetian-brown hover:bg-venetian-gold" aria-label="Previous image"><ChevronLeft className="h-5 w-5" /></button>
          <button type="button" onClick={next} className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center bg-white text-venetian-brown hover:bg-venetian-gold" aria-label="Next image"><ChevronRight className="h-5 w-5" /></button>
        </div>
        <div className="mt-4 flex items-center justify-between text-white">
          <p className="font-serif text-xl">{current.alt}</p>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/55">{currentIndex + 1} / {group.images.length}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Gallery() {
  const [selectedGroup, setSelectedGroup] = useState<GalleryGroup | null>(null);
  const { t } = useLanguage();

  return (
    <>
      <section className="bg-venetian-brown py-20 text-white sm:py-28" aria-labelledby="gallery-title">
        <div className="mx-auto max-w-[1480px] px-4 sm:px-7 lg:px-10">
          <div className="mb-10 grid gap-6 border-t border-white/15 pt-7 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <div>
              <p className="editorial-kicker !text-venetian-gold">Dentro Al Gobbo</p>
              <h1 id="gallery-title" className="mt-4 font-serif text-5xl font-semibold leading-[0.88] sm:text-7xl">{t('gallery.title')}</h1>
            </div>
            <p className="max-w-2xl text-base leading-7 text-white/62 lg:justify-self-end">{t('gallery.subtitle')}</p>
          </div>

          <div className="grid auto-rows-[220px] grid-cols-1 gap-2 sm:grid-cols-2 sm:auto-rows-[280px] lg:grid-cols-4">
            {galleryGroups.map((group, index) => (
              <motion.button
                key={group.id}
                type="button"
                onClick={() => setSelectedGroup(group)}
                className={`group relative overflow-hidden text-left ${index === 0 ? 'sm:row-span-2 lg:col-span-2' : ''} ${index === 3 ? 'lg:col-span-2' : ''}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                aria-label={t(`gallery.groups.${group.id}.title`)}
              >
                <img src={group.images[0].url} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
                  <span>
                    <span className="block font-serif text-2xl font-semibold">{t(`gallery.groups.${group.id}.title`)}</span>
                    <span className="mt-1 block text-xs leading-5 text-white/65">{t(`gallery.groups.${group.id}.description`)}</span>
                  </span>
                  <ArrowUpRight className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>
      <AnimatePresence>{selectedGroup ? <GalleryModal group={selectedGroup} onClose={() => setSelectedGroup(null)} /> : null}</AnimatePresence>
    </>
  );
}

export { Gallery };
