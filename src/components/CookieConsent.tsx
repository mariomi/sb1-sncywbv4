import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { Cookie, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { readConsent, saveConsent } from '../lib/analytics';
import { useLanguage, type Language } from '../lib/i18n';

const consentCopy: Record<Language, {
  title: string;
  body: string;
  privacy: string;
  learnMore: string;
  analytics: string;
  advertising: string;
  reject: string;
  save: string;
  customize: string;
  accept: string;
  close: string;
}> = {
  en: { title: 'We value your privacy', body: 'Optional analytics and advertising tools remain off until you consent. Reject or close this notice to continue with technical tools only. Read our', privacy: 'Privacy Policy', learnMore: 'to learn more.', analytics: 'Analytics', advertising: 'Advertising', reject: 'Reject all', save: 'Save choices', customize: 'Customize', accept: 'Accept all', close: 'Close and reject optional tools' },
  it: { title: 'La tua privacy è importante', body: 'Gli strumenti facoltativi di analisi e pubblicità restano spenti finché non acconsenti. Rifiuta o chiudi per continuare con i soli strumenti tecnici. Leggi la nostra', privacy: 'Privacy Policy', learnMore: 'per saperne di più.', analytics: 'Analisi', advertising: 'Pubblicità', reject: 'Rifiuta tutto', save: 'Salva scelte', customize: 'Personalizza', accept: 'Accetta tutto', close: 'Chiudi e rifiuta gli strumenti facoltativi' },
  fr: { title: 'Votre vie privée compte', body: 'Les outils facultatifs d’analyse et de publicité restent désactivés sans votre accord. Refusez ou fermez pour continuer avec les seuls outils techniques. Consultez notre', privacy: 'Politique de confidentialité', learnMore: 'pour en savoir plus.', analytics: 'Analyse', advertising: 'Publicité', reject: 'Tout refuser', save: 'Enregistrer', customize: 'Personnaliser', accept: 'Tout accepter', close: 'Fermer et refuser les outils facultatifs' },
  de: { title: 'Ihre Privatsphäre ist uns wichtig', body: 'Optionale Analyse- und Werbetools bleiben ohne Einwilligung aus. Ablehnen oder schließen bedeutet, nur technische Tools zu verwenden. Lesen Sie unsere', privacy: 'Datenschutzerklärung', learnMore: 'für weitere Informationen.', analytics: 'Analyse', advertising: 'Werbung', reject: 'Alle ablehnen', save: 'Auswahl speichern', customize: 'Anpassen', accept: 'Alle akzeptieren', close: 'Schließen und optionale Tools ablehnen' },
  es: { title: 'Tu privacidad nos importa', body: 'Las herramientas opcionales de análisis y publicidad permanecen desactivadas sin tu consentimiento. Rechaza o cierra para usar solo herramientas técnicas. Lee nuestra', privacy: 'Política de privacidad', learnMore: 'para saber más.', analytics: 'Análisis', advertising: 'Publicidad', reject: 'Rechazar todo', save: 'Guardar opciones', customize: 'Personalizar', accept: 'Aceptar todo', close: 'Cerrar y rechazar herramientas opcionales' },
};

export function CookieConsent() {
  const { language } = useLanguage();
  const copy = consentCopy[language];
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
          role="region"
          aria-labelledby="cookie-consent-title"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-venetian-brown p-4 pr-12 text-white shadow-[0_-18px_50px_rgba(17,16,14,0.18)]"
        >
          <button type="button" onClick={handleReject} aria-label={copy.close} title={copy.close} className="absolute right-2 top-2 grid h-11 w-11 place-items-center border border-white/25 text-white hover:border-venetian-gold hover:text-venetian-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><X className="h-5 w-5" /></button>
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Cookie className="mt-1 h-6 w-6 flex-shrink-0 text-venetian-gold" />
              <div>
                <h3 id="cookie-consent-title" className="mb-1 font-serif text-2xl font-semibold text-white">
                  {copy.title}
                </h3>
                <p className="max-w-3xl text-sm leading-6 text-white/62">
                  {copy.body}{' '}
                  <Link to="/privacy" className="font-semibold text-white underline decoration-venetian-gold decoration-2 underline-offset-2">
                    {copy.privacy}
                  </Link>{' '}
                  {copy.learnMore}
                </p>
              </div>
            </div>
            {showPreferences && (
              <div className="w-full sm:w-auto grid grid-cols-2 gap-3 text-sm">
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={event => setAnalytics(event.target.checked)}
                    className="accent-venetian-gold"
                  />
                  {copy.analytics}
                </label>
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={event => setMarketing(event.target.checked)}
                    className="accent-venetian-gold"
                  />
                  {copy.advertising}
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
                {copy.reject}
              </Button>
              {showPreferences ? (
                <Button variant="outline" size="sm" onClick={handleSave}>
                  {copy.save}
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setShowPreferences(true)}>
                  {copy.customize}
                </Button>
              )}
              <Button
                size="sm"
                onClick={handleAccept}
                className="rounded-none bg-venetian-gold font-semibold text-venetian-brown hover:bg-white whitespace-nowrap"
              >
                {copy.accept}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
