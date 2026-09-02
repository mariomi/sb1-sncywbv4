import React, { useState, useEffect } from 'react';
import RestaurantMenu from '../components/MenuEditorial';
import { SEOHead } from '../components/SEOHead';
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '../components/PageTransition';

export function MenuPage() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <PageTransition>
      <SEOHead
        title="Menu"
        canonical="/menu"
        description="Scopri il menu del Ristorante Al Gobbo di Rialto: pesce fresco della laguna, risotti di mare, paste fatte in casa e pizze artigianali. Cucina veneziana autentica dal 1955."
      />
      <RestaurantMenu />
      
      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-24 right-5 z-50 grid h-12 w-12 place-items-center border border-venetian-brown bg-venetian-brown text-white shadow-lg transition-colors hover:border-venetian-terracotta hover:bg-venetian-terracotta sm:right-8"
            aria-label="Back to top"
          >
            <ChevronUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
