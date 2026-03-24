import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';
import { SEOHead } from '../components/SEOHead';
import { useLanguage } from '../lib/i18n';
import { Link } from 'react-router-dom';

interface FaqItem {
  question: string;
  answer: string;
}

const faqsIt: FaqItem[] = [
  {
    question: 'Come posso prenotare un tavolo?',
    answer:
      'Puoi prenotare direttamente online tramite la pagina Prenota del nostro sito, oppure chiamarci al +39 041 520 4603. Accettiamo prenotazioni per pranzo (12:00–14:30) e cena (19:00–22:00), dal lunedì al sabato escluso il martedì, e la domenica.',
  },
  {
    question: 'Quali giorni siete aperti?',
    answer:
      'Siamo aperti lunedì, mercoledì, giovedì, venerdì, sabato e domenica. Siamo chiusi il martedì. Orari: pranzo 12:00–14:30, cena 19:00–22:00.',
  },
  {
    question: 'Dove si trova il ristorante?',
    answer:
      'Siamo in Sestiere San Polo 649, a pochi passi dal Ponte di Rialto a Venezia (CAP 30125). Raggiungibile a piedi dal vaporetto Rialto Mercato in circa 2 minuti.',
  },
  {
    question: 'Il ristorante è adatto alle famiglie con bambini?',
    answer:
      "Sì, siamo un ristorante a misura di famiglia! Disponiamo di seggioloni per bambini e un menu che soddisfa anche i palati più piccoli. Vi accogliamo con piacere.",
  },
  {
    question: 'Avete opzioni vegetariane o per allergie alimentari?',
    answer:
      'Il nostro menu include piatti vegetariani, chiaramente segnalati. Per allergie o intolleranze alimentari vi preghiamo di informarci al momento della prenotazione o all\'arrivo: lo chef adatterà i piatti alle vostre esigenze.',
  },
  {
    question: 'Qual è la vostra specialità?',
    answer:
      'Siamo famosi per il pesce fresco della laguna veneziana, i risotti di mare, le paste fatte in casa e le pizze artigianali. Dal 1955 proponiamo l\'autentica cucina veneziana con ingredienti selezionati ogni giorno al mercato di Rialto.',
  },
  {
    question: 'È possibile organizzare eventi privati o cene di gruppo?',
    answer:
      'Certamente! Organizziamo cene private, compleanni, anniversari e pranzi di gruppo. Contattateci tramite il modulo online o chiamateci al +39 041 520 4603 per discutere il vostro evento e ricevere un preventivo personalizzato.',
  },
];

const faqsEn: FaqItem[] = [
  {
    question: 'How can I book a table?',
    answer:
      'You can book directly online via our Reserve page, or call us at +39 041 520 4603. We accept reservations for lunch (12:00–14:30) and dinner (19:00–22:00), Monday to Saturday except Tuesday, and on Sunday.',
  },
  {
    question: 'Which days are you open?',
    answer:
      'We are open Monday, Wednesday, Thursday, Friday, Saturday and Sunday. We are closed on Tuesday. Hours: lunch 12:00–14:30, dinner 19:00–22:00.',
  },
  {
    question: 'Where is the restaurant located?',
    answer:
      'We are at Sestiere San Polo 649, a short walk from the Rialto Bridge in Venice (postcode 30125). Reachable on foot from the Rialto Mercato vaporetto stop in about 2 minutes.',
  },
  {
    question: 'Is the restaurant family-friendly?',
    answer:
      'Yes, we are a family-friendly restaurant! We have high chairs for children and a menu that suits even the youngest palates.',
  },
  {
    question: 'Do you have vegetarian options or cater for food allergies?',
    answer:
      'Our menu includes vegetarian dishes, clearly marked. For allergies or food intolerances please let us know when booking or upon arrival — our chef will be happy to adapt dishes to your needs.',
  },
  {
    question: "What is your restaurant's speciality?",
    answer:
      'We are known for fresh lagoon fish, seafood risottos, homemade pasta and artisan pizzas. Since 1955 we have served authentic Venetian cuisine with ingredients selected daily at the Rialto market.',
  },
  {
    question: 'Can you organise private events or group dinners?',
    answer:
      'Of course! We organise private dinners, birthdays, anniversaries and group lunches. Contact us via the online form or call +39 041 520 4603 to discuss your event and receive a personalised quote.',
  },
];

function AccordionItem({ item, index }: { item: FaqItem; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="border border-venetian-brown/20 dark:border-venetian-sandstone/20 rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left bg-white dark:bg-venetian-brown/40 hover:bg-venetian-sandstone/30 dark:hover:bg-venetian-brown/60 transition-colors"
        aria-expanded={open}
      >
        <span className="font-serif text-base sm:text-lg text-venetian-brown dark:text-venetian-sandstone font-medium">
          {item.question}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0 text-venetian-gold"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="px-6 py-5 text-venetian-brown/80 dark:text-venetian-sandstone/80 leading-relaxed bg-venetian-sandstone/20 dark:bg-venetian-brown/20 text-sm sm:text-base">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FaqPage() {
  const { language } = useLanguage();
  const faqs = language === 'it' ? faqsIt : faqsEn;

  return (
    <PageTransition>
      <SEOHead
        title="Domande Frequenti – FAQ"
        canonical="/faq"
        description="Domande frequenti sul Ristorante Al Gobbo di Rialto a Venezia. Orari, prenotazioni, menu, allergie, eventi privati e molto altro."
      />

      <div className="min-h-screen bg-venetian-sandstone/20 dark:bg-venetian-brown/95 pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="text-venetian-gold text-sm font-medium tracking-[0.2em] uppercase mb-3">
              {language === 'it' ? 'Hai domande?' : 'Have questions?'}
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl text-venetian-brown dark:text-venetian-sandstone mb-4">
              {language === 'it' ? 'Domande Frequenti' : 'Frequently Asked Questions'}
            </h1>
            <div className="w-16 h-px bg-venetian-gold mx-auto mb-6" />
            <p className="text-venetian-brown/70 dark:text-venetian-sandstone/70 text-base sm:text-lg max-w-xl mx-auto">
              {language === 'it'
                ? 'Trova le risposte alle domande più comuni sul nostro ristorante.'
                : 'Find answers to the most common questions about our restaurant.'}
            </p>
          </motion.div>

          {/* Accordion */}
          <div className="space-y-3">
            {faqs.map((item, index) => (
              <AccordionItem key={index} item={item} index={index} />
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-16 text-center bg-venetian-brown dark:bg-venetian-brown/80 rounded-2xl p-8 sm:p-10"
          >
            <h2 className="font-serif text-2xl sm:text-3xl text-venetian-sandstone mb-3">
              {language === 'it' ? 'Non hai trovato la risposta?' : "Didn't find your answer?"}
            </h2>
            <p className="text-venetian-sandstone/70 mb-6 text-sm sm:text-base">
              {language === 'it'
                ? 'Contattaci direttamente — saremo felici di aiutarti.'
                : 'Contact us directly — we will be happy to help.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-block px-6 py-3 rounded-xl bg-venetian-gold text-venetian-brown font-semibold text-sm hover:bg-venetian-gold/90 transition-colors"
              >
                {language === 'it' ? 'Scrivici' : 'Contact Us'}
              </Link>
              <Link
                to="/reserve"
                className="inline-block px-6 py-3 rounded-xl border-2 border-venetian-sandstone/40 text-venetian-sandstone font-semibold text-sm hover:bg-venetian-sandstone/10 transition-colors"
              >
                {language === 'it' ? 'Prenota un tavolo' : 'Book a Table'}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
