import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Images, X, ZoomIn } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type TouchEvent,
} from 'react';
import {
  galleryCategories,
  galleryImages,
  type GalleryCategoryId,
  type GalleryImage,
} from '../data/galleryImages';
import { useLanguage, type Language } from '../lib/i18n';

type GalleryFilterId = 'all' | GalleryCategoryId;

type CategoryCopy = {
  title: string;
  description: string;
  alt: string;
};

type GalleryUiCopy = {
  kicker: string;
  archive: string;
  all: string;
  filters: string;
  enlarge: string;
  highResolution: string;
  dialog: string;
  close: string;
  previous: string;
  next: string;
  instructions: string;
  photo: string;
  photos: string;
  position: (current: number, total: number) => string;
  showing: (visible: number, total: number) => string;
  openImage: (description: string) => string;
};

const galleryUi: Record<Language, GalleryUiCopy> = {
  en: {
    kicker: 'Inside Al Gobbo',
    archive: 'collections',
    all: 'All',
    filters: 'Filter the gallery by subject',
    enlarge: 'View',
    highResolution: 'High-resolution gallery',
    dialog: 'High-resolution photo gallery',
    close: 'Close gallery',
    previous: 'Previous photo',
    next: 'Next photo',
    instructions: 'Use the arrow keys or swipe to browse. Press Escape to close.',
    photo: 'Photo',
    photos: 'photographs',
    position: (current, total) => `${current} of ${total}`,
    showing: (visible, total) => `Showing ${visible} of ${total} photographs`,
    openImage: (description) => `View larger: ${description}`,
  },
  it: {
    kicker: 'Dentro Al Gobbo',
    archive: 'racconti',
    all: 'Tutte',
    filters: 'Filtra la galleria per soggetto',
    enlarge: 'Apri',
    highResolution: 'Galleria in alta definizione',
    dialog: 'Galleria fotografica in alta definizione',
    close: 'Chiudi la galleria',
    previous: 'Foto precedente',
    next: 'Foto successiva',
    instructions: 'Usa le frecce o scorri con il dito. Premi Esc per chiudere.',
    photo: 'Foto',
    photos: 'fotografie',
    position: (current, total) => `${current} di ${total}`,
    showing: (visible, total) => `${visible} fotografie su ${total}`,
    openImage: (description) => `Ingrandisci: ${description}`,
  },
  fr: {
    kicker: 'Au cœur d’Al Gobbo',
    archive: 'collections',
    all: 'Toutes',
    filters: 'Filtrer la galerie par sujet',
    enlarge: 'Ouvrir',
    highResolution: 'Galerie haute définition',
    dialog: 'Galerie photo haute définition',
    close: 'Fermer la galerie',
    previous: 'Photo précédente',
    next: 'Photo suivante',
    instructions: 'Utilisez les flèches ou balayez l’écran. Appuyez sur Échap pour fermer.',
    photo: 'Photo',
    photos: 'photographies',
    position: (current, total) => `${current} sur ${total}`,
    showing: (visible, total) => `${visible} photographies sur ${total}`,
    openImage: (description) => `Agrandir : ${description}`,
  },
  de: {
    kicker: 'Im Al Gobbo',
    archive: 'Serien',
    all: 'Alle',
    filters: 'Galerie nach Motiv filtern',
    enlarge: 'Öffnen',
    highResolution: 'Galerie in hoher Auflösung',
    dialog: 'Fotogalerie in hoher Auflösung',
    close: 'Galerie schließen',
    previous: 'Vorheriges Foto',
    next: 'Nächstes Foto',
    instructions: 'Mit den Pfeiltasten oder einer Wischgeste blättern. Escape schließt die Galerie.',
    photo: 'Foto',
    photos: 'Fotografien',
    position: (current, total) => `${current} von ${total}`,
    showing: (visible, total) => `${visible} von ${total} Fotografien`,
    openImage: (description) => `Vergrößern: ${description}`,
  },
  es: {
    kicker: 'Dentro de Al Gobbo',
    archive: 'colecciones',
    all: 'Todas',
    filters: 'Filtrar la galería por tema',
    enlarge: 'Abrir',
    highResolution: 'Galería en alta definición',
    dialog: 'Galería de fotos en alta definición',
    close: 'Cerrar la galería',
    previous: 'Foto anterior',
    next: 'Foto siguiente',
    instructions: 'Usa las flechas o desliza para navegar. Pulsa Escape para cerrar.',
    photo: 'Foto',
    photos: 'fotografías',
    position: (current, total) => `${current} de ${total}`,
    showing: (visible, total) => `${visible} fotografías de ${total}`,
    openImage: (description) => `Ampliar: ${description}`,
  },
};

const categoryCopy: Record<Language, Record<GalleryCategoryId, CategoryCopy>> = {
  en: {
    interiors: { title: 'Interiors', description: 'Warm light, brickwork and Venetian character', alt: 'The interiors of Al Gobbo di Rialto' },
    exterior: { title: 'Entrance', description: 'Arriving in the heart of San Polo', alt: 'The entrance and exterior of Al Gobbo di Rialto' },
    bar: { title: 'Bar & cellar', description: 'The counter, bottles and details of the wine selection', alt: 'The bar and wine cellar at Al Gobbo di Rialto' },
    tables: { title: 'The table', description: 'Table settings prepared for our guests', alt: 'Tables and mise en place at Al Gobbo di Rialto' },
    staff: { title: 'Our team', description: 'The people behind every service', alt: 'The team of Al Gobbo di Rialto' },
    burrata: { title: 'Burrata', description: 'Burrata, cherry tomatoes and finishing touches', alt: 'Burrata with cherry tomatoes at Al Gobbo di Rialto' },
    pasta: { title: 'Pasta', description: 'From the kitchen to the table', alt: 'Pasta dishes at Al Gobbo di Rialto' },
    risotto: { title: 'Risotto', description: 'Preparation, plating and service', alt: 'Risotto at Al Gobbo di Rialto' },
    fish: { title: 'Fish dishes', description: 'The flavours of the Venetian lagoon', alt: 'Fish dishes at Al Gobbo di Rialto' },
    brand: { title: 'Details & menu', description: 'The menu, the mark and the finishing details', alt: 'Menu and branded details of Al Gobbo di Rialto' },
  },
  it: {
    interiors: { title: 'Gli interni', description: 'Luce calda, mattoni e carattere veneziano', alt: 'Gli interni di Al Gobbo di Rialto' },
    exterior: { title: 'L’ingresso', description: 'L’arrivo nel cuore di San Polo', alt: 'L’ingresso e l’esterno di Al Gobbo di Rialto' },
    bar: { title: 'Bar e cantina', description: 'Il bancone, le bottiglie e la selezione dei vini', alt: 'Il bar e la cantina di Al Gobbo di Rialto' },
    tables: { title: 'La tavola', description: 'Mise en place preparate per accogliere gli ospiti', alt: 'I tavoli e la mise en place di Al Gobbo di Rialto' },
    staff: { title: 'Lo staff', description: 'Le persone dietro ogni servizio', alt: 'Lo staff di Al Gobbo di Rialto' },
    burrata: { title: 'La burrata', description: 'Burrata, pomodorini e gli ultimi tocchi', alt: 'La burrata con pomodorini di Al Gobbo di Rialto' },
    pasta: { title: 'La pasta', description: 'Dalla cucina fino al tavolo', alt: 'I piatti di pasta di Al Gobbo di Rialto' },
    risotto: { title: 'Il risotto', description: 'Preparazione, impiattamento e servizio', alt: 'Il risotto di Al Gobbo di Rialto' },
    fish: { title: 'Il pesce', description: 'I sapori della laguna veneziana', alt: 'I secondi piatti di pesce di Al Gobbo di Rialto' },
    brand: { title: 'Dettagli e menu', description: 'Il menu, il marchio e i dettagli finali', alt: 'Il menu e i dettagli di Al Gobbo di Rialto' },
  },
  fr: {
    interiors: { title: 'Les intérieurs', description: 'Lumière chaude, briques et caractère vénitien', alt: 'Les intérieurs d’Al Gobbo di Rialto' },
    exterior: { title: 'L’entrée', description: 'L’arrivée au cœur de San Polo', alt: 'L’entrée et l’extérieur d’Al Gobbo di Rialto' },
    bar: { title: 'Bar et cave', description: 'Le comptoir, les bouteilles et la sélection de vins', alt: 'Le bar et la cave d’Al Gobbo di Rialto' },
    tables: { title: 'La table', description: 'Des tables dressées pour accueillir nos hôtes', alt: 'Les tables dressées d’Al Gobbo di Rialto' },
    staff: { title: 'L’équipe', description: 'Les personnes derrière chaque service', alt: 'L’équipe d’Al Gobbo di Rialto' },
    burrata: { title: 'La burrata', description: 'Burrata, tomates cerises et dernières touches', alt: 'La burrata aux tomates cerises d’Al Gobbo di Rialto' },
    pasta: { title: 'Les pâtes', description: 'De la cuisine jusqu’à la table', alt: 'Les plats de pâtes d’Al Gobbo di Rialto' },
    risotto: { title: 'Le risotto', description: 'Préparation, dressage et service', alt: 'Le risotto d’Al Gobbo di Rialto' },
    fish: { title: 'Le poisson', description: 'Les saveurs de la lagune vénitienne', alt: 'Les plats de poisson d’Al Gobbo di Rialto' },
    brand: { title: 'Détails et menu', description: 'Le menu, la marque et les touches finales', alt: 'Le menu et les détails d’Al Gobbo di Rialto' },
  },
  de: {
    interiors: { title: 'Innenräume', description: 'Warmes Licht, Ziegel und venezianischer Charakter', alt: 'Die Innenräume des Al Gobbo di Rialto' },
    exterior: { title: 'Der Eingang', description: 'Ankommen im Herzen von San Polo', alt: 'Eingang und Außenansicht des Al Gobbo di Rialto' },
    bar: { title: 'Bar & Weinkeller', description: 'Theke, Flaschen und unsere Weinauswahl', alt: 'Bar und Weinkeller des Al Gobbo di Rialto' },
    tables: { title: 'Der Tisch', description: 'Gedeckte Tische für unsere Gäste', alt: 'Tische und Gedecke im Al Gobbo di Rialto' },
    staff: { title: 'Unser Team', description: 'Die Menschen hinter jedem Service', alt: 'Das Team des Al Gobbo di Rialto' },
    burrata: { title: 'Burrata', description: 'Burrata, Kirschtomaten und letzte Handgriffe', alt: 'Burrata mit Kirschtomaten im Al Gobbo di Rialto' },
    pasta: { title: 'Pasta', description: 'Von der Küche bis zum Tisch', alt: 'Pastagerichte im Al Gobbo di Rialto' },
    risotto: { title: 'Risotto', description: 'Zubereitung, Anrichten und Service', alt: 'Risotto im Al Gobbo di Rialto' },
    fish: { title: 'Fischgerichte', description: 'Der Geschmack der venezianischen Lagune', alt: 'Fischgerichte im Al Gobbo di Rialto' },
    brand: { title: 'Details & Menü', description: 'Speisekarte, Marke und feine Details', alt: 'Speisekarte und Details des Al Gobbo di Rialto' },
  },
  es: {
    interiors: { title: 'Los interiores', description: 'Luz cálida, ladrillo y carácter veneciano', alt: 'Los interiores de Al Gobbo di Rialto' },
    exterior: { title: 'La entrada', description: 'La llegada al corazón de San Polo', alt: 'La entrada y el exterior de Al Gobbo di Rialto' },
    bar: { title: 'Bar y bodega', description: 'La barra, las botellas y la selección de vinos', alt: 'El bar y la bodega de Al Gobbo di Rialto' },
    tables: { title: 'La mesa', description: 'Mesas preparadas para recibir a nuestros clientes', alt: 'Las mesas de Al Gobbo di Rialto' },
    staff: { title: 'El equipo', description: 'Las personas detrás de cada servicio', alt: 'El equipo de Al Gobbo di Rialto' },
    burrata: { title: 'La burrata', description: 'Burrata, tomates cherry y últimos detalles', alt: 'La burrata con tomates cherry de Al Gobbo di Rialto' },
    pasta: { title: 'La pasta', description: 'De la cocina a la mesa', alt: 'Los platos de pasta de Al Gobbo di Rialto' },
    risotto: { title: 'El risotto', description: 'Preparación, emplatado y servicio', alt: 'El risotto de Al Gobbo di Rialto' },
    fish: { title: 'El pescado', description: 'Los sabores de la laguna veneciana', alt: 'Los platos de pescado de Al Gobbo di Rialto' },
    brand: { title: 'Detalles y menú', description: 'El menú, la marca y los detalles finales', alt: 'El menú y los detalles de Al Gobbo di Rialto' },
  },
};

function GalleryModal({ images, initialIndex, onClose, language }: {
  images: GalleryImage[];
  initialIndex: number;
  onClose: () => void;
  language: Language;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const copy = galleryUi[language];
  const current = images[currentIndex];
  const currentCategory = categoryCopy[language][current.categoryId];
  const currentDescription = `${currentCategory.alt} · ${copy.photo} ${current.sequence}`;

  const previous = useCallback(() => {
    setCurrentIndex((index) => (index - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => {
    setCurrentIndex((index) => (index + 1) % images.length);
  }, [images.length]);

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
          dialog.querySelectorAll<HTMLElement>('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'),
        );
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];
        const activeElement = document.activeElement;

        if (!first || !last) {
          event.preventDefault();
          dialog.focus();
        } else if (event.shiftKey && (activeElement === first || !dialog.contains(activeElement))) {
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
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
    };
  }, [next, onClose, previous]);

  useEffect(() => {
    const adjacentIndexes = [
      (currentIndex - 1 + images.length) % images.length,
      (currentIndex + 1) % images.length,
    ];
    adjacentIndexes.forEach((index) => {
      const image = new Image();
      image.src = images[index].fullUrl;
    });
  }, [currentIndex, images]);

  const closeFromBackdrop = (event: MouseEvent<HTMLElement>) => {
    if (event.target === event.currentTarget) onClose();
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
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] h-[100dvh] overflow-hidden bg-[#0b0907]/[0.97] text-white backdrop-blur-md"
      onClick={closeFromBackdrop}
      role="dialog"
      aria-modal="true"
      aria-label={`${copy.dialog}: ${currentCategory.title}`}
      aria-describedby="gallery-dialog-description"
      style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))', paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <div className="mx-auto flex h-full w-full max-w-[1800px] flex-col" onClick={closeFromBackdrop}>
        <div className="flex h-14 shrink-0 items-center justify-between gap-4 px-4 sm:px-8">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/55">{copy.highResolution}</p>
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

        <div className="relative min-h-0 flex-1 touch-pan-y" onClick={closeFromBackdrop} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.fullUrl}
              className="absolute inset-0 flex items-center justify-center px-2 py-2 sm:px-20 sm:py-4"
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              onClick={closeFromBackdrop}
              style={{ backgroundImage: `url(${current.previewUrl})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'contain' }}
            >
              <img
                src={current.fullUrl}
                alt={currentDescription}
                width={current.fullWidth}
                height={current.fullHeight}
                className="max-h-full max-w-full select-none object-contain shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
                draggable={false}
                decoding="async"
              />
            </motion.div>
          </AnimatePresence>

          <button type="button" onClick={previous} className="absolute left-2 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center border border-white/30 bg-black/55 text-white backdrop-blur-sm transition-colors hover:border-venetian-gold hover:bg-venetian-gold hover:text-venetian-brown sm:left-5" aria-label={copy.previous}>
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button type="button" onClick={next} className="absolute right-2 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center border border-white/30 bg-black/55 text-white backdrop-blur-sm transition-colors hover:border-venetian-gold hover:bg-venetian-gold hover:text-venetian-brown sm:right-5" aria-label={copy.next}>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="grid min-h-[5.5rem] shrink-0 grid-cols-[1fr_auto] items-center gap-5 px-4 pt-3 sm:px-20">
          <div aria-live="polite" aria-atomic="true">
            <p className="font-serif text-xl font-semibold sm:text-2xl">{currentCategory.title}</p>
            <p id="gallery-dialog-description" className="mt-1 max-w-3xl text-xs leading-5 text-white/58 sm:text-sm">{currentDescription}</p>
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/55">{copy.position(currentIndex + 1, images.length)}</p>
          <p className="sr-only">{copy.instructions}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Gallery() {
  const [selectedFilter, setSelectedFilter] = useState<GalleryFilterId>('all');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { language, t } = useLanguage();
  const copy = galleryUi[language];
  const categories = categoryCopy[language];

  const categoryCounts = useMemo(() => {
    const counts = Object.fromEntries(galleryCategories.map((category) => [category, 0])) as Record<GalleryCategoryId, number>;
    galleryImages.forEach((image) => {
      counts[image.categoryId] += 1;
    });
    return counts;
  }, []);

  const visibleImages = useMemo(
    () => selectedFilter === 'all' ? galleryImages : galleryImages.filter((image) => image.categoryId === selectedFilter),
    [selectedFilter],
  );

  const closeGallery = useCallback(() => setSelectedIndex(null), []);
  const selectFilter = (filter: GalleryFilterId) => {
    setSelectedIndex(null);
    setSelectedFilter(filter);
  };

  return (
    <>
      <section className="bg-venetian-brown py-20 text-white sm:py-28" aria-labelledby="gallery-title">
        <div className="mx-auto max-w-[1480px] px-4 sm:px-7 lg:px-10">
          <div className="mb-10 grid gap-7 border-t border-white/15 pt-7 sm:mb-14 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <p className="editorial-kicker !text-venetian-gold">{copy.kicker}</p>
              <h1 id="gallery-title" className="mt-5 font-serif text-6xl font-black uppercase leading-[0.76] tracking-[-0.05em] sm:text-9xl">{t('gallery.title')}</h1>
            </div>
            <div className="max-w-2xl lg:justify-self-end">
              <p className="text-base leading-7 text-white/62">{t('gallery.subtitle')}</p>
              <div className="mt-6 flex items-center gap-3 text-[0.67rem] font-bold uppercase tracking-[0.16em] text-venetian-gold">
                <Images className="h-4 w-4" aria-hidden="true" />
                <span>{galleryImages.length} {copy.photos}</span>
                <span aria-hidden="true">·</span>
                <span>{galleryCategories.length} {copy.archive}</span>
              </div>
            </div>
          </div>

          <div className="sticky top-[4.25rem] z-20 -mx-4 border-y border-white/15 bg-venetian-brown/95 px-4 py-3 shadow-[0_18px_40px_rgba(28,10,5,0.18)] backdrop-blur-md sm:top-[4.75rem] sm:-mx-7 sm:px-7 lg:-mx-10 lg:px-10">
            <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="group" aria-label={copy.filters}>
              <button
                type="button"
                onClick={() => selectFilter('all')}
                aria-pressed={selectedFilter === 'all'}
                className={`min-h-11 shrink-0 border px-4 text-[0.68rem] font-bold uppercase tracking-[0.14em] transition-colors ${selectedFilter === 'all' ? 'border-venetian-gold bg-venetian-gold text-venetian-brown' : 'border-white/20 text-white/72 hover:border-white/45 hover:text-white'}`}
              >
                {copy.all} <span className="ml-1 opacity-65">{galleryImages.length}</span>
              </button>
              {galleryCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => selectFilter(category)}
                  aria-pressed={selectedFilter === category}
                  className={`min-h-11 shrink-0 border px-4 text-[0.68rem] font-bold uppercase tracking-[0.14em] transition-colors ${selectedFilter === category ? 'border-venetian-gold bg-venetian-gold text-venetian-brown' : 'border-white/20 text-white/72 hover:border-white/45 hover:text-white'}`}
                >
                  {categories[category].title} <span className="ml-1 opacity-65">{categoryCounts[category]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6 mt-9 flex items-end justify-between gap-5 border-b border-white/15 pb-4 sm:mt-12">
            <div>
              <p className="font-serif text-3xl font-black uppercase leading-none sm:text-4xl">{selectedFilter === 'all' ? copy.all : categories[selectedFilter].title}</p>
              {selectedFilter !== 'all' ? <p className="mt-2 text-sm leading-6 text-white/55">{categories[selectedFilter].description}</p> : null}
            </div>
            <p className="shrink-0 text-right text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white/45" aria-live="polite">{copy.showing(visibleImages.length, galleryImages.length)}</p>
          </div>

          <div key={selectedFilter} className="columns-2 gap-2 sm:columns-3 lg:columns-4 xl:columns-5">
            {visibleImages.map((image, imageIndex) => {
              const imageCategory = categories[image.categoryId];
              const description = `${imageCategory.alt} · ${copy.photo} ${image.sequence}`;

              return (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setSelectedIndex(imageIndex)}
                  className="group relative mb-2 block w-full break-inside-avoid overflow-hidden bg-black/20 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-venetian-gold"
                  aria-label={copy.openImage(description)}
                >
                  <img
                    src={image.previewUrl}
                    alt=""
                    width={image.width}
                    height={image.height}
                    className="block h-auto w-full transition duration-700 ease-out group-hover:scale-[1.025] group-hover:brightness-[0.82]"
                    loading={imageIndex < 6 ? 'eager' : 'lazy'}
                    fetchPriority={imageIndex < 3 ? 'high' : 'auto'}
                    decoding="async"
                  />
                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/75 via-black/25 to-transparent px-3 pb-3 pt-10 text-white opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
                    <span>
                      <span className="block text-[0.6rem] font-bold uppercase tracking-[0.15em] text-venetian-gold">{imageCategory.title}</span>
                      <span className="mt-1 block text-[0.62rem] uppercase tracking-[0.12em] text-white/70">{copy.photo} {image.sequence}</span>
                    </span>
                    <span className="grid h-10 w-10 shrink-0 place-items-center border border-white/40 bg-black/25" aria-hidden="true"><ZoomIn className="h-4 w-4" /></span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedIndex !== null ? (
          <GalleryModal key={`${selectedFilter}-${selectedIndex}`} images={visibleImages} initialIndex={selectedIndex} onClose={closeGallery} language={language} />
        ) : null}
      </AnimatePresence>
    </>
  );
}

export { Gallery };
