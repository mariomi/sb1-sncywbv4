import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from './Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './Logo';
import { Link, useLocation } from 'react-router-dom';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { useLanguage } from '../lib/i18n';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: t('nav.menu'), path: '/menu' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.contact'), path: '/contact' }
  ];

  return (
    <motion.div 
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="px-3 sm:px-6 lg:px-8 pt-4">
        <nav className="relative mx-auto max-w-7xl">
          <motion.div 
            className={`relative backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden transition-all duration-500 ${
              isScrolled 
                ? 'bg-venetian-brown/80 dark:bg-venetian-brown w-12 h-12 mx-auto flex items-center justify-center' 
                : 'bg-gradient-to-b from-venetian-brown/80 to-venetian-brown/70 dark:from-venetian-brown dark:to-venetian-brown/90 w-full'
            }`}
            animate={{
              borderRadius: isScrolled ? '9999px' : '1rem',
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            whileHover={{ 
              scale: isScrolled ? 1.05 : 1,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            onClick={() => isScrolled && setIsMenuOpen(!isMenuOpen)}
          >
            {isScrolled ? (
              <motion.div
                className="flex items-center justify-center w-full h-full"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                <Logo className="text-venetian-gold" size={24} />
              </motion.div>
            ) : (
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  <motion.div 
                    className="flex-shrink-0 flex items-center space-x-3"
                  >
                    <Link to="/">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                      >
                        <Logo className="text-venetian-gold" size={28} />
                      </motion.div>
                    </Link>
                    <div>
                      <h1 className="text-base sm:text-lg font-serif text-white whitespace-nowrap">Al Gobbo di Rialto</h1>
                      <p className="text-[10px] text-venetian-sandstone/80 font-medium tracking-wider">VENEZIA • EST. 1955</p>
                    </div>
                  </motion.div>
                  
                  <div className="hidden md:flex items-center">
                    <div className="flex space-x-6 mx-6">
                      {navItems.map((item) => (
                        <motion.div
                          key={item.name}
                          whileHover={{ y: -2 }}
                          transition={{ 
                            type: "spring",
                            stiffness: 300,
                            damping: 10
                          }}
                        >
                          <Link
                            to={item.path}
                            className={`relative text-sm text-venetian-sandstone hover:text-white font-medium tracking-wide transition-colors duration-300 ${
                              location.pathname === item.path ? 'text-white' : ''
                            }`}
                          >
                            {item.name}
                            <motion.span 
                              className={`absolute inset-x-0 bottom-0 h-0.5 bg-venetian-gold ${
                                location.pathname === item.path ? 'scale-x-100' : 'scale-x-0'
                              }`}
                              initial={false}
                              animate={{ 
                                scaleX: location.pathname === item.path ? 1 : 0 
                              }}
                              transition={{ duration: 0.4, ease: "easeInOut" }}
                            />
                          </Link>
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex items-center space-x-4">
                      <ThemeToggle />
                      <LanguageSwitcher />
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="ml-6"
                    >
                      <Link to="/reserve">
                        <Button 
                          size="sm"
                          className="bg-venetian-gold/90 text-venetian-brown hover:bg-venetian-gold transition-colors duration-300 shadow-sm rounded-lg"
                        >
                          {t('nav.reserve')}
                        </Button>
                      </Link>
                    </motion.div>
                  </div>

                  <motion.div 
                    className="md:hidden"
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="p-2 rounded-lg text-venetian-sandstone hover:text-white transition-colors duration-300 hover:bg-white/10"
                      aria-label="Toggle menu"
                    >
                      {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                  </motion.div>
                </div>
              </div>
            )}
          </motion.div>
        </nav>
      </div>

      <AnimatePresence>
        {(isMenuOpen && !isScrolled) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="md:hidden bg-venetian-brown/90 dark:bg-venetian-brown backdrop-blur-sm mx-3 mt-2 rounded-xl overflow-hidden"
          >
            <div className="py-2 px-4 space-y-1">
              {[...navItems, { name: t('nav.reserve'), path: '/reserve' }].map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ 
                    delay: index * 0.1,
                    duration: 0.4,
                    ease: "easeOut"
                  }}
                >
                  <Link
                    to={item.path}
                    className={`block py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-300 ${
                      location.pathname === item.path
                        ? 'bg-white/10 text-white'
                        : 'text-venetian-sandstone hover:text-white hover:bg-white/5'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ 
                  delay: navItems.length * 0.1,
                  duration: 0.4,
                  ease: "easeOut"
                }}
                className="pt-2 border-t border-white/10 flex items-center justify-between"
              >
                <LanguageSwitcher />
                <ThemeToggle />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isScrolled && isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed top-20 left-1/2 -translate-x-1/2 bg-venetian-brown/90 dark:bg-venetian-brown backdrop-blur-sm rounded-lg shadow-sm overflow-hidden w-[90%] max-w-xs"
          >
            <div className="py-2">
              {[...navItems, { name: t('nav.reserve'), path: '/reserve' }].map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ 
                    delay: index * 0.1,
                    duration: 0.4,
                    ease: "easeOut"
                  }}
                >
                  <Link
                    to={item.path}
                    className={`block px-4 py-2 text-sm font-medium text-venetian-sandstone hover:text-white hover:bg-white/5 transition-colors duration-300 ${
                      location.pathname === item.path ? 'text-white bg-white/10' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ 
                  delay: navItems.length * 0.1,
                  duration: 0.4,
                  ease: "easeOut"
                }}
                className="px-4 py-2 border-t border-white/10 flex items-center justify-between"
              >
                <LanguageSwitcher />
                <ThemeToggle />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}