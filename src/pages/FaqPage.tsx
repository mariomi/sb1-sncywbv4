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
      'You can book directly online via our Book a Table page, or call us at +39 041 520 4603. We accept reservations for lunch (12:00–14:30) and dinner (19:00–22:00), Monday to Saturday except Tuesday, and on Sunday.',
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
      className="overflow-hidden border-t border-venetian-brown/20 last:border-b dark:border-white/15"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex min-h-20 w-full items-center justify-between gap-5 bg-transparent py-5 text-left transition-colors hover:text-venetian-terracotta"
        aria-expanded={open}
      >
        <span className="flex items-start gap-4"><span className="mt-1 text-[0.62rem] font-bold tracking-[0.14em] text-venetian-terracotta">{String(index + 1).padStart(2, '0')}</span><span className="font-serif text-xl font-semibold text-venetian-brown sm:text-2xl dark:text-white">{item.question}</span></span>
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
            <p className="pb-7 pl-10 pr-12 text-sm leading-7 text-venetian-brown/65 sm:pl-12 sm:text-base dark:text-white/60">
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
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <PageTransition>
      <SEOHead
        title="Domande Frequenti – FAQ"
        canonical="/faq"
        description="Domande frequenti sul Ristorante Al Gobbo di Rialto a Venezia. Orari, prenotazioni, menu, allergie, eventi privati e molto altro."
        availableLanguages={['en', 'it']}
        structuredData={faqSchema}
      />

      <div className="min-h-screen bg-[#f7f3eb] pb-20 pt-[84px] dark:bg-venetian-brown">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-7 sm:py-24">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 border-t border-venetian-brown pt-7 text-left dark:border-white"
          >
            <p className="editorial-kicker">
              {language === 'it' ? 'Hai domande?' : 'Have questions?'}
            </p>
            <h1 className="mt-5 max-w-[10ch] font-serif text-6xl font-semibold leading-[0.82] text-venetian-brown sm:text-8xl dark:text-white">
              {language === 'it' ? 'Domande Frequenti' : 'Frequently Asked Questions'}
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-venetian-brown/65 dark:text-white/60">
              {language === 'it'
                ? 'Trova le risposte alle domande più comuni sul nostro ristorante.'
                : 'Find answers to the most common questions about our restaurant.'}
            </p>
          </motion.div>

          {/* Accordion */}
          <div>
            {faqs.map((item, index) => (
              <AccordionItem key={index} item={item} index={index} />
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-20 bg-venetian-terracotta p-8 text-center text-white sm:p-12"
          >
            <h2 className="mb-3 font-serif text-4xl font-semibold sm:text-5xl">
              {language === 'it' ? 'Non hai trovato la risposta?' : "Didn't find your answer?"}
            </h2>
            <p className="mb-7 text-sm text-white/65 sm:text-base">
              {language === 'it'
                ? 'Contattaci direttamente — saremo felici di aiutarti.'
                : 'Contact us directly — we will be happy to help.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex min-h-12 items-center justify-center bg-white px-6 text-xs font-bold uppercase tracking-[0.14em] text-venetian-terracotta hover:bg-venetian-gold hover:text-venetian-brown"
              >
                {language === 'it' ? 'Scrivici' : 'Contact Us'}
              </Link>
              <Link
                to="/book"
                className="inline-flex min-h-12 items-center justify-center border border-white/35 px-6 text-xs font-bold uppercase tracking-[0.14em] text-white hover:border-white"
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
