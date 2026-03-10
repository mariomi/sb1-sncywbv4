import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Phone, Mail, ChefHat, Star, Fish } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';
import { Link } from 'react-router-dom';
import img2960 from '../Img/G1/IMG_2960.JPEG';
import img2962 from '../Img/G1/IMG_2962.JPEG';
import img2985 from '../Img/food/IMG_2985.JPEG';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const stats = [
  { icon: ChefHat, value: '1955', label: 'Anno di fondazione' },
  { icon: Star, value: "2025", label: "Travellers' Choice TripAdvisor" },
  { icon: Fish, value: 'Ogni mattina', label: 'Pesce dal Mercato di Rialto' },
];

const timeline = [
  {
    year: '1541',
    title: 'Il Gobbo di Rialto',
    text: 'La statua del Gobbo viene collocata in Campo San Giacomo di Rialto, diventando il simbolo più riconoscibile del cuore mercantile di Venezia. Per secoli il Gobbo veglia sul mercato, sui canali e sulla vita quotidiana della città — testimone silenzioso di ogni voce, ogni contrattazione, ogni storia.'
  },
  {
    year: '1955',
    title: 'Le Origini',
    text: 'Il ristorante apre i battenti a San Polo 649, a pochi passi dal Ponte di Rialto e dall\'antico Ramo della Dogana da Terra. Il nome omaggia il Gobbo di Rialto: come lui, questo locale nasce per restare — radicato nel quartiere, fedele alla cucina della laguna.'
  },
  {
    year: '2022',
    title: 'Un Riconoscimento Istituzionale',
    text: 'Il Conservatorio di Musica "Benedetto Marcello" di Venezia sceglie Al Gobbo di Rialto per ospitare la cena ufficiale del Premio Malanotte, confermando il locale come punto di riferimento della ristorazione veneziana per eventi istituzionali e gruppi.'
  },
  {
    year: 'Oggi',
    title: 'Tradizione e Rinnovamento',
    text: "Dopo una recente ristrutturazione, Al Gobbo si presenta con un volto nuovo senza mai perdere l'anima. Cucina veneta autentica, pizza, pesce fresco della laguna ogni mattina dal mercato di Rialto — a duecento metri dalla porta. Travellers' Choice TripAdvisor 2025."
  }
];

export function AboutPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-venetian-sandstone/20 dark:bg-venetian-brown/95 pt-24">

        {/* ── Hero ────────────────────────────────────────────────── */}
        <motion.section
          className="relative h-[65vh] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${img2960})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/50 to-black/80" />
          <div className="relative h-full flex items-center justify-center text-center px-4">
            <div className="max-w-3xl">
              <motion.p
                className="text-venetian-gold text-sm font-semibold tracking-widest uppercase mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Dal 1955 · San Polo, Venezia
              </motion.p>
              <motion.h1
                className="text-5xl sm:text-6xl md:text-7xl font-serif text-white mb-6"
                {...fadeIn}
              >
                La Nostra Storia
              </motion.h1>
              <motion.div
                className="w-16 h-px bg-venetian-gold mx-auto mb-6"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.5 }}
              />
              <motion.p
                className="text-xl text-venetian-sandstone/90"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Settant'anni di cucina veneziana autentica nel cuore di Venezia
              </motion.p>
            </div>
          </div>
        </motion.section>

        {/* ── Stats ──────────────────────────────────────────────── */}
        <motion.section
          className="relative -mt-16 z-10 px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="bg-white/95 dark:bg-venetian-brown/80 rounded-2xl p-6 text-center shadow-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.04, y: -4 }}
                >
                  <stat.icon className="w-7 h-7 mx-auto mb-3 text-venetian-gold" />
                  <p className="text-2xl font-serif text-venetian-brown dark:text-venetian-sandstone mb-1">{stat.value}</p>
                  <p className="text-xs text-venetian-brown/60 dark:text-venetian-sandstone/60 font-medium leading-tight">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ── Heritage ───────────────────────────────────────────── */}
        <motion.section
          className="py-24 px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <span className="text-venetian-gold text-sm font-semibold tracking-widest uppercase">Il Nostro Patrimonio</span>
                <h2 className="text-4xl font-serif text-venetian-brown dark:text-venetian-sandstone mt-3 mb-6">
                  Settant'anni di Cucina Veneziana
                </h2>
                <div className="w-12 h-0.5 bg-venetian-gold mb-7" />
                <div className="space-y-5 text-lg text-venetian-brown/75 dark:text-venetian-sandstone/70 leading-relaxed">
                  <p>
                    Aperto nel 1955 a San Polo 649, Al Gobbo di Rialto prende il nome
                    dall'iconico Gobbo — la statua collocata in Campo San Giacomo di Rialto
                    nel 1541, simbolo per secoli del cuore mercantile di Venezia. Come lei,
                    anche noi siamo rimasti.
                  </p>
                  <p>
                    Quello che era un semplice locale di quartiere si è affermato come una
                    delle tavole più apprezzate di Venezia, senza mai tradire la sua anima:
                    cucina veneziana onesta, ingredienti freschi della laguna, ospitalità
                    autentica.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="relative"
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl group">
                  <img
                    src={img2962}
                    alt="Sala del Ristorante Al Gobbo di Rialto"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-venetian-brown/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* ── Timeline ───────────────────────────────────────────── */}
        <section className="py-24 bg-venetian-brown/5 dark:bg-venetian-brown/80 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center mb-16"
            >
              <span className="text-venetian-gold text-sm font-semibold tracking-widest uppercase">La Nostra Linea del Tempo</span>
              <h2 className="text-4xl font-serif text-venetian-brown dark:text-venetian-sandstone mt-3">
                Settant'anni di Storia
              </h2>
            </motion.div>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-8 top-0 bottom-0 w-px bg-venetian-gold/30 hidden md:block" />

              <div className="space-y-12">
                {timeline.map((item, i) => (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="relative md:pl-24"
                  >
                    {/* Year badge */}
                    <div className="hidden md:flex absolute left-0 top-0 w-16 h-16 rounded-full bg-venetian-gold items-center justify-center shadow-lg">
                      <span className="text-venetian-brown font-bold text-xs text-center leading-tight px-1">{item.year}</span>
                    </div>
                    <div className="bg-white/90 dark:bg-venetian-brown/60 rounded-2xl p-6 shadow-md">
                      <span className="md:hidden inline-block text-venetian-gold font-bold text-sm mb-2">{item.year}</span>
                      <h3 className="text-xl font-serif text-venetian-brown dark:text-venetian-sandstone mb-2">{item.title}</h3>
                      <p className="text-venetian-brown/70 dark:text-venetian-sandstone/65 leading-relaxed">{item.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Philosophy ─────────────────────────────────────────── */}
        <motion.section
          className="py-24 px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div
                className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl md:order-2 group"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <img
                  src={img2985}
                  alt="I piatti del Ristorante Al Gobbo di Rialto"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-venetian-brown/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>

              <motion.div
                className="md:order-1"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <span className="text-venetian-gold text-sm font-semibold tracking-widest uppercase">La Nostra Filosofia</span>
                <h2 className="text-4xl font-serif text-venetian-brown dark:text-venetian-sandstone mt-3 mb-6">
                  Cucina Veneziana Onesta
                </h2>
                <div className="w-12 h-0.5 bg-venetian-gold mb-7" />
                <div className="space-y-5 text-lg text-venetian-brown/75 dark:text-venetian-sandstone/70 leading-relaxed">
                  <p>
                    Crediamo nella cucina autentica. Ogni mattina scegliamo il pescato più fresco
                    al mercato di Rialto, a duecento metri dalla nostra porta. Ogni pasta viene
                    fatta a mano. Ogni ricetta rispetta l'originale tramandato per generazioni.
                  </p>
                  <p>
                    Non inseguiamo mode. Cuciniamo Venezia — quella vera, quella che i veneziani
                    doc hanno mangiato per secoli. La presentiamo con cura, te la serviamo con
                    calore.
                  </p>
                </div>
                <motion.div
                  className="mt-10"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    to="/reserve"
                    className="inline-block bg-venetian-gold text-venetian-brown font-bold px-8 py-3 rounded-xl hover:bg-venetian-gold/90 transition-colors shadow-lg"
                  >
                    Prenota il Tuo Tavolo
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* ── Contact Info ───────────────────────────────────────── */}
        <motion.section
          className="py-20 px-4 sm:px-6 lg:px-8 bg-venetian-brown/5 dark:bg-venetian-brown/80"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/95 dark:bg-venetian-brown/60 rounded-2xl p-8 shadow-xl">
              <h2 className="text-3xl font-serif text-venetian-brown dark:text-venetian-sandstone mb-8 text-center">Vieni a Trovarci</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { icon: MapPin, title: 'Indirizzo', content: 'Sestiere San Polo 649\n30125 Venezia, Italia' },
                  { icon: Clock, title: 'Orari', content: 'Aperto tutti i giorni: 11:00 – 23:00\nChiuso il martedì' },
                  { icon: Phone, title: 'Telefono', content: '+39 041 520 4603' },
                  { icon: Mail, title: 'Email', content: 'info@ristorantealgobbodirialto.it' }
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <item.icon className="w-6 h-6 mx-auto mb-3 text-venetian-gold" />
                    <h3 className="text-lg font-serif text-venetian-brown dark:text-venetian-sandstone mb-2">{item.title}</h3>
                    <p className="text-venetian-brown/65 dark:text-venetian-sandstone/60 whitespace-pre-line text-sm leading-relaxed">{item.content}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

      </div>
    </PageTransition>
  );
}
