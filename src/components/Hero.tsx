import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../lib/i18n';
import img0 from '../Img/img0.jpg';
import img1 from '../Img/img1.jpg';
import img2 from '../Img/ing2.jpg';

const images = [
  img0,
  img1,
  img2
];

export function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Images */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-10000 scale-110"
            style={{
              backgroundImage: `url(${images[currentImageIndex]})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-venetian-brown/70 to-venetian-brown/90" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center text-center px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-venetian-sandstone mb-8 px-4">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Link to="/reserve" className="block">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-venetian-gold text-venetian-brown hover:bg-venetian-gold/90"
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
                  className="w-full sm:w-auto border-venetian-sandstone text-venetian-sandstone hover:bg-venetian-sandstone/10"
                >
                  {t('hero.viewMenu')}
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Image Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentImageIndex
                ? 'bg-venetian-gold w-4'
                : 'bg-venetian-sandstone/50 hover:bg-venetian-sandstone'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}