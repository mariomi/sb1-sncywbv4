import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { motion } from 'framer-motion';
import { Hero } from '../components/Hero';
import { Gallery } from '../components/Gallery';
import { PageTransition } from '../components/PageTransition';
import { translations, useLanguage, type Language } from '../lib/i18n';
import { Fish, BookOpen, MapPin, Star, Phone, Navigation } from 'lucide-react';
import img2962 from '../Img/G1/IMG_2962.webp';
import cuisineImage from '../Img/food/IMG_2980.webp';
import { SocialProof } from '../components/SocialProof';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: 'easeOut' }
  })
};

const reviewCopy: Record<Language, {
  badge: string;
  title: string;
  link: string;
  items: { text: string; author: string; origin: string; stars: number }[];
}> = {
  en: {
    badge: 'Verified guest feedback',
    title: 'What Diners Highlight',
    link: 'Read all reviews on Tripadvisor',
    items: [
      { text: 'Guests regularly highlight the fresh seafood, pasta and unmistakably Venetian flavours.', author: 'Verified diner reviews', origin: 'TheFork', stars: 5 },
      { text: 'Warm, attentive service is one of the themes that appears most often in guest experiences.', author: 'Verified diner reviews', origin: 'TheFork', stars: 5 },
      { text: 'The peaceful atmosphere and outdoor garden are praised by couples, families and groups.', author: 'Guest reviews', origin: 'Google and Tripadvisor', stars: 5 },
    ],
  },
  it: {
    badge: 'Esperienze verificate',
    title: 'Cosa Apprezzano gli Ospiti',
    link: 'Leggi tutte le recensioni su Tripadvisor',
    items: [
      { text: 'Gli ospiti citano spesso la freschezza dei piatti di pesce, la pasta e i sapori veneziani.', author: 'Recensioni verificate', origin: 'TheFork', stars: 5 },
      { text: 'Servizio cordiale e attento: uno dei temi più ricorrenti nelle esperienze condivise dai clienti.', author: 'Recensioni verificate', origin: 'TheFork', stars: 5 },
      { text: 'L’atmosfera tranquilla e il giardino esterno sono apprezzati da coppie, famiglie e gruppi.', author: 'Recensioni degli ospiti', origin: 'Google e Tripadvisor', stars: 5 },
    ],
  },
  fr: {
    badge: 'Avis clients vérifiés',
    title: 'Ce que nos hôtes apprécient',
    link: 'Lire les avis sur Tripadvisor',
    items: [
      { text: 'Les clients apprécient particulièrement les poissons, les pâtes et les saveurs vénitiennes.', author: 'Avis vérifiés', origin: 'TheFork', stars: 5 },
      { text: 'Un service chaleureux et attentif revient souvent dans les expériences partagées.', author: 'Avis vérifiés', origin: 'TheFork', stars: 5 },
      { text: 'L’atmosphère paisible et le jardin séduisent les couples, les familles et les groupes.', author: 'Avis clients', origin: 'Google et Tripadvisor', stars: 5 },
    ],
  },
  de: {
    badge: 'Verifizierte Gästestimmen',
    title: 'Was unsere Gäste schätzen',
    link: 'Bewertungen auf Tripadvisor lesen',
    items: [
      { text: 'Gäste loben besonders Fisch, Pasta und die typisch venezianischen Aromen.', author: 'Verifizierte Bewertungen', origin: 'TheFork', stars: 5 },
      { text: 'Herzlicher, aufmerksamer Service gehört zu den häufigsten Rückmeldungen.', author: 'Verifizierte Bewertungen', origin: 'TheFork', stars: 5 },
      { text: 'Die ruhige Atmosphäre und der Garten gefallen Paaren, Familien und Gruppen.', author: 'Gästebewertungen', origin: 'Google und Tripadvisor', stars: 5 },
    ],
  },
  es: {
    badge: 'Opiniones verificadas',
    title: 'Lo que valoran nuestros clientes',
    link: 'Leer opiniones en Tripadvisor',
    items: [
      { text: 'Los clientes destacan el pescado, la pasta y los sabores genuinamente venecianos.', author: 'Opiniones verificadas', origin: 'TheFork', stars: 5 },
      { text: 'El servicio cordial y atento es uno de los comentarios más frecuentes.', author: 'Opiniones verificadas', origin: 'TheFork', stars: 5 },
      { text: 'El ambiente tranquilo y el jardín gustan a parejas, familias y grupos.', author: 'Opiniones de clientes', origin: 'Google y Tripadvisor', stars: 5 },
    ],
  },
};

const sinceLabels: Record<Language, string> = {
  en: 'Since', it: 'Dal', fr: 'Depuis', de: 'Seit', es: 'Desde',
};

const extraCopy: Record<Language, {
  cuisineBadge: string; cuisineTitle: string; cuisineBody: string; cuisineLink: string;
  locationBadge: string; locationTitle: string; locationBody: string; locationLink: string; directions: string;
}> = {
  en: { cuisineBadge: 'Taste Venice', cuisineTitle: 'Cuisine Shaped by the Lagoon', cuisineBody: 'Sarde in saor, baccalà mantecato, bigoli in salsa and seafood risotto tell the story of Venice through simple ingredients and distinctive flavours.', cuisineLink: 'Discover Venetian cuisine', locationBadge: 'Find us', locationTitle: 'In the Historic Rialto District', locationBody: 'San Polo 649, near the bridge and market area. Check the route before setting off through Venice’s calli.', locationLink: 'See location details', directions: 'Open directions' },
  it: { cuisineBadge: 'Assapora Venezia', cuisineTitle: 'Una Cucina Nata in Laguna', cuisineBody: 'Sarde in saor, baccalà mantecato, bigoli in salsa e risotto di mare raccontano Venezia attraverso ingredienti semplici e sapori riconoscibili.', cuisineLink: 'Scopri la cucina veneziana', locationBadge: 'Dove siamo', locationTitle: 'Nel Cuore Storico di Rialto', locationBody: 'San Polo 649, vicino al ponte e al mercato. Controlla il percorso prima di partire tra le calli veneziane.', locationLink: 'Vedi tutti i dettagli', directions: 'Apri le indicazioni' },
  fr: { cuisineBadge: 'Goûter Venise', cuisineTitle: 'Une Cuisine Née dans la Lagune', cuisineBody: 'Sarde in saor, baccalà mantecato, bigoli in salsa et risotto aux fruits de mer racontent Venise avec des ingrédients simples et des saveurs uniques.', cuisineLink: 'Découvrir la cuisine vénitienne', locationBadge: 'Nous trouver', locationTitle: 'Dans le Quartier Historique du Rialto', locationBody: 'San Polo 649, près du pont et du marché. Consultez l’itinéraire avant de parcourir les calli.', locationLink: 'Voir les informations', directions: 'Ouvrir l’itinéraire' },
  de: { cuisineBadge: 'Venedig schmecken', cuisineTitle: 'Eine Küche aus der Lagune', cuisineBody: 'Sarde in saor, Baccalà mantecato, Bigoli in salsa und Meeresfrüchterisotto erzählen Venedig durch klare Zutaten und unverwechselbare Aromen.', cuisineLink: 'Venezianische Küche entdecken', locationBadge: 'Anfahrt', locationTitle: 'Im Historischen Rialtoviertel', locationBody: 'San Polo 649, nahe Brücke und Markt. Prüfen Sie den Weg, bevor Sie durch Venedigs Gassen starten.', locationLink: 'Standort ansehen', directions: 'Route öffnen' },
  es: { cuisineBadge: 'Saborea Venecia', cuisineTitle: 'Una Cocina Nacida en la Laguna', cuisineBody: 'Sarde in saor, baccalà mantecato, bigoli in salsa y risotto de marisco cuentan Venecia con ingredientes sencillos y sabores propios.', cuisineLink: 'Descubrir la cocina veneciana', locationBadge: 'Cómo llegar', locationTitle: 'En el Barrio Histórico de Rialto', locationBody: 'San Polo 649, cerca del puente y del mercado. Consulta la ruta antes de recorrer las calles de Venecia.', locationLink: 'Ver la ubicación', directions: 'Abrir indicaciones' },
};

export function Home() {
  const { language } = useLanguage();
  const copy = translations[language];
  const storyIcons = [Fish, BookOpen, MapPin];
  const storyItems = copy.whyUs.items.map((item, index) => ({ ...item, icon: storyIcons[index] }));
  const reviews = reviewCopy[language];
  const testimonials = reviews.items;
  const extra = extraCopy[language];

  return (
    <PageTransition>
      <SEOHead
        canonical="/"
        description="Ristorante storico a Venezia dal 1955. Cucina veneziana autentica: pesce fresco della laguna, risotti, paste fatte in casa e pizze artigianali. Prenota il tuo tavolo online – San Polo 649."
      />
      <Hero />
      <SocialProof />

      {/* ── Story Section ─────────────────────────────────────────── */}
      <section id="story-section" className="py-24 bg-white dark:bg-venetian-brown/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block text-[#765700] dark:text-venetian-gold text-sm font-semibold tracking-widest uppercase mb-4">
                {copy.story.badge}
              </span>
              <h2 className="text-4xl sm:text-5xl font-serif text-venetian-brown dark:text-venetian-sandstone mb-6 leading-tight">
                {copy.story.title}
              </h2>
              <div className="w-12 h-0.5 bg-venetian-gold mb-8" />
              <div className="space-y-5 text-venetian-brown/75 dark:text-venetian-sandstone/75 text-lg leading-relaxed">
                <p>
                  {copy.story.body1}
                </p>
                <p>
                  {copy.story.body2}
                </p>
              </div>
              <motion.div
                className="mt-10"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to="/our-story"
                  className="inline-flex items-center gap-2 text-[#765700] dark:text-venetian-gold font-semibold hover:gap-4 transition-all duration-300"
                >
                  {copy.story.cta}
                  <span className="text-lg">→</span>
                </Link>
              </motion.div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={img2962}
                  alt="Ristorante Al Gobbo di Rialto - sala"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-venetian-brown/30 to-transparent" />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-6 -left-6 bg-venetian-gold text-venetian-brown rounded-xl px-5 py-3 shadow-xl font-serif text-center">
                <p className="text-3xl font-bold leading-none">1955</p>
                <p className="text-xs font-semibold tracking-wide mt-1 text-[#4A3329]">
                  {sinceLabels[language]}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Why Us ────────────────────────────────────────────────── */}
      <section className="py-24 bg-venetian-brown/5 dark:bg-venetian-brown">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-[#765700] dark:text-venetian-gold text-sm font-semibold tracking-widest uppercase mb-4">
              {copy.whyUs.badge}
            </span>
            <h2 className="text-4xl sm:text-5xl font-serif text-venetian-brown dark:text-venetian-sandstone">
              {copy.whyUs.title}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {storyItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  variants={fadeUp}
                  className="bg-white dark:bg-venetian-brown/60 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-venetian-gold/10 flex items-center justify-center mb-6 group-hover:bg-venetian-gold/20 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-venetian-gold" />
                  </div>
                  <h3 className="text-xl font-serif text-venetian-brown dark:text-venetian-sandstone mb-3">
                    {item.title}
                  </h3>
                  <p className="text-venetian-brown/80 dark:text-venetian-sandstone/85 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white dark:bg-venetian-brown/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <img src={cuisineImage} alt="Venetian seafood dish at Al Gobbo di Rialto" loading="lazy" decoding="async" className="w-full aspect-[4/3] object-cover rounded-2xl shadow-xl" />
          <div>
            <span className="inline-block text-[#765700] dark:text-venetian-gold text-sm font-semibold tracking-widest uppercase mb-4">{extra.cuisineBadge}</span>
            <h2 className="text-4xl sm:text-5xl font-serif text-venetian-brown dark:text-venetian-sandstone mb-6">{extra.cuisineTitle}</h2>
            <p className="text-lg leading-relaxed text-venetian-brown/80 dark:text-venetian-sandstone/90 mb-8">{extra.cuisineBody}</p>
            <Link to="/venetian-cuisine" className="inline-flex items-center gap-2 text-[#765700] dark:text-venetian-gold font-semibold hover:gap-4 transition-all">{extra.cuisineLink}<span>→</span></Link>
          </div>
        </div>
      </section>

      {/* ── Gallery ───────────────────────────────────────────────── */}
      <Gallery />

      {/* ── Testimonials ──────────────────────────────────────────── */}
      <section className="py-24 bg-venetian-brown/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-[#F3D98B] text-sm font-semibold tracking-widest uppercase mb-4">
              {reviews.badge}
            </span>
            <h2 className="text-4xl sm:text-5xl font-serif text-white">
              {reviews.title}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeUp}
                className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 flex flex-col"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-venetian-gold text-venetian-gold" />
                  ))}
                </div>
                <p className="text-white leading-relaxed text-base flex-1 italic mb-6">
                  {t.text}
                </p>
                <div className="border-t border-white/10 pt-4">
                  <p className="font-semibold text-white">{t.author}</p>
                  <p className="text-white text-sm">{t.origin}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* TripAdvisor link */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-center mt-10"
          >
            <a
              href="https://www.tripadvisor.it/Restaurant_Review-g187870-d20083361-Reviews-Ristorante_Pizzeria_Al_Gobbo_di_Rialto-Venice_Veneto.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-venetian-sandstone/90 hover:text-white transition-colors text-sm"
            >
              {reviews.link}
              <span>→</span>
            </a>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white dark:bg-venetian-brown/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-venetian-sandstone/25 dark:bg-venetian-brown p-8 sm:p-12 grid lg:grid-cols-[1fr_auto] gap-10 items-center">
            <div>
              <span className="inline-block text-[#765700] dark:text-venetian-gold text-sm font-semibold tracking-widest uppercase mb-4">{extra.locationBadge}</span>
              <h2 className="text-4xl sm:text-5xl font-serif text-venetian-brown dark:text-venetian-sandstone mb-5">{extra.locationTitle}</h2>
              <p className="text-lg text-venetian-brown/80 dark:text-venetian-sandstone/90 max-w-2xl">{extra.locationBody}</p>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-56">
              <Link to="/location" className="rounded-xl bg-venetian-brown dark:bg-venetian-gold px-6 py-3.5 text-center font-semibold text-white dark:text-venetian-brown">{extra.locationLink}</Link>
              <a href="https://www.google.com/maps/dir/?api=1&destination=Al+Gobbo+di+Rialto,+San+Polo+649,+Venezia" target="_blank" rel="noopener noreferrer" data-track="click_directions" className="inline-flex items-center justify-center gap-2 rounded-xl border border-venetian-brown/20 dark:border-white/20 px-6 py-3.5 font-semibold text-venetian-brown dark:text-venetian-sandstone"><Navigation className="w-4 h-4" />{extra.directions}</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA Banner ──────────────────────────────────────── */}
      <section className="relative py-28 overflow-hidden bg-venetian-sandstone/20 dark:bg-venetian-brown/90">
        {/* subtle background pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #5C4033 1px, transparent 0)',
            backgroundSize: '28px 28px'
          }}
        />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl font-serif text-venetian-brown dark:text-venetian-sandstone mb-4">
              {copy.ctaBanner.title}
            </h2>
            <div className="w-16 h-0.5 bg-venetian-gold mx-auto mb-6" />
            <p className="text-venetian-brown/70 dark:text-venetian-sandstone/70 text-lg mb-10">
              {copy.ctaBanner.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/book"
                  className="inline-block bg-venetian-gold text-venetian-brown font-bold text-lg px-10 py-4 rounded-xl shadow-lg shadow-venetian-gold/30 hover:bg-venetian-gold/90 transition-colors"
                >
                  {copy.ctaBanner.reserve}
                </Link>
              </motion.div>
              <a
                href="tel:+390415204603"
                className="inline-flex items-center gap-2 text-venetian-brown/70 dark:text-venetian-sandstone/70 hover:text-venetian-gold transition-colors font-medium"
              >
                <Phone className="w-4 h-4" />
                <span>{copy.ctaBanner.orCall}</span>
                <span className="font-semibold text-venetian-brown dark:text-venetian-sandstone">+39 041 520 4603</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
}
