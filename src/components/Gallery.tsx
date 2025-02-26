import { motion, useMotionValue, useSpring, useTransform, animate, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../lib/i18n';

// Import food images
import img2980 from '../Img/food/IMG_2980.JPEG';
import img2984 from '../Img/food/IMG_2984.JPEG';
import img2985 from '../Img/food/IMG_2985.JPEG';
import img2986 from '../Img/food/IMG_2986.JPEG';

// Import G1 images
import img2922 from '../Img/G1/IMG_2922.JPEG';
import img2941 from '../Img/G1/IMG_2941.JPEG';
import img2943 from '../Img/G1/IMG_2943.JPEG';
import img2960 from '../Img/G1/IMG_2960.JPEG';
import img2962 from '../Img/G1/IMG_2962.JPEG';
import img2968 from '../Img/G1/IMG_2968.JPEG';
import img2978 from '../Img/G1/IMG_2978.JPEG';
import img2982 from '../Img/G1/IMG_2992.JPEG';

type GalleryImage = {
  url: string;
  alt: string;
};

type GalleryGroup = {
  id: 'dishes' | 'ingredients' | 'ambiance' | 'desserts';
  images: GalleryImage[];
};

const galleryGroups: GalleryGroup[] = [
  {
    id: 'dishes',
    images: [
      {
        url: img2980,
        alt: 'Venetian seafood dish'
      },
      {
        url: img2984,
        alt: 'Traditional pasta dish'
      },
      {
        url: img2985,
        alt: 'Risotto with seafood'
      },
      {
        url: img2986,
        alt: 'Another Italian dish'
      }
    ]
  },
  {
    id: 'ingredients',
    images: [
      {
        url: img2922,
        alt: 'Fresh vegetables'
      },
      {
        url: img2941,
        alt: 'Fresh seafood'
      },
      {
        url: img2943,
        alt: 'Fresh herbs'
      }
    ]
  },
  {
    id: 'ambiance',
    images: [
      {
        url: img2960,
        alt: 'Restaurant interior'
      },
      {
        url: img2962,
        alt: 'Table setting'
      },
      {
        url: img2968,
        alt: 'Dining area'
      }
    ]
  },
  {
    id: 'desserts',
    images: [
      {
        url: img2978,
        alt: 'Italian desserts'
      },
      {
        url: img2982,
        alt: 'Panna cotta'
      }
    ]
  }
];

function GalleryModal({ group, onClose }: { group: GalleryGroup; onClose: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        setCurrentIndex(prev => (prev - 1 + group.images.length) % group.images.length);
      }
      if (e.key === 'ArrowRight') {
        setCurrentIndex(prev => (prev + 1) % group.images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [group.images.length, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white"
      >
        <X size={24} />
      </button>

      <div
        ref={containerRef}
        className="h-full flex items-center justify-center p-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative max-w-5xl w-full">
          <div className="aspect-[16/9] rounded-lg overflow-hidden">
            <motion.img
              key={currentIndex}
              src={group.images[currentIndex].url}
              alt={group.images[currentIndex].alt}
              className="w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            />
          </div>

          {/* Navigation Dots */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {group.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-venetian-gold w-4'
                    : 'bg-white/50 hover:bg-white'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Gallery() {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState<GalleryGroup | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMouseX(e.clientX - rect.left);
        setMouseY(e.clientY - rect.top);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <section
        ref={containerRef}
        className="relative min-h-[600px] overflow-hidden bg-gradient-to-b from-venetian-brown/90 to-venetian-brown/70"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '32px 32px'
            }}
          />
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif text-white mb-4">
              {t('gallery.title')}
            </h2>
            <p className="text-lg text-venetian-sandstone/80 max-w-2xl mx-auto">
              {t('gallery.subtitle')}
            </p>
          </motion.div>

          {/* Gallery Groups */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {galleryGroups.map((group, groupIndex) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: groupIndex * 0.1 }}
                className="relative h-[300px] group"
              >
                <motion.button
                  onClick={() => setSelectedGroup(group)}
                  className="w-full h-full rounded-xl overflow-hidden relative"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                  <img
                    src={group.images[0].url}
                    alt={t(`gallery.groups.${group.id}.title`)}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 z-20">
                    <h3 className="text-xl font-serif text-white mb-1">
                      {t(`gallery.groups.${group.id}.title`)}
                    </h3>
                    <p className="text-sm text-white/80">
                      {t(`gallery.groups.${group.id}.description`)}
                    </p>
                  </div>
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selectedGroup && (
          <GalleryModal
            group={selectedGroup}
            onClose={() => setSelectedGroup(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export { Gallery };