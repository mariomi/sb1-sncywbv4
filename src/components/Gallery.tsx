import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useLanguage } from '../lib/i18n';
import img2980 from '../Img/food/IMG_2980.webp';
import img2984 from '../Img/food/IMG_2984.webp';
import img2985 from '../Img/food/IMG_2985.webp';
import img2986 from '../Img/food/IMG_2986.webp';
import img2922 from '../Img/G1/IMG_2922.webp';
import img2941 from '../Img/G1/IMG_2941.webp';
import img2943 from '../Img/G1/IMG_2943.webp';
import img2960 from '../Img/G1/IMG_2960.webp';
import img2962 from '../Img/G1/IMG_2962.webp';
import img2968 from '../Img/G1/IMG_2968.webp';
import img2978 from '../Img/G1/IMG_2978.webp';
import img2992 from '../Img/G1/IMG_2992.webp';

type GalleryGroup = {
  id: 'dishes' | 'ingredients' | 'ambiance' | 'desserts';
  images: { url: string; alt: string }[];
};

const galleryGroups: GalleryGroup[] = [
  { id: 'dishes', images: [{ url: img2980, alt: 'Tagliolini con gamberi e zucchine' }, { url: img2984, alt: 'Piatto della cucina italiana' }, { url: img2985, alt: 'Risotto di mare' }, { url: img2986, alt: 'Specialità del ristorante' }] },
  { id: 'ingredients', images: [{ url: img2941, alt: 'Dettaglio del ristorante' }, { url: img2943, alt: 'Atmosfera veneziana' }, { url: img2960, alt: 'Sala del ristorante' }] },
  { id: 'ambiance', images: [{ url: img2922, alt: 'Giardino interno del ristorante' }, { url: img2962, alt: 'Tavoli apparecchiati nella sala' }, { url: img2968, alt: 'Dettaglio della sala' }] },
  { id: 'desserts', images: [{ url: img2978, alt: 'Dolce della casa' }, { url: img2992, alt: 'Dessert italiano' }] },
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
              <h2 id="gallery-title" className="mt-4 font-serif text-5xl font-semibold leading-[0.88] sm:text-7xl">{t('gallery.title')}</h2>
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
