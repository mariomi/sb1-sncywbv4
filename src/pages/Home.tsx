import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hero } from '../components/Hero';
import { Gallery } from '../components/Gallery';
import { PageTransition } from '../components/PageTransition';
import { useLanguage } from '../lib/i18n';
import { Fish, BookOpen, MapPin, Star, Phone } from 'lucide-react';
import img2962 from '../Img/G1/IMG_2962.JPEG';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: 'easeOut' }
  })
};

export function Home() {
  const { language } = useLanguage();

  const storyItems = language === 'it'
    ? [
        { icon: Fish, title: 'Pesce dal Mercato di Rialto', description: 'Ogni mattina scegliamo il pescato più fresco al mercato ittico del Rialto, a 200 metri dalla nostra cucina.' },
        { icon: BookOpen, title: 'Ricette Tramandate da 70 Anni', description: 'Bigoli in salsa, sarde in saor, risotto di gò — autentiche ricette veneziane custodite dalla nostra famiglia.' },
        { icon: MapPin, title: 'Nel Cuore di Venezia', description: 'A pochi passi dal Ponte di Rialto, in San Polo 649. Raggiungibile a piedi, in vaporetto o in gondola.' }
      ]
    : [
        { icon: Fish, title: 'Fish from the Rialto Market', description: 'Every morning we choose the freshest catch at the Rialto fish market, 200 metres from our kitchen.' },
        { icon: BookOpen, title: 'Recipes Passed Down 70 Years', description: 'Bigoli in salsa, sarde in saor, risotto di gò — authentic Venetian recipes preserved by our family.' },
        { icon: MapPin, title: 'In the Heart of Venice', description: 'Steps from the Rialto Bridge, at San Polo 649. Reach us on foot, by vaporetto, or by gondola.' }
      ];

  const testimonials = language === 'it'
    ? [
        { text: 'Il miglior pasto veneziano del nostro viaggio. Le sarde in saor erano straordinarie, come le farebbe una nonna veneziana. Torneremo sicuramente.', author: 'James & Laura', origin: 'Londra, UK', stars: 5 },
        { text: 'Autentico, caldo, indimenticabile. Il risotto di mare era una poesia. Il personale ci ha fatto sentire a casa fin dal primo momento.', author: 'Sophie M.', origin: 'Parigi, Francia', stars: 5 },
        { text: 'Siamo venuti tre sere di fila — questo la dice lunga. Il fritto misto era il migliore di tutta Italia. Consigliatissimo!', author: 'Marco & Anna', origin: 'Milano, Italia', stars: 5 }
      ]
    : [
        { text: 'The best Venetian meal of our entire trip. The sarde in saor were extraordinary — just like a Venetian grandma would make them. We will definitely be back.', author: 'James & Laura', origin: 'London, UK', stars: 5 },
        { text: 'Authentic, warm, and unforgettable. The risotto di mare was a poem. The staff made us feel at home from the very first moment.', author: 'Sophie M.', origin: 'Paris, France', stars: 5 },
        { text: 'We ate here three evenings in a row — that says everything. The fritto misto was the best we had in all of Italy. Highly recommended!', author: 'Marco & Anna', origin: 'Milan, Italy', stars: 5 }
      ];

  return (
    <PageTransition>
      <Hero />

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
              <span className="inline-block text-venetian-gold text-sm font-semibold tracking-widest uppercase mb-4">
                {language === 'it' ? 'La Nostra Storia' : 'Our Story'}
              </span>
              <h2 className="text-4xl sm:text-5xl font-serif text-venetian-brown dark:text-venetian-sandstone mb-6 leading-tight">
                {language === 'it'
                  ? 'Un Angolo di Venezia\nche Non Cambia Mai'
                  : 'A Corner of Venice\nThat Never Changes'}
              </h2>
              <div className="w-12 h-0.5 bg-venetian-gold mb-8" />
              <div className="space-y-5 text-venetian-brown/75 dark:text-venetian-sandstone/75 text-lg leading-relaxed">
                <p>
                  {language === 'it'
                    ? 'Nel 1955 una piccola osteria aprì le porte a San Polo 649 — a due passi dal Ponte di Rialto, nel cuore pulsante di Venezia. Tre generazioni dopo, Al Gobbo di Rialto è ancora qui, a cucinare le stesse ricette, ad accogliere gli ospiti come fossero di famiglia.'
                    : 'In 1955, a small osteria opened its doors at San Polo 649 — steps from the Rialto Bridge, in the very heart of Venice. Three generations later, Al Gobbo di Rialto is still here, cooking the same recipes, welcoming guests as if they were family.'}
                </p>
                <p>
                  {language === 'it'
                    ? "Osserviamo le maree della laguna da oltre settant'anni. Abbiamo visto la città cambiare, ma la nostra cucina è rimasta fedele: materie prime locali, cotture oneste, i sapori inconfondibili della tradizione veneziana."
                    : "We've watched the tides of the lagoon for over seventy years. The city has changed, but our kitchen has stayed true: local ingredients, honest cooking, the unmistakable flavors of the Venetian tradition."}
                </p>
              </div>
              <motion.div
                className="mt-10"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-venetian-gold font-semibold hover:gap-4 transition-all duration-300"
                >
                  {language === 'it' ? 'Scopri la nostra storia' : 'Discover our history'}
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
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-venetian-brown/30 to-transparent" />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-6 -left-6 bg-venetian-gold text-venetian-brown rounded-xl px-5 py-3 shadow-xl font-serif text-center">
                <p className="text-3xl font-bold leading-none">1955</p>
                <p className="text-xs font-medium tracking-wide mt-1 opacity-80">
                  {language === 'it' ? 'Dal' : 'Since'}
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
            <span className="inline-block text-venetian-gold text-sm font-semibold tracking-widest uppercase mb-4">
              {language === 'it' ? 'Perché Al Gobbo' : 'Why Al Gobbo'}
            </span>
            <h2 className="text-4xl sm:text-5xl font-serif text-venetian-brown dark:text-venetian-sandstone">
              {language === 'it' ? 'I Motivi per Cui i Nostri Ospiti Tornano' : 'The Reasons Our Guests Return'}
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
                  <p className="text-venetian-brown/65 dark:text-venetian-sandstone/65 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
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
            <span className="inline-block text-venetian-gold text-sm font-semibold tracking-widest uppercase mb-4">
              {language === 'it' ? 'Le Voci dei Nostri Ospiti' : 'Voices of Our Guests'}
            </span>
            <h2 className="text-4xl sm:text-5xl font-serif text-white">
              {language === 'it' ? 'Cosa Dicono di Noi' : 'What People Say About Us'}
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
                <p className="text-venetian-sandstone/85 leading-relaxed text-base flex-1 italic mb-6">
                  "{t.text}"
                </p>
                <div className="border-t border-white/10 pt-4">
                  <p className="font-semibold text-white">{t.author}</p>
                  <p className="text-venetian-sandstone/50 text-sm">{t.origin}</p>
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
              className="inline-flex items-center gap-2 text-venetian-sandstone/60 hover:text-venetian-gold transition-colors text-sm"
            >
              {language === 'it' ? 'Leggi tutte le recensioni su TripAdvisor' : 'Read all reviews on TripAdvisor'}
              <span>→</span>
            </a>
          </motion.div>
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
              {language === 'it' ? 'Il Tuo Tavolo a Venezia Ti Aspetta' : 'Your Table in Venice Is Waiting'}
            </h2>
            <div className="w-16 h-0.5 bg-venetian-gold mx-auto mb-6" />
            <p className="text-venetian-brown/70 dark:text-venetian-sandstone/70 text-lg mb-10">
              {language === 'it'
                ? 'Pranzo e cena, tutti i giorni tranne il martedì. Prenota online in 60 secondi.'
                : 'Lunch and dinner, every day except Tuesday. Book online in 60 seconds.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/reserve"
                  className="inline-block bg-venetian-gold text-venetian-brown font-bold text-lg px-10 py-4 rounded-xl shadow-lg shadow-venetian-gold/30 hover:bg-venetian-gold/90 transition-colors"
                >
                  {language === 'it' ? 'Prenota Ora' : 'Book Now'}
                </Link>
              </motion.div>
              <a
                href="tel:+390415204603"
                className="inline-flex items-center gap-2 text-venetian-brown/70 dark:text-venetian-sandstone/70 hover:text-venetian-gold transition-colors font-medium"
              >
                <Phone className="w-4 h-4" />
                <span>{language === 'it' ? 'oppure chiamaci' : 'or call us'}</span>
                <span className="font-semibold text-venetian-brown dark:text-venetian-sandstone">+39 041 520 4603</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
}
