import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type TouchEvent,
} from 'react';
import barDetailFull from '../Img/al-gobbo-2026/bar-detail-wide-lightbox-2400.webp';
import barDetail from '../Img/al-gobbo-2026/bar-detail-wide-1600.webp';
import barFull from '../Img/al-gobbo-2026/bar-wide-lightbox-2400.webp';
import barWide from '../Img/al-gobbo-2026/bar-wide-1600.webp';
import brandDetailFull from '../Img/al-gobbo-2026/brand-detail-wide-lightbox-2400.webp';
import brandDetail from '../Img/al-gobbo-2026/brand-detail-wide-1600.webp';
import brandTableFull from '../Img/al-gobbo-2026/brand-table-wide-lightbox-2400.webp';
import brandTable from '../Img/al-gobbo-2026/brand-table-wide-1600.webp';
import burrataFull from '../Img/al-gobbo-2026/burrata-wide-lightbox-2400.webp';
import burrata from '../Img/al-gobbo-2026/burrata-wide-1600.webp';
import exteriorFull from '../Img/al-gobbo-2026/exterior-wide-lightbox-2400.webp';
import exterior from '../Img/al-gobbo-2026/exterior-wide-1600.webp';
import fishFull from '../Img/al-gobbo-2026/fish-wide-lightbox-2400.webp';
import fish from '../Img/al-gobbo-2026/fish-wide-1600.webp';
import interiorBarFull from '../Img/al-gobbo-2026/interior-bar-wide-lightbox-2400.webp';
import interiorBar from '../Img/al-gobbo-2026/interior-bar-wide-1600.webp';
import interiorHeroFull from '../Img/al-gobbo-2026/interior-hero-lightbox-2400.webp';
import interiorHero from '../Img/al-gobbo-2026/interior-hero-1600.webp';
import interiorWideFull from '../Img/al-gobbo-2026/interior-wide-lightbox-2400.webp';
import interiorWide from '../Img/al-gobbo-2026/interior-wide-1600.webp';
import pastaFull from '../Img/al-gobbo-2026/pasta-wide-lightbox-2400.webp';
import pasta from '../Img/al-gobbo-2026/pasta-wide-1600.webp';
import reservedTableFull from '../Img/al-gobbo-2026/reserved-table-wide-lightbox-2400.webp';
import reservedTable from '../Img/al-gobbo-2026/reserved-table-wide-1600.webp';
import risottoFull from '../Img/al-gobbo-2026/risotto-wide-lightbox-2400.webp';
import risotto from '../Img/al-gobbo-2026/risotto-wide-1600.webp';
import staffFull from '../Img/al-gobbo-2026/staff-wide-lightbox-2400.webp';
import staff from '../Img/al-gobbo-2026/staff-wide-1600.webp';
import tableFull from '../Img/al-gobbo-2026/table-wide-lightbox-2400.webp';
import tableWide from '../Img/al-gobbo-2026/table-wide-1600.webp';
import wineWallFull from '../Img/al-gobbo-2026/wine-wall-portrait-lightbox-2400.webp';
import wineWall from '../Img/al-gobbo-2026/wine-wall-portrait-1200.webp';
import { useLanguage, type Language } from '../lib/i18n';

type GalleryGroupId = 'cuisine' | 'tables' | 'spaces' | 'hospitality';

type GalleryImage = {
  previewUrl: string;
  fullUrl: string;
  alt: string;
  width: number;
  height: number;
  groupId: GalleryGroupId;
};

type GalleryGroup = {
  id: GalleryGroupId;
  images: GalleryImage[];
};

type GalleryUiCopy = {
  kicker: string;
  enlarge: string;
  highResolution: string;
  dialog: string;
  close: string;
  previous: string;
  next: string;
  instructions: string;
  position: (current: number, total: number) => string;
  openImage: (description: string) => string;
};

const galleryUi: Record<Language, GalleryUiCopy> = {
  en: {
    kicker: 'Inside Al Gobbo',
    enlarge: 'View larger',
    highResolution: 'High-resolution gallery',
    dialog: 'High-resolution photo gallery',
    close: 'Close gallery',
    previous: 'Previous photo',
    next: 'Next photo',
    instructions: 'Use the arrow keys or swipe to browse. Press Escape to close.',
    position: (current, total) => `${current} of ${total}`,
    openImage: (description) => `View larger: ${description}`,
  },
  it: {
    kicker: 'Dentro Al Gobbo',
    enlarge: 'Ingrandisci',
    highResolution: 'Galleria in alta definizione',
    dialog: 'Galleria fotografica in alta definizione',
    close: 'Chiudi la galleria',
    previous: 'Foto precedente',
    next: 'Foto successiva',
    instructions: 'Usa le frecce o scorri con il dito. Premi Esc per chiudere.',
    position: (current, total) => `${current} di ${total}`,
    openImage: (description) => `Ingrandisci: ${description}`,
  },
  fr: {
    kicker: 'Au cœur d’Al Gobbo',
    enlarge: 'Agrandir',
    highResolution: 'Galerie haute définition',
    dialog: 'Galerie photo haute définition',
    close: 'Fermer la galerie',
    previous: 'Photo précédente',
    next: 'Photo suivante',
    instructions: 'Utilisez les flèches ou balayez l’écran. Appuyez sur Échap pour fermer.',
    position: (current, total) => `${current} sur ${total}`,
    openImage: (description) => `Agrandir : ${description}`,
  },
  de: {
    kicker: 'Im Al Gobbo',
    enlarge: 'Vergrößern',
    highResolution: 'Galerie in hoher Auflösung',
    dialog: 'Fotogalerie in hoher Auflösung',
    close: 'Galerie schließen',
    previous: 'Vorheriges Foto',
    next: 'Nächstes Foto',
    instructions: 'Mit den Pfeiltasten oder einer Wischgeste blättern. Escape schließt die Galerie.',
    position: (current, total) => `${current} von ${total}`,
    openImage: (description) => `Vergrößern: ${description}`,
  },
  es: {
    kicker: 'Dentro de Al Gobbo',
    enlarge: 'Ampliar',
    highResolution: 'Galería en alta definición',
    dialog: 'Galería de fotos en alta definición',
    close: 'Cerrar la galería',
    previous: 'Foto anterior',
    next: 'Foto siguiente',
    instructions: 'Usa las flechas o desliza para navegar. Pulsa Escape para cerrar.',
    position: (current, total) => `${current} de ${total}`,
    openImage: (description) => `Ampliar: ${description}`,
  },
};

const galleryGroups: GalleryGroup[] = [
  {
    id: 'cuisine',
    images: [
      { previewUrl: burrata, fullUrl: burrataFull, alt: 'Burrata con pomodorini servita da Al Gobbo di Rialto', width: 1600, height: 1067, groupId: 'cuisine' },
      { previewUrl: pasta, fullUrl: pastaFull, alt: 'Pasta della cucina di Al Gobbo di Rialto', width: 1600, height: 1067, groupId: 'cuisine' },
      { previewUrl: risotto, fullUrl: risottoFull, alt: 'Risotto preparato nella cucina del ristorante', width: 1600, height: 1067, groupId: 'cuisine' },
      { previewUrl: fish, fullUrl: fishFull, alt: 'Secondo piatto di pesce servito al tavolo', width: 1600, height: 2400, groupId: 'cuisine' },
    ],
  },
  {
    id: 'tables',
    images: [
      { previewUrl: tableWide, fullUrl: tableFull, alt: 'Tavolo apparecchiato nella sala', width: 1600, height: 1067, groupId: 'tables' },
      { previewUrl: brandTable, fullUrl: brandTableFull, alt: 'Mise en place con il menu del ristorante', width: 1600, height: 1067, groupId: 'tables' },
      { previewUrl: brandDetail, fullUrl: brandDetailFull, alt: 'Dettaglio del marchio Al Gobbo di Rialto', width: 1600, height: 1067, groupId: 'tables' },
      { previewUrl: reservedTable, fullUrl: reservedTableFull, alt: 'Tavoli pronti per accogliere gli ospiti', width: 1600, height: 1067, groupId: 'tables' },
    ],
  },
  {
    id: 'spaces',
    images: [
      { previewUrl: interiorHero, fullUrl: interiorHeroFull, alt: 'La sala interna di Al Gobbo di Rialto', width: 1600, height: 1067, groupId: 'spaces' },
      { previewUrl: interiorWide, fullUrl: interiorWideFull, alt: 'Interni veneziani del ristorante', width: 1600, height: 1067, groupId: 'spaces' },
      { previewUrl: interiorBar, fullUrl: interiorBarFull, alt: 'Vista della sala verso il bar', width: 1600, height: 1067, groupId: 'spaces' },
      { previewUrl: exterior, fullUrl: exteriorFull, alt: 'L’ingresso di Al Gobbo di Rialto a San Polo', width: 1600, height: 1067, groupId: 'spaces' },
    ],
  },
  {
    id: 'hospitality',
    images: [
      { previewUrl: staff, fullUrl: staffFull, alt: 'Lo staff di Al Gobbo di Rialto', width: 1600, height: 1067, groupId: 'hospitality' },
      { previewUrl: barWide, fullUrl: barFull, alt: 'Il bancone del ristorante', width: 1600, height: 1067, groupId: 'hospitality' },
      { previewUrl: barDetail, fullUrl: barDetailFull, alt: 'Dettaglio del bar', width: 1600, height: 1067, groupId: 'hospitality' },
      { previewUrl: wineWall, fullUrl: wineWallFull, alt: 'La selezione di vini del ristorante', width: 1200, height: 1800, groupId: 'hospitality' },
    ],
  },
];

const galleryImages = galleryGroups.flatMap((group) => group.images);

const galleryItemClasses = [
  'col-span-2 row-span-2 sm:col-span-2 lg:col-span-6',
  'col-span-1 row-span-1 sm:col-span-2 lg:col-span-3 lg:row-span-2',
  'col-span-1 row-span-1 sm:col-span-1 lg:col-span-3',
  'col-span-2 row-span-1 sm:col-span-1 lg:col-span-3',
];

function GalleryModal({ initialIndex, onClose }: { initialIndex: number; onClose: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const { language, t } = useLanguage();
  const copy = galleryUi[language];
  const current = galleryImages[currentIndex];
  const currentGroupTitle = t(`gallery.groups.${current.groupId}.title`);

  const previous = useCallback(() => {
    setCurrentIndex((index) => (index - 1 + galleryImages.length) % galleryImages.length);
  }, []);

  const next = useCallback(() => {
    setCurrentIndex((index) => (index + 1) % galleryImages.length);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        previous();
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        next();
      }

      if (event.key === 'Tab' && dialog) {
        const focusableElements = Array.from(
          dialog.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        );

        if (focusableElements.length === 0) {
          event.preventDefault();
          dialog.focus();
          return;
        }

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];
        const activeElement = document.activeElement;

        if (event.shiftKey && (activeElement === first || !dialog.contains(activeElement))) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (activeElement === last || !dialog.contains(activeElement))) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    const handleFocusIn = (event: FocusEvent) => {
      if (dialog && !dialog.contains(event.target as Node)) {
        (closeButtonRef.current ?? dialog).focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    const previousOverscrollBehavior = document.body.style.overscrollBehavior;
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusin', handleFocusIn);
    (closeButtonRef.current ?? dialog)?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.overscrollBehavior = previousOverscrollBehavior;
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', handleFocusIn);
      if (previouslyFocused?.isConnected) {
        previouslyFocused.focus();
      }
    };
  }, [next, onClose, previous]);

  useEffect(() => {
    const adjacentIndexes = [
      (currentIndex - 1 + galleryImages.length) % galleryImages.length,
      (currentIndex + 1) % galleryImages.length,
    ];
    adjacentIndexes.forEach((index) => {
      const image = new Image();
      image.src = galleryImages[index].fullUrl;
    });
  }, [currentIndex]);

  const closeFromBackdrop = (event: MouseEvent<HTMLElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const distance = touchStartX.current - endX;
    touchStartX.current = null;

    if (Math.abs(distance) < 48) return;
    if (distance > 0) next();
    else previous();
  };

  return (
    <motion.div
      ref={dialogRef}
      tabIndex={-1}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-[100] h-[100dvh] overflow-hidden bg-[#0b0907]/[0.97] text-white backdrop-blur-md"
      onClick={closeFromBackdrop}
      role="dialog"
      aria-modal="true"
      aria-label={`${copy.dialog}: ${currentGroupTitle}`}
      aria-describedby="gallery-dialog-description"
      style={{
        paddingTop: 'max(0.75rem, env(safe-area-inset-top))',
        paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
      }}
    >
      <div className="mx-auto flex h-full w-full max-w-[1800px] flex-col" onClick={closeFromBackdrop}>
        <div className="flex h-14 shrink-0 items-center justify-between gap-4 px-4 sm:px-8">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/55">
            {copy.highResolution}
          </p>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="grid h-12 w-12 shrink-0 place-items-center border border-white/25 bg-black/20 text-white transition-colors hover:border-venetian-gold hover:text-venetian-gold"
            aria-label={copy.close}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          className="relative min-h-0 flex-1 touch-pan-y"
          onClick={closeFromBackdrop}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.fullUrl}
              className="absolute inset-0 flex items-center justify-center px-2 py-2 sm:px-20 sm:py-4"
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={closeFromBackdrop}
              style={{
                backgroundImage: `url(${current.previewUrl})`,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
              }}
            >
              <img
                src={current.fullUrl}
                alt={current.alt}
                width={current.width > current.height ? 2400 : 1600}
                height={current.width > current.height ? 1600 : 2400}
                className="max-h-full max-w-full select-none object-contain shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
                draggable={false}
                decoding="async"
              />
            </motion.div>
          </AnimatePresence>

          <button
            type="button"
            onClick={previous}
            className="absolute left-2 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center border border-white/30 bg-black/55 text-white backdrop-blur-sm transition-colors hover:border-venetian-gold hover:bg-venetian-gold hover:text-venetian-brown sm:left-5"
            aria-label={copy.previous}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-2 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center border border-white/30 bg-black/55 text-white backdrop-blur-sm transition-colors hover:border-venetian-gold hover:bg-venetian-gold hover:text-venetian-brown sm:right-5"
            aria-label={copy.next}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="grid min-h-[5.5rem] shrink-0 grid-cols-[1fr_auto] items-center gap-5 px-4 pt-3 sm:px-20">
          <div aria-live="polite" aria-atomic="true">
            <p id="gallery-dialog-title" className="font-serif text-xl font-semibold sm:text-2xl">
              {currentGroupTitle}
            </p>
            <p id="gallery-dialog-description" className="mt-1 max-w-3xl text-xs leading-5 text-white/58 sm:text-sm">
              {current.alt}
            </p>
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/55">
            {copy.position(currentIndex + 1, galleryImages.length)}
          </p>
          <p className="sr-only">{copy.instructions}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { language, t } = useLanguage();
  const copy = galleryUi[language];
  const closeGallery = useCallback(() => setSelectedIndex(null), []);

  return (
    <>
      <section className="bg-venetian-brown py-20 text-white sm:py-28" aria-labelledby="gallery-title">
        <div className="mx-auto max-w-[1480px] px-4 sm:px-7 lg:px-10">
          <div className="mb-14 grid gap-6 border-t border-white/15 pt-7 sm:mb-20 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <div>
              <p className="editorial-kicker !text-venetian-gold">{copy.kicker}</p>
              <h1 id="gallery-title" className="mt-4 font-serif text-5xl font-semibold leading-[0.88] sm:text-7xl">
                {t('gallery.title')}
              </h1>
            </div>
            <p className="max-w-2xl text-base leading-7 text-white/62 lg:justify-self-end">
              {t('gallery.subtitle')}
            </p>
          </div>

          <div className="space-y-16 sm:space-y-20">
            {galleryGroups.map((group, groupIndex) => (
              <section key={group.id} aria-labelledby={`gallery-group-${group.id}`}>
                <div className="mb-5 grid gap-3 border-t border-white/15 pt-4 sm:grid-cols-[0.8fr_1.2fr] sm:items-end">
                  <div className="flex items-baseline gap-4">
                    <span className="text-[0.65rem] font-bold tracking-[0.18em] text-venetian-gold/75" aria-hidden="true">
                      {String(groupIndex + 1).padStart(2, '0')}
                    </span>
                    <h2 id={`gallery-group-${group.id}`} className="font-serif text-3xl font-semibold sm:text-4xl">
                      {t(`gallery.groups.${group.id}.title`)}
                    </h2>
                  </div>
                  <p className="text-sm leading-6 text-white/55 sm:justify-self-end sm:text-right">
                    {t(`gallery.groups.${group.id}.description`)}
                  </p>
                </div>

                <div className="grid auto-rows-[145px] grid-cols-2 gap-2 min-[420px]:auto-rows-[175px] sm:auto-rows-[205px] sm:grid-cols-4 lg:auto-rows-[210px] lg:grid-cols-12 xl:auto-rows-[240px]">
                  {group.images.map((image, imageIndex) => {
                    const globalIndex = galleryImages.indexOf(image);
                    return (
                      <motion.button
                        key={image.fullUrl}
                        type="button"
                        onClick={() => setSelectedIndex(globalIndex)}
                        className={`group relative overflow-hidden bg-black/20 text-left ${galleryItemClasses[imageIndex]}`}
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.45, delay: imageIndex * 0.04 }}
                        aria-label={copy.openImage(image.alt)}
                      >
                        <img
                          src={image.previewUrl}
                          alt=""
                          width={image.width}
                          height={image.height}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                          loading={groupIndex === 0 && imageIndex < 2 ? 'eager' : 'lazy'}
                          decoding="async"
                        />
                        <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/5 opacity-70 transition-opacity group-hover:opacity-100" />
                        <span className="absolute bottom-3 right-3 inline-flex min-h-11 items-center gap-2 border border-white/35 bg-black/45 px-3 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-white opacity-100 backdrop-blur-sm transition-all group-hover:border-venetian-gold group-hover:bg-venetian-gold group-hover:text-venetian-brown sm:bottom-4 sm:right-4 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
                          {copy.enlarge}
                          <ZoomIn className="h-4 w-4" />
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedIndex !== null ? (
          <GalleryModal key={selectedIndex} initialIndex={selectedIndex} onClose={closeGallery} />
        ) : null}
      </AnimatePresence>
    </>
  );
}

export { Gallery };
