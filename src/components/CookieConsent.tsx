import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { Cookie } from 'lucide-react';
import { Link } from 'react-router-dom';
import { readConsent, saveConsent } from '../lib/analytics';

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const consent = readConsent();
    if (!consent) {
      setShowConsent(true);
    } else {
      setAnalytics(consent.analytics);
      setMarketing(consent.marketing);
    }

    const openPreferences = () => {
      const current = readConsent();
      setAnalytics(current?.analytics ?? false);
      setMarketing(current?.marketing ?? false);
      setShowPreferences(true);
      setShowConsent(true);
    };
    window.addEventListener('open-cookie-settings', openPreferences);
    return () => window.removeEventListener('open-cookie-settings', openPreferences);
  }, []);

  const handleAccept = () => {
    saveConsent({ analytics: true, marketing: true });
    setShowConsent(false);
  };

  const handleReject = () => {
    saveConsent({ analytics: false, marketing: false });
    setShowConsent(false);
  };

  const handleSave = () => {
    saveConsent({ analytics, marketing });
    setShowConsent(false);
  };

  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-consent-title"
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white dark:bg-venetian-brown/95 shadow-lg border-t border-venetian-brown/10 dark:border-venetian-sandstone/10"
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Cookie className="w-6 h-6 text-venetian-gold flex-shrink-0 mt-1" />
              <div>
                <h3 id="cookie-consent-title" className="text-lg font-medium text-venetian-brown dark:text-venetian-sandstone mb-1">
                  We value your privacy
                </h3>
                <p className="text-sm text-venetian-brown/90 dark:text-venetian-sandstone/90">
                  We use optional analytics and advertising technologies only with your consent. Essential functions work without them. Read our{' '}
                  <Link to="/privacy" className="font-semibold text-venetian-brown dark:text-venetian-sandstone underline decoration-venetian-gold decoration-2 underline-offset-2">
                    Privacy Policy
                  </Link>{' '}
                  to learn more.
                </p>
              </div>
            </div>
            {showPreferences && (
              <div className="w-full sm:w-auto grid grid-cols-2 gap-3 text-sm">
                <label className="flex items-center gap-2 text-venetian-brown dark:text-venetian-sandstone">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={event => setAnalytics(event.target.checked)}
                    className="accent-venetian-gold"
                  />
                  Analytics
                </label>
                <label className="flex items-center gap-2 text-venetian-brown dark:text-venetian-sandstone">
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={event => setMarketing(event.target.checked)}
                    className="accent-venetian-gold"
                  />
                  Advertising
                </label>
              </div>
            )}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReject}
                className="whitespace-nowrap"
              >
                Reject All
              </Button>
              {showPreferences ? (
                <Button variant="outline" size="sm" onClick={handleSave}>
                  Save choices
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setShowPreferences(true)}>
                  Customize
                </Button>
              )}
              <Button
                size="sm"
                onClick={handleAccept}
                className="bg-venetian-gold text-[#4A3329] font-semibold hover:bg-venetian-gold/90 whitespace-nowrap"
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
