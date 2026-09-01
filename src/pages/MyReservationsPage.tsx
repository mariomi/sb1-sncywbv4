import { motion } from 'framer-motion';
import { CalendarCheck, Mail, Phone, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { SEOHead } from '../components/SEOHead';
import img2939 from '../Img/G1/IMG_2939.webp';

export function MyReservationsPage() {
  return (
    <PageTransition>
      <SEOHead title="Gestisci la prenotazione" canonical="/my-reservations" noindex />
      <div className="min-h-screen bg-venetian-sandstone/20 pt-24 pb-20">
        <section className="relative h-[30vh] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${img2939})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-venetian-brown/70 to-venetian-brown/95" />
          <div className="relative h-full flex items-center justify-center text-center px-4">
            <div>
              <h1 className="text-4xl sm:text-5xl font-serif text-white mb-3">
                Gestisci la prenotazione
              </h1>
              <p className="text-venetian-sandstone text-lg">
                Un accesso privato, direttamente dalla tua email
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-7 sm:p-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-14 h-14 rounded-full bg-venetian-gold/15 flex items-center justify-center mb-6">
              <ShieldCheck className="w-7 h-7 text-venetian-gold" />
            </div>
            <h2 className="font-serif text-2xl text-venetian-brown mb-3">
              Apri il link nella conferma
            </h2>
            <p className="text-venetian-brown/75 leading-relaxed mb-6">
              Per proteggere i tuoi dati non mostriamo prenotazioni cercando un semplice indirizzo email.
              Usa il link personale presente nell&apos;email di conferma per vedere i dettagli e cancellare
              in sicurezza.
            </p>

            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3 rounded-xl bg-venetian-sandstone/25 p-4">
                <Mail className="w-5 h-5 text-venetian-gold mt-0.5 shrink-0" />
                <p className="text-sm text-venetian-brown/75">
                  Controlla anche la cartella spam. L&apos;oggetto contiene la conferma della prenotazione.
                </p>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-venetian-sandstone/25 p-4">
                <Phone className="w-5 h-5 text-venetian-gold mt-0.5 shrink-0" />
                <p className="text-sm text-venetian-brown/75">
                  Non trovi l&apos;email? Chiamaci al{' '}
                  <a className="font-medium text-venetian-brown hover:text-venetian-gold" href="tel:+390415204603">
                    +39 041 520 4603
                  </a>.
                </p>
              </div>
            </div>

            <Link
              to="/book"
              className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-venetian-gold px-4 text-sm font-medium text-venetian-brown shadow transition-colors hover:bg-venetian-gold/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-venetian-brown"
            >
              <CalendarCheck className="w-4 h-4 mr-2" />
              Fai una nuova prenotazione
            </Link>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
