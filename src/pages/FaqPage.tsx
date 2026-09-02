import React, { useId, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';
import { SEOHead } from '../components/SEOHead';
import { useLanguage, type Language } from '../lib/i18n';
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
      'Il nostro menu include alcune opzioni vegetariane. Per allergie o intolleranze, segnalale durante la prenotazione e parlane sempre con il personale prima di ordinare: ti indicheremo le preparazioni adatte e le informazioni disponibili sugli allergeni.',
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
      'Our menu includes some vegetarian options. If you have allergies or food intolerances, tell us when booking and always speak with our team before ordering so we can explain suitable dishes and the available allergen information.',
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

const faqsFr: FaqItem[] = [
  { question: 'Comment réserver une table ?', answer: 'Réservez directement sur la page Réserver de notre site ou appelez le +39 041 520 4603. Les réservations sont possibles pour le déjeuner (12:00–14:30) et le dîner (19:00–22:00), tous les jours sauf le mardi.' },
  { question: 'Quels jours êtes-vous ouverts ?', answer: 'Nous sommes ouverts lundi, mercredi, jeudi, vendredi, samedi et dimanche. Fermé le mardi. Horaires : déjeuner 12:00–14:30, dîner 19:00–22:00.' },
  { question: 'Où se trouve le restaurant ?', answer: 'Nous sommes à San Polo 649, à quelques pas du pont du Rialto à Venise. L’arrêt de vaporetto Rialto Mercato se trouve à environ deux minutes à pied.' },
  { question: 'Le restaurant accueille-t-il les familles ?', answer: 'Oui. Nous disposons de chaises hautes et accueillons volontiers les familles avec enfants.' },
  { question: 'Proposez-vous des options végétariennes ou adaptées aux allergies ?', answer: 'Notre carte comprend quelques options végétariennes. Pour toute allergie ou intolérance, signalez-la lors de la réservation et parlez-en toujours à notre équipe avant de commander : elle vous indiquera les plats adaptés et les informations disponibles sur les allergènes.' },
  { question: 'Quelles sont vos spécialités ?', answer: 'Nous sommes connus pour les poissons de la lagune, les risottos aux fruits de mer, les pâtes et les pizzas artisanales, dans l’esprit de la cuisine vénitienne.' },
  { question: 'Organisez-vous des événements privés ou des repas de groupe ?', answer: 'Oui. Contactez-nous via le formulaire ou appelez le +39 041 520 4603 pour nous parler de votre événement et vérifier les possibilités.' },
];

const faqsDe: FaqItem[] = [
  { question: 'Wie kann ich einen Tisch reservieren?', answer: 'Reservieren Sie direkt über unsere Reservierungsseite oder telefonisch unter +39 041 520 4603. Reservierungen sind zum Mittagessen (12:00–14:30) und Abendessen (19:00–22:00) möglich, täglich außer Dienstag.' },
  { question: 'An welchen Tagen ist das Restaurant geöffnet?', answer: 'Wir sind montags, mittwochs, donnerstags, freitags, samstags und sonntags geöffnet. Dienstag ist Ruhetag. Mittagessen 12:00–14:30, Abendessen 19:00–22:00.' },
  { question: 'Wo befindet sich das Restaurant?', answer: 'Sie finden uns in San Polo 649, nur wenige Schritte von der Rialtobrücke entfernt. Von der Vaporetto-Haltestelle Rialto Mercato sind es etwa zwei Minuten zu Fuß.' },
  { question: 'Ist das Restaurant familienfreundlich?', answer: 'Ja. Hochstühle sind vorhanden und Familien mit Kindern sind bei uns herzlich willkommen.' },
  { question: 'Gibt es vegetarische Gerichte oder Hilfe bei Allergien?', answer: 'Unsere Speisekarte enthält einige vegetarische Gerichte. Bitte teilen Sie Allergien oder Unverträglichkeiten bei der Reservierung mit und sprechen Sie vor der Bestellung mit unserem Team. Es erklärt Ihnen geeignete Gerichte und die verfügbaren Allergeninformationen.' },
  { question: 'Was sind Ihre Spezialitäten?', answer: 'Bekannt sind wir für Fisch aus der Lagune, Meeresfrüchte-Risotto, Pasta und handwerklich zubereitete Pizza im Stil der venezianischen Küche.' },
  { question: 'Sind private Feiern oder Gruppenessen möglich?', answer: 'Ja. Schreiben Sie uns über das Kontaktformular oder rufen Sie +39 041 520 4603 an, damit wir die Möglichkeiten für Ihre Veranstaltung besprechen können.' },
];

const faqsEs: FaqItem[] = [
  { question: '¿Cómo puedo reservar una mesa?', answer: 'Reserva directamente desde la página Reservar de nuestra web o llama al +39 041 520 4603. Aceptamos reservas para comida (12:00–14:30) y cena (19:00–22:00), todos los días excepto el martes.' },
  { question: '¿Qué días está abierto el restaurante?', answer: 'Abrimos lunes, miércoles, jueves, viernes, sábado y domingo. Cerramos los martes. Horario: comida 12:00–14:30 y cena 19:00–22:00.' },
  { question: '¿Dónde está el restaurante?', answer: 'Estamos en San Polo 649, a pocos pasos del puente de Rialto. Desde la parada de vaporetto Rialto Mercato se llega andando en unos dos minutos.' },
  { question: '¿El restaurante es adecuado para familias?', answer: 'Sí. Disponemos de tronas y recibimos con mucho gusto a las familias con niños.' },
  { question: '¿Hay opciones vegetarianas o información para alergias?', answer: 'La carta incluye algunas opciones vegetarianas. Si tienes alergias o intolerancias, indícalo al reservar y habla siempre con nuestro equipo antes de pedir. Te explicará qué platos son adecuados y la información disponible sobre alérgenos.' },
  { question: '¿Cuáles son vuestras especialidades?', answer: 'Somos conocidos por el pescado de la laguna, los risottos de marisco, la pasta y las pizzas artesanales, con el sabor de la cocina veneciana.' },
  { question: '¿Organizáis eventos privados o comidas de grupo?', answer: 'Sí. Escríbenos mediante el formulario de contacto o llama al +39 041 520 4603 para explicarnos tu evento y consultar las opciones disponibles.' },
];

const faqCollections: Record<Language, FaqItem[]> = { it: faqsIt, en: faqsEn, fr: faqsFr, de: faqsDe, es: faqsEs };

const pageCopy: Record<Language, { seoTitle: string; seoDescription: string; kicker: string; title: string; intro: string; ctaTitle: string; ctaBody: string; contact: string; reserve: string; filtersLabel: string }> = {
  it: { seoTitle: 'Domande frequenti', seoDescription: 'Tutto quello che serve sapere su orari, prenotazioni, allergie ed eventi da Al Gobbo di Rialto.', kicker: 'Hai domande?', title: 'Domande frequenti', intro: 'Le risposte essenziali per organizzare la tua visita.', ctaTitle: 'Ti serve altro?', ctaBody: 'Scrivici o chiamaci: saremo felici di aiutarti.', contact: 'Scrivici', reserve: 'Prenota un tavolo', filtersLabel: 'Domande frequenti' },
  en: { seoTitle: 'Frequently asked questions', seoDescription: 'Everything you need to know about opening times, reservations, allergies and events at Al Gobbo di Rialto.', kicker: 'Have questions?', title: 'Frequently asked questions', intro: 'The essential answers for planning your visit.', ctaTitle: 'Still need help?', ctaBody: 'Message or call us — we will be happy to help.', contact: 'Contact us', reserve: 'Book a table', filtersLabel: 'Frequently asked questions' },
  fr: { seoTitle: 'Questions fréquentes', seoDescription: 'Tout savoir sur les horaires, les réservations, les allergies et les événements chez Al Gobbo di Rialto.', kicker: 'Une question ?', title: 'Questions fréquentes', intro: 'Les réponses essentielles pour préparer votre visite.', ctaTitle: 'Besoin d’aide ?', ctaBody: 'Écrivez-nous ou appelez-nous, nous vous répondrons avec plaisir.', contact: 'Nous contacter', reserve: 'Réserver une table', filtersLabel: 'Questions fréquentes' },
  de: { seoTitle: 'Häufige Fragen', seoDescription: 'Alles Wichtige zu Öffnungszeiten, Reservierungen, Allergien und Veranstaltungen im Al Gobbo di Rialto.', kicker: 'Noch Fragen?', title: 'Häufige Fragen', intro: 'Die wichtigsten Antworten für Ihren Besuch.', ctaTitle: 'Weitere Hilfe benötigt?', ctaBody: 'Schreiben Sie uns oder rufen Sie an – wir helfen Ihnen gern.', contact: 'Kontakt', reserve: 'Tisch reservieren', filtersLabel: 'Häufige Fragen' },
  es: { seoTitle: 'Preguntas frecuentes', seoDescription: 'Todo lo que necesitas saber sobre horarios, reservas, alergias y eventos en Al Gobbo di Rialto.', kicker: '¿Tienes preguntas?', title: 'Preguntas frecuentes', intro: 'Las respuestas esenciales para preparar tu visita.', ctaTitle: '¿Necesitas más ayuda?', ctaBody: 'Escríbenos o llámanos; estaremos encantados de ayudarte.', contact: 'Contactar', reserve: 'Reservar una mesa', filtersLabel: 'Preguntas frecuentes' },
};

function AccordionItem({ item, index }: { item: FaqItem; index: number }) {
  const [open, setOpen] = useState(false);
  const contentId = useId();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="overflow-hidden border-t border-venetian-brown/20 last:border-b dark:border-white/15"
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex min-h-20 w-full items-center justify-between gap-4 bg-transparent py-5 text-left transition-colors hover:text-venetian-terracotta"
        aria-expanded={open}
        aria-controls={contentId}
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
            id={contentId}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-7 pl-10 pr-12 text-sm leading-7 text-venetian-brown/70 sm:pl-12 sm:text-base dark:text-white/60">
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
  const faqs = faqCollections[language];
  const text = pageCopy[language];
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
        title={text.seoTitle}
        canonical="/faq"
        description={text.seoDescription}
        structuredData={faqSchema}
      />

      <div className="min-h-screen bg-[#f7f3eb] pb-20 pt-[84px] dark:bg-venetian-brown">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-7 sm:py-24">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10 border-t border-venetian-brown pt-6 text-left dark:border-white sm:mb-16 sm:pt-7"
          >
            <p className="editorial-kicker">{text.kicker}</p>
            <h1 className="mt-4 max-w-[11ch] font-serif text-5xl font-semibold leading-[0.86] text-venetian-brown dark:text-white sm:mt-5 sm:text-8xl">{text.title}</h1>
            <p className="mt-5 max-w-xl text-sm leading-6 text-venetian-brown/70 dark:text-white/70 sm:mt-7 sm:text-base sm:leading-7">{text.intro}</p>
          </motion.div>

          {/* Accordion */}
          <div aria-label={text.filtersLabel}>
            {faqs.map((item, index) => (
              <AccordionItem key={index} item={item} index={index} />
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-14 bg-venetian-terracotta p-7 text-center text-white sm:mt-20 sm:p-12"
          >
            <h2 className="mb-3 font-serif text-4xl font-semibold sm:text-5xl">
              {text.ctaTitle}
            </h2>
            <p className="mb-7 text-sm text-white/70 sm:text-base">
              {text.ctaBody}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex min-h-12 items-center justify-center bg-white px-6 text-xs font-bold uppercase tracking-[0.14em] text-venetian-terracotta hover:bg-venetian-gold hover:text-venetian-brown"
              >
                {text.contact}
              </Link>
              <Link
                to="/book"
                className="inline-flex min-h-12 items-center justify-center border border-white/35 px-6 text-xs font-bold uppercase tracking-[0.14em] text-white hover:border-white"
              >
                {text.reserve}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
