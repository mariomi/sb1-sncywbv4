import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { Cookie, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowConsent(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setShowConsent(false);
  };

  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white dark:bg-venetian-brown/95 shadow-lg border-t border-venetian-brown/10 dark:border-venetian-sandstone/10"
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Cookie className="w-6 h-6 text-venetian-gold flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-medium text-venetian-brown dark:text-venetian-sandstone mb-1">
                  We value your privacy
                </h3>
                <p className="text-sm text-venetian-brown/70 dark:text-venetian-sandstone/70">
                  We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                  By clicking "Accept All", you consent to our use of cookies. Read our{' '}
                  <Link to="/privacy" className="text-venetian-gold hover:underline">
                    Privacy Policy
                  </Link>{' '}
                  to learn more.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReject}
                className="whitespace-nowrap"
              >
                Reject All
              </Button>
              <Button
                size="sm"
                onClick={handleAccept}
                className="bg-venetian-gold text-venetian-brown hover:bg-venetian-gold/90 whitespace-nowrap"
              >
                Accept All
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}