import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../lib/i18n';
import { ChevronDown } from 'lucide-react';
import img0 from '../Img/img0.jpg';
import img1 from '../Img/img1.jpg';
import img2 from '../Img/ing2.jpg';

const images = [img0, img1, img2];

// Ken Burns animation: each slide slowly zooms + shifts slightly for cinematic feel
const kenBurnsVariants = [
  { initial: { scale: 1.12, x: 0, y: 0 }, animate: { scale: 1, x: '-2%', y: '-1%' } },
  { initial: { scale: 1.12, x: '-2%', y: 0 }, animate: { scale: 1, x: '1%', y: '-2%' } },
  { initial: { scale: 1.1, x: '1%', y: '-1%' }, animate: { scale: 1, x: 0, y: 0 } },
];

export function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const scrollToStory = () => {
    document.getElementById('story-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Ken Burns Background Slideshow */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentImageIndex}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        >
          <motion.div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
            initial={kenBurnsVariants[currentImageIndex].initial}
            animate={kenBurnsVariants[currentImageIndex].animate}
            transition={{ duration: 7, ease: 'easeInOut' }}
          />
          {/* Gradient overlay: darker at bottom for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4 sm:px-6">
        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.3em' }}
          animate={{ opacity: 1, letterSpacing: '0.2em' }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="text-venetian-gold/90 text-sm sm:text-base font-medium tracking-[0.2em] uppercase mb-6"
        >
          {t('hero.tagline')}
        </motion.p>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: 'easeOut' }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-white mb-6 leading-tight max-w-4xl whitespace-pre-line"
        >
          {t('hero.title')}
        </motion.h1>

        {/* Decorative divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="w-24 h-px bg-venetian-gold mb-6 origin-center"
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="text-base sm:text-lg md:text-xl text-venetian-sandstone/90 mb-10 max-w-2xl px-4 leading-relaxed"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center px-4"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto"
          >
            <Link to="/reserve" className="block">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-venetian-gold text-venetian-brown hover:bg-venetian-gold/90 shadow-lg shadow-venetian-gold/30 font-semibold px-8"
              >
                {t('hero.reserveButton')}
              </Button>
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto"
          >
            <Link to="/menu" className="block">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-venetian-sandstone/70 text-venetian-sandstone hover:bg-venetian-sandstone/10 px-8"
              >
                {t('hero.viewMenu')}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              index === currentImageIndex
                ? 'bg-venetian-gold w-8'
                : 'bg-venetian-sandstone/40 hover:bg-venetian-sandstone/70 w-3'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToStory}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-venetian-sandstone/60 hover:text-venetian-sandstone transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        aria-label="Scroll to content"
      >
        <span className="text-xs tracking-widest uppercase">{t('hero.scrollHint')}</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.button>
    </div>
  );
}
